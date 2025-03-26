import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  imports: [],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss'
})
export class BreadcrumbsComponent {
  items: String[];

  route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.url.subscribe(url => {
      this.items = url.map(segment => segment.path);
    });
  }
}
