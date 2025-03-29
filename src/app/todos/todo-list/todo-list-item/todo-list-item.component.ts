import { Component, Input, inject, signal } from '@angular/core';
import { TodoListItem } from '../../../services/todos/todo-list-item';
import { FormsModule } from '@angular/forms';
import { TodosService } from '../../../services/todos/todos.service';
import { TodoList } from '../../../services/todos/todo-list';

@Component({
  selector: 'app-todo-list-item',
  imports: [ FormsModule ],
  templateUrl: './todo-list-item.component.html',
  styleUrl: './todo-list-item.component.scss'
})
export class TodoListItemComponent {
  todosService = inject(TodosService);
  @Input() list: TodoList = null;
  @Input() item: TodoListItem = null;

  deleteItem() {
    this.todosService.deleteListItemById(this.list.id, this.item.id);
  }

  setListItemName(name: string) {
    this.todosService.setListItemNameById(this.list.id, this.item.id, name);
  }
}
