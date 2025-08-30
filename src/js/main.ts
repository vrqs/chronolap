/*
 * Main.ts
 */

import "../scss/main.scss";

import { Zone } from "./types";
import Countries from "./data/iso-country-codes";
import { getZoneNames, createElement } from "./util";

const inputGroups = document.querySelectorAll<HTMLDivElement>(".input-group[data-input]");
const countryInputs = document.querySelectorAll<HTMLInputElement>(".input-group[data-input] input");
const actionSearch = document.querySelector<HTMLButtonElement>("[data-action='search']");
const resultsDrawer = document.querySelector<HTMLDivElement>(".card-drawer");

let drawerOpen = false;

function toggleDrawer() {
  drawerOpen = !drawerOpen;
  resultsDrawer?.classList.toggle("open");

  drawerOpen ?
    resultsDrawer?.addEventListener("click", toggleDrawer) :
    resultsDrawer?.removeEventListener("click", toggleDrawer);
}

/**
 * Makes a node visible by adding "visible" class
 * 
 * @param node – Node to make visible
 */
function makeVisible(node: HTMLElement) {
  node.classList.add("visible");
}

/**
 * Initializes UI
 * 
 * Defines data-input attribute to input groups and its country input
 */
function initUI() {
  inputGroups.forEach((group, index) => {
    group.setAttribute("data-input", `${index}`);

    countryInputs[index].setAttribute("data-input", `${index}`);
  });
}

/**
 * Resets a given timezone group
 * 
 * @param timezoneToReset – The timezone group Node
 */
function resetSelectedTimezone(timezoneToReset: HTMLDivElement) {
  timezoneToReset.querySelector(".selected-zone")!.innerHTML = "<span>Select a country</span>";
  timezoneToReset.querySelector(".zones-list")!.innerHTML = "";
}

/**
 * Resets all timezone groups
 */
function resetAllSelectedTimezones() {
  document.querySelectorAll<HTMLDivElement>(".field-zones").forEach(timezoneGroup => {
    resetSelectedTimezone(timezoneGroup);
  });
}

/**
 * Clears all country inputs
 */
function resetAllCountries() {
  countryInputs.forEach(input => input.value = "");
}

/**
 * Fetches timezones and populates selector
 * 
 * @param timezoneGroupElement – The group to populate
 * @param countryCode – Country code to fetch timezones
 */
async function populateTimezonesGroup(timezoneGroupElement: HTMLDivElement, countryCode: string) {
  const selectedZone: HTMLDivElement = timezoneGroupElement.querySelector(".selected-zone")!;
  const timezonesListElement: HTMLUListElement = timezoneGroupElement.querySelector(".zones-list")!;
  let timezonesList: Zone[] = [];
  let timezonesListVisible = false;

  function removePrepend(toRemoveFrom: string) {
    return toRemoveFrom
              .replace("_", " ")
              .replace("America/", "")
              .replace("Asia/", "")
              .replace("Europe/", "")
              .replace("Indian/", "")
              .replace("Africa/", "")
              .replace("Pacific/", "")
              .replace("Atlantic/", "");
  }
  
  function populateSelectableTimezones(timezonesList: Zone[], currentSelection?: number) {    
    // Clear all first
    timezonesListElement.replaceChildren();
    
    timezonesList.forEach((timezone: Zone, index: number) => {
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
    selectedZone.setAttribute("data-timezone-name", `${label.toLowerCase()}`);

    populateSelectableTimezones(timezonesList, index);
    hideTimezonesListElement();
  }

  function setLoadingState() {
    selectedZone.textContent = "Getting zones..."
  }

  // Selects first timezone by default
  setLoadingState();
  
  try {
    // Gets cache and finds entry that matches the selected country
    const rawCache: string = localStorage.getItem("clCached")!;

    let cache: {
      country: string,
      timezones: Zone[]
    }[] = rawCache
      ? JSON.parse(rawCache)
      : [];
    
    const cachedItem = cache.find(item => item.country === countryCode);

    // Only fetches the API if the selected country is not in cache
    if(!cachedItem) {
      timezonesList = await getZoneNames(countryCode) as Zone[];

      const newCacheItem = {
        country: timezonesList[0].countryCode,
        timezones: timezonesList
      }
      cache.push(newCacheItem);
      localStorage.setItem("clCached", JSON.stringify(cache));
    } else {
      timezonesList = cachedItem.timezones as Zone[];
    }

    if(!timezonesList.length) {
      selectedZone.textContent = "Failed fetch";
      return;
    }
    
    populateSelectableTimezones(timezonesList, 0);
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
  } catch(e) {
    console.error("Error populating timezones list:: ", e);
  }
}


/**
 * Initializes Country search
 * 
 * Listens to user's input while writing a country name
 * Provides search results, if any
 * Clicking a result, populates country input and populates Timezones for that country
 */
function initCountrySearch() {
  countryInputs.forEach(countryInput => {
    const countryInputResults = <HTMLUListElement>countryInput.nextElementSibling;
    const timezoneGroupElement = <HTMLDivElement>countryInput.parentElement!.nextElementSibling;

    function hideResultsCard() {
      countryInputResults.classList.remove("visible");
    }

    function showResultsCard() {
      countryInputResults.classList.add("visible");
    }

    function enableCountryClear() {
      const countryIndex: string = countryInput.getAttribute("data-input")!;
      
      inputGroups[parseInt(countryIndex)].setAttribute("data-deleatable", "true");
      inputGroups[parseInt(countryIndex)].querySelector(".clear")?.addEventListener("click", clearCountry);
    }

    function disableCountryClear() {
      const countryIndex: string = countryInput.getAttribute("data-input")!;      
      inputGroups[parseInt(countryIndex)].setAttribute("data-deleatable", "false");
    }

    function clearCountry() {
      countryInput.value = "";
      countryInput.focus();
      resetSelectedTimezone(timezoneGroupElement);
      hideResultsCard();
      disableCountryClear();
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

    function populateInput(label: string, code: string) {
      countryInputResults.replaceChildren();
      countryInput.value = label;
      
      hideResultsCard();
      populateTimezonesGroup(timezoneGroupElement, code);
    }

    function normalizesCountryName(countryName: string) {
      return countryName.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
    }
    
    // While writing country name
    countryInput.addEventListener("input", e => {      
      const query = normalizesCountryName((e.target as HTMLInputElement).value);
      const filtered = Countries.filter(country => normalizesCountryName(country.name).startsWith(query));
      
      resetSelectedTimezone(timezoneGroupElement);
      countryInputResults.replaceChildren();
      showResultsCard();
      

      if(query !== "") {
        enableCountryClear();

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
        disableCountryClear();
      }
    });
  });
}

async function calculateTimeDiff() {
  const response = await fetch(`/api/get-timezones?country=PT`);
  console.log(await response.json());
}

function init() {
  initUI();
  resetAllCountries();
  resetAllSelectedTimezones();
  initCountrySearch();

  actionSearch?.addEventListener("click", e => {
    calculateTimeDiff();
  });
}

document.addEventListener("DOMContentLoaded", init);