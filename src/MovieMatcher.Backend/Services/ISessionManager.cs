using MovieMatcher.Backend.Models;
using SessionOptions = MovieMatcher.Backend.Models.SessionOptions;

namespace MovieMatcher.Backend.Services;

public interface ISessionManager
{
    Session Create(SessionOptions options);
    Session? Get(string sessionId);
    void Remove(string sessionId);
    Session? GetByConnectionId(string connectionId);
}