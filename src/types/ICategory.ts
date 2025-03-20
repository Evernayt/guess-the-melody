import { INote } from "./INote";

export interface ICategory {
  id: number;
  name: string;
  notes: INote[];
}