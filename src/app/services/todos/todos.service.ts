import { Injectable, inject } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { TodoList } from './todo-list';
import { TodoListItem } from './todo-list-item';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  storage = inject(StorageService);
  todoListArray = new Array<TodoList>();
  onTodoListArrayChanged = new BehaviorSubject<TodoList[]>(this.todoListArray);

  constructor() {
    this._loadCache();
  }

  createList(list: TodoList) {
    this.todoListArray.push(list);
    this.onTodoListArrayChanged.next(this.todoListArray);
    this._saveCache();
  }

  getListById(listId: number) {
    return this.todoListArray.find(v => v.id === listId);
  }

  deleteListById(listId: number) {
    this.todoListArray.splice(this.todoListArray.findIndex(v => v.id === listId), 1);
    this.onTodoListArrayChanged.next(this.todoListArray);
    this._saveCache();
  }

  setListNameById(listId: number, name: string) {
    this.getListById(listId).name = name;
    this._saveCache();
  }

  createListItem(listId: number, data: TodoListItem) {
    this.getListById(listId).items.push(data);
    this._saveCache();
  }

  getListItemById(listId: number, listItemId: number) {
    const list = this.getListById(listId);
    return list.items.find(v => v.id === listItemId);
  }

  deleteListItemById(listId: number, listItemId: number) {
    const list = this.getListById(listId);
    list.items.splice(list.items.findIndex(v => v.id === listItemId), 1);
    this._saveCache();
  }

  setListItemNameById(listId: number, listItemId: number, name: string) {
    const item = this.getListItemById(listId, listItemId);
    item.name = name;
    this._saveCache();
  }

  private _loadCache() {
    try {
      const data = this.storage.get('TodosService/todoListArray');
      if (data) {
        this.todoListArray = data;
        this.onTodoListArrayChanged.next(this.todoListArray);
      }
    } catch (error) {
      console.warn('Unable to load lists.', error);
    }
  }

  private _saveCache() {
    this.storage.set('TodosService/todoListArray', this.todoListArray);
  }
}
