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

module.exports = {
    updateGrid
}