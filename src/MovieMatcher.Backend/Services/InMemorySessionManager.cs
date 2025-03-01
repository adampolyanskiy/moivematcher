using System.Collections.Concurrent;
using MovieMatcher.Backend.Models;
using SessionOptions = MovieMatcher.Backend.Models.SessionOptions;

namespace MovieMatcher.Backend.Services;

public class InMemorySessionManager : ISessionManager
{
    private readonly ConcurrentDictionary<string, Session> _sessions = new();
    
    private static string CreateSessionId() => Guid.NewGuid().ToString();

    public Session Create(SessionOptions options)
    {
        var sessionId = CreateSessionId();
        var session = new Session { Id = sessionId, Options = options };
        _sessions[sessionId] = session;
        return session;
    }

    public Session? Get(string sessionId) =>
        _sessions.GetValueOrDefault(sessionId);

    public void Remove(string sessionId) =>
        _sessions.TryRemove(sessionId, out _);

    public Session? GetByConnectionId(string connectionId) =>
        _sessions.Values.SingleOrDefault(s => s.ConnectionIds.Contains(connectionId));
}