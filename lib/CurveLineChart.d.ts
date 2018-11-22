import { ChartOptions } from './CurveDoughnutChart';
export declare class CurveLineChart {
    private chart;
    private chartDatasets;
    private chartLabels;
    private canvas;
    constructor(container: HTMLElement, options?: ChartOptions);
    destroy(): void;
    private getDataset;
    draw(curveParams?: number[], issuedDots?: number): void;
    private renderChart;
    private updateChart;
}
