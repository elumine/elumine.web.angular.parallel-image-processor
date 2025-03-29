import { Component, Input, inject, signal } from '@angular/core';
import { TodoList } from '../../services/todos/todo-list';
import { FormsModule } from '@angular/forms';
import { TodoListItemComponent } from './todo-list-item/todo-list-item.component';
import { TodosService } from '../../services/todos/todos.service';

@Component({
  selector: 'app-todo-list',
  imports: [ FormsModule, TodoListItemComponent ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {
  todosService = inject(TodosService);
  @Input() list: TodoList = null;
  
  createItem() {
    this.todosService.createListItem(this.list.id, {
      id: this.list.items.length,
      name: 'undefined name'
    });
  }

  deleteList() {
    this.todosService.deleteListById(this.list.id);
  }

  setListName(name: string) {
    this.todosService.setListNameById(this.list.id, name);
  }
}
