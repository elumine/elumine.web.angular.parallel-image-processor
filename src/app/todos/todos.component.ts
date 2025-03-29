import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TodosService } from '../services/todos/todos.service';
import { TodoList } from '../services/todos/todo-list';
import { TodoListComponent } from './todo-list/todo-list.component';

@Component({
  selector: 'app-todos',
  imports: [ TodoListComponent ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss'
})
export class TodosComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  todosService = inject(TodosService);
  todoLists = signal<TodoList[]>([]);
  selectedList = signal<TodoList>(null);
  selectedListId: number = null;

  constructor() {}
    
  ngOnInit() {
    console.info(this);
    this.route.paramMap.subscribe(params => this._setSelectedList( Number(params.get('id')) ));
    this.todosService.onTodoListArrayChanged.subscribe(v => this.todoLists.set(v));
  }

  logout() {
    this.authService.logout();
  }

  createList() {
    this.todosService.createList({
      id: this.todosService.todoListArray.length,
      name: 'undefined name',
      items: []
    });
    if (!this.selectedList()) {
      this._setSelectedList(this.selectedListId);
    }
  }

  selectListById(id: number) {
    this.router.navigate(['todos', id ]);
  }

  private _setSelectedList(id: number) {
    this.selectedListId = id;
    if (this.selectedListId !== null) {      
      this.selectedList.set(this.todosService.getListById(this.selectedListId));
    }
  }
}
