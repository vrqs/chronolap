/*
 * Main.ts
 */

import "../scss/main.scss";

import { Zone } from "./types";
import Countries from "./data/iso-country-codes";
import { getZoneNames, createElement } from "./util";

import CountrySearch from "./classes/CountrySearch";
import OverlapCard from "./classes/OverlapCard";

const inputsContainer = document.querySelector(".card-input") as HTMLDivElement;
const timeframeContainer = document.querySelector("#group-timeframe") as HTMLDivElement;

const overlapResultsContainer = document.querySelector(".overlap-results");
const overlapResultsCard = document.querySelector<HTMLDivElement>(".card-drawer");

const inputGroups = document.querySelectorAll<HTMLDivElement>(".input-group[data-input]");
const countryInputs = document.querySelectorAll<HTMLInputElement>(".input-group[data-input] input");
const actionSearch = document.querySelector<HTMLButtonElement>("[data-action='search']");

const locations: number = 2;
const countrySearchInstances: CountrySearch[] = [];
let overlapResultsCardInstance: OverlapCard;

let drawerOpen = false;

function toggleDrawer() {
  drawerOpen = !drawerOpen;
  overlapResultsCard?.classList.toggle("open");

  drawerOpen ?
    overlapResultsCard?.addEventListener("click", toggleDrawer) :
    overlapResultsCard?.removeEventListener("click", toggleDrawer);
}

function initUI() {
  for (let index = 0; index < locations; index++) {
    countrySearchInstances.push(
      new CountrySearch(inputsContainer, timeframeContainer, index)
    );
  }
}

async function calculateTimeDiff() {

  // countrySearchInstances.map(country => {
  //   new OverlapCountry(
  //     overlapResultsCardInstance as HTMLElement,
  //     country.getData().country,
  //     country.getData().zone,
  //   );
  // });

  overlapResultsCardInstance = new OverlapCard(
    document.querySelector("main")!,
    countrySearchInstances
  );

  overlapResultsCardInstance.show();
}

function init() {
  initUI();

  actionSearch?.addEventListener("click", e => {
    calculateTimeDiff();
  });
}

document.addEventListener("DOMContentLoaded", init);