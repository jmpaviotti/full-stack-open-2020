import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Search = ({ value, handler }) => {
  return (
    <div>
      find countries: <input value={value} onChange={handler} />
    </div>
  );
};

const CountryInfo = ({ country }) => {
  const [weather, setWeather] = useState({});

  useEffect(() => {
    axios
      .get('http://api.weatherstack.com/current', {
        params: {
          access_key: process.env.REACT_APP_API_KEY,
          query: country.name,
        },
      })
      .then((response) => {
        setWeather(response.data.current);
      });
  }, [country.name]);

  return (
    <div>
      <h2>{country.name}</h2>
      <div> capital {country.capital}</div>
      <div> population {country.population}</div>
      <h3>languages</h3>
      <ul>
        {country.languages.map((el) => (
          <li key={el.name}>{el.name}</li>
        ))}
      </ul>
      <img
        src={country.flag}
        alt={`${country.name}'s flag`}
        width="100px"
        height="100px"
      />
      <h3>Weather in {country.name}</h3>
      <div>
        <strong>temperature:</strong> {weather.temperature} celsius
      </div>
      <img src={weather.weather_icons} alt={weather.weather_descriptions} />
      <div>
        <strong>wind:</strong> {weather.wind_speed} mph direction{' '}
        {weather.wind_dir}
      </div>
    </div>
  );
};

const Country = ({ element, handler }) => {
  return (
    <div>
      {element.name}
      <button onClick={() => handler(element)}>show</button>
    </div>
  );
};

const Countries = ({ array, button }) => {
  if (array.length > 10) {
    return <div>Too many matches, specify another search query.</div>;
  } else if (button.display) {
    return <CountryInfo country={button.display} />;
  } else if (array.length === 1) {
    return <CountryInfo country={array[0]} />;
  }

  return (
    <div>
      {array.map((country) => (
        <Country
          key={country.name}
          element={country}
          handler={button.handler}
        />
      ))}
    </div>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState('');
  const [showCountry, setShowCountry] = useState('');

  // Searchbar handler
  const onSearch = (event) => {
    setQuery(event.target.value.toLowerCase());
    setShowCountry('');
  };

  // Show button handler
  const toggleShowCountry = (country) => {
    setShowCountry(country);
  };

  // Initial fetch
  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all').then((response) => {
      setCountries(response.data);
    });
  }, []);

  // Filter countries
  const countriesFiltered = countries.filter(
    (country) => country.name.toLowerCase().indexOf(query) !== -1
  );

  return (
    <div>
      <Search value={query} handler={onSearch} />
      <Countries
        array={countriesFiltered}
        button={{ display: showCountry, handler: toggleShowCountry }}
      />
    </div>
  );
};

export default App;
