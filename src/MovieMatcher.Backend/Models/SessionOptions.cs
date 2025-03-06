namespace MovieMatcher.Backend.Models;

public class SessionOptions
{
    public bool IncludeAdult { get; init; }
    public int StartYear { get; init; }
    public int EndYear { get; init; }
    public required IEnumerable<int> GenreIds { get; init; }
}