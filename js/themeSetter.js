//get the references to various elements
let body = document.getElementById('bodyTag');
let nav = document.getElementById('navbarTag');
let themeSelector = document.getElementById('theme');
let table = document.getElementById('placeholderTable');
let tableHeader = document.getElementById('placeholderTableHeader');
let footer = document.getElementById('footer');
let tableOfContentsLinks = document.getElementById('toc').getElementsByTagName('a');
let tableOfContentsButtons = document.getElementById('toc').getElementsByTagName('button');
let areaHeaders = document.getElementsByClassName('gradient');

//  add in the CSS style options
themeSelector.innerHTML += `
        <option value='light' selected="selected">Light</option>
		<option value='dark'>Dark</option>
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
	table.classList.remove('table-light', 'table-dark');
	tableHeader.classList.remove('thead-light', 'thead-dark');
	for(var i = 0, length = tableOfContentsButtons.length; i < length; i++) {
        tableOfContentsButtons[i].classList.remove('btn-light', 'btn-dark');
    }
	
	
	//set variable for theme class based on Bootstrap format
	let theme = 'bg-'.concat(themeColor);
	let tableColor = 'table-'.concat(themeColor);
	let headerColor = 'thead-'.concat(themeColor);
	let buttonColor = 'btn-'.concat(themeColor);
	
	//set new theme
	themeSelector.value = themeColor;
	body.classList.add(theme);
	table.classList.add(tableColor);
	tableHeader.classList.add(headerColor);
	for(var i = 0, length = tableOfContentsButtons.length; i < length; i++) {
        tableOfContentsButtons[i].classList.add(buttonColor);
    }
	
	//get new background color and calculate text color based on contrast ratio
	let rgbArray = [];
	let rgbSTR = window.getComputedStyle(body).backgroundColor;
	rgbArray[0] = rgbSTR.split(",")[0].split("(")[1];
	rgbArray[1] = rgbSTR.split(",")[1].trim();
	rgbArray[2] = rgbSTR.split(",")[2].split(")")[0].trim();
	let colorStr = rgbToHex(rgbSTR);
	let textColor = getTextColor(colorStr);
	
	//set colors
	body.style.color = textColor;
	nav.style.backgroundColor = textColor;
	nav.style.color = colorStr;
	footer.style.color = textColor;
	for(var i = 0, length = tableOfContentsLinks.length; i < length; i++) {
        tableOfContentsLinks[i].style.color = textColor;
    }
}

//  If there is an entry in LS for the style for this page use it
let activeTab = document.title;
let themeColor = localStorage.getItem(activeTab);
if ( themeColor !== null) {
	setTheme (themeColor);
	console.log("LS setter");
	console.log(themeColor);
}

//  add an event listener to the style drop down list
//  when the list changes alter the css.href to be the new color theme from the drop down
//  save the new style to LS
choice = themeSelector.value;
theme.addEventListener('change', () => {
	choice = themeSelector.value;
	setTheme (choice);
    localStorage.setItem(activeTab, choice);
	console.log("event listener");
	console.log(choice);
} );