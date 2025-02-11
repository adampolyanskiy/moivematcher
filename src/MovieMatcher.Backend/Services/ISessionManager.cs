using MovieMatcher.Backend.Hubs;

namespace MovieMatcher.Backend.Services;

public interface ISessionManager
{
    Session CreateSession(string sessionId);
    Session? GetSession(string sessionId);
    void RemoveSession(string sessionId);
    IEnumerable<Session> GetSessionsWithUser(string connectionId);
}