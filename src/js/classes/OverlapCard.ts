/**
 * Class
 * OverlapCard
 */

import OverlapTimezone from "./OverlapTimezone";
import CountrySearch from "./CountrySearch";
import { getZone, createElement, appendElements } from "../util";

class OverlapCard {
  private appendTo: HTMLElement;
  private container!: HTMLElement;
  private timezonesContainer!: HTMLElement;
  private _countryInstances!: CountrySearch[];
  private _zonesData!: any;
  private _isLoading!: boolean;

  constructor(appendTo: HTMLElement, countryInstances: any) {
    this.appendTo = appendTo;
    this.countryInstances = countryInstances;

    this.mountUI(appendTo);
  }

  set countryInstances(data: any) {
    this._countryInstances = data;
    this.getZonesData();
  }
  
  get countryInstances(): any {
    return this._countryInstances;
  }

  set zonesData(data: any) {
    this._zonesData = data;
  }
  
  get zonesData(): any {
    return this._zonesData;
  }
  
  set isLoading(value: boolean) {
    this._isLoading = value;
    
    this.timezonesContainer?.setAttribute("data-loading", `${value}`);
  }
  
  get isLoading(): boolean {
    return this._isLoading;
  }

  private async getZonesData() {
    let zonesData = this.countryInstances.map(instance => 
      this.getZoneData(instance.zoneName)
    );

    this.zonesData = await Promise.all(zonesData);
    
    zonesData && this.insertTimezoneUI();
  }

  private async getZoneData(zone: string) {
    let data;

    try {
      data = await getZone(zone);
    } catch(e) {
      console.error("Error fetching timezone details", e);
      return;
    }

    return data;
  }

  private insertTimezoneUI() {
    this.isLoading = false;

    this.countryInstances.forEach((instance: any) => {
      const correspondingZone = this.zonesData.find(
        (zone: any) => zone.timezone === instance.zoneName
      );
    
      console.log(instance);
      
      new OverlapTimezone(this.timezonesContainer, instance.countryName, correspondingZone);
    });
  }

  private mountUI(appendTo: HTMLElement) {
    const container = createElement("section", {
      className: ["overlap-results"],
      attributes: {
        "data-visible": "false",
      }
    });
    
    const card = createElement("div", {
      className: ["card-overlap"]
    });

    const buttonClose = createElement("button", {
      className: ["close"],
      textContent: "CLOSE",
      listeners: {
        "pointerup": this.hide.bind(this),
      }
    });

    const timezonesContainer = createElement("div", {
      className: ["timezones-container"]
    });

    appendElements(card, [buttonClose, timezonesContainer]);
    container.appendChild(card);
    appendTo.appendChild(container);

    this.timezonesContainer = timezonesContainer;
    this.container = container;
  }

  public show(countryInstances: CountrySearch[]) {
    this.countryInstances = countryInstances;
    this.isLoading = true;
    this.container.setAttribute("data-visible", "true");
  }

  public hide() {
    this.container.setAttribute("data-visible", "false");
    this.timezonesContainer.replaceChildren();
  }
}

export default OverlapCard;