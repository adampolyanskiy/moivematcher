using System.Collections.Concurrent;
using MovieMatcher.Backend.Exceptions;
using MovieMatcher.Backend.Models;
using SessionOptions = MovieMatcher.Backend.Models.SessionOptions;

namespace MovieMatcher.Backend.Services;

public class InMemorySessionStorage(ILogger<InMemorySessionStorage> logger) : ISessionStorage
{
    private readonly ConcurrentDictionary<string, Session> _sessions = new();
    
    private static string CreateSessionId() => Guid.NewGuid().ToString();

    public Session Create(string connectionId, SessionOptions options)
    {
        if (_sessions.Values.Any(s => s.ContainsConnection(connectionId)))
        {
            logger.LogError("User {ConnectionId} is already in another session.", connectionId);
            throw new ForbiddenException("User is already in another session.");
        }
        
        var sessionId = CreateSessionId();
        var session = new Session { Id = sessionId, Options = options, HostConnectionId = connectionId};

        if (!session.TryAddConnection(connectionId))
        {
            logger.LogError("Could not add host connection to session {SessionId}.", sessionId);
            throw new OperationFailedException("Could not add host connection to session.");
        }

        _sessions[sessionId] = session;
        return session;
    }

    public Session? Get(string sessionId) =>
        _sessions.GetValueOrDefault(sessionId);

    public void Remove(string sessionId) =>
        _sessions.TryRemove(sessionId, out _);

    public Session? GetByConnectionId(string connectionId) =>
        _sessions.Values.SingleOrDefault(s => s.ContainsConnection(connectionId));
}