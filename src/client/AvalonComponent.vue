<template>
    <div>
        <p>Room id: {{ roomid }}</p>
        <div style="display: flex;">
        <div class="seat" v-for="(item, idx) in seats" :key="item.id">
            <div>Player {{ idx + 1 }}: {{ item.name }}</div>
            <div class="prepare" v-if="status === 0 && prepare[idx]">[Prepared]</div>
            <button v-if="status === 0 && my_seat === idx" @click="prep">Prepare</button>
            <div class="captain" v-if="status !== 0 && captain === idx">[Captain]</div>
            <div class="inteam" v-if="status !== 0 && team.includes(idx)">[In team]</div>
            <div class="vote_status" v-if="(status === 3 || d_task_res) && team.includes(idx)">
                <div class="voted" v-if="taskvote[idx] === -2">?</div>
            </div>
            <div class="vote_status" v-if="status === 2 || d_team_res">
                <div class="voted" v-if="teamvote[idx] === -2">?</div>
                <div class="agree" v-if="teamvote[idx] === 1"></div>
                <div class="disagree" v-if="teamvote[idx] === 0"></div>
            </div>
            <input type="checkbox" v-if="(status === 1 && captain === my_seat)
                                      || (status === 4 && role === 3)"
                v-model="selections" :value="idx">
            <input type="radio" v-if="false" name="player_select" v-model="selection" :value="idx">
            <button v-if="status === 0" @click="move(idx)">{{ _users[userid].seat == idx ? "Leave" : "Sit" }}</button>
        </div>
        </div>
        
        <!-- debug -->
        <!-- <p>{{ seats }}</p> -->
        <p>{{ my_role_name }}, {{ knowledge }}</p>

        <div class="record" style="display: flex;">
            <div v-for="(item, idx) in result" :key="item.id" style="border: 1px solid #DDD; padding: 0.5rem;">
                Round {{ idx + 1 }}: {{ task_player_num[idx] }} : {{ ["-", "fail", "success"][item + 1] }}
                <div v-if="round === idx">o</div>
            </div>
            <div v-for="tn in [ 0, 1, 2, 3, 4 ]" :key="tn.id" style="border: 1px solid #DDD; padding: 0.5rem;">
                {{ tn + 1 }}
                <div v-if="$data.try === tn">o</div>
            </div>
        </div>

        <p>{{ prompt }}</p>

        <button v-if="d_team_res || d_task_res" @click="d_team_res = false; d_task_res = false">OK</button>

        <div class="panel" v-if="status === 2">
            Team vote
            <input type="radio" v-model="selection" :value="1">
            <input type="radio" v-model="selection" :value="0">
            <button @click="submit">确定</button>
        </div>

        <div class="panel" v-if="status === 3 && team.indexOf(my_seat) !== -1">
            Task vote
            <input type="radio" v-model="selection" :value="1">
            <input type="radio" v-model="selection" :value="0">
            <button @click="submit">确定</button>
        </div>

        <div class="panel" v-if="(captain === my_seat && status === 1)
                              || (role === 3 && status === 4)">
            <button @click="submitMulti">确定</button>
        </div>

        <div>
            <div v-for="m in messages" :key="m.id">
                {{ m.name }} : {{ m.text }}
            </div>
            <input v-model="message">
            <button @click="sendMsg">>></button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IUserInfo, IRoomN, IRoomStatus, IRoomOp } from '../common/RoomInterface';
import { IGameStatus, IGameN, IOp } from '../common/AvalonInterface';

const Util = {
    range: function (n: number) {
        var arr = [];
        for (var i = 0; i < n; i++) arr.push(i);
        return arr;
    },
    filled: function (n: number, v: any) {
        var arr = [];
        for (var i = 0; i < n; i++) arr.push(v);
        return arr;
    }
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
    role_name: [
        "梅林",
        "派西维尔",
        "亚瑟的忠臣",
        "刺客",
        "莫甘娜",
        "莫德雷德",
        "奥伯伦",
        "莫德雷德的爪牙",
        // "兰斯洛特AB",
    ],
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
    props: [ "gamen", "msg", "stat", "roomn" ],

    data: function() { return {
        userid: "",
        roomid: "",
        pcount: 5,
        seats: <IUserInfo[]> [],
        prepare: <boolean[]> [],
        round: -1,
        try: -1,
        role: ROLE.Unknown,
        roles: <ROLE[]> [],
        knowledge: <number[]> [],
        selection: -1,
        selections: <number[]> [],
        status: STATUS.Wait,
        captain: 0,
        team: <number[]> [],
        teamvote: <number[]> [],
        taskvote: <number[]> [],
        result: [ -1, -1, -1, -1, -1 ],
        message: "",
        messages: <any[]> [],

        d_team_res: false,
        d_task_res: false,

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
            if (obj.type === "prepare") {
                this.prepare.splice(obj.t, 1, true);
            } else if (obj.type === "join-i") {
                this._users[obj.user.userid] = { seat: -1, info: obj.user };
            } else if (obj.type === "message") {
                this.messages.push({ name: this._users[obj.userid].info.name, text: obj.c });
            } else {
                let u = this._users[obj.userid];
                switch (obj.type) {
                    case "move-i":
                        if (u.seat !== -1) {
                            this.seats.splice(u.seat, 1, <IUserInfo>{ name: '----' });
                            this.prepare.splice(u.seat, 1, false);
                        }
                        if (obj.t !== -1)
                            this.seats.splice(obj.t, 1, u.info);
                        u.seat = obj.t;
                        break;
                    case "disconn-i":
                        if (u.seat !== -1) {
                            this.prepare.splice(u.seat, 1, false);
                        }
                        break;
                    case "reconn-i":
                        break;
                    case "exit-i":
                        delete this._users[obj.userid];
                        break;
                }
            }
        },

        gamen: function (obj: IGameN): void {
            switch (obj.type) {
                case "knowledge":
                    this.knowledge = obj.knowledge;
                    this.role = obj.role;
                    break;
                case "make-team":
                    this.status = STATUS.MakeTeam;
                    this.captain = obj.captain;
                    this.round = obj.round;
                    this.try = obj.try;
                    this.team = [];
                    this.selections = [];
                    break;
                case "team-vote":
                    this.status = STATUS.TeamVote;
                    this.team = obj.team;
                    this.teamvote = Util.filled(this.pcount, -1);
                    this.selection = -1;
                    break;
                case "team-vote-i":
                    this.teamvote.splice(obj.i, 1, -2);
                    break;
                case "team-vote-res":
                    this.teamvote = obj.teamvote;
                    this.d_team_res = true;
                    break;
                case "task-vote":
                    this.status = STATUS.TaskVote;
                    this.team = obj.team;
                    this.selection = -1;
                    this.taskvote = Util.filled(this.pcount, -1);
                    break;
                case "task-vote-i":
                    this.taskvote.splice(obj.i, 1, -2);
                    break;
                case "task-vote-res":
                    // TODO
                    break;
                case "task-end":
                    this.result.splice(obj.round, 1, obj.succ ? 1 : 0);
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
                this.status = game.status;
                this.teamvote = Util.filled(this.pcount, -1);
                this.taskvote = Util.filled(this.pcount, -1);
            }
        },

        move: function (t: number) {
            if (t === this.my_seat) t = -1;
            this.$emit("ev", { type: "room", data: <IRoomOp>{ op: "move", t: t } });
        },

        prep: function () {
            if (this.my_seat === -1) return;
            this.$emit("ev", { type: "room", data: <IRoomOp>{ op: "prepare" }});
        },

        sendMsg: function () {
            this.$emit('ev', { type: 'room', data: { op: 'message', c: this.message }});
        },

        submit: function () {
            var data : IOp;
            if (this.status === STATUS.TeamVote) {
                data = { op: "team-vote", t: this.selection };
            } else if (this.status === STATUS.TaskVote && this.team.indexOf(this.my_seat) !== -1) {
                data = { op: "task-vote", t: this.selection };
            } else return;
            this.$emit("ev", { type: "operate", data: data });
        },

        submitMulti: function () {
            // TODO
            var data : IOp;
            if (this.status === STATUS.MakeTeam && this.captain === this.my_seat) {
                data = { op: "make-team", ts: this.selections };
            } else if (this.status === STATUS.Assassin && this.role === ROLE.Assassin) {
                data = { op: "assassin", t: this.selections[0] };
            } else return;
            this.$emit("ev", { type: "operate", data: data });
        },

        role_to_name: function (r: ROLE) : string {
            if (r < 0) return "-";
            else return config.role_name[r];
        },
    },

    computed: {
        task_player_num: function(): Number[] {
            return config.task_player_num[this.pcount];
        },

        my_seat: function () : number {
            return this._users[this.userid].seat;
        },

        prompt: function () : string {
            switch (this.status) {
                case STATUS.Wait:
                    return "等待开始...";
                case STATUS.MakeTeam:
                    return "等待组队";
                case STATUS.TeamVote:
                    return "投票";
                case STATUS.TaskVote:
                    return "执行任务";
                case STATUS.Assassin:
                    return "刺客选择目标";
                default:
                    return "--";
            }
        },

        my_role_name: function () : string {
            return this.role_to_name(this.role);
        },
    },
});

</script>

<style scoped>
p {
    color: violet;
}

.seat {
    position: relative;
    width: 10rem;
    height: 6rem;
    border: 1px solid gray;
    padding: 0.5rem;
}

.vote_status {
    position: absolute;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    border: 1px solid gray;
    background: gray;
    width: 1.5rem;
    height: 1.5rem;
}

.vote_status > * {
    margin: auto;
    color: white;
    text-align: center;
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.vote_status > .agree {
    background: white;
}

.vote_status > .disagree {
    background: black;
}
</style>
