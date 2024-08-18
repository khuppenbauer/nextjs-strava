import axios from 'axios';

const baseUrl = "https://api.open-meteo.com/v1/forecast";

export async function getWeatherData(data: any) {
  const { start_latlng } = data;

  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Europe/Berlin",
  }).format(date);
  const [day, month, year] = formattedDate.split('.');
  const start_date = `${year}-${month}-${day}`;

  const searchParams = new URLSearchParams();
  searchParams.append("latitude", start_latlng[0]);
  searchParams.append("longitude", start_latlng[1]);
  searchParams.append("start_date", start_date);
  searchParams.append("end_date", start_date);
  searchParams.append("hourly", "temperature_2m,rain,snowfall");
  const url = `${baseUrl}?${searchParams.toString()}`
  const res = await axios.get(url);
  if (res.status !== 200) {
    return {};
  }
  const hours = date.getHours();
  const { hourly: { temperature_2m, rain, snowfall} } = res.data;
  const result = {
    temperature: temperature_2m[hours],
    rain: rain[hours],
    snowfall: snowfall[hours],
  }
  return result;
}
