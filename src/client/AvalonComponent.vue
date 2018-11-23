<template>
    <div>
        <p>Room id : {{ roomid }}</p>
        <div class="seat" v-for="(item, idx) in seats" :key="item.id" style="border: 1px solid #DDD; padding: 0.5rem; ">
            <div>Player {{ idx + 1 }}: {{ item.name }}</div>
            <div class="prepare" v-if="prepare[idx]">[Prepared]</div>
            <div class="captain" v-if="captain === idx">[Captain]</div>
            <div class="inteam" v-if="team.includes(idx)">[In team]</div>
            <div class="voted" v-if="false">[Voted]</div>
            <div class="agree" v-if="false">[Agree]</div>
            <div class="disagree" v-if="false">[Disagree]</div>
            <input type="checkbox" v-if="status == 1 && captain == idx"
                v-model="selections" :value="idx">
            <input type="radio" v-if="false" name="player_select" v-model="selection" :value="idx">
            <button v-if="status == 0" @click="move(idx)">{{ _users[userid].seat == idx ? "Leave" : "Sit" }}</button>
        </div>
        <button v-if="status == 0 && _users[userid].seat != -1" @click="prep">Prepare</button>

        <div>{{ op }}</div>
        <div class="record">
            <div v-for="(item, idx) in result" :key="item.id">
                Round {{ idx + 1 }}: {{ task_player_num[idx] }} : {{ ["-", "fail", "success"][item + 1] }}
            </div>
            <div v-for="tn in [ 1, 2, 3, 4, 5 ]" :key="tn.id">
                {{ tn }}
            </div>
        </div>

        <div class="panel" v-if="[ 2, 3 ].includes(status)">
            <input type="radio" v-model="selection" :value="1">
            <input type="radio" v-model="selection" :value="0">
            <button @click="alert(1)">确定</button>
        </div>

        <div class="panel" v-if="captain == myseat && status == 1">
            <button @click="alert(1)">确定</button>
        </div>

        <div>
            <!-- <div v-for="m in messages" :key="m.id">
                Player {{ m.order + 1 }} : {{ m.text }}
            </div> -->
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IUserInfo, IRoomN, IRoomStatus, IRoomOp } from '../common/RoomInterface';
import { IOperation, IGameStatus } from '../common/AvalonInterface';

const Util = {
    range: function (n: number) {
        var arr = [];
        for (var i = 0; i < n; i++) arr.push(i);
        return arr;
    },
};

enum ROLE {
    Good = -3,
    Bad = -2,
    Unknown = -1,
    Merlin,
    Percival,
    Loyalist,
    Assassin,
    Morgana,
    Mordred,
    Oberon,
    Minion,
    // Lancelot: 8, 9,
}

enum STATUS {
    Wait,
    MakeTeam,
    TeamVote,
    TaskVote,
    Assassin,
    End,
}

const config = {
    role: <{ [index:number]: Number[] }>{
        5:  [0, 1, 2, 3, 4],
        6:  [0, 1, 2, 2, 3, 4],
        7:  [0, 1, 2, 2, 3, 4, 6],
        8:  [0, 1, 2, 2, 2, 3, 4, 7],
        9:  [0, 1, 2, 2, 2, 2, 3, 4, 5],
        10: [0, 1, 2, 2, 2, 2, 3, 4, 5, 6],
    },
    task_player_num: <{ [index:number]: Number[] }>{
        5:  [2, 3, 2, 3, 3],
        6:  [2, 3, 4, 3, 4],
        7:  [2, 3, 3, 4, 4],
        8:  [3, 4, 4, 5, 5],
        9:  [3, 4, 4, 5, 5],
        10: [3, 4, 4, 5, 5],
    },
}

export default Vue.extend({
    props: [ "op", "msg", "stat", "roomn" ],

    data: function() { return {
        userid: "",
        roomid: "",
        seats: <IUserInfo[]> [],
        prepare: <boolean[]> [],
        pcount: 5,
        round: -1,
        try: -1,
        myseat: -1,
        role: ROLE.Unknown,
        knowledge: <number[]> [],
        selection: -1,
        selections: <number[]> [],
        status: STATUS.MakeTeam,
        captain: 0,
        team: <number[]> [],
        teamvote: <number[]> [],
        taskvote: <number[]> [],
        result: [ -1, -1, -1, -1, -1 ],
        messages: <any[]> [],

        _users: <{ [key:string]: { info: IUserInfo, seat: number } }> {},
    }; },

    mounted: function () {
        this.update(this.stat);
    },

    watch: {
        stat: function (obj: IRoomStatus) {
            this.update(obj);
        },

        roomn: function (obj: IRoomN) {
            switch (obj.type) {
                case "move-i":
                    let u = this._users[obj.userid];
                    if (u.seat !== -1)
                        this.seats[u.seat] = <IUserInfo>{ name: '----' };
                    if (obj.t !== -1)
                        this.seats[obj.t] = u.info;
                    u.seat = obj.t;
                    break;
                case "disconn-i": case "reconn-i":
                    break;
                case "exit-i":
                    delete this._users[obj.userid];
                    break;
            }
        },

        op: function (obj: IOperation): void {
            switch (obj.op) {
                case "make-team":
                    this.status = STATUS.MakeTeam;
                    this.captain = obj.t;
                    this.team = [];
                    this.selections = [];
                    break;
                case "team-vote":
                    this.status = STATUS.TeamVote;
                    this.team = obj.ts;
                    this.selection = -1;
                    break;
                case "team-vote-i":
                    (this.teamvote as Array<Number>).splice(obj.t, 1, -2);
                    break;
                case "team-vote-r":
                    // TODO
                    break;
                case "task-vote":
                    this.status = STATUS.TaskVote;
                    this.taskvote = obj.ts;
                    this.selection = -1;
                    // TODO
                    break;
                case "task-vote-i":
                    (this.taskvote as Array<Number>).splice(obj.t, 1, -2);
                    break;
                case "task-vote-r":
                    // TODO
                    break;
                case "assassin":
                    this.status = STATUS.Assassin;
                    this.selections = [];
                    // TODO
                    break;
                case "end":
                    this.status = STATUS.End;
                    // TODO
                    break;
            }
        },

        msg: function (m: any): void {
            this.messages.push(m);
        },
    },

    methods: {
        update: function (obj: IRoomStatus): void {
            if (!obj) return;
            this._users = {};
            obj._users.forEach(u => this._users[u.info.userid] = u);
            this.userid = obj.userid;
            this.roomid = obj.roomid;
            this.pcount = obj.num;
            this.seats = Util.range(this.pcount).map(_ => <IUserInfo>{ name: '----' });
            this.prepare = obj.prepare;
            this.status = 0;
            for (var u in this._users) {
                if (this._users[u].seat >= 0)
                    this.seats[this._users[u].seat] = this._users[u].info;
            }
            if (obj.game) {
                let game = <IGameStatus>obj.game;
                this.role = game.role;
                this.knowledge = game.knowledge;
                this.result = game.result;
                this.round = game.round;
                this.try = game.try;
                this.captain = game.captain;
                this.team = game.team;
            }
        },

        move: function (t: number) {
            if (t === this._users[this.userid].seat) t = -1;
            this.$emit("ev", { type: "room", data: <IRoomOp>{ op: "move", t: t } });
        },

        prep: function () {
            if (this._users[this.userid].seat === -1) return;
            this.$emit("ev", { type: "room", data: <IRoomOp>{ op: "prepare" }});
        },

        submit: function () {
            // TODO
            var op = "";
            this.$emit("ev", { type: "op", data: <IOperation>{ op: op, t: this.selection } });
        },

        submitMulti: function () {
            // TODO
            var op = "";
            this.$emit("ev", { type: "op", data: <IOperation>{ op: op, ts: this.selections } });
        },
    },

    computed: {
        task_player_num: function(): Number[] {
            return config.task_player_num[this.pcount];
        }
    },
});

</script>

<style scoped>
p {
    color: violet;
}
</style>
