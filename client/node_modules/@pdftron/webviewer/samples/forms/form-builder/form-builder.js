// eslint-disable-next-line no-undef
const WebViewerConstructor = isWebComponent() ? WebViewer.WebComponent : WebViewer;

WebViewerConstructor(
  {
    path: '../../../lib',
    initialDoc: '../../full-apis/TestFiles/contract.pdf',
  },
  document.getElementById('viewer')
).then(instance => {
  samplesSetup(instance);

  instance.UI.setToolbarGroup('toolbarGroup-Forms');
});
