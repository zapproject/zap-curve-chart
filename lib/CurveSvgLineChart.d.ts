import { LineOptions, ChartOptions, CtxOptions } from './types';
export declare class CurveSvgLineChart {
    private container;
    private svg;
    private polyline;
    private fill;
    private gCircle;
    private circle;
    private gText;
    private textM;
    private textMDots;
    private textMPrice;
    private coef;
    private curve;
    private infoText;
    private maxDots;
    private textColor;
    private textBackground;
    private lineOptions;
    private ctxOptions;
    private options;
    private black;
    constructor(container: HTMLElement, options?: ChartOptions, lineOptions?: LineOptions, ctxOptions?: CtxOptions);
    draw(curves: any, dotsIssued: number): void;
    destroy(): void;
    private onMouseMove;
    private onMouseOut;
    private getFilter;
    private getDataset;
}
