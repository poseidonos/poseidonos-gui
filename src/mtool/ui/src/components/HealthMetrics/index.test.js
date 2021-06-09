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


DESCRIPTION: Health Metrics Test File
@NAME : index.test.js
@AUTHORS: Palak Kapoor 
@Version : 1.0 *
*/

jest.unmock("axios");

import React from "react";
import { Provider } from "react-redux";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { ReactDOM, findDOMNode } from "react-dom";
import { I18nextProvider } from "react-i18next";
import { combineReducers, createStore } from "redux";
import {
  render,
  cleanup,
  waitForElement,
} from "@testing-library/react";
import i18n from "../../i18n";
import HealthMetrics from "./index";

let wrapper;

let EVENTS = {};
function emit(event, ...args) {
  EVENTS[event].forEach((func) => func(...args));
}

const socket = {
  on(event, func) {
    if (EVENTS[event]) {
      return EVENTS[event].push(func);
    }
    EVENTS[event] = [func];
  },
  emit,
  io: {
    opts: {
      transports: [],
    },
  },
};

beforeEach(() => {
    jest.useFakeTimers();
  wrapper = render(
    <I18nextProvider i18n={i18n}>
      <HealthMetrics healthStatusSocket={socket} />
    </I18nextProvider>
  );
  jest.advanceTimersByTime(1000);
});

afterEach(cleanup);
test("should display health metrics as received from the websocket", async () => {
const { getByText } = wrapper;
  socket.emit("connect", {});
  socket.emit("health_status_response", {
    statuses: [
      {
        arcsArr: [0.4, 0.4, 0.2],
        id: "cpu_status",
        percentage: 0.55,
        value: "55",
        unit: "%",
        label: "CPU UTILIZATION",
      },
    ],
  });
  await waitForElement(() => getByText("CPU UTILIZATION"))
  socket.emit("reconnect_attempt", {});
});
