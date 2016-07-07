// Create a panel
chrome.devtools.panels.create('Omnitool', '128.png', 'panel.html', function (extensionPanel) {
  var portToBackground = chrome.runtime.connect({name: 'omnitool'})
  extensionPanel.onShown.addListener(function (panelWindow) {
    if (!panelWindow.postMessageToBackground) {
      // Setup PANEL=>BACKGROUND communication
      panelWindow.postMessageToBackground = function postMessageToBackground (msg) {
        portToBackground.postMessage(msg)
      }
      // Setup BACKGROUND=>PANEL communication
      portToBackground.onMessage.addListener(function (message) {
        // alert('LAUNCHER relaying message from BACKGROUND to PANEL, message: ' + JSON.stringify(message))
        if (message.type === 'panelData') {
          panelWindow.postMessage({__fromCyclejsDevTool: true, data: message.data}, '*')
        } else if (message.type === 'tabUpdated' &&
          message.tabId === chrome.devtools.inspectedWindow.tabId) {
          chrome.devtools.inspectedWindow.eval(loadGraphSerializerCode())
        }
      })
    }
    // alert('LAUNCHER will eval the graphSerializer')
    chrome.devtools.inspectedWindow.eval(loadGraphSerializerCode())
  })
})

var code = null

function loadGraphSerializerCode () {
  let xhr
  if (!code) {
    xhr = new window.XMLHttpRequest()
    xhr.open('GET', chrome.extension.getURL('/graphSerializer.js'), false)
    xhr.send()
    code = xhr.responseText
  }
  return code
}
