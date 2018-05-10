import Vue from 'vue';
import IGameVM from './IGameVM';
import JoinComponent from './JoinComponent.vue';
import GameComponent from './AvalonComponent.vue';
import { randomBytes } from 'crypto';

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

        temp: function(): void {

        }
    },
    components: {
        JoinComponent,
        GameComponent,
    }
});
