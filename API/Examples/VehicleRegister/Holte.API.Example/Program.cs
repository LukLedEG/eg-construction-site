using Holte.API.Example;
using Microsoft.AspNetCore.Authentication;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews().AddXmlSerializerFormatters();
builder.Services.AddRazorPages();

builder.Services.AddHttpClient<HolteAPIClient>((service, client) =>
{
    var section = builder.Configuration.GetSection(@"HolteApiClient");
    var url = section.GetValue<string>("BaseUrl");
    var token = section.GetValue<string>("X-Holte-Token");

    client.DefaultRequestHeaders.Add("X-Holte-Token", token);
    client.BaseAddress = new Uri(url);
});

builder.Services.Configure<AuthenticationOptions>(builder.Configuration.GetSection("Authentication"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policyBuilder => policyBuilder.SetIsOriginAllowed(origin => true).AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseCors("AllowAll");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.UseEndpoints(endpoints =>
{
    endpoints.MapRazorPages();
    endpoints.MapControllers();
});

app.MapFallbackToFile("index.html");

app.Run();