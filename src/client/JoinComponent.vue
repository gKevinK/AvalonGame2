<template>
    <div>
        <p>Join game panel</p>
        <input type="text" v-model="name" placeholder="昵称">
        <input type="text" v-model="room_id" placeholder="房间号">
        <select v-model.number="player_num">
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
        </select>
        <input type="checkbox" v-model="random_order">
        <input type="number" v-model.number="order">
        <button @click="join_new">创建房间</button>
        <button @click="join">加入</button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    data: function() { return {
        name: '',
        room_id: '',
        player_num: 5,
        random_order: true,
        order: 0,
    }},
    methods: {
        join_new: function(): void {
            this.$emit("join_new", {
                name: this.name,
                player_num: this.player_num,
                order: this.random_order ? -1 : this.order - 1,
            });
        },

        join: function(): void {
            this.$emit("join", {
                name: this.name,
                room_id: this.room_id,
                order: this.random_order ? -1 : this.order - 1,
            });
        },
    }
});
</script>

<style scoped>

</style>
