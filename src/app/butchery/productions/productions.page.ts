import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productions',
  templateUrl: './productions.page.html',
  styleUrls: ['./productions.page.scss'],
})
export class ProductionsPage implements OnInit {

  isFetching = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onAddProduction() {
    this.router.navigate(['/','tabs','productions','production-detail', 0]);
  }

}
