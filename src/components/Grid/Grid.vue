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
            @click="updateGridCell(rowIndex, cellIndex, cell)"
            :style="cellStyle()"
            :class="{cell: true, alive: cell === 'alive'}"></div>
    </div>
    <Form :class="'form'" @submit="updateGridSize()">
        <Field
            name="gridsize"
            type="text"
            :rules="gridSizeRules"
            v-model="gridSize"
            placeholder="Please Select..."
            v-slot="{ errors }">
            <div :class="'field'">
                <div>
                    <label>Grid Size</label>
                    <input type="text" v-model="gridSize" v-bind="gridsize" placeholder="Please Select..."/>
                </div>
                <span :class="'error'" v-if="errors[0]">{{generateError(errors[0])}}</span>
            </div>
        </Field>
    </Form>
    <div :class="'button'" @click="startAnimation()">
        <p>{{ playing ? "Stop" : "Start" }}</p>
    </div>
    <div :class="'button'" @click="randomize()">
        <p>Random Grid</p>
    </div>
  </div>
</template>

<script>
import { Field, Form } from 'vee-validate';
import * as yup from 'yup';
import { updateGrid } from "../../utils/utils.js";

export default {
  name: 'grid-container',
  data() {
    return {
        gridSize: 50,
        defaultGrid: [],
        playing: false,
        gridSplit: 50,
        gridSizeRules: yup.number().required().min(8)
    }
  },
  components: {
      Field,
      Form
  },
  mounted() {
      this.updateGridSize();
      this.randomize();
      setInterval(this.updateEntireGrid, 75);
  },
  methods: {
        generateError(error) {
            if(error.includes("greater than")) return "The Grid Size must be greater than or equal to 8."
            return error.includes('value `""`') ? "The 'Grid Size' field is required" : "The 'Grid Size' field must be a number.";
        },
        randomize() {
            this.playing = false;
            const newGridLayout = [...this.defaultGrid].map(row => {
                return row.map(() => {
                    return Math.random() <= 0.5 ? "alive" : "dead";
                })
            })

            this.defaultGrid = newGridLayout;
        },
        updateEntireGrid() {
            if(!this.playing)
                return;

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
            let newGrid = [...this.defaultGrid];
            newGrid[rowIndex][cellIndex] = cellStatus === "alive" ? "dead" : "alive";
            this.defaultGrid = newGrid;
        },
        startAnimation() {
            this.playing = !this.playing;
        },
        updateGridSize() {
            const rowAmount = parseInt(this.gridSize);
            const rows = Array(rowAmount).fill(Array(rowAmount).fill(""));
            this.defaultGrid = rows;
            this.gridSplit = this.gridSize;
            this.randomize();
        },
        cellStyle() {
            const width = `calc(100% / ${this.gridSplit})`

            return {
                'width': width
            }
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
    cursor: pointer;

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
