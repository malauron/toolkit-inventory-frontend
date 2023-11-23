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
  ) {}

  ngOnInit() {
    this.warehouse = new Warehouse();
    this.user = this.authenticationService.getUserFromLocalCache();

    this.warehouseService
      .getWarehouseByUserId(this.user.userId)
      .subscribe((resWarehouse) => {
        this.warehouse.warehouseId = resWarehouse.warehouseId;
        this.warehouse.warehouseName = resWarehouse.warehouseName;

        this.releasingsService
          .getReleasingSummary(this.warehouse.warehouseId)
          .subscribe((resReleasingSummary) => {
            const newReleasing = this.generateDates(resReleasingSummary);
            this.drawChart(newReleasing);
          });
      });
  }

  onBatches() {
    this.router.navigate(['/', 'tabs', 'butchery-batches']);
  }

  onReceiving() {
    this.router.navigate(['/', 'tabs', 'receivings']);
  }

  onProduction() {
    this.router.navigate(['/', 'tabs', 'productions']);
  }

  onReleasing() {
    this.router.navigate(['/', 'tabs', 'releasings']);
  }

  onInventory() {
    this.router.navigate(['/', 'tabs', 'inventories']);
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

  formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }

  generateDates(releasingSummary: ButcheryReleasingSummaryDto[]) {
    let days = 31;
    let duumyDates: ButcheryReleasingSummaryDto[] = [];
    const currDate = new Date();

    while (days > 0) {
      const tempData = new ButcheryReleasingSummaryDto();
      const prevDate = new Date(currDate);

      prevDate.setDate(prevDate.getDate() + 1);
      prevDate.setDate(prevDate.getDate() - days);

      const dateCreated = this.formatDate(prevDate);

      tempData.totalAmount = 0;
      tempData.totalWeightKg = 0;
      tempData.dateCreated = dateCreated;

      releasingSummary.forEach((r) => {
        if (r.dateCreated === dateCreated) {
          tempData.totalAmount = r.totalAmount;
          tempData.totalWeightKg = r.totalWeightKg;
          return;
        }
      });

      duumyDates = duumyDates.concat(tempData);

      days--;
    }

    return duumyDates;
  }

  drawChart(releasingSummary: ButcheryReleasingSummaryDto[]) {
    const dimensions = {
      width: 2000,
      height: 700,
      margins: 50,
      ctrWidth: 0,
      ctrHeight: 0,
    };

    dimensions.ctrWidth = dimensions.width - dimensions.margins * 2;
    dimensions.ctrHeight = dimensions.height - dimensions.margins * 2;

    // Draw Image
    const svg = d3
      .select('#releasingChart')
      .append('svg')
      .attr('viewBox', [0, 0, dimensions.width, dimensions.height]);

    const ctr = svg
      .append('g')
      .attr(
        'transform',
        `translate(${dimensions.margins}, ${dimensions.margins - 50})`
      );

    // Define Scales
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(releasingSummary, (rs) => rs.totalWeightKg + 150)])
      .rangeRound([dimensions.ctrHeight, dimensions.margins]);

    const xScale = d3
      .scaleBand()
      .domain(releasingSummary.map((d) => d.dateCreated))
      .range([dimensions.margins, dimensions.ctrWidth])
      .padding(0.1);

    // Draw Bar Chart
    const barChart = ctr
      .append('g')
      .attr('fill', 'steelblue')
      .selectAll('rect')
      .data(releasingSummary)
      .join((enter) =>
        enter
          .append('rect')
          .attr('x', (d) => xScale(d.dateCreated))
          .attr('y', dimensions.ctrHeight)
          .attr('width', xScale.bandwidth())
          .attr('height', 0)

          // Mouse hover effects
          .on('mouseenter', function(d, i) {
            d3.select(this).transition().duration('50').attr('opacity', '0.6');
          })
          .on('mouseout', function(d, i) {
            d3.select(this).transition().duration('50').attr('opacity', '1');
          })
      );

    barChart
      .transition()
      .duration(2000)
      .attr('x', (d) => xScale(d.dateCreated))
      .attr('y', (d) => yScale(d.totalWeightKg))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => yScale(0) - yScale(d.totalWeightKg));

    barChart
      .append('title')
      .text((d) =>
        d.totalWeightKg.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      );

    // Draw Axes
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale);

    const xAxisGroup = ctr
      .append('g')
      .call(xAxis)
      .style('transform', `translateY(${dimensions.ctrHeight}px)`);

    xAxisGroup
      .selectAll('text')
      .attr('font-size', '15px')
      .attr('transform', `translate(-10,0)rotate(-45)`)
      .style('text-anchor', 'end');

    // xAxisGroup.append('text')
    //     .attr('x', dimensions.ctrWidth / 2)
    //     .attr('y', -dimensions.ctrHeight + 45)
    //     .attr('fill', 'var(--ion-color-medium)')
    //     .text('Butchery releasing summary for the past 30 days.')
    //     .attr('font-size', '20px')
    //     .attr('font-weight', 'bold');

    const yAxisGroup = ctr
      .append('g')
      .attr('transform', `translate(${dimensions.margins}, 0)`)
      .call(yAxis);

    yAxisGroup.select('.domain').remove();

    yAxisGroup.selectAll('text').attr('font-size', '15px');

    yAxisGroup
      .append('text')
      .attr('x', (dimensions.ctrWidth + dimensions.margins * 4) / 2)
      .attr('y', 50)
      .attr('fill', 'var(--ion-color-medium)')
      .text('Butchery releasing summary for the past 30 days.')
      .attr('font-size', '20px')
      .attr('font-weight', 'bold');

    yAxisGroup
      .append('text')
      .attr('x', -dimensions.margins)
      .attr('y', 50)
      .attr('fill', 'var(--ion-color-medium)')
      .attr('text-anchor', 'start')
      .text('↑ Weight in Kilograms')
      .attr('font-size', '15px');
  }
}
