using MovieMatcher.Backend.Models;

namespace MovieMatcher.Backend.Services;

public interface IMovieService
{
    Task<List<Movie>> FetchMoviesAsync();
}