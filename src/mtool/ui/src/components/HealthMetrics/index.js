/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Intel Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React, { Component } from "react";
import GaugeChart from "react-gauge-chart";
import { Paper, Grid, Typography, withStyles } from "@material-ui/core";
import Loader from "react-loader-spinner";

const styles = (theme) => ({
  healthMetricsPaper: {
    minHeight: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
      loading: true
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
      this.setState({
	      loading: false
      });
      healthStatus = [];
      healthDetails = result.statuses;
      /*
      const neededKeys = [
        "id",
        "arcsArr",
        "percentage",
        "value",
        "label",
        "unit",
      ];
      */

      for(let idx = 0; idx < healthDetails.length; idx += 1){
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
        catch(e){
          console.log("Exception occured while parsing health details", e); // eslint-disable-line no-console
        }
      }
      this.setState({
        ...this.state,
        healthMetrics: healthStatus,
      });

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
	 <Grid container justifyContent="space-around" align="center"> 
          {this.state.healthMetrics.map((metric) => (
            <Grid
              xs={10}
              md={3} // currently, it is assumed that there are only 4 health metrics
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
	  {this.state.loading ? (
		  <React.Fragment>
		     <Grid container justifyContent="center" alignItems="center" direction="column">
		      <Loader type="TailSpin" color="#788595" height={50} width={50} />
		      <Typography>Loading Health Meters... </Typography>
		     </Grid>
		  </React.Fragment>
	  ) : null}
  </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(HealthMetrics);
