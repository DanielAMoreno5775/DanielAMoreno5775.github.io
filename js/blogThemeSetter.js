//get the references to various elements
let body = document.getElementById('bodyTag');
let nav = document.getElementById('navbarTag');
let themeSelector = document.getElementById('theme');

function setCookie(cookieName, cookieValue, expirationDays) {
	const d = new Date();
	d.setTime(d.getTime() + (expirationDays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

function getCookie(cookieName) {
	let name = cookieName + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
	  let c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	  }
	}
	return "";
}

//  add in the CSS style options
themeSelector.innerHTML += `
        <option value='light' selected="selected">Light Mode</option>
		<option value='dark'>Dark Mode</option>
    `;

function getRGB(c) {
	return parseInt(c, 16) || c;
}

function getsRGB(c) {
	return getRGB(c) / 255 <= 0.03928
		? getRGB(c) / 255 / 12.92
		: Math.pow((getRGB(c) / 255 + 0.055) / 1.055, 2.4);
}

function getLuminance(hexColor) {
	return (
		0.2126 * getsRGB(hexColor.substr(1, 2)) +
		0.7152 * getsRGB(hexColor.substr(3, 2)) +
		0.0722 * getsRGB(hexColor.substr(-2))
	);
}

function getContrast(f, b) {
	const L1 = getLuminance(f);
	const L2 = getLuminance(b);
	return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

function getTextColor(bgColor) {
	const whiteContrast = getContrast(bgColor, "#ffffff");
	const blackContrast = getContrast(bgColor, "#000000");

	return whiteContrast > blackContrast ? "#ffffff" : "#000000";
}

function componentFromStr(numStr, percent) {
    var num = Math.max(0, parseInt(numStr, 10));
    return percent ?
        Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
}

function rgbToHex(rgb) {
    var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
    var result, r, g, b, hex = "";
    if ( (result = rgbRegex.exec(rgb)) ) {
        r = componentFromStr(result[1], result[2]);
        g = componentFromStr(result[3], result[4]);
        b = componentFromStr(result[5], result[6]);
    
        hex = "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    return hex;
}

//fucntion to set the theme
function setTheme (themeColor) {
	//remove current themes
	body.classList.remove('bg-light', 'bg-dark');
	
	//set variable for theme class based on Bootstrap format
	let theme = 'bg-'.concat(themeColor);
	
	//set new theme
	themeSelector.value = themeColor;
	body.classList.add(theme);
	
	//get new background color and calculate text color based on contrast ratio
	let rgbArray = [];
	let rgbSTR = window.getComputedStyle(body).backgroundColor;
	//assemble the rgb values into an array
	rgbArray[0] = rgbSTR.split(",")[0].split("(")[1];
	rgbArray[1] = rgbSTR.split(",")[1].trim();
	rgbArray[2] = rgbSTR.split(",")[2].split(")")[0].trim();
	let colorStr = rgbToHex(rgbSTR);
	let textColor = getTextColor(colorStr);

	//if the text color is white,
	if (textColor == "#ffffff") {
		let redValue = parseInt(rgbArray[0], 10) + 40
		let greenValue = parseInt(rgbArray[1], 10) + 40
		let blueValue = parseInt(rgbArray[2], 10) + 40
		let accentRGBSTR = "rgb(" + redValue + ", " + greenValue + ", " + blueValue + ")"
		accentStr = rgbToHex(accentRGBSTR)
	}
	//otherwise assume that the text color is black,
	else {
		let redValue = parseInt(rgbArray[0], 10) - 30
		let greenValue = parseInt(rgbArray[1], 10) - 30
		let blueValue = parseInt(rgbArray[2], 10) - 30
		let accentRGBSTR = "rgb(" + redValue + ", " + greenValue + ", " + blueValue + ")"
		accentStr = rgbToHex(accentRGBSTR)
	}
	
	//set colors
	body.style.color = textColor;
	nav.style.backgroundColor = textColor;
	nav.style.color = colorStr;
}

let colorCookie = getCookie("colorMode");
//if the cookie exists, use it
if (colorCookie != "") {
	setTheme (colorCookie);
	console.log("Cookie setter");
	console.log(colorCookie);
} else {
	setCookie("colorMode","light",366);
	setTheme ("light");
}

//  add an event listener to the style drop down list
//  when the list changes alter the css.href to be the new color theme from the drop down
//  save the new style to LS
choice = themeSelector.value;
theme.addEventListener('change', () => {
	choice = themeSelector.value;
	setTheme (choice);
	setCookie("colorMode",choice,366);
	console.log("event listener");
	console.log(choice);
} );