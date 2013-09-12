barClock = function(canvasId, radius, space)
{
	this.draw = function()
	{
		var date = new Date();
		var daysInMonth = new Date(date.getYear(), date.getMonth(), 0).getDate();
		
		//Include lower units in the time
		var times = []
		times.Milliseconds = date.getMilliseconds();
		times.Seconds = date.getSeconds() + (times.Milliseconds / 1000);
		times.Minutes = date.getMinutes() + (times.Seconds / 60);
		times.Hours = date.getHours() + (times.Minutes / 60);
		times.Days = date.getDate() + (times.Hours / 24);
		
		//Convert times to radians
		var radians = [];
		radians.Milliseconds = 1.5 * Math.PI + (times.Milliseconds * (2 / 1000)) * Math.PI;
		radians.Seconds = 1.5 * Math.PI + (times.Seconds * (2 / 60)) * Math.PI;
		radians.Minutes = 1.5 * Math.PI + (times.Minutes * (2 / 60)) * Math.PI;
		radians.Hours = 1.5 * Math.PI + (times.Hours * (2 / 24)) * Math.PI;
		radians.Days = 1.5 * Math.PI + (times.Days * (2 / daysInMonth)) * Math.PI;
		
		//Render bars
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (i = 0; i < this.timeUnits.length; i++)
		{
			//Change adding/removing if the bar completes the circle
			if (times[this.timeUnits[i]] < this.previous[this.timeUnits[i]])
			{
				this.clockwise[this.timeUnits[i]] = !this.clockwise[this.timeUnits[i]];
			}
			this.previous[this.timeUnits[i]] = times[this.timeUnits[i]];
			
			//Calculate Radii
			var outerRadius = this.barWidth * (1 + i);
			var innerRadius = outerRadius - (this.space ? 0.5 * this.barWidth : (i == 0 ? this.barWidth : this.barWidth - 1));
			var centerRadius = outerRadius - (outerRadius - innerRadius) / 2;
			
			//Centre of the bar at the end
			var barCenterEnd = {};
				barCenterEnd.x = this.center + centerRadius * Math.cos(radians[this.timeUnits[i]]);
				barCenterEnd.y = this.center + centerRadius * Math.sin(radians[this.timeUnits[i]]);
			//Centre of the bar at the start
			var barCenterStart = {};
				barCenterStart.x = this.center + centerRadius * Math.cos(1.5 * Math.PI);
				barCenterStart.y = this.center + centerRadius * Math.sin(1.5 * Math.PI);
			
			//Draw the bar
			this.context.beginPath();
			//Draw outer arc of the bar
			this.context.arc(this.center, this.center, outerRadius, 1.5 * Math.PI, radians[this.timeUnits[i]], this.clockwise[this.timeUnits[i]]);
			//draw dome at the end of bar
			this.context.arc(barCenterEnd.x, barCenterEnd.y, (outerRadius - innerRadius) / 2, radians[this.timeUnits[i]], radians[this.timeUnits[i]] - Math.PI);
			//draw inner arc of the bar
			this.context.arc(this.center, this.center, innerRadius, radians[this.timeUnits[i]], 1.5 * Math.PI, !this.clockwise[this.timeUnits[i]]);
			//draw dome at the start of the bar
			this.context.arc(barCenterStart.x, barCenterStart.y, (outerRadius - innerRadius) / 2, 0.5 * Math.PI, -0.5 * Math.PI, true);
			this.context.closePath();
			
			//Convert the radians into degrees
			var degrees = Math.round((radians[this.timeUnits[i]] - (1.5 * Math.PI)) * (180 / Math.PI));
			
			//Create the colours for the bar centre and border
			var rgbCenter = HSV2RGB({H: degrees, S: 100, V: 100});
			var rgbBorder = HSV2RGB({H: degrees, S: 100, V: 60});
			
			//Convert the RGB to Hex
			this.context.fillStyle = RGB2Hex(rgbCenter.R, rgbCenter.G, rgbCenter.B);
			this.context.strokeStyle = RGB2Hex(rgbBorder.R, rgbBorder.G, rgbBorder.B);
			
			//Draw the bars
			this.context.fill();
			this.context.stroke();
		}
	};
	
	this.setRadius = function(radius)
	{
		var nRadius = parseInt(radius);
		if (nRadius > 0)
		{
			this.canvas.width = 2 * nRadius;
			this.canvas.height = 2 * nRadius;
			this.center = nRadius;
			this.barWidth = (nRadius - 2) / (this.timeUnits.length + 1);
		}
	};
	
	//Canvas & Context
	this.canvas = document.getElementById(canvasId);
		this.canvas.width = 2 * radius;
		this.canvas.height = 2 * radius;
	this.center = radius;
	this.context = this.canvas.getContext("2d");
	this.space = space ? space : false;
	
	//Time units
	this.timeUnits = ["Milliseconds", "Seconds", "Minutes", "Hours", "Days"];
	
	//Width for the bars and between them
	this.barWidth = (radius - 2) / this.timeUnits.length; //radius - 2 for a little padding (anti-aliasing looks weird on border)
	
	//previous[X] vars
	this.previous = {Milliseconds: 0, Seconds: 0, Minutes: 0, Hours: 0, Days: 0};
	
	this.clockwise = {Milliseconds: false, Seconds: false, Minutes: false, Hours: false, Days: false};
	
	//style
	this.fillStyle = {Milliseconds: "#FF0000", Seconds: "#FFFF00", Minutes: "#00FF00", Hours: "#0000FF", Days: "#FF00FF"};
	this.strokeStyle = {Milliseconds: "#CC0000", Seconds: "#CCCC00", Minutes: "#00CC00", Hours: "#0000CC", Days: "#CC00CC"};
}