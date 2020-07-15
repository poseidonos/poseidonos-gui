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
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
import React from 'react';
import './Tooltip.css';

const Tooltip = props => {
  return (
    <div className="Tooltip" style={props.containerStyle}>
      <table className="Tooltip-table">
        <tbody>
          <tr>
            <th colSpan="2">{props.t}</th>
          </tr>
          <tr>
            <td className="name">
              <span style={{ backgroundColor: 'rgb(31,119,180)' }} />
              {props.label}
            </td>
            <td className="value">{props.value}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Tooltip;
