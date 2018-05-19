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
        <button @click="">temp</button>
        <join-component @join="join" @join_new="join_new" />
        <game-component :op="op" />
    </div>
    `,
    data: function() { return {
        op: "",
        status: 1,
        room_id: 0,
        users: {},
    }},
    methods: {
        join_new: function(data: object): void {

        },

        join: function(data: object): void {
            
        },

        start: function(): void {

        },

        operate: function(data: object): void {

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
socket.on('connect', function (data: string) {
    console.log(data);
});

socket.on('join', function (data: string) {
    console.log(data);
});

socket.on('msg', function (data: string) {
    console.log(data);
});

socket.on('update', function (data: string) {
    console.log(data);
});
