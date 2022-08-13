'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      // [puzzle, value, coordinate] fields should not be empty
      if (!req.body.puzzle || !req.body.value || !req.body.coordinate) {
        return res.json({ error: 'Required field(s) missing' });
      }
      
      // [puzzle] should be valid
      const puzzleString = solver.validate(req.body.puzzle);
      if (typeof puzzleString == 'object') {
        return res.json(puzzleString);
      }

      // [value] should be digits [1-9]
      if (/[^1-9]/.test(req.body.value)) {
        return res.json({ error: 'Invalid value' });
      }

      // [coordinate] should be [A-I] for rows and [1-9] for columns
      if (req.body.coordinate.length != 2 || /[^A-I^1-9]/i.test(req.body.coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      // [row] is letters [A-I] but passed as digits [0-8] for array indexing
      // [column] is digits [1-9] but passed as digits [0-8] for array indexing
      let [row, column] = req.body.coordinate.split('');
      row = row.toUpperCase().charCodeAt(0) - 65;
      column = Number(column) - 1;

      // Check for any conflict in [row, column, region]
      // the [value] may not be placed in [coordinate] if there is any conflict
      let validity = solver.checkPlacement(req.body.puzzle, row, column, req.body.value);
      return res.json(validity);
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      // [puzzle] should not be empty
      if (!req.body.puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      // [puzzle] should be valid
      const validity = solver.validate(req.body.puzzle);
      if (typeof validity == 'object') {
        return res.json(validity);
      }

      return res.json(solver.solve(req.body.puzzle));
    });
};
