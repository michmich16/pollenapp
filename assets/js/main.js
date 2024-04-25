document.addEventListener("DOMContentLoaded", function () {
    const myMapButton = document.getElementById('myMap');
    myMapButton.addEventListener('click', function () {
        clearContainer();
        buildMap();
    });
    const mySettingButton = document.getElementById('mySetting');
    mySettingButton.addEventListener('click', showToggleSwitches);
    const myHomeButton = document.getElementById('myHome');
    myHomeButton.addEventListener('click', retrieveDataFromLocalStorage);

    // Call getLocation when the page loads
    getLocation();

    // opdateer data fra API hver 30 min (1.800.000 millisek)
    setInterval(updateDataFromApi, 1800000);
});

function clearContainer() {
    const container = document.querySelector('.container');
    container.innerHTML = ''; // fjerner alle child elements
}

function buildMap() {
    const container = document.querySelector('.container');
    container.innerHTML = '<div id="map"></div>';

    const map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    map.locate({ setView: true, maxZoom: 16 });

    function onLocationFound(e) {
        const radius = e.accuracy / 2;
        L.marker(e.latlng).addTo(map)
            .bindPopup(`You are within ${radius} meters from this point`).openPopup();
        L.circle(e.latlng, radius).addTo(map);
    }

    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchLocationAndData(lat, lon);
        }, error => {
            console.error('Error getting location:', error.message);
        });
    } else {
        alert("Geolocation is not supported by this browser.")
    }
}

function fetchLocationAndData(lat, lon) {
    fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}&api_key=65fb5ea644244903025253axe09afbb`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Location API request failed');
            }
            return response.json();
        })
        .then(data => {
            const city = data.address.city;
            document.getElementById("location").innerText = city;
        })
        .catch(error => {
            console.error('Error fetching location:', error.message);
        });

    const timeZone = "Europe%2FBerlin";
    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,dust,ammonia,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,dust,ammonia,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=${timeZone}&forecast_days=1`)

        .then(response => {
            if (!response.ok) {
                throw new Error('Pollution API request failed');
            }
            return response.json();
        })
        .then(data => {
            // gemmer data i local storage
            const pollenData = {
                current: {
                    pm10: data.current.pm10,
                    pm2_5: data.current.pm2_5,
                    carbon_monoxide: data.current.carbon_monoxide,
                    nitrogen_dioxide: data.current.nitrogen_dioxide,
                    sulphur_dioxide: data.current.sulphur_dioxide,
                    dust: data.current.dust,
                    ammonia: data.current.ammonia,
                    alder_pollen: data.current.alder_pollen,
                    birch_pollen: data.current.birch_pollen,
                    grass_pollen: data.current.grass_pollen,
                    mugwort_pollen: data.current.mugwort_pollen,
                    olive_pollen: data.current.olive_pollen,
                    ragweed_pollen: data.current.ragweed_pollen
                }
            };
            // setInterval.Item gemmer sender data til localStorage
            localStorage.setItem('PollenData', JSON.stringify(pollenData));
            displayPollenData(pollenData);
        })
        .catch(error => {
            console.error('Error fetching pollution data:', error.message);
        });
}

// view code - display data til forsiden
function displayPollenData(data) {
    const currentData = data.current;
    const pollenDataHtml = `
        <section id="currentValues">
            <h2>Pollental</h2>
            <ul>
            <li>PM10 ${currentData.pm10} μg/m³</li>
            <li>PM2.5 ${currentData.pm2_5} μg/m³</li>
            <li>Carbon Monoxide ${currentData.carbon_monoxide} μg/m³</li>
            <li>Nitrogen Dioxide ${currentData.nitrogen_dioxide} μg/m³</li>
            <li>Sulphur Dioxide SO2 ${currentData.sulphur_dioxide} μg/m³</li>
            <li>Dust ${currentData.dust} μg/m³</li>
            <li>Ammonia NH3 ${currentData.ammonia} μg/m³</li>
            <li>El ${currentData.alder_pollen} p/m³</li>
            <li>Birk ${currentData.birch_pollen} p/m³</li>
            <li>Græs ${currentData.grass_pollen} p/m³</li>
            <li>Bynke ${currentData.mugwort_pollen} p/m³</li>                
            <li>Oliven ${currentData.olive_pollen} p/m³</li>
            <li>Ambrosia ${currentData.ragweed_pollen} p/m³</li>
            </ul>
        </section>`;
    let pollenDataSection = document.getElementById('PollenData');
    if (!pollenDataSection) {
        // ! check om sectionen er eksister ellers laver en ny en
        const container = document.querySelector('.container');
        pollenDataSection = document.createElement('section');
        pollenDataSection.id = 'PollenData';
        container.appendChild(pollenDataSection);
    }
    pollenDataSection.innerHTML = pollenDataHtml;
}

function showToggleSwitches() {
    const container = document.querySelector('.container');
    container.innerHTML = '' + '<h2>Vælg dine allergier</h2>'; // fjerner child elements
    const toggleContainer = document.createElement('div');
    toggleContainer.classList.add('toggle-container');

    const toggleNames = [
        'El',
        'Birk',
        'Græs',
        'Bynke',
        'Oliven',
        'Ambrosia'
    ];

    toggleNames.forEach(name => {
        const label = document.createElement('label');
        label.textContent = name;

        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.classList.add('toggle-input');
        toggleInput.addEventListener('change', toggleSwitchChanged);

        const toggleSlider = document.createElement('span');
        toggleSlider.classList.add('toggle-slider');

        label.appendChild(toggleInput);
        label.appendChild(toggleSlider);

        toggleContainer.appendChild(label);
    });

    container.appendChild(toggleContainer);
}

function toggleSwitchChanged(event) {
    const isChecked = event.target.checked;
    // gør noget med toggle switch. ikke færdig
    console.log('Toggle switch changed:', isChecked);
}

function retrieveDataFromLocalStorage() {
    clearContainer(); // Clear the container first
    const storedData = localStorage.getItem('PollenData');
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        displayPollenData(parsedData);
    } else {
        console.error('No stored data available.');
    }
}

function updateDataFromApi() {
    // Fetch new data from API and update local storage
    getLocation(); // This will trigger the entire process of fetching and updating
    console.log('Data updated from API.');
}