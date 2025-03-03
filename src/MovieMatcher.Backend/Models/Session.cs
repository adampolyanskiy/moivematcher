using System.Collections.Concurrent;

namespace MovieMatcher.Backend.Models;

/// <summary>
/// Represents a movie matching session.
/// </summary>
public class Session
{
    /// <summary>
    /// Gets or sets the unique identifier of the session.
    /// </summary>
    public required string Id { get; init; }

    /// <summary>
    /// Gets or sets the connection ID of the host user.
    /// </summary>
    public required string HostConnectionId { get; set; }

    /// <summary>
    /// Gets the session options.
    /// </summary>
    public required SessionOptions Options { get; init; }

    /// <summary>
    /// Gets the collection of connection IDs of users in the session.
    /// </summary>
    public IReadOnlyCollection<string> ConnectionIds
    {
        get
        {
            lock (_connectionLock)
            {
                return _connectionIds.Keys.ToList().AsReadOnly();
            }
        }
    }

    private const int MaxConnections = 2;

    private readonly ConcurrentDictionary<string, byte> _connectionIds = new();
    private readonly ConcurrentDictionary<string, ConcurrentQueue<Movie>> _userMovieQueues = new();
    private readonly ConcurrentDictionary<string, ConcurrentDictionary<string, byte>> _movieLikes = new();
    private readonly ConcurrentDictionary<string, Match> _matches = new();

    private readonly object _connectionLock = new();
    private readonly object _movieLikeLock = new();

    /// <summary>
    /// Attempts to add a connection to the session.
    /// </summary>
    /// <param name="connectionId">The connection ID to add.</param>
    /// <returns><see langword="true"/> if the connection was added successfully, otherwise <see langword="false"/>.</returns>
    public bool TryAddConnection(string connectionId)
    {
        lock (_connectionLock)
        {
            if (_connectionIds.Count >= MaxConnections)
            {
                return false;
            }

            return _connectionIds.TryAdd(connectionId, 0) &&
                   _userMovieQueues.TryAdd(connectionId, new ConcurrentQueue<Movie>());
        }
    }

    /// <summary>
    /// Attempts to remove a connection from the session.
    /// </summary>
    /// <param name="connectionId">The connection ID to remove.</param>
    /// <returns><see langword="true"/> if the connection was removed successfully, otherwise <see langword="false"/>.</returns>
    public bool TryRemoveConnection(string connectionId)
    {
        return _connectionIds.TryRemove(connectionId, out _) && _userMovieQueues.TryRemove(connectionId, out _);
    }

    /// <summary>
    /// Checks if a connection is in the session.
    /// </summary>
    /// <param name="connectionId">The connection ID to check.</param>
    /// <returns><see langword="true"/> if the connection is in the session, otherwise <see langword="false"/>.</returns>
    public bool ContainsConnection(string connectionId) => _connectionIds.ContainsKey(connectionId);

    /// <summary>
    /// Enqueues a movie for all users in the session.
    /// </summary>
    /// <param name="movie">The movie to enqueue.</param>
    public void EnqueueMovie(Movie movie)
    {
        foreach (var queue in _userMovieQueues.Values)
        {
            queue.Enqueue(movie);
        }
    }

    /// <summary>
    /// Attempts to dequeue a movie for a user in the session.
    /// </summary>
    /// <param name="connectionId">The connection ID of the user.</param>
    /// <param name="movie">The dequeued movie.</param>
    /// <returns><see langword="true"/> if a movie was dequeued successfully, otherwise <see langword="false"/>.</returns>
    public bool TryDequeueMovie(string connectionId, out Movie? movie)
    {
        movie = null;

        return _userMovieQueues.TryGetValue(connectionId, out var queue) && queue.TryDequeue(out movie);
    }
    
    /// <summary>
    /// Adds a like for a movie by a user in the session, and checks if a match exists.
    /// </summary>
    /// <param name="movieId">The ID of the movie.</param>
    /// <param name="connectionId">The connection ID of the user.</param>
    /// <returns><see langword="true"/> if a match exists, otherwise <see langword="false"/>.</returns>
    public bool AddLikeAndCheckMatch(string movieId, string connectionId)
    {
        lock (_movieLikeLock)
        {
            AddMovieLike(movieId, connectionId);
            return MatchExists(movieId);
        }
    }
    
    /// <summary>
    /// Adds a like for a movie by a user in the session.
    /// </summary>
    /// <param name="movieId">The ID of the movie.</param>
    /// <param name="connectionId">The connection ID of the user.</param>
    private void AddMovieLike(string movieId, string connectionId)
    {
        var connectionSet = _movieLikes.GetOrAdd(movieId, _ => new ConcurrentDictionary<string, byte>());

        if (!connectionSet.TryAdd(connectionId, 0))
        {
            return;
        }

        if (connectionSet.Count == _connectionIds.Count && !_connectionIds.IsEmpty)
        {
            _matches.GetOrAdd(movieId, new Match
            {
                MovieId = movieId,
            });
        }
    }

    /// <summary>
    /// Checks if a match exists for a movie in the session.
    /// </summary>
    /// <param name="movieId">The ID of the movie.</param>
    /// <returns><see langword="true"/> if a match exists, otherwise <see langword="false"/>.</returns>
    private bool MatchExists(string movieId)
    {
        return _matches.ContainsKey(movieId);
    }
}