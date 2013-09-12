HSV2RGB = function(HSV)
{
	//Check that all input values are valid
	if (HSV.V < 0 || HSV.V > 360 || HSV.S < 0 || HSV.S > 100 || HSV.V < 0 || HSV.V > 100) return false;
	//If S is 0 the colour is a standard grey and all RGB values are equal to V
	if (HSV.S == 0) return {R: HSV.V, G: HSV.V, B: HSV.V};
	
	//Adjust S and V
	HSV.S /= 100;
	HSV.V /= 100;
	
	//Get the chroma
	var c = HSV.V * HSV.S;
	
	//Value of highest r, g, or b
	h = (HSV.H / 60);
	
	//Value for second highest r, g, or b
	var x = c * (1 - Math.abs((h % 2) - 1));
	
	var RGB = {R: 0, G: 0, B: 0};
	
	switch(Math.floor(h))
	{
		case 1:
			RGB.R = x;
			RGB.G = c;
			break;
		case 2:
			RGB.G = c;
			RGB.B = x;
			break;
		case 3:
			RGB.G = x;
			RGB.B = c;
			break;
		case 4:
			RGB.R = x;
			RGB.B = c;
			break;
		case 5:
			RGB.R = c;
			RGB.B = x;
			break;
		default: // 0 and 6
			RGB.R = c;
			RGB.G = x;
			break;
	}
	
	var m = HSV.V - c;
	
	return {R: Math.round((RGB.R + m) * 255), G: Math.round((RGB.G + m) * 255), B: Math.round((RGB.B + m) * 255)};
};

RGB2Hex = function(RGB)
{
	var hex = (((RGB.R << 8) + RGB.G) << 8) + RGB.B;
	var hexString = hex.toString(16);
	//Make the string fit #RRGGBB
	while (hexString.length < 6)
	{
		hexString = "0" + hexString;
	}
	return "#" + hexString;
};