const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentweatheritemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const country = document.getElementById('country');
const weatherforecastEl = document.getElementById('weather-forecast');
const currenttempEl = document.getElementById('current-temp');

let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 
'Thursday', 'Friday', 'Saturday'];
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = '76def54546a7aeee85452ff32c50138f';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursin12hrformat = hour >= 13 ? hour%12 : hour
    const minute = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursin12hrformat<10 ? '0'+hoursin12hrformat : hoursin12hrformat) 
    + ':' + (minute<10 ? '0'+ minute : minute) + ' ' + `<span id="am-pm">${ampm}</span>`
    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]
}, 1000);
getWeatherData()
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        let {latitude, longitude} = success.coords;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data);

            showWeatherdata(data);
        })
    })
}

function showWeatherdata(data) {
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;

    timezone.innerHTML = data.timezone;
    country.innerHTML = data.lat + 'N ' + data.lon + 'E '
    currentweatheritemsEl.innerHTML =
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
        <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise*1000).format('HH:mm a')}</div>
    </div>
        <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    `;

    let otherDayForecast = '';
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            currenttempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>
            </div>
            `
        }
        else {
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>               
            </div>`
        }
    })

    weatherforecastEl.innerHTML = otherDayForecast;
}