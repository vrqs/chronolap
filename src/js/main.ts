import "../scss/main.scss";
import { Country, Zone } from "./types";
import Countries from "./data/iso-country-codes";
import getZoneNames from "./util";

const userCountryInput: string = "United States of america";

const matchedCountry = Countries.find(
  (country: Country) => country.name.toLowerCase() === userCountryInput.toLowerCase()
);



// const zones = matchedCountry && await getZoneNames(matchedCountry);

// zones?.forEach(zone => {
//   console.log(zone.zoneName);
// });