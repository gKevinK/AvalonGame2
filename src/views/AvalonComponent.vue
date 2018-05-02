<template>
    <div>
        <p>Avalon Game Panel</p>
        <div v-for="(item, idx) in seats" :key="item.id">
            <div>Player {{ idx }}: {{ item.name }}</div>
            <div class="capital" v-if="capital == idx">[capital]</div>
            <div class="inteam" v-if="team.includes(idx)">[in team]</div>
            <div class="agree" v-if="false">[agree]</div>
            <div class="disagree" v-if="false">[disagree]</div>
            <input type="checkbox" v-if="status == STATUS.MakeTeam && capital == idx"
                v-model="selections" :value="idx">
            <input type="radio" v-if="false" name="player_select" v-model="selection" :value="idx">
        </div>

        <div>{{ op }}</div>
        <div class="panel" v-if="[ STATUS.TeamVote, STATUS.TaskVote ].includes(status)">
            <input type="radio" v-model="selection" :value="1">
            <input type="radio" v-model="selection" :value="0">
            <button @click="alert(1)">确定</button>
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
    role: {
        5:  [0, 1, 2, 3, 4],
        6:  [0, 1, 2, 2, 3, 4],
        7:  [0, 1, 2, 2, 3, 4, 6],
        8:  [0, 1, 2, 2, 2, 3, 4, 7],
        9:  [0, 1, 2, 2, 2, 2, 3, 4, 5],
        10: [0, 1, 2, 2, 2, 2, 3, 4, 5, 6],
    },
    task_player_num: {
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
    props: [ "op" ],

    data: function() { return {
        seats: new Array({}, {}),
        round: -1,
        try: -1,
        selection: -1,
        selections: [],
        status: STATUS.MakeTeam,
        capital: 0,
        team: [],
        teamvote: [],
        taskvote: [],
    } },

    watch: {
        op: function(newOp): void {
            let opr = <IOperationObject>JSON.parse(newOp);
            switch (opr.op) {
                case "make-team":
                    this.status = STATUS.MakeTeam;
                    this.capital = opr.t;
                    break;
                case "team-vote":
                    this.status = STATUS.TeamVote;
                    this.team = opr.ts;
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
                    this.tas
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
                    // TODO
                    break;
                case "end":
                    // TODO
                    break;
            }
        }
    },

    methods: {

    },

    computed: {

    },
});

</script>

<style scoped>
p {
    color: violet;
}
</style>
