using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MovieMatcher.Backend.Services;
using MovieMatcher.Backend.DTOs;

namespace MovieMatcher.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GenresController(IMovieService movieService, IMapper mapper) : ControllerBase
{
    /// <summary>
    /// Gets a list of all movie genres.
    /// </summary>
    /// <returns>A list of genres.</returns>
    [HttpGet("movies")]
    public async Task<ActionResult<List<GenreDto>>> GetMovieGenresAsync()
    {
        var genres = await movieService.GetMovieGenresAsync();

        var genreDtoList = genres
            .Select(mapper.Map<GenreDto>)
            .ToList();

        return Ok(genreDtoList);
    }

    /// <summary>
    /// Gets a list of all TV show genres.
    /// </summary>
    /// <returns>A list of genres.</returns>
    [HttpGet("tv_shows")]
    public async Task<ActionResult<List<GenreDto>>> GetTvGenres()
    {
        var genres = await movieService.GetTvGenresAsync();

        var genreDtoList = genres
            .Select(mapper.Map<GenreDto>)
            .ToList();

        return Ok(genreDtoList);
    }
}