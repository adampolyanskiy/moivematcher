using AutoMapper;
using MovieMatcher.Backend.DTOs;
using MovieMatcher.Backend.Models;

namespace MovieMatcher.Backend.Infrastructure;

public class ApplicationMappingProfile : Profile
{
    public ApplicationMappingProfile()
    {
        CreateMap<Genre, GenreDto>();
    }
}