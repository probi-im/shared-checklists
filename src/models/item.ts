export interface Item {
  id: string;
  text: string;
  done: boolean;
  createdOn: Date;
  createdBy?: string;
}
