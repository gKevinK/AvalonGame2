import Vue from 'vue';
import IGameVM from './IGameVM';
import GameComponent from './AvalonClient.vue';

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

Vue.extend({
    el: "#app",
    template: `
    <div>
        Name: <input v-model="name" type="text">
        <game-component :name="name" />
    </div>
    `,
    data: { name: "world!" },
    components: {
        GameComponent
    }
});
