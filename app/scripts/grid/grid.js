'use strict';

angular.module('Grid', [])
  .factory('TileModel', function() {

    var Tile = function (pos, val) {
      this.x = pos.x;
      this.y = pos.y;
      this.value = val || 2;

      this.merged = null;

      this.reset = function() {
        this.merged = null;
      };

      this.newPosition = function(newPosition) {
        this.x = newPosition.x;
        this.y = newPosition.y;
      };

      this.getPosition = function() {
        return {
          x: this.x,
          y: this.y
        };
      };


    };

    Tile.prototype.updatePosition = function(newPos) {
      console.log("The upadatedPosition is: ", newPos.x, newPos.y);
      this.x = newPos.x;
      this.y = newPos.y;
    };

    return Tile;


  })


    .service('GridService', function(TileModel) {
    this.grid   = [];
    this.tiles  = [];
    //this.tiles.push(new TileModel({x: 1, y: 1}, 2));
    //this.tiles.push(new TileModel({x: 1, y: 2}, 4));
    // Size of the board
    var service = this;
    this.size = 4;
    this.startingTileNumber = 2;



    var vectors = {
      'left': { x: -1, y: 0 },
      'right': { x: 1, y: 0 },
      'up': { x: 0, y: -1 },
      'down': { x: 0, y: 1 }
    };


    this.buildEmptyGameBoard = function() {
      var self = this;
      console.log('creating empty board');
      console.log("the grid size is: ", service.size*service.size);
        // Initialize our grid
      for (var x = 0; x < service.size * service.size; x++) {
        //console.log("the grid size is: ", service.size*service.size);
        this.grid[x] = null;
        //console.log(this);
      }

      // Initialize our tile array
      // with a bunch of null objects
      this.forEach(function(x,y) {

        self.setCellAt({x:x,y:y}, null);
      });
    };

    this.buildStartingPosition = function() {
      console.log('building the start positions');
      for (var x = 0; x < this.startingTileNumber; x++) {
        this.randomlyInsertNewTile();
      }
    };


    this.prepareTiles = function() {
      this.forEach(function(x,y,tile) {
        if (tile) {
          //tile.savePosition();
          tile.reset();
        }
      });
    };






    //We want to determine coordinates
    // Run a method for each element in the tiles array
    this.forEach = function(cb) {
      var totalSize = this.size * this.size;
      //console.log("the total size is: ", totalSize);
      for (var i = 0; i < totalSize; i++) {
        var pos = this._positionToCoordinates(i);
        //console.log("have the tiles x,y positions");
        cb(pos.x, pos.y, this.tiles[i]);
      }
    };

    this.traversalDirections = function(key) {
      var vector = vectors[key];
      var positions = {x: [], y: []};
      console.log('positions: ', positions);
      for (var x = 0; x < this.size; x++) {
        console.log("size: ",this.size);
        positions.x.push(x);
        //console.log(positions.y)
        positions.y.push(x);
      }

      // Reorder if we're going right
      if (vector.x > 0) {
        positions.x = positions.x.reverse();
      }
      // Reorder the y positions if we're going down
      if (vector.y > 0) {
        positions.y = positions.y.reverse();
      }
      return positions;
    };

    this.calculateNextPosition = function(cell, key){
      var vector = vectors[key];
      var previous;

      do {
        previous = cell;
        cell = {
          x: previous.x + vector.x,
          y: previous.y + vector.y

        };

      } while(this.withinGrid(cell) && this.cellAvailable(cell));

      return {
        newPosition: previous,
        next: this.getCellAt(cell)
      }
    };

    // Set a cell at position
    this.setCellAt = function(pos, tile) {
      if (this.withinGrid(pos)) {
        var xPos = this._coordinatesToPosition(pos);
        //console.log("setting the positions");
        this.tiles[xPos] = tile;
      }
    };

    // Fetch a cell at a given position
    this.getCellAt = function(pos) {
      if (this.withinGrid(pos)) {

        var x = this._coordinatesToPosition(pos);

        return this.tiles[x];
      } else {
        return null;
      }
    };

    // A small helper function to determine if a position is
    // within the boundaries of our grid
    this.withinGrid = function(cell) {
      //console.log("the cell is: ", cell);
      return cell.x >= 0 && cell.x < service.size &&
        cell.y >= 0 && cell.y < service.size;
    };

    this.cellAvailable = function(cell) {
      if (this.withinGrid(cell)) {
        return !this.getCellAt(cell);
      } else {
        return null;
      }
    };

    this.availableCells = function() {
      var cells = [],
        self = this;

      this.forEach(function (x, y) {
        var foundTile = self.getCellAt({x:x, y:y});
        //console.log("the found tiles are : ", foundTile);
        if (!foundTile) {
          cells.push({x:x, y:y});
        }
      });

      return cells;
    };


    this.samePositions = function(a, b) {
      return a.x === b.x && a.y === b.y;
    };

    this.moveTile = function(tile, newPosition) {
      var oldPos = {
        x:tile.x,
        y:tile.y
      };
      this.setCellAt(oldPos, null);
      this.setCellAt(newPosition, tile);
      console.log('the new position is: ', newPosition);
      tile.updatePosition(newPosition);

    };

    this.newTile = function(pos, value){
      return new TileModel(pos, value);
    };

    this.randomlyInsertNewTile = function() {
      var cell = this.randomAvailableCell(),
          tile = new TileModel(cell, 2);
      this.insertTile(tile);
    };

    this.randomAvailableCell = function() {
      var cells = this.availableCells();
      //console.log("the availableCells are: ", cells);
      if (cells.length > 0) {
        return cells[Math.floor(Math.random() * cells.length)];
      }
    };

    // Add a tile to the tiles array
    this.insertTile = function(tile) {
      var pos = this._coordinatesToPosition(tile);
      //console.log("the pos: ", pos, "this tile: ", tile)
      this.tiles[pos] = tile;
      console.log('the new tile is : ', tile);
    };

    // Remove a tile from the tiles array
    this.removeTile = function(tile) {
      var pos = this._coordinatesToPosition(tile);
      delete this.tiles[pos];
    };

    this._positionToCoordinates = function(i) {
      var x = i % service.size,
        y = (i - x) / service.size;
      return {
        x: x,
        y: y
      };
    };

// Helper to convert coordinates to position
    this._coordinatesToPosition = function(pos) {
      //console.log(pos.y * 4 + pos.x);
      return (pos.y * service.size) + pos.x;
    };

  });
