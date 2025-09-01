/**
 * Class
 * OverlapTimezone
 */

import Countries from "../data/iso-country-codes";
import { getZone, createElement, appendElements, removePrepend } from "../util";
// import { Zone } from "../types";

class OverlapTimezone {
  private container!: HTMLElement;
  private timezoneLoadingContainer!: HTMLElement;
  private country: string;
  private zone: string;
  private _zoneData!: {utc_offset: string};
  private timeframe: [number, number];
  private offset: any;

  constructor(
    container: HTMLElement,
    country: string,
    zone: any,
  ) {
    this.container = container;
    this.country = country;
    this.zone = zone;
    this.timeframe = [9, 17];
    
    this.init();
  }

  set zoneData(data: {utc_offset: string}) {
    this._zoneData = data;
  }

  get zoneData(): {utc_offset: string} {
    return this._zoneData;
  }

  private async init() {
    this.setLoadingState(this.container);

    try {
      await this.getZoneData();
    } catch(e) {
      console.error("Error getting timezones overlap", e);
    }

    this.mountUI(this.container);
  }

  private async getZoneData() {
    let data;

    try {
      data = await getZone(this.zone);
    } catch(e) {
      console.error("Error fetching timezone details", e);
      return;
    }

    this.zoneData = data;
  }

  private mountUI(container: HTMLElement) {
    const [startHour, endHour] = this.timeframe;

    const timezoneContainer = createElement("div", {
      className: ["timezone-container"],
      attributes: {
        "data-country": this.country,
        "data-timezone": this.zone,
      }
    });

    const country = createElement("p", {
      textContent: this.country,
      className: ["label", "body-regular", "-bold"],
    });
    
    const zone = createElement("p", {
      textContent: `${removePrepend(this.zone)} – UTC ${this.zoneData.utc_offset}`,
      className: ["label"],
    });

    const hoursWrapper = createElement("ul", {
      className: ["hours", "flex"],
    });

    for(let i = 0; i < 24; i++) {
      const isInTimeframe = i + 1 >= startHour && i + 1 <= endHour;

      hoursWrapper.appendChild(
        createElement("li", {
          textContent: `${i + 1}`,
          className: isInTimeframe ? ["hour-slot", "selected"] : ["hour-slot"]
        })
      );
    }
    
    this.timezoneLoadingContainer.setAttribute("data-state", "loaded");
    appendElements(timezoneContainer, [country, zone, hoursWrapper]);
    container.appendChild(timezoneContainer);
  }

  private setLoadingState(container: HTMLElement) {
    const timezoneLoadingContainer = createElement("div", {
      className: ["timezone-container"],
      attributes: {
        "data-state": "loading"
      }
    });

    container.appendChild(timezoneLoadingContainer);
    this.timezoneLoadingContainer = timezoneLoadingContainer;
  }
}

export default OverlapTimezone;