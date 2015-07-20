function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

$(document).ready(function() {

      $('body').append('<div id="my_extension"><div id="my_extension_inner"></div></div>');

      $(document).click(function(event) {
          if (! $.contains( $('div#my_extension')[0], event.target ) ) {
               if (getSelectionText()) {
                chrome.runtime.sendMessage({toSay: getSelectionText()}, function() {});
                $.ajax({
                    url: "http://dict.longdo.com/mobile.php?search="+getSelectionText(),
                    success: function(data) {
                        // we can't scroll smoothly for some dumb reason
                        $('div#my_extension_inner').html(data)
                        $('div#my_extension').show();
                    }
                });
              }
            else {
                $('div#my_extension').slideUp(100);
            }
        }
      });

});
