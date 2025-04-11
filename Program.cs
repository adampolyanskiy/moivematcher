using Microsoft.Extensions.Options;
using MovieMatcher.Backend;
using MovieMatcher.Backend.Hubs;
using MovieMatcher.Backend.Infrastructure;
using MovieMatcher.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

builder.Services.AddLogging();
builder.Services.AddControllers();

builder.Services.Configure<AppSettings>(builder.Configuration);

builder.Services.AddAutoMapper(typeof(ApplicationMappingProfile));

builder.Services.AddSingleton(sp =>
    sp.GetRequiredService<IOptions<AppSettings>>().Value);

builder.Services.AddSignalR().AddJsonProtocol();

builder.Services.AddSingleton<ISessionStorage, InMemorySessionStorage>();
builder.Services.AddSingleton<IMovieService, TmdbApiService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy
            .WithOrigins(builder.Configuration["AllowedHosts"])
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

var app = builder.Build();

app.UseCors("AllowAll");

app.MapHub<MovieMatcherHub>("/movieMatcherHub");

app.MapControllers();

app.Run();