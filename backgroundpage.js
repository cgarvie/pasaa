chrome.runtime.onMessage.addListener(function(request) {
  chrome.tts.speak(request.toSay,
                  { rate: 0.8, 'lang': 'th-TH', onEvent: function(event) {}}, function() {});
});
