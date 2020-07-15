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


DESCRIPTION: Component corresponding for running/shutting down Poseidon OS
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
[04/06/2019] [Aswin] : Added Ids, removed commented code
*/

import React from 'react';
import './RunIbofOs.css';
import { Button } from '@material-ui/core';
import LinearProgressBarComponent from '../LinearProgressBarComponent';

const RunIbofOs = props => {
  return (
    <div>
      <h1 className="IBOFOS-header_style">Poseidon OS Operation</h1>
      <div className="RunIbofOs-Outer-Box">
        <span className="IBOFOSMainHeader">Run/Shutdown Poseidon OS</span>
        {props.status ? (
          <div>
            <span className="IBOFOSNoteMessage">
              <label style={{ float: 'left', marginRight: '2px' }}>
                Status -{' '}
              </label>
              <label
                style={{ float: 'left', color: 'green', fontWeight: '600' }}
              >
                {' '}
                Running
              </label>{' '}
            </span>
            <span className="IBOFOSStartLabel">
              <label style={{ float: 'left' }}>
                Click to Start/Stop Poseidon OS
              </label>{' '}
            </span>
              <div className="IBOFOSButtonClass">
                <Button
                  variant="contained"
                  color="primary"
                  title="Force Start Poseidon OS"
                  onClick={() => {
                    props.openAlert('Start');
                  }}
                >
                  Start
                </Button>
              </div>
              <div className="IBOFOSButtonClass">
                <Button
                  variant="contained"
                  color="primary"
                  title="Force Stop Poseidon OS"
                  onClick={() => {
                    props.openAlert('Stop');
                  }}
                >
                  Stop
                </Button>
              </div>
            }
          </div>
        ) : (
            <div>
              <span className="IBOFOSNoteMessage">
                <label style={{ float: 'left', marginRight: '2px' }}>
                  Status-{' '}
                </label>
                <label style={{ float: 'left', color: 'red', fontWeight: '600' }}>
                  {props.OS_Running_Status}
                </label>
                {props.OS_Running_Status !== 'Not Running' ? (
                  <LinearProgressBarComponent
                    percent={localStorage.getItem('Rebuilding_Value')}
                  />
                ) : null}
              </span>
              <span className="IBOFOSStartLabel">
                <label style={{ float: 'left' }}>
                  Click to Start/Stop Poseidon OS
                </label>{' '}
              </span>
              <div className="IBOFOSButtonClass">
              <Button
                  variant="contained"
                  color="primary"
                  title="Force Start Poseidon OS"
                  onClick={() => {
                    props.openAlert('Start');
                  }}
              >
                  Start
              </Button>
              </div>
              <div className="IBOFOSButtonClass">
                <Button
                  variant="contained"
                  color="primary"
                  title="Force Stop Poseidon OS"
                  onClick={() => {
                    props.openAlert('Stop');
                  }}
                >
                  Stop
                </Button>
              </div>
            </div>
          )}
        <span className="IBOFOSStatusLabel">
          <label>Response</label>{' '}
        </span>
        <span>
          <input
            className="IBOFOSInputField"
            value={props.responsefromos}
            readOnly
          />
        </span>
      </div>
    </div>
  );
};
export default RunIbofOs;
