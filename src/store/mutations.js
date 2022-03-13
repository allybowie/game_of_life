const mutations = {
    ADD_ANIMATION_FRAME: (state, newAnimationObject) => {
        let animationLoops = [...state.animationLoops];
        animationLoops.splice(newAnimationObject.index, 0, newAnimationObject.grid);
        // animationLoops.push(newAnimationObject.grid);
        state.animationLoops = animationLoops;
    },
    UPDATE_FRAME: (state, updatedFrameObject) => {
        let animationLoops = [...state.animationLoops];
        animationLoops[updatedFrameObject.index] = updatedFrameObject.grid;
        state.animationLoops = animationLoops;
    },
    REMOVE_FRAME: (state, removedFrameIndex) => {
        let animationLoops = [...state.animationLoops];
        animationLoops.splice(removedFrameIndex, 1);
        state.animationLoops = animationLoops;
    },
    CLEAR_FRAMES: (state) => {
        state.animationLoops = [];
    },
    UPDATE_CURRENT_FRAME_DELETED: (state, currentFrameDeleted) => {
        state.currentFrameDeleted = currentFrameDeleted;
    }
}

export default mutations;