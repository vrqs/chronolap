export interface Country {
  name: string;
  code: string;
}

export interface Zone {
  countryCode: string;
  zoneName: string;
  gmtOffset: number;
}