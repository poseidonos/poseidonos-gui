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

/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from "react";
import MaterialTable, { MTableToolbar } from "@material-table/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { TablePagination } from "@material-ui/core";
import { createTheme, withStyles, MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
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
import AlertDialog from "../Dialog";
import "./EmailAlerts.css";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },

  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },

  EmailTableMainHeader: {
    textAlign: "left",
    color: "rgba(255, 255, 255, 0.87)",
    fontSize: 14,
    borderRadius: "0px",
    width: "100%",
    marginLeft: "10px",
    lineHeight: "2",
  },

  EmailAlertsPaper: {
    width: "100%",
    // margin: '0px',
    // padding: '0px',
    // boxShadow: 'none',
  },

  EmailAlertsCard: {
    // backgroundColor: 'rgb(113, 133, 157)',
    backgroundColor: "#788595",
    justifyContent: "center",
  },

  SpecifySmtpCard: {
    borderRadius: "0px",
    marginTop: "2px",
    paddingTop: "10px",
    boxShadow: "none",
  },

  SpecifySmtpText: {
    marginLeft: "10px",
    paddingTop: "10px",
    textAlign: "center",
    color: "#151d3b",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
      display: "flex",
      // marginLeft: "-8px"
    },
  },

  SendEmailAlerts: {
    // marginLeft: "-12px",
    textAlign: "center",
    color: "#151d3b",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
      display: "flex",
      // marginLeft: "-8px"
    },
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
    fontSize: 12,
    paddingLeft: "0px",
    paddingRight: "0px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },

  SettingsForm: {
    display: "flex",
    marginLeft: "4px",
    fontSize: 10,
    justifyContent: "space-between",
  },

  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    // width: 150,
  },

  divider: {
    marginBottom: "40px",
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
      paddingLeft: "4px",
    },
  },

  submit: {
    // background: '#007bff',
    height: "1.8rem",
    fontSize: 12,
    // marginTop: '35px',
    marginTop: "1.75rem",
    // lineHeight: '0.5',
    textTransform: "none",
    marginRight: "10px",
    minWidth: "0px",
    width: "60px",
  },

  update: {
    // background: '#007bff',
    height: "1.8rem",
    fontSize: 12,
    // marginTop: '35px',
    marginTop: "1.75rem",
    // lineHeight: '0.5',
    textTransform: "none",
    marginRight: "10px",
    minWidth: "0px",
    width: "60px",
  },

  inputCard: {
    boxShadow: "none",
    width: "50%",
  },

  gridItem: {
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
      display: "flex",
    },
  },

  labelText: {
    fontSize: 12,
  },

  table: {
    margin: "10px",
  },

  inputText: {
    color: "black",
    fontSize: 12,
    margin: "0px",
    padding: "0px",

    "&>input": {
      cursor: "context-menu",
      textAlign: "center",
      justifyContent: "center",

      [theme.breakpoints.down("xs")]: {
        justifyContent: "left",
        textAlign: "left",
        paddingLeft: "1px",
      },
    },

    "&:before": {
      borderBottom: "none",
    },

    "&:hover:not(.Mui-disabled):before": {
      borderBottom: "none",
    },

    "&:after": {
      borderBottom: "none",
    },
  },
});

class EmailAlerts extends Component {
  constructor(props) {
    super(props);

    this.theme = createTheme({
      overrides: {
        MuiSvgIcon: {
          //  stylesheet name
          root: {
            //  rule name
            color: "#808080",
          },
        },
        MuiTablePagination: {
          menuItem: {
            fontSize: 12,
            minHeight: "0px",
          },
          select: {
            width: "45px",
          },
        },
      },

      palette: {
        primary: {
          main: "#4caf50",
        },
        secondary: {
          main: "#808080",
        },
      },
    });

    this.state = {
      open: false,
      columns: [
        {
          title: "Email ID",
          field: "email",
          cellStyle: {
            fontSize: 12,
            minWidth: "33%",
            maxWidth: "33%",
            width: "33%",
          },

          headerStyle: {
            minWidth: "33%",
            maxWidth: "33%",
            width: "33%",
          },
          render: (rowData) => {
            return <span id={rowData.email}>{rowData.email}</span>;
          },
        },
        {
          title: "Active",
          field: "active",
          editable: "never",
          sorting: false,
          align: "center",
          render: (rowData) => {
            const { data } = this.state;
            const index = data.indexOf(rowData);
            const id = rowData ? `EmailAlerts-togglebtn-${rowData.email}` : "";
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
            paddingBottom: "0px",
            minWidth: "33%",
            maxWidth: "33%",
            width: "33%",
          },

          headerStyle: {
            // paddingLeft: "18px",
            minWidth: "33%",
            maxWidth: "33%",
            width: "33%",
          },
        },
      ],

      data: [],
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({ data: newProps.emailids });
  }

  handleClick(event) {
    event.preventDefault();
    this.setState({
      open: true,
    });
  }

  // istanbul ignore next
  handleClose() {
    this.setState({
      open: false,
    });
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
              <Grid item xs={12} md={6} className={classes.gridItem}>
                <form
                  autoComplete="off"
                  onSubmit={(event) => {
                    this.props.testserver(event);
                  }}
                  data-testid="form"
                >
                  <Grid container>
                    <Grid item xs={12} md={4} className={classes.gridItem}>
                      <TextField
                        id="smtp-server"
                        label="SMTP Server"
                        value={this.props.smtpserver}
                        required
                        className={classes.textField}
                        placeholder="IP:Port"
                        onChange={(event) =>
                          this.props.savesmtpserverdetails(event)
                        }
                        InputLabelProps={{
                          className: classes.labelText,
                        }}
                        name="smtpserver"
                        type="text"
                        margin="normal"
                        data-testid="smtpServerField"
                      />
                    </Grid>
                    {this.props.isPasswordSet === true ? (
                      <Grid item xs={12} md={8} className={classes.gridItem}>
                        <Tooltip
                          title="Click to Update SMTP Server IP and Port"
                          placement="right-start"
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            data-testid="updateSmtpServer"
                            className={classes.update}
                            onClick={(event) => {
                              this.props.updateSmtpServerDetails(event);
                            }}
                          >
                            Update
                          </Button>
                        </Tooltip>
                      </Grid>
                    ) : null}
                  </Grid>
                  <Grid container>
                    <Grid item xs={12} md={3} className={classes.gridItem}>
                      <TextField
                        id="smtp-username"
                        label="Username"
                        value={this.props.smtpusername}
                        required
                        className={classes.textField}
                        placeholder="Username"
                        onChange={(event) =>
                          this.props.savesmtpserverdetails(event)
                        }
                        InputLabelProps={{
                          className: classes.labelText,
                        }}
                        name="smtpusername"
                        type="text"
                        margin="normal"
                        data-testid="smtpUsername"
                      />
                    </Grid>
                    <Grid item xs={12} md={3} className={classes.gridItem}>
                      <TextField
                        id="smtp-password"
                        label="Password"
                        required
                        className={classes.textField}
                        placeholder="Password"
                        onChange={(event) =>
                          this.props.savesmtpserverdetails(event)
                        }
                        InputLabelProps={{
                          className: classes.labelText,
                        }}
                        name="smtppassword"
                        type="password"
                        margin="normal"
                        data-testid="smtpPassword"
                      />
                    </Grid>
                    <Grid item xs={12} md={4} className={classes.gridItem}>
                      <TextField
                        id="smtp-fromEmail"
                        label="From Email"
                        value={this.props.smtpfromemail}
                        required
                        className={classes.textField}
                        placeholder="From Email"
                        onChange={(event) =>
                          this.props.savesmtpserverdetails(event)
                        }
                        InputLabelProps={{
                          className: classes.labelText,
                        }}
                        name="smtpfromemail"
                        type="text"
                        margin="normal"
                        data-testid="smtpFromEmail"
                      />
                    </Grid>
                    {this.props.isPasswordSet === true ? (
                      <Grid item xs={12} md={2} className={classes.gridItem}>
                        <Tooltip
                          title="Click to Update SMTP Username, Password and From Email Fields"
                          placement="right-start"
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            data-testid="updateSmtpConfig"
                            className={classes.update}
                            onClick={(event) => {
                              this.props.updateSmtpConfig(event);
                            }}
                          >
                            Update
                          </Button>
                        </Tooltip>
                      </Grid>
                    ) : null}
                  </Grid>
                  {this.props.isPasswordSet === false ? (
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      className={classes.submit}
                      data-testid="applyButton"
                    >
                      Add
                    </Button>
                  ) : null}
                  <Button
                    disabled={this.props.configuredsmtpserver === ""}
                    onClick={this.handleClick}
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    data-testid="deleteButton"
                  >
                    Delete
                  </Button>
                </form>
              </Grid>
              {/* 
              <Grid item xs={12} sm={4} className={classes.gridItem}>
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
                 
                  disabled={this.props.configuredsmtpserver === ""}
                  onClick={this.handleClick}
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  data-testid="deleteButton"
                >
                  Delete
                </Button>
              </Grid> */}
            </Grid>
          </form>
          <AlertDialog
            title="Delete SMTP Configuration"
            description="This will delete the SMTP server ip and port details, username, password and from email fields. Are you sure you want to proceed?"
            open={this.state.open}
            handleClose={this.handleClose}
            onConfirm={() => {
              this.setState({
                open: false,
              });
              this.props.deleteConfiguredSmtpServer();
            }}
          />
          <Grid style={{ marginTop: "1%" }}>
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
                  Clear,
                }}
                components={{
                  Toolbar: (props) => (
                    <div style={{ height: "50px", fontSize: 12 }}>
                      <MTableToolbar {...props} />
                    </div>
                  ),
                  Pagination: (props) => (
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
                  ),
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
                      id: "EmailAlerts-icon-deleteemail",
                    },
                    tooltip: "Delete",
                    onClick: (evt, oldData) => {
                      const { data } = this.state;
                      const index = data.indexOf(oldData);
                      this.props.selectEmail(index);
                      this.props.openAlert("Delete");
                    },
                  },
                ]}
                options={{
                  rowStyle: {
                    fontSize: 4
                  },
                  search: false,
                  paginationType: "normal",
                  loadingType: "linear",
                  actionsColumnIndex: -1,
                  actionsCellStyle: {
                    textAlign: "center",
                    justifyContent: "center",
                    minWidth: "33%",
                    maxWidth: "33%",
                    width: "33%",
                    paddingLeft: "12%",
                  },
                  headerStyle: {
                    // backgroundColor: 'rgb(113, 133, 157)',
                    backgroundColor: "#788595",
                    color: "rgba(255, 255, 255, 0.87)",
                    fontSize: 14,
                    height: "10%",
                    paddingTop: "2px",
                    paddingBottom: "2px",
                  },
                }}
                columns={this.state.columns}
                data={this.state.data}
                editable={{
                  onRowAdd: (newData) =>
                    new Promise((resolve) => {
                      setTimeout(() => {
                        this.props.saveChange(newData, -1, true);
                        resolve();
                      }, 1000);
                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve) => {
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
                    }),
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
