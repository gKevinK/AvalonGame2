<template>
    <div>
        <p>Avalon Game Panel</p>
        <div v-for="(item, idx) in seats" :key="item.id">
            <div>Player {{ idx }}: {{ item.name }}</div>
            <div class="captain" v-if="captain == idx">[captain]</div>
            <div class="inteam" v-if="team.includes(idx)">[in team]</div>
            <div class="voted" v-if="false">[voted]</div>
            <div class="agree" v-if="false">[agree]</div>
            <div class="disagree" v-if="false">[disagree]</div>
            <input type="checkbox" v-if="status == 1 && captain == idx"
                v-model="selections" :value="idx">
            <input type="radio" v-if="false" name="player_select" v-model="selection" :value="idx">
        </div>

        <div>{{ op }}</div>
        <div class="record">
            <div v-for="(item, idx) in result" :key="item.id">
                {{ idx + 1 }}: {{ task_player_num[idx] }} : {{ ["-", "fail", "success"][item + 1] }}
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
            <div v-for="m in messages" :key="m.id">
                Player {{ m.order + 1 }} : {{ m.text }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

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

interface IOperationObject
{
    op: string;
    t: number;
    ts: Array<number>;
}

export default Vue.extend({
    props: [ "op", "msg" ],

    data: function() { return {
        seats: new Array<{ name: string }>(5),
        pcount: 5,
        round: -1,
        try: -1,
        myseat: -1,
        role: ROLE.Unknown,
        knowledge: <Number[]> [],
        selection: -1,
        selections: <Number[]> [],
        status: STATUS.MakeTeam,
        captain: 0,
        team: <Number[]> [],
        teamvote: <Number[]> [],
        taskvote: <Number[]> [],
        result: [ -1, -1, -1, -1, -1 ],
        messages: <any[]> [],
    } },

    watch: {
        op: function (opr): void {
            switch (opr.type) {
                case "status":
                    this.seats = (<string[]>opr.names).map(n => <{ name: string }>{ name: n });
                    this.pcount = opr.status.pcount;
                    this.status = opr.status.status;
                    this.role = opr.status.role;
                    this.knowledge = opr.status.knowledge;
                    this.result = opr.status.result;
                    this.round = opr.status.round;
                    this.try = opr.status.try;
                    this.captain = opr.status.captain;
                    this.team = opr.status.team;
                    break;
                case "make-team":
                    this.status = STATUS.MakeTeam;
                    this.captain = opr.t;
                    this.selections = [];
                    break;
                case "team-vote":
                    this.status = STATUS.TeamVote;
                    this.team = opr.ts;
                    this.selection = -1;
                    // TODO
                    break;
                case "team-vote-i":
                    (this.teamvote as Array<Number>).splice(opr.t, 1, -2);
                    break;
                case "team-vote-res":
                    // TODO
                    break;
                case "task-vote":
                    this.status = STATUS.TaskVote;
                    this.taskvote = opr.ts;
                    this.selection = -1;
                    // TODO
                    break;
                case "task-vote-i":
                    (this.taskvote as Array<Number>).splice(opr.t, 1, -2);
                    break;
                case "task-vote-res":
                    // TODO
                    break;
                case "assassin":
                    this.status = STATUS.Assassin;
                    this.selections = [];
                    // TODO
                    break;
                case "end":
                    // TODO
                    break;
            }
        },

        msg: function (m: any): void {
            this.messages.push(m);
        },
    },

    methods: {

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
