using Microsoft.AspNetCore.SignalR;
using MovieMatcher.Backend.Models;
using MovieMatcher.Backend.Services;
using SessionOptions = MovieMatcher.Backend.Models.SessionOptions;

namespace MovieMatcher.Backend.Hubs;

public class MovieMatcherHub(
    ISessionManager sessionManager,
    IMovieService movieService,
    ILogger<MovieMatcherHub> logger)
    : Hub
{
    public async Task StartSwipingAsync(string sessionId)
    {
        logger.LogDebug(
            "User {ConnectionId} is starting swiping for session {SessionId}",
            Context.ConnectionId, sessionId);

        var session = sessionManager.Get(sessionId);
        if (session == null)
        {
            logger.LogWarning("Session {SessionId} not found", sessionId);
            throw new HubException("Session not found.");
        }

        if (session.Options == null)
        {
            logger.LogWarning("Session {SessionId} has no configured options", sessionId);
            throw new HubException("Session options are not configured.");
        }

        var searchParams = new SearchMoviesParams
        {
            IncludeAdult = session.Options.IncludeAdult,
            Year = session.Options.Year,
            GenreIds = session.Options.GenreIds
        };

        var movies = await movieService.SearchMovies(searchParams);
        session.Movies = new Queue<Movie>(movies.Results);

        logger.LogDebug("Session {SessionId} has {MovieCount} movies queued for swiping", sessionId, movies.Results.Count);

        if (session.Movies.TryDequeue(out var movie))
        {
            await Clients.Group(sessionId).SendAsync("ReceiveMovie", movie);
        }
    }

    public async Task SwipeMovieAsync(string sessionId, string movieId, bool isLiked)
    {
        logger.LogDebug("User {ConnectionId} swiped {SwipeType} on movie {MovieId} in session {SessionId}", 
            Context.ConnectionId, isLiked ? "LIKE" : "DISLIKE", movieId, sessionId);

        var session = sessionManager.Get(sessionId);
        if (session == null)
        {
            logger.LogWarning("Session {SessionId} not found for swipe action", sessionId);
            throw new HubException("Session not found.");
        }

        if (isLiked)
        {
            if (!session.MovieLikes.ContainsKey(movieId))
            {
                session.MovieLikes[movieId] = new HashSet<string>();
            }

            session.MovieLikes[movieId].Add(Context.ConnectionId);

            if (session.MovieLikes[movieId].SetEquals(session.ConnectionIds))
            {
                logger.LogDebug("Movie {MovieId} matched by all users in session {SessionId}", movieId, sessionId);
                session.Matches.Add(new Match { MovieId = movieId, MatchedBy = Context.ConnectionId });
                await Clients.Group(sessionId).SendAsync("MatchFound", movieId);
            }
        }

        if (session.Movies.TryDequeue(out var nextMovie))
        {
            await Clients.Group(sessionId).SendAsync("ReceiveMovie", nextMovie);
        }
        else
        {
            logger.LogDebug("No more movies left to swipe in session {SessionId}", sessionId);
            await Clients.Group(sessionId).SendAsync("NoMoreMovies");
        }
    }

    public async Task<string> CreateSessionAsync(SessionOptions options)
    {
        var session = sessionManager.Create(options);
        session.ConnectionIds.Add(Context.ConnectionId);

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

        var session = sessionManager.Get(sessionId);
        if (session == null)
        {
            logger.LogWarning(
                "User {ConnectionId} attempted to join a non-existent session {SessionId}",
                Context.ConnectionId,
                sessionId);
            throw new HubException($"Session {sessionId} not found.");
        }

        session.ConnectionIds.Add(Context.ConnectionId);
        await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);

        logger.LogDebug("User {ConnectionId} joined session {SessionId}", Context.ConnectionId, sessionId);
        await Clients.Group(sessionId).SendAsync("UserJoined", Context.ConnectionId);
    }

    public async Task LeaveSessionAsync(string sessionId)
    {
        logger.LogDebug("User {ConnectionId} is leaving session {SessionId}", Context.ConnectionId, sessionId);

        var session = sessionManager.Get(sessionId);
        if (session == null)
        {
            logger.LogWarning(
                "User {ConnectionId} tried to leave a non-existent session {SessionId}",
                Context.ConnectionId, sessionId);
            throw new HubException($"Session {sessionId} not found.");
        }

        if (session.ConnectionIds.Contains(Context.ConnectionId))
        {
            session.ConnectionIds.Remove(Context.ConnectionId);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, sessionId);

            logger.LogDebug("User {ConnectionId} left session {SessionId}", Context.ConnectionId, sessionId);
            await Clients.Group(sessionId).SendAsync("UserLeft", Context.ConnectionId);
        }

        if (session.ConnectionIds.Count == 0)
        {
            logger.LogDebug("Session {SessionId} has no users left, removing it", sessionId);
            sessionManager.Remove(sessionId);
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        logger.LogDebug("User {ConnectionId} disconnected. Cleaning up their session memberships", Context.ConnectionId);

        foreach (var session in sessionManager.GetByConnectionId(Context.ConnectionId))
        {
            session.ConnectionIds.Remove(Context.ConnectionId);
            if (session.ConnectionIds.Count == 0)
            {
                logger.LogDebug(
                    "Session {SessionId} is empty after {ConnectionId} disconnected. Removing session.",
                    session.Id,
                    Context.ConnectionId);
                sessionManager.Remove(session.Id);
            }
        }

        if (exception != null)
        {
            logger.LogError(exception, "User {ConnectionId} disconnected due to an error", Context.ConnectionId);
        }

        await base.OnDisconnectedAsync(exception);
    }
}
