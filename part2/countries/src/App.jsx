import { useState, useEffect } from 'react'
import countryService from './services/countries.js'
import './App.css'
import axios from 'axios'

//Helper component for single country view
const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null)

  const capital = country.capital?.[0]
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY
  
  useEffect(() => {
    if (!capital) return

    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.error('Error fetching weather data:', error)
      })
  }, [capital, apiKey])
  
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital {country.capital?.[0]}</p>
      <p>Area {country.area}</p>

      <h3>Languages:</h3>
      <ul style={{ listStyleType: 'disc', paddingLeft: '30px' }}> 
        {Object.values(country.languages || {}).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={country.flags.alt || `Flag of ${country.name.common}`}
        width="180"
        style={{ marginTop: '15px' }}
      />

      {/* Render Weather Section when loaded */}
      {weather && (
        <div>
          <h3>Weather in {capital}</h3>
          <p>Temperature {weather.main.temp} Celsius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>Wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}
      
const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])

  // 1. Fetch all countries once when app loads
  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  // Event handler
  const handleChange = (event) => {
    setValue(event.target.value)
  }

  // helper function to show a country when clicking its button
  const handleShowCountry = (countryName) => {
    setValue(countryName)
}

  // 2. Filter countries based on input
  const matches = value
    ? countries.filter(c => c.name.common.toLowerCase().includes(value.toLowerCase()))
    : []

    const exactMatch = matches.find(c => c.name.common.toLowerCase() === value.toLowerCase())

    const filteredCountries = exactMatch ? [exactMatch] : matches
  return (
    <div>
      <div>
        find countries <input value={value} onChange={handleChange} />
      </div>
        
      {/* Conditional rendering logic */}
        {filteredCountries.length > 10 && (
          <p>Too many matches, specify another filter</p>
        )}

      {/* Between 2 and 10 matches: (list + "show" buttons) */}
      
      {filteredCountries.length <= 10 && filteredCountries.length > 1 && (
        <div>
          {filteredCountries.map(country => (
            <div key={country.cca3}>
              {country.name.common}{' '}
              <button onClick={() => setValue(country.name.common)}>
                show
              </button>
            </div>
          ))}
        </div>
        )}

        {filteredCountries.length == 1 && (
          <CountryDetail country={filteredCountries[0]} />
        )}
      </div>
    )
}

export default App
