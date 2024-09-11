const { Dropbox } = require('dropbox');

async function setupDropboxClient() {
    const fetch = (await import('node-fetch')).default;
    const dbx = new Dropbox({
        accessToken: 'sl.B8vnKSNJSc19y6zIupH-911QoB0vBtCCbCsVooTHdjw54XGdD2iMSsYvdWZDO35k7qH5M354Va35qrHQiU7s629_43_RMvxavTqRIA0MQ1bUdz6PayCAoOV0nZba26auLidwjAvsNIuq07GzCy-PVow',  // Ensure you use the correct access token
        fetch
    });

    return dbx;
}

module.exports = setupDropboxClient;



//sl.B8vnKSNJSc19y6zIupH-911QoB0vBtCCbCsVooTHdjw54XGdD2iMSsYvdWZDO35k7qH5M354Va35qrHQiU7s629_43_RMvxavTqRIA0MQ1bUdz6PayCAoOV0nZba26auLidwjAvsNIuq07GzCy-PVow