using MovieMatcher.Backend.Models;
using SessionOptions = MovieMatcher.Backend.Models.SessionOptions;

namespace MovieMatcher.Backend.Services;

public interface ISessionStorage
{
    Session Create(string connectionId, SessionOptions options);
    Session? Get(string sessionId);
    void Remove(string sessionId);
    Session? GetByConnectionId(string connectionId);
}