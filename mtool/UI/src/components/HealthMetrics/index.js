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
*/
import React, { Component } from "react";
import GaugeChart from "react-gauge-chart";
import { Paper, Grid, Typography, withStyles } from "@material-ui/core";

const styles = (theme) => ({
  healthMetricsPaper: {
    minHeight: 150,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  healthMetricContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  textOverflow: {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
});
let healthStatus = [];
let healthDetails = [];
let metricDetails = {};

class HealthMetrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gaugeWidth: "100%",
      healthMetrics: [],
    };
    this.setChartWidth = this.setChartWidth.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.setChartWidth);
    this.setChartWidth();
    this.props.healthStatusSocket.on("connect", () => {
      console.log("connected to health status socket"); // eslint-disable-line no-console
    });

    // on reconnection, reset the transports option, as the Websocket
    // connection may have failed (caused by proxy, firewall, browser, ...)
    this.props.healthStatusSocket.on("reconnect_attempt", () => {
      this.props.healthStatusSocket.io.opts.transports = [
        "polling",
        "websocket",
      ];
    });

    // callback function for health status response
    this.props.healthStatusSocket.on("health_status_response", (result) => {
      console.log("response for health status", result);
      healthStatus = [];
      healthDetails = result.statuses;
      const neededKeys = [
        "id",
        "arcsArr",
        "percentage",
        "value",
        "label",
        "unit",
      ];

      for(let idx = 0; idx < healthDetails.length; idx++){
        try{
          metricDetails = {};
          metricDetails.id = healthDetails[idx].id;
          metricDetails.arcsLength = healthDetails[idx].arcsArr;
          metricDetails.percentage = healthDetails[idx].percentage;
          metricDetails.value = healthDetails[idx].value;
          metricDetails.label = healthDetails[idx].label;
          metricDetails.unit = healthDetails[idx].unit;
          healthStatus.push(metricDetails);
        } 
        catch{
          continue;
        }
      }
      this.setState({
        ...this.state,
        healthMetrics: healthStatus,
      });

      console.log("health status res", healthStatus);
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setChartWidth);
  }

  setChartWidth() {
    setTimeout(() => {
      let chart;
      // istanbul ignore if
      if (this.state.healthMetrics.length > 0)
        chart = document.getElementById(this.state.healthMetrics[0].id);
      // istanbul ignore next
      const gaugeWidth = chart ? chart.clientWidth : 500;
      this.setState({
        ...this.state,
        gaugeWidth,
      });
    }, 100);
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper spacing={3} xs={6} className={classes.healthMetricsPaper}>
        <Grid container justify="space-around">
          {this.state.healthMetrics.map((metric) => (
            <Grid
              xs={10}
              md={4} // currently, it is assumed that there are only 3 health metrics
              justify="center"
              className={classes.healthMetricContainer}
              item
              spacing-xs-1="true"
            >
              <Typography
                align="center"
                className={classes.textOverflow}
                color="secondary"
              >
                {metric.label}
              </Typography>
              <Grid item xs={12}>
                <GaugeChart
                  id={metric.id}
                  styles={{ width: this.state.gaugeWidth }}
                  nrOfLevels={3}
                  arcsLength={metric.arcsLength}
                  colors={[
                    "rgba(91,225,44,0.7)",
                    "rgba(245,205,25,0.7)",
                    "rgba(234,66,40,0.7",
                  ]}
                  percent={metric.percentage}
                  arcPadding={0.02}
                  needleColor="#D6DBDF"
                  needleBaseColor="#D6DBDF"
                  textColor="rgba(0,0,0,0.8)"
                  formatTextValue={() => `${metric.value} ${metric.unit}`}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(HealthMetrics);
