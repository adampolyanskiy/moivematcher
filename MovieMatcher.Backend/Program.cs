using MovieMatcher.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

builder.Services.AddSingleton<ISessionManager, SessionManager>();
builder.Services.AddSingleton<IMovieService, MovieService>();

var app = builder.Build();

app.MapHub<GameHub>("/gameHub");

app.Run();