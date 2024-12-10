using System.Collections.Concurrent;
using MovieMatcher.Backend.Models;
using MovieMatcher.Backend.Services;

public class SessionManager : ISessionManager
{
    private readonly ConcurrentDictionary<string, Session> _sessions = new();

    public Session CreateSession(string sessionId)
    {
        var session = new Session { Id = sessionId };
        _sessions[sessionId] = session;
        return session;
    }

    public Session? GetSession(string sessionId) =>
        _sessions.GetValueOrDefault(sessionId);

    public void RemoveSession(string sessionId) =>
        _sessions.TryRemove(sessionId, out _);

    public IEnumerable<Session> GetSessionsWithUser(string connectionId) =>
        _sessions.Values.Where(s => s.ConnectedUsers.Contains(connectionId));
}