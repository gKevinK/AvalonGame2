import Vue from 'vue';
import IGameVM from './IGameVM';
import JoinComponent from './JoinComponent.vue';
import GameComponent from './AvalonComponent.vue';
import { IRoomConfig, IRoomOp, IRoomStatus, IStatus, IUserStatus, IRoomN } from '../common/RoomInterface';

declare var io: SocketIOClientStatic;

// var vm: IGameVM & VM = new VM();

let app = new Vue({
    el: "#app",
    template: `
    <div>
        <join-component v-if="!room" @ev="event" :name="user ? user.name : ''" />
        <game-component v-if="room" @ev="event" :roomn="roomn" :gamen="gamen" :msg="msg" :stat="room" />
    </div>
    `,
    data: function() { return {
        user: <IUserStatus | undefined>undefined,
        room: <IRoomStatus | undefined>undefined,

        roomn: {},
        gamen: {},
        msg: {},
    } },
    methods: {
        event: function (data: { type: string, data: object }): void {
            socket.emit(data.type, data.data);
        },
    },
    components: {
        JoinComponent,
        GameComponent,
    }
});

let socket = io();
socket.on('connect', function () {
    console.log('Connection established.');
    socket.emit('get-status', localStorage.getItem('user-id') || '""');
});

socket.on('reconnect', function () {
    socket.emit('get-status', localStorage.getItem('user-id') || '""');
});

socket.on('status', function (data: IStatus) {
    console.log(JSON.stringify(data));
    app.user = data.user;
    app.room = data.room;
    if (data.user) localStorage.setItem('user-id', data.user.token);
});

socket.on('user-status', function (data: IUserStatus) {
    // console.log(data);
    app.user = data;
    localStorage.setItem('user-id', app.user.token);
});

socket.on('join', function () {
    socket.emit('get-status', localStorage.getItem('user-id') || '""');
});

socket.on('msg', function (data: object) {
    app.msg = data;
});

socket.on('room', function (data: IRoomN) {
    console.log(JSON.stringify(data));
    app.roomn = data;
});

socket.on('game', function (data: object) {
    console.log(JSON.stringify(data));
    app.gamen = data;
});

socket.on('disconnect', function () {
    console.log('Connection closed.');
});
