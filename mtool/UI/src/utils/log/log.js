import log from 'loglevel';

import remote from 'loglevel-plugin-remote';


const jsonFormatter = (logItem) => {
    const userid = localStorage.getItem("userid");
    return {
        tags: {
            entity: "UI",
            level: logItem.level.label,
            user: userid
        },
        fields: {
            "value": logItem.message,
            "useragent": navigator.userAgent
        },
        measurement: "mtool_log",
        time: logItem.timestamp
    }
};

remote.apply(log, {
    url: '/api/v1.0/logger',
    format: jsonFormatter
});

log.enableAll();

export default log;
