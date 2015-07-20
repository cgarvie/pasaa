chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.method == "speak") {
        chrome.tts.speak(request.toSay, { rate: 0.8, 'lang': 'th-TH', onEvent: function(event) {}}, function() {});
    }
    else if (request.method == "getStorage") {
        console.log("fetching data");
        chrome.storage.sync.get(['status', 'lang'], function (data) {
          console.log("got data"+data);
          console.log("status="+data['status']);
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, data, function(response) {});
          });
        });
        console.log("done w data");
    }
    else {
      sendResponse({}); // snub them.
      console.log("snubbing");
    }
});
