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


DESCRIPTION: Root Theme for MTool
@NAME : i18n.js
@AUTHORS: Aswin K K
@Version : 1.0 *
@REVISION HISTORY
[07/08/2019] [Aswin] : Created Theme..........////////////////////
*/
import { createMuiTheme } from "@material-ui/core";

export const customTheme = {
  palette: {
      primary: {
        light: '#71859d',
       
        main: '#788595',
        dark: 'rgb(94, 104, 116)'
      },
      secondary: {
        light: '#151d3b',
        main: '#151d3b',
        dark: '#000',
        contrastText: '#fff'
      },
      palette: {
        type: 'dark',
      }
  },
  table: {
      // headColor: '#71859d',
      headColor: '#788595',
      header: {
        backgroundColor: "#788595",
        color: "white",
        fontSize: 14,
        flexDirection: 'row'
      }
  },
  typography: {
      fontFamily: 'Arial'
  },
  page: {
      title: {
          textAlign: 'left',
          fontSize: '16px',
          fontWeight: 'bold',
          // color: 'rgb(53, 85, 142)',
          color:'#424850'
      }
  },
  card: {
      header: {
          textAlign: 'left',
          marginLeft: '24px',
          paddingTop: '8px',
          marginBottom: '5px',
          fontSize: '16px',
          fontWeight: 'bold',
         // color: 'rgb(53, 85, 142)',
         color:'#424850'
      }
  },
  toolbar: {
    height: '55px'
  }
};

const MToolTheme = createMuiTheme(customTheme);
export const PageTheme = createMuiTheme({
  ...customTheme,
  palette: {
    ...customTheme.palette,
    primary: {
      main: '#788595'
    }
  },
  typography: {
    ...customTheme.typography,
    fontSize: '12px'
  }
})

export default MToolTheme;
