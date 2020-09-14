/* -------------------------------------------------------------------------------------/
                                                                                    /
/               COPYRIGHT (c) 2019 SAMSUNG ELECTRONICS CO., LTD.                      /
/                          ALL RIGHTS RESERVED                                        /
/                                                                                     /
/   Permission is hereby granted to licensees of Samsung Electronics Co., Ltd.        /
/   products to use or abstract this computer program for the sole purpose of         /
/   implementing a product based on Samsung Electronics Co., Ltd. products.           /
/   No other rights to reproduce, use, or disseminate this computer program,          /
/   whether in part or in whole, are granted.                                         / 
/                                                                                     /
/   Samsung Electronics Co., Ltd. makes no representation or warranties with          /
/   respect to the performance of this computer program, and specifically disclaims   /
/   any responsibility for any damages, special or consequential, connected           /
/   with the use of this program.                                                     /
/                                                                                     /
/-------------------------------------------------------------------------------------/


DESCRIPTION: <File description> *
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
[12/06/2018] [Aswin] : Changed X axis time format. Y axis values rotated
*/
import React, { Component } from 'react';
import { extent as d3ArrayExtent, max as d3ArrayMax } from 'd3-array';
import { timeFormat as d3timeFormat } from 'd3-time-format';
import { format as d3Format } from 'd3-format';
import {
  scaleLinear as d3ScaleLinear,
  scaleTime as d3ScaleTime,
} from 'd3-scale';
import { axisBottom as d3AxisBottom, axisLeft as d3AxisLeft } from 'd3-axis';
import { select as d3Select } from 'd3-selection';
import { line as d3Line, area as d3Area } from 'd3-shape';
import { Paper, Typography, withStyles } from '@material-ui/core';
// import Loader from 'react-loader-spinner';
import './Chart.css';
import Tooltip from './Tooltip';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: 350
  },
  nodata: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -theme.spacing(3)
  },
  title: {
    paddingTop: theme.spacing(1)
  }
});

class Chart extends Component {
  data = [];

  height = 280;

  width = 800;

  margin = 20;

constructor(props) {
super(props);
  this.state = {
    linePath: null,
    circlePoints: null,
    constLinePath: null,
    areaGraph: null,
    rectangles: null,
    xScale: d3ScaleTime(),
    yScale: d3ScaleLinear().range([this.height, 0]),
    tooltipStyle: {
      left: '0px',
      top: '0px',
      display: 'none',
      position: 'absolute',
      pointerEvents: 'none',
    },
    value: null,
    time: null,
  };


  this.xAxis = d3AxisBottom()
    .scale(this.state.xScale)
    .ticks(4);

  this.yAxis = d3AxisLeft()
    .tickFormat(d3Format('.2s'))
    .scale(this.state.yScale);
}

  componentDidUpdate() {
    if (!(this.props.interval === '7d' || this.props.interval === '30d')) {
      this.xAxis.tickFormat(d3timeFormat('%H:%M:%S'));
    } else {
      this.xAxis.tickFormat(d3timeFormat('%m/%d %H:%M'));
    }
    d3Select(this.xAxisRef).call(this.xAxis);
    d3Select(this.yAxisRef)
      .call(this.yAxis)
      .selectAll('text')
      .attr('transform', 'rotate(45)');
    const yAxisGrids = d3AxisLeft(this.state.yScale)
      .tickFormat('')
      .tickSize(-this.props.width + 100);
    const xAxisGrids = d3AxisBottom(this.state.xScale)
      .tickFormat('')
      .tickSize(280);
    d3Select(this.yGridRef).call(yAxisGrids);
    d3Select(this.xGridRef).call(xAxisGrids);
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log("nextProps.columns",nextProps.columns)
    // if (!nextProps.columns) return null;
    
    const selectX = datum => new Date(datum.time/1e6);
    const selectY = datum => datum[nextProps.field];
    const selectYConst = () => nextProps.constValue;
    

    // console.log("nextProps.columns.values",nextProps.columns.values)
    // const data = nextProps.columns.values || [];
    
    const data = nextProps.columns && nextProps.columns.values ? nextProps.columns.values /* istanbul ignore next */ : [];

    const { width, maxValue } = nextProps;
    const { xScale, yScale } = prevState;
    xScale.range([0, width ? width - 100 : 300]);
    const timeDomain = d3ArrayExtent(data, selectX);
    let valMax = d3ArrayMax(data, selectY);
    if (nextProps.constValue) {
      /* istanbul ignore if */
      if(valMax < nextProps.constValue) {
        valMax = nextProps.constValue;
      }
    }
    xScale.domain(timeDomain);
    if (maxValue) {
      yScale.domain([0, 100]);
    } else {
      yScale.domain([0, valMax !== 0 ? valMax * 1.25 /* istanbul ignore next */ : 10]);
    }

    const selectScaledX = datum => xScale(selectX(datum));
    const selectScaledY = datum => yScale(selectY(datum));
    const sparkLine = d3Line()
      .x(selectScaledX)
      .y(selectScaledY);
    const constSparkLine = d3Line()
      .x(selectScaledX)
      .y((datum) => yScale(selectYConst(datum)));
    const circlePoints = data.map((datum) => ({
      x: selectScaledX(datum),
      y: selectScaledY(datum),
      data: datum[nextProps.field],
      t: d3timeFormat('%m/%d %H:%M')(new Date(datum.time/1e6)),
    }));
    
    
    // if (nextProps.chartType === 'bar') {
    //   const rectangles = data.map((datum) => ({
    //     x: selectScaledX(datum),
    //     y: selectScaledY(datum),
    //     height: 280 - selectScaledY(datum),
    //   }));
    //   return { circlePoints, rectangles };
    // }
    const linePath = sparkLine(data);
    const constLinePath = constSparkLine(data);
    const area = d3Area()
      .x(selectScaledX)
      .y0(280)
      .y1(selectScaledY);
    const areaGraph = area(data);
    return { circlePoints, areaGraph, linePath, constLinePath };
  }

  mouseOverPoint(event) {
    const boundingRectangle = event.target.getBoundingClientRect();
    const bodyBound = document
      .getElementsByTagName('body')[0]
      .getBoundingClientRect();
    const x =
      boundingRectangle.left -
      (bodyBound.right > boundingRectangle.left + 300 /* istanbul ignore next */? 50 : 160);
    const y = boundingRectangle.top - 50;

    this.setState({
      ...this.state,
      value: event.target.getAttribute('data'),
      time: event.target.getAttribute('t'),
      tooltipStyle: {
        ...this.state.tooltipStyle,
        display: 'block',
        left: `${x}px`,
        top: `${y}px`,
        position: 'fixed'
      },
    });
  }

  mouseOut() {
    this.setState({
      ...this.state,
      tooltipStyle: {
        ...this.state.tooltipStyle,
        display: 'none',
      },
    });
  }

  render() {
    const { classes } = this.props;
    const renderGraph = () => {
      return (
        <React.Fragment>
          <g className="line">
            <path d={this.state.linePath} transform="translate(50,20)" />
          </g>
          {this.props.constValue !== null ? (
            <g className="constline">
              <path d={this.state.constLinePath} transform="translate(50,20)" />
            </g>
          ): null}
          <g className="area">
            <path d={this.state.areaGraph} transform="translate(50,20)" />
          </g>
        </React.Fragment>
      );
    };
    return (
      <React.Fragment>
          <Paper className={classes.root}>
            <Typography variant="caption" className={classes.title} align="center">{this.props.chartName}</Typography>
            {this.state.linePath !== null || this.state.rectangles !== null ? (
              <svg
                className="container"
                data-testid = {this.props.datatestid}
                style={{
                  overflow: 'visible',
                  height: '90%',
                  width: '100%',
                }}
              >
                <g>
                  <g
                    className="xAxis"
                    ref={(r) => { this.xAxisRef = r; }}
                    transform={`translate(50,${this.height + 20})`}
                  />
                  <g
                    className="yAxis"
                    ref={(r) => { this.yAxisRef = r; }}
                    transform="translate(50,20)"
                  />
                  <g className="grid" ref={(r) => { this.yGridRef = r; }} transform="translate(50,20)" />
                  <g className="grid" ref={(r) => { this.xGridRef = r; }} transform="translate(50,20)" />
                  {renderGraph()}
                  <g className="scatter">
                    {/* {this.state.circlePoints
                      ?  */}
                      {this.state.circlePoints.map(circlePoint => (
                        <circle
                          cx={circlePoint.x}
                          cy={circlePoint.y}
                          data={circlePoint.data}
                          t={circlePoint.t}
                          key={`${circlePoint.x},${circlePoint.y}`}
                          r={4}
                          onMouseOver={this.mouseOverPoint.bind(this)}
                          onFocus={this.mouseOverPoint.bind(this)}
                          onMouseOut={this.mouseOut.bind(this)}
                          onBlur={this.mouseOut.bind(this)}
                          transform="translate(50,20)"
                          data-testid = {this.props.scatterId}
                        />
                      ))}
                      {/* : null} */}
                  </g>
                  <text
                    transform="rotate(-90)"
                    x={0 - this.height / 2}
                    y={15}
                    style={{ textAnchor: 'middle' }}
                  >
                    {this.props.yLabel}
                  </text>
                </g>
              </svg>
            ) : (
                <Typography className={classes.nodata}>
                  No Data Available to Display
                </Typography>
              )}
            <Tooltip
              containerStyle={this.state.tooltipStyle}
              value={d3Format('.2s')(this.state.value)}
              label={this.props.chartName}
              t={this.state.time}
            />
          </Paper>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Chart);
