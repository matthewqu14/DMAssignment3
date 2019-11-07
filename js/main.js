
// SVG Size
var width = 700,
	height = 500;

var regions = [];

// Load CSV file
d3.csv("data/wealth-health-2014.csv", function(data) {

	// Analyze the dataset in the web console

	console.log(data);
	console.log("Countries: " + data.length);
	var preparedData = prepareData(data);
	createVisualization(preparedData);
});

var prepareData = function(data) {

	// Step 1: Analyze and prepare the data
	// Use the web console to get a better idea of the dataset
	// Convert numeric values to numbers.
	// Make sure the regions array has the name of each region

	data.forEach(function(d) {
		d.LifeExpectancy = +d.LifeExpectancy;
		d.Income = +d.Income;
		d.Population = +d.Population;
		if (!regions.includes(d.Region)) {
			regions.push(d.Region);
		}
	});
	// Step 11
	data.sort(function(a, b) {
		return b.Population - a.Population
	});
	return data;
};

var createVisualization = function(data) {

	// Step 2: Append a new SVG area with D3
	// The ID of the target div container in the html file is #chart-area
	// Use the margin convention with 50 px of bottom padding and 30 px of padding on other sides!

	// Margins are slightly adjusted to account for Step 9: vertical axis label
	var margin = {top: 30, right: 30, bottom: 50, left: 80};

	var width = 850 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom;

	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Step 3: Create linear scales by using the D3 scale functions
	// You will need an income scale (x-axis) and a scale function for the life expectancy (y-axis).
	// Call them incomeScale and lifeExpectancyScale.
	// Use d3.extent() for the input domain
	// Use the variables height and width for the output range

	var incomeScale = d3.scaleLinear()
		.domain(d3.extent(data, function(d) {
			return d.Income - 2000; // Step 8 buffer
		}))
		.range([0, width]);

	var lifeExpectancyScale = d3.scaleLinear()
		.domain(d3.extent(data, function(d) {
			return d.LifeExpectancy - 1; // Step 8 buffer
		}))
		.range([height, 0]);

	// Step 4: Try the scale functions
	// You can call the functions with example values and print the result to the web console.

	console.log(incomeScale(5000));
	console.log(lifeExpectancyScale(68));

	// Step 5: Map the countries to SVG circles
	// Use select(), data(), enter() and append()
	// Instead of setting the x- and y-values directly,
	// you have to use your scale functions to convert the data values to pixel measures

	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function(d) {
			return incomeScale(d.Income);
		})
		.attr("cy", function(d) {
			return lifeExpectancyScale(d.LifeExpectancy);
		})
		.attr("r", function(d) {
			// Step 10
			var radiusScale = d3.scaleLinear()
				.domain(d3.extent(data, function(d) {
					return d.Population;
				}))
				.range([4, 30]);
			return radiusScale(d.Population);
		})
		.attr("fill", function(d) {
			// Step 12
			var colorScale = d3.scaleLinear()
				.domain([0, regions.length])
				.range(["yellow", "blue"]);
			for (var i = 0; i < regions.length; i++) {
				if (d.Region === regions[i]) {
					return colorScale(i);
				}
			}
		})
		.attr("stroke", "black");

	// Step 6: Use your scales (income and life expectancy) to create D3 axis functions

	var xAxis = d3.axisBottom().scale(incomeScale).ticks(15);
	var yAxis = d3.axisLeft().scale(lifeExpectancyScale).ticks(20);

	// Step 7: Append the x- and y-axis to your scatterplot
	// Add the axes to a group element that you add to the SVG drawing area.
	// Use translate() to change the axis position

	svg.append("g")
		.attr("class", "axis xAxis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "axis yAxis")
		.call(yAxis);

	// Step 8: Refine the domain of the scales
	// Notice that some of the circles are positioned on the outer edges of the svg area
	// You can include buffer values to widen the domain and to prevent circles and axes from overlapping

	// Step 9: Label your axes

	svg.append("g")
			.attr("class", "x label")
			.attr("transform", "translate(" + (width / 2) + "," + (height + 40) + ")")
			.append("text")
			.attr("text-anchor", "middle")
			.text("Income");

	svg.append("g")
		.attr("class", "y label")
		.attr("transform", "translate(-30," + (height / 2) + ")")
		.append("text")
		.attr("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.text("Life Expectancy");

	// Step 10: Add a scale function for the circle radius
	// Create a population-dependent linear scale function. The radius should be between 4 - 30px.
	// Then use the scale function to specify a dynamic radius

	// Step 11: Change the drawing order
	// Larger circles should not overlap or cover smaller circles.
	// Sort the countries by population before drawing them.


	// Step 12: Color the circles (countries) depending on their regions
	// Use a D3 color scale

};