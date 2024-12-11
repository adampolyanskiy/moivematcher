using Microsoft.Extensions.Options;
using MovieMatcher.Backend;
using MovieMatcher.Backend.Services;
using TMDbLib.Client;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddLogging();

builder.Services.Configure<AppSettings>(builder.Configuration);
builder.Services.AddSingleton(sp =>
    sp.GetRequiredService<IOptions<AppSettings>>().Value);

builder.Services.AddSignalR();

builder.Services.AddSingleton<ISessionManager, SessionManager>();

var app = builder.Build();

app.MapHub<GameHub>("/gameHub");

app.Run();