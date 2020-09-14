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
import Loader from 'react-loader-spinner';
import PropTypes from 'prop-types';

const loaderStyle = {
  width: '100%',
  height: '100%',
  background: 'white',
  position: 'fixed',
  top: 0,
  left: 0,
  opacity: 0.9,
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column'
};

const loaderTextStyle = {
  width: '25%',
  marginLeft: '280px',
  top: '100px',
  left: '40%',
  fontSize: '18px',
  // zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const MToolLoader = props => {
  return (
    <div style={loaderStyle}>
      <div style={{ marginLeft: '280px' }}>
        <Loader
          type="Bars"
          color="#788595"
          marginTop="100px"
          height="50"
          width="50"
        />
      </div>
      <h style={loaderTextStyle}>{props.text}</h>
    </div>
  );
};

MToolLoader.propTypes = {
  text: PropTypes.string.isRequired
}

export default MToolLoader;
