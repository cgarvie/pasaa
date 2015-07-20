$(document).ready(function() {

  chrome.storage.sync.get(['status', 'lang'], function (data) {
    console.log(data);
    $("input[name='status'][value='"+data['status']+"']").prop('checked',true);
    $("option[name='status'][value='"+data['lang']+"']").prop('selected',true);
  });

  $('button#submit').click(function() {
      console.log( $("input[name='status']:checked").val() );
      console.log( $("input[name='lang']").val() );
      chrome.storage.sync.set({'status': $("input[name='status']:checked").val(),
                                'lang': $("input[name='lang']").val() }, function() {
          // Notify that we saved.
          console.log('settings saved!');
          chrome.runtime.sendMessage({method: "getStorage"}, function(response) {});
        });
  });

});
