namespace MovieMatcher.Backend.Models;

public class SearchResponse<T>
{
    public int Page { get; init; }
    public required List<T> Results { get; init; }
    public int TotalPages { get; init; }
    public int TotalResults { get; init; }
}