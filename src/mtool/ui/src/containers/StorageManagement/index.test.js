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

/* eslint-disable import/imports-first */
/* eslint-disable import/first */

jest.unmock("axios");

import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { act } from "react-dom/test-utils";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitForElement,
  getByLabelText
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from "history";

import Volume from "./index";
import storageReducer from "../../store/reducers/storageReducer";
import subsystemReducer from "../../store/reducers/subsystemReducer";
import headerReducer from "../../store/reducers/headerReducer";
import createVolumeReducer from "../../store/reducers/createVolumeReducer"
import rootSaga from "../../sagas/indexSaga";


//duplicate Code
const resultJson = {
  status: {
    code: 0,
    description: "Success",
  },
}

const capacityJson = {
  Data: {
    AllocatedBytes: 100,
    ConsumedBytes: 10,
  },
}

const oemJson = {
  MaxIOPS: 10,
  MaxBW: 10,
  MinIOPS: 0,
  MinBandwidth: 0,
}

const statusJson = {
  Oem: {
    VolumeStatus: "Mounted",
  },
}

const metaDevicesJson = {
  name: "uram2",
  isAvailable: true,
  arrayName: "",
  displayMsg: "uram1",
  trimmedDisplayMsg: "uram1"
}
const metadevices = [{
  name: "uram0",
  isAvailable: false,
  arrayName: "",
  displayMsg: "uram0",
  trimmedDisplayMsg: "uram0"
}, {
  name: "uram1",
  isAvailable: false,
  arrayName: "",
  displayMsg: "uram1",
  trimmedDisplayMsg: "uram1"
}];
const deviceJson = {
  "devices": [{
    name: "unvmens-6",
    size: 390703446,
    mn: "SAMSUNG MZWLL1T6HAJQ-00005",
    sn: "S4C9NF0M500043",
    isAvailable: false,
    numa: "0"
  }],
  metadevices,
}

const membersJson = {
  Members: [
    {
      "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
      "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
    },
  ],
}

describe("<Storage Management />", () => {
  let wrapper;
  let mock;
  let history;
  let store;
  beforeEach(() => {
    const rootReducers = {
      storageReducer,
      subsystemReducer,
      headerReducer,
      createVolumeReducer
    };
    const sagaMiddleware = createSagaMiddleware();
    store = configureStore({
      reducer: rootReducers,
      middleware: [sagaMiddleware]
    })
    sagaMiddleware.run(rootSaga);
    const route = "/storage/array/manage?array=POSArray";
    history = createMemoryHistory({ initialEntries: [route] });
    mock = new MockAdapter(axios);
  });

  const renderComponent = () => {
    wrapper = render(
      <Router history={history}>
        <Provider store={store}>
          <Volume />
        </Provider>
      </Router>
    );
  };

  afterEach(cleanup);

  it("should render array create view", () => {
    mock
      .onGet("/*")
      .reply(200, [])
      .onAny()
      .reply(200, []);
    mock.onGet(/api\/v1\/get_arrays\/*/).reply(200, []);
    renderComponent();
    const { getByTestId, getByText } = wrapper;
    fireEvent.click(getByText("create"));
    expect(waitForElement(() => getByTestId("arraycreate"))).toBeDefined();
  });

  const maxAvailableSize = 6.36

  const devices = [
    {
      name: "unvmens-0",
      size: 390703446,
      mn: "SAMSUNG MZWLL1T6HAJQ-00005",
      sn: "S4C9NF0M500037",
      isAvailable: true,
      numa: "0",
      arrayName: "POSArray"
    },
    {
      name: "unvmens-1",
      size: 390703446,
      mn: "SAMSUNG MZWLL1T6HAJQ-00005",
      sn: "S4C9NF0M500027",
      isAvailable: true,
      numa: "0",
      arrayName: "POSArray"
    },
    {
      name: "unvmens-2",
      size: 390703446,
      mn: "SAMSUNG MZWLL1T6HAJQ-00005",
      sn: "S4C9NF0M500044",
      isAvailable: true,
      numa: "0",
      arrayName: "POSArray"
    },
    {
      name: "unvmens-3",
      size: 390703446,
      mn: "SAMSUNG MZWLL1T6HAJQ-00005",
      sn: "S4C9NF0M500031",
      isAvailable: true,
      numa: "0",
      arrayName: "POSArray"
    },
    {
      name: "unvmens-4",
      size: 390703446,
      mn: "SAMSUNG MZWLL1T6HAJQ-00005",
      sn: "S4C9NF0M500041",
      isAvailable: true,
      numa: "0",
      arrayName: "POSArray"
    },
    {
      name: "unvmens-5",
      size: 390703446,
      mn: "SAMSUNG MZWLL1T6HAJQ-00005",
      sn: "S4C9NF0M500042",
      isAvailable: true,
      numa: "0",
      arrayName: "POSArray"
    },
    {
      name: "unvmens-6",
      size: 390703446,
      mn: "SAMSUNG MZWLL1T6HAJQ-00005",
      sn: "S4C9NF0M500043",
      isAvailable: true,
      numa: "0",
      arrayName: "POSArray"
    },
  ];

  

  const config = {
    "raidTypes": [
      {
        "raidType": "RAID0",
        "minStorageDisks": 2,
        "maxStorageDisks": 32,
        "minSpareDisks": 0,
        "maxSpareDisks": 0
      },
      {
        "raidType": "RAID5",
        "minStorageDisks": 3,
        "maxStorageDisks": 32,
        "minSpareDisks": 0,
        "maxSpareDisks": 29
      },
      {
        "raidType": "RAID6",
        "minStorageDisks": 4,
        "maxStorageDisks": 32,
        "minSpareDisks": 0,
        "maxSpareDisks": 28,
      },
      {
        "raidType": "RAID10",
        "minStorageDisks": 2,
        "maxStorageDisks": 32,
        "minSpareDisks": 0,
        "maxSpareDisks": 29
      },
      {
        "raidType": "NONE",
        "minStorageDisks": 1,
        "maxStorageDisks": 1,
        "minSpareDisks": 0,
        "maxSpareDisks": 0
      }
    ],
    "totalDisks": 32
  }

  const posInfo = {
    "rid": "365a0ad6-69e9-4afc-bca0-fd6bf255ba16",
    "lastSuccessTime": 1653396206,
    "result": {
      "status": {
        "module": "COMMON",
        "code": 0,
        "level": "INFO",
        "description": "Success",
        "posDescription": "POSArray information"
      },
      "data": {
        "capacity": 3385669032346,
        "create_datetime": "2022-05-24 17:33:00 +0530",
        "data_raid": "RAID5",
        "devicelist": [
          {
            "name": "uram0",
            "type": "BUFFER"
          },
          {
            "name": "unvme-ns-0",
            "type": "DATA"
          },
          {
            "name": "unvme-ns-1",
            "type": "DATA"
          },
          {
            "name": "unvme-ns-2",
            "type": "DATA"
          },
          {
            "name": "unvme-ns-3",
            "type": "SPARE"
          }
        ],
        "gcMode": "none",
        "index": 0,
        "meta_raid": "RAID0",
        "name": "POSArray",
        "rebuilding_progress": 0,
        "situation": "NORMAL",
        "state": "NORMAL",
        "unique_id": 390699171,
        "update_datetime": "2022-05-24 17:33:12 +0530",
        "used": 20741881856,
        "write_through_enabled": false
      }
    },
    "info": {
      "version": "v0.11.0-rc4"
    }
  }

  const array = {
    RAIDLevel: "5",
    arrayname: "POSArray",
    metadiskpath: [
      {
        deviceName: "uram0",
      },
    ],
    sparedisks: [
      {
        deviceName: "unvmens-3",
      },
    ],
    storagedisks: [
      {
        deviceName: "unvmens-0",
      },
      {
        deviceName: "unvmens-1",
      },
      {
        deviceName: "unvmens-2",
      },
      {
        deviceName: "unvmens-4",
      },
    ],
    status: "Mounted",
    state: "EXIST",
    totalsize: 6357625339904,
    usedspace: 0,
  };

  const subsystems = {
    rid: "0a5d0bb6-5115-4f3b-8595-03df4575e90a",
    lastSuccessTime: 1653641891,
    result: {
      "status":
      {
        "module": "COMMON",
        "code": 0, "level":
          "INFO", "description":
          "Success", "posDescription": "list of existing subsystems"
      },
      "data":
      {
        "subsystemlist":
          [
            {
              "allowAnyHost": 1,
              "hosts": [], "listen_addresses": [],
              "nqn": "nqn.2014-08.org.nvmexpress.discovery",
              "subtype": "Discovery"
            },
            {
              "allowAnyHost": 1,
              "hosts": [], "listen_addresses":
                [{
                  "address_family": "IPv4",
                  "target_address": "localhost",
                  "transport_service_id": "1158",
                  "transport_type": "TCP"
                }],
              "maxNamespaces": 256,
              "modelNumber": "IBOF_VOLUME_EEEXTENSION",
              "namespaces":
                [
                  { "bdevName": "bdev_0_POSArray", "nsid": 1, "uuid": "0f902600-ae47-4f9c-a278-c69b3fc45350" },
                  { "bdevName": "bdev_1_POSArray", "nsid": 2, "uuid": "3567d445-1a5e-4f69-bd24-74345e862726" },
                  { "bdevName": "bdev_2_POSArray", "nsid": 3, "uuid": "5169639e-ea02-4709-87df-9620c3e064dc" }],
              "nqn": "nqn.2019-04.pos:subsystem1", "serialNumber": "POS0000000003", "subtype": "NVMe", "array": "POSArray"
            },
            {
              "allowAnyHost": 1,
              "hosts": [], "listen_addresses":
                [{
                  "address_family": "IPv4",
                  "target_address": "localhost",
                  "transport_service_id": "1158", "transport_type": "TCP"
                }],
              "maxNamespaces": 256, "modelNumber": "IBOF_VOLUME_EEEXTENSION",
              "namespaces": [],
              "nqn": "nqn.2019-04.pos:subsystem2", "serialNumber": "POS0000000003", "subtype": "NVMe"
            }]
      }
    }, "info": { "version": "v0.11.0-rc4" }
  }

  const arrayInfo = {
    "rid": "386d44c5-ada8-4ce2-a33b-ee9f9b605d10",
    "lastSuccessTime": 1653555896,
    "result": {
      "status": {
        "module": "COMMON",
        "code": 0,
        "level": "INFO",
        "description": "Success",
        "posDescription": "POSArray information"
      },
      "data": {
        "capacity": 13548474335232,
        "create_datetime": "2022-05-25 12:23:01 +0530",
        "data_raid": "RAID5",
        "devicelist": [
          {
            "name": "uram1",
            "type": "BUFFER"
          },
          {
            "name": "unvme-ns-1",
            "type": "DATA"
          },
          {
            "name": "unvme-ns-2",
            "type": "DATA"
          },
          {
            "name": "unvme-ns-3",
            "type": "DATA"
          }
        ],
        "gcMode": "none",
        "index": 0,
        "meta_raid": "RAID10",
        "name": "POSArray",
        "rebuilding_progress": 30,
        "situation": "REBUILDING",
        "state": "REBUILDING",
        "uniqueId": 1495652515,
        "update_datetime": "2022-05-25 12:24:26 +0530",
        "used": 404004798464,
        "write_through_enabled": false
      }
    },
    "info": {
      "version": "v0.11.0-rc4"
    }
  }

  it("should render devices", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices: [
          { name: "unvmens-0", size: 100 },
          { name: "unvmens-1", size: 100 },
        ],
        metadevices,
      })
      .onAny()
      .reply(200, []);
    renderComponent();
    const { getByTestId, getByText } = wrapper;
    fireEvent.click(getByText("create"));
    await waitForElement(() => getByTestId("arraycreate"));
  });

  it("should render button on resize", () => {
    // Change the viewport to 500px.
    global.innerWidth = 500;

    // Trigger the window resize event.
    global.dispatchEvent(new Event("resize"));

    renderComponent();
    const { getByTestId } = wrapper;
    expect(getByTestId("sidebar-toggle")).toBeDefined();
    fireEvent.click(getByTestId("sidebar-toggle"));
    expect(getByTestId("help-link")).toHaveTextContent("Help");
  });

  it("should create an array", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onPost("/api/v1.0/create_arrays/")
      .reply(200, {})
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onAny()
      .reply(200, []);
    jest.setTimeout(30000);
    renderComponent();
    const { getByTestId, getByText, getAllByText, asFragment } = wrapper;
    fireEvent.click(getByText("create"));
    const raidSelect = getByTestId("raid-select-input");
    fireEvent.change(raidSelect, {
      target: { value: "RAID5" },
    });
    const wb = await waitForElement(() => getByTestId("writebuffer-input"));
    fireEvent.change(wb, {
      target: { value: "uram0" },
    });
    fireEvent.click(getByTestId("disktype"));
    fireEvent.click(getAllByText("STORAGE DISK")[0]);
    const dev1 = await waitForElement(() => getByTestId("diskselect-0"));
    fireEvent.click(dev1);
    const dev2 = await waitForElement(() => getByTestId("diskselect-1"));
    fireEvent.click(dev2);
    const dev3 = await waitForElement(() => getByTestId("diskselect-2"));
    fireEvent.click(dev3);
    fireEvent.change(getByTestId("disktype-input"), {
      target: { value: "SPARE DISK" },
    });
    const dev4 = await waitForElement(() => getByTestId("diskselect-3"));
    fireEvent.click(dev4);
    const arrayname = getByTestId('array-name');
    fireEvent.change(arrayname, { target: { value: 'POSArray2' } });
    const writeThroughModeCheckbox = await waitForElement(() => getByTestId("mount-writethrough-checkbox"));
    fireEvent.click(writeThroughModeCheckbox);
    expect(writeThroughModeCheckbox.checked).toEqual(true);
    fireEvent.click(getByTestId("createarray-btn"));
    fireEvent.click(getByText("Yes"));
    const success = await waitForElement(() => getByTestId("alertDescription"));
    expect(success).toBeDefined();
    fireEvent.click(getByText("OK"));
  });

  it("should create an array with RAID6", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onPost("/api/v1.0/create_arrays/")
      .reply(200, {})
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onAny()
      .reply(200, []);
    const getSpy = jest.spyOn(axios, "post");
    jest.setTimeout(30000);
    renderComponent();
    const { getByTestId, getByText, getAllByText, asFragment } = wrapper;
    fireEvent.click(getByText("create"));
    fireEvent.mouseDown(getByTestId("raid-select"));
    fireEvent.click(await waitForElement(() => getByText("RAID6")));
    const wb = await waitForElement(() => getByTestId("writebuffer-input"));
    fireEvent.change(wb, {
      target: { value: "uram0" },
    });
    fireEvent.click(getByTestId("disktype"));
    fireEvent.click(getAllByText("STORAGE DISK")[0]);
    const dev1 = await waitForElement(() => getByTestId("diskselect-0"));
    fireEvent.click(dev1);
    const dev2 = await waitForElement(() => getByTestId("diskselect-1"));
    fireEvent.click(dev2);
    const dev3 = await waitForElement(() => getByTestId("diskselect-2"));
    fireEvent.click(dev3);
    const dev6 = await waitForElement(() => getByTestId("diskselect-5"));
    fireEvent.click(dev6);
    fireEvent.change(getByTestId("disktype-input"), {
      target: { value: "SPARE DISK" },
    });
    const dev4 = await waitForElement(() => getByTestId("diskselect-3"));
    fireEvent.click(dev4);
    const dev5 = await waitForElement(() => getByTestId("diskselect-4"));
    fireEvent.click(dev5);
    const arrayname = getByTestId('array-name');
    fireEvent.change(arrayname, { target: { value: 'POSArray2' } });
    const writeThroughModeCheckbox = await waitForElement(() => getByTestId("mount-writethrough-checkbox"));
    fireEvent.click(writeThroughModeCheckbox);
    expect(writeThroughModeCheckbox.checked).toEqual(true);
    fireEvent.click(getByTestId("createarray-btn"));
    fireEvent.click(getByText("Yes"));
    expect(getSpy).toHaveBeenCalledWith(
      "/api/v1.0/create_arrays/", {
      "arrayname": "POSArray2",
      "metaDisk": "uram0",
      "raidtype": "RAID6",
      "size": 1562813784,
      "spareDisks": [
        {
          "deviceName": "unvmens-3",
          "numa": "0",
        },
        {
          "deviceName": "unvmens-4",
          "numa": "0",
        },
      ],
      "storageDisks": [
        {
          "deviceName": "unvmens-0",
          "numa": "0",
        },
        {
          "deviceName": "unvmens-1",
          "numa": "0",
        },
        {
          "deviceName": "unvmens-2",
          "numa": "0",
        },
        {
          "deviceName": "unvmens-5",
          "numa": "0",
        },
      ],
      "writeBufferDisk": [],
      "writeThroughModeEnabled": true
    },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": null,
        },
      }
    );
    const success = await waitForElement(() => getByTestId("alertDescription"));
    expect(success).toBeDefined();
    fireEvent.click(getByText("OK"));
  });

  it("should show alert while creating an array if wrong values given", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onPost("/api/v1.0/create_arrays/")
      .reply(200, {})
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onAny()
      .reply(200, []);
    jest.setTimeout(30000);
    renderComponent();
    const { getByTestId, getByText, getAllByText, asFragment } = wrapper;
    fireEvent.click(getByText("create"));
    const arrayname = getByTestId('array-name');
    fireEvent.change(arrayname, { target: { value: '' } });
    fireEvent.click(getByTestId("createarray-btn"));
    fireEvent.click(getByText("Yes"));
    expect(
      await waitForElement(() => getByText("Please provide a valid Array name"))
    ).toBeDefined();
    fireEvent.click(getByText("OK"));
    fireEvent.change(arrayname, { target: { value: 'POSArray2' } });

    const raidSelect = getByTestId("raid-select-input");
    fireEvent.change(raidSelect, {
      target: { value: "RAID5" },
    });
    fireEvent.click(getByTestId("disktype"));
    fireEvent.click(getAllByText("STORAGE DISK")[0]);
    const dev1 = await waitForElement(() => getByTestId("diskselect-0"));
    fireEvent.click(dev1);
    fireEvent.click(getByTestId("createarray-btn"));
    fireEvent.click(getByText("Yes"));
    expect(
      await waitForElement(() => getByText(/Select at least/))
    ).toBeDefined();
    fireEvent.click(getByText("OK"));
    const dev2 = await waitForElement(() => getByTestId("diskselect-1"));
    fireEvent.click(dev2);
    const dev3 = await waitForElement(() => getByTestId("diskselect-2"));
    fireEvent.click(dev3);
    fireEvent.change(getByTestId("disktype-input"), {
      target: { value: "SPARE DISK" },
    });
    const dev4 = await waitForElement(() => getByTestId("diskselect-3"));
    fireEvent.click(dev4);
    fireEvent.click(getByTestId("createarray-btn"));
    fireEvent.click(getByText("Yes"));
    expect(
      await waitForElement(() => getByText("Select a Write Buffer"))
    ).toBeDefined();
    fireEvent.click(getByText("OK"));
    const wb = await waitForElement(() => getByTestId("writebuffer-input"));
    fireEvent.change(wb, {
      target: { value: "uram0" },
    });
    fireEvent.click(getByTestId("createarray-btn"));
    fireEvent.click(getByText("Yes"));
    const success = await waitForElement(() => getByTestId("alertDescription"));
    expect(success).toBeDefined();
    fireEvent.click(getByText("OK"));
  });

  it("should not create array if devices are not selected", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onPost("/api/v1.0/create_arrays/")
      .reply(200, {})
      .onAny()
      .reply(200, []);
    renderComponent();
    const getSpy = jest.spyOn(axios, "post");
    const { getByTestId, getByText, getAllByText, queryByText } = wrapper;
    fireEvent.click(getByText("create"));
    const raidSelect = await waitForElement(() =>
      getByTestId("raid-select-input")
    );
    fireEvent.change(raidSelect, { target: { value: "5" } });
    fireEvent.change(getByTestId("writebuffer-input"), {
      target: { value: "uram0" },
    });
    fireEvent.click(getByTestId("disktype"));
    fireEvent.click(getAllByText("STORAGE DISK")[0]);
    fireEvent.click(getByTestId("createarray-btn"));
    expect(queryByText(/Select at least/i)).toBeDefined();
  });

  it("should not create array if spare devices are not selected", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onPost("/api/v1.0/create_arrays/")
      .reply(200, {})
      .onAny()
      .reply(200, []);
    renderComponent();
    const getSpy = jest.spyOn(axios, "post");
    const { getByTestId, getByText, getAllByText, queryByText } = wrapper;
    fireEvent.click(getByText("create"));
    const raidSelect = await waitForElement(() =>
      getByTestId("raid-select-input")
    );
    fireEvent.change(raidSelect, { target: { value: "RAID5" } });
    fireEvent.change(getByTestId("writebuffer-input"), {
      target: { value: "uram0" },
    });
    fireEvent.click(getByTestId("disktype"));
    fireEvent.click(getAllByText("STORAGE DISK")[0]);
    const dev1 = await waitForElement(() => getByTestId("diskselect-0"));
    fireEvent.click(dev1);
    const dev2 = await waitForElement(() => getByTestId("diskselect-1"));
    fireEvent.click(dev2);
    const dev3 = await waitForElement(() => getByTestId("diskselect-2"));
    fireEvent.click(dev3);
    const dev2_ = await waitForElement(() => getByTestId("diskselect-1"));
    fireEvent.click(dev2_);
    const dev4 = await waitForElement(() => getByTestId("diskselect-3"));
    fireEvent.click(dev4);
    fireEvent.click(getByTestId("createarray-btn"));
    expect(queryByText(/Select at least/i)).toBeDefined();
  });

  it("should not select device if it is unavailable", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, deviceJson)
      .onPost("/api/v1.0/create_arrays/")
      .reply(200, {})
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onAny()
      .reply(200, []);
    jest.setTimeout(30000);
    renderComponent();
    const { getByTestId, getByText, getAllByText, asFragment } = wrapper;
    fireEvent.click(getByText("create"));
    const raidSelect = getByTestId("raid-select-input");
    fireEvent.change(raidSelect, {
      target: { value: "RAID5" },
    });
    const wb = await waitForElement(() => getByTestId("writebuffer-input"));
    fireEvent.change(wb, {
      target: { value: "uram0" },
    });
    fireEvent.click(getByTestId("disktype"));
    fireEvent.click(getAllByText("STORAGE DISK")[0]);
    const dev1 = await waitForElement(() => getByTestId("diskselect-0"));
    fireEvent.click(dev1);
  });

  it("should add a spare disk", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onPost(/api\/v1.0\/delete_array\/*/)
      .reply(200, {})
      .onAny()
      .reply(200, []);
    const getSpy = jest.spyOn(axios, "post");
    renderComponent();
    const { getByTestId, asFragment, getByText } = wrapper;
    await waitForElement(() => getByText("Unmount Array"))
    expect(asFragment()).toMatchSnapshot();
    const attachButton = await waitForElement(() =>
      getByTestId("attachdisk-5")
    );
    fireEvent.click(attachButton);
    fireEvent.click(await waitForElement(() => getByTestId("alertbox-yes")));
    expect(getSpy).toHaveBeenCalledWith(
      "/api/v1.0/add_spare_device/",
      {
        name: "unvmens-5",
        array: "POSArray",
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": null,
        },
      }
    );
  });

  it("should replace an array disk", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onPost(/api\/v1.0\/delete_array\/*/)
      .reply(200, {})
      .onAny()
      .reply(200, []);
    jest.setTimeout(60000);
    const getSpy = jest.spyOn(axios, "post");
    renderComponent();
    const { getByTestId, asFragment, getByText } = wrapper;
    await waitForElement(() => getByText("Unmount Array"))
    expect(asFragment()).toMatchSnapshot();
    const attachButton = await waitForElement(() =>
      getByTestId("replacedisk-0")
    );
    fireEvent.click(attachButton);
    fireEvent.click(await waitForElement(() => getByTestId("alertbox-yes")));
    expect(getSpy).toHaveBeenCalledWith(
      "/api/v1/array/POSArray/replace",
      {
        device: "unvmens-0"
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": null,
        },
      }
    );
  });

  it("should remove a spare disk", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onPost(/api\/v1.0\/delete_array\/*/)
      .reply(200, {})
      .onAny()
      .reply(200, []);
    const getSpy = jest.spyOn(axios, "post");
    renderComponent();
    const { getByTestId } = wrapper;
    const attachButton = await waitForElement(() =>
      getByTestId("detachdisk-3")
    );
    fireEvent.click(attachButton);
    fireEvent.click(await waitForElement(() => getByTestId("alertbox-yes")));
    expect(getSpy).toHaveBeenCalledWith(
      "/api/v1.0/remove_spare_device/",
      {
        name: "unvmens-3",
        array: "POSArray",
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": null,
        },
      }
    );
  });

  it("should not add an unavailable disk", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, deviceJson)
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onPost(/api\/v1.0\/delete_array\/*/)
      .reply(200, {})
      .onAny()
      .reply(200, []);
    const getSpy = jest.spyOn(axios, "post");
    renderComponent();
    const { getByTestId, asFragment, getByText } = wrapper;
    await waitForElement(() => getByText("Unmount Array"))
    expect(asFragment()).toMatchSnapshot();
    const dev1 = await waitForElement(() => getByTestId("diskshow-0"));
    fireEvent.click(dev1);
  });

  it("should unmount an array and turn on write through mode", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, deviceJson)
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onPost(/api\/v1.0\/delete_array\/*/)
      .reply(200, {})
      .onAny()
      .reply(200, []);
    const getSpy = jest.spyOn(axios, "post");
    renderComponent();
    const { getByTestId, asFragment, getByText } = wrapper;
    const unmountArrayButton = await waitForElement(() => getByText("Unmount Array"))
    fireEvent.click(unmountArrayButton);
    const writeThroughModeCheckbox = await waitForElement(() => getByTestId("mount-writethrough-checkbox"));
    fireEvent.click(writeThroughModeCheckbox);
    expect(writeThroughModeCheckbox.checked).toEqual(true);
  });

  it("should delete the array", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onPost(/api\/v1.0\/delete_array\/*/)
      .reply(200, {})
      .onAny()
      .reply(200, []);
    renderComponent();
    const { getByText } = wrapper;
    const deleteButton = await waitForElement(() => getByText("Delete Array"));
    fireEvent.click(deleteButton);
    expect(getByText("Yes")).toBeDefined();
    fireEvent.click(getByText("Yes"));
  });

  it("should select another array", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array, {
        RAIDLevel: "5",
        arrayname: "POSArray2",
        metadiskpath: [
          {
            deviceName: "uram0",
          },
        ],
        sparedisks: [
          {
            deviceName: "unvmens-3",
          },
        ],
        storagedisks: [
          {
            deviceName: "unvmens-0",
          },
          {
            deviceName: "unvmens-1",
          },
          {
            deviceName: "unvmens-2",
          },
          {
            deviceName: "unvmens-4",
          },
        ],
        status: "Mounted",
        state: "EXIST",
        totalsize: 6357625339904,
        usedspace: 0,
      }])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onPost(/api\/v1.0\/delete_array\/*/)
      .reply(200, {})
      .onAny()
      .reply(200, []);
    renderComponent();
    const { getByTestId } = wrapper;
    const arraySelect = await waitForElement(() => getByTestId("select-array-input"));
    fireEvent.change(arraySelect, {
      target: { value: "POSArray2" },
    });
  });

  it("should create a volume with maximum size", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onPost(/api\/v1.0\/delete_array\/*/)
      .reply(200, {})
      .onPost(/api\/v1.0\/save-volume\/*/)
      .reply(200, {
        result: { status: { code: 0 } },
      })
      .onAny()
      .reply(200, []);
    jest.setTimeout(60000);
    renderComponent();
    const {
      getByTestId,
      getByLabelText,
      getAllByTitle,
      asFragment,
      getByText,
      getAllByText,
    } = wrapper;
    const volName = await waitForElement(() => getByTestId("create-vol-name"));
    fireEvent.change(volName, { target: { value: "vol1" } });
    const volCount = await waitForElement(() =>
      getByTestId("create-vol-count")
    );
    fireEvent.change(volCount, { target: { value: 1 } });
    // const volSuffix = await waitForElement(() =>
    //   getByLabelText("Suffix Start Value")
    // );
    // fireEvent.change(volSuffix, { target: { value: 0 } });
    const volSize = await waitForElement(() => getByTestId("create-vol-size"));
    fireEvent.change(volSize, { target: { value: maxAvailableSize } });
    const volUnit = await waitForElement(() =>
      getByTestId("volume-unit-input")
    );
    fireEvent.click(volUnit);
    fireEvent.change(volUnit, { target: { value: "TB" } });
    //fireEvent.click(await waitForElement(() => getByText('TB')));

    const mountVolCheckBox = await waitForElement(() => getByTestId("mount-vol-checkbox"));
    fireEvent.click(mountVolCheckBox);
    expect(mountVolCheckBox.checked).toEqual(false);

    const createVolButton = await waitForElement(() =>
      getByTestId("createvolume-btn")
    );
    fireEvent.click(createVolButton);
    expect(getAllByTitle(/Volume creation is in progress/)).toBeDefined();
  });

  it("should throw error if creating volume is not possible because of wrong values", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes$/)
      .reply(200, membersJson)
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        Capacity: capacityJson,
        Oem: oemJson,
        Status: statusJson,
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        Capacity: capacityJson,
        Oem: oemJson,
        Status: statusJson,
      })
      .onGet(/api\/v1.0\/max_volume_count\/*/)
      .reply(200, 256)
      .onAny()
      .reply(200, []);

    jest.setTimeout(30000);
    renderComponent();
    const { getByTestId, getByLabelText, getByText, asFragment } = wrapper;

    const volCount = await waitForElement(() => getByTestId("create-vol-count"));
    fireEvent.change(volCount, { target: { value: "" } });
    const createVolButton = await waitForElement(() => getByTestId("createvolume-btn"));
    fireEvent.click(createVolButton);
    expect(
      await waitForElement(() => getByText("Please Enter Volume Count"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(volCount, { target: { value: "-1" } });
    fireEvent.click(createVolButton);
    expect(
      await waitForElement(() => getByText("Volume Count should be greater than 0"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(volCount, { target: { value: "99999" } });
    fireEvent.click(createVolButton);
    expect(
      await waitForElement(() => getByText(/should not exceed/))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(volCount, { target: { value: "2" } });

    const volSuffix = await waitForElement(() => getByLabelText("Suffix Start Value"));
    fireEvent.change(volSuffix, { target: { value: -1 } });
    fireEvent.click(createVolButton);
    expect(
      await waitForElement(() => getByText("Suffix Value cannot be negative"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(volSuffix, { target: { value: null } });
    fireEvent.click(createVolButton);
    expect(
      await waitForElement(() => getByText("Please Enter Suffix Start Value"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(volSuffix, { target: { value: 0 } });

    const volName = await waitForElement(() => getByTestId("create-vol-name"));
    fireEvent.change(volName, { target: { value: "" } });
    fireEvent.click(createVolButton);
    expect(
      await waitForElement(() => getByText("Please Enter Volume Name"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(volName, { target: { value: "multi-vol1" } });

    const volSize = await waitForElement(() => getByTestId("create-vol-size"));
    fireEvent.change(volSize, { target: { value: "" } });
    fireEvent.click(createVolButton);
    expect(
      await waitForElement(() => getByText("Please Enter Volume Size"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(volSize, { target: { value: -1 } });
    fireEvent.click(createVolButton);
    expect(
      await waitForElement(() => getByText("Volume Size cannot be negative"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(volSize, { target: { value: 0 } });
    fireEvent.click(createVolButton)
    expect(
      await waitForElement(() => getByText(/Please select an unused subsystem/))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));

    const mountVolCheckBox = await waitForElement(() => getByTestId("mount-vol-checkbox"));
    fireEvent.click(mountVolCheckBox);
    expect(mountVolCheckBox.checked).toEqual(false);

    fireEvent.click(createVolButton)
    expect(
      await waitForElement(() => getByText(/Multiple volumes cannot be created/))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("Yes")));
  });

  it("should create a volume with advance options and mounting old subsystem", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\/subsystem\//)
      .reply(200, subsystems)
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes/)
      .reply(200, { "@odata.type": "#VolumeCollection_1_0_0.VolumeCollection", "Name": "Volumes", "Members@odata.count": 1, "@odata.id": "/redfish/v1/StorageServices/1/Volumes", "@odata.context": "/redfish/v1/$metadata#VolumeCollection.VolumeCollection", "Members": [{ "@odata.id": "/redfish/v1/StorageServices/POSArray/Volumes/0" }], "Permissions": [{ "Read": "True" }, { "Write": "True" }] })
      .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes\/0/)
      .reply(200, { "@odata.context": "redfish/v1/$metadata#Volume.Volume", "@odata.type": "#Volume_1_0_0.Volume", "Name": "vol", "Id": "0", "Description": "", "Status": { "Health": "OK", "Oem": { "VolumeStatus": "Mounted" } }, "AccessCapabilities": ["Read", "Write", "Append", "Streaming"], "BlockSizeBytes": 512, "Capacity": { "Data": { "ConsumedBytes": 0.0, "AllocatedBytes": 20322711502848.0 } }, "Oem": { "MaxBandwidth": 0, "MaxIOPS": 0, "MinIOPS": 0, "MinBandwidth": 0, "IP": "127.0.0.1", "Port": "NA", "NQN": "nqn.2019-04.pos:subsystem1", "UUID": "6cdb989a-f948-407a-a728-f80a86061ca3" }, "@odata.id": "/redfish/v1/StorageServices/POSArray/Volumes/0" })
      .onPost(/api\/v1.0\/delete_array\/*/)
      .reply(200, {})
      .onPost(/api\/v1.0\/save-volume\/*/)
      .reply(200, {
        result: { status: { code: 0 } },
      })
      .onAny()
      .reply(200, []);
    jest.setTimeout(60000);
    renderComponent();
    const {
      getByTestId,
      getByLabelText,
      getAllByTitle,
      asFragment,
      getByText,
      getAllByText,
    } = wrapper;
    const advanceOptionsButton = await waitForElement(() =>
      getByTestId("advanceoptions-btn")
    );
    fireEvent.click(advanceOptionsButton);
    const volName = await waitForElement(() => getByTestId("adv-create-vol-name"));
    fireEvent.change(volName, { target: { value: "vol1" } });
    const volCount = await waitForElement(() =>
      getByTestId("adv-create-vol-count")
    );
    fireEvent.change(volCount, { target: { value: 2 } });
    const volSuffix = await waitForElement(() =>
      getByLabelText("Suffix start value")
    );
    fireEvent.change(volSuffix, { target: { value: 0 } });
    const volSize = await waitForElement(() => getByTestId("adv-create-vol-size"));
    fireEvent.change(volSize, { target: { value: "10" } });
    const volUnit = await waitForElement(() =>
      getByTestId("adv-volume-unit-input")
    );
    fireEvent.click(volUnit);
    fireEvent.change(volUnit, { target: { value: "TB" } });
    //fireEvent.click(await waitForElement(() => getByText('TB')));
    const nextButton = await waitForElement(() =>
      getByTestId("next-btn")
    );
    const stopOnErrorCheckbox = await waitForElement(() => getByTestId("adv-stop-on-error-checkbox"));
    fireEvent.click(stopOnErrorCheckbox);
    expect(stopOnErrorCheckbox.checked).toEqual(true);
    fireEvent.click(nextButton);
    const minValue = await waitForElement(() => getByTestId("adv-create-vol-minvalue"));
    fireEvent.change(minValue, { target: { value: "10" } });
    const minType = await waitForElement(() =>
      getByTestId("adv-mintype-input")
    );
    fireEvent.click(minType);
    fireEvent.change(minType, { target: { value: "minbw" } });
    fireEvent.click(nextButton);
    const selectSubsystem = await waitForElement(() => getByTestId("adv-subsystem-input"))
    fireEvent.click(selectSubsystem)
    fireEvent.change(selectSubsystem, { target: { value: "nqn.2019-04.pos:subsystem2" } });
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    expect(getAllByTitle(/Volume creation is in progress/)).toBeDefined();
  });

  it("should create a volume with advance options and mounting new subsystem with maximum available size", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onPost(/api\/v1.0\/delete_array\/*/)
      .reply(200, {})
      .onPost(/api\/v1.0\/save-volume\/*/)
      .reply(200, {
        result: { status: { code: 0 } },
      })
      .onAny()
      .reply(200, []);
    jest.setTimeout(60000);
    renderComponent();
    const {
      getByTestId,
      getByLabelText,
      getAllByTitle,
      asFragment,
      getByText,
      getAllByText,
    } = wrapper;
    const advanceOptionsButton = await waitForElement(() =>
      getByTestId("advanceoptions-btn")
    );
    fireEvent.click(advanceOptionsButton);

    const volSize = await waitForElement(() => getByTestId("adv-create-vol-size"));
    fireEvent.change(volSize, { target: { value: maxAvailableSize } });
    const volUnit = await waitForElement(() =>
      getByTestId("adv-volume-unit-input")
    );
    fireEvent.click(volUnit);
    fireEvent.change(volUnit, { target: { value: "TB" } });
    const nextButton = await waitForElement(() =>
      getByTestId("next-btn")
    );
    fireEvent.click(nextButton);
    const minValue = await waitForElement(() => getByTestId("adv-create-vol-minvalue"));
    fireEvent.change(minValue, { target: { value: "10" } });
    const minType = await waitForElement(() =>
      getByTestId("adv-mintype-input")
    );
    fireEvent.click(minType);
    fireEvent.change(minType, { target: { value: "minbw" } });
    fireEvent.click(nextButton);
    const newSubsystemCheckbox = await waitForElement(() => getByTestId("adv-selectedNewSubsystem"));
    fireEvent.click(newSubsystemCheckbox);
    expect(newSubsystemCheckbox.checked).toEqual(true);
    const subSystemName = await waitForElement(() => getByTestId("adv-create-subsystem-name"));
    fireEvent.change(subSystemName, { target: { value: "nqn.2019-04.pos:subsystem-test" } });
    const transportType = await waitForElement(() =>
      getByTestId("adv-transport_type-input")
    );
    fireEvent.click(transportType);

    const targetAddress = await waitForElement(() =>
      getByTestId("adv-create-target-address")
    );
    fireEvent.change(targetAddress, { target: { value: "127.0.0.1" } });

    const transportServiceId = await waitForElement(() =>
      getByTestId("adv-create-transport-service-id")
    );
    fireEvent.change(transportServiceId, { target: { value: "1158" } });
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    expect(getAllByTitle(/Volume creation is in progress/)).toBeDefined();
  });

  it("should create a volume with advance options without mount", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onPost(/api\/v1.0\/delete_array\/*/)
      .reply(200, {})
      .onPost(/api\/v1.0\/save-volume\/*/)
      .reply(200, {
        result: { status: { code: 0 } },
      })
      .onAny()
      .reply(200, []);
    jest.setTimeout(60000);
    renderComponent();
    const {
      getByTestId,
      getByLabelText,
      getAllByTitle,
      asFragment,
      getByText,
      getAllByText,
    } = wrapper;
    const advanceOptionsButton = await waitForElement(() =>
      getByTestId("advanceoptions-btn")
    );
    fireEvent.click(advanceOptionsButton);
    const volName = await waitForElement(() => getByTestId("adv-create-vol-name"));
    fireEvent.change(volName, { target: { value: "vol1" } });
    const volCount = await waitForElement(() =>
      getByTestId("adv-create-vol-count")
    );
    fireEvent.change(volCount, { target: { value: 2 } });
    const volSuffix = await waitForElement(() =>
      getByLabelText("Suffix start value")
    );
    fireEvent.change(volSuffix, { target: { value: 0 } });
    const volSize = await waitForElement(() => getByTestId("adv-create-vol-size"));
    fireEvent.change(volSize, { target: { value: "10" } });
    const volUnit = await waitForElement(() =>
      getByTestId("adv-volume-unit-input")
    );
    fireEvent.click(volUnit);
    fireEvent.change(volUnit, { target: { value: "TB" } });
    const nextButton = await waitForElement(() =>
      getByTestId("next-btn")
    );
    fireEvent.click(nextButton);
    const backButton = await waitForElement(() =>
      getByTestId("back-btn")
    );
    fireEvent.click(nextButton);

    fireEvent.click(backButton);
    fireEvent.click(nextButton);
    const mountVolCheckBox = await waitForElement(() => getByTestId("adv-mount-vol-checkbox"));
    fireEvent.click(mountVolCheckBox);
    expect(mountVolCheckBox.checked).toEqual(false);
    fireEvent.click(nextButton);

    fireEvent.click(nextButton);
    expect(getAllByTitle(/Volume creation is in progress/)).toBeDefined();
  });

  it("should throw error if creating volume with advance options is not possible because subsystem used by another array", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices: [{
          name: "unvmens-0",
          size: 390703446,
          mn: "SAMSUNG MZWLL1T6HAJQ-00005",
          sn: "S4C9NF0M500043",
          isAvailable: false,
          numa: "0"
        }],
        metadevices,
      })
      .onGet(/api\/v1.0\/max_volume_count\/*/)
      .reply(200, 256)
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [{
        RAIDLevel: "0",
        arrayname: "POSArray2",
        metadiskpath: [
          {
            deviceName: "uram0",
          },
        ],
        sparedisks: [

        ],
        storagedisks: [
          {
            deviceName: "unvmens-0",
          }
        ],
        status: "Mounted",
        state: "EXIST",
        totalsize: 6357625339904,
        usedspace: 0,
      }])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onGet(/api\/v1\/subsystem\//)
      .reply(200, subsystems)
      .onGet(/api\/v1.0\/max_volume_count\/*/)
      .reply(200, 256)
      .onPost(/api\/v1.0\/delete_array\/*/)
      .reply(200, {})
      .onPost(/api\/v1.0\/save-volume\/*/)
      .reply(200, {
        result: { status: { code: 0 } },
      })
      .onAny()
      .reply(200, []);
    jest.setTimeout(60000);
    renderComponent();
    const {
      getByTestId,
      getByLabelText,
      getAllByTitle,
      asFragment,
      getByText,
      getAllByText,
    } = wrapper;
    const advanceOptionsButton = await waitForElement(() => getByTestId("advanceoptions-btn"));
    fireEvent.click(advanceOptionsButton);

    const nextButton = await waitForElement(() => getByTestId("next-btn"));
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText(/Please select an unused subsystem/))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
  });

  it("should throw error if creating volume with advance options is not possible because of wrong values", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1.0\/max_volume_count\/*/)
      .reply(200, 256)
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onGet(/api\/v1\/subsystem\//)
      .reply(200, subsystems)
      .onGet(/api\/v1.0\/max_volume_count\/*/)
      .reply(200, 256)
      .onPost(/api\/v1.0\/delete_array\/*/)
      .reply(200, {})
      .onPost(/api\/v1.0\/save-volume\/*/)
      .reply(200, {
        result: { status: { code: 0 } },
      })
      .onAny()
      .reply(200, []);
    jest.setTimeout(60000);
    renderComponent();
    const {
      getByTestId,
      getByLabelText,
      getAllByTitle,
      asFragment,
      getByText,
      getAllByText,
    } = wrapper;
    const advanceOptionsButton = await waitForElement(() => getByTestId("advanceoptions-btn"));
    fireEvent.click(advanceOptionsButton);

    const nextButton = await waitForElement(() => getByTestId("next-btn"));

    const volName = await waitForElement(() => getByTestId("adv-create-vol-name"));
    fireEvent.change(volName, { target: { value: "" } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText("Please Enter Volume Name"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(volName, { target: { value: "vol1" } });

    const volCount = await waitForElement(() =>
      getByTestId("adv-create-vol-count")
    );
    fireEvent.change(volCount, { target: { value: "" } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText("Please Enter Volume Count"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(volCount, { target: { value: 0 } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText("Volume Count should be greater than 0"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(volCount, { target: { value: 99999999 } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText(/should not exceed/))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(volCount, { target: { value: 2 } });

    const volSuffix = await waitForElement(() =>
      getByLabelText("Suffix start value")
    );
    fireEvent.change(volSuffix, { target: { value: -1 } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText("Suffix Value cannot be negative"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(volSuffix, { target: { value: null } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText("Please Enter Suffix Start Value"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(volSuffix, { target: { value: 0 } });

    const volSize = await waitForElement(() => getByTestId("adv-create-vol-size"));
    fireEvent.change(volSize, { target: { value: "" } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText("Please Enter Volume Size"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(volSize, { target: { value: "-1" } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText("Volume Size cannot be negative"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(volSize, { target: { value: "0" } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText("Multiple volumes cannot be created when volume size is set as 0. Do you want to create a single volume with the maximum available size?"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("Yes")));

    fireEvent.click(nextButton)

    const maxBw = await waitForElement(() => getByTestId("adv-create-vol-max-bw"));
    fireEvent.change(maxBw, { target: { value: "" } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText("Please Enter Maximum Bandwidth (MB/s)"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(maxBw, { target: { value: "-1" } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText("Maximum Bandwidth cannot be negative"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(maxBw, { target: { value: "5" } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText(/Max Bandwidth should be in the range/))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(maxBw, { target: { value: "0" } });

    const maxIOPS = await waitForElement(() => getByTestId("adv-create-vol-max-iops"));
    fireEvent.change(maxIOPS, { target: { value: "" } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText("Please Enter Maximum IOPS (KIOPS)"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(maxIOPS, { target: { value: "-1" } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText("Maximum IOPS cannot be negative"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(maxIOPS, { target: { value: "5" } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText(/Max IOPS should be in the range 10/))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(maxIOPS, { target: { value: "0" } });

    const minValue = await waitForElement(() => getByTestId("adv-create-vol-minvalue"));
    fireEvent.change(minValue, { target: { value: "" } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText("Please Enter Minimum IOPS/BW or set 0 for no Minimum IOPS/BW"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(minValue, { target: { value: "-1" } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText("Minimum IOPS/Bandwidth cannot be negative"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(minValue, { target: { value: "0" } });

    fireEvent.click(nextButton);

    const newSubsystemCheckbox = await waitForElement(() => getByTestId("adv-selectedNewSubsystem"));
    fireEvent.click(newSubsystemCheckbox);
    expect(newSubsystemCheckbox.checked).toEqual(true);
    const subSystemName = await waitForElement(() => getByTestId("adv-create-subsystem-name"));
    fireEvent.change(subSystemName, { target: { value: "" } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText("Please Enter Subsystem Name"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(subSystemName, { target: { value: "nqn.2019-04.pos:subsystem-test" } });

    const targetAddress = await waitForElement(() =>
      getByTestId("adv-create-target-address")
    );
    fireEvent.change(targetAddress, { target: { value: "" } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText("Please Enter Target Address"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(targetAddress, { target: { value: "127.0.0.1" } });

    const transportServiceId = await waitForElement(() =>
      getByTestId("adv-create-transport-service-id")
    );
    fireEvent.change(transportServiceId, { target: { value: "" } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText("Please Enter Transport Service Type"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(transportServiceId, { target: { value: "-1" } });
    fireEvent.click(nextButton);
    expect(
      await waitForElement(() => getByText("Transport Service Type cannot be negative"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(transportServiceId, { target: { value: "1158" } });
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    expect(getAllByTitle(/Volume creation is in progress/)).toBeDefined();
  });

  it("should close the advance options popup", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onPost(/api\/v1.0\/delete_array\/*/)
      .reply(200, {})
      .onAny()
      .reply(200, []);
    jest.setTimeout(60000);
    renderComponent();
    const {
      getByTestId,
      getByLabelText,
      getAllByTitle,
      asFragment,
      getByText,
      getAllByText,
    } = wrapper;
    const advanceOptionsButton = await waitForElement(() =>
      getByTestId("advanceoptions-btn")
    );
    fireEvent.click(advanceOptionsButton);
    const closeIconButton = await waitForElement(() => getByLabelText("Close"));
    fireEvent.click(closeIconButton)
    expect(
      await waitForElement(() => getByText("Closing the Advance Create Volume popup will reset the input fields ?"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("No")));
    fireEvent.click(closeIconButton)
    expect(
      await waitForElement(() => getByText("Closing the Advance Create Volume popup will reset the input fields ?"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("Yes")));
  });

  it("should select and delete a volume", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onGet("/redfish/v1/StorageServices/POSArray/Volumes")
      .reply(200, {
        Members: [
          {
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
          }, {
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
          },
        ],
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        Capacity: capacityJson,
        Oem: oemJson,
        Status: statusJson,
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        Capacity: capacityJson,
        Oem: oemJson,
        Status: statusJson,
      })
      .onAny()
      .reply(200, []);

    jest.setTimeout(30000);
    renderComponent();
    const { getByText, getByTestId, getByTitle } = wrapper;
    const checkBox2 = await waitForElement(() => getByTestId("vol-select-checkbox-vol2"));
    fireEvent.click(checkBox2);
    const deleteBtn = await waitForElement(() => getByTestId("vol-list-icon-delete"));
    fireEvent.click(deleteBtn);
    const yesBtn = await waitForElement(() => getByText("Yes"));
    fireEvent.click(yesBtn);
    const deleteTxt = await waitForElement(() =>
      getByText("Deleting Volume(s)")
    );
    expect(deleteTxt).toBeDefined();
  });

  it("should try to mount a volume", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes$/)
      .reply(200, membersJson)
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        Capacity: capacityJson,
        Oem: oemJson,
        Status: {
          Oem: {
            VolumeStatus: "Unmounted",
          },
        },
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        Capacity: capacityJson,
        Oem:oemJson,
        Status: {
          Oem: {
            VolumeStatus: "Unmounted",
          },
        },
      })
      .onGet(/api\/v1\/subsystem/)
      .reply(200, {
        result: {
          data: {
            subsystemlist: [{
              nqn: "subsystem1",
              subtype: "NVMe"
            }, {
              nqn: "subsystem2",
              subtype: "NVMe"
            }],
          },
          status: {
            code: 0,
            description: "Success",
          },
        },
      })
      .onPost(/api\/volume\/mount/)
      .reply(200, {
        result: {
          status: {
            code: 1024,
            description: "Error while mounting",
          },
        },
      })
      .onAny()
      .reply(200, []);
    const getSpy = jest.spyOn(axios, "post");
    renderComponent();
    const { getByText, getByLabelText, getAllByTestId, getByTestId, asFragment } = wrapper;
    const mountToggle = await waitForElement(() =>
      getByTestId("vol-mount-btn-vol2")
    );
    fireEvent.click(mountToggle);
    const mountSelect = await waitForElement(() =>
      getByLabelText("Select Subsystem")
    );
    fireEvent.click(mountSelect);
    const subsystems = await waitForElement(() =>
      getAllByTestId('subsystem'));
    fireEvent.click(subsystems[1]);
    const mountBtn = await waitForElement(() =>
      getByTestId("subsystem-mountvolume-btn")
    );
    fireEvent.click(mountBtn);

    expect(getSpy).toHaveBeenCalledWith(
      "/api/v1.0/volume/mount",
      {
        name: "vol2",
        array: "POSArray",
        subnqn: "subsystem1"
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": null,
        },
      }
    );
  });

  it("should unmount a volume", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes$/)
      .reply(200, membersJson)
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        Capacity: capacityJson,
        Oem: oemJson,
        Status: statusJson,
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        Capacity: capacityJson,
        Oem: oemJson,
        Status: statusJson,
      })
      .onGet(/api\/v1\/subsystem/)
      .reply(200, {
        result: {
          data: {
            subsystemlist: [{
              nqn: "subsystem1",
              subtype: "NVMe"
            }, {
              nqn: "subsystem2",
              subtype: "NVMe"
            }],
          }
        }
      })
      .onDelete(/api\/volume\/mount/)
      .reply(200, {
        result: resultJson,
      })
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onAny()
      .reply(200, []);
    const getSpy = jest.spyOn(axios, "delete");
    renderComponent();
    const { getByText, getByTitle, getByTestId, asFragment } = wrapper;
    const mountBtn = await waitForElement(() =>
      getByTestId("vol-mount-btn-vol2")
    );
    fireEvent.click(mountBtn);
    const subMountBtn = await waitForElement(() =>
      getByTestId("vol-mount-btn-vol2")
    );
    expect(getSpy).toHaveBeenCalledWith("/api/v1.0/volume/mount", {
      data: {
        name: "vol2",
        array: "POSArray",
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": null,
      },
    });
    expect(() => getByTestId("alertDescription")).toBeDefined();
  });

  it("should throw error if a volume cannot be mounted", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes$/)
      .reply(200, membersJson)
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        Capacity: capacityJson,
        Oem: oemJson,
        Status:statusJson,
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        Capacity: capacityJson,
        Oem: oemJson,
        Status: statusJson,
      })
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onAny()
      .reply(200, []);
    jest.setTimeout(30000);
    const getSpy = jest.spyOn(axios, "delete");
    renderComponent();
    const { getByText, getByTitle, getByTestId, asFragment } = wrapper;
    const mountBtn = await waitForElement(() =>
      getByTestId("vol-mount-btn-vol2")
    );
    fireEvent.click(mountBtn);
    expect(getSpy).toHaveBeenCalledWith("/api/v1.0/volume/mount", {
      data: {
        name: "vol2",
        array: "POSArray",
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": null,
      },
    });
    expect(() => getByTestId("alertDescription")).toBeDefined();
  });

  it("should edit a volume", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes$/)
      .reply(200, membersJson)
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
        Capacity: capacityJson,
        Oem: oemJson,
        Status:  statusJson,
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
        Capacity: capacityJson,
        Oem: oemJson,
        Status: statusJson,
      })
      .onPut("/api/v1.0/update-volume/")
      .reply(200, {
        result: resultJson,
      })
      .onAny()
      .reply(200, []);
    renderComponent();
    jest.setTimeout(30000);
    const { getByText, getByTitle, getByTestId, asFragment } = wrapper;
    const editBtn = await waitForElement(() =>
      getByTestId("vol-edit-btn-vol2")
    );
    fireEvent.click(editBtn);
    const volName = await waitForElement(() =>
      getByTestId("list-vol-name-vol2")
    );
    fireEvent.change(volName, { target: { value: "vol3" } });
    const maxBw = await waitForElement(() =>
      getByTestId("list-vol-maxbw-vol2")
    );
    fireEvent.change(maxBw, { target: { value: "0" } });
    const maxIops = await waitForElement(() =>
      getByTestId("list-vol-maxiops-vol2")
    );
    fireEvent.change(maxIops, { target: { value: "0" } });
    const saveBtn = await waitForElement(() =>
      getByTestId("vol-edit-save-btn-vol2")
    );
    fireEvent.click(saveBtn);
    const saveTxt = await waitForElement(() => getByText("Update Volume"));
    expect(saveTxt).toBeDefined();
  });

  it("should show error mesasage if invalid value is given to maxiops", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes$/)
      .reply(200, membersJson)
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
        Capacity: capacityJson,
        Oem: oemJson,
        Status: statusJson,
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
        Capacity: capacityJson,
        Oem: oemJson,
        Status: statusJson,
      })
      .onPut("/api/v1.0/update-volume/")
      .reply(200, {
        result: resultJson,
      })
      .onAny()
      .reply(200, []);
    renderComponent();
    jest.setTimeout(30000);
    const { getByTestId } = wrapper;
    const editBtn = await waitForElement(() =>
      getByTestId("vol-edit-btn-vol2")
    );
    fireEvent.click(editBtn);
    const volName = await waitForElement(() =>
      getByTestId("list-vol-name-vol2")
    );
    fireEvent.change(volName, { target: { value: "vol3" } });
    const maxBw = await waitForElement(() =>
      getByTestId("list-vol-maxbw-vol2")
    );
    fireEvent.change(maxBw, { target: { value: "0" } });
    const maxIops = await waitForElement(() =>
      getByTestId("list-vol-maxiops-vol2")
    );
    fireEvent.change(maxIops, { target: { value: 8 } });
    const saveBtn = await waitForElement(() =>
      getByTestId("vol-edit-save-btn-vol2")
    );
    fireEvent.click(saveBtn);
    const alertMsg = await waitForElement(() =>
      getByTestId("alertDescription")
    );
    expect(alertMsg).toBeDefined();
  });

  it("should cancel editing a volume", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1.0\/max_volume_count\/*/)
      .reply(200, 256)
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes$/)
      .reply(200, {
        Members: [
          {
            "@odata.id": "/redfish/v1/StorageServices/POSArray/Volumes/0",
            "@odata.id": "/redfish/v1/StorageServices/POSArray/Volumes/1",
          },
        ],
      })
      .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        Capacity: capacityJson,
        Oem: oemJson,
        Status: statusJson,
      })
      .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        Capacity: capacityJson,
        Oem: oemJson,
        Status: statusJson,
      })
      .onAny()
      .reply(200, []);
    jest.setTimeout(30000);
    renderComponent();
    const { queryByTestId, getByTitle, getByTestId, asFragment } = wrapper;
    await waitForElement(() => getByTestId("arrayshow"));
    const editBtn = await waitForElement(() =>
      getByTestId("vol-edit-btn-vol2")
    );
    fireEvent.click(editBtn);
    const maxBw = await waitForElement(() =>
      getByTestId("list-vol-maxbw-vol2")
    );
    fireEvent.change(maxBw, { target: { value: "0" } });
    const maxIops = await waitForElement(() =>
      getByTestId("list-vol-maxiops-vol2")
    );
    fireEvent.change(maxIops, { target: { value: "0" } });
    const cancelBtn = await waitForElement(() =>
      getByTestId("vol-edit-cancel-btn-vol2")
    );
    fireEvent.click(cancelBtn);
    await waitForElement(() => getByTestId("vol-edit-btn-vol2"));
    expect(queryByTestId(/list-vol-maxiops-vol2/i)).toBeNull();
  });

  it("should reset QoS of a volume", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes$/)
      .reply(200, membersJson)
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
        Capacity: capacityJson,
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: statusJson,
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
        Capacity: capacityJson,
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: statusJson,
      })
      .onPut("/api/v1.0/update-volume/")
      .reply(200, {
        result: resultJson,
      })
      .onAny()
      .reply(200, []);
    renderComponent();
    jest.setTimeout(30000);
    const { getByText, getByTitle, getByTestId, asFragment } = wrapper;
    const resetBtn = await waitForElement(() => getByTestId("vol-reset-qos-btn-vol2"));
    fireEvent.click(resetBtn);
    expect(await waitForElement(() => getByText("QoS Reset successfull"))).toBeDefined();
  });

  it("should throw error when reset QoS of a volume fails", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes$/)
      .reply(200, membersJson)
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
        Capacity: capacityJson,
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: statusJson,
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
        Capacity: capacityJson,
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status:statusJson,
      })
      .onPut("/api/v1.0/update-volume/")
      .reply(200, {
        result: resultJson,
      })
      .onPost("/api/v1/qos/reset")
      .reply(400, {})
      .onAny()
      .reply(200, []);
    renderComponent();
    jest.setTimeout(30000);
    const { getByText, getByTitle, getByTestId, asFragment } = wrapper;
    const resetBtn = await waitForElement(() => getByTestId("vol-reset-qos-btn-vol2"));
    fireEvent.click(resetBtn);
    expect(await waitForElement(() => getByText("Volume QoS Reset failed"))).toBeDefined();
  });

  it("set miniops then minbw", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes$/)
      .reply(200, membersJson)
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
        Capacity: capacityJson,
        Oem: oemJson,
        Status: statusJson,
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
        Capacity: capacityJson,
        Oem: oemJson,
        Status: statusJson,
      })
      .onPut("/api/v1.0/update-volume/")
      .reply(200, {
        result:resultJson,
      })
      .onAny()
      .reply(200, []);

    jest.setTimeout(30000);
    renderComponent();

    const { getByText, getByTitle, asFragment, getByTestId } = wrapper;
    const editBtn = await waitForElement(() =>
      getByTestId("vol-edit-btn-vol2")
    );
    fireEvent.click(editBtn);
    const minValue = await waitForElement(() =>
      getByTestId("list-vol-minbw-miniops-vol2")
    )
    fireEvent.change(minValue, { target: { value: "10" } });
    const minType = await waitForElement(() =>
      getByTestId("list-vol-select-minbw-miniops-vol2")
    )
    fireEvent.change(minType, { target: { value: "minbw" } });
    const saveBtn = await waitForElement(() =>
      getByTestId("vol-edit-save-btn-vol2")
    );
    fireEvent.change(minValue, { target: { value: "10" } });
    fireEvent.click(saveBtn);
    const saveTxt = await waitForElement(() => getByText("Update Volume"));
    expect(saveTxt).toBeDefined();
  });

  it("reset miniops then set minbw", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes$/)
      .reply(200, membersJson)
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
        Capacity: capacityJson,
        Oem: {
          MaxIOPS: 0,
          MaxBW: 0,
          MinIOPS: 0,
          MinBandwidth: 0
        },
        Status: statusJson,
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
        Capacity: capacityJson,
        Oem: {
          MaxIOPS: 0,
          MaxBW: 0,
          MinIOPS: 10,
          MinBandwidth: 0
        },
        Status: statusJson,
      })
      .onPut("/api/v1.0/update-volume/")
      .reply(200, {
        result: resultJson,
      })
      .onAny()
      .reply(200, []);

    jest.setTimeout(30000);
    renderComponent();

    const { getByText, getByTitle, asFragment, getByTestId } = wrapper;
    const editBtn = await waitForElement(() =>
      getByTestId("vol-edit-btn-vol2")
    );
    fireEvent.click(editBtn);
    const minType = await waitForElement(() =>
      getByTestId("list-vol-select-minbw-miniops-vol2")
    )
    fireEvent.change(minType, { target: { value: "minbw" } });
    expect(
      await waitForElement(() => getByText(/Are you sure want to reset Minimum/))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("Yes")));
    const minValue = await waitForElement(() =>
      getByTestId("list-vol-minbw-miniops-vol2")
    )
    fireEvent.change(minValue, { target: { value: "10" } });
    const saveBtn = await waitForElement(() =>
      getByTestId("vol-edit-save-btn-vol2")
    );
    fireEvent.click(saveBtn);
    // const saveTxt = await waitForElement(() => getByText("Update Volume"));
    // expect(saveTxt).toBeDefined();
  });

  it("reset minbw then set miniops", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onGet(/redfish\/v1\/StorageServices\/POSArray\/Volumes$/)
      .reply(200,membersJson)
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
        Capacity: capacityJson,
        Oem: {
          MaxIOPS: 0,
          MaxBW: 0,
          MinIOPS: 0,
          MinBandwidth: 0
        },
        Status: statusJson,
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
        Capacity: capacityJson,
        Oem: {
          MaxIOPS: 0,
          MaxBandwidth: 0,
          MinIOPS: 0,
          MinBandwidth: 10
        },
        Status: statusJson,
      })
      .onPut("/api/v1.0/update-volume/")
      .reply(200, {
        result: resultJson,
      })
      .onAny()
      .reply(200, []);

    jest.setTimeout(60000);
    renderComponent();

    const { getByText, getByTitle, asFragment, getByTestId } = wrapper;
    const editBtn = await waitForElement(() =>
      getByTestId("vol-edit-btn-vol2")
    );
    fireEvent.click(editBtn);
    const minType = await waitForElement(() =>
      getByTestId("list-vol-select-minbw-miniops-vol2")
    )
    fireEvent.change(minType, { target: { value: "miniops" } });
    expect(
      await waitForElement(() => getByText(/Are you sure want to reset Minimum/))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("No")));
    fireEvent.change(minType, { target: { value: "miniops" } });
    expect(
      await waitForElement(() => getByText(/Are you sure want to reset Minimum/))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("Yes")));
    const minValue = await waitForElement(() =>
      getByTestId("list-vol-minbw-miniops-vol2")
    )
    fireEvent.change(minValue, { target: { value: "10" } });
    const saveBtn = await waitForElement(() =>
      getByTestId("vol-edit-save-btn-vol2")
    );
    fireEvent.click(saveBtn);
  });

  it("should show device details when array is created", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/max_volume_count\/*/)
      .reply(200, 256)
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onGet(/api\/v1.0\/device\/smart\/unvmens-0*/)
      .reply(200, {
        result: {
          status: {
            code: 0
          },
          data: {
            temperature: "100",
            temperatureSensor: ["10", "20", "30"]
          }
        }
      })
      .onAny()
      .reply(200, []);
    jest.setTimeout(30000);
    renderComponent();
    const { getByTestId, getByText } = wrapper;
    global.document.createRange = (html) => ({
      setStart: () => { },
      setEnd: () => { },
      commonAncestorContainer: {
        nodeName: "BODY",
        ownerDocument: document,
      },
      createContextualFragment: (html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.children[0];
      },
    });
    await waitForElement(() => getByTestId("arrayshow"));
    await act(async () => {
      fireEvent(
        getByTestId("diskshow-0"),
        new MouseEvent("mouseover", {
          bubbles: true,
          cancelable: true,
        })
      );
      const moreDetails = await waitForElement(() => getByText("More Details"));
      fireEvent.click(moreDetails);
      const temperature = await waitForElement(() => getByText("100"));
      expect(temperature).toBeDefined();
    });
  });

  it("should show device details when array is not created", async () => {
    const { location } = window;
    delete window.location;
    window.location = { ...location, href: "http://localhost/storage/array/create" };
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1.0\/max_volume_count\/*/)
      .reply(200, 256)
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onAny()
      .reply(200, []);
    renderComponent();
    const { getByTestId, queryByTestId, getByText } = wrapper;
    global.document.createRange = (html) => ({
      setStart: () => { },
      setEnd: () => { },
      commonAncestorContainer: {
        nodeName: "BODY",
        ownerDocument: document,
      },
      createContextualFragment: (html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.children[0];
      },
    });
    fireEvent.click(getByText("create"));
    await waitForElement(() => getByTestId("arraycreate"));
    screen.debug(undefined, 300000);
    await act(async () => {
      fireEvent(
        getByTestId("diskselect-0"),
        new MouseEvent("mouseover", {
          bubbles: true,
          cancelable: true,
        })
      );
      const moreDetails = await waitForElement(() => getByText("More Details"));
      fireEvent.click(moreDetails);
      fireEvent.click(getByTestId("diskdetails-close"));
    });
  });

  it("should cancel deleting array", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onAny()
      .reply(200, []);
    renderComponent();
    const { getByTestId, asFragment, getByText } = wrapper;
    fireEvent.click(await waitForElement(() => getByText("Delete Array")));
    fireEvent.click(await waitForElement(() => getByText("No")));
  });

  it("should create a volume when vol size is max and count is greater than 1", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onPost(/api\/v1.0\/delete_array\/*/)
      .reply(200, {})
      .onPost(/api\/v1.0\/save-volume\/*/)
      .reply(200, {
        result: { status: { code: 0 } },
      })
      .onAny()
      .reply(200, []);
    jest.setTimeout(60000);
    renderComponent();
    const {
      getByTestId,
      getByLabelText,
      getAllByTitle,
      asFragment,
      getByText,
      getAllByText,
    } = wrapper;
    const volName = await waitForElement(() => getByTestId("create-vol-name"));
    fireEvent.change(volName, { target: { value: "vol1" } });
    const volCount = await waitForElement(() =>
      getByTestId("create-vol-count")
    );
    fireEvent.change(volCount, { target: { value: 2 } });
    const volSuffix = await waitForElement(() =>
      getByLabelText("Suffix Start Value")
    );
    fireEvent.change(volSuffix, { target: { value: 0 } });
    const volSize = await waitForElement(() => getByTestId("create-vol-size"));
    fireEvent.change(volSize, { target: { value: "2.57" } });
    const volUnit = await waitForElement(() => getByTestId("volume-unit"));
    fireEvent.click(volUnit);
    try {
      fireEvent.click(getByTestId("tb"));
    } catch {
      const volUnitInput = await waitForElement(() => getByTestId("volume-unit-input"));
      fireEvent.change(volUnitInput, { target: { value: "TB" } });
    }
    const createVolButton = await waitForElement(() =>
      getByTestId("createvolume-btn")
    );
    fireEvent.click(createVolButton);
    const alertDescription = await waitForElement(() =>
      getByTestId("alertDescription")
    );
    expect(getAllByTitle(/Volume creation is in progress/)).toBeDefined();
  });

  it("should unmount the array", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onDelete(/api\/v1.0\/ibofos\/mount\/*/)
      .reply(200, { result: { status: { code: 0 } } })
      .onAny()
      .reply(200, []);
    renderComponent();
    const { getByText } = wrapper;
    const unmountButton = await waitForElement(() =>
      getByText("Unmount Array")
    );
    fireEvent.click(unmountButton);
  });

  it("should mount the array", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [{ ...array, state: "OFFLINE", status: "Unmounted" }])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onPost(/api\/v1.0\/ibofos\/mount\/*/)
      .reply(200, { result: { status: { code: 0 } } })
      .onAny()
      .reply(200, []);
    renderComponent();
    const { getByText } = wrapper;
    const mountButton = await waitForElement(() =>
      getByText("Mount Array")
    );
    fireEvent.click(mountButton);
  });

  it("should fail to unmount the array", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onDelete(/api\/v1.0\/ibofos\/mount\/*/)
      .reply(400, {})
      .onAny()
      .reply(200, []);
    renderComponent();
    const { getByText } = wrapper;
    const unmountButton = await waitForElement(() =>
      getByText("Unmount Array")
    );
    fireEvent.click(unmountButton);
  });

  it("should fail to mount the array", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [{ ...array, state: "OFFLINE", status: "Unmounted" }])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onPost(/api\/v1.0\/ibofos\/mount\/*/)
      .reply(400, {})
      .onAny()
      .reply(200, []);
    jest.setTimeout(120000)
    renderComponent();
    const { getByText, getByLabelText, getByTestId, asFragment } = wrapper;
    fireEvent.click(getByText("manage"))
    screen.debug(undefined, 300000)
    await waitForElement(() =>
      getByTestId("arrayshow")
    );
    const mountButton = await waitForElement(() =>
      getByText("Mount Array")
    );
    fireEvent.click(mountButton);
  });

  it("should autocreate an array", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: [
          ...metadevices,
          metaDevicesJson
        ],
      })
      .onPost("/api/v1.0/create_arrays/")
      .reply(200, {})
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onPost("/api/v1/autoarray/")
      .reply(200, {
        result: { status: { code: 0 } },
      })
      .onAny()
      .reply(200, []);
    jest.setTimeout(30000);
    renderComponent();
    const { getByTestId, getByText } = wrapper;
    fireEvent.click(getByText("create"));
    const autoCreateBtn = getByText("Auto-Create");
    fireEvent.click(autoCreateBtn);
    fireEvent.change(await waitForElement(() => getByTestId("auto-array-name")), {
      target: { value: "test" }
    });
    fireEvent.change(await waitForElement(() => getByTestId("auto-writebuffer-input")), {
      target: { value: "uram2" }
    });
    fireEvent.click(getByTestId("auto-createarray-btn"));

    expect(await waitForElement(() => getByText("Array created successfully"))).toBeDefined();
  });

  it("should rebuild the array", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [{
        ...array,
        situation: "DEGRADED",
        state: "DEGRADED"
      }])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onDelete(/api\/v1.0\/ibofos\/mount\/*/)
      .reply(200, { result: { status: { code: 0 } } })
      .onAny()
      .reply(200, []);
    renderComponent();
    const getSpy = jest.spyOn(axios, "post");
    const { getByTestId } = wrapper;
    const rebuildBtn = await waitForElement(() =>
      getByTestId("rebuild-icon")
    );
    fireEvent.click(rebuildBtn);
    expect(getSpy).toHaveBeenCalledWith('/api/v1.0/array/POSArray/rebuild', {}, {
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-access-token": null
      }
    });
  });

  it("should show error while rebuilding the array", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [{
        ...array,
        situation: "DEGRADED",
        state: "DEGRADED"
      }])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onDelete(/api\/v1.0\/ibofos\/mount\/*/)
      .reply(200, { result: { status: { code: 0 } } })
      .onPost(/api\/v1.0\/array\/POSArray\/rebuild*/)
      .reply(200, {
        result: {
          status: {
            code: 400,
            description: "Error in Rebuilding Array"
          }
        }
      })
      .onAny()
      .reply(200, []);
    renderComponent();
    const getSpy = jest.spyOn(axios, "post");
    const { getByTestId, getByText } = wrapper;
    const rebuildBtn = await waitForElement(() =>
      getByTestId("rebuild-icon")
    );
    fireEvent.click(rebuildBtn);
    const rebuildAlert = await waitForElement(() => getByText("Error while Starting Rebuild Operation"));
    expect(rebuildAlert).toBeDefined();
  });

  it("should throw error while autocreate an array", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: [
          ...metadevices,
          metaDevicesJson
        ],
      })
      .onPost("/api/v1.0/create_arrays/")
      .reply(200, {})
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onPost("/api/v1/autoarray/")
      .reply(200, {
        result: { status: { code: 0 } },
      })
      .onAny()
      .reply(200, []);
    renderComponent();
    const { getByTestId, getByText } = wrapper;
    fireEvent.click(getByText("create"));
    const autoCreateBtn = getByText("Auto-Create");
    fireEvent.click(autoCreateBtn);
    fireEvent.click(getByTestId("auto-createarray-btn"));
    expect(waitForElement(() => getByText("Error in Array Creation"))).toBeDefined();
  });

  it("should close the autocreate popup", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: [
          ...metadevices,
          metaDevicesJson
        ],
      })
      .onPost("/api/v1.0/create_arrays/")
      .reply(200, {})
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onPost("/api/v1/autoarray/")
      .reply(200, {
        result: { status: { code: 0 } },
      })
      .onAny()
      .reply(200, []);
    renderComponent();
    const { getByTestId, getByText, getByLabelText } = wrapper;
    fireEvent.click(getByText("create"));
    const autoCreateBtn = getByText("Auto-Create");
    const dev1 = await waitForElement(() => getByTestId("diskselect-0"));
    expect(dev1).toBeDefined();
    fireEvent.click(autoCreateBtn);
    fireEvent.click(await waitForElement(() => getByLabelText("Close")));
  });

  it("should display error message if 3 ssds are not available", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices: [...devices.slice(0, 2)],
        metadevices: [
          ...metadevices,
          metaDevicesJson
        ],
      })
      .onPost("/api/v1.0/create_arrays/")
      .reply(200, {})
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onPost("/api/v1/autoarray/")
      .reply(200, {
        result: { status: { code: 0 } },
      })
      .onAny()
      .reply(200, []);
    jest.setTimeout(30000);
    renderComponent();
    const { getByTestId, getByText } = wrapper;
    fireEvent.click(getByText("create"));
    const autoCreateBtn = getByText("Auto-Create");
    const dev1 = await waitForElement(() => getByTestId("diskselect-0"));
    expect(dev1).toBeDefined();
    fireEvent.click(autoCreateBtn);
    fireEvent.click(await waitForElement(() => getByTestId("auto-createarray-btn")));
    expect(await waitForElement(() => getByText("Error in Array Creation"))).toBeDefined();
  });

  it("should display error message in autocreate if metadisks are not available", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: [],
      })
      .onPost("/api/v1.0/create_arrays/")
      .reply(200, {})
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onPost("/api/v1/autoarray/")
      .reply(200, {
        result: { status: { code: 0 } },
      })
      .onAny()
      .reply(200, []);
    jest.setTimeout(30000);
    renderComponent();
    const { getByTestId, getByText, asFragment } = wrapper;
    fireEvent.click(getByText("create"));
    const autoCreateBtn = getByText("Auto-Create");
    const dev1 = await waitForElement(() => getByTestId("diskselect-0"));
    expect(dev1).toBeDefined();
    fireEvent.click(autoCreateBtn);
    fireEvent.click(await waitForElement(() => getByTestId("auto-createarray-btn")));
    expect(await waitForElement(() => getByText("Error in Array Creation"))).toBeDefined();
  });

  it("should show array id on hovering info icon", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\/array\/POSArray\/info*/)
      .reply(200, arrayInfo)
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onDelete(/api\/v1.0\/ibofos\/mount\/*/)
      .reply(400, {})
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onAny()
      .reply(200, []);

    jest.setTimeout(30000);
    renderComponent();

    global.document.createRange = (html) => ({
      setStart: () => { },
      setEnd: () => { },
      commonAncestorContainer: {
        nodeName: "BODY",
        ownerDocument: document,
      },
      createContextualFragment: (html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.children[0];
      },
    });
    const { getByTestId, getByText } = wrapper;
    const icon = await waitForElement(() => getByTestId("array-info-icon"));
    await act(async () => {
      fireEvent(
        icon,
        new MouseEvent("mouseover", {
          bubbles: true,
          cancelable: true,
        })
      );
      await waitForElement(() => getByTestId("array-id-text"))
      expect(getByText(/1495652515/)).toBeDefined();
    });
  });

  it("should show rebuild progress", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\/array\/POSArray\/info*/)
      .reply(200, arrayInfo)
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onDelete(/api\/v1.0\/ibofos\/mount\/*/)
      .reply(400, {})
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onAny()
      .reply(200, []);
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');
    renderComponent();
    const { getByTestId, getByText, asFragment } = wrapper;
    expect(setInterval).toHaveBeenCalledTimes(1);
    jest.runOnlyPendingTimers();
    expect(asFragment()).toMatchSnapshot();
    expect(await waitForElement(() => getByText("REBUILDING")));
    fireEvent.click(getByTestId("rebuild-popover-icon"));
  });

  it("should show 0 rebuild progress", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices,
      })
      .onGet(/api\/v1\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\/array\/POSArray\/info*/)
      .reply(200, {
        ...arrayInfo,
        result: {
          ...arrayInfo.result,
          data: {
            ...arrayInfo.result.data,
            "rebuilding_progress": 0
          }
        }
      })
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onDelete(/api\/v1.0\/ibofos\/mount\/*/)
      .reply(400, {})
      .onGet(/api\/v1\/get_array_config\/*/)
      .reply(200, config)
      .onAny()
      .reply(200, []);
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');
    renderComponent();
    const { getByTestId, getByText, asFragment } = wrapper;
    expect(setInterval).toHaveBeenCalledTimes(1);
    jest.runOnlyPendingTimers();
    expect(asFragment()).toMatchSnapshot();
    expect(await waitForElement(() => getByText("REBUILDING")));
    fireEvent.click(getByTestId("rebuild-popover-icon"));
  });

});
