using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Azure;
using ReenbitTestTaskApiWithReact.Data;
using ReenbitTestTaskApiWithReact.Repository;
using ReenbitTestTaskApiWithReact.Services;



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();

string connection = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationContext>(options => options.UseSqlServer(connection));

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddTransient<IAzureStorage, AzureStorage>();

builder.Services.AddControllers();

builder.Services.AddAzureClients(clientBuilder =>
{
    clientBuilder.AddBlobServiceClient(builder.Configuration["BlobConnectionString:blob"]);
    clientBuilder.AddQueueServiceClient(builder.Configuration["BlobConnectionString:queue"]);
});

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    //app.UseHsts();
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors(builder => builder
              .AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader()
          //.AllowCredentials()
          );


app.MapControllers();

app.MapFallbackToFile("index.html");

app.Run();
