<template>
  <div id="gridContainer" class="grid">
    <div
        v-for="row, rowIndex in defaultGrid"
        :class="'row'"
        :style="rowStyle()"
        :key="`grid-row-${rowIndex}`">
        <div
            v-for="cell, cellIndex in row"
            :key="`row-${rowIndex}-cell-${cellIndex}`"
            @mousedown="updateGridCell(rowIndex, cellIndex, cell)"
            @mouseenter="updateCellWithDrag(rowIndex, cellIndex, cell)"
            @mouseup="removeDrag()"
            :style="cellStyle(cell)"
            :track-by="cellIndex"
            :class="{cell: true, alive: cell === 'alive' && !animationMode}"></div>
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
    <div :class="'button'">
        <p @click="startAnimation()">{{ playing ? $t('cta.stop') : $t('cta.start') }}</p>
    </div>
    <div :class="'button'">
        <p @click="logGrid()">Log Grid</p>
    </div>
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
        <p><strong>Pick a color</strong></p>
        <div>
            <p>Selected Color</p>
        </div>
        <div :style="{'background-color': selectedColour}">
            <p>{{ selectedColour }}</p>
        </div>
        <p><strong>Available Colors</strong></p>
        <div
            v-for="color in colorOptions"
            :key="`color-option-${color}`"
            :style="{'background-color': color, 'cursor': 'pointer'}"
            @click="updateColour(color)">
            <p>{{ color }}</p>
        </div>
    </template>
    </div>
  </div>
</template>

<script>
import { Field, Form } from 'vee-validate';
import * as yup from 'yup';
import { updateGrid } from "../../utils/utils.js";
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
        defaultLoop: 'sonic',
        colorOptions: [
            '#b06840',
            '#f8b188',
            '#6768f7',
            '#1f45d0',
            '#202088',
            '#f8f8f8',
            '#d0d4f8',
            '#b0b0d0',
            '#686789',
            '#f80100',
            '#900000'
        ],
        selectedColour: '#f8f8f8',
        drag: false
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
      }
  },
  components: {
      Field,
      Form
  },
  mounted() {
      this.updateGridSize();
      this.randomize();
  },
  watch: {
      playing: function(value) {
        if(value) {
            this.t = setInterval(this.updateEntireGrid, 75);
        } else {
            clearInterval(this.t);
        }
      },
      forceStop: function(value) {
          this.playing = !value;
          return;
      },
      animationMode: function(value) {
          if(value) {
              this.defaultGrid = loops[this.defaultLoop][0];
              this.gridSize = loops[this.defaultLoop][0].length;
              this.gridSplit = loops[this.defaultLoop][0][0].length;
          }
      }
  },
  methods: {
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
            this.selectedColour = color;
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
        updateGridCell(rowIndex, cellIndex, cellStatus) {
            if(!this.drag)
                this.drag = true;

            let newGrid = [...this.defaultGrid];
            if(this.animationMode) {
                newGrid[rowIndex][cellIndex] = this.selectedColour;
            } else {
                newGrid[rowIndex][cellIndex] = cellStatus === "alive" ? "dead" : "alive";
            }

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

    &:last-child {
        padding-bottom: 30px;
    }
}

.form {
    margin-top: 20px;

    label {
        padding-right: 10px;
    }
}

@media (min-width: 1024px) {
    .grid {
        max-width: 600px;
        max-height: 600px;
    }
}
</style>
