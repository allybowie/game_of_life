<template>
  <div id="gridContainer" :class="{'grid': true, 'rightAlign': alignment === 'right', 'leftAlign': alignment === 'left'}">
    <Form :class="['form', 'titleInput']" @submit="updateGridSize()" v-if="animationMode">
        <Field
            name="gridsize"
            type="text"
            v-model="pictureTitle"
            placeholder="My Drawing">
            <div :class="'field'">
                <div>
                    <label>{{ $t('forms.labels.pictureTitle') }}</label>
                    <input type="text" v-model="pictureTitle" placeholder="My Drawing"/>
                </div>
            </div>
        </Field>
    </Form>
    <div :class="'mainGrid'">
        <div
            v-for="row, rowIndex in defaultGrid"
            :class="'row'"
            :id="`grid-row-${rowIndex}`"
            :style="rowStyle()"
            :key="`grid-row-${rowIndex}`">
            <div
                v-for="cell, cellIndex in row"
                :key="`row-${rowIndex}-cell-${cellIndex}`"
                :id="`grid-row-${rowIndex}-cell-${cellIndex}`"
                @mousedown="this.colorPicker ? updateColour(cell) : updateGridCell(rowIndex, cellIndex, cell)"
                @mouseenter="this.colorPicker || this.fill || this.addToPalette ? '' : updateCellWithDrag(rowIndex, cellIndex, cell)"
                @mouseup="this.colorPicker || this.fill || this.addToPalette ? '' : removeDrag()"
                :style="cellStyle(cell)"
                :track-by="cellIndex"
                :class="{cell: true && !animationMode, alive: cell === 'alive' && !animationMode, blankAnimationCell: cell === '', pickColour: colorPicker, noGrid: playAnimationLoop}">
            </div>
        </div>
        <div :class="'onionSkin'" v-if="animationMode && parseInt(onionSkinIndex) !== 0 && !playAnimationLoop">
            <div
                v-for="row, rowIndex in onionSkinLayer"
                :class="'row'"
                :id="`onion-skin-grid-row-${rowIndex}`"
                :style="rowStyle()"
                :key="`onion-skin-grid-row-${rowIndex}`">
                <div
                    v-for="cell, cellIndex in row"
                    :key="`onion-skin-row-${rowIndex}-cell-${cellIndex}`"
                    :id="`onion-skin-grid-row-${rowIndex}-cell-${cellIndex}`"
                    :style="cellStyle(cell)"
                    :track-by="cellIndex"
                    :class="{blankAnimationCell: cell === '', pickColour: colorPicker}">
                </div>
            </div>
        </div>
        <div :class="'onionSkinSlider'">
            <p><strong>Onion Skin</strong></p>
            <div :class="'onionSkinLabels'">
                <p>Prev</p>
                <p>Off</p>
                <p>Next</p>
            </div>
            <input type="range" min="-1" max="1" v-model="onionSkinIndex"/>
        </div>
    </div>
    <div v-if="animationMode" :class="'toolContainer'">
        <div :class="'colorWheelContainer'">
            <input id="colourWheel" type="color" v-model="selectedColour"/>
            <div @click="openColourWheel()" :class="'colourLabelContainer'">
                <p>{{ selectedColour }}</p>
            </div>
        </div>
        <div :class="['button', 'resetMargin']">
            <p @click="toggleColourPicker()">{{ $t('cta.colourPicker') }}</p>
        </div>
        <div
            :class="['button', 'resetMargin']"
            :style="{'cursor': 'pointer'}"
            @click="toggleEraser()">
            <p>Eraser</p>
        </div>
        <div :class="['button', 'resetMargin']">
            <p @click="toggleFill()">{{ $t('cta.fill') }}</p>
        </div>
        <!-- <div :class="['button', 'resetMargin']">
            <p @click="toggleAddToPalette()">Add To Palette</p>
        </div> -->
    </div>
    <Form :class="'form'" @submit="updateGridSize()" v-if="!animationMode">
        <Field
            name="gridsize"
            type="text"
            :rules="gridSizeRules"
            v-model="gridSize"
            :placeholder="$t('forms.placeholders.pleaseSelect')"
            v-slot="{ errors }">
            <div :class="'field'">
                <div>
                    <label>{{ $t('forms.labels.gridSize') }}</label>
                    <input type="text" v-model="gridSize" :placeholder="$t('forms.placeholders.pleaseSelect')"/>
                </div>
                <span :class="'error'" v-if="errors[0]">{{generateError(errors[0])}}</span>
            </div>
        </Field>
    </Form>
    <div :class="'buttonContainer'">
    <div :class="'button'" v-if="!animationMode">
        <p @click="startAnimation()">{{ playing ? $t('cta.stop') : $t('cta.start') }}</p>
    </div>
    <!-- <div :class="'button'">
        <p @click="logGrid()">Log Grid</p>
    </div> -->
    <template v-if="!animationMode">
    <div :class="'button'">
        <p @click="randomize()">{{ $t('cta.random') }}</p>
    </div>
    <div :class="'optionsDescriptionContainer'">
        <p v-for="item, index in $tm('grid.resurrectAndKillDescription')" :key="`resurrect-and-kill-all-description-item-${index}`">{{ item }}</p>
    </div>
    <div :class="'button'">
        <p @click="randomize('alive')">{{ $t('cta.resurrect') }}</p>
    </div>
    <div :class="'button'">
        <p @click="randomize('dead')">{{ $t('cta.killAll') }}</p>
    </div>
    </template>
    <template v-else>
        <p v-if="usedColours.length"><strong>Colour History</strong></p>
        <div id="colourHistoryContainer" :class="'colourHistoryContainer'">
            <div
                v-for="color in usedColours"
                :key="`color-option-${color}`"
                :style="colorHistoryWidth(color)"
                @click="updateColour(color)">
            </div>
        </div>
        <div :class="'toolContainer'">
        <div
            :class="'button'"
            @click="exportImage()">
            <p>{{ $t('cta.export') }}</p>
        </div>
        <div
            :class="'button'"
            @click="exportSpriteSheet()">
            <p>Export Sprite Sheet</p>
        </div>
        <div
            :class="'button'"
            @click="addAnimationFrame()">
            <p>{{ $t('cta.addFrame') }}</p>
        </div>
        <div
            :class="'button'"
            @click="addAnimationFrame(true)">
            <p>{{ $t('cta.duplicateFrame') }}</p>
        </div>
        <div
            :class="'button'"
            @click="saveFrame()">
            <p>{{ $t('cta.saveFrame') }}</p>
        </div>
        <div
            :class="'button'"
            @click="clearCanvas()">
            <p>{{ $t('cta.clearCanvas') }}</p>
        </div>
        <div
            :class="'button'"
            @click="clearFrames()">
            <p>{{ $t('cta.clearFrames') }}</p>
        </div>
        <div
            v-if="$store.state.animationLoops.length > 1"
            :class="'button'"
            @click="toggleLoopEnabled()">
            <p>{{ this.playAnimationLoop ? "Stop" : "Play" }}</p>
        </div>
        </div>
        
    </template>
    </div>
  </div>
</template>

<script>
import { Field, Form } from 'vee-validate';
import * as yup from 'yup';
// import GIFEncoder from 'gifencoder';
import { updateGrid, fillColour } from "../../utils/utils.js";
import loops from "../../data/animations/walks.json";

export default {
  name: 'grid-container',
  data() {
    return {
        gridSize: 45,
        defaultGrid: [],
        playing: false,
        gridSplit: 45,
        gridSizeRules: yup.number().required().min(8).max(45),
        defaultLoop: 'sonicTwo',
        usedColours: [
        ],
        selectedColour: '#202420',
        drag: false,
        colorPicker: false,
        fill: false,
        imageLink: '',
        pictureTitle: "",
        onionSkinIndex: 1,
        playAnimationLoop: false,
        animationLoopIndex: 0,
        addToPalette: false
    }
  },
  props: {
      forceStop: {
          type: Boolean,
          default: false
      },
      animationMode: {
          type: Boolean,
          default: false
      },
      alignment: {
          type: String,
          default: ""
      },
      activeFrame: {
          type: Number,
          default: 0
      }
  },
  components: {
      Field,
      Form
  },
  mounted() {
      if(this.animationMode) {
          const startingGrid = this.$store.state.animationLoops.length ? this.$store.state.animationLoops[0] : loops[this.defaultLoop][0];
            this.defaultGrid = startingGrid;
            this.gridSize = startingGrid.length;
            this.gridSplit = startingGrid[0].length;
      } else {
          this.updateGridSize();
          this.randomize();
      }
  },
  watch: {
      playing: function(value) {
        if(value) {
            this.t = setInterval(this.updateEntireGrid, 75);
        } else {
            clearInterval(this.t);
        }
      },
      playAnimationLoop: function(value) {
          if(value) {
              this.t = setInterval(this.nextFrame, 41);
          } else {
              clearInterval(this.t);
              this.defaultGrid = this.$store.state.animationLoops[this.activeFrame];
          }
      },
      forceStop: function(value) {
          this.playing = !value;
          return;
      },
      animationMode: function(value) {
          if(this.playing)
            this.playing = false;

          if(value) {
              this.defaultGrid = loops[this.defaultLoop][0];
              this.gridSize = loops[this.defaultLoop][0].length;
              this.gridSplit = loops[this.defaultLoop][0][0].length;
          } else {
            this.updateGridSize();
            this.randomize();
          }
      },
      activeFrame(value) {
          const frame = [...this.$store.state.animationLoops][value];
          this.gridSize = frame.length;
          this.gridSplit = frame.length;
          this.defaultGrid = frame;
      }
  },
  computed: {
      onionSkinLayer() {
            if(parseInt(this.onionSkinIndex) === 0)
                return;
                    
            return this.$store.state.animationLoops[this.activeFrame + parseInt(this.onionSkinIndex)];
      }
  },
  methods: {
        // exportGif() {
        //     let encoder = new GIFEncoder;
        // },
        toggleLoopEnabled() {
            this.playAnimationLoop = !this.playAnimationLoop;
        },
        updateOnionSkin(value = 0) {
            if(value === 0) {
                this.onionSkin = 0;
                return;
            }
            
            this.onionSkin = this.activeFrame + value;
            return;
        },
        clearFrames() {
            this.$store.commit("CLEAR_FRAMES");
            return;
        },
        clearCanvas() {
            const rowAmount = parseInt(this.gridSize);
            const emptyCanvas = Array(rowAmount).fill(Array(rowAmount).fill(""));
            this.defaultGrid = emptyCanvas;
        },
        saveFrame() {
            if(!this.$store.state.animationLoops.length) {
                this.addAnimationFrame()
                return;
            }
            const updateObject = {
                grid: [...this.defaultGrid],
                index: this.activeFrame
            }
            this.$store.commit("UPDATE_FRAME", updateObject);
            this.$emit("savedFrame")
            return;
        },
        colorHistoryWidth(colour) {
            const container = document.getElementById("colourHistoryContainer");
            const width = (container.offsetWidth / 10).toString() + "px";
            return {
                'background-color': colour,
                height: width
            }
            
        },
        openColourWheel() {
            const colourWheel = document.getElementById("colourWheel");
            colourWheel.click();
            return;
        },
        exportImage() {
            let canv = document.createElement("canvas");
            canv.setAttribute('width', this.gridSize);
            canv.setAttribute('height', this.gridSize);

            const ctx = canv.getContext('2d');

            this.defaultGrid.forEach((row, rowIndex )=> {
                row.forEach((cell, cellIndex) => {
                    ctx.fillStyle = cell || "rgba(0, 0, 0, 0)";
                    ctx.fillRect(cellIndex, rowIndex, 1, 1)
                })
            });

            this.imageLink = ctx.canvas.toDataURL("img/png")

            let downloadLink = document.createElement("a");
            downloadLink.href = this.imageLink;
            downloadLink.download = this.pictureTitle.replace(/\s/g, "-") || "My-Drawing";
            downloadLink.click();
            downloadLink.remove();

            return;
        },
        exportSpriteSheet() {
            const sprites = [...this.$store.state.animationLoops];

            let canv = document.createElement("canvas");

            const width = sprites.length * sprites[0][0].length;

            canv.setAttribute('width', width);
            canv.setAttribute('height', sprites[0][0].length);
            
            const ctx = canv.getContext('2d');

            const spriteSheetArray = [];

            for(let i = 0; i < sprites[0].length - 1; i++) {
                let thisRow = []
                sprites.forEach((sprite) => {
                    thisRow.push(sprite[i])
                })

                spriteSheetArray.push([...thisRow].flat())
            }

            spriteSheetArray.forEach((row, rowIndex )=> {
                row.forEach((cell, cellIndex) => {
                    ctx.fillStyle = cell || "rgba(0, 0, 0, 0)";
                    ctx.fillRect(cellIndex, rowIndex, 1, 1)
                })
            });

            const spriteSheetLink = ctx.canvas.toDataURL("img/png")

            let downloadLink = document.createElement("a");
            downloadLink.href = spriteSheetLink;
            downloadLink.download = this.pictureTitle.replace(/\s/g, "-") || "My-Animation";
            downloadLink.click();
            downloadLink.remove();
        },
        toggleEraser() {
            this.eraser = true;
            this.addToPalette = false;
            this.fill = false;
            this.colorPicker = false;
        },
        toggleAddToPalette() {
            this.eraser = false;
            this.fill = false;
            this.colorPicker = false;
            this.addToPalette = !this.addToPalette;
        },
        toggleFill() {
            this.eraser = false;
            this.colorPicker = false;
            this.addToPalette = false;
            this.fill = true;
        },
        toggleColourPicker() {
            this.eraser = false;
            this.fill = false;
            this.addToPalette = false;
            this.colorPicker = !this.colorPicker;
        },
        addAnimationFrame(duplicate = false) {
            let gridObject = {
                grid: [...this.defaultGrid],
                index: this.activeFrame + 1
            }
            if(!this.$store.state.animationLoops.length) {
                this.$store.commit('ADD_ANIMATION_FRAME', gridObject);
                return;
            }

            if(duplicate) {
                gridObject.grid = this.$store.state.animationLoops[this.activeFrame];
                this.$store.commit("ADD_ANIMATION_FRAME", gridObject);
            } else {
                const rowAmount = parseInt(this.gridSize);
                const emptyFrame = Array(rowAmount).fill(Array(rowAmount).fill(""));
                gridObject.grid = emptyFrame;
                this.$store.commit("ADD_ANIMATION_FRAME", gridObject);
            }
            return;
        },
        updateCellWithDrag(rowIndex, cellIndex, cell) {
            if(!this.drag)
                return;
            
            this.updateGridCell(rowIndex, cellIndex, cell);
            return;
        },
        removeDrag() {
            this.drag = false;
        },
        logGrid() {
            console.log("Grid: ", this.defaultGrid);
        },
        updateColour(color) {
            if(!color)
                return;

            this.selectedColour = color;
            this.toggleColourPicker();
            return;
        },
        generateError(error) {
            if(error.includes("greater than")) return this.$t('errors.minValue', ['8']);
            if(error.includes("less than")) return this.$t('errors.maxValue', ['45']);
            return error.includes('value `""`') ?  this.$t('errors.required') :  this.$t('errors.requiredType');
        },
        randomize(forceStatus = "") {
            this.playing = false;
            const newGridLayout = [...this.defaultGrid].map(row => {
                return row.map(() => {
                    return forceStatus ? forceStatus : (Math.random() <= 0.5 ? "alive" : "dead");
                })
            })

            this.defaultGrid = newGridLayout;
        },
        updateEntireGrid() {
            const newGridObject = updateGrid([...this.defaultGrid]);

            let newGrid = newGridObject.grid;

            if(!newGridObject.updated) {
                this.playing = false;
                return;
            }

            this.defaultGrid = newGrid;
        },
        nextFrame() {
            this.defaultGrid = this.$store.state.animationLoops[this.animationLoopIndex];
            if(this.animationLoopIndex < this.$store.state.animationLoops.length - 1) {
                this.animationLoopIndex = this.animationLoopIndex + 1;
            } else {
                this.animationLoopIndex = 0;
            }
            return;
        },
        compareGrid(newGrid) {
            newGrid.forEach((row, index) => {
                if(!this.compareRow(row, index))
                    return false;
            })

            return true;
        },
        compareRow(row, rowIndex) {
            row.forEach((cell, index) => {
                const originalCell = this.defaultGrid[rowIndex][index];
                if(cell != originalCell)
                    return false
            })

            return true;
        },
        updateUsedColours(colour = "") {
            const newColour = colour ? colour : this.selectedColour;
            if(this.usedColours.includes(newColour))
                return;

            let updatedUsedColours = [...this.usedColours];
            updatedUsedColours.push(newColour);
            this.usedColours = updatedUsedColours;
        },
        updateGridCell(rowIndex, cellIndex, cellStatus) {
            let newGrid = [...this.defaultGrid];

            if(this.addToPalette) {
                this.updateUsedColours([...this.defaultGrid][rowIndex][cellIndex]);
                return;
            }

            if(this.fill) {
                newGrid = fillColour([...this.defaultGrid], rowIndex, rowIndex, cellIndex, this.selectedColour, true, false, [], [...this.defaultGrid][rowIndex], [...this.defaultGrid][rowIndex][cellIndex]);
                this.defaultGrid = newGrid;
                this.fill = false;
                this.updateUsedColours();
                return;
            }

            if(!this.drag)
                this.drag = true;

            if(this.animationMode) {
                let row = [...newGrid[rowIndex]];

                row[cellIndex] = this.eraser ? '' : this.selectedColour;
                newGrid[rowIndex] = row;
            } else {
                newGrid[rowIndex][cellIndex] = cellStatus === "alive" ? "dead" : "alive";
            }

            this.updateUsedColours();

            this.defaultGrid = newGrid;
        },
        startAnimation() {
            this.playing = !this.playing;
            this.$emit('nowPlaying', this.playing);
        },
        updateGridSize() {
            const rowAmount = parseInt(this.gridSize);
            const rows = Array(rowAmount).fill(Array(rowAmount).fill(""));
            this.defaultGrid = rows;
            this.gridSplit = this.gridSize;
            this.randomize();
        },
        cellStyle(cell) {
            const width = `calc(100% / ${this.gridSplit})`
            let styleObj = {
                'width': width
            }

            if(this.animationMode) styleObj['background-color'] = cell;

            return styleObj;
        },
        rowStyle() {
            const grid = document.getElementById("gridContainer");
            if(!grid)
                return;
            const pixels = grid.offsetWidth / this.gridSplit;
            const height = pixels + "px";

            return {
                height
            }
        }
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  width: 200%;
}

.mainGrid {
    position: relative;
}

.onionSkin {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.3;
}

.onionSkinSlider {
    position: absolute;
    bottom: 0;
    left: -175px;
    width: 150px;
}

.onionSkinLabels {
    display: flex;
    justify-content: space-between;
    p {
        font-size: 13px;
    }
}

.grid {
    margin: 0 auto;
    width: 100%;
    max-width: 320px;
    height: 100vw;
    max-height: 320px;
}

.buttonContainer {
    display: flex;
    flex-direction: column;
}

.optionsDescriptionContainer {
    p {
        font-size: 13px;
        margin-bottom: 5px;
        margin-top: 0px;
    }
}

.colourHistoryContainer {
    display: flex;
    flex-wrap: wrap;

    div {
        cursor: pointer;
        width: 10%;
        // height:
    }
}

.colorWheelContainer {
    height: 50px;
    width: 100px;
    cursor: pointer;
    position: relative;
    text-align: center;

    input[type=color] {
        width: 100%;
        height: 100%;
    }

    p {
        background-color: #ffffff;
        display: inline-block;
        margin-top: 16px;
        margin-bottom: 0;
        padding: 0px 5px;
        font-size: 13px;
    }
}

.colourLabelContainer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.toolContainer {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 20px 0 0;
}

.field {
    display: flex;
    flex-direction: column;
    max-width: 320px;
    margin: 0 auto;

    span {
        &.error {
            margin-top: 10px;
            font-size: 13px;
            color: red;
        }
    }
}

.row {
    width: 100%;
    display: flex;
    margin: 0 auto;
}

.cell {
    background-color: black;
}

.blankAnimationCell {
    box-sizing: border-box;
    border: 0.5px solid grey;
}

.noGrid {
    border: none;
}

.alive {
    background-color: grey;
}

.button {
    display: inline-block;

    p {
        cursor: pointer;
        display: inline-block;
        border: 2px solid #2c3e50;
        padding: 10px;
        border-radius: 4px;
        width: 100px;
    }

    a {
        cursor: pointer;
        display: inline-block;
        border: 2px solid #2c3e50;
        color: #2c3e50;
        padding: 10px;
        border-radius: 4px;
        width: 100px;
        text-decoration: none;
    }

    &:last-child {
        padding-bottom: 30px;

        &.resetMargin {
            padding-bottom: 0
        }
    }
}

.resetMargin {
    p {
        margin: 0;
    }
}

.form {
    margin-top: 20px;

    label {
        padding-right: 10px;
    }
}

.titleInput {
    margin-bottom: 20px;

    label {
        color: #2c3e50;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        font-weight: bold;
        font-size: 16px;
    }
}

.keyFeaturesButtonsContainer {
    display: flex;
    justify-content: space-between;
}

@media (min-width: 1024px) {
    .grid {
        max-width: 600px;
        max-height: 600px;
    }

    .rightAlign {
        margin-right: 0;
    }

    .leftAlign {
        margin-left: 0;
    }
}

.animationCursor {

}

.pickColour {
    cursor: crosshair;
}
</style>
