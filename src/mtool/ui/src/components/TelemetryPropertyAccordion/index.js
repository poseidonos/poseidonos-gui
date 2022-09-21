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
    withStyles
} from '@material-ui/core';

const styles = (theme) => ({
    accordionSummary: {
        backgroundColor: 'rgb(120, 133, 149)',
        color: '#fff'
    },
    formControlWrap: {
        overflow: 'hidden'
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

    const isAllSelected = data && data.fields ?  data.fields.reduce((prev, cur) => prev && cur.isSet, true) : false;

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
                    expandIcon={<ExpandMore htmlColor='#fff' />}
                    id={data.category}
                >
                    <Checkbox className={classes.accordionCheckbox} checked={isAllSelected} onClick={selectAllProperties} />
                    <Typography className={classes.accordionTitle}>{data.category}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        {data.fields.map((f) => (
                            <Grid item xs={12} sm={6} xl={4} className={classes.formControlWrap}>
                                <FormControlLabel
                                    className={classes.formLabel}
                                    classes={{
                                        label: classes.formLabelText
                                    }}
                                    control={<Checkbox checked={f.isSet} onClick={setProperty}/>}
                                    label={f.label}
                                    name={f.field}
                                    value={f.field}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Grid>
    )
};

export default withStyles(styles)(TelemetryPropertyAccordion);