import { Item } from "@/models/item";

export interface Checklist {
  id: string;
  name: string;
  desc: string;
  items: Item[];
  allowedUsers: string[];
  people: number;
  createdOn: Date;
}
