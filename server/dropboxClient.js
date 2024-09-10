const { Dropbox } = require('dropbox');

async function setupDropboxClient() {
    const fetch = (await import('node-fetch')).default;
    const dbx = new Dropbox({
        accessToken: 'sl.B8pi8oGOcotKrcUBXPvYajUIgNNjCwJUqMLvmODIsZyx3JHoCLdftllY6eZvWFSve3Enqj-ja-uK-XNfXmMWBDMQ_z1-2oxb02Zq6diob8rBgOzVT91UKbxDAr8MoStonT9-PfPpRzLS-15cO2R1',  // Ensure you use the correct access token
        fetch
    });

    return dbx;
}

module.exports = setupDropboxClient;



//sl.B8pi8oGOcotKrcUBXPvYajUIgNNjCwJUqMLvmODIsZyx3JHoCLdftllY6eZvWFSve3Enqj-ja-uK-XNfXmMWBDMQ_z1-2oxb02Zq6diob8rBgOzVT91UKbxDAr8MoStonT9-PfPpRzLS-15cO2R1