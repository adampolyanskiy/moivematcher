namespace MovieMatcher.Backend.Models;

public class Movie
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Overview { get; set; }
    public required List<int> GenreIds { get; set; }
    public required string PosterPath { get; set; }
    public required string BackdropPath { get; set; }
    public double Popularity { get; set; }
    public double VoteAverage { get; set; }
    public int VoteCount { get; set; }
    public DateTime? ReleaseDate { get; set; }
}