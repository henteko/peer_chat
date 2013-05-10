$(function() {
  var apiKey = 'your peerjs apikey';
  var myId = Math.ceil( Math.random()*1000 + 100 );
  var peer = new Peer(myId, {key: apiKey});

  var input = function(name, body, preview) {
    if(preview) {
      $('#preview').text(name + ': ' + body);
    }else {
      $('#preview').text('');
      $('#chat-text').prepend($('<div/>').text(name + ': ' + body));
    }
  };

  var nameSet = function() {
    var name = $('#name').val();
    if(name === '') return '名無し' + myId;
    return name;
  };

  var connect = function(conn) {
    $('#peer').hide();
    $('#chat-space').show();

    $('#my-id').text('ID: ' + conn.peer + 'と通信中');

    //プレビュー中
    $('#chat').on('keyup', function() {
      var text = $(this).val();
      if(text === '') return;
      var name = nameSet();
      conn.send({
        body: text,
        name: name,
        preview: true
      });
    });
    
    //送信
    $('#submit').click(function() {
      var text = $('#chat').val();
      var name = nameSet();
      $('#chat').val('');
      input(name, text, false);
      conn.send({
        body: text,
        name: name,
        preview: false 
      });
    });

    //受信
    conn.on('data', function(data){
      input(data.name, data.body, data.preview);
    });

    //通信切断時
    conn.on('close', function() {
      $('#my-id').text('ID: ' + conn.peer + 'との通信が切れました');
    });
  };

  $('#connect').click(function() {
    var id = $('#connect-id').val();
    if(id === '') return;
    var conn = peer.connect(id, {'serialization': 'binary-utf8'});
    conn.on('open', function(){
      connect(conn);
    });
  });

  peer.on('connection', function(conn) {
    connect(conn);
  });

  $('#my-id').text('My ID: ' + myId);
});
