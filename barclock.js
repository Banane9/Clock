barClock = function(canvasId, radius, space, HSVCenter, HSVBorder)
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
			
			//Convert the RGB to Hex
			this.context.fillStyle = this.fillStyle[degrees];
			this.context.strokeStyle = this.strokeStyle[degrees];
			
			//Draw the bars
			this.context.fill();
			this.context.stroke();
			
			if (this.timeUnits[i] != "Milliseconds")
			{
				this.context.fillStyle = "#000000";
				this.context.font = (this.space ? 0.3 : 0.7) * this.barWidth + "px Arial";
				this.context.textAlign = "center";
				this.context.textBaseline = "left";
				
				//PI Values shifted + 1.5PI
				var textRadius =  -(centerRadius); //radians[this.timeUnits[i]] > 2 * Math.PI && radians[this.timeUnits[i]] < 3 * Math.PI ? -(centerRadius) : centerRadius;
				var textAngle = space ? -((1 / i) * 1.2) : -((1 / i) * 2.5); //radians[this.timeUnits[i]] > 2 * Math.PI && radians[this.timeUnits[i]] < 3 * Math.PI ? -(1 / i) : 1 / i;
				var textOffset = 0; //radians[this.timeUnits[i]] > 2 * Math.PI && radians[this.timeUnits[i]] < 3 * Math.PI ? -(radians[this.timeUnits[i]]) + 0.7 * Math.PI : -(radians[this.timeUnits[i]]) - 0.7 * Math.PI;
				drawTextAlongArc(this.context, Math.floor(times[this.timeUnits[i]]) + " " + this.timeUnits[i], this.center, this.center, textRadius, textAngle, textOffset);
			}
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
	this.space = space ? true : false;
	
	//Time units
	this.timeUnits = ["Milliseconds", "Seconds", "Minutes", "Hours", "Days"];
	
	//Width for the bars and between them
	this.barWidth = (radius - 2) / this.timeUnits.length; //radius - 2 for a little padding (anti-aliasing looks weird on border)
	
	//previous[X] vars
	this.previous = {Milliseconds: 0, Seconds: 0, Minutes: 0, Hours: 0, Days: 0};
	
	this.clockwise = {Milliseconds: false, Seconds: false, Minutes: false, Hours: false, Days: false};
	
	//style
	this.fillStyle = [];
	this.strokeStyle = [];
	//For Center
	if (HSVCenter != null)
	{
		if (HSVCenter.H == "auto")
		{
			for (i = 0; i <= 360; i++)
			{
				this.fillStyle[i] = RGB2Hex(HSV2RGB({H: i, S: HSVCenter.S, V: HSVCenter.V}));
			}
		}
		else
		{
			var hex = RGB2Hex(HSV2RGB({H: HSVCenter.H, S: HSVCenter.S, V: HSVCenter.V}));
			for (i = 0; i <= 360; i++)
			{
				this.fillStyle[i] = hex;
			}
		}
	}
	else
	{
		for (i = 0; i <= 360; i++)
		{
			this.fillStyle[i] = RGB2Hex(HSV2RGB({H: i, S: 50, V: 100}));
		}
	}
	//For Border
	if (HSVBorder != null)
	{
		if (HSVBorder.H == "auto")
		{
			for (i = 0; i <= 360; i++)
			{
				this.fillStyle[i] = RGB2Hex(HSV2RGB({H: i, S: HSVBorder.S, V: HSVBorder.V}));
			}
		}
		else
		{
			var hex = RGB2Hex(HSV2RGB({H: HSVBorder.H, S: HSVBorder.S, V: HSVBorder.V}));
			for (i = 0; i <= 360; i++)
			{
				this.fillStyle[i] = hex;
			}
		}
	}
	else
	{
		for (i = 0; i <= 360; i++)
		{
			this.strokeStyle[i] = RGB2Hex(HSV2RGB({H: i, S: 100, V: 60}));
		}
	}
}