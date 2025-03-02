using System.Collections.Concurrent;

namespace MovieMatcher.Backend.Models;

public class Session
{
    public required string Id { get; init; }
    public required SessionOptions Options { get; init; }

    public int ConnectionCount => _connectionIds.Count;

    private readonly ConcurrentDictionary<string, byte> _connectionIds = new();
    private readonly ConcurrentDictionary<string, ConcurrentQueue<Movie>> _userMovieQueues = new();
    private readonly ConcurrentDictionary<string, ConcurrentDictionary<string, byte>> _movieLikes = new();
    private readonly ConcurrentDictionary<string, Match> _matches = new();

    public bool AddConnection(string connectionId)
    {
        if (!_connectionIds.TryAdd(connectionId, 0))
        {
            return false;
        }

        _userMovieQueues.TryAdd(connectionId, new ConcurrentQueue<Movie>());
        return true;
    }

    public bool RemoveConnection(string connectionId)
    {
        if (!_connectionIds.TryRemove(connectionId, out _))
        {
            return false;
        }

        _userMovieQueues.TryRemove(connectionId, out _);
        return true;
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

        if (_userMovieQueues.TryGetValue(connectionId, out var queue))
        {
            return queue.TryDequeue(out movie);
        }

        return false;
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