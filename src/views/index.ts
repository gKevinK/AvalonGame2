// import Vue from 'vue/types';
import IGameVM from './IGameVM';
import VM from 'AvalonClient.vue';

declare var io: SocketIOClientStatic;

// var vm: IGameVM & VM = new VM();

function connect() {
    var socket = io();
    socket.on('connect', function (data: string) {
        
        socket.emit('join', { id: '' });

        
    });

    socket.on('msg', function (data: string) {
        console.log(data);
    });

    socket.on('update', function (data: string) {
        
    });
}
