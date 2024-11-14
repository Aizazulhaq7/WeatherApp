



import axios from 'axios';
import React, { useState, useRef, useCallback } from 'react'
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import CloudRoundedIcon from '@mui/icons-material/CloudRounded';
import AirRoundedIcon from '@mui/icons-material/AirRounded';
import WaterRoundedIcon from '@mui/icons-material/WaterRounded';
import { debounce } from 'lodash';

const Weathercard = () => {

    const toDateFunction = () => {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        const WeekDays = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
        ];
        const currentDate = new Date();
        const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()}, ${months[currentDate.getMonth()]
            }`;
        return date;
    };
    
    const [input, setInput] = useState(""); 
    const [weather, setWeather] = useState({
        loading: false,
        data: {},
        error: false,
    });

    
    const isRequestInProgress = useRef(false);

    const fetchWeatherData = async (city) => {
        const url = 'https://api.openweathermap.org/data/2.5/weather';
        const api_key = 'e8daea13d3efd1bd16ba1ca903b6fabe';
        
        if (isRequestInProgress.current) return;

        isRequestInProgress.current = true; 
        setWeather({ ...weather, loading: true });

        try {
            const response = await axios.get(url, {
                params: {
                    q: city,
                    units: 'metric',
                    appid: api_key,
                },
            });
            setWeather({ data: response.data, loading: false, error: false });
        } catch (error) {
            console.log(error);
            setWeather({ error: true, loading: false, data: {} });
        }finally {
            isRequestInProgress.current = false; 
        }
    };
    
    const onSearch = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            const trimmedInput = input.trim();  
            if (trimmedInput === "") {
                alert('City name cannot be empty');
                return;
            } 
            fetchWeatherData(trimmedInput);
            setInput('');
        }
    };
    
    console.log(weather)

  return (
    <>
    <div>
    <h2 className='text-3xl text-white font-bold'>Weather App</h2>
    <br/><input value={input} className='focus:outline-none border mt-0 rounded-md mb-4 text-gray-600 placeholder-gray' onChange={(e) => setInput(e.target.value)} onKeyPress={onSearch} type='text' placeholder='Enter City...'></input>
    <br/><WbSunnyRoundedIcon className='text-white text-yellow-500' sx={{ fontSize: 80 }}></WbSunnyRoundedIcon>
    <CloudRoundedIcon className='text-white'sx={{ fontSize: 80 }}></CloudRoundedIcon><br/>
    <span className='text-3xl text-white'>
    {weather.data.main && <p className='text-6xl'>{Math.round(weather.data.main.temp)}°c</p>}
    </span>
    <div>
    <span className='text-2xl text-white'>
    {weather.data.name && <p className='text-4xl'>{weather.data.name}</p>}
    </span><br/>
    <p className='text-2xl text-white'>{toDateFunction()}</p><br/>
    <span className='text-2xl text-white'>
 <div className='flex items-center justify-center'>       
    <div className='flex items-center justify-center'>
    <WaterRoundedIcon></WaterRoundedIcon>
    {weather.data.main && <p>{weather.data.main.humidity}%</p>}
    </div>
    <div className='flex items-center justify-center ml-[70px]'>
    <AirRoundedIcon />
    {weather.data.wind && <p>{weather.data.wind.speed} m/s</p>}
    </div>
    </div>
    <div className='flex items-center justify-center'>
    <p className='text-sm'>Humidity</p>
    <p className='text-sm ml-[95px]'>Wind Speed</p>
    </div>
    </span>
    </div>
    </div>
    </>
  )
}

export default Weathercard

