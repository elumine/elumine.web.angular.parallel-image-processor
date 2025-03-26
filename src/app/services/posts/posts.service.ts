import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';
import Post from './post';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  apollo = inject(Apollo);

  constructor() {}

  getPosts() {
    return this.apollo.watchQuery({
      variables: {
        "options": { "paginate": { "page": 1, "limit": 5 } }
      },
      query: gql`
        query( $options: PageQueryOptions ) {
          posts(options: $options) {
            data {
              id
              title
            }
            meta {
              totalCount
            }
          }
        }
      `,
    }).valueChanges
      .pipe(map((result: any) => result.data.posts.data.map((post: any) => new Post(post))));
  }
}
