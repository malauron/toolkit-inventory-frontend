import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButcheryReleasingsService } from '../butchery/services/butchery-releasings.service';
import { Warehouse } from '../classes/warehouse.model';
import { User } from '../Security/classes/user.model';
import { AuthenticationService } from '../Security/services/authentication.service';
import { WarehousesService } from '../services/warehouses.service';
import * as d3 from 'd3';
import { ButcheryReleasingSummaryDto } from '../butchery/classes/butchery-releasing-summary-dto.model';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {

  warehouse: Warehouse;
  user: User;

  constructor(
    private router: Router,
    private releasingsService: ButcheryReleasingsService,
    private authenticationService: AuthenticationService,
    private warehouseService: WarehousesService
  ) { }

  ngOnInit() {
    this.warehouse = new Warehouse();
    this.user = this.authenticationService.getUserFromLocalCache();

    this.warehouseService
      .getWarehouseByUserId(this.user.userId)
      .subscribe( (resWarehouse) => {
        this.warehouse.warehouseId = resWarehouse.warehouseId;
        this.warehouse.warehouseName = resWarehouse.warehouseName;

        this.releasingsService
          .getReleasingSummary(this.warehouse.warehouseId)
          .subscribe((resReleasingSummary) => {
            this.drawChart(resReleasingSummary);
          });
      });
  }

  onBatches() {
    this.router.navigate(['/','tabs','butchery-batches']);
  }

  onReceiving() {
    this.router.navigate(['/','tabs','receivings']);
  }

  onProduction() {
    this.router.navigate(['/','tabs','productions']);
  }

  onReleasing() {
    this.router.navigate(['/','tabs','releasings']);
  }

  onInventory() {
    this.router.navigate(['/','tabs','inventories']);
  }

  onEndingBalance() {
    this.router.navigate(['/', 'tabs', 'ending-balances']);
  }

  onInventoryHistory() {
    this.router.navigate(['/', 'tabs', 'inventory-history']);
  }

  onPOS() {
    this.router.navigate(['/', 'tabs', 'order-items']);
  }

  onItemPrices() {
    this.router.navigate(['/', 'tabs', 'item-prices']);
  }

  drawChart(releasingSummary: ButcheryReleasingSummaryDto[]) {

    const dimensions = {
      width: 2000,
      height: 650,
      margins: 50,
      ctrWidth: 0,
      ctrHeight: 0
    };

    dimensions.ctrWidth = dimensions.width - dimensions.margins * 2;
    dimensions.ctrHeight = dimensions.height - dimensions.margins * 2;

    // Draw Image
    const svg = d3.select('#releasingChart')
      .append('svg')
      .attr(
        'viewBox',
        [0, 0, dimensions.width, dimensions.height]);
      // .attr('width', dimensions.width)
      // .attr('height', dimensions.height);

    const ctr = svg.append('g')
      .attr(
        'transform',
        `translate(${dimensions.margins}, ${dimensions.margins-50})`
      );

    // Define Scales
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(releasingSummary, rs => rs.totalWeightKg + 150)])
        .rangeRound([dimensions.ctrHeight, dimensions.margins]);

    const xScale = d3.scaleBand()
        .domain(releasingSummary.map(d => d.dateCreated))
        .range([dimensions.margins, dimensions.ctrWidth])
        .padding(0.1);

    // Draw Bar Chart
    ctr.append('g')
        .attr('fill', 'steelblue')
        .selectAll('rect')
        .data(releasingSummary)
        .join(
          (enter) => enter.append('rect')
          .attr('x', d => xScale(d.dateCreated))
          .attr('y', dimensions.ctrHeight)
          .attr('width', xScale.bandwidth())
          .attr('height', 0)
        )
        .transition()
        .duration(2000)
          .attr('x', d => xScale(d.dateCreated))
          .attr('y', d => yScale(d.totalWeightKg))
          .attr('width', xScale.bandwidth())
          .attr('height', d => yScale(0) - yScale(d.totalWeightKg));

    // Draw Axes
    const xAxis = d3.axisBottom(xScale)
        .tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale);

    ctr.append('g')
        .attr('transform', `translate(0, ${dimensions.ctrHeight})`)
        .call(xAxis)
        .selectAll('text')
        .attr('font-size', '15px')
        .attr('transform', `translate(-10,0)rotate(-45)`)
        .style('text-anchor', 'end');

    ctr.append('g')
        .attr('transform', `translate(${dimensions.margins}, 0)`)
        .call(yAxis)
        .selectAll('text')
        .attr('font-size', '15px');

  }

}
