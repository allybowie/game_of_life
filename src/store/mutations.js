const mutations = {
    SET_ANIMATION_LOOP: (state, newAnimation) => {
        let animationLoops = [...state.animationLoops];
        animationLoops.push(newAnimation);
        state.animationLoops = animationLoops;
    }
}

export default mutations;