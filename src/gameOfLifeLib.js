const isLessThanOf = function(x, y) {
  return x <= this.x && y <= this.y;
};

const isBetween = function(x1, y1, x2, y2) {
  return this.isLessThanOf(x1, y1) && !this.isLessThanOf(x2, y2);
};

const neighbours = function() {
  let offSet = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  let neighbours = offSet.map(([x, y]) => [this.x + x, this.y + y]);
  return neighbours.filter(([x, y]) => x >= 0 && y >= 0);
};

const createCell = function(x, y) {
  let point = {x, y};
  point.isLessThanOf = isLessThanOf.bind(point);
  point.isBetween = isBetween.bind(point);
  point.neighbours = neighbours.bind(point);
  return point;
};

const contains = function([x, y], cells) {
  return cells.filter(([x1, y1]) => x == x1 && y == y1).length != 0;
};

const aliveNeighbours = function(neighbours, aliveCells) {
  return neighbours.filter(x => contains(x, aliveCells));
};

const createCells = function(coordinates) {
  return coordinates.map(([x, y]) => createCell(x, y));
};

const unique = function(coordinates) {
  let uniqueNeighbours = [];
  coordinates.map(function(coordinate) {
    if (!contains(coordinate, uniqueNeighbours)) {
      uniqueNeighbours.push(coordinate);
    }
  });
  return uniqueNeighbours;
};

const nextStatus = function(currGen, cell) {
  let noOfAliveNeighbours = aliveNeighbours(cell.neighbours(), currGen).length;
  let status = 0;
  if (contains([cell.x, cell.y], currGen)) {
    status = 1;
  }
  return isAlive(noOfAliveNeighbours, status);
};

const toLinear = function(matrix){
  return matrix.reduce((x, y) => x.concat(y));
}

const nextGeneration = function(currGen, bounds) {
  let aliveCells = createCells(currGen);
  let neighbours = aliveCells.map(x => x.neighbours());  //return an array of arrays of each cell's neighbours
  neighbours = toLinear(neighbours); 
  let uniqueNeighbours = unique(neighbours);
  uniqueNeighbours = createCells(uniqueNeighbours);
  let nextGen = uniqueNeighbours.filter(nextStatus.bind(null, currGen));
  return nextGen.map(x => [x.x, x.y]);
};

const isAlive = function(noOfAliveNeigbours, cellStatus) {
  let rule = [0, 0, cellStatus, 1, 0, 0, 0, 0, 0];
  return rule[noOfAliveNeigbours];
};

//console.log(
//  nextGeneration([[1, 1], [1, 2], [1, 3]], {topLeft: [0, 0], bottomRight: [3, 3]}),
//);
module.exports = {nextGeneration};
