import { Country, Zone } from "./types";

const getZoneNames = async (country: Country):Promise<Zone[]> => {
  const countryCode: string = country.code;
  const timezonedbApiKey = import.meta.env.VITE_TIMEZONEDB_API_KEY;
  
  const response = await fetch(
    `http://api.timezonedb.com/v2.1/list-time-zone?key=${timezonedbApiKey}&format=json&country=${countryCode}`
  );

  const data = await response.json();
  return data?.zones;
}

export default getZoneNames;