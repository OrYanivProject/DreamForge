const { Dropbox } = require('dropbox');
let fetch;  // Declare fetch variable to hold the imported module

import('node-fetch').then(module => {
    fetch = module.default;  // Assign the default export of the module to fetch
}).catch(err => {
    console.error('Failed to load node-fetch', err);
});


const dbx = new Dropbox({
  accessToken: 'sl.B8fJ-QFgsOhIG8gbaF44ressxkFbrtVITdOb3mjFYNIrLeQci_j-Av4DNR2lKBw5-W2LSEkcpB_2r-8sUmsO3rwDZXTUqt5qK1dgUj9zY_Ge7OhsRvlDAnVMgMckpnMF5iA7JmG_D9n1WKTy3tnL',
  fetch: fetch
});

module.exports = dbx;
