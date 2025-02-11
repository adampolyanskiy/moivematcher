using MovieMatcher.Backend.Models;

namespace MovieMatcher.Backend.Hubs;

public class Session
{
    public string Id { get; set; }
    public HashSet<string> ConnectedUsers { get; set; } = new();
    public Queue<Movie> Movies { get; set; } = new();
    public SessionOptions Options { get; set; }
    public Dictionary<string, HashSet<string>> MovieLikes { get; set; } = new();
    public List<Match> Matches { get; set; } = new();
}
