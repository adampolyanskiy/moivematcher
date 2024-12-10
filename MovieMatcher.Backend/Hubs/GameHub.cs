using Microsoft.AspNetCore.SignalR;
using MovieMatcher.Backend.Models;
using MovieMatcher.Backend.Services;

public class GameHub : Hub
{
    private readonly ISessionManager _sessionManager;
    private readonly IMovieService _movieService;

    public GameHub(ISessionManager sessionManager, IMovieService movieService)
    {
        _sessionManager = sessionManager;
        _movieService = movieService;
    }
    
    public async Task StartSwiping(string sessionId)
    {
        var session = _sessionManager.GetSession(sessionId);
        if (session == null)
        {
            throw new HubException("Session not found.");
        }

        var movies = await _movieService.FetchMoviesAsync();

        // Populate the session with movies
        session.Movies = new Queue<Movie>(movies);

        // Send the first movie to all clients
        if (session.Movies.TryDequeue(out var movie))
        {
            await Clients.Group(sessionId).SendAsync("ReceiveMovie", movie);
        }
    }

    public async Task SwipeMovie(string sessionId, string movieId, bool isLiked)
    {
        var session = _sessionManager.GetSession(sessionId);
        if (session == null)
        {
            throw new HubException("Session not found.");
        }

        // Track likes and notify about matches (logic from earlier example)
        if (isLiked)
        {
            if (!session.MovieLikes.ContainsKey(movieId))
            {
                session.MovieLikes[movieId] = new HashSet<string>();
            }

            session.MovieLikes[movieId].Add(Context.ConnectionId);

            if (session.MovieLikes[movieId].SetEquals(session.ConnectedUsers))
            {
                session.Matches.Add(new Match { MovieId = movieId, MatchedBy = Context.ConnectionId });
                await Clients.Group(sessionId).SendAsync("MatchFound", movieId);
            }
        }

        // Send the next movie if available
        if (session.Movies.TryDequeue(out var nextMovie))
        {
            await Clients.Group(sessionId).SendAsync("ReceiveMovie", nextMovie);
        }
        else
        {
            // Notify clients that no more movies are available
            await Clients.Group(sessionId).SendAsync("NoMoreMovies");
        }
    }

    public async Task<string> CreateSession()
    {
        // Generate a secure session ID
        var sessionId = Guid.NewGuid().ToString();
        _sessionManager.CreateSession(sessionId);

        // Optionally, add the creator to the session immediately
        var session = _sessionManager.GetSession(sessionId);
        session?.ConnectedUsers.Add(Context.ConnectionId);
        await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);

        return sessionId; // Return the session ID to the client
    }

    public async Task JoinSession(string sessionId)
    {
        var session = _sessionManager.GetSession(sessionId);
        if (session == null)
        {
            throw new HubException("Session not found.");
        }

        session.ConnectedUsers.Add(Context.ConnectionId);
        await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);

        await Clients.Group(sessionId).SendAsync("UserJoined", Context.ConnectionId);
    }

    public async Task LeaveSession(string sessionId)
    {
        var session = _sessionManager.GetSession(sessionId);
        if (session != null)
        {
            session.ConnectedUsers.Remove(Context.ConnectionId);
            if (session.ConnectedUsers.Count == 0)
            {
                _sessionManager.RemoveSession(sessionId);
            }
        }

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, sessionId);
        await Clients.Group(sessionId).SendAsync("UserLeft", Context.ConnectionId);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        foreach (var session in _sessionManager.GetSessionsWithUser(Context.ConnectionId))
        {
            session.ConnectedUsers.Remove(Context.ConnectionId);
            if (session.ConnectedUsers.Count == 0)
            {
                _sessionManager.RemoveSession(session.Id);
            }
        }

        await base.OnDisconnectedAsync(exception);
    }
}