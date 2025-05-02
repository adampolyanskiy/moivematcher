namespace MovieMatcher.Backend.Models;

public class SessionOptions
{
    public bool IncludeAdult { get; set; }
    public int StartYear { get; set; }
    public int EndYear { get; set; }
    public required IEnumerable<int> GenreIds { get; set; }
    public string Language { get; set; } = "en";
}