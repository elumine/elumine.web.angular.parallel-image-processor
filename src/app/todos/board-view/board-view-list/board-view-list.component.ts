import { Component, ViewChild, inject, input, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TodosService } from '../../../services/todos/todos.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { TodoList } from '../../../services/todos/todo-list';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-board-view-list',
  imports: [
    MatCardModule,
    MatTabsModule, MatGridListModule,
    MatToolbarModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './board-view-list.component.html',
  styleUrl: './board-view-list.component.scss'
})
export class BoardViewListComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  todosService = inject(TodosService);
  listId = input<number>(); 
  list = signal<TodoList>(null);

  constructor() { }

  ngOnInit() {
    console.info(this);
    this.list.set(this.todosService.getTodoList(this.listId()));
  }

  createListItem() {
    const list = this.todosService.createTodoList(this.list().id, {
      name: 'new list'
    });
  }
}
