export class Todo {
  id?: string;
  title: string;
  complete: boolean = false;
  dateCreated: Date = new Date();

  constructor(init: Partial<Todo>) {
    Object.assign(this, init);
  }
}