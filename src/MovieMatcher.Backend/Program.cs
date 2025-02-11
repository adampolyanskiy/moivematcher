using Microsoft.Extensions.Options;
using MovieMatcher.Backend;
using MovieMatcher.Backend.Hubs;
using MovieMatcher.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddLogging();

builder.Services.Configure<AppSettings>(builder.Configuration);
builder.Services.AddSingleton(sp =>
    sp.GetRequiredService<IOptions<AppSettings>>().Value);

builder.Services.AddSignalR();

builder.Services.AddSingleton<ISessionManager, InMemorySessionManager>();
builder.Services.AddSingleton<IMovieService, TmdbApiService>();

var app = builder.Build();

app.MapHub<MovieMatcherHub>("/movieMatcherHub");

app.Run();