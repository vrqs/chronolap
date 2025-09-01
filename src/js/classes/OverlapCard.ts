/**
 * Class
 * OverlapCard
 */

import OverlapTimezone from "./OverlapTimezone";
import { getZoneNames, createElement, appendElements } from "../util";

class OverlapCard {
  private appendTo: HTMLElement;
  private container!: HTMLElement;
  private countryInstances: any;

  constructor(appendTo: HTMLElement, countryInstances: any) {
    this.appendTo = appendTo;
    this.countryInstances = countryInstances;
    
    this.init(appendTo);
  }

  private init(appendTo: HTMLElement) {
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

    this.countryInstances.forEach((instance: any) => {
      new OverlapTimezone(timezonesContainer, instance.countryName, instance.zoneName);
    });

    appendElements(card, [buttonClose, timezonesContainer]);
    container.appendChild(card);
    appendTo.appendChild(container);

    this.container = container;
  }

  public show() {
    this.container.setAttribute("data-visible", "true");
  }

  public hide() {
    this.container.setAttribute("data-visible", "false");
  }
}

export default OverlapCard;