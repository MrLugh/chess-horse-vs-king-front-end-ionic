angular.module("chess.services", [])

.service("chessSv",["$http", "$q", "$timeout", "horseSv", "kingSv",
function($http, $q, $timeout, horseSv, kingSv) {

		var config = {
			size:8
		}

		var matrix, playing, turn, winner, timer, trace;

		var reset = function() {
			matrix = [];
			trace = [];
			playing = false;
			turn = 'horse';
			winner = false;
			horseSv.reset();
			kingSv.reset();
		}
		reset();

		var getConfig = function() {
			return config;
		}

		var getEmptyPosition = function(row,cell,index,odd) {
			return {
				index:index,
				cell:cell,
				row:row,
				odd:odd,
				status:0,
				who:null
			}
		}

		var init = function() {
			reset();
			var index = 0, rowCnt = 0, cellCnt = 0 , odd = 1;
			for (var row = 0; row < config.size; row++) {
				cellCnt = 0;
				for (var cell = 0; cell < config.size; cell++) {
					matrix.push(getEmptyPosition(rowCnt,cellCnt,index,odd));
					odd = !odd;
					index++;
					cellCnt++;
				}
				rowCnt++;
				odd = !odd;
			}
		}

		var getMatrix = function() {
			return matrix;
		}

		var isPlaying = function() {
			return playing;
		}

		var play = function() {
			playing = true;
			var who, wait;
			trace.push(['horse',horseSv.getCurrent().index]);
			trace.push(['king',kingSv.getCurrent().index]);
			doPlay();
		}

		var stop = function() {
			$timeout.cancel(timer);
			timer = -1;
		}

		var doPlay = function() {
			timer = $timeout(function(){

				who = turn == 'horse' ? horseSv : kingSv;
				wait = turn != 'horse' ? horseSv : kingSv;

				var index = who.move(getConfig());

				if (index !== false) {
					matrix[index].status = 1;
					trace.push([turn,who.getCurrent().index,index]);
					who.setCurrent(matrix[index]);
					if (who.getCurrent().index == wait.getCurrent().index) {
						winner = turn;
					} else {
						matrix[index].who = turn;
					}
				}

				if (winner) {
					return;
				}

				turn = turn == 'horse' ? 'king' : 'horse';

				doPlay();
			},100);
		}

		var getTrace = function() {
			return trace;
		}

		var getWinner = function() {
			return winner;
		}

		return {
			getConfig:getConfig,
			init:init,
			getMatrix:getMatrix,
			isPlaying:isPlaying,
			play:play,
			stop:stop,
			getTrace:getTrace,
			getWinner:getWinner
		}

}])

.service("horseSv",["$http", "$q", "$ionicPopup",
function($http, $q, $ionicPopup) {

	var moves = [[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[1,-2],[2,-1]];

	var initial, current;

	var reset = function() {
		current = null;
		initial = null;
	}
	reset();

	var getCurrent = function() {
		return current;
	}

	var setCurrent = function(position) {
		current = position;
	}

	var getInitial = function() {
		return initial;
	}

	var setInitial = function(position) {
		position.status = 1;
		position.who = 'horse';
		initial = position;
		setCurrent(position);
	}

	var move = function(config) {
		var isValid = false;
		var currentMoves = JSON.parse(JSON.stringify(moves));
		var index = false;
		while(!isValid && currentMoves.length) {
			var mvIdx = Math.floor(Math.random()*moves.length);
			var mv = moves[mvIdx];
			currentMoves.splice(mvIdx,1);
			var rM = current.row+mv[0];
			var cM = current.cell+mv[1];
			index = current.index+mv[0]*config.size + mv[1];
			if (rM > -1 && rM < config.size && cM > -1 && cM < config.size && index < config.size * config.size) {
				isValid = true;
				var index = current.index+mv[0]*config.size + mv[1];
			}
		}
		return index;
	}

	return {
		reset:reset,
		getCurrent:getCurrent,
		setCurrent:setCurrent,
		getInitial:getInitial,
		setInitial:setInitial,
		move:move
	}
}])


.service("kingSv",["$http", "$q", "$ionicPopup",
function($http, $q, $ionicPopup) {

	var moves = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];

	var initial, current;

	var reset = function() {
		current = null;
		initial = null;
	}
	reset();

	var getCurrent = function() {
		return current;
	}

	var setCurrent = function(position) {
		current = position;
	}

	var getInitial = function() {
		return initial;
	}

	var setInitial = function(position) {
		position.status = 1;
		position.who = 'king';
		initial = position;
		setCurrent(position);
	}

	var move = function(config) {
		var isValid = false;
		var currentMoves = JSON.parse(JSON.stringify(moves));
		var index = false;
		while(!isValid && currentMoves.length) {
			var mvIdx = Math.floor(Math.random()*moves.length);
			var mv = moves[mvIdx];
			currentMoves.splice(mvIdx,1);
			var rM = current.row+mv[0];
			var cM = current.cell+mv[1];
			index = current.index+mv[0]*config.size + mv[1];
			if (rM > -1 && rM < config.size && cM > -1 && cM < config.size && index < config.size * config.size) {
				isValid = true;
				var index = current.index+mv[0]*config.size + mv[1];
			}
		}
		return index;
	}

	return {
		reset:reset,
		getCurrent:getCurrent,
		setCurrent:setCurrent,
		getInitial:getInitial,
		setInitial:setInitial,
		move:move
	}
}])