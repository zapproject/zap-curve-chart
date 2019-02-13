import { Curve } from '@zapjs/curve';
import { LineOptions, ChartOptions, CtxOptions } from './types';
import { reduce } from './utils';


export class CurveSvgLineChart {
  private svg: SVGSVGElement;
  private polyline: SVGPolylineElement;
  private fill: SVGPolylineElement;
  private gCircle: SVGGElement;
  private circle: SVGCircleElement;
  private gText: SVGGElement;
  private textM: SVGTextElement;
  private textMDots: SVGTSpanElement;
  private textMPrice: SVGTSpanElement;
  private coef = 1;
  private curve: Curve;
  private infoText: SVGRectElement;

  private maxDots: number;

  private textColor = '#fff';
  private textBackground = 'rgba(0, 0, 0, .7)';

  private lineOptions: LineOptions = {
    fill: true,
    borderWidth: 2,
    borderColor: 'rgba(0,120,254,0.75)',
    backgroundColor: 'rgba(0,120,254,0.5)',
    pointRadius: 7,
    pointBackgroundColor: 'rgba(0,120,254,1)',
  }

  private ctxOptions: CtxOptions = {
    shadowBlur: 3,
    shadowRadius: 3,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  }

  private options: ChartOptions = {
    height: 150,
    width: 300,
    maxDots: 300,
  }

  private black = false;

  constructor(private container: HTMLElement, options: ChartOptions = {}, lineOptions: LineOptions = {}, ctxOptions: CtxOptions = {}) {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);

    this.lineOptions = Object.assign(this.lineOptions, lineOptions);
    this.options = Object.assign(this.options, options);
    this.ctxOptions = Object.assign(this.ctxOptions, ctxOptions);

    this.coef = 1;
    const { height, width } = this.options;
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttributeNS(null, "viewBox", `-10 -${height / 2 - 10} ${width} ${height}`);
    this.svg.setAttribute('width', width.toString());
    this.svg.setAttribute('height', height.toString());

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const shadowFilterId = Math.random() + 'shadow';
    if (this.ctxOptions.shadowRadius) {
      const shadow = this.getFilter(shadowFilterId);
      defs.append(shadow);
    }
    this.svg.append(defs);

    this.polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    this.polyline.setAttributeNS(null, 'stroke', this.lineOptions.borderColor);
    this.polyline.setAttributeNS(null, 'fill', 'none');
    this.polyline.setAttributeNS(null, 'stroke-width', this.lineOptions.borderWidth.toString());
    if (this.ctxOptions.shadowRadius) this.polyline.setAttributeNS(null, 'filter', `url(#${shadowFilterId})`);
    this.fill = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    this.fill.setAttributeNS(null, 'stroke', 'none');
    this.fill.setAttributeNS(null, 'fill', this.lineOptions.backgroundColor);
    this.fill.setAttributeNS(null, 'stroke-width', this.lineOptions.borderWidth.toString());

    this.gCircle = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.circle.setAttributeNS(null, 'r', this.lineOptions.pointRadius.toString());
    this.circle.setAttributeNS(null, 'fill', this.lineOptions.pointBackgroundColor);
    if (this.ctxOptions.shadowRadius) this.circle.setAttributeNS(null, 'filter', `url(#${shadowFilterId})`);
    this.gCircle.appendChild(this.circle);

    this.gText = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.gText.setAttributeNS(null, 'font-size', '12');
    this.gText.setAttributeNS(null, 'font-family', 'sans-serif');
    this.gText.setAttributeNS(null, 'stroke', 'none');
    this.gText.setAttributeNS(null, 'text-anchor', 'start');
    this.gText.setAttributeNS(null, 'fill', this.textColor);
    this.textM = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    this.textMDots = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    this.textMDots.setAttributeNS(null, 'dy', '1em');
    this.textMPrice = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    this.textMPrice.setAttributeNS(null, 'dy', '1em');
    this.textM.appendChild(this.textMDots);
    this.textM.appendChild(this.textMPrice);
    this.textM.style.visibility = 'hidden';
    this.infoText = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    this.infoText.setAttributeNS(null, 'ry', '5');
    this.infoText.setAttributeNS(null, 'rx', '5');
    this.infoText.setAttributeNS(null, 'fill', this.textBackground);
    this.gText.appendChild(this.textM);

    this.svg.appendChild(this.fill);
    this.svg.appendChild(this.polyline);
    this.svg.appendChild(this.gCircle);
    this.svg.appendChild(this.infoText);
    this.svg.appendChild(this.gText);

    this.container.appendChild(this.svg);
    this.svg.addEventListener('mousemove', this.onMouseMove);
    this.svg.addEventListener('mouseout', this.onMouseOut);
  }

  draw(curves: any, dotsIssued: number) {
    const data = this.getDataset(curves, dotsIssued);
    this.polyline.setAttributeNS(null, 'points', data.polyline);
    this.fill.setAttributeNS(null, 'points', data.fill);
    this.circle.setAttributeNS(null, 'cx', (data.currentPos.x > 3) ? data.currentPos.x : 3);
    this.circle.setAttributeNS(null, 'cy', data.currentPos.y);
    this.coef = data.curve.max / this.polyline.getBoundingClientRect().width;
    this.curve = data.curve;
  }

  destroy() {
    this.svg.removeEventListener('mousemove', this.onMouseMove);
    this.svg.removeEventListener('mouseout', this.onMouseOut);
    this.container.removeChild(this.svg);
  }

  private onMouseMove(e) {
    if (!this.curve) return;
    this.textM.style.visibility = 'visible';
    this.infoText.style.visibility = 'visible';
    const rect = this.polyline.getBoundingClientRect();
    let deltaX = ((e.clientX - rect.left) > (rect.width / 2)) ? (e.clientX - rect.left) - 120 : (e.clientX - rect.left) + 15;
    const deltaY = ((e.clientY - rect.top) > (rect.height / 2)) ? (e.clientY - rect.top) - 35 : (e.clientY - rect.top) + 15;

    const dots = Math.round((e.clientX - this.polyline.getBoundingClientRect().left) * this.coef);
    let price = (dots) ? this.curve.getPrice(dots) : 0;

    if (
      price >= 1e7 && price <= 1e15 && (e.clientX - rect.left) > (rect.width / 2)
      || dots >= 1e7 && dots <= 1e15 && (e.clientX - rect.left) > (rect.width / 2)
    ) {
      deltaX -= 35;
    }

    let priceSuffix = '';
    if (price > 1e10) {
      price = price / 1e18;
      priceSuffix = 'e-18';
    }

    this.textM.setAttributeNS(null, 'x', deltaX.toString());
    this.textM.setAttributeNS(null, 'y', deltaY.toString()) ;
    this.textMDots.setAttributeNS(null, 'x', deltaX.toString());
    this.textMPrice.setAttributeNS(null, 'x', deltaX.toString());
    this.textMDots.textContent = `Dot: ${dots}`;
    this.textMPrice.textContent = `Price: ${price}${priceSuffix}`;
    const _rect = this.textM.getBoundingClientRect();
    this.infoText.setAttributeNS(null, 'x', (deltaX - 5).toString());
    this.infoText.setAttributeNS(null, 'y', (deltaY - 5).toString());
    this.infoText.setAttributeNS(null, 'width', (_rect.width + 10).toString());
    this.infoText.setAttributeNS(null, 'height', (_rect.height + 10).toString());
    return;
  }

  private onMouseOut() {
    this.infoText.style.visibility = 'hidden';
    this.textM.style.visibility = 'hidden';
  }

  private getFilter(id: string) {
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttributeNS(null, 'x', '-40%');
    filter.setAttributeNS(null, 'y', '-40%');
    filter.setAttributeNS(null, 'width', '200%');
    filter.setAttributeNS(null, 'height', '200%');
    filter.setAttributeNS(null, 'id', id);
    filter.setAttributeNS(null, 'filterUnits', 'userSpaceOnUse');
    const feOffset = document.createElementNS('http://www.w3.org/2000/svg', 'feOffset');
    feOffset.setAttributeNS(null, 'result', 'offOut');
    feOffset.setAttributeNS(null, 'in', this.black ? 'SourceAlpha' : 'SourceGraphic');
    feOffset.setAttributeNS(null, 'dx', this.ctxOptions.shadowOffsetX.toString());
    feOffset.setAttributeNS(null, 'dy', this.ctxOptions.shadowOffsetY.toString());
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttributeNS(null, 'result', 'blurOut');
    feGaussianBlur.setAttributeNS(null, 'in', 'offOut');
    feGaussianBlur.setAttributeNS(null, 'stdDeviation', this.ctxOptions.shadowRadius.toString());
    const feBlend = document.createElementNS('http://www.w3.org/2000/svg', 'feBlend');
    feBlend.setAttributeNS(null, 'in', 'SourceGraphic');
    feBlend.setAttributeNS(null, 'in2', 'blurOut');
    feBlend.setAttributeNS(null, 'mode', 'normal');
    filter.appendChild(feOffset);
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feBlend);
    return filter;
  }

  private getDataset(curveParams: number[], dotsIssued: number = 0): any {
    const height = this.options.height / 2;
    const curve = new Curve(curveParams);
    const reduced = reduce(curve.max, this.options.maxDots);
    let maxY = 0;
    let current = 0;
    reduced.forEach((item, i, arr) => {
      if(dotsIssued && !current && item >= dotsIssued) {
        current = item;
      }
      const tmp = curve.getPrice(item);
      if (tmp > maxY) {
        maxY = tmp;
      }
    });
    const coefY = maxY / height;
    const coefX = this.options.maxDots / curve.max;
    const currentPos = {
      x: current * coefX,
      y: height - ((current) ? curve.getPrice(current) / coefY : 0)
    };
    const polyline = [`0,${maxY/coefY}`];
    const fill = [`0,${maxY/coefY}`];
    reduced.forEach(x => {
      polyline.push(`${x * coefX},${height - (curve.getPrice(x) / coefY)}`);
      fill.push(`${x * coefX},${height - (curve.getPrice(x) / coefY)}`);
    });
    fill.push(`${this.options.maxDots},${maxY/coefY}`)
    return {
      polyline: polyline.join(' '),
      fill: fill.join(' '),
      currentPos,
      maxY,
      maxX: curve.max,
      dotsIssued,
      curve
    };
  }
}
