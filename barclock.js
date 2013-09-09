barClock = function(canvasId, radius, space)
{
	this.draw = function()
	{
		var date = new Date();
		var daysInMonth = new Date(date.getYear(), date.getMonth(), 0).getDate();
		
		//Convert times to radians and include lower unit
		var radians = [];
		radians.Milliseconds = date.getMilliseconds() * (2 / 1000);
		radians.Seconds = (date.getSeconds() * (2 / 60)) + (radians.Milliseconds / 1000);
		radians.Minutes = (date.getMinutes() * (2 / 60)) + (radians.Seconds / 60);
		radians.Hours = (date.getHours() * (2 / 24)) + (radians.Minutes / 60);
		radians.Days = (date.getDay() * (2 / daysInMonth)) + (radians.Hours / 24);
		
		//Render bars
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (i = 0; i < this.timeUnits.length; i++)
		{
			if (radians[this.timeUnits[i]] < this.previous[this.timeUnits[i]])
			{
				this.clockwise[this.timeUnits[i]] = !this.clockwise[this.timeUnits[i]];
			}
			this.previous[this.timeUnits[i]] = radians[this.timeUnits[i]];
			
			var outerRadius = this.barWidth * (1 + i);
			this.context.beginPath();
			this.context.arc(this.center, this.center, outerRadius, 1.5 * Math.PI, 1.5 * Math.PI + radians[this.timeUnits[i]] * Math.PI, this.clockwise[this.timeUnits[i]]);
			this.context.arc(this.center, this.center, outerRadius - (this.space ? 0.5 * this.barWidth : this.barWidth - 1), 1.5 * Math.PI + radians[this.timeUnits[i]] * Math.PI, 1.5 * Math.PI, !this.clockwise[this.timeUnits[i]]);
			this.context.closePath();
			this.context.fillStyle = this.fillStyle[this.timeUnits[i]];
			this.context.strokeStyle = this.strokeStyle[this.timeUnits[i]];
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