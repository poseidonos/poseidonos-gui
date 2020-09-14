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
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import MaterialTable, { MTableToolbar, MTableBody } from "material-table";
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
import Switch from "@material-ui/core/Switch";
import Clear from "@material-ui/icons/Clear";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";


import { customTheme } from "../../theme";

const styles = () => ({
  root: {
    flexGrow: 1
  }
});

class LogTable extends Component {
  constructor(props) {
    super(props);

    this.theme = createMuiTheme({
      switch: {
        margin: "100px"
      },
      cardHeader: {
        backgroundColor: "black",
        justifyContent: "center"
      },

      overrides: {
        MuiSvgIcon: {
          //  stylesheet name
          root: {
            //  rule name
            color: "#808080"
          }
        },
        MuiSelect: {
          selectMenu: {
            maxWidth: "200px",
            height: "30px"
        }
      },
      MuiPopoverpaper: {
        paper: {
          width:"350px"
        }
      },
        MuiCard: {
          root: {
            height: "2.5rem",
            padding: "15px",
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }
        },
        MuiListItemText: {
          root: {
            overflowX:"scrollable",
            overflowY:"hidden",
            paddingLeft:"15px"
          }
        },
        MuiFormControl: {
          root: {
            minWidth: "100px"
          }
        },
        MuiTypography: {
          root: {
            marginRight: "10px"
          },
          body1: {
            fontSize:"13px"
          }
        },
        MuiTextField: {
          root: {
            float: "none",
            marginBottom: "-6px"
          }
        },
        MuiIconButton: {
          root: {
            marginRight: "10px"
          },
          colorInherit: {
            marginTop: "-30px"
          }
        },
        MuiFormLabel: {
          root: {
            fontSize: "14px"
          }
        },
        MuiTablePagination: {
          menuItem: {
            fontSize: "12px",
            minHeight: "0px"
          }
        },
        MuiInputBase: {
          input: {
            fontSize: "14px"
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
      component: {
        Toolbar: toolbarProps => (
          <div style={{ height: "35px", fontSize: "12px" }}>
            <MTableToolbar {...toolbarProps} />
          </div>
        ),
        Body: bodyProps => (
          <MTableBody
            {...bodyProps}
            onFilterChanged={(columnId, value) => {
              if (columnId === 0) {
                this.setState({
                  timestamp: value
                });
              }
              else if (columnId === 1) {
                this.setState({
                  value: [...value]
                });
              }
              else if (columnId === 2) {
                this.setState({
                  description: [...value]
                });
              } else if (columnId === 3) {
                this.setState({
                  source: [...value]
                });
              } else if (columnId === 4) {
                this.setState({
                  code: [...value]
                });
              } else if (columnId === 5) {
                this.setState({
                  level: [...value]
                });
              }
            }}
          />
        ),
      Pagination: paginationProps => <TablePagination {...paginationProps} />
      //   Pagination: props => <TablePagination {...props} 
      //   //rowsPerPageOptions={[10, 50]} count={this.props.entries} 
      //   onChangePage={(e, page) =>{
      //                 console.log("page",page)
      //                 console.log("event",e)
      //   }
      //                 }
      //   //page= "2"
      //   nextIconButtonProps={{
      //     'aria-label': 'Previous Page',
      //     //'onClick': this.loadNextPage,
      //   }}
        
      //       nextIconButtonText= "hello"
      //                  />
       },
      data: [],
      timestamp:"",
      code: [],
      level: [],
      source: [],
      description: [],
      value: []
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({ data: newProps.logList });
  }

  render() {
    const BorderLinearProgress = withStyles({
      root: {
        height: 15,
        backgroundColor: "darkgray",
        borderRadius: 1,
        width: "82%"
      },
      barColorPrimary: {
        backgroundColor: "white"
      },
      bar: {
        borderRadius: 1,
        backgroundColor: "#6fcd60"
      }
    })(LinearProgress);

    const { classes } = this.props;

    let index;
    const timestamp ={};
    const code = {};
    const value = {};
    const level = {};
    const source = {};
    const description = {};

    for (index = 0; index < this.state.data.length; index += 1 ) {
      timestamp[this.state.data[index].timestamp] = this.state.data[index].timestamp;
      code[this.state.data[index].code] = this.state.data[index].code;
      value[this.state.data[index].value] = this.state.data[index].value;
      level[this.state.data[index].level] = this.state.data[index].level;
      source[this.state.data[index].source] = this.state.data[index].source;
      description[this.state.data[index].description] = this.state.data[
        index
      ].description;
    }
    return (
      <ThemeProvider theme={this.theme}>
        <MaterialTable
          style={{ flexBasis: "100%", marginTop: "10px" }}
          icons={{
            Check,
            FirstPage,
            LastPage,
            NextPage: ChevronRight,
           
            PreviousPage: ChevronLeft,
            Search,
            ThirdStateCheck: Remove,
            DetailPanel: ChevronRight,
            Export: SaveAlt,
            Filter: FilterList,
            Add,
            Edit: EditIcon,
            Delete: TrashIcon,
            SortArrow: ArrowUpward,
            Clear
          }}
          components={this.state.component}
          actions={[
            {
              icon: () => (
                <Switch
                  size="small"
                  color="primary"
                  onClick={() => this.props.toggleLiveLogs()}
                  checked={this.props.showLiveLogs === "yes"}
                />
              ),
              iconProps: {
                color: "secondary"
              },
              isFreeAction: true,
              tooltip:
                this.props.showLiveLogs === "yes"
                  ? "Disable auto refresh"
                  : "Enable auto refresh every 2 secs"
            }
          ]}
          options={{
            rowStyle: {
              fontSize: "4px",
            },
            header: false,
            search: false,
            paginationType: "normal",
            loadingType: "linear",
            actionsColumnIndex: -1,
            headerStyle: customTheme.table.header,
            showTitle: false,
            toolbarButtonAlignment: "right",
            pageSizeOptions: [],
            // pageSize: 10,
            filtering: true
          }}
          // columns={this.state.columns}
          columns={[
            {
              title: "Timestamp",
              field: "timestamp",
              cellStyle: {
                fontSize: "12px"
              },
              filterPlaceholder: "Timestamp",
              filterCellStyle:{
                paddingBottom:"0px"
              },
              defaultFilter: this.state.timestamp,
              // lookup: timestamp
            },
            {
              title: "Value",
              field: "value",
              cellStyle: {
                fontSize: "12px",
                paddingRight: "220px"
              },
              headerStyle: {
                height: "10px"
              },
              filterPlaceholder: "Value",
              defaultFilter: this.state.value,
              lookup: value
            },
            {
              title: "Description",
              field: "description",
              cellStyle: {
                fontSize: "12px"
              },
              defaultFilter: this.state.description,
              lookup: description,
              filterPlaceholder: "Description"
            },

            {
              title: "Source",
              field: "source",
              cellStyle: {
                fontSize: "12px"
              },
              filterPlaceholder: "Source",
              defaultFilter: this.state.source,
              lookup: source
            },
            {
              title: "Code",
              field: "code",
              cellStyle: {
                fontSize: "12px"
              },
              filterPlaceholder: "Code",
              defaultFilter: this.state.code,
              lookup: code
            },
            {
              title: "Level",
              field: "level",
              cellStyle: {
                fontSize: "12px"
              },
              filterPlaceholder: "Level",
              defaultFilter: this.state.level,
              lookup: level
            }
          ]}
          data={this.state.data}
        />
        {this.props.showLiveLogs === "yes" && this.props.value !== "" ? (
          <Card className={classes.progressCard}>
            <Typography
              variant="caption"
              color="secondary"
              className={classes.percentageIndicator}
            >
              {this.props.label} {this.props.value}%
            </Typography>
            <BorderLinearProgress
              className={classes.bar}
              variant="determinate"
              value={this.props.value}
            />
          </Card>
        ) : null}
      </ThemeProvider>
    );
  }
}
export default withStyles(styles)(LogTable);
