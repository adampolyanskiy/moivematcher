using Microsoft.AspNetCore.Mvc;
using MovieMatcher.Backend.Services;
using MovieMatcher.Backend.DTOs;

namespace MovieMatcher.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GenresController : ControllerBase
{
    private readonly IMovieService _movieService;

    public GenresController(IMovieService movieService)
    {
        _movieService = movieService;
    }

    /// <summary>
    /// Gets a list of all movie genres.
    /// </summary>
    /// <returns>A list of genres.</returns>
    [HttpGet("movies")]
    public async Task<ActionResult<List<GenreDto>>> GetMovieGenresAsync()
    {
        var genres = await _movieService.GetMovieGenresAsync();
        if (genres.Count == 0)
        {
            return NotFound("No movie genres available.");
        }

        var genreDtos = genres.Select(g => new GenreDto
        {
            Id = g.Id,
            Name = g.Name
        }).ToList();

        return Ok(genreDtos);
    }

    /// <summary>
    /// Gets a list of all TV show genres.
    /// </summary>
    /// <returns>A list of genres.</returns>
    [HttpGet("tvshows")]
    public async Task<ActionResult<List<GenreDto>>> GetTvGenres()
    {
        var genres = await _movieService.GetTvGenresAsync();
        if (genres.Count == 0)
        {
            return NotFound("No TV show genres available.");
        }

        var genreDtos = genres.Select(g => new GenreDto
        {
            Id = g.Id,
            Name = g.Name
        }).ToList();

        return Ok(genreDtos);
    }
}