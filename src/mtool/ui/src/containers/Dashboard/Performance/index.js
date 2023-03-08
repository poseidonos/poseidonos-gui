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

import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Grid, Paper, Typography, withStyles } from "@material-ui/core";
import { customTheme } from "../../../theme";
import * as actionTypes from "../../../store/actions/actionTypes";
import { FETCH_API_INTERVAL } from "../../../utils/constants";

const styles = (theme) => ({
    cardHeader: {
        ...customTheme.card.header,
        marginLeft: 0,
        marginBottom: 0,
        paddingTop: 0
    },
    metricsPaper: {
        display: "flex",
        padding: theme.spacing(1, 2),
        paddingBottom: 0,
        flexWrap: "wrap",
    },
    metricContainer: {
        paddingBottom: theme.spacing(1),
        alignItems: "center",
        justifyContent: "center",
    },
    textOverflow: {
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
    },
    metricBox: {
        borderBottom: "2px solid #F1F0F5",
        [theme.breakpoints.down("lg")]: {
            borderRight: "4px solid #F1F0F5",
            borderBottom: "none"
        },
        [theme.breakpoints.down("md")]: {
            borderRight: "none",
            borderBottom: "2px solid #F1F0F5",
        },
        [theme.breakpoints.down("sm")]: {
            borderRight: "4px solid #F1F0F5",
            borderBottom: "none"
        },
        [theme.breakpoints.down("xs")]: {
            borderRight: "none",
            borderBottom: "2px solid #F1F0F5",
        },
    },
    writeColor: {
        height: "40px",
        textAlign: "center",
        color: customTheme.palette.secondary.main,
    },
    readColor: {
        height: "40px",
        textAlign: "center",
        color: "rgba(125, 106, 181, 1)",
    }
});

const MetricsCard = ({ classes, header, writeValue, readValue }) => {
    return (
        <Paper className={classes.metricsPaper}>
            <Grid item container xs={12} justifyContent="space-between">
                <Typography className={classes.cardHeader}>
                    {header}
                </Typography>
            </Grid>
            <Grid item container xs={12} sm={6} md={12} lg={6} xl={12} className={classes.metricContainer}>
                <Grid item xs={4}>
                    <Typography
                        align="center"
                        className={classes.textOverflow}
                        color={writeValue ? "secondary" : "primary"}
                        variant="h6"
                    >
                        Write
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={8}
                    className={classes.metricBox}
                >
                    <Typography
                        variant={writeValue ? "h4" : "h6"}
                        data-testid={`write-${header.toLowerCase()}`}
                        color="secondary"
                        className={classes.writeColor}
                    >
                        {writeValue !== 0 ? writeValue : "___"}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item container xs={12} sm={6} md={12} lg={6} xl={12} className={classes.metricContainer}>
                <Grid item xs={4}>
                    <Typography
                        align="center"
                        className={classes.textOverflow}
                        color={readValue ? "secondary" : "primary"}
                        variant="h6"
                    >
                        Read
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={8}
                >
                    <Typography
                        variant={readValue ? "h4" : "h6"}
                        data-testid={`read-${header.toLowerCase()}`}
                        className={classes.readColor}
                    >
                        {readValue !== 0 ? readValue : "___"}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    )
}

// eslint-disable-next-line react/no-multi-comp
const Performance = (props) => {
    const { classes, fetchPerformance, isConfigured } = props;

    useEffect(() => {
        if (isConfigured) {
            fetchPerformance();
        }
        const interval = setInterval(() => {
            if (isConfigured) {
                fetchPerformance();
            }
        }, FETCH_API_INTERVAL);

        return () => clearInterval(interval)
    }, [isConfigured, fetchPerformance]);

    return (
        <>
            <Grid xs={12} md={4} item>
                <MetricsCard
                    classes={classes}
                    header="Bandwidth"
                    writeValue={props.writeBW}
                    readValue={props.readBW}
                />
            </Grid>
            <Grid xs={12} md={4} item>
                <MetricsCard
                    classes={classes}
                    header="IOPS"
                    writeValue={props.writeIOPS}
                    readValue={props.readIOPS}
                />
            </Grid>
            <Grid xs={12} md={4} item>
                <MetricsCard
                    classes={classes}
                    header="Latency"
                    writeValue={props.writeLatency}
                    readValue={props.readLatency}
                />
            </Grid>
        </>
    );
};

const mapStateToProps = state => {
    return {
        readIOPS: state.dashboardReducer.readIOPS,
        writeIOPS: state.dashboardReducer.writeIOPS,
        readBW: state.dashboardReducer.readBW,
        writeBW: state.dashboardReducer.writeBW,
        readLatency: state.dashboardReducer.readLatency,
        writeLatency: state.dashboardReducer.writeLatency,
        isConfigured: state.authenticationReducer.isConfigured,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPerformance: () => dispatch({ type: actionTypes.SAGA_FETCH_PERFORMANCE_INFO }),
    };
};

export default withStyles(styles)(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Performance)
);