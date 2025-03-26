import { ApplicationConfig, provideZoneChangeDetection, inject, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { authInterceptor } from './services/auth/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideExperimentalZonelessChangeDetection(),
    // provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withComponentInputBinding()), 
    provideHttpClient(
      withInterceptors([ authInterceptor ])
    ), 
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
};
