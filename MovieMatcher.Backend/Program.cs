using Microsoft.Extensions.Options;
using MovieMatcher.Backend;
using MovieMatcher.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddLogging();

builder.Services.Configure<AppSettings>(builder.Configuration);
builder.Services.AddSingleton(sp =>
    sp.GetRequiredService<IOptions<AppSettings>>().Value);

builder.Services.AddSignalR();

builder.Services.AddSingleton<ISessionManager, SessionManager>();
builder.Services.AddSingleton<IMovieService, TmdbApiService>();

var app = builder.Build();

app.MapHub<GameHub>("/gameHub");

app.Run();