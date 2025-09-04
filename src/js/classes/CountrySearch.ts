/**
 * Class
 * CountrySearch
 */

import Countries from "../data/iso-country-codes";
import Zones from "../data/timezones";
import { getZoneNames, getZone, createElement, appendElements } from "../util";
import { Zone } from "../types";

class CountrySearch {
  private index: number;
  private _currentCountry!: string;
  private _clearable: boolean = false;
  private _showZonesList: boolean = false;
  private _withZones: boolean = false;
  private _currentZone: number = 0;
  private _currentZonesList!: { zoneName: string }[];
  private _withResults: boolean = false;
  private container!: HTMLDivElement;
  private input!: HTMLInputElement;
  private results!: HTMLUListElement;
  private selectedZone!: HTMLDivElement;
  private zonesList!: HTMLUListElement;
  
  public countryName: string = "";
  public zoneName: string = "";

  constructor(container: HTMLDivElement, insertBefore: HTMLElement, index: number) {
    this.index = index;
    this.mountUI(container, insertBefore);
    this.resetSelectedZone();

    this.listenToInput();
  }

  set clearable(value: boolean) {
    this._clearable = value;
    this.container.setAttribute("data-clearable", `${value}`);
  }

  get clearable(): boolean {
    return this._clearable;
  }

  set withResults(value: boolean) {
    this._withResults = value;
    this.results.setAttribute("data-visible", `${value}`);
  }

  get withResults(): boolean {
    return this._withResults;
  }

  set withZones(value: boolean) {
    this._withZones = value;
  }

  get withZones(): boolean {
    return this._withZones;
  }

  set showZonesList(value: boolean) {
    this._showZonesList = value;
    this.zonesList.setAttribute("data-visible", `${value}`);
  }

  get showZonesList(): boolean {
    return this._showZonesList;
  }

  set currentZone(value: number) {
    this._currentZone = value;
  }

  get currentZone(): number {
    return this._currentZone;
  }

  set currentZonesList(value: { zoneName: string }[]) {
    this._currentZonesList = value;
    this.populateZonesList(value);
  }

  get currentZonesList(): Zone[] {
    return this._currentZonesList;
  }

  set currentCountry(country: string) {
    this._currentCountry = country;
  }

  get currentCountry(): string {
    return this._currentCountry;
  }

  private mountUI(container: HTMLDivElement, insertBefore: HTMLElement) {
    const inputGroup = createElement("div", {
      className: ["input-group"],
      attributes: {
        "data-input": `${this.index}`,
        "data-clearable": "false",
      }
    });

    const label = createElement("p", {
      textContent: this.index === 0 ? "Between" : "And",
      className: ["label"],
    });

    const fieldsContainer = createElement("div", { className: ["fields"] });
    const inputWrapper = createElement("div", { className: ["input-wrapper"] });
    const buttonClear = createElement("button", {
      className: ["clear"],
      listeners: {
        "pointerup": this.clear.bind(this),
      }
    });

    const input = createElement("input", {
      attributes: {
        "type": "text",
        "placeholder": "Search a country",
      }
    });

    const results = createElement("ul", { className: ["results"] });
    const zonesWrapper = createElement("div", { className: ["zones-wrapper"] });
    const selectedZone = createElement("div", {
      className: ["selected-zone"],
      listeners: {
        "pointerup": this.toggleZonesList.bind(this),
      }
    });
    const zonesList = createElement("ul", { className: ["zones-list"] });
    
    appendElements(inputWrapper, [ buttonClear, input, results ]);
    appendElements(zonesWrapper, [ selectedZone, zonesList ]);
    appendElements(fieldsContainer, [ inputWrapper, zonesWrapper ]);
    appendElements(inputGroup, [ label, fieldsContainer ]);

    container.insertBefore(inputGroup, insertBefore);

    // Closes zoneList if it's open and click outside
    document.addEventListener("pointerup", e => {
      if(
        zonesList &&
        !zonesList.contains(e.target as Node) &&
        e.target !== this.selectedZone
      ) {
        this.showZonesList = false;
      }
    });

    this.container = inputGroup;
    this.input = input;
    this.results = results;
    this.selectedZone = selectedZone;
    this.zonesList = zonesList;
  }

  private normalize(name: string) {
    return name.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  }

  private removePrepend(toRemoveFrom: string) {
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

  private clear() {
    this.clearable = false;
    this.withResults = false;
    this.input.value = "";
    this.input.focus();
    this.showZonesList = false;
    this.countryName = "";
    this.zoneName = "";
    this.resetSelectedZone();
  }

  private selectCountry(label: string, code: string) {
    this.input.value = label;
    this.withResults = false;
    this.currentCountry = label;
    this.countryName = label;
    this.initiateZones(code);
  }

  private toggleZonesList() {
    if (this.withZones) this.showZonesList = !this.showZonesList;
  }

  private async initiateZones(code: string) {
    this.selectedZone.textContent = "Getting zones...";
    
    const countryZones = Zones.filter(zone => zone.countryCode === code);
    
    this.currentZonesList = countryZones;
    this.withZones = true;
    this.selectZone(this.currentZone);
  }

  private populateZonesList(zones: any, active?: number) {
    this.zonesList.replaceChildren();

    zones.forEach((zone: any, index: number) => {
      this.zonesList.appendChild(
        createElement("li", {
          textContent: this.removePrepend(zone.zoneName),
          className: active === index ? ["selected"] : [],
          attributes: {
            "data-index": `${index}`
          },
          listeners: {
            "pointerup": () => { this.selectZone(index) }
          }
        })
      );
    });
  }

  private selectZone(index: number) {
    this.selectedZone.textContent = this.removePrepend(this.currentZonesList[index].zoneName);
    this.selectedZone.setAttribute("data-index", `${index}`);
    this.selectedZone.setAttribute("data-zone", this.currentZonesList[index].zoneName);
    this.showZonesList = false;

    this.zoneName = this.currentZonesList[index].zoneName;

    this.populateZonesList(this.currentZonesList, index);

    this.currentZone = index;
  }

  private resetSelectedZone() {
    this.selectedZone.innerHTML = "<span>👈 Country first!</span>";
    this.withZones = false;
  }

  private populateResults(label: string, code?: string) {
    this.results.appendChild(
      createElement("li", {
        className: code ? [] : ["-color-secondary"],
        textContent: label,
        attributes: {
          "data-country-code": code ? code : "",
        },
        listeners: {
          "pointerup": () => { code ? this.selectCountry(label, code) : "" }
        }
      })
    )
  }

  private listenToInput() {
    this.input.addEventListener("input", this.onInput.bind(this));
  }

  private onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const query = this.normalize(target.value);
    const filtered = Countries.filter(Country => (
      this.normalize(Country.name).startsWith(query)
    ));

    this.resetSelectedZone();
    this.clearable = query !== "";
    this.results.replaceChildren();
    this.withResults = query !== "";

    if(filtered.length > 0) {
      filtered.slice(0, 5).forEach(result => {
        this.populateResults(result.name, result.code);
      });
    } else {
      this.populateResults("No countries found");
    }
  }

  public getData() {
    return {
      country: this.currentCountry,
      zone: this.currentZonesList[this.currentZone],
    }
  }
}

export default CountrySearch;