chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.method == "speak") {
        chrome.tts.speak(request.toSay, { rate: 0.8, 'lang': 'th-TH', onEvent: function(event) {}}, function() {});
    }
    else if (request.method == "save_word") {
        /*
        request.word
        request.definition

        var xhttp = new XMLHttpRequest();
        var method = 'POST';
        xhttp.onload = function() {
            //sendResponse(xhttp.responseText);
        };
        xhttp.onerror = function() {
            // Do whatever you want on error. Don't forget to invoke the
            // callback to clean up the communication port.
            //sendResponse();
        };
        xhttp.open(method, 'http://someserver.com/', true);
        if (method == 'POST') {
            xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        xhttp.send(request.data);
        return true; // prevents the callback from being called too early on return
        */
    }
    else if (request.method == "getStorage") {
        console.log("fetching data");
        chrome.storage.sync.get(['status', 'lang', 'font_size'], function (data) {
          //console.log("got data"+data);
          //console.log("status="+data['status']);
          chrome.tabs.query({}, function(tabs) { // {active: true, currentWindow: true}
              for (var i=0; i<tabs.length; ++i) {
                  chrome.tabs.sendMessage(tabs[i].id, data);
              }
          });
        });
        console.log("done w data");
    }
    else if (request.action == "xhttp") {
        var xhttp = new XMLHttpRequest();
        var method = request.method ? request.method.toUpperCase() : 'GET';

        xhttp.onload = function() {
            sendResponse(xhttp.responseText);
        };
        xhttp.onerror = function() {
            // Do whatever you want on error. Don't forget to invoke the
            // callback to clean up the communication port.
            sendResponse();
        };
        xhttp.open(method, request.url, true);
        if (method == 'POST') {
            xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        xhttp.send(request.data);
        return true; // prevents the callback from being called too early on return
    }
    else {
      sendResponse({}); // snub them.
      console.log("snubbing");
    }
});
