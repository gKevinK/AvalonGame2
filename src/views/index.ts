import Vue from 'vue';
import IGameVM from './IGameVM';
import JoinComponent from './JoinComponent.vue';
import GameComponent from './AvalonComponent.vue';
import { randomBytes } from 'crypto';

declare var io: SocketIOClientStatic;

// var vm: IGameVM & VM = new VM();

let app = new Vue({
    el: "#app",
    template: `
    <div>
        <join-component @join="join" @join_new="join_new" />
        <game-component :op="op" :msg="msg" />
    </div>
    `,
    data: function() { return {
        op: "",
        msg: {},
        // status: 1,
        room_id: undefined,
        users: {},
    }},
    methods: {
        join_new: function(data: object): void {
            socket.emit('join-new', JSON.stringify(data));
        },

        join: function(data: object): void {
            socket.emit('join', JSON.stringify(data));
        },

        prepare: function(): void {
            // TODO
        },

        operate: function(data: object): void {
            socket.emit('operate', JSON.stringify(data));
        },

        message: function (data: string): void {
            socket.emit('msg', data);
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
});

socket.on('join', function (data: string) {
    console.log(data);
});

socket.on('msg', function (data: string) {
    app.msg = JSON.parse(data);
});

socket.on('room', function (data: string) {
    app.op = JSON.parse(data);
});

socket.on('update', function (data: string) {
    app.op = JSON.parse(data);
});
