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
import { withStyles } from "@material-ui/core/styles";
import MaterialTable, { MTableToolbar } from "material-table";
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
import Typography from "@material-ui/core/Typography";

import RefreshIcon from "@material-ui/icons/Refresh";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import { customTheme } from "../../../theme";

const styles = () => ({
  root: {
    flexGrow: 1
  }
});

class BmcLogTable extends Component {
  constructor(props) {
    super(props);
    this.tableRef = React.createRef();
    this.handleSourceChange = this.handleSourceChange.bind(this);
    this.handleEntryTypeChange = this.handleEntryTypeChange.bind(this);
    this.handleSeverityChange = this.handleSeverityChange.bind(this);
    this.handleSelectAll = this.handleSelectAll.bind(this);
    this.theme = createMuiTheme({
      switch: {
        margin: "100px"
      },
      overrides: {
        MuiMenuItem: {
          root: {
            paddingTop: "0px",
            paddingBottom: "0px",
            minHeight: "0px"
          }
        },
        MuiListSubheader: {
          root: {
            lineHeight: "15px"
          }
        },
        MuiSelect: {
          selectMenu: {
            maxWidth: "200px",
            minWidth: "150px",
            fontSize: "12px",
            backgroundColor: "#78859514",
            paddingLeft: "15px"
          }
        },
        MuiSvgIcon: {
          //  stylesheet name
          root: {
            //  rule name
            color: "#808080"
          }
        },
        MuiListItemText: {
          root: {
            overflowX: "scrollable",
            overflowY: "hidden",
            paddingLeft: "0px"
          }
        },
        MuiInput: {
          formControl: {
            maxWidth: "200px",
            minWidth: "200px"
          }
        },
        MuiFormControl: {
          root: {
            minWidth: "100px"
          }
        },
        MTableToolbar: {
          root: {
            marginBottom: "-20px"
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
        MuiPopover: {
          paper: {
            width: "auto !important",
            maxWidth: "700px"
          }
        },
        MuiTypography: {
          h6: {
            fontSize: "14px",
            color: "rgb(33,34,37,0.6)",
            fontWeight: "600",
            paddingBottom: "30px"
          },
          caption: {
            paddingBottom: "2px"
          },
          body1: {
            fontSize: "12px"
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
            {/* Ignore props spreading check, as it is used by material-table */}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <MTableToolbar {...toolbarProps} />
          </div>
        ),
        /* Ignore props spreading check, as it is used by material-table */
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        Pagination: paginationProps => <TablePagination {...paginationProps} />,
        FilterRow: () => (
          <tr>
            <td />
            <td>
              <FormControl>
                <InputLabel style={{ fontSize: "12px", marginLeft: "15px" }}>
                  Source Filter
                </InputLabel>
                <Select
                SelectDisplayProps={{
                  'data-testid' :"sourceSelect"
                }}
                  // data-testid="sourceSelect"
                  multiple
                  value={this.state.sourceFilter}
                  onChange={this.handleSourceChange}
                  input={<Input />}
                  renderValue={selected => selected.join(", ")}
                >
                  <Checkbox
                    checked={this.state.sourceSelectAll}
                    onChange={this.handleSelectAll}
                    value="Select All"
                    name="source_select_all"
                    data-testid = "sourceSelectAll"
                    // inputProps={{
                    //   'data-testid' :"sourceSelectAll"
                    // }}
                  />
                  <Typography value="Select All" variant="caption">
                    {" "}
                    Select All{" "}
                  </Typography>
                  <ListSubheader style={{ fontSize: "12px" }} value="subheader" data-testid = "sourceSelectAllSubheader">
                    Choose Filters
                  </ListSubheader>
                  
                  {this.state.source_filter_array.map(item => (
                    <MenuItem key={item} value={item}>
                      <Checkbox
                        checked={this.state.sourceFilter.indexOf(item) > -1}
                        size="small"
                        data-testid= {item}
                      />
                      <ListItemText primary={item} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </td>
            <td>
              <FormControl>
                <InputLabel style={{ fontSize: "12px", marginLeft: "15px" }}>
                  Entry Type Filter
                </InputLabel>
                <Select
                 SelectDisplayProps={{
                  'data-testid' :"entryTypeSelect"
                }}
                  multiple
                  value={this.state.entryTypeFilter}
                  onChange={this.handleEntryTypeChange}
                  input={<Input />}
                  renderValue={selected => selected.join(", ")}
                >
                  <Checkbox
                    checked={this.state.entryTypeSelectAll}
                    onChange={this.handleSelectAll}
                    value="Select All"
                    name="entrytype_select_all"
                    data-testid = "entryTypeSelectAll"
                  />
                  <Typography value="Select All" variant="caption">
                    {" "}
                    Select All{" "}
                  </Typography>
                  <ListSubheader style={{ fontSize: "12px" }} value="subheader" data-testid = "entryTypeSelectAllSubheader">
                    Choose Filters
                  </ListSubheader>
                  {this.state.entryType_filter_array.map(item => (
                    <MenuItem key={item} value={item}>
                      <Checkbox
                        checked={this.state.entryTypeFilter.indexOf(item) > -1}
                        data-testid= {item}
                      />
                      <ListItemText primary={item} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </td>
            <td>
              <FormControl>
                <InputLabel style={{ fontSize: "12px", marginLeft: "15px" }}>
                  Severity Filter
                </InputLabel>

                <Select
                  multiple
                  value={this.state.severityFilter}
                  onChange={this.handleSeverityChange}
                  input={<Input />}
                  renderValue={selected => selected.join(", ")}
                  SelectDisplayProps={{
                    'data-testid' :"severitySelect"
                  }}
                >
                  <Checkbox
                    checked={this.state.severitySelectAll}
                    onChange={this.handleSelectAll}
                    value="Select All"
                    name="severity_select_all"
                    data-testid = "severitySelectAll"
                  />
                  <Typography value="Select All" variant="caption">
                    {" "}
                    Select All{" "}
                  </Typography>
                  <ListSubheader style={{ fontSize: "12px" }} value="subheader" data-testid = "severitySelectAllSubheader">
                    Choose Filters
                  </ListSubheader>
                  {this.state.severity_filter_array.map(item => (
                    <MenuItem key={item} value={item}>
                      <Checkbox
                        checked={this.state.severityFilter.indexOf(item) > -1}
                        data-testid= {item}
                      />
                      <ListItemText primary={item} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </td>
          </tr>
        )
      },
      source_filter_array: [],
      sourceFilter: [],
      entryType_filter_array: [],
      entryTypeFilter: [],
      severity_filter_array: [],
      severityFilter: [],
      filter_applied: "no",
      sourceSelectAll: false,
      entryTypeSelectAll: false,
      severitySelectAll: false
    };
  }

  handleSelectAll(event) {
    if (event.target.name === "source_select_all") {
      if (event.target.checked === true) {
        this.setState({ sourceFilter: this.state.source_filter_array });
        this.setState({ sourceSelectAll: true });
      } else {
        this.setState({ sourceFilter: [] });
        this.setState({ sourceSelectAll: false });
      }
    } else if (event.target.name === "entrytype_select_all") {
      if (event.target.checked === true) {
        this.setState({ entryTypeFilter: this.state.entryType_filter_array });
        this.setState({ entryTypeSelectAll: true });
      } else {
        this.setState({ entryTypeFilter: [] });
        this.setState({ entryTypeSelectAll: false });
      }
    } else if (event.target.name === "severity_select_all") {
      if (event.target.checked === true) {
        this.setState({ severityFilter: this.state.severity_filter_array });
        this.setState({ severitySelectAll: true });
      } else {
        this.setState({ severityFilter: [] });
        this.setState({ severitySelectAll: false });
      }
    }
    this.setState({ filter_applied: "yes" });
    if(this.tableRef.current) {
      this.tableRef.current.onQueryChange();
    }
  }

  handleSourceChange(event) {
    const { value } = event.target;
    const index = value.indexOf("Select All");
    const subheaderIndex = value.indexOf("subheader");
    if (subheaderIndex > -1) return;
    if (index > -1 && index === value.length - 1) return;
    this.setState({ sourceFilter: value });
    if (value.length === this.state.source_filter_array.length)
      this.setState({ sourceSelectAll: true });

    if (value.length < this.state.source_filter_array.length)
      this.setState({ sourceSelectAll: false });

    this.setState({ filter_applied: "yes" });
    if (this.tableRef.current) {
      this.tableRef.current.onQueryChange();
    }
  }

  handleEntryTypeChange(event) {
    const { value } = event.target;
    const index = value.indexOf("Select All");
    const subheaderIndex = value.indexOf("subheader");
    if (subheaderIndex > -1) return;
    if (index > -1 && index === value.length - 1) return;
    this.setState({ entryTypeFilter: value });
    if (value.length === this.state.entryType_filter_array.length)
      this.setState({ entryTypeSelectAll: true });

    if (value.length < this.state.entryType_filter_array.length)
      this.setState({ entryTypeSelectAll: false });
    this.setState({ filter_applied: "yes" });
    if (this.tableRef.current) {
      this.tableRef.current.onQueryChange();
    }
  }

  handleSeverityChange(event) {
    const { value } = event.target;
    const index = value.indexOf("Select All");
    const subheaderIndex = value.indexOf("subheader");
    if (subheaderIndex > -1) return;
    if (index > -1 && index === value.length - 1) return;
    if (value.length === this.state.severity_filter_array.length)
      this.setState({ severitySelectAll: true });

    if (value.length < this.state.severity_filter_array.length)
      this.setState({ severitySelectAll: false });

    this.setState({ severityFilter: value });
    this.setState({ filter_applied: "yes" });
    if (this.tableRef.current) {
      this.tableRef.current.onQueryChange();
    }
  }

  render() {
    // const { classes } = this.props;
    return (
      <ThemeProvider theme={this.theme}>
        <MaterialTable
          title="BMC Logs"
          tableRef={this.tableRef}
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
              icon: RefreshIcon,
              tooltip: "Refresh Logs",
              isFreeAction: true,
              onClick: () =>
                this.tableRef.current && this.tableRef.current.onQueryChange()
            }
          ]}
          options={{
            rowStyle: {
              fontSize: "4px",
            },
            header: true,
            search: false,
            paginationType: "normal",
            loadingType: "overlay",
            actionsColumnIndex: -1,
            headerStyle: customTheme.table.header,
            showTitle: true,
            toolbarButtonAlignment: "right",
            pageSizeOptions: [],
            pageSize: 10,
            filtering: true,
          }}
          // columns={this.state.columns}
          columns={[
            {
              title: "Timestamp",
              field: "timestamp",
              cellStyle: {
                fontSize: "12px",
                minWidth:"200px"
              }
            },
            {
              title: "Source",
              field: "source",
              cellStyle: {
                fontSize: "12px"
              },
              headerStyle: {
                height: "10px"
              }
            },
            {
              title: "Entry Type",
              field: "entryType",
              cellStyle: {
                fontSize: "12px"
              }
            },

            {
              title: "Severity",
              field: "severity",
              cellStyle: {
                fontSize: "12px"
              }
            },
            {
              title: "Description",
              field: "description",
              cellStyle: {
                fontSize: "12px",
                maxWidth:"20%",
              },
              filterCellStyle: {
                paddingBottom: "1px",
              }
            }
          ]}
          // data={this.state.data}
          data={query =>
            new Promise((resolve) => {
              const page = this.state.filter_applied === "yes" ? 0 : query.page;
              let url = "/api/v1.0/get_Bmc_Logs/?";
              url += `per_page=${ query.pageSize}`;
              url += `&page=${ page}`;
              let filterSubQuery = "";
              let flag = false;
              if (this.state.sourceFilter.length > 0) {
                flag = true;
                filterSubQuery +=
                  `where (Source = '${ this.state.sourceFilter[0] }'`;
                for (let i = 1; i < this.state.sourceFilter.length; i += 1 ) {
                  filterSubQuery +=
                    ` OR Source = '${ this.state.sourceFilter[i] }'`;
                }
                filterSubQuery += ") ";
              }

              if (this.state.entryTypeFilter.length > 0) {
                if (flag === false) {
                  filterSubQuery +=
                    `where (EntryType = '${ 
                    this.state.entryTypeFilter[0] 
                    }'`;
                  flag = true;
                } else {
                  filterSubQuery +=
                    `AND (EntryType = '${ this.state.entryTypeFilter[0] }'`;
                }
                for (let i = 1; i < this.state.entryTypeFilter.length; i += 1 ) {
                  filterSubQuery +=
                    ` OR EntryType = '${ this.state.entryTypeFilter[i] }'`;
                }

                filterSubQuery += ") ";
              }
              if (this.state.severityFilter.length > 0) {
                if (flag === false) {
                  filterSubQuery +=
                    `where (Severity = '${ this.state.severityFilter[0] }'`;
                  flag = true;
                } else {
                  filterSubQuery +=
                    `AND (Severity = '${ this.state.severityFilter[0] }'`;
                }
                for (let i = 1; i < this.state.severityFilter.length; i += 1 ) {
                  filterSubQuery +=
                    ` OR Severity = '${ this.state.severityFilter[i] }'`;
                }

                filterSubQuery += ") ";
              }
              url += `&filterSubQuery=${ filterSubQuery}`;
              url += `&filter_applied=${ this.state.filter_applied}`;
              fetch(url)
                .then(response => response.json())

                .then(result => {
                  this.setState({
                    source_filter_array: result.source_filter_array,
                    entryType_filter_array: result.entryType_filter_array,
                    severity_filter_array: result.severity_filter_array
                  });
                  resolve({
                    data: result.resp,
                    page: result.page,
                    totalCount: result.count
                  });
                });
              this.setState({ filter_applied: "no" });
            })
          }
        />
      </ThemeProvider>
    );
  }
}
export default withStyles(styles)(BmcLogTable);
