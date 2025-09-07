import { Zone } from "./types";

export async function getZoneNames(country: string): Promise<Zone[]> {
  const timezonedbApiKey = import.meta.env.VITE_TIMEZONEDB_API_KEY;
  try {
    console.log(`Fetching timezones for ${country}`);

    const response = await fetch(
      `/api/get-timezones?country=${country}`
    );

    const data = await response.json();
    return data?.zones;
  } catch(e) {
    console.error("Error fetching timezones::", e);
    return [];
  }
}

export async function getZone(zone: string): Promise<any> {
  const url = `https://worldtimeapi.org/api/timezone/${zone}`; 
  console.log("Fetching zone: ", zone);

  for(let attempt = 1; attempt <= 5; attempt++) {
    try {
      const response = await fetch(url);

      if(!response.ok) {
        throw new Error("Error fetching zone");
      }

      return await response.json();
    } catch(e) {
      console.error(`Error fetching timezone, will try again | Attempt: ${attempt}`);
      if(attempt === 3) throw e;
      await new Promise(resolve => setTimeout(
        resolve,
        attempt * 1000
      ));
    }
  }
}

export function createElement<K extends keyof HTMLElementTagNameMap> (
  tag: K,
  options: {
    className?: string[],
    textContent?: string,
    attributes?: Record <string, string>,
    listeners?: Record <string, (e: Event) => void>
  } = {}
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  
  if(options.className) element.classList.add(...options.className);
  if(options.textContent) element.textContent = options.textContent;
  
  if(options.attributes) {
    Object.entries(options.attributes).forEach(([dataAttrName, dataAttrValue]) => {
      element.setAttribute(dataAttrName, dataAttrValue);
    });
  }

  if(options.listeners) {
    Object.entries(options.listeners).forEach(([listenerName, listenerAction]) => {
      element.addEventListener(listenerName, listenerAction);
    });
  }

  return element;
}

export function appendElements(
  parent: HTMLElement,
  toAppend: HTMLElement[]
) {
  toAppend.forEach(element => parent.appendChild(element));
}

export function removePrepend(toRemoveFrom: string) {
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

export function normalizeCountryName(name: string) {
  return name.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function removeCountryNamePrepend(toRemoveFrom: string) {
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