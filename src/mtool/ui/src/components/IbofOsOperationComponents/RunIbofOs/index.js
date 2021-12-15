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
            {props.OS_Running_Status !== 'Not Running' && localStorage.getItem('Rebuilding_Value') ? (
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
                  data-testid="startButton"
                  disabled={props.status}
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
                  data-testid="stopButton"
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
          {/* <div className="IBOFOSCommandWrapper">
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
                  disabled={!props.status || props.mountState === "NORMAL"}
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
                  disabled={!props.status || props.mountState === "EXIST_NORMAL"}
                  onClick={() => {
                    props.openAlert('Unmount');
                  }}
                >
                  Unmount
                </Button>
              </div>
            </div>
          </div> */}
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
