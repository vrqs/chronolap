/*
 * Main.ts
 */

import "../scss/main.scss";

import { Zone } from "./types";
import Countries from "./data/iso-country-codes";
import { getZoneNames, createElement } from "./util";

import LocationSearch from "./classes/LocationSearch";
import ResultsCard from "./classes/ResultsCard";

const inputsContainer = document.querySelector(".card-input") as HTMLDivElement;
const timeframeContainer = document.querySelector("#group-timeframe") as HTMLDivElement;

const actionSearch = document.querySelector<HTMLButtonElement>("[data-action='search']");

const locations: number = 2;
const locationSearchInstances: LocationSearch[] = [];

const overlapResultsCardInstance = new ResultsCard(
  document.querySelector("main") as HTMLElement,
  locationSearchInstances as LocationSearch[]
);

function initUI() {
  for (let index = 0; index < locations; index++) {
    locationSearchInstances.push(
      new LocationSearch(inputsContainer, timeframeContainer, index)
    );
  }
}

function init() {
  initUI();

  actionSearch?.addEventListener("click", e => {
    const shouldOpen = locationSearchInstances.every(location => location.countryName && location.zoneName !== "");
    
    shouldOpen && overlapResultsCardInstance.show(locationSearchInstances as LocationSearch[]);
  });
}

document.addEventListener("DOMContentLoaded", init);