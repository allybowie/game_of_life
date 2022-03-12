import { createStore } from 'vuex';
import state from "./state.js";
import mutations from "./mutations.js";

const store = createStore({
    state,
    mutations
})

export default store;