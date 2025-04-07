import { Component, ViewChild, inject, signal } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TodosService } from '../services/todos/todos.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { TodoBoard } from '../services/todos/todo-board';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-todos',
  imports: [
    RouterLink,
    MatTabsModule, MatGridListModule,
    MatToolbarModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './boards.component.html',
  styleUrl: './boards.component.scss'
})
export class BoardsComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  todosService = inject(TodosService);
  todoBoardsArray = signal<TodoBoard[]>([]);

  constructor() { }

  ngOnInit() {
    console.info(this);
    this.todosService.todoDataChanged.subscribe(v => this.todoBoardsArray.set(v.boardsArray));
  }

  logout() {
    this.authService.logout();
  }

  createBoard() {
    this.todosService.createTodoBoard({
      name: `Board`
    });
  }
}
