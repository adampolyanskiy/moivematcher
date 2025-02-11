using Microsoft.Extensions.Options;
using MovieMatcher.Backend.Exceptions;
using MovieMatcher.Backend.Models;
using TMDbLib.Client;
using TMDbLib.Objects.General;
using TMDbLib.Objects.Search;
using Genre = MovieMatcher.Backend.Models.Genre;
using TMDbGenre = TMDbLib.Objects.General.Genre;

namespace MovieMatcher.Backend.Services;

public class TmdbApiService : IMovieService
{
    private readonly TMDbClient _client;
    private readonly ILogger<TmdbApiService> _logger;

    public TmdbApiService(ILogger<TmdbApiService> logger, IOptions<AppSettings> appSettings)
    {
        var apiKey = appSettings.Value.TMDbSettings.ApiKey;
        _client = new TMDbClient(apiKey);
        _logger = logger;
    }

    public async Task<List<Genre>> GetMovieGenresAsync()
    {
        try
        {
            _logger.LogDebug("Fetching movie genres from TMDb API...");

            var genres = await _client.GetMovieGenresAsync();

            _logger.LogDebug("Successfully fetched movie genres.");

            return genres.ConvertAll(g => new Genre { Id = g.Id, Name = g.Name });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching movie genres from TMDb API.");
            throw new OperationFailedException("Failed to fetch movie genres from TMDb API.", ex);
        }
    }

    public async Task<List<Genre>> GetTvGenresAsync()
    {
        try
        {
            _logger.LogDebug("Fetching TV genres from TMDb API...");

            var genres = await _client.GetTvGenresAsync();

            _logger.LogDebug("Successfully fetched TV genres.");

            return genres.ConvertAll(g => new Genre { Id = g.Id, Name = g.Name });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching TV genres from TMDb API.");
            throw new OperationFailedException("Failed to fetch TV genres from TMDb API.", ex);
        }
    }

    public async Task<SearchResponse<Movie>> SearchMovies(SearchMoviesParams? parameters = null)
    {
        try
        {
            _logger.LogDebug("Discovering movies from TMDb API...");

            SearchContainer<SearchMovie>? result;

            var query = _client.DiscoverMoviesAsync();

            if (parameters != null)
            {
                if (parameters.Year.HasValue)
                {
                    query = query.WhereAnyReleaseDateIsInYear(parameters.Year.Value);
                }

                result = await query
                    .IncludeAdultMovies(parameters.IncludeAdult)
                    .IncludeWithAnyOfGenre(parameters.GenreIds)
                    .Query(parameters.Page);
            }
            else
            {
                result = await query.Query();
            }

            _logger.LogDebug("Successfully discovered movies.");

            return new SearchResponse<Movie>
            {
                Page = result.Page,
                TotalPages = result.TotalPages,
                TotalResults = result.TotalResults,
                Results = result.Results.ConvertAll(m => new Movie
                {
                    Id = m.Id,
                    Title = m.Title,
                    Overview = m.Overview,
                    GenreIds = m.GenreIds,
                    PosterPath = m.PosterPath,
                    BackdropPath = m.BackdropPath,
                    Popularity = m.Popularity,
                    VoteAverage = m.VoteAverage,
                    VoteCount = m.VoteCount,
                    ReleaseDate = m.ReleaseDate
                })
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while discovering movies from TMDb API.");
            throw new OperationFailedException("Failed to discover movies from TMDb API.", ex);
        }
    }

    public async Task<SearchResponse<TvShow>> SearchTvShowsAsync(SearchTvParams? parameters = null)
    {
        try
        {
            _logger.LogDebug("Discovering TV shows from TMDb API...");

            SearchContainer<SearchTv>? result;

            var query = _client.DiscoverTvShowsAsync();

            if (parameters != null)
            {
                var genres = parameters.Genres.Select(g => new TMDbGenre { Id = g.Id, Name = g.Name })
                    .ToArray();

                result = await query
                    .WhereFirstAirDateIsInYear(parameters.Year)
                    .WhereGenresInclude(genres)
                    .Query(parameters.Page);
            }
            else
            {
                result = await query.Query();
            }

            _logger.LogDebug("Successfully discovered TV shows.");

            return new SearchResponse<TvShow>
            {
                Page = result.Page,
                TotalPages = result.TotalPages,
                TotalResults = result.TotalResults,
                Results = result.Results.ConvertAll(tv => new TvShow
                {
                    Id = tv.Id,
                    Name = tv.Name,
                    Overview = tv.Overview,
                    GenreIds = tv.GenreIds,
                    PosterPath = tv.PosterPath,
                    BackdropPath = tv.BackdropPath,
                    Popularity = tv.Popularity,
                    VoteAverage = tv.VoteAverage,
                    VoteCount = tv.VoteCount,
                    FirstAirDate = tv.FirstAirDate
                })
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while discovering TV shows from TMDb API.");
            throw new OperationFailedException("Failed to discover TV shows from TMDb API.", ex);
        }
    }
}