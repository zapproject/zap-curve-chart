import { ChartOptions } from './ChartOptions';
interface CtxOptions {
    shadowColor?: string;
    shadowBlur?: number;
    shadowRadius?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
}
interface LineOptions {
    fill?: boolean;
    fillOpacity?: number;
    pointStyle?: string;
    borderColor?: string;
    backgroundColor?: string;
    lineTension?: number;
    borderWidth?: number;
    pointRadius?: number;
    pointBorderWidth?: number;
    pointBackgroundColor?: string;
    pointBorderColor?: string;
    currentPointRadius?: number;
    currentPointBorderWidth?: number;
    currentPointBackgroundColor?: string;
    currentPointBorderColor?: string;
}
export declare class CurveLineChart {
    private ctxOptions;
    private lineOptions;
    private chart;
    private chartDatasets;
    private chartLabels;
    private canvas;
    private maxDots;
    constructor(container: HTMLElement, options?: ChartOptions, lineOptions?: LineOptions, ctxOptions?: CtxOptions);
    destroy(): void;
    private getDataset;
    draw(curveParams?: number[], issuedDots?: number): void;
    private initContext;
    private renderChart;
    private updateChart;
}
export {};
