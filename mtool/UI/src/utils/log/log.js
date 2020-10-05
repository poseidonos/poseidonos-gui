import log from 'loglevel';

import remote from 'loglevel-plugin-remote';


const jsonFormatter = (log) => {
    const userid = localStorage.getItem("userid");
    console.log(log)
    return {
        tags: {
            entity: "UI",
            level: log.level.label,
            user: userid
        },
        fields: {
            "value": log.message,
            "useragent": navigator.userAgent
        },
        measurement: "mtool_log",
        time: log.timestamp
    }
};

remote.apply(log, {
    url: '/api/v1.0/logger',
    format: jsonFormatter
});

log.enableAll();

export default log;
