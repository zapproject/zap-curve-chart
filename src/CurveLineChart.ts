import * as Chart from 'chart.js';
import { Curve } from '@zapjs/curve';
import { reduce } from './utils';
import { CtxOptions, LineOptions, ChartOptions } from './types';

export class CurveLineChart {

  private ctxOptions: CtxOptions = {
    shadowColor: '#07c',
    shadowBlur: 10,
    shadowRadius: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  }

  private lineOptions: LineOptions = {
    fill: true,
    fillOpacity: 1,
    pointStyle: 'circle',
    borderColor: 'rgba(0,120,254,0.75)',
    backgroundColor: 'rgba(0,120,254,0.5)',
    lineTension: 0.10,
    borderWidth: 2,
    pointBackgroundColor: 'rgba(0,120,254,1)',
    pointBorderColor: 'rgba(0,120,254,1)',
    pointRadius: 0,
    currentPointRadius: 5,
    pointBorderWidth: 0,
    currentPointBorderWidth: 3,
    currentPointBackgroundColor: undefined,
    currentPointBorderColor: undefined,
  }

  private chart = null;
  private chartDatasets = [];
  private chartLabels = [];
  private canvas = null;
  private maxDots: number;

  constructor(container: HTMLElement, options: ChartOptions = {height: 150, width: 300}, lineOptions: LineOptions = {}, ctxOptions: CtxOptions = {}) {
    this.maxDots = options.maxDots || 300;
    this.canvas = document.createElement('canvas');
    if (options.hasOwnProperty('height')) this.canvas.style.height = options.height + 'px';
    if (options.hasOwnProperty('width')) this.canvas.style.width = options.width + 'px';

    this.ctxOptions = Object.assign(this.ctxOptions, ctxOptions);
    this.lineOptions = Object.assign(this.lineOptions, lineOptions);

    container.appendChild(this.canvas);
  }

  public destroy() {
    if (!this.chart) return;
    this.chart.destroy();
  }

  private getDataset(curveParams: number[]): Array<{x: number; y: number}> {
    const curve = new Curve(curveParams);
    return reduce(curve.max, this.maxDots).map(x => ({x, y: curve.getPrice(x) / 1e18}));
  }

  public draw(curveParams: number[] = [], issuedDots: number = 0) {
    const dataset = this.getDataset(curveParams);
    this.chartLabels = dataset.map(data => data.x);
    const pointPersonalization = {
      pointRadius: [],
      pointBorderWidth: [],
    };
    dataset.forEach((data, index) => {
      const current = !!dataset[index - 1] && dataset[index - 1].x < issuedDots && data.x >= issuedDots;
      pointPersonalization.pointRadius.push(current ? this.lineOptions.currentPointRadius : this.lineOptions.pointRadius);
      pointPersonalization.pointBorderWidth.push(current ? this.lineOptions.currentPointBorderWidth : this.lineOptions.pointBorderWidth);
    });
    this.chartDatasets = [{
      label: '',
      data: dataset.map(data => data.y),
      fill: this.lineOptions.fill,
      fillOpacity: this.lineOptions.fillOpacity,
      pointBackgroundColor: this.lineOptions.pointBackgroundColor,
      pointBorderColor: this.lineOptions.pointBorderColor,
      pointStyle: this.lineOptions.pointStyle,
      borderColor: this.lineOptions.borderColor,
      backgroundColor: this.lineOptions.backgroundColor,
      lineTension: this.lineOptions.lineTension,
      pointRadius: pointPersonalization.pointRadius,
      pointBorderWidth: pointPersonalization.pointBorderWidth,
      borderWidth: this.lineOptions.borderWidth,
    }];
    if (!this.chart) this.renderChart();
    this.updateChart();
  }

  private initContext() {
    const defaultCtxOptions = this.ctxOptions;
    const initialize = Chart.controllers.line.prototype.initialize;
    Chart.controllers.line.prototype.initialize = function() {
      initialize.apply(this, arguments);
      const ctx = this.chart.chart.ctx;
      const _stroke = ctx.stroke;
      ctx.stroke = function() {
        ctx.save();
        ctx.shadowColor = defaultCtxOptions.shadowColor;
        ctx.shadowBlur = defaultCtxOptions.shadowBlur;
        ctx.shadowRadius = defaultCtxOptions.shadowRadius;
        ctx.shadowOffsetX = defaultCtxOptions.shadowOffsetX;
        ctx.shadowOffsetY = defaultCtxOptions.shadowOffsetY;
        _stroke.apply(this, arguments);
        ctx.restore();
      };
    };
    return () => {
      Chart.controllers.line.prototype.initialize = initialize;
    }
  }

  private renderChart() {
    if (this.chart) this.chart.destroy();
    this.chart = new Chart(this.canvas.getContext('2d'), {
      type: 'line',
      options: {
        elements: {
          line: {
            tension: 0, // disables bezier curves
          }
        },
        animation: {
          duration: 0
        },
        layout: {
          padding: {
            top: 7,
            bottom: 0,
            left: -10
          },
        },
        responsive: false,
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          intersect: false,
          mode: 'index',
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                display: false,
                minRotation: 0,
                padding: 5,
              },
              gridLines: {
                drawBorder: false,
                zeroLineWidth: 0,
                display: false,
                drawTicks: false,
              },
              scaleLabel: {
                display: false,
                labelString: 'Dot number',
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                display: false,
                beginAtZero: true
              },
              gridLines: {
                drawBorder: false,
                zeroLineWidth: 0,
                display: false,
                drawTicks: true,
              },
              scaleLabel: {
                display: false,
                labelString: 'Dot price',
              },
            },
          ],
        },
      },
      data: {
        datasets: [],
        labels: [],
      },
    });
  }

  private updateChart() {
    if (!this.chart) return;
    this.chart.data.datasets = this.chartDatasets;
    this.chart.data.labels = this.chartLabels;

    // Calculate the max manually
    const maxY = Math.max.apply(null, this.chartDatasets[0].data) * 2;
    this.chart.options.scales.yAxes[0].ticks.max = maxY;

    const minX = Math.min.apply(null, this.chartLabels);
    this.chart.options.scales.xAxes[0].ticks.min = minX;
    const resetore = this.initContext();
    this.chart.update();
    resetore();
  }
}