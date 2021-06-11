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

import React from 'react';
import { Route } from 'react-router-dom';

import Performance from './containers/Performance';
import './App.css';
import Authentication from './containers/Authentication';
import Dashboard from './containers/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Volume from './containers/Volume';
import ConfigurationSetting from './containers/ConfigurationSetting';
import IbofOsOperations from './containers/IbofOsOperations';
import LogManagement from './containers/Log-Management';
import Hardware from './containers/Hardware';
import ErrorBoundary from './containers/ErrorBoundary';

const App = () => {
    return (
      <React.Fragment>
        <Route
          className="App-content"
          path="/"
          exact
          component={() => (
            <ErrorBoundary>
              <Authentication />
            </ErrorBoundary>
          )}
        />
        <PrivateRoute
          className="App-content"
          path="/performance"
          exact
          component={() => (
            <ErrorBoundary>
              <Performance />
            </ErrorBoundary>
          )}
        />
        <PrivateRoute
          className="App-content"
          path="/dashboard"
          exact
          component={() => (
            <ErrorBoundary>
              <Dashboard />
            </ErrorBoundary>
          )}
        />
        <PrivateRoute
          className="App-content"
          path="/storage/array/*"
          exact
          component={() => (
            <ErrorBoundary>
              <Volume />
            </ErrorBoundary>
          )}
        />
        <PrivateRoute
          className="App-content"
          path="/IbofOsOperations"
          exact
          component={() => (
            <ErrorBoundary>
              <IbofOsOperations />
            </ErrorBoundary>
          )}
        />
        <PrivateRoute
          className="App-content"
          path="/ConfigurationSetting/*"
          exact
          component={() => (
            <ErrorBoundary>
              <ConfigurationSetting />
            </ErrorBoundary>
          )}
        />
        <PrivateRoute
          className="App-content"
          path="/LogManagement"
          exact
          component={() => (
            <ErrorBoundary>
              <LogManagement />
            </ErrorBoundary>
          )}
        />
        <Route
          className="App-content"
          path="/Hardware/*"
          exact
          component={() => (
            <ErrorBoundary>
              <Hardware />
            </ErrorBoundary>
          )}
        />
      </React.Fragment>
    );
}

export default App;
