namespace MovieMatcher.Backend.Models;

public class Match
{
    public required string MovieId { get; set; }
    public required string MatchedBy { get; set; }
}