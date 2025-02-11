namespace MovieMatcher.Backend.Models;

public class SearchTvParams
{
    public int Year { get; set; }
    public IEnumerable<Genre> Genres { get; set; }
    public int Page { get; set; } = 1;
}