<?php
if (!isset($_GET["radius"]))
{
	$_GET["radius"] = 100;
}
$HSVCenter = "";
if (!empty($_GET["HSVCenter"]))
{
	$HSVCenter = ', {H: ';
	if ($_GET["HSVCenter"]["H"] == "auto")
	{
		$HSVCenter = $HSVCenter."'auto'";
	}
	else
	{
		$HSVCenter = $HSVCenter.$_GET["HSVCenter"]["H"];
	}
	$HSVCenter = $HSVCenter.', S: '.$_GET["HSVCenter"]["S"].', V: '.$_GET["HSVCenter"]["V"].'}';
}
$HSVBorder = "";
if (!empty($_GET["HSVBorder"]))
{
	$HSVBorder = ', {H: ';
	if ($_GET["HSVBorder"]["H"] == "auto")
	{
		$HSVBorder = $HSVBorder."'auto'";
	}
	else
	{
		$HSVBorder = $HSVBorder.$_GET["HSVBorder"]["H"];
	}
	$HSVBorder = $HSVBorder.', S: '.$_GET["HSVBorder"]["S"].', V: '.$_GET["HSVBorder"]["V"].'}';
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Bar Clock</title>
		<!-- Include the clock javascript file -->
		<script src="./colorConverter.js"></script>
		<script src="./drawUtils.js"></script>
		<script src="./barclock.js"></script>
	</head>
	<body>
		<!-- The canvas, with message for browsers not supporting it -->
		<canvas id="barclock" <?php echo 'width="'.($_GET["radius"] * 2).'" height="'.($_GET["radius"] * 2).'"'; ?> style="position:absolute; left:0px; top:0px;" onclick="drawInterval != null ? deactivateClock() : activateClock();">
			<p>Please use a browser that supports the HTML5 Canvas Element!</p>
		</canvas>
		<script>
			clock = new barClock("barclock", <?php echo $_GET["radius"].', '.$_GET["space"].$HSVCenter.$HSVBorder; ?>);
			
			activateClock = function()
			{
				drawInterval = setInterval(function() { clock.draw(); }, 60);
			}
			
			deactivateClock = function()
			{
				clearInterval(drawInterval);
				drawInterval = null;
			}
			
			activateClock();
		</script>
	</body>
</html>