using Microsoft.AspNetCore.SignalR;
using MovieMatcher.Backend.Models;
using MovieMatcher.Backend.Services;
using SessionOptions = MovieMatcher.Backend.Models.SessionOptions;

namespace MovieMatcher.Backend.Hubs;

public class MovieMatcherHub(
    ISessionStorage sessionStorage,
    IMovieService movieService,
    ILogger<MovieMatcherHub> logger)
    : Hub
{
    public async Task StartSwipingAsync(string sessionId)
    {
        logger.LogDebug(
            "User {ConnectionId} is starting swiping for session {SessionId}",
            Context.ConnectionId, sessionId);

        var session = sessionStorage.Get(sessionId);
        if (session == null)
        {
            logger.LogWarning("Session {SessionId} not found", sessionId);
            throw new HubException("Session not found.");
        }

        if (session.HostConnectionId != Context.ConnectionId)
        {
            logger.LogWarning("User {ConnectionId} is not the host of session {SessionId}", Context.ConnectionId,
                sessionId);
            throw new HubException("You are not the host of this session.");
        }

        if (session.ConnectionIds.Count <= 1)
        {
            logger.LogWarning("Session {SessionId} only has one user", sessionId);
            throw new HubException("There must be at least two users in the session.");
        }

        var movies = await movieService.SearchMoviesAsync(
            new SearchMoviesParams
            {
                IncludeAdult = session.Options.IncludeAdult,
                StartYear = session.Options.StartYear,
                EndYear = session.Options.EndYear,
                GenreIds = session.Options.GenreIds,
                Page = session.CurrentPage
            });

        logger.LogDebug("Session {SessionId} has {MovieCount} movies queued for swiping", sessionId,
            movies.Results.Count);

        if (movies.Results.Count == 0)
        {
            logger.LogWarning("No movies found for session {SessionId}", sessionId);
            throw new HubException("No movies found.");
        }

        session.CurrentPage = movies.Page;
        session.TotalPages = movies.TotalPages;

        session.EnqueueMovies(movies.Results);

        foreach (var connectionId in session.ConnectionIds)
        {
            if (session.TryDequeueMovie(connectionId, out var movie))
            {
                await Clients.Client(connectionId).SendAsync("ReceiveMovie", movie);
            }
        }

        if (movies.Results.Count == 1)
        {
            logger.LogDebug("Only one movie found for session {SessionId}, notifying all clients", sessionId);
            await Clients.Group(sessionId).SendAsync("NoMoreMovies");
        }
    }

    public async Task SwipeMovieAsync(string sessionId, int movieId, bool isLiked)
    {
        logger.LogDebug("User {ConnectionId} swiped {SwipeType} on movie {MovieId} in session {SessionId}",
            Context.ConnectionId, isLiked ? "LIKE" : "DISLIKE", movieId, sessionId);

        var session = sessionStorage.Get(sessionId);
        if (session == null)
        {
            logger.LogWarning("Session {SessionId} not found for swipe action", sessionId);
            throw new HubException("Session not found.");
        }

        if (!session.ContainsConnection(Context.ConnectionId))
        {
            logger.LogWarning("User {ConnectionId} is not in session {SessionId}", Context.ConnectionId, sessionId);
            throw new HubException("You are not in this session.");
        }

        if (isLiked)
        {
            if (session.TryDetectNewMatch(movieId, Context.ConnectionId))
            {
                logger.LogDebug("Movie {MovieId} matched by all users in session {SessionId}", movieId, sessionId);
                await Clients.Group(sessionId).SendAsync("MatchFound", movieId);
            }
        }

        var movie = await session.GetNextMovieAsync(Context.ConnectionId, async page =>
        {
            var result = await movieService.SearchMoviesAsync(new SearchMoviesParams
            {
                IncludeAdult = session.Options.IncludeAdult,
                StartYear = session.Options.StartYear,
                EndYear = session.Options.EndYear,
                GenreIds = session.Options.GenreIds,
                Page = page
            });

            session.TotalPages = result.TotalPages;
            return result.Results;
        });

        if (movie != null)
        {
            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveMovie", movie);
        }
        else
        {
            await Clients.Client(Context.ConnectionId).SendAsync("NoMoreMovies");
        }
    }

    public async Task<string> CreateSessionAsync(SessionOptions options)
    {
        var session = sessionStorage.Create(Context.ConnectionId, options);

        await Groups.AddToGroupAsync(Context.ConnectionId, session.Id);

        logger.LogDebug("Session {SessionId} created by user {ConnectionId}", session.Id, Context.ConnectionId);

        return session.Id;
    }

    public async Task JoinSessionAsync(string sessionId)
    {
        logger.LogDebug(
            "User {ConnectionId} is attempting to join session {SessionId}",
            Context.ConnectionId,
            sessionId);

        var existingSession = sessionStorage.GetByConnectionId(Context.ConnectionId);

        if (existingSession != null)
        {
            logger.LogWarning(
                "User {ConnectionId} is already in session {SessionId}",
                Context.ConnectionId,
                existingSession.Id);
            throw new HubException($"User is already in session {existingSession.Id}.");
        }

        var session = sessionStorage.Get(sessionId);
        if (session == null)
        {
            logger.LogWarning(
                "User {ConnectionId} attempted to join a non-existent session {SessionId}",
                Context.ConnectionId,
                sessionId);
            throw new HubException($"Session {sessionId} not found.");
        }

        if (session.TryAddConnection(Context.ConnectionId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
            logger.LogDebug("User {ConnectionId} joined session {SessionId}", Context.ConnectionId, sessionId);
            await Clients.Group(sessionId).SendAsync("UserJoined", Context.ConnectionId);
        }
        else
        {
            logger.LogWarning(
                "User {ConnectionId} cannot join session",
                Context.ConnectionId);
            throw new HubException("User cannot join session.");
        }
    }

    public async Task LeaveSessionAsync()
    {
        var session = sessionStorage.GetByConnectionId(Context.ConnectionId);

        if (session == null)
        {
            logger.LogWarning(
                "User {ConnectionId} tried to leave a session, but is not in any session",
                Context.ConnectionId);
            throw new HubException("User is not in any session.");
        }

        var isHost = session.HostConnectionId == Context.ConnectionId;

        if (session.TryRemoveConnection(Context.ConnectionId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, session.Id);
            logger.LogDebug("User {ConnectionId} left session {SessionId}", Context.ConnectionId, session.Id);
            await Clients.Group(session.Id).SendAsync("UserLeft", Context.ConnectionId);
        }

        if (!isHost)
        {
            return;
        }

        await TerminateSessionAsync(session);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        logger.LogDebug("User {ConnectionId} disconnected. Cleaning up their session memberships",
            Context.ConnectionId);

        var session = sessionStorage.GetByConnectionId(Context.ConnectionId);

        if (session != null)
        {
            var isHost = session.HostConnectionId == Context.ConnectionId;

            if (session.TryRemoveConnection(Context.ConnectionId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, session.Id);
                logger.LogDebug("User {ConnectionId} left session {SessionId}", Context.ConnectionId, session.Id);
                await Clients.Group(session.Id).SendAsync("UserLeft", Context.ConnectionId);
            }

            if (isHost)
            {
                await TerminateSessionAsync(session);
            }
        }

        if (exception != null)
        {
            logger.LogError(exception, "User {ConnectionId} disconnected due to an error", Context.ConnectionId);
        }

        await base.OnDisconnectedAsync(exception);
    }

    private async Task TerminateSessionAsync(Session session)
    {
        await Clients.Group(session.Id).SendAsync("SessionTerminated", "Host has left the session.");

        foreach (var connId in session.ConnectionIds.ToList())
        {
            await Groups.RemoveFromGroupAsync(connId, session.Id);
        }

        logger.LogDebug("Session {SessionId} is empty or host left, removing it", session.Id);
        sessionStorage.Remove(session.Id);
    }
}