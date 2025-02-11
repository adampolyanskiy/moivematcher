namespace MovieMatcher.Backend.Models;

public class SearchMoviesParams
{
    public bool IncludeAdult { get; set; }
    public int? Year { get; set; }
    public required IEnumerable<int> GenreIds { get; set; }
    public int Page { get; set; }
}