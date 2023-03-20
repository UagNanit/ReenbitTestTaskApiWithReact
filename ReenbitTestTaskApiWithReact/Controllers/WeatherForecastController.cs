using Microsoft.AspNetCore.Mvc;
using ReenbitTestTaskApiWithReact.Data;
using ReenbitTestTaskApiWithReact.Models;
using ReenbitTestTaskApiWithReact.Services;

namespace ReenbitTestTaskApiWithReact.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IAzureStorage _storage;
        private readonly ApplicationContext _applicationContext;

        private static readonly string[] Summaries = new[]
        {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IAzureStorage storage, ApplicationContext applicationContext)
        {
            _logger = logger;
            _storage = storage;
            _applicationContext = applicationContext;
        }

        [Route("getweather")]
        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [Route("upload")]
        [HttpPost]
        public async Task<ActionResult> UploadAsync([FromForm] ModelDto model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await _applicationContext.DbModelDatas.AddAsync(new DbModelData { Email = model.Email, FileName = model.UploadedFile.FileName });
            await _applicationContext.SaveChangesAsync();

            BlobResponseDto? response = await _storage.UploadAsync(model.UploadedFile);

            // Check if we got an error
            if (response.Error == true)
            {
                // We got an error during upload, return an error with details to the client
                return StatusCode(StatusCodes.Status500InternalServerError, response.Status);
            }
            else
            {
                // Return a success message to the client about successfull upload
                return StatusCode(StatusCodes.Status200OK, response);
            }

        }
    }
}