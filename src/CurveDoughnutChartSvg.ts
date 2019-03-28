import * as Chart from 'chart.js';
import { Curve } from '@zapjs/curve';
import './curve-doughnut-chart-svg.css';
import { ChartOptions } from './types';

export class CurveDoughnutChartSvg {
  private svg: SVGSVGElement;
  private circleCenter: SVGCircleElement;
  private circleAvailable: SVGCircleElement;
  private circleIssued: SVGCircleElement;
  private curve: Curve;
  private shadowFilterId: string;


  private chartDatasets = [];
  private chartLabels = [];
  private bottomLine: HTMLElement;
  private bondedDots: HTMLElement;
  private issuedDotsContainer: Text;
  private dotPriceContainer: Text;
  private chart: HTMLElement;
  private chartContainer: HTMLElement;

  constructor(container: HTMLElement, options: ChartOptions = {height: 160, width: 160}) {
    this.chartContainer = container;
    this.circleIssuedEnter = this.circleIssuedEnter.bind(this);
    this.circleIssuedOut = this.circleIssuedOut.bind(this);
    this.circleAvailableEnter = this.circleAvailableEnter.bind(this);
    this.circleAvailableOut = this.circleAvailableOut.bind(this);
    this.chartOut = this.chartOut.bind(this);
    this.makeHTML(container, options);
  }

  public destroy() {
    this.circleIssued.removeEventListener('mouseenter', this.circleIssuedEnter);
    this.circleIssued.removeEventListener('mouseout', this.circleIssuedOut);
    this.circleAvailable.removeEventListener('mouseenter', this.circleAvailableEnter);
    this.circleAvailable.removeEventListener('mouseout', this.circleAvailableOut);
    this.chart.removeEventListener('mouseout', this.chartOut);
    this.chartContainer.removeChild(this.chart);
  }

  private makeHTML(container, options: ChartOptions) {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttributeNS(null, 'viewBox', '0 -1 42 44');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    this.shadowFilterId = Math.random() + 'shadow';
    const shadow = this.getFilter(this.shadowFilterId);
    defs.append(shadow);
    this.svg.append(defs);
    this.circleCenter = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.circleCenter.setAttributeNS(null, 'cx', '21');
    this.circleCenter.setAttributeNS(null, 'cy', '21');
    this.circleCenter.setAttributeNS(null, 'r', '11.1408460164');
    this.circleCenter.setAttributeNS(null, 'fill', '#fff');
    this.circleAvailable = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.circleAvailable.setAttributeNS(null, 'cx', '21');
    this.circleAvailable.setAttributeNS(null, 'cy', '21');
    this.circleAvailable.setAttributeNS(null, 'r', '11.1408460164');
    this.circleAvailable.setAttributeNS(null, 'fill', 'transparent');
    this.circleAvailable.setAttributeNS(null, 'stroke', '#e5e5e5');
    this.circleAvailable.setAttributeNS(null, 'stroke-width', '20');
    this.circleIssued = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.circleIssued.setAttributeNS(null, 'cx', '21');
    this.circleIssued.setAttributeNS(null, 'cy', '21');
    this.circleIssued.setAttributeNS(null, 'r', '11.1408460164');
    this.circleIssued.setAttributeNS(null, 'fill', 'transparent');
    this.circleIssued.setAttributeNS(null, 'stroke', '#7FBCFB');
    this.circleIssued.setAttributeNS(null, 'stroke-width', '20');

    this.svg.appendChild(this.circleAvailable);
    this.svg.appendChild(this.circleIssued);
    this.svg.appendChild(this.circleCenter);


    this.bottomLine = document.createElement('div');
    this.bottomLine.className = "curve-doughnat__bottom";
    this.dotPriceContainer = document.createTextNode('');
    this.issuedDotsContainer = document.createTextNode('');
    this.bondedDots = document.createElement('div');
    this.bondedDots.className = "curve-doughnat__bonded-dots";
    this.bondedDots.appendChild(document.createTextNode(''))
    const div1 = document.createElement('div')
    div1.title = 'Current price of dot';
    div1.appendChild(this.dotPriceContainer);
    const div2 = document.createElement('div')
    div2.title = 'Issued dots';
    div2.appendChild(this.issuedDotsContainer);
    this.bottomLine.append(div1);
    this.bottomLine.append(div2);
    this.chart = document.createElement('div');
    this.chart.className = "curve-doughnat__container";
    this.chart.style.maxHeight = options.height.toString() + 'px';
    this.chart.style.maxWidth = options.width.toString() + 'px';
    this.chart.appendChild(this.svg);
    this.chart.appendChild(this.bottomLine);
    this.chart.appendChild(this.bondedDots);
    container.appendChild(this.chart);
    this.circleIssued.addEventListener('mouseenter', this.circleIssuedEnter);
    this.circleAvailable.addEventListener('mouseenter', this.circleAvailableEnter);
    this.circleIssued.addEventListener('mouseout', this.circleIssuedOut);
    this.circleAvailable.addEventListener('mouseout', this.circleAvailableOut);
    this.chart.addEventListener('mouseout', this.chartOut);
  }

  circleIssuedEnter(e) {
    this.circleIssued.setAttributeNS(null, 'stroke', ' #7FB5EF');
    this.circleIssued.setAttributeNS(null, 'filter', `url(#${this.shadowFilterId})`);
    this.chart.classList.remove('curve-doughnat__container_show-available');
    this.chart.classList.add('curve-doughnat__container_show-issued');
  }

  circleAvailableEnter(e) {
    this.circleAvailable.setAttributeNS(null, 'stroke', ' #CECECE');
    this.circleAvailable.setAttributeNS(null, 'filter', `url(#${this.shadowFilterId})`);
    this.chart.classList.remove('curve-doughnat__container_show-issued');
    this.chart.classList.add('curve-doughnat__container_show-available');
  }

  circleIssuedOut(e) {
    this.circleIssued.setAttributeNS(null, 'stroke', ' #7FBCFB');
    this.circleIssued.removeAttributeNS(null, 'filter');
  }

  circleAvailableOut(e) {
    this.circleAvailable.setAttributeNS(null, 'stroke', ' #e5e5e5');
    this.circleAvailable.removeAttributeNS(null, 'filter');
  }

  chartOut(e) {
    this.chart.className = 'curve-doughnat__container';
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
    feOffset.setAttributeNS(null, 'in', 'SourceGraphic');
    feOffset.setAttributeNS(null, 'dx', '0.05');
    feOffset.setAttributeNS(null, 'dy', '0');

    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttributeNS(null, 'result', 'blurOut');
    feGaussianBlur.setAttributeNS(null, 'in', 'offOut');
    feGaussianBlur.setAttributeNS(null, 'stdDeviation', '0.5');

    const feBlend = document.createElementNS('http://www.w3.org/2000/svg', 'feBlend');
    feBlend.setAttributeNS(null, 'in', 'SourceGraphic');
    feBlend.setAttributeNS(null, 'in2', 'blurOut');
    feBlend.setAttributeNS(null, 'mode', 'normal');

    filter.appendChild(feOffset);
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feBlend);

    return filter;
  }

  getText(x, y, text, dots, color) {
    const gText = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gText.setAttributeNS(null, 'font-size', '3.5');
    gText.setAttributeNS(null, 'font-family', 'sans-serif');
    gText.setAttributeNS(null, 'stroke', 'none');
    gText.setAttributeNS(null, 'text-anchor', 'start');
    gText.setAttributeNS(null, 'fill', 'white');
    const textM = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textM.setAttributeNS(null, 'x', (parseInt(x) + 7).toString());
    textM.setAttributeNS(null, 'y', (parseInt(y) - 2.3).toString());
    const textMDots = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    const textMDotsAdditional = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    textMDotsAdditional.setAttributeNS(null, 'x', '7');
    textMDotsAdditional.setAttributeNS(null, 'y', (parseInt(y) + 3.3).toString());
    if(dots.length > 5) {
      textMDots.textContent = text;
      textMDotsAdditional.textContent = dots;
      textM.appendChild(textMDots);
      textM.appendChild(textMDotsAdditional);
    } else {
      textMDots.textContent = `${text} ${dots}`;
      textM.appendChild(textMDots);
    }
    const infoText = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    infoText.setAttributeNS(null, 'ry', '2');
    infoText.setAttributeNS(null, 'rx', '2');
    infoText.setAttributeNS(null, 'fill', 'rgba(0, 0, 0, .7)');
    infoText.setAttributeNS(null, 'x', x);
    infoText.setAttributeNS(null, 'y', (parseInt(y) - 6.5).toString());
    infoText.setAttributeNS(null, 'width', "100%");
    infoText.setAttributeNS(null, 'height', dots.length > 5 ? "11" : "6");
    const infoTextRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    infoTextRect.setAttributeNS(null, 'ry', '1');
    infoTextRect.setAttributeNS(null, 'rx', '1');
    infoTextRect.setAttributeNS(null, 'fill', color);
    infoTextRect.setAttributeNS(null, 'x', (parseInt(x) + 1.5).toString());
    infoTextRect.setAttributeNS(null, 'y', (parseInt(y) - 5.4).toString());
    infoTextRect.setAttributeNS(null, 'width', "4");
    infoTextRect.setAttributeNS(null, 'height', "4");

    gText.appendChild(textM);
    this.svg.appendChild(infoText);
    this.svg.append(infoTextRect);
    this.svg.appendChild(gText);
  }

  public drawSvg(curveParams: number[], issuedDots: number = 0, userDots: number) {
    const curve = new Curve(curveParams);
    const totalDots = curve.max;
    const dotPrice = curve.getPrice(issuedDots + 1);
    const issuedPercent = (issuedDots / totalDots) * 70;
    this.bondedDots.childNodes[0].nodeValue = userDots.toString();
    const middleR = 13.07;
    const issuedPercent2 = (issuedDots / totalDots) * 82.12;
    const available = ((totalDots - issuedDots) / totalDots) * 82.12;
    const fi1 = issuedPercent2 / middleR / 2;
    const fi2 = (issuedPercent2 + available / 2) / middleR;
    let y1 = 23.5 - middleR * Math.cos(fi1);
    let y2 = 23.5 - middleR * Math.cos(fi2);
    if(y1 > 17 && y1 < 30) y1 = 31;
    if(y2 > 18 && y2 < 29) y2 = 31;
    this.getText('0', y1.toString(),"Issued dots:", issuedDots.toString(), 'rgba(0, 120, 254, 0.5)');
    this.getText('0', y2.toString(),"Available dots:", (totalDots - issuedDots).toString(), 'rgba(255, 255, 255, .7)');
    this.circleAvailable.setAttributeNS(null, 'stroke-dasharray', `${70 - issuedPercent - 0.25} ${issuedPercent + 0.25}`);
    this.circleAvailable.setAttributeNS(null, 'stroke-dashoffset', `${70 - issuedPercent + 17.5}`);
    this.circleIssued.setAttributeNS(null, 'stroke-dasharray', `${issuedPercent} ${70 - issuedPercent + 0.25}`);
    this.circleIssued.setAttributeNS(null, 'stroke-dashoffset', '17.75');
    this.dotPriceContainer.nodeValue = dotPrice.toString();
    this.issuedDotsContainer.nodeValue = issuedDots.toString();
  }

}
