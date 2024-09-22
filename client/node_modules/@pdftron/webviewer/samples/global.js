/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
function samplesSetup(instance) {
  instance.UI.enableElements(['bookmarksPanel', 'bookmarksPanelButton', 'richTextPopup']);
  instance.UI.enableFeatures([instance.UI.Feature.Measurement]);
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
function getQueryParameters() {
  const params = {};
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  urlParams.forEach((value, key) => {
    if (value.toLowerCase() === 'true') {
      params[key] = true;
    } else if (value.toLowerCase() === 'false') {
      params[key] = false;
    } else {
      params[key] = value;
    }
  });
  return params;
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
function isWebComponent() {
  const queryParams = getQueryParameters();
  return queryParams.webcomponent;
}
