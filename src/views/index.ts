import VM from './AvalonClient';

declare var io: SocketIOClientStatic;
var GameVM: VM;
// var socket;

function connect() {
    var socket = io();
    socket.on('connect', function (data) {
        
        socket.emit('join', { id: '' });

        
    });

    socket.on('msg', function (data) {
        console.log(data);
    });

    socket.on('update', function (data) {
        GameVM.Update(JSON.parse(data));
    });
}
