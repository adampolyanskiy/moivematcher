namespace MovieMatcher.Backend.Models;

public class TvShow
{
    public int Id { get; init; }
    public required string Name { get; init; }
    public required string Overview { get; init; }
    public required List<int> GenreIds { get; init; }
    public required string PosterPath { get; init; }
    public required string BackdropPath { get; init; }
    public double Popularity { get; init; }
    public double VoteAverage { get; init; }
    public int VoteCount { get; init; }
    public DateTime? FirstAirDate { get; init; }
}