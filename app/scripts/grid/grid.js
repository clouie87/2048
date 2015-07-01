angular.module('Grid', [])
  .factory('TileModel', function() {
    var Tile = function (pos, val) {
      this.x = pos.x;
      this.y = pos.y;
      this.value = val || 2;
    };
    this.merged = null;

    Tile.prototype.updatePosition = function(newPos) {
      this.x = newPos.x;
      this.y = newPos.y;
    };

    return Tile;


  })


    .service('GridService', function(TileModel) {
    this.grid   = [];
    this.tiles  = [];
    this.tiles.push(new TileModel({x: 1, y: 1}, 2));
    this.tiles.push(new TileModel({x: 1, y: 2}, 2));
    // Size of the board
    this.size   = 4;
    this.startingTileNumber = 2;

    var service = this;

    var vectors = {
      'left': { x: -1, y: 0 },
      'right': { x: 1, y: 0 },
      'up': { x: 0, y: -1 },
      'down': { x: 0, y: 1 }
    };


    this.buildEmptyGameBoard = function() {
      var self = this;
      console.log('creating empty board');
        // Initialize our grid
      for (var x = 0; x < service.size * service.size; x++) {
        this.grid[x] = null;
      }

      // Initialize our tile array
      // with a bunch of null objects
      this.forEach(function(x,y) {
        self.setCellAt({x:x,y:y}, null);
      });
    };

    this.prepareTiles = function() {
      this.forEach(function(x,y,tile) {
        if (tile) {
          tile.reset();
        }
      });
    };

    this.buildStartingPosition = function() {
      console.log('building the start positions');
      for (var x = 0; x < this.startingTileNumber; x++) {
        this.randomlyInsertNewTile();
      }
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


    //We want to determine coordinates
    // Run a method for each element in the tiles array
    this.forEach = function(cb) {
      var totalSize = this.size * this.size;
      for (var i = 0; i < totalSize; i++) {
        var pos = this._positionToCoordinates(i);
        cb(pos.x, pos.y, this.tiles[i]);
      }
    };

    this.traversalDirections = function(key) {
      var vector = vectors[key];
      var positions = {x: [], y: []};
      for (var x = 0; x < this.size; x++) {
        positions.x.push(x);
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
      return cell.x >= 0 && cell.x < this.size &&
        cell.y >= 0 && cell.y < this.size;
    };

    this.cellAvailable = function(cell) {
      if (this.withinGrid(cell)) {
        return !this.getCellAt(cell);
      } else {
        return null;
      }
    };

    this.buildStartingPosition = function() {
      for (var x = 0; x < this.startingTileNumber; x++) {
        this.randomlyInsertNewTile();
      }
    };
      this.availableCells = function() {
        var cells = [],
          self = this;

        this.forEach(function (x, y) {
          var foundTile = self.getCellAt({x:x, y:y});
          if (!foundTile) {
            cells.push({x:x, y:y});
          }
        });
        //console.log("the cells are", cells);

        return cells;
      };


    this.randomlyInsertNewTile = function() {
      var cell = this.randomAvailableCell(),
          tile = new TileModel(cell, 2);
      this.insertTile(tile);
    };

    this.randomAvailableCell = function() {
      var cells = this.availableCells();
      if (cells.length > 0) {
        return cells[Math.floor(Math.random() * cells.length)];
      }
    };

    // Add a tile to the tiles array
    this.insertTile = function(tile) {
      var pos = this._coordinatesToPosition(tile);
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
      return (pos.y * this.size) + pos.x;
    };

  });
