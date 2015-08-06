$(document).ready(function() {

  chrome.storage.sync.get(['status', 'lang', 'font_size'], function (data) {
    console.log(data);
    $("input[name='status'][value='"+data['status']+"']").prop('checked',true);
    $("input[name='font_size'][value='"+data['font_size']+"']").prop('checked',true);
    $("option[name='status'][value='"+data['lang']+"']").prop('selected',true);
  });

  $('button#submit').click(function() {
      //console.log( $("input[name='status']:checked").val() );
      //console.log( $("input[name='lang']").val() );
      chrome.storage.sync.set({'status': $("input[name='status']:checked").val(),
                                'lang': $("input[name='lang']").val(),
                                'font_size': $("input[name='font_size']:checked").val()
                             }, function() {
          // Notify that we saved.
          console.log('settings saved!');
          chrome.runtime.sendMessage({method: "getStorage"}, function(response) {});
        });
  });

});
