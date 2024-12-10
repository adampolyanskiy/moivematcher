using MovieMatcher.Backend.Models;

namespace MovieMatcher.Backend.Services;

public class MovieService : IMovieService
{
    public Task<List<Movie>> FetchMoviesAsync()
    {
        var movies = new List<Movie>
        {
            new Movie { Id = "1", Title = "Inception", Description = "A mind-bending thriller." },
            new Movie { Id = "2", Title = "The Matrix", Description = "A sci-fi classic." },
            new Movie { Id = "3", Title = "Interstellar", Description = "A space epic." },
            new Movie { Id = "4", Title = "The Dark Knight", Description = "A gritty superhero tale." },
            new Movie { Id = "5", Title = "Pulp Fiction", Description = "A cult classic crime story." }
        };

        return Task.FromResult(movies);
    }
}
