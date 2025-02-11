using MovieMatcher.Backend.Models;

namespace MovieMatcher.Backend.Services;

public interface IMovieService
{
    /// <summary>
    /// Fetches all movie genres.
    /// </summary>
    /// <returns>A list of movie genres.</returns>
    Task<List<Genre>> GetMovieGenresAsync();

    /// <summary>
    /// Fetches all TV show genres.
    /// </summary>
    /// <returns>A list of TV show genres.</returns>
    Task<List<Genre>> GetTvGenresAsync();

    public Task<SearchResponse<Movie>> SearchMovies(SearchMoviesParams? parameters = null);

    public Task<SearchResponse<TvShow>> SearchTvShowsAsync(SearchTvParams? parameters = null);
}