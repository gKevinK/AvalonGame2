import VM from './AvalonClient'

var GameVM: VM;

declare var io: any;
var socket;

function connect() {
    socket = io();
    socket.on('connect', function (data) {
        
        // socket.emit('my other event', { my: 'data' });
    });

    socket.on('msg', function (data) {
        console.log(data);
    });

    socket.on('update', function (data) {
        GameVM.Update(JSON.parse(data));
    });
}
