import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardViewListComponent } from './board-view-list.component';

describe('BoardViewListComponent', () => {
  let component: BoardViewListComponent;
  let fixture: ComponentFixture<BoardViewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardViewListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardViewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
