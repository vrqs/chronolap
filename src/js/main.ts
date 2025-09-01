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

const actionSearch = document.querySelector<HTMLButtonElement>("[data-action='search']");

const locations: number = 2;
const countrySearchInstances: CountrySearch[] = [];

const overlapResultsCardInstance = new OverlapCard(
  document.querySelector("main") as HTMLElement,
  countrySearchInstances as CountrySearch[]
);

function initUI() {
  for (let index = 0; index < locations; index++) {
    countrySearchInstances.push(
      new CountrySearch(inputsContainer, timeframeContainer, index)
    );
  }
}

async function calculateTimeDiff() {
  overlapResultsCardInstance.show(countrySearchInstances as CountrySearch[]);
}

function init() {
  initUI();

  actionSearch?.addEventListener("click", e => {
    overlapResultsCardInstance.show(countrySearchInstances as CountrySearch[]);
  });
}

document.addEventListener("DOMContentLoaded", init);