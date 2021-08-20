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
