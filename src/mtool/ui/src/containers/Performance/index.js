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

import React, { Component } from 'react';
import { withStyles , MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import { Grid, Typography, Box, FormControl, Select, MenuItem, Container } from '@material-ui/core';
import { connect } from 'react-redux';
import Chart from '../../components/Chart';
import './Performance.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { customTheme, PageTheme } from '../../theme';
import * as actionTypes from "../../store/actions/actionTypes";

const style = {
  height: '300px',
  width: '100%',
  float: 'left',
};

const styles = (theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingLeft: "35px",
    paddingRight: "35px",
    paddingTop: "10px"
  },
  toolbar: customTheme.toolbar,
  pageHeader: customTheme.page.title,
  titleContainer: {
    marginTop: theme.spacing(1)
  },
  selectLabel: {
    margin: theme.spacing(0, 1)
  },
  wrapper: {
    marginTop: theme.spacing(1)
  },
  operationContainer: {
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      justifyContent: 'center'
    }
  },
  volumeSelect: {
    maxWidth: 250
  },
  noVols: {
    marginTop: theme.spacing(4)
  }
});

const READ_BANDWIDTH = 'read_bw';
const WRITE_BANDWIDTH = 'write_bw';
const READ_IOPS = 'read_iops';
const WRITE_IOPS = 'write_iops';
const LATENCY = 'latency';

class Performance extends Component {
  constructor(props) {
    super(props);
    this.timeChanged = this.timeChanged.bind(this);
    this.fetchDetails = this.fetchDetails.bind(this);
    this.levelChanged = this.levelChanged.bind(this);
    this.volumeChanged = this.volumeChanged.bind(this);
    this.arrayChanged = this.arrayChanged.bind(this);
    this.measurementChanged = this.measurementChanged.bind(this);
    this.setChartWidth = this.setChartWidth.bind(this);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.interval = null;
    this.state = {
      chartwidth: 300,
      mobileOpen: false,
      intervalTime: '1m',
      level: 'array',
      volume: 'all-volumes',
      array: '',
      chartContent: ['array'],
      maxIops: null,
      maxBw: null,
      maxLatency: null,
      vols: [],
      selectedMeasurement: [READ_BANDWIDTH]
    };
  }

  componentDidMount() {
    this.fetchDetails();
    this.fetchVolumeNames();
    this.props.Get_Arrays();
    // this.props.fetchPowerSensorInfo();
    this.interval = setInterval(() => {
      this.fetchDetails();
    }, 2000);
    this.setChartWidth();
    window.addEventListener("resize", this.setChartWidth);
  }

  componentDidUpdate() {
    if (this.state.array === "" && this.props.arrays.length > 0) {
      this.props.Set_Array(this.props.arrays[0].arrayname);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        array: this.props.arrays[0].arrayname,
        arrayId: this.props.arrays[0].index
      })
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    window.removeEventListener("resize", this.setChartWidth);
    this.props.Reset_State();
  }

  handleDrawerToggle() {
    this.setState({
      mobileOpen: !this.state.mobileOpen
    });
  }

  setChartWidth() {
    setTimeout(() => {
      const chart = document.getElementById(
        'graph-grid-1'
      );
      const chartwidth = chart ? chart.clientWidth : 500;
      this.setState({
        ...this.state,
        chartwidth,
      });
    }, 100);
  }

  // fetchDiskUsed(t) {
  //   this.props.Get_Disk_Used({time: t});
  // }

  // fetchDiskWrite(t) {
  //   this.props.Get_Disk_Write({time: t});
  // }

  fetchCpuUsage(t) {
    this.props.Get_Cpu_Usage({ time: t });
  }

  // fetchInputPower(t) {
  //   this.props.fetchInputPower({ time: t });
  // }

  fetchReadBandwidth(t) {
    for (let i = 0; i < this.state.chartContent.length; i += 1) {
      if (this.state.level === "array") {
        this.props.Get_Read_Bandwidth({ time: t, level: this.state.chartContent[i], array: this.state.array, volume: null });
      }
      else if (this.state.volume !== "all-volumes" || this.state.selectedMeasurement.includes(READ_BANDWIDTH)) {
        this.props.Get_Read_Bandwidth({ time: t, array: this.state.array, volume: this.state.chartContent[i], level: this.state.chartContent[i], ...this.state.vols[i] });
      }
    }
  }

  fetchWriteBandwidth(t) {
    for (let i = 0; i < this.state.chartContent.length; i += 1) {
      if (this.state.level === "array")
        this.props.Get_Write_Bandwidth({ time: t, level: this.state.chartContent[i], array: this.state.array, volume: null });
      else if (this.state.volume !== "all-volumes" || this.state.selectedMeasurement.includes(WRITE_BANDWIDTH))
        this.props.Get_Write_Bandwidth({ time: t, array: this.state.array, volume: this.state.chartContent[i], level: this.state.chartContent[i], ...this.state.vols[i] });
    }
  }

  fetchWriteIOPS(t) {
    for (let i = 0; i < this.state.chartContent.length; i += 1) {
      if (this.state.level === "array")
        this.props.Get_Write_IOPS({ time: t, level: this.state.chartContent[i], array: this.state.array, volume: null });
      else if (this.state.volume !== "all-volumes" || this.state.selectedMeasurement.includes(WRITE_IOPS))
        this.props.Get_Write_IOPS({ time: t, array: this.state.array, volume: this.state.chartContent[i], level: this.state.chartContent[i], ...this.state.vols[i] });
    }
  }

  fetchReadIOPS(t) {
    for (let i = 0; i < this.state.chartContent.length; i += 1) {
      if (this.state.level === "array")
        this.props.Get_Read_IOPS({ time: t, level: this.state.chartContent[i], array: this.state.array, volume: null });
      else if (this.state.volume !== "all-volumes" || this.state.selectedMeasurement.includes(READ_IOPS))
        this.props.Get_Read_IOPS({ time: t, array: this.state.array, volume: this.state.chartContent[i], level: this.state.chartContent[i], ...this.state.vols[i] });
    }
  }


  fetchLatency(t) {
    for (let i = 0; i < this.state.chartContent.length; i += 1) {
      if (this.state.level === "array")
        this.props.Get_Latency({ time: t, level: this.state.chartContent[i], array: this.state.array, volume: null });
      else if (this.state.volume !== "all-volumes" || this.state.selectedMeasurement.includes(LATENCY))
        this.props.Get_Latency({ time: t, array: this.state.array, volume: this.state.chartContent[i], level: this.state.chartContent[i], ...this.state.vols[i] });
    }
  }

  fetchDetails() {
    if (this.state.level === 'system') {
      this.fetchCpuUsage(this.state.intervalTime);
    }
    // else if (this.state.level === 'power')
    //   this.fetchInputPower(this.state.intervalTime);
    else {
      this.fetchReadIOPS(this.state.intervalTime);
      this.fetchWriteIOPS(this.state.intervalTime);
      this.fetchReadBandwidth(this.state.intervalTime);
      this.fetchWriteBandwidth(this.state.intervalTime);
      this.fetchLatency(this.state.intervalTime);
    }
  }

  timeChanged(event) {
    this.setState({
      ...this.state,
      intervalTime: event.target.value,
    });
    setTimeout(() => {
      this.fetchDetails();
    });
  }

  levelChanged(event) {
    if (event.target.value === 'array') {
      this.setState({
        ...this.state,
        level: 'array',
        chartContent: ['array'],
        maxIops: null,
        maxBw: null,
        maxLatency: null,
      });
      setTimeout(() => {
        this.fetchDetails();
      });
    } else if (event.target.value === 'volume') {
      const vols = []; const chartContent = [];
      for (let i = 0; i < this.props.volumes.length; i += 1) {
        chartContent.push(this.props.volumes[i].id);
        vols.push(this.props.volumes[i]);
      }
      this.setState({
        ...this.state,
        chartContent,
        level: event.target.value,
        volume: 'all-volumes',
        vols
      });
      setTimeout(() => {
        this.fetchDetails();
      });
      this.fetchVolumeNames();
    } else if (event.target.value === 'system') {
      this.setState({
        ...this.state,
        level: 'system',
      });
      setTimeout(() => {
        this.fetchDetails();
      });
    }
    // else if (event.target.value === 'power') {
    //   this.setState({
    //     ...this.state,
    //     level: 'power',
    //   });
    //   setTimeout(() => {
    //     this.fetchDetails();
    //   });
    // this.props.fetchPowerSensorInfo();
    // }
  }

  fetchVolumeNames(callback) {
    this.props.Get_Volumes({ array: this.state.array, callback});
  }

  measurementChanged(event) {
    this.setState({
      ...this.state,
      selectedMeasurement: [event.target.value]
    });
    this.props.Reset_State();
  }

  arrayChanged(event) {
    this.props.Set_Array(event.target.value);
    this.setState({
      array: event.target.value,
      volume: 'all-volumes'
    }, () => {
      this.fetchVolumeNames(() => {
        if(this.state.level !== "array")
          this.volumeChanged({target: {value: 'all-volumes'}})
      });
    });
  }

  volumeChanged(event) {
    let vol; const chartContent = []; const vols = [];
    if (event.target.value === 'all-volumes') {
      for (let i = 0; i < this.props.volumes.length; i += 1) {
        chartContent.push(this.props.volumes[i].id);
        vols.push(this.props.volumes[i]);
      }
      this.setState({
        ...this.state,
        chartContent,
        volume: event.target.value,
        vols
      });
    } else {
      for (let i = 0; i < this.props.volumes.length; i += 1) {
        /* istanbul ignore else */
        if (event.target.value === this.props.volumes[i].id) {
          vol = this.props.volumes[i];
        }
      }
      this.setState({
        ...this.state,
        chartContent: [event.target.value],
        volume: event.target.value,
        maxIops: vol.maxiops,
        maxBw: vol.maxbw,
        maxLatency: vol.maxLatency,
        vols: [vol]
      });
    }
    this.props.Reset_State();
    setTimeout(() => {
      this.fetchDetails();
    });
  }

  render() {
    const timeIntervals = [
      ["1m", "Last 1m"],
      ["5m", "Last 5m"],
      ["15m", "Last 15m"],
      ["1h", "Last 1h"],
      ["6h", "Last 6h"],
      ["12h", "Last 12h"],
      ["24h", "Last 24h"],
      ["7d", "Last 7d"],
      ["30d", "Last 30d"]
    ];
    const measurements = [{
      label: "Read Bandwidth",
      value: READ_BANDWIDTH
    }, {
      label: "Write Bandwidth",
      value: WRITE_BANDWIDTH
    }, {
      label: "Read IOPS",
      value: READ_IOPS
    }, {
      label: "Write IOPS",
      value: WRITE_IOPS
    },
    {
      label: "Latency",
      value: LATENCY
    }];

    const { classes } = this.props;
    return (
      <ThemeProvider theme={PageTheme}>
        <Box display="flex">
          <Header toggleDrawer={this.handleDrawerToggle} />
          <Sidebar mobileOpen={this.state.mobileOpen} toggleDrawer={this.handleDrawerToggle} />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Grid container spacing={3}>
              <Grid container spacing={3} className={classes.titleContainer}>
                <Grid sm={4} xs={12} item>
                  <Typography className={classes.pageHeader} variant="h6">Performance</Typography>
                </Grid>
                <Grid sm={8} xs={12} item container direction="row" alignItems="center" justifyContent="flex-end" className={classes.operationContainer}>
                  <Typography className={classes.selectLabel}>Level:</Typography>
                  <FormControl>
                    <Select
                      value={this.state.level}
                      onChange={this.levelChanged}
                      inputProps={{
                        name: 'Level',
                        id: 'level',
                        'data-testid': "levelInput",
                      }}
                      SelectDisplayProps={{
                        'data-testid': 'levelSelect'
                      }}
                    >
                      <MenuItem value="array">
                        <Typography color="secondary" data-testid="arrayMenuItem">Array</Typography>
                      </MenuItem>
                      <MenuItem value="volume">
                        <Typography color="secondary" data-testid="volumeMenuItem">Volume</Typography>
                      </MenuItem>
                      <MenuItem value="system">
                        <Typography color="secondary" data-testid="systemMenuItem">System</Typography>
                      </MenuItem>
                      {/* <MenuItem value="power">
                        <Typography color="secondary" data-testid="powerMenuItem">Power</Typography>
                      </MenuItem> */}
                    </Select>
                  </FormControl>
                  {(this.state.level === 'array' || this.state.level === 'volume') ? (
                    <React.Fragment>
                      <Typography className={classes.selectLabel}>Array:</Typography>
                      <FormControl>
                        <Select
                          value={this.state.array}
                          onChange={this.arrayChanged}
                          inputProps={{
                            name: 'Array',
                            id: 'array',
                            'data-testid': "arrayInput",
                          }}
                          SelectDisplayProps={{
                            'data-testid': 'arraySelect'
                          }}
                          id="array"
                          ref={(r) => {
                            this.arrayRef = r
                          }}
                          disabled={this.props.arrays &&
                            this.props.arrays.length < 1}
                        >
                          {this.props.arrays.map((array) => (
                            <MenuItem key={array.arrayname} value={array.arrayname} data-testid={array.arrayname}>
                              <Typography color="secondary">
                                {array.arrayname}
                              </Typography>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </React.Fragment>
                  ) : null}
                  {(this.state.level === 'volume') ? (
                    <React.Fragment>
                      <Typography className={classes.selectLabel}>Volume:</Typography>
                      <FormControl>
                        <Select
                          value={this.state.volume}
                          onChange={this.volumeChanged}
                          className={classes.volumeSelect}
                          inputProps={{
                            name: 'Volume',
                            id: 'volume',
                            'data-testid': "volumeInput",
                          }}
                          SelectDisplayProps={{
                            'data-testid': 'volumeSelect'
                          }}
                          id="volume"
                          ref={(r) => {
                            this.volumeRef = r
                          }}
                          disabled={this.props.volumes &&
                            this.props.volumes.length < 1}
                        >
                          <MenuItem value="all-volumes" data-testid="all-volume">
                            <Typography color="secondary">
                              All Volumes
                            </Typography>
                          </MenuItem>
                          {this.props.volumes.map((volume) => (
                            <MenuItem value={volume.id} data-testid={volume.name}>
                              <Typography color="secondary">
                                {volume.name}
                              </Typography>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </React.Fragment>
                  ) : null}
                  {((this.state.level === 'volume') && (this.state.volume === 'all-volumes')) ? (
                    <React.Fragment>
                      <Typography className={classes.selectLabel}>Measurement:</Typography>
                      <Select
                        value={this.state.selectedMeasurement[0]}
                        onChange={this.measurementChanged}
                        inputProps={{
                          name: 'Time',
                          id: 'time',
                          'data-testid': "measurementInput"
                        }}
                        SelectDisplayProps={{
                          'data-testid': 'measurementSelect'
                        }}
                      >
                        {measurements.map((measurement) => (
                          <MenuItem key={measurement.value} value={measurement.value} data-testid={measurement.value}>
                            <Typography color="secondary">
                              {measurement.label}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </React.Fragment>
                  ) : null}
                  <Typography className={classes.selectLabel}>Time:</Typography>
                  <FormControl>
                    <Select
                      value={this.state.intervalTime}
                      onChange={this.timeChanged}
                      inputProps={{
                        name: 'Time',
                        id: 'time',
                        'data-testid': "timeInput"
                      }}
                      SelectDisplayProps={{
                        'data-testid': 'intervalSelect'
                      }}
                    >
                      {timeIntervals.map((t) => (
                        <MenuItem key={t[0]} value={t[0]} data-testid={t[0]}>
                          <Typography color="secondary">
                            {t[1]}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {/* {this.state.level === "power" ? (
                this.props.power_sensor_info.map((power) => (
                  power.PowerInputWatts ? (
                    <React.Fragment>
                      {this.props.power_usage ? (
                        <Grid item xs={12} md={6} id="graph-grid-1">
                          <Chart
                            id="chart-5"
                            columns={this.props.power_usage}
                            loaded={this.props.power_usage.loaded}
                            yLabel={this.props.power_usage.yLabel}
                            chartName={power.Name}// {"PSU "+itr + "- Voltage"}
                            width={this.state.chartwidth}
                            interval={this.state.intervalTime}
                            style={style}
                          />
                        </Grid>
                      ):null}
                    </React.Fragment>
                  ) : null))) : null} */}
              {this.state.level === 'array' ? (
                <Grid container spacing={1} className={classes.wrapper}>
                  <Grid item xs={12} md={6} id="graph-grid-1">
                    <Chart
                      id="chart-1"
                      columns={this.props.readBandwidth}
                      loaded={this.props.readBandwidth.loaded}
                      yLabel={this.props.readBandwidth.yLabel}
                      chartName={`${this.props.readBandwidth.name} - ${this.state.array}`}
                      width={this.state.chartwidth}
                      interval={this.state.intervalTime}
                      startTime={this.props.readBandwidth.startTime}
                      endTime={this.props.readBandwidth.endTime}
                      constValue={this.state.maxBw}
                      style={style}
                      field="bw"
                      datatestid="readBandwidth"
                      scatterId="readBandwidthScatter"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Chart
                      id="chart-2"
                      columns={this.props.writeBandwidth}
                      loaded={this.props.writeBandwidth.loaded}
                      yLabel={this.props.writeBandwidth.yLabel}
                      chartName={`${this.props.writeBandwidth.name} - ${this.state.array}`}
                      width={this.state.chartwidth}
                      interval={this.state.intervalTime}
                      startTime={this.props.writeBandwidth.startTime}
                      endTime={this.props.writeBandwidth.endTime}
                      constValue={this.state.maxBw}
                      style={style}
                      field="bw"
                      datatestid="writeBandwidth"
                      scatterId="writeBandwidthScatter"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Chart
                      id="chart-3"
                      columns={this.props.readIOPS}
                      loaded={this.props.readIOPS.loaded}
                      yLabel={this.props.readIOPS.yLabel}
                      chartName={`${this.props.readIOPS.name} - ${this.state.array}`}
                      width={this.state.chartwidth}
                      interval={this.state.intervalTime}
                      startTime={this.props.readIOPS.startTime}
                      endTime={this.props.readIOPS.endTime}
                      constValue={this.state.maxIops}
                      style={style}
                      field="iops"
                      datatestid="readIOPS"
                      scatterId="readIOPSScatter"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Chart
                      id="chart-4"
                      columns={this.props.writeIOPS}
                      loaded={this.props.writeIOPS.loaded}
                      yLabel={this.props.writeIOPS.yLabel}
                      chartName={`${this.props.writeIOPS.name} - ${this.state.array}`}
                      width={this.state.chartwidth}
                      interval={this.state.intervalTime}
                      startTime={this.props.writeIOPS.startTime}
                      endTime={this.props.writeIOPS.endTime}
                      constValue={this.state.maxIops}
                      style={style}
                      field="iops"
                      datatestid="writeIOPS"
                      scatterId="writeIOPSScatter"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Chart
                      id="chart-5"
                      columns={this.props.latency}
                      loaded={this.props.latency.loaded}
                      yLabel={this.props.latency.yLabel}
                      chartName={`${this.props.latency.name} - ${this.state.array}`}
                      width={this.state.chartwidth}
                      interval={this.state.intervalTime}
                      startTime={this.props.latency.startTime}
                      endTime={this.props.latency.endTime}
                      constValue={this.state.maxLatency}
                      style={style}
                      factor={1/1e6}
                      field="latency"
                      datatestid="latency"
                      scatterId="latencyScatter"
                    />
                  </Grid>
                </Grid>
              ) : null}
              {this.state.level === "system" ? (
                <Grid container spacing={1} className={classes.wrapper}>
                  <Grid item xs={12} md={6} id="graph-grid-1">
                    <Chart
                      id="chart-5"
                      columns={this.props.cpuUsage}
                      loaded={this.props.cpuUsage.loaded}
                      yLabel={this.props.cpuUsage.yLabel}
                      chartName={this.props.cpuUsage.name}
                      width={this.state.chartwidth}
                      maxValue={100}
                      interval={this.state.intervalTime}
                      startTime={this.props.cpuUsage.startTime}
                      endTime={this.props.cpuUsage.endTime}
                      style={style}
                      field="value"
                      datatestid="cpuusage"
                    />
                  </Grid>

                  {/* <Grid item xs={12} md={6}>
                    <Chart
                      id="chart-7"
                      columns={this.props.diskUsed}
                      loaded={this.props.diskUsed.loaded}
                      yLabel={this.props.diskUsed.yLabel}
                      chartName={this.props.diskUsed.name}
                      width={this.state.chartwidth}
                      maxValue={100}
                      interval={this.state.intervalTime}
                      style={style}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Chart
                      id="chart-8"
                      columns={this.props.diskWrite}
                      loaded={this.props.diskWrite.loaded}
                      yLabel={this.props.diskWrite.yLabel}
                      chartName={this.props.diskWrite.name}
                      width={this.state.chartwidth}
                      interval={this.state.intervalTime}
                      style={style}
                    />
                  </Grid> */}
                </Grid>
              ) : null}
              {this.state.level === "volume" ? (
                this.state.chartContent.map((content) => (
                  this.props.vols[content] ? (
                    <React.Fragment>
                      {this.props.vols[content].readBandwidth && (this.state.volume !== "all-volumes" || this.state.selectedMeasurement.includes(READ_BANDWIDTH)) ? (
                        <Grid item xs={12} md={6} id="graph-grid-1">
                          <Chart
                            id="chart-1"
                            columns={this.props.vols[content].readBandwidth}
                            loaded={this.props.vols[content].readBandwidth.loaded}
                            yLabel={this.props.vols[content].readBandwidth.yLabel}
                            chartName={`${this.props.vols[content].readBandwidth.name} (${this.state.array})`}
                            width={this.state.chartwidth}
                            interval={this.state.intervalTime}
                            startTime={this.props.vols[content].readBandwidth.startTime}
                            endTime={this.props.vols[content].readBandwidth.endTime}
                            constValue={this.props.vols[content].readBandwidth.maxbw}
                            style={style}
                            field="bw"
                            datatestid="readBandwidth-vol"
                            scatterId="readBandwidthScatter"
                          />
                        </Grid>
                      ) : null}

                      {this.props.vols[content].writeBandwidth && (this.state.volume !== "all-volumes" || this.state.selectedMeasurement.includes(WRITE_BANDWIDTH)) ? (
                        <Grid item xs={12} md={6}>
                          <Chart
                            id="chart-2"
                            columns={this.props.vols[content].writeBandwidth}
                            loaded={this.props.vols[content].writeBandwidth.loaded}
                            yLabel={this.props.vols[content].writeBandwidth.yLabel}
                            chartName={`${this.props.vols[content].writeBandwidth.name} (${this.state.array})`}
                            width={this.state.chartwidth}
                            interval={this.state.intervalTime}
                            startTime={this.props.vols[content].writeBandwidth.startTime}
                            endTime={this.props.vols[content].writeBandwidth.endTime}
                            constValue={this.props.vols[content].writeBandwidth.maxbw}
                            style={style}
                            field="bw"
                            datatestid="writeBandwidth-vol"
                            scatterId="writeBandwidthScatter"
                          />
                        </Grid>
                      ) : null}
                      {this.props.vols[content].readIOPS && (this.state.volume !== "all-volumes" || this.state.selectedMeasurement.includes(READ_IOPS)) ? (
                        <Grid item xs={12} md={6}>
                          <Chart
                            id="chart-3"
                            columns={this.props.vols[content].readIOPS}
                            loaded={this.props.vols[content].readIOPS.loaded}
                            yLabel={this.props.vols[content].readIOPS.yLabel}
                            chartName={`${this.props.vols[content].readIOPS.name} (${this.state.array})`}
                            width={this.state.chartwidth}
                            interval={this.state.intervalTime}
                            startTime={this.props.vols[content].readIOPS.startTime}
                            endTime={this.props.vols[content].readIOPS.endTime}
                            constValue={this.props.vols[content].readIOPS.maxiops}
                            style={style}
                            field="iops"
                            datatestid="readIOPS-vol"
                            scatterId="readIOPSScatter"
                          />
                        </Grid>
                      ) : null}
                      {this.props.vols[content].writeIOPS && (this.state.volume !== "all-volumes" || this.state.selectedMeasurement.includes(WRITE_IOPS)) ? (
                        <Grid item xs={12} md={6}>
                          <Chart
                            id="chart-4"
                            columns={this.props.vols[content].writeIOPS}
                            loaded={this.props.vols[content].writeIOPS.loaded}
                            yLabel={this.props.vols[content].writeIOPS.yLabel}
                            chartName={`${this.props.vols[content].writeIOPS.name} (${this.state.array})`}
                            width={this.state.chartwidth}
                            interval={this.state.intervalTime}
                            startTime={this.props.vols[content].writeIOPS.startTime}
                            endTime={this.props.vols[content].writeIOPS.endTime}
                            constValue={this.props.vols[content].writeIOPS.maxiops}
                            style={style}
                            field="iops"
                            datatestid="writeIOPS-vol"
                            scatterId="writeIOPSScatter"
                          />
                        </Grid>
                      ) : null}

                      {this.props.vols[content].latency && (this.state.volume !== "all-volumes" || this.state.selectedMeasurement.includes(LATENCY)) ? (
                        <Grid item xs={12} md={6}>
                          <Chart
                            id="chart-5"
                            columns={this.props.vols[content].latency}
                            loaded={this.props.vols[content].latency.loaded}
                            yLabel={this.props.vols[content].latency.yLabel}
                            chartName={`${this.props.vols[content].latency.name} (${this.state.array})`}
                            width={this.state.chartwidth}
                            interval={this.state.intervalTime}
                            startTime={this.props.vols[content].latency.startTime}
                            endTime={this.props.vols[content].latency.endTime}
                            constValue={this.props.vols[content].latency.maxLatency}
                            style={style}
                            factor={1/1e6}
                            field="latency"
                            datatestid="latency-vol"
                            scatterId="latencyScatter"
                          />
                        </Grid>
                      ) : null}

                    </React.Fragment>
                  ) : null
                ))
              ) : null}
              {/* istanbul ignore next */this.state.level === "volume" && this.state.chartContent.length === 0 ? (
                <Container className={classes.noVols}>
                  <Typography variant="h1" align="center">No Volumes Created</Typography>
                </Container>
              ) : null}
            </Grid>
          </main>
        </Box>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    cpuUsage: state.performanceReducer.cpuUsage,
    diskWrite: state.performanceReducer.diskWrite,
    diskUsed: state.performanceReducer.diskUsed,
    readIOPS: state.performanceReducer.readIOPS,
    writeIOPS: state.performanceReducer.writeIOPS,
    readBandwidth: state.performanceReducer.readBandwidth,
    power_usage: state.performanceReducer.power_usage,
    vols: state.performanceReducer.vols,
    writeBandwidth: state.performanceReducer.writeBandwidth,
    latency: state.performanceReducer.latency,
    volumes: state.storageReducer.volumes,
    arrays: state.storageReducer.arrays,
    power_sensor_info: state.hardwareSensorReducer.power_sensor_info,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    Get_Cpu_Usage: (payload) => dispatch({ type: actionTypes.SAGA_FETCH_CPU_USAGE, payload }),
    Get_Read_Bandwidth: (payload) => dispatch({ type: actionTypes.SAGA_FETCH_READ_BANDWIDTH, payload }),
    Get_Write_Bandwidth: (payload) => dispatch({ type: actionTypes.SAGA_FETCH_WRITE_BANDWIDTH, payload }),
    Get_Read_IOPS: (payload) => dispatch({ type: actionTypes.SAGA_FETCH_READ_IOPS, payload }),
    Get_Write_IOPS: (payload) => dispatch({ type: actionTypes.SAGA_FETCH_WRITE_IOPS, payload }),
    Get_Latency: (payload) => dispatch({ type: actionTypes.SAGA_FETCH_LATENCY, payload }),
    // fetchInputPower: (payload) => dispatch({ type: actionTypes.SAGA_FETCH_INPUT_POWER_VARIATION,payload }),
    Get_Volumes: (payload) => dispatch({ type: actionTypes.SAGA_FETCH_VOLUMES, payload }),
    Get_Arrays: () => dispatch({ type: actionTypes.SAGA_FETCH_ARRAY }),
    Set_Array: (payload) => dispatch({ type: actionTypes.SET_ARRAY, payload}),
    Reset_State: () => dispatch({ type: actionTypes.RESET_PERF_STATE }),
    // fetchPowerSensorInfo: () => dispatch({ type: actionTypes.SAGA_HARDWARE_SENSORS_FETCH_POWER_SENSOR_INFORMATION, }),
  }
}

export default withStyles(styles)((connect(mapStateToProps, mapDispatchToProps))(Performance));
