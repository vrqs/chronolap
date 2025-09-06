/**
 * Component
 * ZoneSearch/ZoneSearchUI
 */

import { appendElements, createElement } from "../../util";

class ZoneSearchUI {
  private fieldIndex!: number;
  private containerToAppend!: HTMLElement;
  private toAppendBefore!: HTMLElement;

  constructor(
    fieldIndex: number,
    containerToAppend: HTMLElement,
    toAppendBefore: HTMLElement,
  ) {
    this.fieldIndex = fieldIndex;
    this.containerToAppend = containerToAppend;
    this.toAppendBefore = toAppendBefore;
    
    this.mountUI(containerToAppend);
  }

  private createHTMLTemplate(): string {
    return `
      <p class="label">${this.fieldIndex === 0 ? "Between" : "And"}</p>

      <div class="fields">
        <div class="input-wrapper"></div>
        <div class="zones-wrapper">zones here</div>
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

    const input = createElement("input", {
      attributes: {
        "type": "text",
        "placeholder": "Search a country",
      }
    });
    
    inputGroup.innerHTML = this.createHTMLTemplate();
    
    inputGroup.querySelector(".input-wrapper")?.appendChild(input);
    
    containerToAppend.insertBefore(inputGroup, this.toAppendBefore);
  }
}

export default ZoneSearchUI;