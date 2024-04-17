// write cool JS hwere!!

getLocation()


function getLocation() {

    if (navigator.geolocation) {

        //  navigator.geolocation.getCurrentPosition requires a succes function name as first param and a error function name as second param.

        navigator.geolocation.getCurrentPosition(PositionReceived, geoError);

    } else {
        alert("Geolocation is not supported by this browser.")
    }
}

// Geo location succes function recieves a data object 
function PositionReceived(position) {
    //console.log(position);

    // get location name
    GetHumanReadableLocation(position.coords.latitude, position.coords.longitude)

    // get pollen data on location
    GetPollenData(position.coords.latitude, position.coords.longitude)
}

//geo error function recievs a data object
function geoError(error) {

    console.log(error.message);
}


function GetHumanReadableLocation(lat, long) {

    const apiKey = "65fb5ea644244903025253axe09afbb";
    const url = `https://geocode.maps.co/reverse?lat=${lat}&lon=${long}&api_key=${apiKey}`;

    fetch(url)

        .then(response => {



            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();
        })
        .then(data => {


            BuildlocationName(data.address.city)

        })
        .catch(error => {
            console.error('Error fetching data:', error);
            return null;
        });
}

function GetPollenData(lat, long) {

    //to do get timezone from date object
    const timeZone = "Europe%2FBerlin";

    const url = ` https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${long}&current=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=${timeZone}&forecast_days=1`;


    fetch(url)

        .then(response => {



            if (!response.ok) {
                throw new Error('Network response was not ok');
            }


            return response.json();
        })
        .then(data => {


            pollenDataScructure(data)

        })
        .catch(error => {
            console.error('Error fetching data:', error);
            return null;
        });
}


// controller
function pollenDataScructure(data) {

    let myViewData = []

    // data about current values
    myViewData.push(data.current)


    // generate Hour data

    let myHourlyData = []

    // console.log(data.hourly);


    // data.hourly.time.map((myTime, index) => {
    //     let myHourData = {}

    //     myHourData.time = myTime

    //     myHourData.alder_pollen = data.hourly.alder_pollen[index]
    //     myHourData.birch_pollen = data.hourly.birch_pollen[index]
    //     myHourData.grass_pollen = data.hourly.grass_pollen[index]
    //     myHourData.mugwort_pollen = data.hourly.mugwort_pollen[index]
    //     myHourData.olive_pollen = data.hourly.olive_pollen[index]
    //     myHourData.ragweed_pollen = data.hourly.ragweed_pollen[index]


    //     // console.log("myHourData: " + myHourData);
    //     myHourlyData.push(myHourData)

    // })

    // console.log(myHourlyData);
    myViewData.push(myHourlyData)

    BuildPollenView(myViewData)


}




// view code

// builds a pollen data view with current data and hourly 24 hor data recieved in an array
function BuildPollenView(viewData) {

    // build current section
    let myDisplayElement = document.getElementById('PollenData')

    let myCurrentData = viewData[0]
    // generate Card HTML for current values
    let myCurrentHTML = `<section id="currentValues"><h2>Pollental</h2><ul>
                <li>El ${myCurrentData.alder_pollen} p/m³</li>
                <li>Birk ${myCurrentData.birch_pollen} p/m³</li>
                <li>Græs ${myCurrentData.grass_pollen} p/m³</li>
                <li>Bynke ${myCurrentData.mugwort_pollen} p/m³</li>
                 <li>Oliven ${myCurrentData.olive_pollen} p/m³</li>
                   <li>Ambrosia ${myCurrentData.ragweed_pollen} p/m³</li>
            </ul>
        </section>`

    myDisplayElement.innerHTML = myCurrentHTML


    // build hours from HourData viewData[1]

    //   let myHourViewHTML = '<section id="hours"><h2>time visning</h2>'
 
    //  let myHourdata = viewData[1]
 
    //  myHourdata.map((myHour) => {
    //      let myCurrentHTML = `<section class="hourcard"><h3>${myHour.time}</h3><ul>
    //              <li>El ${myHour.alder_pollen}</li>
    //              <li>Birk ${myHour.birch_pollen}</li>
    //              <li>Græs ${myHour.grass_pollen}</li>
    //              <li>Bynke ${myHour.mugwort_pollen}</li>
    //               <li>Oliven ${myHour.olive_pollen}</li>
    //                 <li>Ambrosia ${myHour.ragweed_pollen}</li>
    //          </ul>
    //      </section>`
    //      myHourViewHTML += myCurrentHTML
    //  })
 
 
    //  myHourViewHTML += '</section>'
    //  myDisplayElement.innerHTML += myHourViewHTML 
}


// sets location name in dom
function BuildlocationName(myCity) {

    //console.log(myCity);
    let myNameElement = document.getElementById("location")
    myNameElement.innerText = myCity

}