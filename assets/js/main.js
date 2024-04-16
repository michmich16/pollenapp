fetchPollenData()

function fetchPollenData() {
     //to do get timezone from date object
     const timeZone = "Europe%2FBerlin";
     const url = 'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=52.52&longitude=13.41&current=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&hourly=pm10,pm2_5'

fetch(url)
.then(result =>{
    if(!result.ok){
        throw new Error('Network response was not OK');
    }
    return console.log(result);
    
})
}