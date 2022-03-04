const { updateGrid } = require("../src/utils/utils.js");
const testData = require("./testData.json");

describe("It updates the grid with a new state according to the game's rules.", () => {

    test("Returns an array of equal length to what was passed in.", () => {
        expect(updateGrid(testData.initialGrid).grid.length).toBe(testData.initialGrid.length)
    });

    test("A dead cell with exactly three live neighbours becomes alive.", () => {
        expect(updateGrid(testData.initialGrid).grid[2][3]).toBe("alive")
    });

    test("A dead cell with more than three live neighbours stays dead.", () => {
        expect(updateGrid(testData.initialGrid).grid[6][1]).toBe("dead")
    });

    test("A dead cell with less than three live neighbours stays dead.", () => {
        expect(updateGrid(testData.initialGrid).grid[7][7]).toBe("dead")
    });

    test("A living cell with less than two live neighbours dies.", () => {
        expect(updateGrid(testData.initialGridTwo).grid[1][1]).toBe("dead")
    });

    test("A living cell with either two or three live neighbours survives.", () => {
        expect(updateGrid(testData.initialGridTwo).grid[7][1]).toBe("alive")
        expect(updateGrid(testData.initialGridTwo).grid[7][3]).toBe("alive")
    });

    test("A living cell with more than three live neighbours dies.", () => {
        expect(updateGrid(testData.initialGrid).grid[7][1]).toBe("dead")
    });
})

describe("It compares the original grid to the new grid.", () => {
    test("An updated grid returns a value of true in the 'updated' field.", () => {
        expect(updateGrid(testData.initialGrid).updated).toBe(true)
    });

    test("An unchanged grid returns a value of false in the 'updated' field.", () => {
        expect(updateGrid(testData.allDead).updated).toBe(false)
    });
})