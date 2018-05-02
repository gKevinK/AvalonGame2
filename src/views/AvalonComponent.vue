<template>
    <div>
        <p>Avalon Game Panel</p>
        <div v-for="(item, idx) in seats" :key="item.id">
            <div>Player {{ idx }}: {{ item.name }}</div>
            <div class="capital" v-if="capital == idx">[capital]</div>
            <div class="inteam" v-if="team.includes(idx)">[in team]</div>
            <div class="agree">[agree]</div>
            <div class="disagree">[disagree]</div>
            <input type="checkbox" v-model="selections" :value="idx">
            <input type="radio" name="player_select" v-model="selection" :value="idx">
        </div>

        <div>{{ op }}</div>
        <div class="panel">
            <button @click="alert(1)">确定</button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

enum ROLE {
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
        seats: new Array({}, {}, {}, {}, {}),
        selection: -1,
        selections: [],
        status: STATUS.Wait,
        capital: 0,
        team: [0, 2, 3],
        teamvote: [],
    } },

    watch: {
        op: function(newOp): void {
            let opr = <IOperationObject>JSON.parse(newOp);
            switch (opr.op) {
                
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
