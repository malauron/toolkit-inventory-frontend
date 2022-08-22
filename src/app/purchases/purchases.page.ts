import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.page.html',
  styleUrls: ['./purchases.page.scss'],
})
export class PurchasesPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onAddPurchase() {
    this.router.navigate(['/', 'tabs', 'purchases', 'purchase-detail', 0]);
  }

}
