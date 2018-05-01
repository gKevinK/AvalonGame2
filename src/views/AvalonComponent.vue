<template>
    <div>
        <p>Avalon Game Panel</p>
        <div v-for="(item, idx) in seats" :key="item.id">
            <div>Player {{ idx }}</div>
            <div class="capital"></div>
            <div id="inteam"></div>
            <div id="agree"></div>
            <input type="checkbox" :id="idx" v-model="selections">
            <input type="radio" name="player_select" :value="idx">
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
    data: function() { return {
        seats: new Array(5),
    } },

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
