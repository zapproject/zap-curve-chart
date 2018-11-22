import './curve-doughnut-chart.css';
export interface ChartOptions {
    width?: number;
    height?: number;
}
export declare class CurveDoughnutChart {
    private chart;
    private chartDatasets;
    private chartLabels;
    private canvas;
    private issuedDotsContainer;
    private userDotsContainer;
    private dotPriceContainer;
    private chartContainer;
    constructor(container: HTMLElement, options?: ChartOptions);
    destroy(): void;
    private makeHTML;
    draw(curveParams: number[], issuedDots: number, userDots: number): void;
    private updateChart;
    private renderChart;
}
