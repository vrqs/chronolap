/*
 * Main.ts
 */

import "../scss/main.scss";

import LocationSearch from "./classes/LocationSearch";
import ZoneSearchField from "./components/ZoneSearch/ZoneSearchField";
import ResultsCard from "./classes/ResultsCard";

const zonesSearchContainer = document.querySelector(".card-input") as HTMLDivElement;
const timeframeContainer = document.querySelector("#group-timeframe") as HTMLDivElement;

const actionSearch = document.querySelector<HTMLButtonElement>("[data-action='search']");

const locations: number = 2;
const locationSearchInstances: LocationSearch[] = [];
const zonesSearchInstances: ZoneSearchField[] = [];

const overlapResultsCardInstance = new ResultsCard(
  document.querySelector("main") as HTMLElement,
  locationSearchInstances as LocationSearch[]
);

function initUI() {
  // for (let index = 0; index < locations; index++) {
  //   locationSearchInstances.push(
  //     new LocationSearch(zonesSearchContainer, timeframeContainer, index)
  //   );
  // }

  for (let index = 0; index < locations; index++) {
    zonesSearchInstances.push(
      new ZoneSearchField(
        index,
        zonesSearchContainer,
        timeframeContainer,
      )
    );
  }
}

function init() {
  initUI();

  actionSearch?.addEventListener("click", e => {
    
  });

  // actionSearch?.addEventListener("click", e => {
  //   const shouldOpen = locationSearchInstances.every(location => location.countryName && location.zoneName !== "");
    
  //   shouldOpen && overlapResultsCardInstance.show(locationSearchInstances as LocationSearch[]);
  // });
}

document.addEventListener("DOMContentLoaded", init);