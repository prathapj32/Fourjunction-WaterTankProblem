Water Tank Web Application
    This project is a Water Tank Problem web application that calculates the amount of water trapped between blocks of different heights. It is built with ASP.NET Core MVC in the backend and Vanilla JavaScript, HTML, and CSS on the frontend for dynamic input visualization and output display.
________________________________________
Features
  •	Compute units of trapped water given an input array of block heights.
  •	Responsive, interactive SVG-based visualizations of input block heights and trapped water output.
  •	Input validation with error handling.
  •	Step logging and error logging using Serilog, saving logs to separate files.
  •	User-friendly UI with real-time result updates.
  •	Logs are stored locally with daily rotation and separate files for step logs and error logs.
________________________________________
Project Structure
  •	Models/WaterTankService.cs
    Contains the core algorithm that computes trapped water, with integrated step logs.
  •	Controllers/WaterTankController.cs
    Handles GET and POST requests, sanitizes input, validates data, calls the service, passes results or errors to the view, and logs details.
  •	Views/WaterTank/Index.cshtml
    Razor view with input form, error/result display, and containers for SVG visualizations.
  •	wwwroot/css/WaterTank.css
    Styling for form, buttons, error messages, and responsive layout of visualizations.
  •	wwwroot/js/WaterTank.js
    Client-side input validation, dynamic SVG visualization rendering, and real-time updates to total trapped water display.
  •	Program.cs
    Configures Serilog for separate step and error log files with daily rolling.
________________________________________
Getting Started
  Prerequisites
    •	.NET 6.0 SDK
    •	Visual Studio 2022 or Visual Studio Code
    •	Modern web browser
________________________________________
Running the Application
1.	Clone the repository:
  git clone https://github.com/yourusername/water-tank-app.git
  cd water-tank-app
2.	Restore NuGet packages:  dotnet restore
3.	Build the project:  dotnet build
4.	Run the application:dotnet run
5.	Open browser and navigate to:https://localhost:5001/WaterTank
________________________________________
Using the Application
•	Enter block heights as a comma-separated array inside square brackets, e.g., [0,4,0,0,0,6,0,6,4,0].
•	Press Calculate Trapped Water.
•	The application will display:
•	The total units of water trapped.
•	SVG visualizations of the input blocks and the trapped water.
•	Invalid inputs or errors will show clear messages.
________________________________________
Logging
•	Logs are saved in the Logs directory inside the project folder.
•	Step Logs: Saved as Logs/WaterTankSteps-YYYY-MM-DD.log. Includes informational and debug logs.
•	Error Logs: Saved as Logs/WaterTankErrors-YYYY-MM-DD.log. Includes error and critical logs.
•	Logs rotate daily, with retention configured in Program.cs.

