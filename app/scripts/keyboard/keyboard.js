angular.module('Keyboard', [])
.service('KeyboardService', function($document) {
    var UP    = 'up',
        RIGHT = 'right',
        DOWN  = 'down',
        LEFT  = 'left';

    var keyboardMap = {
      37: LEFT,
      38: UP,
      39: RIGHT,
      40: DOWN
    };

    this.init = function(){
      //this initializes the keyboard event binding
      var self = this;
      this.keyEventHandlers = [];
      $document.bind('keydown', function(evt) {
        var key = keyboardMap[evt.which];

        if (key) {
          console.log(key, "arrow was pressed");
          evt.preventDefault();
          self._handleKeyEvent(key, evt);
        }
      });
    };

    this._handleKeyEvent = function(key, evt) {
      console.log(key, "is in the handle key event");
      var callbacks = this.keyEventHandlers;
      console.log(callbacks);
      if (!callbacks) {
        console.log(callbacks);
        return;
      }
      evt.preventDefault();
      if (callbacks) {
        for (var x = 0; x < callbacks.length; x++) {
          var cb = callbacks[x];
          cb(key, evt);
        }
      }
    };

    //bind event handlers to get called when event fired
    this.keyEventHandlers = [];
    this.on = function(cb){
      this.keyEventHandlers.push(cb);
    }
  });
