/* eslint-disable import/imports-first */
/* eslint-disable import/first */

jest.unmock("axios");

import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
  wait,
} from "@testing-library/react";
import { createMemoryHistory } from "history";
import "@testing-library/jest-dom/extend-expect";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { act } from "react-dom/test-utils";
import Volume from "./index";
import storageReducer from "../../store/reducers/storageReducer";
import headerReducer from "../../store/reducers/headerReducer";
import configurationsettingReducer from "../../store/reducers/configurationsettingReducer";
import BMCAuthenticationReducer from "../../store/reducers/BMCAuthenticationReducer";
import rootSaga from "../../sagas/indexSaga";
import { async } from "q";

describe("<Storage Management />", () => {
  let wrapper;
  let mock;
  let history;
  let store;
  beforeEach(() => {
    const sagaMiddleware = createSagaMiddleware();
    const rootReducers = combineReducers({
      storageReducer,
      headerReducer,
      configurationsettingReducer,
      BMCAuthenticationReducer,
    });
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    store = createStore(
      rootReducers,
      composeEnhancers(applyMiddleware(sagaMiddleware))
    );
    sagaMiddleware.run(rootSaga);
    const route = "/volume";
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
    mock.onGet(/api\/v1.0\/get_arrays\/*/).reply(200, []);
    renderComponent();
    const { getByTestId } = wrapper;
    expect(getByTestId("title")).toHaveTextContent("Array Management");
  });

  const devices = [
    {
      name: "intel-unvmens-0",
      size: 390703446,
      mn: "SAMSUNG MZWLL1T6HAJQ-00005",
      sn: "S4C9NF0M500037",
    },
    {
      name: "intel-unvmens-1",
      size: 390703446,
      mn: "SAMSUNG MZWLL1T6HAJQ-00005",
      sn: "S4C9NF0M500027",
    },
    {
      name: "intel-unvmens-2",
      size: 390703446,
      mn: "SAMSUNG MZWLL1T6HAJQ-00005",
      sn: "S4C9NF0M500044",
    },
    {
      name: "intel-unvmens-3",
      size: 390703446,
      mn: "SAMSUNG MZWLL1T6HAJQ-00005",
      sn: "S4C9NF0M500031",
    },
    {
      name: "intel-unvmens-4",
      size: 390703446,
      mn: "SAMSUNG MZWLL1T6HAJQ-00005",
      sn: "S4C9NF0M500041",
    },
    {
      name: "intel-unvmens-5",
      size: 390703446,
      mn: "SAMSUNG MZWLL1T6HAJQ-00005",
      sn: "S4C9NF0M500042",
    },
  ];

  const array = {
    RAIDLevel: "5",
    _id: "ibofArray",
    metadiskpath: [
      {
        deviceName: "uram0",
      },
    ],
    sparedisks: [
      {
        deviceName: "intel-unvmens-3",
      },
    ],
    storagedisks: [
      {
        deviceName: "intel-unvmens-0",
      },
      {
        deviceName: "intel-unvmens-1",
      },
      {
        deviceName: "intel-unvmens-2",
      },
      {
        deviceName: "intel-unvmens-4",
      },
    ],
    totalsize: 6357625339904,
    usedspace: 0,
  };

  it("should render array created view", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onGet(/api\/v1.0\/max_volume_count\/*/)
      .reply(200, 256)
      .onGet(/api\/v1.0\/available_storage\/*/)
      .reply(200, [
        {
          arraySize: 10,
        },
      ])
      .onPost(/api\/v1.0\/delete_array\/*/)
      .reply(200, {})
      .onAny()
      .reply(200, []);
    renderComponent();
    const { getByTestId, asFragment } = wrapper;
    const resolvedThing = await waitForElement(() => getByTestId("arrayshow"));
    expect(resolvedThing).toBeDefined();
  });

  it("should render devices", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices: [
          { name: "intel-unvmens-0", size: 100 },
          { name: "intel-unvmens-1", size: 100 },
        ],
        metadevices: ["uram0", "uram1"],
      })
      .onAny()
      .reply(200, []);
    renderComponent();
    const { getByTestId } = wrapper;
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
        metadevices: ["uram0", "uram1"],
      })
      .onPost("/api/v1.0/create_arrays/")
      .reply(200, {})
      .onAny()
      .reply(200, []);
    renderComponent();
    const { getByTestId, getByText, getAllByText, asFragment } = wrapper;
    fireEvent.click(getByTestId("raid-select"));
    fireEvent.click(getByTestId("raid-select").querySelector("p"));
    const wb = await waitForElement(() => getByTestId("writebuffer-input"));
    fireEvent.change(wb, {
      target: { value: "uram0" },
    });
    fireEvent.click(getByTestId("disktype"));
    fireEvent.click(getAllByText("Storage Disk")[0]);
    const dev1 = await waitForElement(() => getByTestId("diskselect-0"));
    fireEvent.click(dev1);
    const dev2 = await waitForElement(() => getByTestId("diskselect-1"));
    fireEvent.click(dev2);
    const dev3 = await waitForElement(() => getByTestId("diskselect-2"));
    fireEvent.click(dev3);
    fireEvent.change(getByTestId("disktype-input"), {
      target: { value: "Spare Disk" },
    });
    const dev4 = await waitForElement(() => getByTestId("diskselect-3"));
    fireEvent.click(dev4);
    fireEvent.click(getByTestId("createarray-btn"));
    const success = await waitForElement(() => getByTestId("alertDescription"));
    expect(success).toBeDefined();
    fireEvent.click(getByText("OK"));
  });

  it("should not create array if devices are not selected", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: ["uram0", "uram1"],
      })
      .onPost("/api/v1.0/create_arrays/")
      .reply(200, {})
      .onAny()
      .reply(200, []);
    renderComponent();
    const getSpy = jest.spyOn(axios, "post");
    const { getByTestId, getByText, getAllByText, queryByText } = wrapper;
    const raidSelect = await waitForElement(() =>
      getByTestId("raid-select-input")
    );
    fireEvent.change(raidSelect, { target: { value: "5" } });
    fireEvent.change(getByTestId("writebuffer-input"), {
      target: { value: "uram0" },
    });
    fireEvent.click(getByTestId("disktype"));
    fireEvent.click(getAllByText("Storage Disk")[0]);
    fireEvent.click(getByTestId("createarray-btn"));
    expect(queryByText(/Select at least/i)).toBeDefined();
  });

  it("should not create array if spare devices are not selected", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: ["uram0", "uram1"],
      })
      .onPost("/api/v1.0/create_arrays/")
      .reply(200, {})
      .onAny()
      .reply(200, []);
    renderComponent();
    const getSpy = jest.spyOn(axios, "post");
    const { getByTestId, getByText, getAllByText, queryByText } = wrapper;
    const raidSelect = await waitForElement(() =>
      getByTestId("raid-select-input")
    );
    fireEvent.change(raidSelect, { target: { value: "5" } });
    fireEvent.change(getByTestId("writebuffer-input"), {
      target: { value: "uram0" },
    });
    fireEvent.click(getByTestId("disktype"));
    fireEvent.click(getAllByText("Storage Disk")[0]);
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

  it("should not create array if meta disk is not selected", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: ["uram0", "uram1"],
      })
      .onPost("/api/v1.0/create_arrays/")
      .reply(200, {})
      .onAny()
      .reply(200, []);
    renderComponent();
    const getSpy = jest.spyOn(axios, "post");
    const { getByTestId, getByText, getAllByText, queryByText } = wrapper;
    const raidSelect = await waitForElement(() =>
      getByTestId("raid-select-input")
    );
    fireEvent.change(raidSelect, { target: { value: "5" } });
    fireEvent.click(getByTestId("disktype"));
    fireEvent.click(getAllByText("Storage Disk")[0]);
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
    fireEvent.change(getByTestId("disktype-input"), {
      target: { value: "Spare Disk" },
    });
    fireEvent.click(dev2);
    fireEvent.click(getByTestId("createarray-btn"));
    expect(queryByText(/Select a Write Buffer/i)).toBeDefined();
  });

  it("should create an array with selected devices", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: ["uram0", "uram1"],
      })
      .onPost("/api/v1.0/create_arrays/")
      .reply(200, {})
      .onAny()
      .reply(200, []);
    renderComponent();
    jest.setTimeout(30000);
    const getSpy = jest.spyOn(axios, "post");
    const {
      getByTestId,
      getByText,
      getAllByText,
      getByDisplayValue,
      asFragment,
    } = wrapper;
    const raidSelect = await waitForElement(() =>
      getByTestId("raid-select-input")
    );
    fireEvent.change(raidSelect, { target: { value: "5" } });
    const wb = await waitForElement(() => getByTestId("writebuffer"));
    wb.value = "uram0";
    fireEvent.change(wb);
    fireEvent.click(wb);
    fireEvent.click(await waitForElement(() => getAllByText("uram0")[0]));
    fireEvent.click(getByTestId("disktype"));
    fireEvent.click(getAllByText("Storage Disk")[0]);
    const dev1 = await waitForElement(() => getByTestId("diskselect-0"));
    fireEvent.click(dev1);
    const dev2 = await waitForElement(() => getByTestId("diskselect-1"));
    fireEvent.click(dev2);
    const dev3 = await waitForElement(() => getByTestId("diskselect-2"));
    fireEvent.click(dev3);
    fireEvent.click(dev2);
    const dev4 = await waitForElement(() => getByTestId("diskselect-3"));
    fireEvent.click(dev4);
    //fireEvent.click(getByTestId('disktype'));
    const disktype = await waitForElement(() => getByTestId("disktype"));
    disktype.value = "Spare Disk";
    fireEvent.change(disktype);
    fireEvent.click(getByTestId("disktype"));
    fireEvent.click(getAllByText("Spare Disk")[0]);
    fireEvent.click(await waitForElement(() => getByTestId("diskselect-1")));
    fireEvent.click(getByTestId("createarray-btn"));
    expect(getSpy).toHaveBeenCalledWith(
      "/api/v1.0/create_arrays/",
      {
        size: 1172110338,
        arrayname: "POSArray",
        raidtype: "raid5",
        storageDisks: [
          { deviceName: "intel-unvmens-0" },
          { deviceName: "intel-unvmens-2" },
          { deviceName: "intel-unvmens-3" },
        ],
        spareDisks: [
          {
            deviceName: "intel-unvmens-1",
          },
        ],
        writeBufferDisk: [],
        metaDisk: "uram0",
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

  it("should add a spare disk", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onGet(/api\/v1.0\/available_storage\/*/)
      .reply(200, [
        {
          arraySize: 10,
        },
      ])
      .onPost(/api\/v1.0\/delete_array\/*/)
      .reply(200, {})
      .onAny()
      .reply(200, []);
    const getSpy = jest.spyOn(axios, "post");
    renderComponent();
    const { getByTestId } = wrapper;
    const attachButton = await waitForElement(() =>
      getByTestId("attachdisk-5")
    );
    fireEvent.click(attachButton);
    fireEvent.click(await waitForElement(() => getByTestId("alertbox-yes")));
    expect(getSpy).toHaveBeenCalledWith(
      "/api/v1.0/add_spare_device/",
      {
        name: "intel-unvmens-5",
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

  it("should remove a spare disk", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onGet(/api\/v1.0\/available_storage\/*/)
      .reply(200, [
        {
          arraySize: 10,
        },
      ])
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
        name: "intel-unvmens-3",
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

  it("should delete the array", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onGet(/api\/v1.0\/available_storage\/*/)
      .reply(200, [
        {
          arraySize: 10,
        },
      ])
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

  it("should create a volume", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onGet(/api\/v1.0\/available_storage\/*/)
      .reply(200, [{ arraySize: 2821793513472, usedSpace: 2821786173440 }])
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
    fireEvent.change(volSize, { target: { value: "10" } });
    const volUnit = await waitForElement(() =>
      getByTestId("volume-unit-input")
    );
    fireEvent.click(volUnit);
    fireEvent.change(volUnit, { target: { value: "TB" } });
    //fireEvent.click(await waitForElement(() => getByText('TB')));
    const volBW = await waitForElement(() => getByTestId("create-vol-max-bw"));
    fireEvent.change(volBW, { target: { value: "10" } });
    const volIOPS = await waitForElement(() =>
      getByTestId("create-vol-max-iops")
    );
    fireEvent.change(volIOPS, { target: { value: "10" } });
    const createVolButton = await waitForElement(() =>
      getByTestId("createvolume-btn")
    );
    fireEvent.click(createVolButton);
    expect(getAllByTitle(/Creation is in progress/)).toBeDefined();
  });

  it("should throw error if creating volume is not possible because of wrong values", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\.0\/available_storage\/\?ts=*/)
      .reply(200, [
        {
          arraySize: 20,
        },
      ])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes$/)
      .reply(200, {
        Members: [
          {
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
          },
        ],
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10,
          },
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted",
          },
        },
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10,
          },
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted",
          },
        },
      })
      .onGet(/api\/v1.0\/max_volume_count\/*/)
      .reply(200, 256)
      .onAny()
      .reply(200, []);

    renderComponent();
    const { getByTestId, getByLabelText, getByText, asFragment } = wrapper;
    const volCount = await waitForElement(() =>
      getByTestId("create-vol-count")
    );
    fireEvent.change(volCount, { target: { value: 1 } });
    const volName = await waitForElement(() => getByTestId("create-vol-name"));
    fireEvent.change(volName, { target: { value: "" } });
    const createVolButton = await waitForElement(() =>
      getByTestId("createvolume-btn")
    );
    fireEvent.click(createVolButton);
    expect(
      await waitForElement(() => getByText("Please Enter Volume Name"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
    fireEvent.change(volName, { target: { value: "vol1" } });
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
    fireEvent.change(volSize, { target: { value: 2 } });
    // fireEvent.change(volCount, { target: { value: '-1' } });
    // fireEvent.click(createVolButton);
    // expect(asFragment()).toMatchSnapshot();
    // expect(await waitForElement(() => getByText('Volume Count Should be greater than 0'))).toBeDefined();
    // fireEvent.click(await waitForElement(() => getByText('OK')));
    // fireEvent.change(volCount, { target: { value: '1000' } });
    // fireEvent.click(createVolButton);
    // expect(await waitForElement(() => getByText('Volume Count should not exceed 256'))).toBeDefined();
    // fireEvent.click(await waitForElement(() => getByText('OK')));
    // fireEvent.change(volCount, { target: { value: 2 } });
    // const volSuffix = await waitForElement(() => getByTestId('create-vol-suffix'));
    // fireEvent.change(volSuffix, { target: { value: -1 } });
    // fireEvent.click(createVolButton);
    // expect(await waitForElement(() => getByText('Suffix Value cannot be negative'))).toBeDefined();
    // fireEvent.click(await waitForElement(() => getByText('OK')));
    // fireEvent.change(volSuffix, { target: { value:null } });
    // fireEvent.click(createVolButton);
    // expect(await waitForElement(() => getByText('Please Enter Suffix Start Value'))).toBeDefined();
    // fireEvent.click(await waitForElement(() => getByText('OK')));
    const volMaxIOPS = await waitForElement(() =>
      getByTestId("create-vol-max-iops")
    );
    fireEvent.change(volMaxIOPS, { target: { value: 5 } });
    fireEvent.click(createVolButton);
    expect(
      await waitForElement(() => getByText("Invalid value for Maximum IOPS"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
  });

  it("should throw error if creating volume is not possible because of missing volume count", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\.0\/available_storage\/\?ts=*/)
      .reply(200, [
        {
          arraySize: 20,
        },
      ])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes$/)
      .reply(200, {
        Members: [
          {
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
          },
        ],
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10,
          },
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted",
          },
        },
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10,
          },
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted",
          },
        },
      })
      .onAny()
      .reply(200, []);

    jest.setTimeout(30000);
    renderComponent();
    const { getByTestId, getByLabelText, getByText, asFragment } = wrapper;
    await waitForElement(() => getByTestId("vol-edit-btn-vol2"));
    const volCount = await waitForElement(() =>
      getByTestId("create-vol-count")
    );
    fireEvent.change(volCount, { target: { value: "" } });
    const createVolButton = await waitForElement(() =>
      getByTestId("createvolume-btn")
    );
    fireEvent.click(createVolButton);
    expect(
      await waitForElement(() => getByText("Please Enter Volume Count"))
    ).toBeDefined();
    fireEvent.click(await waitForElement(() => getByText("OK")));
  });

  it("should select and delete a volume", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\.0\/available_storage\/\?ts=*/)
      .reply(200, [
        {
          arraySize: 20,
        },
      ])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes$/)
      .reply(200, {
        Members: [
          {
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
          },
        ],
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10,
          },
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted",
          },
        },
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10,
          },
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted",
          },
        },
      })
      .onAny()
      .reply(200, []);

    jest.setTimeout(30000);
    renderComponent();
    const { getByText, getByTitle, asFragment } = wrapper;
    const checkBox2 = await waitForElement(() => getByTitle("vol2"));
    fireEvent.click(checkBox2);
    const deleteBtn = await waitForElement(() => getByTitle("Delete"));
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
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\.0\/available_storage\/\?ts=*/)
      .reply(200, [
        {
          arraySize: 20,
        },
      ])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes$/)
      .reply(200, {
        Members: [
          {
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
          },
        ],
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10,
          },
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
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
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10,
          },
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Unmounted",
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
    const { getByText, getByTitle, getByTestId, asFragment } = wrapper;
    const mountBtn = await waitForElement(() =>
      getByTestId("vol-mount-btn-vol2")
    );
    fireEvent.click(mountBtn);
    expect(getSpy).toHaveBeenCalledWith(
      "/api/v1.0/volume/mount",
      {
        name: "vol2",
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

  it("should unmount a volume", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\.0\/available_storage\/\?ts=*/)
      .reply(200, [
        {
          arraySize: 20,
        },
      ])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes$/)
      .reply(200, {
        Members: [
          {
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
          },
        ],
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10,
          },
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted",
          },
        },
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10,
          },
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted",
          },
        },
      })
      .onDelete(/api\/volume\/mount/)
      .reply(200, {
        result: {
          status: {
            code: 0,
            description: "Success",
          },
        },
      })
      .onAny()
      .reply(200, []);
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

  it("should throw error if a volume cannot be mounted", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\.0\/available_storage\/\?ts=*/)
      .reply(200, [
        {
          arraySize: 20,
        },
      ])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes$/)
      .reply(200, {
        Members: [
          {
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
          },
        ],
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10,
          },
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted",
          },
        },
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10,
          },
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted",
          },
        },
      })
      .onAny()
      .reply(200, []);
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
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\.0\/available_storage\/\?ts=*/)
      .reply(200, [
        {
          arraySize: 20,
        },
      ])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes$/)
      .reply(200, {
        Members: [
          {
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
          },
        ],
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10,
          },
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted",
          },
        },
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10,
          },
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted",
          },
        },
      })
      .onPut("/api/v1.0/update-volume/")
      .reply(200, {
        result: {
          status: {
            code: 0,
            description: "Success",
          },
        },
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
    const saveTxt = await waitForElement(() => getByText("Updating Volume"));
    expect(saveTxt).toBeDefined();
  });

  it("should show error mesasage if invalid value is given to maxiops", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\.0\/available_storage\/\?ts=*/)
      .reply(200, [
        {
          arraySize: 20,
        },
      ])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes$/)
      .reply(200, {
        Members: [
          {
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
          },
        ],
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10,
          },
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted",
          },
        },
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10,
          },
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted",
          },
        },
      })
      .onPut("/api/v1.0/update-volume/")
      .reply(200, {
        result: {
          status: {
            code: 0,
            description: "Success",
          },
        },
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
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\.0\/available_storage\/\?ts=*/)
      .reply(200, [
        {
          arraySize: 20,
        },
      ])
      .onPost("/api/v1.0/save-volume/")
      .reply(200, {})
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes$/)
      .reply(200, {
        Members: [
          {
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/0",
            "@odata.id": "/redfish/v1/StorageServices/1/Volumes/1",
          },
        ],
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/0$/)
      .reply(200, {
        Name: "vol1",
        Id: "0",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10,
          },
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted",
          },
        },
      })
      .onGet(/redfish\/v1\/StorageServices\/1\/Volumes\/1$/)
      .reply(200, {
        Name: "vol2",
        Id: "1",
        Capacity: {
          Data: {
            AllocatedBytes: 100,
            ConsumedBytes: 10,
          },
        },
        Oem: {
          MaxIOPS: 10,
          MaxBW: 10,
        },
        Status: {
          Oem: {
            VolumeStatus: "Mounted",
          },
        },
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

  it("should show device details when array is created", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\.0\/available_storage\/\?ts=*/)
      .reply(200, [
        {
          arraySize: 20,
        },
      ])
      .onAny()
      .reply(200, []);
    renderComponent();
    const { getByTestId, asFragment, getByText } = wrapper;
    global.document.createRange = (html) => ({
      setStart: () => {},
      setEnd: () => {},
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
      fireEvent.click(getByTestId("diskdetails-close"));
    });
  });

  it("should show device details when array is not created", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: ["uram0", "uram1"],
      })
      .onAny()
      .reply(200, []);
    renderComponent();
    const { getByTestId, queryByTestId, getByText } = wrapper;
    global.document.createRange = (html) => ({
      setStart: () => {},
      setEnd: () => {},
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
    await waitForElement(() => getByTestId("arraycreate"));
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
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1\.0\/available_storage\/\?ts=*/)
      .reply(200, [
        {
          arraySize: 20,
        },
      ])
      .onAny()
      .reply(200, []);
    renderComponent();
    const { getByTestId, asFragment, getByText } = wrapper;
    fireEvent.click(await waitForElement(() => getByText("Delete Array")));
    fireEvent.click(await waitForElement(() => getByText("No")));
  });

  it("should display the storage page with path", async () => {
    const { location } = window;
    delete window.location;
    window.location = { ...location, href: "http://localhost/volume" };
    renderComponent();
    const { getByText } = wrapper;
    expect(
      await waitForElement(() => getByText("Array Management"))
    ).toBeDefined();
    window.location = location;
  });

  it("should create a volume when vol size is max and count is greater than 1", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onGet(/api\/v1.0\/available_storage\/*/)
      .reply(200, [{ arraySize: 2821793513472, usedSpace: 2821786173440 }])
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
    //fireEvent.change(volUnit, { target: { value: "TB" } });
    fireEvent.click(getByTestId("tb"));
    //fireEvent.click(await waitForElement(() => getByText('TB')));
    const volBW = await waitForElement(() => getByTestId("create-vol-max-bw"));
    fireEvent.change(volBW, { target: { value: "10" } });
    const volIOPS = await waitForElement(() =>
      getByTestId("create-vol-max-iops")
    );
    fireEvent.change(volIOPS, { target: { value: "10" } });
    const createVolButton = await waitForElement(() =>
      getByTestId("createvolume-btn")
    );
    fireEvent.click(createVolButton);
    const alertDescription = await waitForElement(() =>
      getByTestId("alertDescription")
    );
    fireEvent.click(getByText("Yes"));
    //expect(getAllByTitle(/Creation is in progress/)).toBeDefined();
  });

  it("should unmount the array", async () => {
    mock
      .onGet(/api\/v1.0\/get_devices\/*/)
      .reply(200, {
        devices,
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onGet(/api\/v1.0\/available_storage\/*/)
      .reply(200, [
        {
          arraySize: 10,
          mountStatus: "NORMAL",
        },
      ])
      .onDelete(/api\/v1.0\/ibofos\/mount\/*/)
      .reply(200, {result: {status:{code :0}}})
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
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onGet(/api\/v1.0\/available_storage\/*/)
      .reply(200, [
        {
          arraySize: 10,
          mountStatus: "OFFLINE",
        },
      ])
      .onPost(/api\/v1.0\/ibofos\/mount\/*/)
      .reply(200, {result:{status:{code:0}}})
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
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onGet(/api\/v1.0\/available_storage\/*/)
      .reply(200, [
        {
          arraySize: 10,
          mountStatus: "NORMAL",
        },
      ])
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
        metadevices: ["uram0"],
      })
      .onGet(/api\/v1.0\/get_arrays\/*/)
      .reply(200, [array])
      .onGet(/api\/v1.0\/get_volumes\/*/)
      .reply(200, [])
      .onGet(/api\/v1.0\/available_storage\/*/)
      .reply(200, [
        {
          arraySize: 10,
          mountStatus: "OFFLINE",
        },
      ])
      .onPost(/api\/v1.0\/ibofos\/mount\/*/)
      .reply(400, {})
      .onAny()
      .reply(200, []);
    renderComponent();
    const { getByText } = wrapper;
    const mountButton = await waitForElement(() =>
      getByText("Mount Array")
    );
    fireEvent.click(mountButton);
  });
});
