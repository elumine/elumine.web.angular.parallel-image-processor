import { TodoListItem } from "./todo-list-item";

export interface TodoList {
    id: number;
    name: string;
    items: TodoListItem[];
}
