namespace MovieMatcher.Backend.Models;

public class SessionOptions
{
    public bool IncludeAdult { get; set; }
    public int? Year { get; set; }
    public IEnumerable<int> GenreIds { get; set; }
}