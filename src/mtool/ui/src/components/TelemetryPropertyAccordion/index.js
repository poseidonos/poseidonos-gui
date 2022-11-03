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
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
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

import React from 'react';
import { ExpandMore } from '@material-ui/icons';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Checkbox,
    Grid,
    FormControlLabel,
    Typography,
    withStyles,
    Tooltip
} from '@material-ui/core';

const styles = (theme) => ({
    accordionSummary: {
        backgroundColor: 'rgb(120, 133, 149)',
        color: '#fff'
    },
    formControlWrap: {
        marginTop: theme.spacing(1)
    },
    formLabel: {
        width: '100%'
    },
    formLabelText: {
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    accordionContainer: {
        marginBottom: theme.spacing(1)
    },
    accordionCheckbox: {
        padding: 0,
        color: '#fff',
        marginRight: theme.spacing(1)
    }
})

const TelemetryPropertyAccordion = ({ data, classes, selectAll, selectProperty }) => {

    const isAllSelected = data && data.fields && data.fields.reduce((prev, cur) => prev && cur.isSet, true);

    const selectAllProperties = (e) => {
        e.stopPropagation();
        selectAll({category: data.category, status: isAllSelected});
    };

    const setProperty = (e) => {
        selectProperty(e.target.name);
    }

    return (
        <Grid item xs={12} key={data.category} className={classes.accordionContainer}>
            <Accordion>
                <AccordionSummary
                    className={classes.accordionSummary}
                    expandIcon={<ExpandMore htmlColor="#fff" />}
                    id={data.category}
                >
                    <Checkbox
                      className={classes.accordionCheckbox}
                      checked={isAllSelected} onClick={selectAllProperties}
                      data-testid={`checkbox-${data.category}`}
                      id={`checkbox-${data.category}`}
                    />
                    <Typography className={classes.accordionTitle}>{data.category}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        {data.fields.map((f) => (
                            <Grid item xs={12} sm={6} xl={4} className={classes.formControlWrap}>
                                <Tooltip
                                    title={f.field}
                                >
                                    <FormControlLabel
                                        className={classes.formLabel}
                                        classes={{
                                            label: data.category !== "Common" ? classes.formLabelText : {}
                                        }}
                                        control={(
                                            <Checkbox
                                                inputProps={{
                                                    "data-testid": `checkbox-${f.field}`,
                                                    "id": `checkbox-${f.field}`
                                                }}
                                                checked={f.isSet}
                                                onClick={setProperty}
                                            />
                                        )}
                                        label={`${f.label} (${f.field})`}
                                        name={f.field}
                                        value={f.field}
                                    />
                                </Tooltip>
                            </Grid>
                        ))}
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Grid>
    )
};

export default withStyles(styles)(TelemetryPropertyAccordion);