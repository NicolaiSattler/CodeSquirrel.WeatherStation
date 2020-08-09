import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import * as d3Array from 'd3-array';
import { ScaleLinear, Line, ScaleTime } from 'd3';
import { Observable } from 'rxjs';
import { SensorData } from './SensorData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'dashboard';
  n = 21;
  margin = { top: 20, right: 20, bottom: 30, left: 50 };

  private _xAxis: ScaleTime<number,number>;
  private _yAxis: ScaleLinear<number,number>;
  private _line: Line<[number, number]>; 
  private _width: number;
  private _height: number;
  private _svg: any;

  public get Width(): number{
    return this._width;
  }
  public set Width(v: number) { 
    this._width = v;
  }
  public get Height(): number {
    return this._height;
  }
  public set Height(v: number) {
    this._height = v;
  }
  //Time
  public get XAxis() : ScaleTime<number, number> {
    return this._xAxis;
  }
  
  //Temperature
  public get YAxis() : ScaleLinear<number,number> {
    return this._yAxis;
  }

  public get Line(): Line<[number, number]> {
    return this._line;
  }
  
  public get Svg(): any {
    return this._svg;
  }
  public set Svg(v: any) {
    this._svg = v;
  }

  constructor(private $client: HttpClient){
    this.Width = 900 - this.margin.left - this.margin.right;
    this.Height = 500 - this.margin.top - this.margin.bottom;

    this._xAxis = d3.scaleUtc().range([0, this.Width]);
    this._yAxis = d3.scaleLinear().range([this.Height, 0]);
    this._line = d3.line();
  }

  private getSensorData(): Observable<SensorData[]> {
    const url = 'https://localhost:5001/Sensor';
    return this.$client.get<SensorData[]>(url);
  }
  private addSvg(): void {

    this.Svg = d3.select('svg');
    this.Svg.append('g');
    this.Svg.attr("transform", "translate(" + this.margin.left + ',' + this.margin.top + ") ");

    let xa = this.Svg.append('g');
    xa.attr('class', 'axis axis--x');
    xa.attr('transform', 'translate(0,' + this.Height + ') ');
    xa.call(d3.axisBottom(this.XAxis));

    let ya = this.Svg.append('g');
    ya.attr('class', 'axis axis--y');
    ya.call(d3.axisLeft(this.YAxis));
    ya.append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')

    let sub = this.getSensorData().subscribe((value: SensorData[]) => {
      this.XAxis.domain(d3Array.extent(value, (d) => d.datetime))
      this.YAxis.domain(d3Array.extent(value, (d) => d.temperature)).nice();

      this.Line.x((d: any) => this.XAxis(d.tick));
      this.Line.y((d: any) => this.YAxis(d.temperature));
      //this.Line.curve(d3.curveMonotoneX);

      this.Svg.append('path')
        .datum(value)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr('d', this.Line);

    }, (error) => {
      console.log(error);
    }).add(() => sub?.unsubscribe());
  }

  public ngOnInit(): void {
    this.addSvg();
  }

}
