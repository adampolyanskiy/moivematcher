namespace MovieMatcher.Backend.Models;

public class SessionOptions
{
    public bool IncludeAdult { get; init; }
    public int? Year { get; init; }
    public required IEnumerable<int> GenreIds { get; init; }
}