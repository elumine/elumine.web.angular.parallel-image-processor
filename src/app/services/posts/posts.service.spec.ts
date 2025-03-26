import { TestBed } from '@angular/core/testing';

import { PostsService } from './posts.service';
import { Apollo, provideApollo } from 'apollo-angular';
import { inject } from '@angular/core';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/cache';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('PostsService', () => {
  let service: PostsService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let apollo: Apollo;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        provideApollo(() => {
          const httpLink = inject(HttpLink);
          return {
            link: httpLink.create({
              uri: 'https://graphqlzero.almansi.me/api',
            }),
            cache: new InMemoryCache(),
          };
        })
      ]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    apollo = TestBed.inject(Apollo);
    service = TestBed.inject(PostsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
