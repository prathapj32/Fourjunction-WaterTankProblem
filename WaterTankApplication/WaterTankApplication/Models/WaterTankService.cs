using System;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace WaterTankApplication.Models
{
    public class WaterTankService
    {
        private readonly ILogger<WaterTankService> _logger;

        public WaterTankService(ILogger<WaterTankService> logger)
        {
            _logger = logger;
        }

        public int CalculateTrappedWater(int[] height)
        {
            if (height == null) throw new ArgumentNullException(nameof(height));
            if (height.Length == 0) return 0;
            if (height.Any(h => h < 0))
                throw new ArgumentException("Block heights must be non-negative.");

            int left = 0, right = height.Length - 1;
            int leftMax = 0, rightMax = 0;
            int water = 0;

            _logger.LogInformation("Starting trapped water calculation.");

            while (left < right)
            {
                if (height[left] < height[right])
                {
                    if (height[left] >= leftMax)
                    {
                        leftMax = height[left];
                        _logger.LogDebug("Updated leftMax to {Value}", leftMax);
                    }
                    else
                    {
                        water += leftMax - height[left];
                        _logger.LogDebug("Added water at position {Index}: {Amount}", left, leftMax - height[left]);
                    }
                    left++;
                }
                else
                {
                    if (height[right] >= rightMax)
                    {
                        rightMax = height[right];
                        _logger.LogDebug("Updated rightMax to {Value}", rightMax);
                    }
                    else
                    {
                        water += rightMax - height[right];
                        _logger.LogDebug("Added water at position {Index}: {Amount}", right, rightMax - height[right]);
                    }
                    right--;
                }
            }

            _logger.LogInformation("Completed calculation: total trapped water = {Water}", water);
            return water;
        }
    }
}
