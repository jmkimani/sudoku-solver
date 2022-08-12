const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
  const invalidPuzzle = '0.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const noSolution = '5.65.84.352......2187....31..3.1..8.9..863..5.5..9.6..13....25........74..52.63..'

  // /api/solve
  test('#1 POST valid puzzle string to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: puzzleString })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { solution });
        done();
      })
  });
  
  test('#2 POST missing puzzle string to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Required field missing' });
        done();
      })
  });
  
  test('#3 POST puzzle string with invalid characters to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: invalidPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      })
  });
  
  test('#4 POST puzzle string with incorrect length to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: puzzleString + '82' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        done();
      })
  });
  
  test('#5 POST puzzle that cannot be solved to /api/solve',(done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: noSolution })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
        done();
      })
  });

  // /api/check
  test('#6 POST puzzle placement with all fields to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzleString, value: '3', coordinate: 'A2' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: true });
        done();
      })
  });
  
  test('#7 POST puzzle placement with single placement conflict to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzleString, value: '8', coordinate: 'C1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: false, conflict: ['column'] });
        done();
      })
  });
  
  test('#8 POST puzzle placement with multiple placement conflicts to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzleString, value: '4', coordinate: 'H1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: false, conflict: ['column', 'region'] });
        done();
      })
  });
  
  test('#9 POST puzzle placement with all placement conflicts to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzleString, value: '2', coordinate: 'B2' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: false, conflict: ['row', 'column', 'region'] });
        done();
      })
  });
  
  test('#10 POST puzzle placement with missing required fields to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzleString, value: 1 }) // missing 'coordinate' field
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Required field(s) missing' });
        done();
      })
  });
  
  test('#11 POST puzzle placement with invalid characters to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: invalidPuzzle, value: '1', coordinate: 'A1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      })
  });
  
  test('#12 POST puzzle placement with incorrect length to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzleString + '82', value: '1', coordinate: 'A1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        done();
      })
  });
  
  test('#13 POST puzzle placement with invalid placement coordinate to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzleString, value: '1', coordinate: 'K0' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid coordinate' });
        done();
      })
  });
  
  test('#14 POST puzzle placement with invalid placement value to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzleString, value: '0', coordinate: 'A1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid value' });
        done();
      })
  });
});

