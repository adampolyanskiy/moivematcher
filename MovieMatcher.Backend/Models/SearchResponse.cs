namespace MovieMatcher.Backend.Models;

public class SearchResponse<T>
{
    public int Page { get; set; }
    public List<T> Results { get; set; }
    public int TotalPages { get; set; }
    public int TotalResults { get; set; }
}