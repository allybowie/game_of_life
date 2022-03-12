const { updateGrid, fillColour } = require("../src/utils/utils.js");
const testData = require("./testData.json");
const walks = require("../src/data/animations/walks.json");

// describe("It updates the grid with a new state according to the game's rules.", () => {

//     test("Returns an array of equal length to what was passed in.", () => {
//         expect(updateGrid(testData.initialGrid).grid.length).toBe(testData.initialGrid.length)
//     });

//     test("A dead cell with exactly three live neighbours becomes alive.", () => {
//         expect(updateGrid(testData.initialGrid).grid[2][3]).toBe("alive")
//     });

//     test("A dead cell with more than three live neighbours stays dead.", () => {
//         expect(updateGrid(testData.initialGrid).grid[6][1]).toBe("dead")
//     });

//     test("A dead cell with less than three live neighbours stays dead.", () => {
//         expect(updateGrid(testData.initialGrid).grid[7][7]).toBe("dead")
//     });

//     test("A living cell with less than two live neighbours dies.", () => {
//         expect(updateGrid(testData.initialGridTwo).grid[1][1]).toBe("dead")
//     });

//     test("A living cell with either two or three live neighbours survives.", () => {
//         expect(updateGrid(testData.initialGridTwo).grid[7][1]).toBe("alive")
//         expect(updateGrid(testData.initialGridTwo).grid[7][3]).toBe("alive")
//     });

//     test("A living cell with more than three live neighbours dies.", () => {
//         expect(updateGrid(testData.initialGrid).grid[7][1]).toBe("dead")
//     });
// })

// describe("It compares the original grid to the new grid.", () => {
//     test("An updated grid returns a value of true in the 'updated' field.", () => {
//         expect(updateGrid(testData.initialGrid).updated).toBe(true)
//     });

//     test("An unchanged grid returns a value of false in the 'updated' field.", () => {
//         expect(updateGrid(testData.allDead).updated).toBe(false)
//     });
// })

describe("Drawing - It can fill in an area of cells with the same colour with a new selected colour", () => {
    const testFill = fillColour(testData.fillTestOne, 1, 1, 2, '#202088', true, false, [], testData.fillTestOne[1]);
    const testFillCracks = fillColour(testData.fillTestTwo, 3, 3, 2, '#202088', true, false, [], testData.fillTestTwo[3]);
    const testFillSonic = fillColour(walks.sonicTwo[0], 34, 34, 34, '#202088', true, false, [], walks.sonicTwo[0][34]);
    test("The clicked cell is updated", () => {
        expect(testFill[1][2]).toBe('#202088')
    });

    test("The cell next to the clicked cell which has the same colour as it is updated to the new colour", () => {
        expect(testFill[1][3]).toBe('#202088');
        expect(testFill[1][1]).toBe('#202088');
    });

    test("The cell that is a different colour ends the fill on that row, and it doesn't change colour", () => {
        expect(testFill[1][4]).toBe('#1f45d0');
        expect(testFill[1][5]).toBe('');
    });

    test("The cell above the clicked cell which has the same colour as it is updated to the new colour", () => {
        expect(testFill[0][2]).toBe('#202088');
    });

    test("The cells next to this cell which has the same colour as it is updated to the new colour", () => {
        expect(testFill[0][3]).toBe('#202088');
        expect(testFill[0][1]).toBe('#202088');
    });

    test("The row above the initial row ends its fill when a new colour is encountered", () => {
        expect(testFill[0][4]).toBe('#1f45d0');
        expect(testFill[0][0]).toBe('#1f45d0');
        expect(testFill[0][5]).toBe('');
    });

    test("The cell below the clicked cell which has the same colour as it is updated to the new colour", () => {
        expect(testFill[2][2]).toBe('#202088');
    });

    test("The cells next to this cell which has the same colour as it is updated to the new colour", () => {
        expect(testFill[2][3]).toBe('#202088');
        expect(testFill[2][1]).toBe('#202088');
    });

    test("The row below the initial row ends its fill when a new colour is encountered", () => {
        expect(testFill[2][4]).toBe('#1f45d0');
        expect(testFill[2][0]).toBe('#1f45d0');
        expect(testFill[2][5]).toBe('');
    });

    test("The cell 2 rows below the clicked cell which has the same colour as it is updated to the new colour", () => {
        expect(testFill[3][2]).toBe('#202088');
    });

    test("The cells next to this cell which has the same colour as it is updated to the new colour", () => {
        expect(testFill[3][3]).toBe('#202088');
        expect(testFill[3][1]).toBe('#202088');
    });

    test("The row below the initial row ends its fill when a new colour is encountered", () => {
        expect(testFill[3][4]).toBe('#1f45d0');
        expect(testFill[3][0]).toBe('#1f45d0');
        expect(testFill[3][5]).toBe('#1f45d0');
        expect(testFill[3][6]).toBe('');
    });

    test("The entire 5th row is the new colour", () => {
        expect(testFill[4][0]).toBe('#202088');
        expect(testFill[4][1]).toBe('#202088');
        expect(testFill[4][2]).toBe('#202088');
        expect(testFill[4][3]).toBe('#202088');
        expect(testFill[4][4]).toBe('#202088');
        expect(testFill[4][5]).toBe('#202088');
        expect(testFill[4][6]).toBe('#202088');
        expect(testFill[4][7]).toBe('#202088');
    });

    test("None of the 6th row is updated", () => {
        expect(testFill[5][0]).toBe('#1f45d0');
        expect(testFill[5][1]).toBe('#1f45d0');
        expect(testFill[5][2]).toBe('#1f45d0');
        expect(testFill[5][3]).toBe('#1f45d0');
        expect(testFill[5][4]).toBe('#1f45d0');
        expect(testFill[5][5]).toBe('#1f45d0');
        expect(testFill[5][6]).toBe('#1f45d0');
        expect(testFill[5][7]).toBe('#1f45d0');
    });

    test("None of the 7th row is updated", () => {
        expect(testFill[6][0]).toBe('');
        expect(testFill[6][1]).toBe('');
        expect(testFill[6][2]).toBe('');
        expect(testFill[6][3]).toBe('');
        expect(testFill[6][4]).toBe('');
        expect(testFill[6][5]).toBe('');
        expect(testFill[6][6]).toBe('');
        expect(testFill[6][7]).toBe('');
    });

    test("None of the 8th row is updated", () => {
        expect(testFill[7][0]).toBe('');
        expect(testFill[7][1]).toBe('');
        expect(testFill[7][2]).toBe('');
        expect(testFill[7][3]).toBe('');
        expect(testFill[7][4]).toBe('');
        expect(testFill[7][5]).toBe('');
        expect(testFill[7][6]).toBe('');
        expect(testFill[7][7]).toBe('');
    });

    test("All cells eligible to be filled (above) are filled even if the cell above the clicked cell is not eligible", () => {
        expect(testFillCracks[3][1]).toBe('#202088');
    })

    test("If the cell above the clicked cell is a different colour, its colour does not change", () => {
        expect(testFillCracks[2][2]).toBe('#1f45d0');
    });

    test("Goes all the way to the top!", () => {
        expect(testFillSonic[19][36]).toBe('#202088');
        expect(testFillSonic[19][37]).toBe('#202088');
    })

    test("It stops when it hits a block that isn't the clicked colour when outside the previous row's range", () => {
        expect(testFillSonic[37][17]).toBe('');
    })
});