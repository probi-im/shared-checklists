import { Item } from "@/models/item";

export interface Checklist {
  id?: string;
  name: string;
  desc: string;
  items: Item[];
  allowedUsers: string[];
  people: number;
  status: string;
  createdOn: Date;
  createdBy?: string;
}
