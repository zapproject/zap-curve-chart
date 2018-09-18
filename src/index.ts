import { CurveChart } from './CurveChart';

const chart = new CurveChart(document.getElementById('chart') as HTMLCanvasElement);
chart.draw([4,0,0,2,3,1000,3,0,0,2000000000000000000,2000], 0);

