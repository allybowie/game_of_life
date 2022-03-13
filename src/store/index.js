import { createStore } from 'vuex';
import createPersistedState from "vuex-persistedstate";
import state from "./state.js";
import mutations from "./mutations.js";

const store = createStore({
    state,
    mutations,
    plugins: [
        createPersistedState({
          key: "vuex",
          paths: [
            "animationLoops"
          ]
        })
      ]
})

export default store;