/**
 * Component
 * ZoneSearch/ZoneSearchUI
 */

import {
  normalizeCountryName,
  removeCountryNamePrepend,
  appendElements,
  createElement
} from "../../util";

import { Zone } from "../../types";

import Countries from "../../data/iso-country-codes";
import Zones from "../../data/timezones";

interface UIElements {
  container: HTMLElement;
  countryInput: HTMLInputElement;
  countryResults: HTMLElement;
  countryResultsItems: HTMLLIElement[];
  selectedZone: HTMLElement;
  zonesList: HTMLElement;
  buttonClear: HTMLButtonElement;
}

interface State {
  selectedZonePlaceholder: string;
  currentZone: Zone | null;
  availableZones: Zone[];
  zonesListVisible: boolean;
}

class ZoneSearchUI {
  private fieldIndex!: number;
  private containerToAppend!: HTMLElement;
  private toAppendBefore!: HTMLElement;
  private UIElements!: UIElements;
  private _clearable: boolean = false;
  private _countryResultsVisible: boolean = false;
  private setCountry!: Function;
  private setZone!: Function;

  private state: Partial<State> = {
    selectedZonePlaceholder: "Select country",
    currentZone: null,
    availableZones: [],
    zonesListVisible: false,
  };


  constructor(
    fieldIndex: number,
    containerToAppend: HTMLElement,
    toAppendBefore: HTMLElement,
    setCountry: Function,
    setZone: Function,
  ) {
    this.fieldIndex = fieldIndex;
    this.containerToAppend = containerToAppend;
    this.toAppendBefore = toAppendBefore;
    this.setCountry = setCountry;
    this.setZone = setZone;
    
    this.mountUI(containerToAppend);
  }

  get clearable(): boolean {
    return this._clearable;
  }
  
  set clearable(value: boolean) {
    this._clearable = value;
    this.UIElements.container
      .setAttribute("data-clearable", `${value}`);
  }

  get countryResultsVisible(): boolean {
    return this._countryResultsVisible;
  }
  
  set countryResultsVisible(value: boolean) {
    this._countryResultsVisible = value;
    this.UIElements.countryResults
      .setAttribute("data-visible", `${value}`);
  }

  setState = (newState: Partial<State>) => {
    this.state = { ...this.state, ...newState };
    
    this.UIElements.zonesList.setAttribute("data-visible", `${this.state.zonesListVisible}`);
    
    if(this.state.availableZones?.length! === 0) {
      this.UIElements.zonesList.replaceChildren();
    }

    if(this.state.currentZone) {
      this.UIElements.selectedZone.textContent = removeCountryNamePrepend(this.state.currentZone.name);
      this.UIElements.selectedZone.setAttribute("data-zone-name", this.state.currentZone.name)
      
      this.UIElements.zonesList.querySelectorAll("li").forEach(zone => {
        if(zone.getAttribute("data-zone-name") === this.state.currentZone?.name) {
          zone.classList.add("selected");
        } else {
          zone.classList.remove("selected");
        }
      });
    }
  }

  private createHTMLTemplate(): string {
    return `
      <p class="label">${this.fieldIndex === 0 ? "Between" : "And"}</p>

      <div class="fields">
        <div class="input-wrapper"></div>
        <div class="zones-wrapper"></div>
      </div>
    `;
  }

  private mountUI(containerToAppend: HTMLElement) {
    const inputGroup = createElement("div", {
      className: ["input-group"],
      attributes: {
        "data-input": `${this.fieldIndex}`,
        "data-clearable": "false",
      }
    });

    const countryInput = createElement("input", {
      attributes: {
        "type": "text",
        "placeholder": "Search a country",
      }
    });

    const buttonClear = createElement("button", {
      className: ["clear"]
    });

    const countryResults = createElement("ul", {
      className: ["results"],
      attributes: {
        "data-visible": "false",
      }
    });

    const selectedZone = createElement("div", {
      className: ["selected-zone"],
      textContent: this.state.selectedZonePlaceholder,
    });

    const zonesList = createElement("ul", { className: ["zones-list"] });
    
    inputGroup.innerHTML = this.createHTMLTemplate();
    
    appendElements(
      inputGroup.querySelector(".input-wrapper") as HTMLElement,
      [ buttonClear, countryInput, countryResults ]
    );
    
    appendElements(
      inputGroup.querySelector(".zones-wrapper") as HTMLElement,
      [ selectedZone, zonesList ]
    );
    
    containerToAppend.insertBefore(inputGroup, this.toAppendBefore);

    this.UIElements = {
      container: inputGroup,
      countryInput,
      countryResults,
      selectedZone,
      zonesList,
      buttonClear
    };

    this.assignListeners();
  }

  private assignListeners = () => {
    // Show country results on input
    this.UIElements.countryInput.addEventListener("input", event => {
      const target = event.target as HTMLInputElement;
      const query = normalizeCountryName(target.value);
      const filtered = Countries.filter(Country => (
        normalizeCountryName(Country.name).startsWith(query)
      ));

      this.UIElements.countryResults.replaceChildren();
      this.clearable = query !== "";
      this.countryResultsVisible = query !== "";
      
      filtered.length > 0 ?
        filtered.slice(0, 5).forEach(result => {
          this.populateCountryResults(result.name, result.code);
        })
      : this.populateCountryResults("No results found");
    });

    // Clears country and timezone selection
    this.UIElements.buttonClear.addEventListener("pointerup", event => {
      this.clear();
    });

    this.UIElements.selectedZone.addEventListener("pointerup", event => {
      this.state.availableZones?.length! > 0 && this.toggleZonesList();
    });

    // Closes zoneList if it's open and click outside
    document.addEventListener("pointerup", event => {
      if(
        !this.UIElements.zonesList.contains(event.target as Node) &&
        event.target !== this.UIElements.selectedZone
      ) {
        this.setState({
          zonesListVisible: false,
        });
      }
    });
  }

  // Creates <li> for country results
  private populateCountryResults(label: string, code?: string) {
    const newResult = createElement("li", {
      className: code ? [] : ["-color-secondary"],
      textContent: label,
      attributes: {
        "data-country-name": label,
        "data-country-code": code ? code : "",
      },
      listeners: {
        "pointerup": () => this.handleCountrySelection(label, code)
      }
    });

    this.UIElements.countryResults.appendChild(newResult);
  }
  
  private handleCountrySelection(name: string, code: string) {
    this.UIElements.countryInput.value = name;
    this.countryResultsVisible = false;
    
    this.populateZonesList(code);
    this.setCountry(name);
  }

  // Creates <li> for zones list based on country code
  private populateZonesList(countryCode: string) {
    const countryZones: Zone[] = Zones.filter(zone => zone.countryCode === countryCode);
    
    countryZones.forEach((zone, index) => {
      this.UIElements.zonesList.appendChild(
        createElement("li", {
          textContent: removeCountryNamePrepend(zone.name),
          attributes: {
            "data-zone-name": zone.name,
          },
          listeners: {
            "pointerup": () => { this.handleZoneSelection(zone) }
          }
        })
      );
    });

    this.setState({
      availableZones: countryZones
    });

    this.handleZoneSelection(countryZones[0]);
  }

  private toggleZonesList() {
    this.setState({
      zonesListVisible: !this.state.zonesListVisible,
    });
  }

  private handleZoneSelection(zone: Zone) {
    this.setState({
      currentZone: zone,
      zonesListVisible: false,
    });
        
    this.setZone(zone.name);
  }

  private clear() {
    this.UIElements.countryInput.value = "";
    this.UIElements.countryInput.focus();

    this.countryResultsVisible = false;
    this.UIElements.selectedZone.textContent = this.state.selectedZonePlaceholder!;
    
    this.setState({
      availableZones: [],
      zonesListVisible: false,
      currentZone: null,
    });
    
    this.clearable = false;
  }
}

export default ZoneSearchUI;