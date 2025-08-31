/*
 * Main.ts
 */

import "../scss/main.scss";

import { Zone } from "./types";
import Countries from "./data/iso-country-codes";
import { getZoneNames, createElement } from "./util";

import CountrySearch from "./classes/CountrySearch";

const locations: number = 2;
const inputsContainer = document.querySelector(".card-input") as HTMLDivElement;
const timeframeContainer = document.querySelector("#group-timeframe") as HTMLDivElement;
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

function initUI() {
  for (let index = 0; index < locations; index++) {
    new CountrySearch(inputsContainer, timeframeContainer, index);   
  }
}

async function calculateTimeDiff() {
  const response = await fetch(`/api/get-timezones?country=PT`);
  console.log(await response.json());
}

function init() {
  initUI();

  actionSearch?.addEventListener("click", e => {
    calculateTimeDiff();
  });
}

document.addEventListener("DOMContentLoaded", init);