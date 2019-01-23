<template>
    <div>
        <div>Join game...</div>
        <input type="text" v-model="input_name" placeholder="昵称">
        <button @click="user_info">确定</button>
        <div v-if="name">
            <input type="text" v-model="room_id" placeholder="房间号">
            <select v-model.number="player_num">
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
            </select>
            <!-- <input type="checkbox" v-model="random_order"> -->
            <input type="number" v-model.number="order">
            <button @click="join_new">创建房间</button>
            <button @click="join">加入</button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IJoinNew, IJoin } from '../common/RoomInterface';
export default Vue.extend({
    props: {
        name: String,
    },
    data: function() { return {
        input_name: '',
        room_id: '',
        player_num: 5,
        random_order: true,
        order: 0,
    } },
    methods: {
        user_info: function(): void {
            this.$emit("ev", { type: "user-info", data: this.input_name });
        },

        join_new: function(): void {
            this.$emit("ev", { type: "join-new", data: <IJoinNew>{
                conf: { num: this.player_num },
                // seat: this.random_order ? -1 : this.order - 1,
            }});
        },

        join: function(): void {
            this.$emit("ev", { type: "join", data: <IJoin>{
                roomid: this.room_id,
                // seat: this.random_order ? -1 : this.order - 1,
            }});
        },
    }
});
</script>

<style scoped>

</style>
