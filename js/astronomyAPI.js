const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

function success(pos) {
    const crd = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    getAstronomicalImages(pos.coords)
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

document.addEventListener("DOMContentLoaded", (event) => {
    navigator.geolocation.getCurrentPosition(success, error, options);
});

function yyyymmdd() {
    var date = new Date()
  
    // Get year, month, and day part from the date
    var year = date.toLocaleString("default", { year: "numeric" })
    var month = date.toLocaleString("default", { month: "2-digit" })
    var day = date.toLocaleString("default", { day: "2-digit" })
  
    // Generate yyyy-mm-dd date string
    var formattedDate = year + "-" + month + "-" + day
    return formattedDate
}
  
function resetAPIImages() {
    let moonImg = document.getElementById('moon-phase')
    let starImg = document.getElementById('star-chart')
  
    moonImg.remove()
    starImg.remove()
}
  
//add a new function to the Date object
Date.prototype.getJulian = function() {
    //this divided by 86400000 reflects the days since epoch
    //1440 minutes in a day
    //(this.getTimezoneOffset() / 1440) subtracts the local systems timezone offset
    //2440587.5 is the number of days from 4713BC to 1970AD
    return Math.floor((this / 86400000) - (this.getTimezoneOffset() / 1440) + 2440587.5);
}
  
function reduceAngle (deg) {
    deg %= 360
    if (deg < 0) {
      deg += 360
    }
    return deg
}
  
function getAstronomicalImages(pickupLocation) {
    //remove the previously generated images
    document.querySelectorAll("#moon-phase img").forEach(img => img.remove());
    document.querySelectorAll("#star-chart img").forEach(img => img.remove());
  
    //get the selected latitude and longitude
    lat = pickupLocation.latitude
    long = pickupLocation.longitude
  
    //calculate declination based on observer's latitude
    declinationVar = parseFloat(lat)
  
    //calculate right ascension based on the time and the observer's longitude
    //equations from Astronomical Algorithms by Jean Meeus
    let today = new Date()
    let julianDay = today.getJulian()
    let t = ((julianDay - 2451545.0) / 36525)
    let theta0 = 280.46061837 + 360.98564736629 * (julianDay - 2451545.0) + (0.000387933 * t * t) - (t * t * t / 38710000.0)
    let gmstRA = reduceAngle(theta0)
    let lmstRA = gmstRA + long
    let rightAscensionVar = (lmstRA / 15)

    console.log(gmstRA)
    console.log(rightAscensionVar)
  
    //infinite loop until all resources in the page have been loaded
    while (1) {
      if (document.readyState === "complete" || document.readyState === "loaded") {
        //get the API
        const authString = btoa(`d17aac5e-d2d1-4534-9e47-36a1ec1cc000:e6066031a8c91e638c47fe8b135457a31e034eafc057e2be4770551214c0783f2d555a8b84f9d64dac093495325fd7746652ece4164dacb2f25eccf0b6f6aee3ce462823e719ef55608c916f0c7bd8855f6ccadcada43d1590118e99f90c930c28ba6caa6d20d7f6d60eb518b67e981d`);
        var client = new AstronomyAPI({
          basicToken: authString,
        });
  
        //make API call for moon phase image
        client.moonPhase(
          {
            element: "#moon-phase", // html element to target
            format: "png",
            style: {
              moonStyle: "default",
              backgroundStyle: "solid",
              backgroundColor: "#0a0f3c", //navy blue
              headingColor: "white",
              textColor: "white"
            },
            observer: {
              latitude: parseFloat(lat),
              longitude: parseFloat(long),
              date: yyyymmdd()
            },
            view: {
              type: "landscape-simple",
              orientation: "north-up"
            },
          },
          (re) => { // callback function
            console.log("moon phase done", re)
          },
        );
  
        //make API call for star chart image
        client.starChart(
          {
            element: "#star-chart", // html element to target
            style: "navy",
            observer: {
              latitude: parseFloat(lat),
              longitude: parseFloat(long),
              date: yyyymmdd()
            },
            view: {
              type: "area",
              parameters: {
                position: {
                  equatorial: {
                    rightAscension: rightAscensionVar,
                    declination: declinationVar
                  }
                },
                zoom: 3
              },
            },
          },
          (re) => { // callback function
            console.log("star chart done", re)
          },
        );
  
        break //ends the loop
      }
    }
}