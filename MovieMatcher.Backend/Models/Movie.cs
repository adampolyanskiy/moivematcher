namespace MovieMatcher.Backend.Models;

public class Movie
{
    public string Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public List<string> Genres { get; set; } = new();
}