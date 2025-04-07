import { Component, ViewChild, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TodosService } from '../../services/todos/todos.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { TodoBoard } from '../../services/todos/todo-board';
import { MatGridListModule } from '@angular/material/grid-list';
import { BoardViewListComponent } from './board-view-list/board-view-list.component';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-board-view',
  imports: [
    BoardViewListComponent,
    MatTabsModule, MatGridListModule, MatListModule,
    MatToolbarModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './board-view.component.html',
  styleUrl: './board-view.component.scss'
})
export class BoardViewComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  todosService = inject(TodosService);
  board = signal<TodoBoard>(null);

  constructor() { }

  ngOnInit() {
    console.info(this);
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.board.set(this.todosService.getTodoBoard(id));
    });
  }

  logout() {
    this.authService.logout();
  }

  createList() {
    const list = this.todosService.createTodoList(this.board().id, {
      name: 'new list'
    });
  }
}
