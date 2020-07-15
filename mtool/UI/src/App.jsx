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


DESCRIPTION: <File description> *
@NAME : App.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
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
import Hardware from './containers/Hardware'

const App = () => {
    return (
      <React.Fragment>
        <Route
          className="App-content"
          path="/"
          exact
          component={Authentication}
        />
        <PrivateRoute
          className="App-content"
          path="/performance"
          exact
          component={Performance}
        />
        <PrivateRoute
          className="App-content"
          path="/dashboard"
          exact
          component={Dashboard}
        />
        <PrivateRoute
          className="App-content"
          path="/volume"
          exact
          component={Volume}
        />
        <PrivateRoute
          className="App-content"
          path="/IbofOsOperations"
          exact
          component={IbofOsOperations}
        />
        <PrivateRoute
          className="App-content"
          path="/ConfigurationSetting/*"
          exact
          component={ConfigurationSetting}
        />
        <PrivateRoute
          className="App-content"
          path="/LogManagement"
          exact
          component={LogManagement}
        />
        <Route
          className="App-content"
          path="/Hardware/*"
          exact
          component={Hardware}
        />
      </React.Fragment>
    );
}

export default App;
