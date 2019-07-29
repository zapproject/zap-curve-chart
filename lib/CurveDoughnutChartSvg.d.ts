import './curve-doughnut-chart-svg.css';
import { ChartOptions } from './types';
export declare class CurveDoughnutChartSvg {
    private svg;
    private circleCenter;
    private circleAvailable;
    private circleIssued;
    private curve;
    private shadowFilterId;
    private chartDatasets;
    private chartLabels;
    private bottomLine;
    private bondedDots;
    private issuedDotsContainer;
    private dotPriceContainer;
    private chart;
    private chartContainer;
    constructor(container: HTMLElement, options?: ChartOptions);
    destroy(): void;
    private makeHTML;
    circleIssuedEnter(e: any): void;
    circleAvailableEnter(e: any): void;
    circleIssuedOut(e: any): void;
    circleAvailableOut(e: any): void;
    chartOut(e: any): void;
    private getFilter;
    getText(x: any, y: any, text: any, dots: any, color: any): void;
    drawSvg(curveParams: number[], issuedDots: number, userDots: number): void;
}
