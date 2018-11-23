import { ChartOptions } from './ChartOptions';
export declare class CurveLineChart {
    private chart;
    private chartDatasets;
    private chartLabels;
    private canvas;
    private maxDots;
    constructor(container: HTMLElement, options?: ChartOptions);
    destroy(): void;
    private getDataset;
    private static reduce;
    private static average;
    draw(curveParams?: number[], issuedDots?: number): void;
    private renderChart;
    private updateChart;
}
