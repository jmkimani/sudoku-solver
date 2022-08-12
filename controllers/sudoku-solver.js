class SudokuSolver {

  validate(puzzleString) {
    /**
    * Checks whether the puzzle string has 81 valid characters.
    *
    * Params:
    *   puzzleString (String): Combination of numbers [1-9] and periods '.' representing empty spaces
    *
    * Returns:
    *   true (bool): If puzzle string is valid OR
    *   error {}: If puzzle string length is not 81 or has invalid characters
    */
    
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    if (/[^.^1-9]/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }
    else {
      return true;
    }
  }
  
  puzzleGrid(puzzleString) {
    /**
    * Converts puzzleString into an array of arrays
    *
    * Returns:
    *   grid [rows[columns]]
    */
    
    let grid = [];
    for (let i = 0; i < 9; i++) {
      grid.push(puzzleString.slice(i*9, (i+1)*9).split(''));
    }
    return grid;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    /**
    * Returns:
    *   true: if 'value' can be placed in 'row'
    *   false: if similar 'value' is in the 'row'
    */
    
    const puzzleGrid = this.puzzleGrid(puzzleString);
    return !puzzleGrid[row].includes('' + value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    /**
    * Returns:
    *   true: if 'value' can be placed in 'column'
    *   false: if similar 'value' is in the 'column'
    */
    
    const puzzleGrid = this.puzzleGrid(puzzleString);
    for (let i = 0; i < 9; i++) {
      if (puzzleGrid[i][column] == value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    /**
    * Returns:
    *   true: if 'value' can be placed in 3x3 region
    *   false: if similar 'value' is in the 3x3 region
    */
    
    const puzzleGrid = this.puzzleGrid(puzzleString);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let r = (row - row % 3) + i;
        let c = (column - column % 3) + j;
        if (puzzleGrid[r][c] == value) return false;
      }
    }
    return true;
  }

  findEmptyCell(puzzleGrid) {
    /**
    * Finds a cell that needs to be filled in the [puzzleGrid] (converted puzzle string).
    * An empty cell is denoted by a period [.]
    *
    * Returns:
    *   [row, column] array denoting the coordinate of the empty cell
    */
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (puzzleGrid[r][c] == '.') return [r, c];
      }
    }
    return null;
  }

  checkPlacement(puzzleString, row, column, value) {
    // Check for conflict in [row, column, region] placement
    let conflict = [];
    this.checkRowPlacement(puzzleString, row, column, value) || conflict.push('row');
    this.checkColPlacement(puzzleString, row, column, value) || conflict.push('column');
    this.checkRegionPlacement(puzzleString, row, column, value) || conflict.push('region');
    if (conflict.length) {
      return { valid: false, conflict: conflict };
    }
    return { valid: true };
  }
  
  _solve(puzzleGrid) {
    /**
    * Recursive function for solving the puzzle.
    *
    * Returns:
    *   true: if the puzzle can be solved
    *   false: if the puzzle cannot be solved
    */
    const coordinate = this.findEmptyCell(puzzleGrid);
    // This is the base case
    if (coordinate == null) return true

    for (let value = 1; value < 10; value++) {
      let [row, column] = coordinate;
      // Check for valid [row, column, region] placement
      if (this.checkPlacement(puzzleGrid.flat().join(''), row, column, value).valid) {
        // Assign value to the coordinate
        puzzleGrid[row][column] = value;
        // This is where recursion happens;
        if (this._solve(puzzleGrid)) return true
        // And, this is where backtracking happens!
        puzzleGrid[row][column] = '.';
      }
        // And, this is where backtracking happens!
        puzzleGrid[row][column] = '.';
    }
    // This cannot be solved
    return false;
  }

  solve(puzzleString) {
    // Validate the puzzle first
    /*if (typeof validate(puzzleString) == 'object') {
      return { error: 'Puzzle cannot be solved' };
    }*/
    const puzzleGrid = this.puzzleGrid(puzzleString);
    if (this._solve(puzzleGrid)) {
      return { solution: puzzleGrid.flat().join('') };
    }
    return { error: 'Puzzle cannot be solved' };
  }
}

module.exports = SudokuSolver;

