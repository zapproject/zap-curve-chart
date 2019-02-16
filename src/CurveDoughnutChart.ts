import * as Chart from 'chart.js';
import { Curve } from '@zapjs/curve';
import './curve-doughnut-chart.css';
import { ChartOptions } from './types';

export class CurveDoughnutChart {

  private chart = null;
  private chartDatasets = [];
  private chartLabels = [];
  private canvas:HTMLCanvasElement;
  private issuedDotsContainer: HTMLElement;
  private userDotsContainer: HTMLElement;
  private dotPriceContainer: HTMLElement;
  private chartContainer: HTMLElement;

  constructor(container: HTMLElement, options: ChartOptions = {height: 150, width: 150}) {
    this.makeHTML(container, options);
  }

  public destroy() {
    if (!this.chart) return;
    this.chart.destroy();
  }

  private makeHTML(container, options: ChartOptions) {
    this.canvas = document.createElement('canvas');
    if (options.hasOwnProperty('height')) this.canvas.style.height = options.height + 'px';
    if (options.hasOwnProperty('width')) this.canvas.style.width = options.width + 'px';

    this.issuedDotsContainer = document.createElement('div');
    this.issuedDotsContainer.classList.add('curve-doughnut-chart__issued-dots-container');
    this.issuedDotsContainer.setAttribute('title', 'Issued dots');
    this.userDotsContainer = document.createElement('div');
    this.userDotsContainer.classList.add('curve-doughnut-chart__user-dots-container');
    this.userDotsContainer.setAttribute('title', 'User\'s dot balance');
    this.dotPriceContainer = document.createElement('div');
    this.dotPriceContainer.classList.add('curve-doughnut-chart__dot-price-container');
    this.dotPriceContainer.setAttribute('title', 'Current price of dot');
    this.chartContainer = document.createElement('div');
    this.chartContainer.classList.add('curve-doughnut-chart');
    this.chartContainer.appendChild(this.userDotsContainer);
    this.chartContainer.appendChild(this.canvas);
    this.chartContainer.appendChild(this.issuedDotsContainer);
    this.chartContainer.appendChild(this.dotPriceContainer);
    container.appendChild(this.chartContainer);
  }

  public draw(curveParams: number[], issuedDots: number = 0, userDots: number) {
    const curve = new Curve(curveParams);
    const totalDots = curve.max;
    const dotPrice = curve.getPrice(issuedDots + 1);
    this.dotPriceContainer.textContent = dotPrice.toString();
    this.userDotsContainer.textContent = userDots.toString();
    this.issuedDotsContainer.textContent = issuedDots.toString();
    this.chartLabels = ['Issued dots', 'Available dots'];
    this.chartDatasets = [{
      backgroundColor: ['rgba(0,120,254,0.5)', '#e5e5e5'],
      data: [issuedDots, totalDots - issuedDots],
    }];
    if (!this.chart) this.renderChart();
    this.updateChart();
  }

  private updateChart() {
    if (!this.chart) return;
    this.chart.data.datasets = this.chartDatasets;
    this.chart.data.labels = this.chartLabels;
    this.chart.update();
  }

  private renderChart() {
    if (this.chart) this.chart.destroy();
    this.chart = new Chart(this.canvas.getContext('2d'), {
      type: 'doughnut',
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
      },
      data: {
        datasets: [],
        labels: [],
      },
    });
  }
}