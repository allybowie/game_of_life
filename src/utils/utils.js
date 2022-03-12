const updateGrid = (grid) => {
    let changed = false;
    const updatedGrid = grid.map((row, index) => {
        //map through the rows of the grid
        let rowIndexes = [index -1, index, index + 1];
        if(index === 0)
            rowIndexes.splice(0, 1);
        if(index === grid.length -1)
            rowIndexes.splice(2);

        //splice the adjacent rows if it is the first or last row
        //get the current row
        const currentRow = index;

        //map through each row to edit the cells
        return row.map((item, itemIndex) => {
            //get cell value
            const alive = item === "alive";
            //get current cell index
            const currentCellIndex = itemIndex;
            //get the adjectent cell indexes
            const cellIndexes = [itemIndex - 1, itemIndex, itemIndex + 1];
            
            //splice the adjacent rows if it is the first or last row
            if(itemIndex === 0)
                cellIndexes.splice(0, 1);
            if(itemIndex === grid[currentRow].length -1)
                cellIndexes.splice(2);

            //Get the amount of dead and alive cells that surround an individual cell.
            const adjacentValues = rowIndexes.reduce((deadOrAlive, adjecentRow) => {

                //Here we set the initial object values for the surrounding 'dead' and 'alive' cells.
                if(!Object.keys(deadOrAlive).length) {
                    deadOrAlive.alive = 0;
                    deadOrAlive.dead = 0;
                }

                //Assign the current row that we are looking at.
                const currentAdjacentRow = adjecentRow;

                //Here we map through the row we are looking at to add
                grid[adjecentRow].map((cell, cellIndex) => {
                    //Here we define whether or not we will be ignoring the cell (either it isn't included in the adjacent cells, or it is the current cells)
                    const ignoreCell = currentAdjacentRow === currentRow && currentCellIndex === cellIndex;
                    if(ignoreCell || !cellIndexes.includes(cellIndex))
                        return;
                    
                    //increment the 'dead' or 'alive' fields
                    deadOrAlive[cell]++;
                });

                return deadOrAlive;
            }, {});

            if(alive) {
                const killIt = adjacentValues.alive < 2 || adjacentValues.alive > 3;
                if(killIt) {
                    changed = true;
                    return "dead"
                }
                return item;
            } else {
                const resurrect = adjacentValues.alive === 3;

                if(resurrect) {
                    changed = true;
                    return "alive";
                }
                return item;
            }
        })
    });

    return {
        grid: updatedGrid,
        updated: changed
    }
}

const fillRow = (row, cellIndex, clickedColour, newColour, range, log) => {
    if(log) {
        console.log("LOGGING")
    }
    const rowArray = [...row];
    let newRowArray = [...row];
    let rowRange = [];
    let isUpdated = false;

    let carryOnLeft = true;

    const updateCellsBeforeRange = row[range[0] - 1] === clickedColour && row[range[0]] === clickedColour;

    if(range.length) {

        let newRowRange = [];

        rowArray.forEach((cell, index) => {
            let previousCell = index - 1;
            let adjacentCellUpdated = rowArray[previousCell] !== newRowArray[previousCell];

            if((cell === clickedColour && index >= range[0] && index <= range[1]) || (cell === clickedColour && adjacentCellUpdated)) {
                if(index - 1 >= 0 && rowArray[index - 1] !== clickedColour) {
                    newRowRange[0] = index;
                } else if (index === 0) {
                    newRowRange[0] = 0;
                } else if (index < rowArray.length && rowArray[index + 1] !== clickedColour) {
                    newRowRange[1] = index;
                } else if (!rowArray[index + 1]) {
                    newRowRange[1] = rowArray.length - 1;
                }
                newRowArray[index] = newColour;

                isUpdated = true;
            }

            rowRange = [...newRowRange];
        })

        if(updateCellsBeforeRange) {
            const beforeRangeCells = [...newRowArray].filter((item, index) => index < range[0]).map((item, index) => {
                return {
                    colour: item,
                    index
                }
            }).reverse();

            let breakLoop = false;

            beforeRangeCells.forEach(cell => {
                if(breakLoop)
                return;
                
                if(cell.colour === clickedColour && cell.colour !== newColour) {
                    newRowArray[cell.index] = newColour;
                    rowRange[0] = cell.index;
                } else {
                    breakLoop = true;
                }
            })

        }

    } else {

        for(let i = cellIndex; i >= 0 && carryOnLeft; i--) {
            if(rowArray[i] === clickedColour) {
                newRowArray[i] = newColour;
                isUpdated = true;
            } else {
                carryOnLeft = false;
                rowRange[0] = i;
            }
        }

        let carryOnRight = true;

        for(let i = cellIndex + 1; i < rowArray.length && carryOnRight; i++) {
            if(rowArray[i] == clickedColour) {
                newRowArray[i] = newColour;
                isUpdated = true;
                rowRange[1] = i;
            } else {
                carryOnRight = false;
                rowRange[1] = i;
            }
        }
    }

    return {
        newRow: newRowArray,
        newRange: rowRange,
        updated: isUpdated
    };
}

const fillColour = (grid, initialRowIndex, rowIndex, cellIndex, colour, goingUp, firstTimeDown, range, originalRow, clickedColour = null) => {  
    let newGrid = [...grid];
    const clickedCellColour = clickedColour !== null ? clickedColour : grid[rowIndex][cellIndex];

    let firstRow = fillRow(newGrid[rowIndex], cellIndex, clickedCellColour, colour, range || [], rowIndex === 37);

    let newRange;


    if(firstTimeDown) {
        newRange = fillRow(originalRow, cellIndex, clickedCellColour, colour, [], true).newRange;
    }

    newGrid[rowIndex] = firstRow.newRow;

    if(firstRow.updated && rowIndex > 0 && goingUp) {
        return fillColour([...newGrid], initialRowIndex, rowIndex - 1, cellIndex, colour, goingUp || rowIndex === 0, !goingUp, firstRow.newRange, originalRow, clickedCellColour);
    } else if ((!firstRow.updated && rowIndex < initialRowIndex && initialRowIndex < grid.length - 1)|| (firstTimeDown && rowIndex < grid.length - 1 && initialRowIndex < grid.length - 1)) {
        return fillColour([...newGrid], initialRowIndex, initialRowIndex + 1, cellIndex, colour, false, false, newRange || firstRow.newRange, originalRow, clickedCellColour); 
    } else if(firstRow.updated && rowIndex < grid.length - 1) {
        return fillColour([...newGrid], initialRowIndex, rowIndex + 1, cellIndex, colour, false, goingUp, firstRow.newRange, originalRow, clickedCellColour); 
    }
    
    return newGrid;
}

module.exports = {
    updateGrid,
    fillColour
}