import { withStyles } from '@material-ui/core';
import React from 'react';
import { customTheme } from '../../../theme';

const styles = (theme) => ({
    content: {
        flexGrow: 1,
        backgroundColor: "#111217",
        marginTop: theme.spacing(1)
    },
    toolbar: customTheme.toolbar,
    iframe: {
        border: 0,
        width: "100%",
        height: "calc(100vh - 165px)"
    }
});

const Grafana = ({ classes, url }) => {
    return (
        <main className={classes.content}>
            <iframe
                title="iframe"
                src={url}
                className={classes.iframe}
            />
        </main>
    )
}

export default withStyles(styles)(Grafana);