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

DESCRIPTION: Configuration Page Component for Adding Email Alerts
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi, Palak Kapoor 
@Version : 1.0 
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
[08/21/2019] [Palak]: Material UI........///////////////////  
*/
/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import MaterialTable, { MTableToolbar } from "material-table";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { createMuiTheme , TablePagination } from "@material-ui/core";
import ThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import Search from "@material-ui/icons/Search";
import SaveAlt from "@material-ui/icons/SaveAlt";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Add from "@material-ui/icons/Add";
import Check from "@material-ui/icons/Check";
import FilterList from "@material-ui/icons/FilterList";
import Remove from "@material-ui/icons/Remove";
import EditIcon from "@material-ui/icons/Edit";
import TrashIcon from "@material-ui/icons/Delete";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Clear from "@material-ui/icons/Clear";
import Switch from "@material-ui/core/Switch";

import "./EmailAlerts.css";

const styles = theme => ({
  root: {
    flexGrow: 1
  },

  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },

  EmailTableMainHeader: {
    textAlign: "left",
    color: "rgba(255, 255, 255, 0.87)",
    fontSize: "14px",
    borderRadius: "0px",
    width: "100%",
    marginLeft: "10px",
    lineHeight: "2"
  },

  EmailAlertsPaper: {
    width: "100%"
    // margin: '0px',
    // padding: '0px',
    // boxShadow: 'none',
  },

  EmailAlertsCard: {
    // backgroundColor: 'rgb(113, 133, 157)',
    backgroundColor: "#788595",
    justifyContent: "center"
  },

  SpecifySmtpCard: {
    borderRadius: "0px",
    marginTop: "2px",
    paddingTop: "10px",
    boxShadow: "none"
  },

  SpecifySmtpText: {
    marginLeft: "10px",
    paddingTop: "10px",
    textAlign: "center",
    color: "#151d3b",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
      display: "flex",
      marginLeft: "-8px"
    }
  },

  SendEmailAlerts: {
    marginLeft: "-12px",
    textAlign: "center",
    color: "#151d3b",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
      display: "flex",
      marginLeft: "-8px"
    }
  },

  EmailTableContainer: {
    display: "flex",
    width: "50%",
    border: "0px solid gray",
    marginBottom: "15px",
    overflow: "initial",
    marginTop: "10px",
    marginRight: "1000px",
    height: "290px",
    fontFamily: "Arial",
    fontSize: "12px",
    paddingLeft: "0px",
    paddingRight: "0px",
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  },

  SettingsForm: {
    display: "flex",
    marginLeft: "4px",
    fontSize: "10px",
    justifyContent: "space-between"
  },

  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 150
  },

  divider: {
    marginBottom: "40px"
  },

  deletetextField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 150,
    marginTop: "30px",
    color: "black",
    background: "rgb(245,245,245)",
    textDecoration: "none",
    borderBottom: "none",

    "&>input": {
      paddingLeft: "4px"
    }
  },

  submit: {
    // background: '#007bff',
    height: "1.8rem",
    fontSize: "12px",
    // marginTop: '35px',
    marginTop: "1.75rem",
    // lineHeight: '0.5',
    textTransform: "none",
    marginRight: "10px",
    minWidth: "0px",
    width: "60px"
  },

  inputCard: {
    boxShadow: "none",
    width: "50%"
  },

  gridItem: {
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
      display: "flex"
    }
  },

  labelText: {
    fontSize: "12px"
  },

  table: {
    margin: "10px"
  },

  inputText: {
    color: "black",
    fontSize: "12px",
    margin: "0px",
    padding: "0px",

    "&>input": {
      cursor: "context-menu",
      textAlign: "center",
      justifyContent: "center",

      [theme.breakpoints.down("xs")]: {
        justifyContent: "left",
        textAlign: "left",
        paddingLeft: "1px"
      }
    },

    "&:before": {
      borderBottom: "none"
    },

    "&:hover:not(.Mui-disabled):before": {
      borderBottom: "none"
    },

    "&:after": {
      borderBottom: "none"
    }
  }
});

class EmailAlerts extends Component {
  constructor(props) {
    super(props);

    this.theme = createMuiTheme({
      overrides: {
        MuiSvgIcon: {
          //  stylesheet name
          root: {
            //  rule name
            color: "#808080"
          }
        },
        MuiTablePagination: {
          menuItem: {
            fontSize: "12px",
            minHeight: "0px"
          },
          select: {
            width: "45px"
          }
        }
      },

      palette: {
        primary: {
          main: "#4caf50"
        },
        secondary: {
          main: "#808080"
        }
      }
    });

    this.state = {
      columns: [
        {
          title: "Email ID",
          field: "email",
          cellStyle: {
            fontSize: "12px"
          },
          render: rowData => {
            return <span id={rowData.email}>{rowData.email}</span>;
          }
        },
        {
          title: "Active",
          field: "active",
          editable: "never",
          sorting: false,
          render: rowData => {
            const { data } = this.state;
            const index = data.indexOf(rowData);
            const id = rowData ? `EmailAlerts-togglebtn-${ rowData.email}` : "";
            return (
              <Switch
                size="small"
                checked={rowData && (rowData.active === 1 || rowData.active)}
                color="primary"
                disabled={
                  index < 0 ||
                  (rowData.tableData && rowData.tableData.editing === "update")
                }
                onClick={() => this.props.toggleEmailStatus(index)}
                data-testid="toggleButton"
                id={id}
              />
            );
          },

          cellStyle: {
            maxHeight: "12px",
            paddingTop: "0px",
            paddingBottom: "0px"
          },

          headerStyle: {
            paddingLeft: "18px"
          }
        }
      ],

      data: []
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ data: newProps.emailids });
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.EmailAlertsPaper}>
        <Grid className={classes.EmailAlertsCard}>
          <Typography className={classes.EmailTableMainHeader}>
            Email Alerts
          </Typography>
        </Grid>
        <Card className={classes.SpecifySmtpCard}>
          <Typography
            variant="caption"
            color="secondary"
            className={classes.SpecifySmtpText}
          >
            Specify SMTP Network Settings
          </Typography>
          <Divider />
          <form className={classes.SettingsForm} noValidate autoComplete="off">
            <Grid container>
              <Grid item xs={12} sm={6} className={classes.gridItem}>
                <form
                  autoComplete="off"
                  onSubmit={event => {
                    this.props.testserver(event);
                  }}
                  data-testid="form"
                >
                  <TextField
                    id="smtp-server"
                    label="SMTP Server"
                    required
                    className={classes.textField}
                    placeholder="IP:Port"
                    onChange={event => this.props.savesmtpserverdetails(event)}
                    InputLabelProps={{
                      className: classes.labelText
                    }}
                    name="smtpserver"
                    type="text"
                    margin="normal"
                    data-testid="smtpServerField"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.submit}
                    data-testid="applyButton"
                  >
                    Apply
                  </Button>
                </form>
              </Grid>

              <Grid item xs={12} sm={6} className={classes.gridItem}>
                <TextField
                  id="smtp-server-display"
                  className={classes.deletetextField}
                  InputProps={{
                    readOnly: true,
                    className: classes.inputText
                  }}
                  margin="normal"
                  type="text"
                  value={this.props.configuredsmtpserver}
                  data-testid="readOnlyField"
                />
                <Button
                  onClick={() => {
                    this.props.deleteConfiguredSmtpServer();
                  }}
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  data-testid="deleteButton"
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </form>
          <Grid>
            <ThemeProvider theme={this.theme}>
              <MaterialTable
                icons={{
                  Check,
                  FirstPage: () => (
                    <FirstPage id="EmailAlerts-icon-firstpage" />
                  ),
                  LastPage: () => <LastPage id="EmailAlerts-icon-lastpage" />,
                  NextPage: () => (
                    <ChevronRight id="EmailAlerts-icon-nextpage" />
                  ),
                  PreviousPage: () => (
                    <ChevronLeft id="EmailAlerts-icon-previouspage" />
                  ),
                  Search,
                  ThirdStateCheck: Remove,
                  DetailPanel: ChevronRight,
                  Export: SaveAlt,
                  Filter: FilterList,
                  Add: () => <Add id="EmailAlerts-icon-addemail" />,
                  Edit: () => <EditIcon id="EmailAlerts-icon-editemail" />,
                  Delete: TrashIcon,
                  SortArrow: ArrowUpward,
                  Clear
                }}
                components={{
                  Toolbar: props => (
                    <div style={{ height: "50px", fontSize: "12px" }}>
                      <MTableToolbar {...props} />
                    </div>
                  ),
                  Pagination: props => (
                    <TablePagination
                      {...props}
                      // labelRowsPerPage={<div style={{fontSize: 12}}>{props.labelRowsPerPage}</div>}
                      // labelDisplayedRows={row => <div style={{fontSize: 12}}>{props.labelDisplayedRows(row)}</div>}
                      // SelectProps={{
                      //   style:{
                      //     fontSize: 12,
                      //   }
                      // }}
                    />
                  )
                }}
                title={(
<div>
                    <Typography
                      variant="caption"
                      className={classes.SendEmailAlerts}
                    >
                      Send Email Alerts through the following Email List
                    </Typography>
</div>
)}
                actions={[
                 /* {
                    icon: EmailIcon,
                    iconProps: {
                      color: "secondary",
                      id: "EmailAlerts-icon-testemail"
                    },
                    tooltip: "Test Email",
                    onClick: (event, rowData) => {
                      const { data } = this.state;
                      const index = data.indexOf(rowData);
                      this.props.selectEmail(index);
                      this.props.sendEmail();
                    },
                    "data-testid": "action"
                  },
		  */
                  {
                    icon: TrashIcon,
                    iconProps: {
                      color: "secondary",
                      id: "EmailAlerts-icon-deleteemail"
                    },
                    tooltip: "Delete",
                    onClick: (evt, oldData) => {
                      const { data } = this.state;
                      const index = data.indexOf(oldData);
                      this.props.selectEmail(index);
                      this.props.openAlert("Delete");
                    }
                  }
                ]}
                options={{
                  rowStyle: {
                    fontSize: "4px"
                  },
                  search: false,
                  paginationType: "normal",
                  loadingType: "linear",
                  actionsColumnIndex: -1,
                  headerStyle: {
                    // backgroundColor: 'rgb(113, 133, 157)',
                    backgroundColor: "#788595",
                    color: "rgba(255, 255, 255, 0.87)",
                    fontSize: "14px",
                    height: "10%",
                    paddingTop: "2px",
                    paddingBottom: "2px"
                  }
                }}
                columns={this.state.columns}
                data={this.state.data}
                editable={{
                  onRowAdd: newData =>
                    new Promise(resolve => {
                      setTimeout(() => {
                        this.props.saveChange(newData, -1, true);
                        resolve();
                      }, 1000);
                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise(resolve => {
                      setTimeout(() => {
                        {
                          const { data } = this.state;
                          const index = data.indexOf(oldData);

                          this.props.editEmail(index);
                          this.props.saveChange(newData, index, false);
                          data[index] = newData;
                          this.setState({ data }, () => resolve());
                        }
                        resolve();
                      }, 1000);
                    })
                }}
              />
            </ThemeProvider>
          </Grid>
        </Card>
      </Paper>
    );
  }
}
export default withStyles(styles)(EmailAlerts);
