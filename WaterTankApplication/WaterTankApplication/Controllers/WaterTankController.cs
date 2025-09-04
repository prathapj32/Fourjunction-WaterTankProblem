using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using WaterTankApplication.Models;

namespace WaterTankApplication.Controllers
{
    public class WaterTankController : Controller
    {
        private readonly WaterTankService _service;
        private readonly ILogger<WaterTankController> _logger;

        public WaterTankController(ILogger<WaterTankController> logger, ILogger<WaterTankService> serviceLogger)
        {
            _logger = logger;
            _service = new WaterTankService(serviceLogger);
        }

        [HttpGet]
        public IActionResult Index()
        {
            _logger.LogInformation("GET WaterTank Index accessed");
            return View();
        }

        [HttpPost]
        public IActionResult Index(string inputHeights)
        {
            _logger.LogInformation("POST WaterTank Index called with input: {Input}", inputHeights);

            try
            {
                if (string.IsNullOrWhiteSpace(inputHeights))
                {
                    ViewBag.Error = "Please enter valid input like [0,4,0,6]";
                    _logger.LogWarning("Received empty input.");
                    return View();
                }

                var cleanedInput = inputHeights.Replace("[", "").Replace("]", "").Replace(" ", "");
                if (string.IsNullOrWhiteSpace(cleanedInput))
                {
                    ViewBag.Error = "Please enter valid input like [0,4,0,6]";
                    _logger.LogWarning("Input empty after sanitization.");
                    return View();
                }

                string[] parts = cleanedInput.Split(',');

                int[] blocks;
                try
                {
                    blocks = Array.ConvertAll(parts, int.Parse);
                    _logger.LogInformation("Parsed input blocks: {Blocks}", string.Join(", ", blocks));
                }
                catch (FormatException ex)
                {
                    _logger.LogError(ex, "Failed parsing input to integers.");
                    ViewBag.Error = "Invalid input format. Use integers separated by commas.";
                    return View();
                }

                if (Array.Exists(blocks, x => x < 0))
                {
                    ViewBag.Error = "Block heights must be non-negative integers.";
                    _logger.LogWarning("Negative block heights detected: {Blocks}", string.Join(", ", blocks));
                    return View();
                }

                int trappedWater = _service.CalculateTrappedWater(blocks);
                _logger.LogInformation("Trapped water calculated: {Water}", trappedWater);

                ViewBag.Result = trappedWater;
                ViewBag.Input = inputHeights;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception in WaterTankController.");
                ViewBag.Error = "An unexpected error occurred. Please try again.";
            }

            return View();
        }
    }
}
