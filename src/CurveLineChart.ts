import * as Chart from 'chart.js';
import { Curve } from '@zapjs/curve';
import { ChartOptions } from './ChartOptions';
import { reduce } from './utils';

export class CurveLineChart {

  private chart = null;
  private chartDatasets = [];
  private chartLabels = [];
  private canvas = null;
  private maxDots: number;

  constructor(container: HTMLElement, options: ChartOptions = {height: 150, width: 300}) {
    this.maxDots = options.maxDots || 300;
    this.canvas = document.createElement('canvas');
    if (options.hasOwnProperty('height')) this.canvas.style.height = options.height + 'px';
    if (options.hasOwnProperty('width')) this.canvas.style.width = options.width + 'px';

    container.appendChild(this.canvas);
    const initialize = Chart.controllers.line.prototype.initialize;
    Chart.controllers.line.prototype.initialize = function() {
      initialize.apply(this, arguments);
      const ctx = this.chart.chart.ctx;
      const _stroke = ctx.stroke;
      ctx.stroke = function() {
        ctx.save();
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 0;
        ctx.shadowRadius = 1;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        _stroke.apply(this, arguments);
        ctx.restore();
      };
    };
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
      pointBackgroundColor: [],
      pointBorderColor: [],
    };
    dataset.forEach((data, index) => {
      const current = !!dataset[index - 1] && dataset[index - 1].x < issuedDots && data.x >= issuedDots;
      pointPersonalization.pointRadius.push(current ? 3 : 0);
      pointPersonalization.pointBorderWidth.push(current ? 3 : 0);
    });
    this.chartDatasets = [{
      label: '',
      data: dataset.map(data => data.y),
      fill: true,
      fillOpacity: 1,
      pointBackgroundColor: 'black',
      pointBorderColor:'black',
      pointStyle: 'circle',
      borderColor: 'black',
      backgroundColor: 'white',
      lineTension: 0.10,
      pointRadius: pointPersonalization.pointRadius,
      pointBorderWidth: pointPersonalization.pointBorderWidth,
      borderWidth: 2,
    }];
    if (!this.chart) this.renderChart();
    this.updateChart();
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
    const maxY = Math.max(... this.chartDatasets[0].data) * 2;
    this.chart.options.scales.yAxes[0].ticks.max = maxY;

    const minX = Math.min(... this.chartLabels);
    this.chart.options.scales.xAxes[0].ticks.min = minX;

    this.chart.update();
  }
}
