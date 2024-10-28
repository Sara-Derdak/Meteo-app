import React, { useState } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function Grp203WeatherApp() {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({
    loading: false,
    data: null,  
    forecast: [],
    error: false,
  });

  const toDateFunction = () => {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const weekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const currentDate = new Date();
    const date = `${weekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    return date;
  };

  const search = async (city = null) => {
    const query = city || input;
    setWeather({ ...weather, loading: true });

    const urlWeather = 'https://api.openweathermap.org/data/2.5/weather';
    const urlForecast = 'https://api.openweathermap.org/data/2.5/forecast';
    const api_key = 'f00c38e0279b7bc85480c3fe775d518c';

    try {
      const resWeather = await axios.get(urlWeather, {
        params: {
          q: query,
          units: 'metric',
          appid: api_key,
        },
      });

      const resForecast = await axios.get(urlForecast, {
        params: {
          q: query,
          units: 'metric',
          appid: api_key,
        },
      });

      setWeather({
        data: resWeather.data,
        forecast: resForecast.data.list.filter((item, index) => index % 8 === 0),
        loading: false,
        error: false,
      });
    } catch (error) {
      console.error('Erreur API:', error.response);
      setWeather({ ...weather, data: null, forecast: [], error: true, loading: false });
    }
  };

  const saveCityToFavorites = () => {
    const favorites = getFavorites();
    if (!favorites.includes(input)) {
      favorites.push(input);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  };

  const loadFavoriteCity = (city) => {
    search(city);  // Trigger the search only when a favorite city is clicked
  };

  const getFavorites = () => {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  };


  return (
    <div className="App">
      
      <h1 className="app-name">Application Météo</h1>

      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Entrez le nom de la ville..."
          name="query"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button id="SearchCity" onClick={() => search()}>Chercher</button>
        <button id="AddCity" onClick={saveCityToFavorites}>Ajouter aux favoris</button>
      </div>
      <div className="favorites">
        <h3>Villes favorites :</h3>
        <ul>
          {getFavorites().map((city, index) => (
            <li key={index}>
              <button onClick={() => loadFavoriteCity(city)}>{city}</button>
            </li>
          ))}
        </ul>
      </div>


      {weather.loading && (
        <Oval type="Oval" color="black" height={100} width={100} />
      )}
      {weather.error && (
        <div className="error-message">
          <FontAwesomeIcon icon={faFrown} />
          <span>Ville introuvable</span>
        </div>
      )}
      {weather.data && weather.data.main && (
        <div id="xx">
          <h2>{weather.data.name}, {weather.data.sys.country}</h2>
          <span>{toDateFunction()}</span>
          <img
            src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
            alt={weather.data.weather[0].description}
          />
          <p>{Math.round(weather.data.main.temp)}°C</p>
          <p>Vitesse du vent {weather.data.wind.speed} m/s</p>
        </div>
      )}
      {weather.forecast && weather.forecast.length > 0 && (
        <div className="forecast">
          <h3>Prévisions Météo pour les 5 prochains jours</h3>
          <div className="forecast-container">
            {weather.forecast.slice(0, 5).map((day, index) => {
              const date = new Date(day.dt * 1000);
              return (
                <div key={index} className="forecast-item">
                  <h4>{date.toLocaleDateString()}</h4>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                  />
                  <p>{Math.round(day.main.temp)}°C</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Grp203WeatherApp;