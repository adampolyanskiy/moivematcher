namespace MovieMatcher.Backend.Models;

public class Session
{
    public required string Id { get; set; }
    public HashSet<string> ConnectedUsers { get; set; } = [];
    public Queue<Movie> Movies { get; set; } = new();
    public SessionOptions? Options { get; set; }
    public Dictionary<string, HashSet<string>> MovieLikes { get; set; } = new();
    public List<Match> Matches { get; set; } = [];
}
