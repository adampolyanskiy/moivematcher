namespace MovieMatcher.Backend.Models;

public class SearchTvParams
{
    public int Year { get; init; }
    public required IEnumerable<Genre> Genres { get; init; }
    public int Page { get; init; } = 1;
}