angular.module('Game', ['Grid', 'ngCookies'])
.service('GameManager', function($q, $timeout, GridService) {
  // Create a new game
  //  this.grid = GridService.grid;
    this.tiles = GridService.tiles;
    //this.gameSize = GridService.getSize();

    this.newGame = function() {
      GridService.buildEmptyGameBoard();
      GridService.buildStartingPosition();

      this.reinit();
    };

    //rest game
    this.reinit = function() {
      this.gameOver =false;
      this.win = false;
      this.currentScore = 0;
      this.highScore = 0;

    };

    this.getHighScore = function() {
      return parseInt($cookieStore.get('highScore')) || 0;
    };


    // Handle the move action
    this.move = function(key) {
    // Update the score
      var self = this; //keeps reference of gamemanager for later
      var f = function() {
        if (self.win) {
          return false;
        }

        var positions = GridService.traversalDirections(key);
        var hasWon = false;
        var hasMoved = false;
        self.winningValue = 2048;

        GridService.prepareTiles();


        positions.x.forEach(function (x) {
          positions.y.forEach(function (y) {
            //For every position
            var originalPosition = {x: x, y: y};
            var tile = GridService.getCellAt(originalPosition);
            //console.log("the tile is at: ", originalPosition);
            if (tile) {
              //if we have a tile here
              var cell = GridService.calculateNextPosition(tile, key),
                next = cell.next;
              console.log('the new position of the cell will be: ', cell);

              if (next &&
                next.value === tile.value && !next.merged) {
                //handle the merged
                var newValue = tile.value * 2;
                var mergedTile = GridService.newTile(tile, newValue);
                mergedTile.merged = [tile, cell.next];
                console.log('the merged tile value is: ', newValue);
                // Insert the new tile
                GridService.insertTile(mergedTile);
                // Remove the old tile
                GridService.removeTile(tile);
                // Move the location of the mergedTile into the next position
                GridService.moveTile(mergedTile.merged, next);
                // Update the score of the game
                self.updateScore(self.currentScore + newValue);
                // Check for the winning value
                if (mergedTile.value >= self.winningValue) {
                  hasWon = true;
                }
                hasMoved = true;

              } else {
                //handle the moving tile
                GridService.moveTile(tile, cell.newPosition);
              }

              if (!GridService.samePositions(originalPosition, cell.newPosition)) {
                hasMoved = true;
              }

            }
          });
        });
        if (hasWon && !self.win) {
          self.win = true;
        }

        if (hasMoved) {
          GridService.randomlyInsertNewTile();

          if (self.win || !self.movesAvailable()) {
            self.gameOver = true;
          }
        }
      };
    return $q.when(f());

    };

  this.updateScore = function(newScore) {
    // Are there moves left?
    this.currentScore = newScore;
    if (this.currentScore > this.getHighScore) {
      $cookieStore.put('highScore', newScore);
    }
  };


  this.movesAvailable = function() {
    //return GridService.anyCellsAvailable() || GridService.tileMatchesAvailable();
  };

});
