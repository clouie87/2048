angular.module('Game', ['Grid', 'ngCookies'])
.service('GameManager', function($q, $timeout, GridService) {
  // Create a new game
    this.grid = GridService.grid;
    this.tiles = GridService.tiles;
    //this.gameSize = GridService.getSize();
  this.newGame = function() {};
  // Handle the move action
  this.move = function() {};
  // Update the score
  this.updateScore = function(newScore) {};
  // Are there moves left?
  this.movesAvailable = function() {};
});
