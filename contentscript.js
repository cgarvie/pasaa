function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function getSelectionBoundaryElement(isStart) {
    var range, sel, container;
    if (document.selection) {
        range = document.selection.createRange();
        range.collapse(isStart);
        return range.parentElement();
    } else {
        sel = window.getSelection();
        if (sel.getRangeAt) {
            if (sel.rangeCount > 0) {
                range = sel.getRangeAt(0);
            }
        } else {
            // Old WebKit
            range = document.createRange();
            range.setStart(sel.anchorNode, sel.anchorOffset);
            range.setEnd(sel.focusNode, sel.focusOffset);

            // Handle the case when the selection was selected backwards (from the end to the start in the document)
            if (range.collapsed !== sel.isCollapsed) {
                range.setStart(sel.focusNode, sel.focusOffset);
                range.setEnd(sel.anchorNode, sel.anchorOffset);
            }
       }

        if (range) {
           container = range[isStart ? "startContainer" : "endContainer"];

           // Check if the container is a text node and return its parent if so
           return container.nodeType === 3 ? container.parentNode : container;
        }
    }
}

$(document).ready(function() {

      storedData = {'status': 'on'}

      $('body').append('<div id="my_extension"><div id="my_extension_inner"></div></div>');

      $(document).click(function(event) {
          if (storedData['status'] == 'on') {
              //if (! $.contains( $('div#my_extension')[0], event.target ) ) {
                  if (
                      ((getSelectionText()) && (! $.contains( $('div#my_extension')[0], event.target ) ))
                      ||
                      ( ($(event.target).is("[data-term]")) )
                     ) {

                    if (($(event.target).is("[data-term]"))) {
                        term = $(event.target).attr('data-term');
                    }
                    else if (getSelectionText()) {
                        term = getSelectionText();
                    }

                    //alert("starting");
                    elem = getSelectionBoundaryElement('start');
                    context = $(elem).text();
                    //alert(context);
                    index = context.indexOf( getSelectionText() );
                    strHead = context.substring(0, index);
                    strTail = context.substring(index);
                    //alert(strHead);
                    //alert(strTail);
                    i2 = strHead.lastIndexOf(" ");
                    i3 = strTail.indexOf(" ");
                    sentence = context.substring(i2, strHead.length+i3);
                    //alert("CONTEXT");
                    //alert(sentence);

                    chrome.runtime.sendMessage({method: "speak", toSay: term}, function() {});
                    chrome.runtime.sendMessage({
                        method: 'GET',
                        action: 'xhttp',
                        url: 'http://dict.longdo.com/mobile.php?search='+term,
                        //data: 'search=banana'
                    }, function(responseText) {
                        $('div#my_extension_inner').html(responseText);
                        $.each( $('div#my_extension_inner a'), function() {
                            if ( $(this).attr('href').toLowerCase().indexOf("longdo.com") > -1 ) {
                                // if it contains string at all
                                $(this).addClass('internal-ext-link');
                                $(this).attr('data-term',  $(this).attr('href').split("search=")[1] );
                                // .prop does not work for 'onclick'
                                $(this).prop('href', '#');
                            }
                        });
                        $.each( $('div#my_extension_inner table tr'), function() {
                            $(this).append('<td><a class="save_def">[SAVE THIS DEFINITION]</a></td>');
                        });
                        $('div#my_extension_inner a.save_def').click( function(event) {
                            word = $(this).closest("tr").children('td').eq(0).text();
                            definition = $(this).closest("tr").children('td').eq(1).text();
                            //chrome.runtime.sendMessage({method: "save_word", word: word, definition: definition}, function() {});
                            chrome.storage.local.get('dic', function (result) {
                                dic = result.dic;
                                if (! dic) {
                                    dic = [];
                                }
                                dic.push([word, definition, sentence]);
                                //alert(dic)
                                chrome.storage.local.set({'dic': dic});
                            });

                            /*
                            chrome.storage.local.get('dic', function (result) {
                                dic = result.dic;
                                if (! dic) {
                                    dic = [];
                                }
                                var csvContent = "data:text/csv;charset=utf-8,";
                                dic.forEach(function(infoArray, index){
                                   dataString = infoArray.join("|||||");
                                   csvContent += index < dic.length ? dataString+ "\n" : dataString;
                                });
                                var encodedUri = encodeURI(csvContent);
                                window.open(encodedUri);
                            });
                            */

                        });
                        $('div#my_extension').show();
                    });
                  }
                  else if ((! getSelectionText() )&&(! $.contains( $('div#my_extension')[0], event.target ) ))  {

                    $('div#my_extension').slideUp(100);
                    chrome.runtime.sendMessage({method: "getStorage"}, function(response) {});
                    console.log('done w dat shit');
                  }
              //}
          }
      });

});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    storedData = request;
    console.log("new stored data = " + storedData['status']);
    console.log("new stored data = " + storedData['lang']);

    if (storedData['status'] == 'off') {
      $('div#my_extension').slideUp(100);
    }

    if (storedData['font_size'] == '1') {
      $('div#my_extension_inner').css('font-size','12px');
      $('div#my_extension_inner').css('line-height','18px');
    }
    else if (storedData['font_size'] == '2') {
      $('div#my_extension_inner').css('font-size','16px');
      $('div#my_extension_inner').css('line-height','24px');
    }
    else if (storedData['font_size'] == '3') {
      $('div#my_extension_inner').css('font-size','22px');
      $('div#my_extension_inner').css('line-height','33px');

    }

});
