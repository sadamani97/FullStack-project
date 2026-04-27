import axios from "axios";

const API_KEY = "3952f855ee91ed71a47f941c513587c4";

interface WeatherData {
  [key: string]: any;
}

export const getWeather = async (country: string): Promise<WeatherData> => {
  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${API_KEY}&units=metric`
  );
  return res.data;
};
