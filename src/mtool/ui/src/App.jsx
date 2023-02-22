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

import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';
import MToolLoader from './components/MToolLoader';
import ErrorBoundary from './components/ErrorBoundary';

const Performance = lazy(() => import('./containers/Performance'));
const Authentication = lazy(() => import('./containers/Authentication'));
const Dashboard = lazy(() => import('./containers/Dashboard'));
const PrivateRoute = lazy(() => import('./components/PrivateRoute'));
const StorageManagement = lazy(() => import('./containers/StorageManagement'));
const ConfigurationSetting = lazy(() => import('./containers/ConfigurationSetting'));
const IbofOsOperations = lazy(() => import('./containers/IbofOsOperations'));

const App = () => {
  return (
    <React.Fragment>
      <ErrorBoundary>
        <Suspense fallback={<MToolLoader />}>
          <Switch>
            <PrivateRoute className="App-content" path="/performance*" exact component={() => <Performance />} />
            <PrivateRoute className="App-content" path="/dashboard" exact component={() => <Dashboard />} />
            <PrivateRoute className="App-content" path="/storage/array/*" exact component={() => <StorageManagement />} />
            <PrivateRoute className="App-content" path="/operations/*" exact component={() => <IbofOsOperations />} />
            <PrivateRoute className="App-content" path="/ConfigurationSetting/*" exact component={() => <ConfigurationSetting />} />
            <Route className="App-content" path="/" component={() => <Authentication />} />
          </Switch>
        </Suspense>
      </ErrorBoundary>
    </React.Fragment>
  );
}

export default App;
