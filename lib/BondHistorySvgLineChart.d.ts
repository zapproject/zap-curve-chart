import { LineOptions, ChartOptions, CtxOptions } from './types';
export declare class BondHistorySvgLineChart {
    private container;
    private svg;
    private polyline;
    private fill;
    private gText;
    private textM;
    private textMDots;
    private textMPrice;
    private coef;
    private maxX;
    private infoText;
    private values;
    private maxDots;
    private textColor;
    private textBackground;
    private lineOptions;
    private ctxOptions;
    private options;
    private black;
    constructor(container: HTMLElement, options?: ChartOptions, lineOptions?: LineOptions, ctxOptions?: CtxOptions);
    draw(values: any, dots?: number): void;
    destroy(): void;
    private onMouseMove;
    private onMouseOut;
    private getFilter;
    private getDataset;
}
