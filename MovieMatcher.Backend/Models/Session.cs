namespace MovieMatcher.Backend.Models;

public class Session
{
    public string Id { get; set; }
    public List<string> ConnectedUsers { get; set; } = new();
    public Queue<Movie> Movies { get; set; } = new();
    public List<Match> Matches { get; set; } = new();
    public Dictionary<string, HashSet<string>> MovieLikes { get; set; } = new();
}