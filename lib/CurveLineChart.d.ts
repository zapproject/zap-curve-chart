import { CtxOptions, LineOptions, ChartOptions } from './types';
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
