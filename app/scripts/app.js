'use strict';

/**
 * @ngdoc overview
 * @name twentyfourtyeightApp
 * @description
 * # twentyfourtyeightApp
 *
 * Main module of the application.
 */
angular
  .module('twentyfourtyeightApp', [
    'Game', 'Grid', 'Keyboard', 'ngCookies'
  ])
  .controller('GameController', function(GameManager, KeyboardService){
    this.game = GameManager;

    //new game
    this.newGame = function() {
      KeyboardService.init();
      this.game.newGame();
      this.startGame();
    };

    this.startGame = function() {
      var self = this;
      KeyboardService.on(function(key) {
        self.game.move(key)
      });
    };

    this.newGame();
  });
