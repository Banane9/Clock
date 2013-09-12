HSV2RGB = function(HSV)
{
	if (HSV.V < 0 || HSV.V > 360 || HSV.S < 0 || HSV.S > 100 || HSV.V < 0 || HSV.V > 100) return false;
	
	//Adjust S and V
	HSV.S /= 100;
	HSV.V /= 100;
	
	//Get the chroma
	var c = HSV.V * HSV.S;
	
	//Value of highest r, g, or b
	var h = HSV.H / 60;
	
	//Value for second highest r, g, or b
	var x = c * (1 - Math.abs(h % 2 - 1));
	
	var RGB = {R: 0, G: 0, B: 0};
	
	if (h < 1) //between 0 and 1
	{
		RGB.R = c;
		RGB.G = x;
	}
	else if (1 <= h && h < 2)
	{
		RGB.R = x;
		RGB.G = c;
	}
	else if (2 <= h && h < 3)
	{
		RGB.G = c;
		RGB.B = x;
	}
	else if (3 <= h && h < 4)
	{
		RGB.G = x;
		RGB.B = c;
	}
	else if (4 <= h && h < 5)
	{
		RGB.R = x;
		RGB.B = c;
	}
	else //h > 5
	{
		RGB.R = c;
		RGB.B = x;
	}
	
	var m = HSV.V - c;
	return {R: Math.round((RGB.R + m) * 255), G: Math.round((RGB.G + m) * 255), B: Math.round((RGB.B + m) * 255)};
};

RGB2Hex = function(r, g, b)
{
	var hex = (((r << 8) + g) << 8) + b;
	var hexString = "#" + hex.toString(16);
	var a = hexString.length;
	while (a < 7)
	{
		hexString += "0";
		a++;
	}
	return hexString;
};