/**
 * Class
 * OverlapTimezone
 */

import Countries from "../data/iso-country-codes";
import { getZone, createElement, appendElements, removePrepend } from "../util";
// import { Zone } from "../types";

class OverlapTimezone {
  private container!: HTMLElement;
  private country: string;
  private zone: any;
  private timeframe: [number, number];

  constructor(
    container: HTMLElement,
    country: string,
    zone: any,
  ) {
    this.container = container;
    this.country = country;
    this.zone = zone;
    this.timeframe = [10, 22];
    
    this.init();
  }

  private async init() {
    this.mountUI(this.container);
  }

  private mountUI(container: HTMLElement) {
    const [startHour, endHour] = this.timeframe;

    const timezoneContainer = createElement("div", {
      className: ["timezone-container"],
      attributes: {
        "data-country": this.country,
        "data-timezone": this.zone.timezone,
      }
    });

    const country = createElement("p", {
      textContent: this.country,
      className: ["label", "body-regular", "-bold"],
    });
    
    const zone = createElement("p", {
      textContent: `${removePrepend(this.zone.timezone)} – UTC ${this.zone.utc_offset}`,
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
    
    appendElements(timezoneContainer, [country, zone, hoursWrapper]);
    container.appendChild(timezoneContainer);
  }
}

export default OverlapTimezone;