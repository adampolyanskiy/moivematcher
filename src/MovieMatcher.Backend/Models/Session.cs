namespace MovieMatcher.Backend.Models;

public class Session
{
    public required string Id { get; init; }
    public HashSet<string> ConnectionIds { get; init; } = [];
    public Queue<Movie> Movies { get; set; } = new();
    public required SessionOptions Options { get; init; }
    public Dictionary<string, HashSet<string>> MovieLikes { get; init; } = new();
    public List<Match> Matches { get; set; } = [];
}
