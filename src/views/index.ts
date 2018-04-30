import Vue from 'vue';
import IGameVM from './IGameVM';
import JoinComponent from './JoinComponent.vue';
import GameComponent from './AvalonComponent.vue';

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
        Name: <input v-model="name" type="text">
        <join-component @success="start" />
        <game-component :name="name" />
    </div>
    `,
    data: function() { return {
        name: "world!",
        status: 1,
        room_id: 0,
        users: {},
    }},
    methods: {
        start: function(): void {

        }
    },
    components: {
        JoinComponent,
        GameComponent,
    }
});
