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


DESCRIPTION: <initializing parameters for react-i18n> *
@NAME : i18n.js
@AUTHORS: Palak Kapoor
@Version : 1.0 *
@REVISION HISTORY
[07/08/2019] [Palak] : Prototyping..........////////////////////
*/
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEng from "./locales/translation_eng.json";
import translationKor from "./locales/translation_kor.json";

i18n
 
  .use(LanguageDetector)
  .init({
    debug: true, /* check production mode */
    lng: "en",
    fallbackLng: "en", // use en if detected lng is not available

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safe from xss
    },

    resources: {
      en: {
        translations: translationEng
      },

      ko: {
        translations: translationKor
      },
    
    },
    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations"
  });

export default i18n;