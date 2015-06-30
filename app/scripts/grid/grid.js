angular.module('Grid', [])
  .factory('TileModel', function() {
    var Tile = function (pos, val) {
      this.x = pos.x;
      this.y = pos.y;
      this.value = val || 2;
    };
    return Tile;
  })
    .service('GridService', function(TileModel) {
    this.grid   = [];
    this.tiles  = [];
    this.tiles.push(new TileModel({x: 1, y: 1}, 2));
    this.tiles.push(new TileModel({x: 1, y: 2}, 4));
    // Size of the board
    this.size   = 4;

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



    //We want to determine coordinates
    // Run a method for each element in the tiles array
    this.forEach = function(cb) {
      var totalSize = this.size * this.size;
      for (var i = 0; i < totalSize; i++) {
        var pos = this._positionToCoordinates(i);
        cb(pos.x, pos.y, this.tiles[i]);
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

    this.buildStartingPosition = function() {
      for (var x=0; x < this.startingTileNuber; x++) {
        this.randomlyInsertNewTile();
      }

      this.availableCells = function() {
        var cells = [],
          self = this;

        this.forEach(function (x, y) {
          var foundTile = self.getCellAt({x: x, y: y});
          if (!foundTile) {
            cells.push({x: x, y: y});
          }
        });
        console.log("the cells are", cells);

        return cells;
      };
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
    };

    // Remove a tile from the tiles array
    this.removeTile = function(pos) {
      var pos = this._coordinatesToPosition(tile);
      delete this.tiles[pos];
    }

  });
