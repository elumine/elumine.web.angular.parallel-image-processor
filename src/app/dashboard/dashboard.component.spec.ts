import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Apollo, provideApollo } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/cache';
import { HttpLink } from 'apollo-angular/http';
import { inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let apollo: Apollo;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        provideApollo(() => {
          const httpLink = inject(HttpLink);
          return {
            link: httpLink.create({
              uri: 'https://graphqlzero.almansi.me/api',
            }),
            cache: new InMemoryCache(),
          };
        })
      ],
      imports: [DashboardComponent, HttpClientTestingModule]
    })
    .compileComponents();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    apollo = TestBed.inject(Apollo);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
