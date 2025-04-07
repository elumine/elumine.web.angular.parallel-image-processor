import { Injectable, inject } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { TodoList } from './todo-list';
import { TodoListItem } from './todo-list-item';
import { BehaviorSubject } from 'rxjs';
import { SnackService } from '../snacks/snack.service';
import { TodoData } from './todo-data';
import { TodoBoard } from './todo-board';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  storage = inject(StorageService);
  snacks = inject(SnackService);
  todoData: TodoData = {
    boardsArray: [],
    listsArray: [],
    listItemsArray: [],
  };
  todoDataChanged = new BehaviorSubject<TodoData>(this.todoData);

  constructor() {
    this._loadCache();
  }

  createTodoBoard(data: { name: string }) {
    const board: TodoBoard = {
      id: this.todoData.boardsArray.length,
      name: data.name,
      todoListIdsArray: []
    };
    this.todoData.boardsArray.push(board);
    this._registerTodoDataChange(`Board ${board.id} created`);
    return board;
  }

  updateTodoBoard(boardId: number, data: { name?: string }) {
    const board = this.getTodoBoard(boardId);
    if (Object.keys(data).length) {
      if (data.name) board.name = data.name;
      this._registerTodoDataChange(`Board ${board.id} updated`);
    }
    return board;
  }

  getTodoBoard(boardId: number) {
    return this.todoData.boardsArray.find(v => v.id === boardId);
  }

  deleteTodoBoard(boardId: number) {
    this.todoData.boardsArray.splice(this.todoData.boardsArray.findIndex(v => v.id === boardId), 1);
    this._registerTodoDataChange(`Board ${boardId} deleted`);
  }

  createTodoList(boardId: number, data: { name: string }) {
    const list: TodoList = {
      id: this.todoData.listsArray.length,
      name: data.name,
      todoItemIdsArray: []
    };
    this.todoData.listsArray.push(list);
    const board = this.getTodoBoard(boardId);
    board.todoListIdsArray.push(list.id);
    this._registerTodoDataChange(`List ${list.id} created`);
    return list;
  }

  updateTodoList(listId: number, data: { name?: string }) {
    const list = this.getTodoList(listId);
    if (Object.keys(data).length) {
      if (data.name) list.name = data.name;
      this._registerTodoDataChange(`List ${list.id} updated`);
    }
    return list;
  }

  getTodoList(listId: number) {
    return this.todoData.listsArray.find(v => v.id === listId);
  }

  deleteTodoList(listId: number) {
    this.todoData.listsArray.splice(this.todoData.listsArray.findIndex(v => v.id === listId), 1);
    this._registerTodoDataChange(`List ${listId} deleted`);
  }

  createTodoListItem(data: { name: string }) {
    const item: TodoListItem = {
      id: this.todoData.listsArray.length,
      name: data.name
    };
    this.todoData.listItemsArray.push(item);
    this._registerTodoDataChange(`List Item ${item.id} created`);
    return item;
  }

  updateTodoListItem(listItemId: number, data: { name?: string }) {
    const item = this.getTodoListItem(listItemId);
    if (Object.keys(data).length) {
      if (data.name) item.name = data.name;
      this._registerTodoDataChange(`List Item ${item.id} updated`);
    }
    return item;
  }

  getTodoListItem(listItemId: number) {
    return this.todoData.listItemsArray.find(v => v.id === listItemId);
  }

  deleteTodoListItem(listItemId: number) {
    this.todoData.listItemsArray.splice(this.todoData.listItemsArray.findIndex(v => v.id === listItemId), 1);
    this._registerTodoDataChange(`List Item ${listItemId} deleted`);
  }

  private _registerTodoDataChange(snackBarMessage: string) {
    this.todoDataChanged.next(this.todoData);
    this._saveCache();
    this.snacks.openSnackBar(snackBarMessage);
  }

  private _loadCache() {
    try {
      const data = this.storage.get('TodosService/todoData');
      if (data) {
        this.todoData = data;
        this.todoDataChanged.next(this.todoData);
      }
    } catch (error) {
      console.warn('Unable to load lists.', error);
    }
  }

  private _saveCache() {
    this.storage.set('TodosService/todoData', this.todoData);
  }
}
