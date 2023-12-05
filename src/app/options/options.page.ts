/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/dot-notation */
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

            // const metrics = ['totalAmount', 'totalWeightKg'];

            // let ctr = 0;
            // setInterval(() => {
            //   if (ctr >= metrics.length) {
            //     ctr = 0;
            //   }
            // console.log(metrics[ctr]);

            //   this.drawChart(newReleasing, metrics[ctr]);

            //   ctr++;
            // }, 5000);
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
      height: 500,
      margins: 50,
      ctrWidth: 0,
      ctrHeight: 0,
    };

    dimensions.ctrWidth = dimensions.width - dimensions.margins * 2;
    dimensions.ctrHeight = dimensions.height - dimensions.margins * 2;

    // Define Metrics
    const metrics = [
      {
        'xMetric': 'dateCreated',
        'yMetric': 'totalAmount',
        'yAxisLabel': '↑ Values in Php',
        'maxBuffer': 1.05
      },
      {
        'xMetric': 'dateCreated',
        'yMetric': 'totalWeightKg',
        'yAxisLabel' : '↑ Weight in Kilograms',
        'maxBuffer': 1.2
      }];

    let currentMetric = metrics[0];

    // Draw Image
    const svg = d3
      .select('#releasingChart')
      .append('svg')
      .attr('viewBox', [0, 0, dimensions.width, dimensions.height]);

    // Container/Bounds Element
    const ctr = svg
      .append('g')
      .attr(
        'transform',
        `translate(${dimensions.margins}, ${dimensions.margins - 50})`
      );

    // Bar elements
    ctr.append('g')
        .attr('class', 'bars');

    // X-Axis element
    ctr.append('g')
        .attr('class', 'x-axis')
        .style('transform', `translateY(${dimensions.ctrHeight}px)`);

    // Y-Axis element
    ctr.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${dimensions.margins}, 0)`)

      // Y-Axis label
        .append('text')
        .attr('class', 'y-axis-label')
        .attr('x', -dimensions.margins)
        .attr('y', 30)
        .attr('fill', 'var(--ion-color-medium)')
        .attr('text-anchor', 'start')
        // .text('↑ Weight in Kilograms')
        .attr('font-size', '15px');


      //   .append('text')
      //   .attr('x', (dimensions.ctrWidth + dimensions.margins * 4) / 2)
      //   .attr('y', 30)
      //   .attr('fill', 'var(--ion-color-medium)')
      //   .text('Butchery releasing summary for the past 30 days.')
      //   .attr('font-size', '20px')
      //   .attr('font-weight', 'bold')

    // Draw the mean line
    const meanLine = ctr
      .append('line')
      .attr('x1', dimensions.margins)
      .attr('x2', dimensions.ctrWidth)
      .attr('y1', dimensions.ctrHeight)
      .attr('y2', dimensions.ctrHeight);

    const xScale = d3.scaleBand();
    const yScale = d3 .scaleLinear();

    const drawImg = () => {

      // Accessor function
      const xAccessor = (d) => d[currentMetric.xMetric];
      // const yAccessor = (d) => d[yMetric];
      const yAccessor = (d) => d[currentMetric.yMetric];

      // Define Scales
      yScale
        .domain([0, d3.max(releasingSummary, yAccessor) * currentMetric.maxBuffer])
        .rangeRound([dimensions.ctrHeight, dimensions.margins]);

      xScale
        .domain(releasingSummary.map(xAccessor))
        .range([dimensions.margins, dimensions.ctrWidth])
        .padding(0.1);

      // Draw Bar Chart
      // const barChart = ctr.append('g')
      //   .attr('fill', 'steelblue')
      //   .selectAll('rect')
      //   .data(releasingSummary)
      //   .join((enter) =>
      //     enter
      //       .append('rect')
      //       .attr('x', (d) => xScale(xAccessor(d)))
      //       .attr('y', dimensions.ctrHeight)
      //       .attr('width', xScale.bandwidth())
      //       .attr('height', 0)

      //       // Mouse hover effects
      //       .on('mouseenter', function(d, i) {
      //         d3.select(this)
      //           .transition()
      //           .duration('50')
      //           .attr('opacity', '0.6');
      //       })
      //       .on('mouseout', function(d, i) {
      //         d3.select(this).transition().duration('50').attr('opacity', '1');
      //       })
      //   );


      const barChart = ctr.select('.bars')
        .attr('fill', 'steelblue')
        .selectAll('rect')
        .data(releasingSummary)
        .join((enter) =>
          enter
            .append('rect')
            .attr('x', (d) => xScale(xAccessor(d)))
            .attr('y', dimensions.ctrHeight)
            .attr('width', xScale.bandwidth())
            .attr('height', 0)

            // Mouse hover effects
            .on('mouseover', function(d, i) {
              d3.select(this)
                // .transition()
                // .duration('50')
                .attr('opacity', '0.6');
            })
            .on('mouseout', function(d, i) {
              d3.select(this)
                // .transition()
                // .duration('50')
                .attr('opacity', '1');
            })
        );

      barChart
        .transition()
        .duration(2000)
        .attr('x', (d) => xScale(xAccessor(d)))
        .attr('y', (d) => yScale(yAccessor(d)))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => yScale(0) - yScale(yAccessor(d)));

      barChart.select('title').remove();

      barChart
        .append('title')
        .text((d) =>
          d[currentMetric.yMetric].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        );

      // Draw Axes
      const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
      const yAxis = d3.axisLeft(yScale);

      // const xAxisGroup = ctr
      //   .append('g')
      //   .call(xAxis)
      //   .style('transform', `translateY(${dimensions.ctrHeight}px)`);

      const xAxisGroup = ctr
        .select('.x-axis')
        .call(xAxis)
        .transition();

      xAxisGroup
        .selectAll('text')
        .text((d) => d.slice(5))
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

      // const yAxisGroup = ctr
      //   .append('g')
      //   .attr('transform', `translate(${dimensions.margins}, 0)`)
      //   .call(yAxis);

      const yAxisGroup = ctr
        .select('.y-axis')
        .call(yAxis);

      yAxisGroup.select('.domain').remove();

      const yAxisLabel = ctr.select('.y-axis-label')
            .text(currentMetric.yAxisLabel);

      yAxisGroup.selectAll('text').attr('font-size', '15px');

      // Graph Title
      // yAxisGroup
      //   .append('text')
      //   .attr('x', (dimensions.ctrWidth + dimensions.margins * 4) / 2)
      //   .attr('y', 30)
      //   .attr('fill', 'var(--ion-color-medium)')
      //   .text('Butchery releasing summary for the past 30 days.')
      //   .attr('font-size', '20px')
      //   .attr('font-weight', 'bold');

      // // Y-Axis label
      // yAxisGroup
      //   .append('text')
      //   .attr('x', -dimensions.margins)
      //   .attr('y', 30)
      //   .attr('fill', 'var(--ion-color-medium)')
      //   .attr('text-anchor', 'start')
      //   .text('↑ Weight in Kilograms')
      //   .attr('font-size', '15px');

      // Mean/Average
      const mean = d3.mean(releasingSummary, yAccessor);

      meanLine
        .transition()
        .duration(1000)
        .attr('y1', yScale(mean))
        .attr('y2', yScale(mean))
        .attr('stroke', 'var(--ion-color-medium)')
        .style('stroke-dasharray', '6px 8px');

    };

    drawImg();

    let row = 0;

    setInterval(() => {
      if (row >= metrics.length) {
        row = 0;
      }

      currentMetric = metrics[row];

      drawImg();

      row++;
    }, 10000);

  }
}
