namespace MovieMatcher.Backend.Models;

public class SearchMoviesParams
{
    public bool IncludeAdult { get; init; }
    public int? Year { get; init; }
    public required IEnumerable<int> GenreIds { get; init; }
    public int Page { get; init; }
}