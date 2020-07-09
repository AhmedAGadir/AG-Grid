import { IDateFilterParams } from "ag-grid-community";

export interface MyDateFilterParams extends IDateFilterParams {
  logger: () => void,
}

export interface Athlete {
  athele: string,
  age: number,
  country: string,
  year: number,
  date: string,
  sport: string,
  gold: number,
  silver: number,
  total: number
}
