namespace MovieMatcher.Backend.Models;

public class TvShow
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Overview { get; set; }
    public List<int> GenreIds { get; set; }
    public string PosterPath { get; set; }
    public string BackdropPath { get; set; }
    public double Popularity { get; set; }
    public double VoteAverage { get; set; }
    public int VoteCount { get; set; }
    public DateTime? FirstAirDate { get; set; }
}