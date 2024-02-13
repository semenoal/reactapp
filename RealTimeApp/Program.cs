var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options =>
    {
        options.AddPolicy("CorsPolicy", builder =>
            builder.WithOrigins("http://localhost:3000") // Allow only the React app
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials()); // Important for SignalR
    });
builder.Services.AddRazorPages();
builder.Services.AddSignalR();

var app
 = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();
app.UseCors("CorsPolicy");
app.UseEndpoints(endpoints =>
    {
        endpoints.MapRazorPages();
        endpoints.MapHub<StockTickerHub>("/stockTickerHub");
    });

app.Run();
