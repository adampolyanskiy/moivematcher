using System.Collections.Concurrent;

namespace MovieMatcher.Backend.Models;

public class Session
{
    public required string Id { get; init; }
    public required SessionOptions Options { get; init; }

    public int ConnectionCount => _connectionIds.Count;

    private const int MaxConnections = 2;

    private readonly ConcurrentDictionary<string, byte> _connectionIds = new();
    private readonly ConcurrentDictionary<string, ConcurrentQueue<Movie>> _userMovieQueues = new();
    private readonly ConcurrentDictionary<string, ConcurrentDictionary<string, byte>> _movieLikes = new();
    private readonly ConcurrentDictionary<string, Match> _matches = new();

    private readonly object _connectionLock = new();

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

    public bool TryRemoveConnection(string connectionId)
    {
        return _connectionIds.TryRemove(connectionId, out _) && _userMovieQueues.TryRemove(connectionId, out _);
    }

    public bool ContainsConnection(string connectionId) => _connectionIds.ContainsKey(connectionId);

    public void EnqueueMovie(Movie movie)
    {
        foreach (var queue in _userMovieQueues.Values)
        {
            queue.Enqueue(movie);
        }
    }

    public bool TryDequeueMovie(string connectionId, out Movie? movie)
    {
        movie = null;

        return _userMovieQueues.TryGetValue(connectionId, out var queue) && queue.TryDequeue(out movie);
    }

    public void AddMovieLike(string movieId, string userId)
    {
        var userSet = _movieLikes.GetOrAdd(movieId, _ => new ConcurrentDictionary<string, byte>());

        if (!userSet.TryAdd(userId, 0))
        {
            return;
        }

        if (userSet.Count == _connectionIds.Count && !_connectionIds.IsEmpty)
        {
            _matches.TryAdd(movieId, new Match
            {
                MovieId = movieId,
            });
        }
    }

    public bool MatchExists(string movieId)
    {
        return _matches.ContainsKey(movieId);
    }
}