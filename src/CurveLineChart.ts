import Chart from 'chart.js';
import { Curve } from '@zapjs/curve';
import { ChartOptions } from './CurveDoughnutChart';

export class CurveLineChart {

  private chart = null;
  private chartDatasets = [];
  private chartLabels = [];
  private canvas = null;

  constructor(container: HTMLElement, options: ChartOptions = {height: 150, width: 300}) {
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
        ctx.shadowColor = '#07C';
        ctx.shadowBlur = 10;
        ctx.shadowRadius = 10;
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

  private getDataset(curveParams: number[], issuedDots: number): number[] {
    const curve = new Curve(curveParams);
    const dataset = [];
    const start = Math.max(issuedDots - 50, 1);
    const end = Math.min(start + 100, curve.max);
    for (let i = start; i < end; i++) {
      dataset.push([i, curve.getPrice(i) / 1e18 ]);
    }
    return dataset;
  }

  public draw(curveParams: number[] = [], issuedDots: number = 0) {
    const dataset = this.getDataset(curveParams, issuedDots);
    this.chartLabels = dataset.map(x => x[0]);
    const pointPersonalization = {
      pointRadius: [],
      pointBorderWidth: [],
      pointBackgroundColor: [],
      pointBorderColor: [],
    };
    dataset.forEach((_, dotIndex) => {
      const current = dotIndex === issuedDots;
      pointPersonalization.pointRadius.push(current ? 5 : 0);
      pointPersonalization.pointBorderWidth.push(current ? 3 : 0);
    });
    this.chartDatasets = [{
      label: '',
      data: dataset.map(x => x[1]),
      fill: true,
      fillOpacity: 1,
      pointBackgroundColor: 'rgba(0,120,254,1)',
      pointBorderColor: 'rgba(0,120,254,1)',
      pointStyle: 'circle',
      borderColor: 'rgba(0,120,254,0.75)',
      backgroundColor: 'rgba(0,120,254,0.5)',
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