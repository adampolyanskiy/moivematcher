using Microsoft.AspNetCore.SignalR;
using MovieMatcher.Backend.Models;
using MovieMatcher.Backend.Services;
using SessionOptions = MovieMatcher.Backend.Models.SessionOptions;

public class MovieMatcherHub : Hub
{
    private readonly ISessionManager _sessionManager;
    private readonly IMovieService _movieService;

    public MovieMatcherHub(ISessionManager sessionManager, IMovieService movieService)
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

        if (session.Options == null)
        {
            throw new HubException("Session options are not configured.");
        }

        var searchParams = new SearchMoviesParams
        {
            IncludeAdult = session.Options.IncludeAdult,
            Year = session.Options.Year,
            GenreIds = session.Options.GenreIds
        };

        var movies = await _movieService.SearchMovies(searchParams);

        session.Movies = new Queue<Movie>(movies.Results);

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

    public async Task<string> CreateSession(SessionOptions options)
    {
        var sessionId = Guid.NewGuid().ToString();
        _sessionManager.CreateSession(sessionId);

        var session = _sessionManager.GetSession(sessionId);
        if (session == null)
        {
            throw new HubException("Failed to create session.");
        }

        session.Options = options;

        session.ConnectedUsers.Add(Context.ConnectionId);
        await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);

        return sessionId;
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