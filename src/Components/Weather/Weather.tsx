import { useState, useRef } from "react";
import type { FormEvent } from "react";

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: Array<{
    main: string;
    icon: string;
  }>;
  sys: {
    country: string;
  };
}

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
const apiUrl = import.meta.env.VITE_WEATHER_BASE_URL;

const Weather: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(false);
  const [showBar, setShowBar] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const search = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingWeather(true);

    fetch(`${apiUrl}/weather?q=${query}&units=metric&APPID=${apiKey}`)
      .then((response) => {
        console.log(response.status);
        if (response.status !== 200) {
          console.log("something went wrong", response.status);
          setWeather(null);
          setLoadingWeather(false);
          return false;
        }
        response.json().then((result: WeatherData) => {
          console.log(result);
          setWeather(result);
          setLoadingWeather(false);
          console.log(result.name, result.main.temp);
          setShowBar(false);
        });
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
        setLoadingWeather(false);
      });
  };

  const openSearchBox = () => {
    setQuery("");
    setShowBar(true);
    // Focus the input after showing the search bar
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const closeSearchBox = () => {
    setShowBar(false);
    setQuery("");
  };

  const isWarmWeather = weather && weather.main.temp > 15;

  return (
    <div
      className={`flex flex-col items-center rounded-2xl w-[350px] h-[271px] p-4 transition-all duration-[400ms] ease-out select-none
        ${
          isWarmWeather
            ? "bg-gradient-to-br from-gray-900/60 to-orange-500"
            : "bg-gradient-to-br from-gray-900/60 to-blue-500"
        }
      `}
    >
      <div
        className={`
          bg-white/50 rounded-2xl transition-transform duration-[400ms] ease-in-out flex items-center justify-center relative  ${
            showBar ? "translate-y-0" : "-translate-y-[200%]"
          }`}
      >
        <form onSubmit={search} className="flex-1 justify-center items-center">
          <input
            ref={searchInputRef}
            type="text"
            className="p-4 w-full appearance-none bg-transparent border-none outline-none rounded-2xl text-gray-800 text-xl transition-all duration-300 focus:bg-white/75 placeholder:text-gray-700"
            placeholder="Search for a city"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
        </form>
        <button
          className=" bg-transparent border-none p-3 cursor-pointer text-xl text-gray-800 rounded-full w-8 h-8 flex items-center justify-center"
          onClick={closeSearchBox}
          type="button"
        >
          x
        </button>
      </div>

      <button
        style={{ opacity: showBar ? "0" : "1" }}
        className="bg-white/30 border-none font-bold text-gray-800 px-3 py-1 rounded mt-[-3rem] mb-5 transition-all duration-200 ease-in-out hover:bg-white/80 cursor-pointer"
        onClick={openSearchBox}
        type="button"
      >
        Search
      </button>

      {weather ? (
        <div className="text-center text-white">
          <div className="flex items-center justify-center">
            <div className="mr-2 text-5xl font-black text-left">
              <div className="mb-1">{Math.round(weather.main.temp)}°C</div>
              <div className="text-2xl font-bold">
                {weather.weather[0].main}
              </div>
            </div>
            <div className="mr-[-15px] mb-[-6px]">
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
                className="w-[140px] h-[140px]"
              />
            </div>
          </div>
          <div className="text-3xl px-1 pb-3">
            {weather.name}, {weather.sys.country}
          </div>
        </div>
      ) : (
        <div className="text-center text-white">
          {loadingWeather ? (
            <h4 className="m-2 text-lg">Loading data...</h4>
          ) : (
            <h3 className="m-2 mt-12 text-xl">Search for a proper city name</h3>
          )}
        </div>
      )}
    </div>
  );
};

export default Weather;
