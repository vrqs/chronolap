/*
 * Main.ts
 */

import "../scss/main.scss";

import { Country } from "./types";
import Countries from "./data/iso-country-codes";
import { getZoneNames, createElement } from "./util";

const countryInputs = document.querySelectorAll<HTMLInputElement>("[data-input] input");
const actionSearch = document.querySelector<HTMLButtonElement>("[data-action='search']");
const resultsDrawer = document.querySelector<HTMLDivElement>(".card-drawer");

let drawerOpen = false;

const mockZones = [
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Adak",
    "gmtOffset": -32400,
    "timestamp": 1756384352
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Anchorage",
    "gmtOffset": -28800,
    "timestamp": 1756387952
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Boise",
    "gmtOffset": -21600,
    "timestamp": 1756395152
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Chicago",
    "gmtOffset": -18000,
    "timestamp": 1756398752
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Denver",
    "gmtOffset": -21600,
    "timestamp": 1756395152
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Detroit",
    "gmtOffset": -14400,
    "timestamp": 1756402352
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Indiana/Indianapolis",
    "gmtOffset": -14400,
    "timestamp": 1756402352
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Indiana/Knox",
    "gmtOffset": -18000,
    "timestamp": 1756398752
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Indiana/Marengo",
    "gmtOffset": -14400,
    "timestamp": 1756402352
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Indiana/Petersburg",
    "gmtOffset": -14400,
    "timestamp": 1756402352
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Indiana/Tell_City",
    "gmtOffset": -18000,
    "timestamp": 1756398752
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Indiana/Vevay",
    "gmtOffset": -14400,
    "timestamp": 1756402352
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Indiana/Vincennes",
    "gmtOffset": -14400,
    "timestamp": 1756402352
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Indiana/Winamac",
    "gmtOffset": -14400,
    "timestamp": 1756402352
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Juneau",
    "gmtOffset": -28800,
    "timestamp": 1756387952
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Kentucky/Louisville",
    "gmtOffset": -14400,
    "timestamp": 1756402352
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Kentucky/Monticello",
    "gmtOffset": -14400,
    "timestamp": 1756402352
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Los_Angeles",
    "gmtOffset": -25200,
    "timestamp": 1756391552
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Menominee",
    "gmtOffset": -18000,
    "timestamp": 1756398752
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Metlakatla",
    "gmtOffset": -28800,
    "timestamp": 1756387952
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/New_York",
    "gmtOffset": -14400,
    "timestamp": 1756402352
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Nome",
    "gmtOffset": -28800,
    "timestamp": 1756387952
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/North_Dakota/Beulah",
    "gmtOffset": -18000,
    "timestamp": 1756398752
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/North_Dakota/Center",
    "gmtOffset": -18000,
    "timestamp": 1756398752
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/North_Dakota/New_Salem",
    "gmtOffset": -18000,
    "timestamp": 1756398752
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Phoenix",
    "gmtOffset": -25200,
    "timestamp": 1756391552
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Sitka",
    "gmtOffset": -28800,
    "timestamp": 1756387952
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "America/Yakutat",
    "gmtOffset": -28800,
    "timestamp": 1756387952
  },
  {
    "countryCode": "US",
    "countryName": "United States",
    "zoneName": "Pacific/Honolulu",
    "gmtOffset": -36000,
    "timestamp": 1756380752
  }
];

function toggleDrawer() {
  drawerOpen = !drawerOpen;
  resultsDrawer?.classList.toggle("open");

  drawerOpen ?
    resultsDrawer?.addEventListener("click", toggleDrawer) :
    resultsDrawer?.removeEventListener("click", toggleDrawer);
}

function makeVisible(node: any) {
  node.classList.add("visible");
}

function resetSelectedTimezone(timezoneToReset: any) {
  timezoneToReset.querySelector(".selected-zone").innerHTML = "<span>Select a country</span>";
  timezoneToReset.querySelector(".zones-list").innerHTML = "";
}

function resetAllSelectedTimezones() {
  document.querySelectorAll(".field-zones").forEach(timezoneGroup => {
    resetSelectedTimezone(timezoneGroup);
  });
}

function resetCountry() {
  countryInputs.forEach(input => input.value = "");
}

function populateTimezonesGroup(timezoneGroupElement: HTMLDivElement, timezonesList: any) {
  const selectedZone: HTMLDivElement = timezoneGroupElement.querySelector(".selected-zone")!;
  const timezonesListElement: HTMLUListElement = timezoneGroupElement.querySelector(".zones-list")!;
  let timezonesListVisible = false;

  function removePrepend(toRemoveFrom: string) {
    return toRemoveFrom
              .replace("_", " ")
              .replace("America/", "")
              .replace("Asia/", "")
              .replace("Europe/", "")
              .replace("Pacific/", "")
              .replace("Atlantic/", "");
  }
  
  function populateSelectableTimezones(timezonesList: any, currentSelection?: number) {
    // Clear all first
    timezonesListElement.replaceChildren();
    
    timezonesList.forEach((timezone: any, index: number) => {
      timezonesListElement.appendChild(
        createElement("li", {
          textContent: removePrepend(timezone.zoneName),
          className: currentSelection === index ? ["selected"] : [],
          attributes: {
            "data-index": `${index}`
          },
          listeners: {
            "pointerup": (e) => {
              const target = e.target as HTMLElement;
              selectZone(parseInt(target.getAttribute("data-index")!));
            },
          }
        })
      );
    });
  }

  function hideTimezonesListElement() {
    timezonesListElement.classList.remove("visible");
    timezonesListVisible = false;
  }

  function selectZone(index: number) {
    const zoneToSelect = timezonesList[index];
    const label = zoneToSelect.zoneName;
    
    selectedZone.textContent = removePrepend(label);
    selectedZone.setAttribute("data-index", `${index}`);

    populateSelectableTimezones(timezonesList, index);
    hideTimezonesListElement();
  }

  populateSelectableTimezones(timezonesList); 
  selectZone(0);

  // Only shows dropdown if there are results to show
  selectedZone.addEventListener("pointerup", () => {
    if(!timezonesListVisible) {
      if(timezonesListElement.children.length !== 0) {
        makeVisible(timezonesListElement);
        timezonesListVisible = true;

        document.addEventListener("pointerdown", e => {
          if (!timezonesListElement.contains(e.target as Node) && !selectedZone.contains(e.target as Node)) {
            hideTimezonesListElement();
          }
        });
      }
    } else {
      hideTimezonesListElement();
    }
  });
}

function initCountrySearch() {
  countryInputs.forEach(countryInput => {
    const countryInputResults = <HTMLUListElement>countryInput.nextElementSibling;
    const timezoneGroupElement = <HTMLDivElement>countryInput.parentElement!.querySelector(".field-zones")!;

    function hideResultsCard() {
      countryInputResults.classList.remove("visible");
    }

    function showResultsCard() {
      countryInputResults.classList.add("visible");
    }

    function populateResults(label: string, code: string) {
      countryInputResults.appendChild(
        createElement("li", {
          className: code !== "" ? [] : ["-color-secondary"],
          textContent: label,
          attributes: {
            "data-country-code": code,
          },
          listeners: {
            "pointerdown": () => { code !== "" ? populateInput(label, code) : null },
          }
        })
      );
    }

    async function populateInput(label: string, code: string) {
      countryInputResults.replaceChildren();
      countryInput.value = label;
      hideResultsCard();

      populateTimezonesGroup(
        timezoneGroupElement,
        await getZoneNames(code),
      );
    }
    
    // While writing country name
    countryInput.addEventListener("input", e => {      
      const query = (e.target as HTMLInputElement).value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
      const filtered = Countries.filter(country => country.name.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().startsWith(query));
      
      resetSelectedTimezone(timezoneGroupElement);
      countryInputResults.replaceChildren();
      showResultsCard();
      

      if(query !== "") {
        if(filtered.length > 0) {
          filtered.slice(0, 5).forEach(result => {
            populateResults(result.name, result.code);
          });
        } else {
          populateResults("No country found", "");
        }
      }
      else {
        hideResultsCard();
      }
    });
  });
}

function init() {
  resetCountry();
  resetAllSelectedTimezones();
  initCountrySearch();

  actionSearch?.addEventListener("click", e => {
    toggleDrawer();
  });
}

document.addEventListener("DOMContentLoaded", init);