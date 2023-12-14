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

  // Draw bar chart for releasing summary
  drawChart(releasingSummary: ButcheryReleasingSummaryDto[]) {

    // Define Metrics
    const metrics = [
      {
        xMetric: 'dateCreated',
        yMetric: 'totalAmount',
        yAxisLabel: '↑ Values in Php',
        maxBuffer: 1.05,
      },
      {
        xMetric: 'dateCreated',
        yMetric: 'totalWeightKg',
        yAxisLabel: '↑ Weight in Kilograms',
        maxBuffer: 1.2,
      },
    ];

    let currentMetric = metrics[1];

    // Define dimension
    const dimensions = {
      width: 2000,
      height: 500,
      margins: 50,
      ctrWidth: 0,
      ctrHeight: 0,
    };

    dimensions.ctrWidth = dimensions.width - dimensions.margins * 2;
    dimensions.ctrHeight = dimensions.height - dimensions.margins * 2;

    const rectPad = 15;
    let textHeight = 0;
    let textWidth = 0;

    // Draw Image
    const svg = d3
      .select('#releasingChart')
      .append('svg')
      .attr('viewBox', [0, 0, dimensions.width, dimensions.height]);

    // Container/Bounds Element
    const ctr = svg
      .append('g')
      .attr('fill', 'none')
      .attr(
        'transform',
        `translate(${dimensions.margins}, ${dimensions.margins - 50})`
      );

    // Barchart Title
    ctr.append('g')
        .append('text')
        .text('Butchery releasings for the past 30 days.')
        .attr('x', dimensions.ctrWidth/2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--ion-color-primary)')
        .attr('font-size', '20px');

    // Bar elements
    ctr.append('g')
      .attr('class', 'bars')
      .attr('fill', 'steelblue');

    // X-Axis elements
    ctr.append('g')
      .attr('class', 'x-axis')
      .style('transform', `translateY(${dimensions.ctrHeight}px)`);

    // Y-Axis elements
    ctr.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${dimensions.margins}, 0)`)

      // Y-Axis label
      .append('text')
      .attr('class', 'y-axis-label')
      .attr('x', -10)
      .attr('y', dimensions.margins)
      .attr('fill', 'var(--ion-color-medium)')
      .attr('text-anchor', 'start')
      .attr('font-size', '15px');

    // Mean group
    const meanGroup = ctr.append('g')
        .attr('class', 'mean-group');

    // Draw the mean line
    const meanLine = meanGroup
      .append('line')
      .attr('x1', dimensions.margins)
      .attr('x2', dimensions.ctrWidth)
      .attr('y1', dimensions.ctrHeight)
      .attr('y2', dimensions.ctrHeight)
      .attr('stroke', 'var(--ion-color-primary)')
      .style('stroke-dasharray', '6px 8px');

    // Mean rectable
    const meanRect = meanGroup.append('rect')
        .attr('class', 'mean-rect')
        .attr('x', dimensions.margins)
        .attr('y', dimensions.ctrHeight)
        .attr('fill', 'white')
        .attr('stroke', 'var(--ion-color-primary)')
        .style('stroke-dasharray', '6px 8px');

    // Mean text
    const meanText = meanGroup
        .append('text')
        .attr('class', 'mean-text')
        .attr('transform', `translate(${dimensions.margins}, ${dimensions.ctrHeight})`)
        .attr('fill', 'var(--ion-color-primary)')
        .attr('text-anchor', 'end')
        .attr('font-size', '15px');

    // Tooltip
    const tooltip = ctr.append('g')
      .attr('class', 'tooltip')
      .attr('opacity', '0');

    tooltip.append('rect')
      .attr('class', 'tooltip-rect')
      .attr('stroke', 'grey')
      .attr('fill', 'white');

    tooltip.append('text')
      .attr('class', 'tooltip-value')
      .attr('fill', 'var(--ion-color-primary)')
      .attr('stroke', 'var(--ion-color-primary)')
      .attr('text-anchor', 'middle')
      .attr('font-size', '15px');

    //Define the scales
    const xScale = d3.scaleBand();
    const yScale = d3.scaleLinear();

    // Define Axes
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    const drawImg = () => {

      // Accessor function
      const xAccessor = (d) => d[currentMetric.xMetric];

      // const yAccessor = (d) => d[yMetric];
      const yAccessor = (d) => d[currentMetric.yMetric];

      // Define Scales
      yScale
        .domain([
          0,
          d3.max(releasingSummary, yAccessor) * currentMetric.maxBuffer,
        ])
        .rangeRound([dimensions.ctrHeight, dimensions.margins]);

      xScale
        .domain(releasingSummary.map(xAccessor))
        .range([dimensions.margins, dimensions.ctrWidth])
        .padding(0.1);

      const barChart = ctr.select('.bars').selectAll('rect')
        .data(releasingSummary)
        .join(
          (enter) =>
            enter
              .append('rect')
              .attr('x', (d) => xScale(xAccessor(d)))
              .attr('y', dimensions.ctrHeight)
              .attr('width', xScale.bandwidth())
              .attr('height', 0)
        );

      barChart
        .transition()
        .duration(2000)
        .attr('x', (d) => xScale(xAccessor(d)))
        .attr('y', (d) => yScale(yAccessor(d)))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => yScale(0) - yScale(yAccessor(d)));

      // Draw aces
      const xAxisGroup = ctr.select('.x-axis').transition().call(xAxis);

      xAxisGroup
        .selectAll('text')
        .text((d) => d.slice(5))
        .attr('font-size', '15px')
        .attr('transform', `translate(-10,0)rotate(-45)`)
        .style('text-anchor', 'end');

      const yAxisGroup = ctr
        .select('.y-axis')
        .transition()
        .duration(2000)
        .call(yAxis);

      yAxisGroup.select('.domain').attr('opacity', '0');

      // Update y-axis label
      ctr.select('.y-axis-label')
        .text(currentMetric.yAxisLabel);

      yAxisGroup.selectAll('text').attr('font-size', '15px');

      // Mean/Average
      const mean = d3.mean(releasingSummary, yAccessor);

      // Draw mean line
      meanLine
        .transition()
        .duration(1000)
        .attr('y1', yScale(mean))
        .attr('y2', yScale(mean));

      // Update mean value
      meanText
        .text(d3.format(',.0f')(mean))
        .attr('opacity', '0')
        .attr('transform', `translate(${dimensions.margins - rectPad / 2}, ${yScale(mean) + (rectPad-3) / 2})`)
        .transition().duration(2000)
        .attr('opacity', '1');

      // Get text width & height
      meanText.each(function(v) {
        textHeight = this.getBBox().height + rectPad;
        textWidth = this.getBBox().width + rectPad;
      });

      // Update text container postition
      meanRect
        .transition()
        .duration(1000)
        .attr('width', textWidth)
        .attr('height', textHeight)
        .attr('x', dimensions.margins - textWidth)
        .attr('y', yScale(mean) - textHeight / 2);

      // Hide tooltip
      tooltip.attr('opacity', '0');

      // Bar mouse hover event
      const onMouseEnter = (event, d) => {

        tooltip.attr('opacity', '0');

        const tolltipXPos = xScale(xAccessor(d)) + xScale.bandwidth() / 2;
        const tooltipYPos = yScale(yAccessor(d)) - 20;

        const tooltipValue = tooltip
          .select('.tooltip-value')
          .text(d3.format(',.2f')(d[currentMetric.yMetric]))
          .attr('transform', `translate(${tolltipXPos}, ${tooltipYPos})`);

        // Get text widt
        tooltipValue.each(function(v) {
          textWidth = this.getBBox().width + rectPad;
        });

        tooltip
          .select('.tooltip-rect')
          .attr('x', tolltipXPos - textWidth / 2)
          .attr('y', tooltipYPos - 20)
          .attr('width', textWidth)
          .attr('height', rectPad * 2);

        tooltip
          .transition()
          .duration(100)
          .attr('opacity', '1');

        // Change bars opacity
        d3.select(event.target)
          .attr('opacity', '0.6');
      };

      // Bar mouse leave event
      const onMouseLeave = (event, d) => {
        tooltip.attr('opacity', '0');

        // Change bars opacity
        d3.select(event.target)
          .attr('opacity', '1');
      };

      barChart
        .on('mouseenter', onMouseEnter)
        .on('mouseleave', onMouseLeave);
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
