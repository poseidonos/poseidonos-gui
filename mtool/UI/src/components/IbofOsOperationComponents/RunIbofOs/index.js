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
import { Button } from '@material-ui/core';
import './RunIbofOs.css';
import LinearProgressBarComponent from '../LinearProgressBarComponent';

const RunIbofOs = props => {

  // istanbul ignore next: cannot click reset as it is hidden
  return (
    <div>
      <h1 className="IBOFOS-header_style">Poseidon OS Operation</h1>
      <div className="RunIbofOs-Outer-Box">
        <span className="IBOFOSMainHeader">Run/Shutdown Poseidon OS</span>
        <div>
          <span className="IBOFOSNoteMessage">
            <span style={{ float: 'left', marginRight: '2px' }}>
              Status -
            </span>
            <span
              style={{ float: 'left', color: (props.status ? 'green' : 'red'), fontWeight: '600' }}
            >
              {props.status ? "Running" : props.OS_Running_Status}
            </span>
            {props.OS_Running_Status !== 'Not Running' ? (
              <LinearProgressBarComponent
                percent={localStorage.getItem('Rebuilding_Value')}
              />
            ) : null}
          </span>
          <div className="IBOFOSCommandWrapper">
            <span className="IBOFOSStartLabel">
              <span style={{ float: 'left' }}>
                Start/Stop Poseidon OS
              </span>
            </span>
            <div>
              <div className="IBOFOSButtonClass">
                <Button
                  variant="contained"
                  color="primary"
                  title="Force Start Poseidon OS"
                  data-testid="startButtonRunning"
                  disabled={props.status}
                >
                  Start
                </Button>
              </div>
              <div className="IBOFOSButtonClass">
                <Button
                  variant="contained"
                  color="primary"
                  title="Force Stop Poseidon OS"
                  data-testid="stopButtonRunning"
                  disabled={!props.status}
                  onClick={() => {
                    props.openAlert('Stop');
                  }}
                >
                  Stop
                </Button>
              </div>
              <div className="IBOFOSButtonClass">
                <Button
                  variant="contained"
                  color="primary"
                  title="Reset Poseidon OS"
                  data-testid="resetButton"
                  style={{
                    display: "none"
                  }}
                  onClick={() => {
                    props.openAlert('Reset');
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
          <div className="IBOFOSCommandWrapper">
            <span className="IBOFOSStartLabel">
              <span style={{ float: 'left' }}>
                Mount/Unmount Poseidon OS
              </span>
            </span>
            <div>
              <div className="IBOFOSButtonClass">
                <Button
                  variant="contained"
                  color="primary"
                  title="Mount Poseidon OS"
                  data-testid="btn-mount"
                  disabled={!props.status}
                  onClick={() => {
                    props.openAlert('Mount');
                  }}
                >
                  Mount
                </Button>
              </div>
              <div className="IBOFOSButtonClass">
                <Button
                  variant="contained"
                  color="primary"
                  title="Unmount Poseidon OS"
                  data-testid="btn-unmount"
                  disabled={!props.status}
                  onClick={() => {
                    props.openAlert('Unmount');
                  }}
                >
                  Unmount
                </Button>
              </div>
            </div>
          </div>
        </div>
        <span className="IBOFOSStatusLabel">
          <span>Response</span>
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
