<template>
    <div id="framesContainer" class="framesContainer">
        <p><strong>Frames</strong></p>
        <div id="framesContainerInner" :class="'containerInner'">
            <div :class="'frameContainer'" v-for="frame, index in frames" :key="`frame-canvas-${index}`">
                <canvas
                    :id="`frame-canvas-${index}`"
                    :class="{'frameCanvas': true, 'active': activeFrame === index}"
                    @click="updateActiveFrame(index)"></canvas>
                <div :class="'deleteButton'" @click="deleteFrame(index)"></div>
            </div>
            <div :class="'scrollIcon'"></div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'frames-list',
  data() {
      return {
        activeFrame: 0
      }
  },
  props: {
      frames: {
          type: Array,
          required: true
      }
  },
  mounted() {
      this.frames.forEach((frame, index) => {
          this.createCanvasForFrame(index);
      })
  },
  watch: {
      frames: function(updatedFrames, previousFrames) {
          let saved = false;
          updatedFrames.forEach((frame, index) => {
              if(previousFrames[index] && updatedFrames[index] !== previousFrames[index])
                saved = true;

              if(updatedFrames[index] !== previousFrames[index] || !previousFrames[index]);
                this.createCanvasForFrame(index);
          })
          if(updatedFrames.length === previousFrames.length)
            return;

          if(!saved) {
            this.activeFrame = updatedFrames.length - 1;
            this.updateActiveFrame(this.activeFrame)
          }


          return;
      }
  },
  computed: {
      needsScrolling() {
          const outerHeight = document.getElementById("framesContainer").offsetHeight;
          const innerHeight = document.getElementById("framesContainerInner").offsetHeight;

        //   console.log("Outer: ", outerHeight);
        //   console.log("Inner: ", innerHeight)

          return innerHeight > outerHeight;
      }
  },
  methods: {
      deleteFrame(index) {
          const currentFrame = index === this.activeFrame;
          this.$store.commit("UPDATE_CURRENT_FRAME_DELETED", currentFrame);
          this.$store.commit("REMOVE_FRAME", index)
      },
      updateActiveFrame(index) {
          this.activeFrame = index;
          this.$emit("updateActiveFrame", index)
      },
      createCanvasForFrame(index) {
        this.$nextTick(() => {
            let canv = document.getElementById(`frame-canvas-${index}`);
    
            canv.setAttribute('width', this.frames[index].length);
            canv.setAttribute('height', this.frames[index].length);
    
            const ctx = canv.getContext('2d');
    
              this.frames[index].forEach((row, rowIndex )=> {
                    row.forEach((cell, cellIndex) => {
                        ctx.fillStyle = cell || "rgba(0, 0, 0, 0)";
                        console.log
                        ctx.fillRect(cellIndex, rowIndex, 1, 1)
                    })
                });
        })
      }
  }
}
</script>

<style lang="scss" scoped>

.framesContainer {
    display: flex;
    flex-direction: column;
    height: 85%;

    p {
        font-size: 16px;
    }

    canvas {
        width: 50%;
        margin: 0 auto;
        cursor: pointer;
    }
}

.containerInner {
    height: 100%;
    overflow: scroll;
}

.frameContainer {
    position: relative;
}

.scrollIcon {
    position: absolute;
    bottom: 0;
    left: -20px;
    width: 20px;
    height: 20px;

    &::before {
        content: "<";
        position: absolute;
        top: 0;
        left: 0;
        transform: rotate(90deg);
    }
}

.deleteButton {
    position: absolute;
    top: 25px;
    right: 25px;
    width: 20px;
    height: 20px;
    cursor: pointer;

    &::before {
        content: "";
        height: 3px;
        width: 20px;
        transform: rotate(45deg);
        background-color: #2c3e50;
        position: absolute;
        top: 0;
        right: 0;
    }

    &::after {
        content: "";
        height: 3px;
        width: 20px;
        transform: rotate(135deg);
        background-color: #2c3e50;
        position: absolute;
        top: 0;
        right: 0;
    }
}

.frameCanvas {
    border: 2px transparent solid;
    border-radius: 4px;
    padding: 10px;
    box-sizing: border-box;
    // bottom: 10px;
}

.active {
    border: 2px black solid;
    border-radius: 6px;
    padding: 10px;
    box-sizing: border-box;
}
</style>
