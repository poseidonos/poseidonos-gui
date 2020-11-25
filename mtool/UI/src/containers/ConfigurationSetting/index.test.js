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


DESCRIPTION: Configuration Setting Container Test File
@NAME : index.test.js
@AUTHORS: Palak Kapoor
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Palak] : Prototyping..........////////////////////
*/

import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "@testing-library/react";
import { Provider } from "react-redux";
import { act } from "react-dom/test-utils";
import { I18nextProvider } from "react-i18next";
import axios from "axios";
import "@testing-library/jest-dom/extend-expect";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../../sagas/indexSaga";
import headerReducer from "../../store/reducers/headerReducer";
import configurationsettingReducer from "../../store/reducers/configurationsettingReducer";
import alertManagementReducer from "../../store/reducers/alertManagementReducer";
import BMCAuthenticationReducer from "../../store/reducers/BMCAuthenticationReducer";
import ConfigurationSetting from "./index";
import i18n from "../../i18n";

jest.unmock("axios");

describe("ConfigurationSetting", () => {
  let wrapper;
  let history;
  let store;
  // let mock;
  beforeEach(() => {
    const sagaMiddleware = createSagaMiddleware();
    const rootReducers = combineReducers({
      // headerLanguageReducer,
      alertManagementReducer,
      headerReducer,
      configurationsettingReducer,
      BMCAuthenticationReducer
    });
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    store = createStore(
      rootReducers,
      composeEnhancers(applyMiddleware(sagaMiddleware))
    );
    sagaMiddleware.run(rootSaga);
    const route = "/ConfigurationSetting/general";
    history = createMemoryHistory({ initialEntries: [route] });
    // mock = new MockAdapter(axios);
  });

  const renderComponent = () => {
    wrapper = render(
      <Router history={history}>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            {" "}
            <ConfigurationSetting />
          </Provider>
        </I18nextProvider>
      </Router>
    );
  };

  afterEach(cleanup);

  it("matches snapshot", () => {
    const mock = new MockAdapter(axios);
    mock.onGet("/api/v1.0/get_email_ids/").reply(200, [
      {
        active: 1,
        edit: false,
        email: "palak.k@samsung.com",
        selected: false
      }
    ]);

    renderComponent();
    const { asFragment } = wrapper;
    expect(asFragment()).toMatchSnapshot();
  });

  it("throws error on providing invalid smtp server details", async () => {
    renderComponent();
    const { getByTestId, getByText } = wrapper;
    const smtpServerField = getByTestId("smtpServerField").querySelector(
      "input"
    );
    fireEvent.change(smtpServerField, {
      target: { value: "smtp.samsung.net:25" }
    });
    expect(smtpServerField.value).toBe("smtp.samsung.net:25");
    const mock = new MockAdapter(axios);
    mock.onPost().reply(500);
    fireEvent.click(getByTestId("applyButton"));
    const alertDescription = await waitForElement(() =>
      getByTestId("alertDescription")
    );
    expect(alertDescription.innerHTML).toBe("SMTP server is not working");
    fireEvent.click(getByText("OK"));
  });

  it("deletes configured smtp server", async () => {
    const mock = new MockAdapter(axios);
    mock
    .onGet(/api\/v1.0\/get_smtp_details\/*/)
    .reply(200, 
      {
        smtpserverip: 'smtp.samsung.net',
        smtpserverport: '25'
      },
    )
    .onPost(/api\/v1.0\/test_smtpserver\/*/)
    .reply(200, {})
    .onPost(/api\/v1.0\/delete_smtp_details\/*/)
    .reply(200, {})
    .onAny()
    .reply(200, []);
    renderComponent();
    const { getByTestId } = wrapper;
    const smtpServerField = getByTestId("smtpServerField").querySelector(
      "input"
    );
    fireEvent.change(smtpServerField, {
      target: { value: "smtp.samsung.net:25" }
    });
    expect(smtpServerField.value).toBe("smtp.samsung.net:25");
    const smtpFromEmail = getByTestId("smtpFromEmail").querySelector(
      "input"
    );
    fireEvent.change(smtpFromEmail, {
      target: { value: "MTool@samsung.com" }
    });
    const smtpUsername = getByTestId("smtpUsername").querySelector(
      "input"
    );
    fireEvent.change(smtpUsername, {
      target: { value: "palak.k" }
    });
    const smtpPassword = getByTestId("smtpPassword").querySelector(
      "input"
    );
    fireEvent.change(smtpPassword, {
      target: { value: "abc" }
    });
    
    //const mock = new MockAdapter(axios);
    //mock.onPost().reply(200);
    fireEvent.click(getByTestId("applyButton"));
    let alertDescription = await waitForElement(() =>
      getByTestId("alertDescription")
    );
    expect(alertDescription.innerHTML).toBe("SMTP server is working");
    const readOnlyField = getByTestId("readOnlyField").querySelector("input");
    expect(readOnlyField.value).toBe("smtp.samsung.net:25");
    fireEvent.click(getByTestId("deleteButton"));
   
    alertDescription = await waitForElement(() =>
      getByTestId("alertDescription")
    );
    expect(alertDescription.innerHTML).toBe("SMTP Configuration Deleted Successfully");
    expect(readOnlyField.value).toBe("");
  });

  it("should delete one entry in the email list table", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet("/api/v1.0/get_email_ids/").reply(200, [
      {
        active: 1,
        edit: false,
        email: "palak.k@samsung.com",
        selected: false
      },
      {
        active: 1,
        edit: false,
        email: "palak.kapoor1@gmail.com",
        selected: false
      }
    ]);
    renderComponent();
    const { getByTestId, getByText, getAllByTitle } = wrapper;
    const deleteElement = await waitForElement(
      () => getAllByTitle("Delete")[0]
    );
    fireEvent.click(deleteElement);
    const alertDescription = await waitForElement(() =>
      getByTestId("alertDescription")
    );
    const spy = jest.spyOn(axios, "post");
    expect(alertDescription.innerHTML).toBe(
      "Are you sure you want to Delete the email?"
    );
    mock.onPost().reply(200);
    fireEvent.click(getByText("Yes"));
    expect(spy).toHaveBeenCalledWith(
      "/api/v1.0/delete_emailids/",
      { ids: ["palak.k@samsung.com"] },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": null
        }
      }
    );
  });

  it("should delete one entry in the email list table which is inactive", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet("/api/v1.0/get_email_ids/").reply(200, [
      {
        active: 0,
        edit: false,
        email: "palak.k@samsung.com",
        selected: false
      },
      {
        active: 1,
        edit: false,
        email: "palak.kapoor1@gmail.com",
        selected: false
      }
    ]);
    renderComponent();
    const { getByTestId, getByText, getAllByTitle } = wrapper;
    const deleteElement = await waitForElement(
      () => getAllByTitle("Delete")[0]
    );
    fireEvent.click(deleteElement);
    const alertDescription = await waitForElement(() =>
      getByTestId("alertDescription")
    );
    const spy = jest.spyOn(axios, "post");
    expect(alertDescription.innerHTML).toBe(
      "Are you sure you want to Delete the email?"
    );
    mock.onPost().reply(200);
    fireEvent.click(getByText("Yes"));
    expect(spy).toHaveBeenCalledWith(
      "/api/v1.0/delete_emailids/",
      { ids: ["palak.k@samsung.com"] },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": null
        }
      }
    );
  });

  it("configures valid smtp server details and send a test email to a user", async () => {
    const mock = new MockAdapter(axios);
    mock
    .onGet(/api\/v1.0\/get_smtp_details\/*/)
    .reply(200, 
      {
        smtpserverip: 'smtp.samsung.net',
        smtpserverport: '25'
      },
    )
    .onPost(/api\/v1.0\/test_smtpserver\/*/)
    .reply(200, {})
    .onPost(/api\/v1.0\/delete_smtp_details\/*/)
    .reply(200, {})
    .onGet("/api/v1.0/get_email_ids/").reply(200, [
      {
        active: 1,
        edit: false,
        email: "palak.k@samsung.com",
        selected: true
      }
    ])
    .onAny()
    .reply(200, []);
    // const mock = new MockAdapter(axios);
    // mock.onGet("/api/v1.0/get_email_ids/").reply(200, [
    //   {
    //     active: 1,
    //     edit: false,
    //     email: "palak.k@samsung.com",
    //     selected: true
    //   }
    // ]);
    renderComponent();
    const { getByTestId, getByText, getByTitle } = wrapper;
    const smtpServerField = getByTestId("smtpServerField").querySelector(
      "input"
    );
    fireEvent.change(smtpServerField, {
      target: { value: "smtp.samsung.net:25" }
    });
    expect(smtpServerField.value).toBe("smtp.samsung.net:25");
    const smtpFromEmail = getByTestId("smtpFromEmail").querySelector(
      "input"
    );
    fireEvent.change(smtpFromEmail, {
      target: { value: "MTool@samsung.com" }
    });
    const smtpUsername = getByTestId("smtpUsername").querySelector(
      "input"
    );
    fireEvent.change(smtpUsername, {
      target: { value: "palak.k" }
    });
    const smtpPassword = getByTestId("smtpPassword").querySelector(
      "input"
    );
    fireEvent.change(smtpPassword, {
      target: { value: "abc" }
    });
    //mock.onPost().reply(200);
    fireEvent.click(getByTestId("applyButton"));
    const alertDescription = await waitForElement(() =>
      getByTestId("alertDescription")
    );
    expect(alertDescription.innerHTML).toBe("SMTP server is working");
    const readOnlyField = getByTestId("readOnlyField").querySelector("input");
    expect(readOnlyField.value).toBe("smtp.samsung.net:25");
    fireEvent.click(getByText("OK"));
/*
    const testEmailElement = await waitForElement(() =>
      getByTitle("Test Email")
    );
    fireEvent.click(testEmailElement);
    const errorDescription = await waitForElement(() =>
      getByTestId("alertDescription")
    );
    expect(errorDescription.innerHTML).toBe("Email sent successfully");
    fireEvent.click(getByTestId("alertCloseButton"));
*/
  });

  it("toggles the active status of the entry in the email list table", async () => {
    const mock = new MockAdapter(axios);
    mock
    .onGet("/api/v1.0/get_email_ids/").reply(200, [
      {
        active: 0,
        edit: false,
        email: "palak.k@samsung.com",
        selected: false
      }
    ])
    .onGet(/api\/v1.0\/get_smtp_details\/*/)
    .reply(200, 
      {
        smtpserverip: 'smtp.samsung.net',
        smtpserverport: '25'
      },
    );
    renderComponent();
    const { getByTestId, getByText, getByTitle } = wrapper;
    const smtpServerField = getByTestId("smtpServerField").querySelector(
      "input"
    );
    fireEvent.change(smtpServerField, {
      target: { value: "smtp.samsung.net:25" }
    });
    expect(smtpServerField.value).toBe("smtp.samsung.net:25");
    const smtpFromEmail = getByTestId("smtpFromEmail").querySelector(
      "input"
    );
    fireEvent.change(smtpFromEmail, {
      target: { value: "MTool@samsung.com" }
    });
    const smtpUsername = getByTestId("smtpUsername").querySelector(
      "input"
    );
    fireEvent.change(smtpUsername, {
      target: { value: "palak.k" }
    });
    const smtpPassword = getByTestId("smtpPassword").querySelector(
      "input"
    );
    fireEvent.change(smtpPassword, {
      target: { value: "abc" }
    });
    mock.onPost().reply(200);
    fireEvent.click(getByTestId("applyButton"));
    const alertDescription = await waitForElement(() =>
      getByTestId("alertDescription")
    );
    expect(alertDescription.innerHTML).toBe("SMTP server is working");
    const readOnlyField = getByTestId("readOnlyField").querySelector("input");
    expect(readOnlyField.value).toBe("smtp.samsung.net:25");
    fireEvent.click(getByText("OK"));
    const toggleButton = await waitForElement(() =>
      getByTestId("toggleButton")
    );
    const spy = jest.spyOn(axios, "post");
    fireEvent.click(toggleButton);
    expect(spy).toHaveBeenCalledWith(
      "/api/v1.0/toggle_email_status/",
      { emailid: "palak.k@samsung.com", status: true },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": null
        }
      }
    );
/*
    const testEmailElement = await waitForElement(() =>
      getByTitle("Test Email")
    );
    fireEvent.click(testEmailElement);
    const errorDescription = await waitForElement(() =>
      getByTestId("alertDescription")
    );
    expect(errorDescription.innerHTML).toBe(
      "Please select an email id to send"
    );
*/
  });
/*
  it("throws error while trying to send an email when smtp server is not configured", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet("/api/v1.0/get_email_ids/").reply(200, [
      {
        active: 1,
        edit: false,
        email: "palak.k@samsung.com",
        selected: false
      }
    ]);
    renderComponent();
    const { getByTestId, getByTitle } = wrapper;
    const testEmailElement = await waitForElement(() =>
      getByTitle("Test Email")
    );
    fireEvent.click(testEmailElement);
    const errorDescription = await waitForElement(() =>
      getByTestId("alertDescription")
    );
    expect(errorDescription.innerHTML).toBe("Please configure smtp server");
  });
*/
  it("throws an error if a duplicate entry is added in the email list", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet("/api/v1.0/get_email_ids/").reply(200, [
      {
        active: 1,
        edit: false,
        email: "palak.k@samsung.com",
        selected: false
      }
    ]);
    renderComponent();

    const {
      asFragment,
      getByTitle,
      getByPlaceholderText,
      getByTestId
    } = wrapper;
    const addElement = getByTitle("Add");
    fireEvent.click(addElement);
    await act(async () => {
      const saveElement = await waitForElement(() => getByTitle("Save"));
      expect(asFragment()).toMatchSnapshot();
      const inputNode = getByPlaceholderText("Email ID");
      fireEvent.change(inputNode, {
        target: { value: "palak.k@samsung.com" }
      });
      fireEvent.click(saveElement);

      const alertDescription = await waitForElement(() =>
        getByTestId("alertDescription")
      );
      expect(alertDescription.innerHTML).toBe("This email id exists");
    });
  });

  it("throws an error if a blank entry is added to the email list", async () => {
    renderComponent();
    const { asFragment, getByTitle, getByTestId } = wrapper;
    const addElement = getByTitle("Add");
    fireEvent.click(addElement);
    // await act(async () => {
    const saveElement = await waitForElement(() => getByTitle("Save"));
    expect(asFragment()).toMatchSnapshot();
    fireEvent.click(saveElement);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const alertDescription = await waitForElement(() =>
      getByTestId("alertDescription")
    );
    expect(alertDescription.innerHTML).toBe("Please enter a valid email id");
    // });
  });

  it("edits an email entry in the email list", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet("/api/v1.0/get_email_ids/").reply(200, [
      {
        active: 1,
        edit: false,
        email: "palak.k@samsung.com",
        selected: false
      }
    ]);
    renderComponent();
    const { asFragment, getByTitle, getByPlaceholderText } = wrapper;

    await act(async () => {
      const editElement = await waitForElement(() => getByTitle("Edit"));
      fireEvent.click(editElement);
      expect(asFragment()).toMatchSnapshot();
      const saveElement = await waitForElement(() => getByTitle("Save"));
      const inputNode = getByPlaceholderText("Email ID");
      fireEvent.change(inputNode, {
        target: { value: "palak.k1@samsung.com" }
      });
      const spy = jest.spyOn(axios, "post");
      fireEvent.click(saveElement);
      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(spy).toHaveBeenCalledWith(
        "/api/v1.0/update_email/",
        {
          active: 1,
          edit: false,
          email: "palak.k1@samsung.com",
          oldid: "palak.k@samsung.com",
          selected: false
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": null
          }
        }
      );
    });
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

  it("adds a new entry to the email list", async () => {
    renderComponent();
    const { asFragment, getByTitle, getByPlaceholderText } = wrapper;
    const addElement = getByTitle("Add");
    fireEvent.click(addElement);
    await act(async () => {
      const saveElement = await waitForElement(() => getByTitle("Save"));
      expect(asFragment()).toMatchSnapshot();
      const inputNode = getByPlaceholderText("Email ID");
      fireEvent.change(inputNode, {
        target: { value: "palak@samsung.com" }
      });
      const spy = jest.spyOn(axios, "post");
      const mock = new MockAdapter(axios);
      mock.onPost("/api/v1.0/update_email/").reply(200);
      fireEvent.click(saveElement);
      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(spy).toHaveBeenCalledWith(
        "/api/v1.0/update_email/",
        { email: "palak@samsung.com", oldid: "palak@samsung.com" },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": null
          }
        }
      );
    });
  });

  it("toggle api throws error if failed", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet("/api/v1.0/get_email_ids/").reply(200, [
      {
        active: 0,
        edit: false,
        email: "palak.k@samsung.com",
        selected: false
      }
    ])
    .onGet(/api\/v1.0\/get_smtp_details\/*/)
    .reply(200, 
      {
        smtpserverip: 'smtp.samsung.net',
        smtpserverport: '25'
      },
    );
    renderComponent();
    const { getByTestId, getByText } = wrapper;
    const smtpServerField = getByTestId("smtpServerField").querySelector(
      "input"
    );
    fireEvent.change(smtpServerField, {
      target: { value: "smtp.samsung.net:25" }
    });
    expect(smtpServerField.value).toBe("smtp.samsung.net:25");
    const smtpFromEmail = getByTestId("smtpFromEmail").querySelector(
      "input"
    );
    fireEvent.change(smtpFromEmail, {
      target: { value: "MTool@samsung.com" }
    });
    const smtpUsername = getByTestId("smtpUsername").querySelector(
      "input"
    );
    fireEvent.change(smtpUsername, {
      target: { value: "palak.k" }
    });
    const smtpPassword = getByTestId("smtpPassword").querySelector(
      "input"
    );
    fireEvent.change(smtpPassword, {
      target: { value: "abc" }
    });
    mock.onPost().reply(200);
    fireEvent.click(getByTestId("applyButton"));
    const alertDescription = await waitForElement(() =>
      getByTestId("alertDescription")
    );
    expect(alertDescription.innerHTML).toBe("SMTP server is working");
    const readOnlyField = getByTestId("readOnlyField").querySelector("input");
    expect(readOnlyField.value).toBe("smtp.samsung.net:25");
    fireEvent.click(getByText("OK"));
    const toggleButton = await waitForElement(() =>
      getByTestId("toggleButton")
    );
    mock.onPost().reply(500);
    const spy = jest.spyOn(axios, "post");
    fireEvent.click(toggleButton);
    expect(spy).toHaveBeenCalledWith(
      "/api/v1.0/toggle_email_status/",
      { emailid: "palak.k@samsung.com", status: true },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": null
        }
      }
    );
  });

  it("delete email api throws error", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet("/api/v1.0/get_email_ids/").reply(200, [
      {
        active: 1,
        edit: false,
        email: "palak.k@samsung.com",
        selected: false
      },
      {
        active: 1,
        edit: false,
        email: "palak.kapoor1@gmail.com",
        selected: false
      }
    ]);
    renderComponent();
    const { getByTestId, getByText, getAllByTitle } = wrapper;
    const deleteElement = await waitForElement(
      () => getAllByTitle("Delete")[0]
    );
    fireEvent.click(deleteElement);
    const alertDescription = await waitForElement(() =>
      getByTestId("alertDescription")
    );
    const spy = jest.spyOn(axios, "post");
    expect(alertDescription.innerHTML).toBe(
      "Are you sure you want to Delete the email?"
    );
    mock.onPost().reply(500);
    fireEvent.click(getByText("Yes"));
    expect(spy).toHaveBeenCalledWith(
      "/api/v1.0/delete_emailids/",
      { ids: ["palak.k@samsung.com"] },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": null
        }
      }
    );
    const errorDescription = await waitForElement(() =>
      getByTestId("alertDescription")
    );
    expect(errorDescription.innerHTML).toBe("Failed to Delete Email ID");
    fireEvent.click(getByTestId("alertCloseButton"));
  });

  it("send email api fails", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet("/api/v1.0/get_email_ids/").reply(200, [
      {
        active: 1,
        edit: false,
        email: "palak.k@samsung.com",
        selected: false
      }
    ])
    .onGet(/api\/v1.0\/get_smtp_details\/*/)
    .reply(200, 
      {
        smtpserverip: 'smtp.samsung.net',
        smtpserverport: '25'
      },
    );
    renderComponent();
    const { getByTestId, getByText, getByTitle } = wrapper;
    const smtpServerField = getByTestId("smtpServerField").querySelector(
      "input"
    );
    fireEvent.change(smtpServerField, {
      target: { value: "smtp.samsung.net:25" }
    });

    expect(smtpServerField.value).toBe("smtp.samsung.net:25");
    const smtpFromEmail = getByTestId("smtpFromEmail").querySelector(
      "input"
    );
    fireEvent.change(smtpFromEmail, {
      target: { value: "MTool@samsung.com" }
    });
    const smtpUsername = getByTestId("smtpUsername").querySelector(
      "input"
    );
    fireEvent.change(smtpUsername, {
      target: { value: "palak.k" }
    });
    const smtpPassword = getByTestId("smtpPassword").querySelector(
      "input"
    );
    fireEvent.change(smtpPassword, {
      target: { value: "abc" }
    });
    mock.onPost().reply(200);
    fireEvent.click(getByTestId("applyButton"));
    const alertDescription = await waitForElement(() =>
      getByTestId("alertDescription")
    );
    expect(alertDescription.innerHTML).toBe("SMTP server is working");
    const readOnlyField = getByTestId("readOnlyField").querySelector("input");
    expect(readOnlyField.value).toBe("smtp.samsung.net:25");
    fireEvent.click(getByText("OK"));
/*
    const testEmailElement = await waitForElement(() =>
      getByTitle("Test Email")
    );
    mock.onPost().reply(500);
    fireEvent.click(testEmailElement);
    const errorDescription = await waitForElement(() =>
      getByTestId("alertDescription")
    );
    expect(errorDescription.innerHTML).toBe("Email sending failed");
*/
  });
  // it("should download the logs", async () => {
  //   renderComponent();
  //   const { getByTestId } = wrapper;
  //   fireEvent.click(getByTestId("downloadLogsBtn"));
  // });
  // it("should set ibofos time interval", async () => {
    
  //   renderComponent();
  //   const { getByTestId, getByText } = wrapper;
  //   const ibofosTimeIntervalField = getByTestId("ibofosSettingTextField").querySelector(
  //     "input"
  //   );
  //   fireEvent.change(ibofosTimeIntervalField, {
  //     target: { value: "4" }
  //   });
  //   fireEvent.click(getByTestId("setTimeIntervalButton"));
  //   fireEvent.change(ibofosTimeIntervalField, {
  //     target: { value: "-1" }
  //   });
  //   fireEvent.click(getByTestId("setTimeIntervalButton"));
  //   const okBtn = getByText("OK");
  //   expect(okBtn).toBeDefined();
  //   fireEvent.click(okBtn);
  // });

  // it("should set default ibofos time interval if the API fails", async () => {
  //   const mock = new MockAdapter(axios);
  //   mock.onPost('/api/v1.0/set_ibofos_time_interval').reply(500, null)
  //   renderComponent();
  //   const { getByTestId, getByText } = wrapper;
  //   const ibofosTimeIntervalField = getByTestId("ibofosSettingTextField").querySelector(
  //     "input"
  //   );
  //   fireEvent.change(ibofosTimeIntervalField, {
  //     target: { value: "4" }
  //   });
  //   fireEvent.click(getByTestId("setTimeIntervalButton"));
  //   fireEvent.change(ibofosTimeIntervalField, {
  //     target: { value: "-1" }
  //   });
  //   fireEvent.click(getByTestId("setTimeIntervalButton"));
  //   const okBtn = getByText("OK");
  //   expect(okBtn).toBeDefined();
  //   fireEvent.click(okBtn);
  // });

  // it("should delete ibofos time interval", async () => {
  //   renderComponent();
  //   const { getByTestId } = wrapper;
  //   fireEvent.click(getByTestId("deleteTimeIntervalButton"));
  // });

  //Disabling for PoC1

  // it("should switch tabs", async () => {
  //   renderComponent();
  //   const { getByText } = wrapper;
  //   fireEvent.click(getByText("Alert"));
  //   fireEvent.click(getByText("General"));
  // });
});
