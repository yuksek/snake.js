(function(){

	/**
	
	snake.js

	a chrome extension where you can start playing snake game on any webpage you want.

	**/

	var snakeBody = jQuery('<div class="snakeBody">');

	var fruitBody = jQuery('<div class="fruitBody">');

	var positionList = JSON.parse(localStorage.getItem('positionList') || "[]"); // positionList is stored in localStorage for game saves.

	var score = JSON.parse(localStorage.getItem('score')) || 0; // score is stored in localStorage for game saves.

	var scoreBoard = jQuery('<div id="scoreBoard" class="score">Your Score : '+score+'<br>Press CTRL to disable/re-enable deadlyBoundaries<br>Press ALT to disable/re-enable deadlyTail</div>');

	var fruit = {};

	var deadlyBoundaries = true; // flag for the deadly boundaries rule

	var deadlyTail = true; // flag for activating self collision detection

	var direction = JSON.parse(localStorage.getItem('direction')) || { // direction is stored in localStorage for game saves.
		horizontal: 1,
		vertical: 0
	};

	var getNextPosition = function(elem){
		var position = {};

		// position variable is populated for the next move, both top and left values are initialized
		direction.horizontal && (position.left = Number(jQuery(elem).css('left').replace('px','')) + (direction.horizontal * 15));
		direction.vertical && (position.top = Number(jQuery(elem).css('top').replace('px','')) + (direction.vertical * 15));
		!(direction.horizontal) && (position.left = Number(jQuery(elem).css('left').replace('px','')));
		!(direction.vertical) && (position.top = Number(jQuery(elem).css('top').replace('px','')));

		if(deadlyBoundaries){ // applying the deadly boundaries rules by checking if the snake is within the plane
			if(position.top < 0 || position.left < 0 || position.top > jQuery(window).height() || position.left > jQuery(window).width()){
				gameOver();
			}
		}
		else{ // if deadly boundaries rule is disabled, snake's movement is on an infinite plane, so carrying the snake to the opposite side.
			position.top && ((position.top > jQuery(window).height() && (position.top = 0)) || (position.top < 0 && (position.top = jQuery(window).height())));
			position.left && ((position.left > jQuery(window).width() && (position.left = 0)) || (position.left < 0 && (position.left = jQuery(window).width())));
		}
		if(deadlyTail)
			checkCollision(position);
		return position;
	};

	var getElement = function(){ // corrected the Turkish naming for this one, previously 'elemaniGetir', which is not suitable for conventions
		// this function brings the clickable element from the web page.
		var targetArea = {
			top: Number(jQuery('.snakeBody:first').css('top').replace('px','')) + (direction.vertical && direction.vertical * 15),
			left: Number(jQuery('.snakeBody:first').css('left').replace('px','')) + (direction.horizontal && direction.horizontal * 15)
		};
		return jQuery(document.elementFromPoint(targetArea.left, targetArea.top));
	};

	var saveGameData = function(){ // saving critical game info to localStorage for further playing
		localStorage.setItem('positionList', JSON.stringify(positionList));
		localStorage.setItem('direction', JSON.stringify(direction));
		localStorage.setItem('score', JSON.stringify(score));
	};

	var getRandomNumber = function(limit) { // random number generator for random spawning of fruits
      return parseInt( Math.random() * limit % limit / 15);
    }

	var getFruit = function(){ // initializing fruit
      fruit = {
      	top: getRandomNumber(jQuery(window).height())*15, 
      	left: getRandomNumber(jQuery(window).width())*15};
    }

    var renderFruit = function() { // adding fruit with coordinates from getFruit() to the plane
      jQuery('.fruitBody').remove()
      jQuery('body').append(fruitBody.clone().css(fruit));
    }

	jQuery(document).keydown(function(e){ // registering keypresses

		if(jQuery.inArray(e.keyCode , [17,18,32,37,38,39,40]) == -1) return;

		/**
		17 - CTRL
		18 - ALT
		32 - SPACE
		37 - LEFT
		38 - UP
		39 - RIGHT
		40 - DOWN
		**/

		if(e.keyCode == 32){ // when space is pressed, saves game and presses the link on the element if link available
			saveGameData();
			elemaniGetir().length >0 && (elemaniGetir()[0].click());
			e.preventDefault();
			return;
		}

		if(e.keyCode == 17){ // when ctrl is pressed, enables/disables deadly boundaries
			deadlyBoundaries = !deadlyBoundaries;
			e.preventDefault();
			return;
		}

		if(e.keyCode == 18){ // when alt is pressed, enables/disables self collision detection
			deadlyTail = !deadlyTail;
			e.preventDefault();
			return;
		}

		direction = { // registering the directional keystrokes, also blocking the reversing ability of movement by checking cases
			horizontal: ((e.keyCode == 37 && direction.horizontal!= 1) && -1) || ((e.keyCode == 39 && direction.horizontal!= -1) && 1) || ((e.keyCode == 37 && direction.horizontal== 1) && 1) || ((e.keyCode == 39 && direction.horizontal== -1) && -1) || 0,
			vertical: ((e.keyCode == 38 && direction.vertical!= 1) && -1) || ((e.keyCode == 40 && direction.vertical!= -1) && 1) || ((e.keyCode == 38 && direction.vertical== 1) && 1) || ((e.keyCode == 40 && direction.vertical== -1) && -1) || 0
		};
		e.preventDefault();

	});

	var checkCollision = function(position){
  		for(var i = 0; i < positionList.length; i++){ // checking if the next position collides with any of the parts of snake's body
    		if(position.top == positionList[i].top && position.left == positionList[i].left){
    			gameOver();
    		}
  		}
	}

	var gameOver = function(){ // when the game is over, stopping the intervals, showing a message and quitting the game
		clearInterval(movementInterval);
		clearInterval(scoreInterval);
		alert("Game Over! Your score is: "+score);
		jQuery('.snakeBody').remove();
		jQuery('.fruitBody').remove();
		jQuery('.score').remove();
	}

	var movementInterval = setInterval(function(){ // movement function
	
		jQuery('.snakeBody').each(function(key){ 
			positionList[key] = {
				top: Number(jQuery(this).css('top').replace('px','')),
				left: Number(jQuery(this).css('left').replace('px',''))
			};
			if(key == 0) // for head cell, getting the next position
				jQuery(this).css(getNextPosition(jQuery(this)));
			else 
				jQuery(this).css(positionList[key-1]); // for other cells, just moving to the previous cell's position
			console.log(positionList[0].top+' '+positionList[0].left);		
		});

		if(positionList[0].top == fruit.top && positionList[0].left == fruit.left){ // fruit detection by coordinates
			score += 2;
       		jQuery('#scoreBoard').html( 'Your Score : <span style="animation: pulse 3s">' + score +'</span><br>Press CTRL to disable/re-enable deadlyBoundaries<br>Press ALT to disable/re-enable deadlyTail');
       		jQuery('body').append(snakeBody.clone().css(positionList[i] || {}));
       		// removing the old & creating new fruit on the plane
       		getFruit();
			renderFruit();
		}

	}, 200);

	var scoreInterval = setInterval(function(){ // increasing score by 1 point every 10000 mseconds (10 seconds)
		
		score += 1;
        jQuery('#scoreBoard').html( 'Your Score : <span style="animation: pulse 3s">' + score +'</span><br>Press CTRL to disable/re-enable deadlyBoundaries<br>Press ALT to disable/re-enable deadlyTail</div>' );

	}, 10000);

	//stylesheet tag, animations are also included in here
	jQuery('body').append('<style>@keyframes pulse { 0% { color: rgba(0, 0, 255, 0.5); } 100% { color: rgba(255, 255, 255, 0.8); } } @keyframes stretch {0% {transform: scale(.3); background-color: red;  border-radius: 100%; } 50% {   background-color: orange  }  100% { transform: scale(1.5);    background-color: yellow;  }} .fruitBody { z-index:99999999; animation-name: stretch;  animation-duration: 1.5s; animation-timing-function: ease-out; animation-delay: 0s; animation-direction: alternate; animation-iteration-count: infinite; animation-fill-mode: none; animation-play-state: running;  width: 15px; height: 15px; position: fixed; top: 0; left:0; background: rgba(0, 255, 255, 1);} .score {z-index:99999999; color: rgba(255, 255, 255, 0.8);position: fixed; right:5px; width:400px; top: 5px; padding:5px;font-size: 16px;font-weight: bold;text-align: left;background-color: rgba(0, 0, 255, 0.5);} .snakeBody { z-index:99999999; width: 15px; height: 15px; position: fixed; top: 0; left:0; background: purple;border-style: solid; border-width: 1px;border-color:rgba(238,130,238,0.3)} .snakeBody:first-child {background: rgba(162, 107, 162,1);}</style>');

	var i=0;
	while(i<20){ //creating the initial snake consisting 20 cells
		jQuery('body').append(snakeBody.clone().css(positionList[i] || {}));
		i++;
	}
	jQuery('.snakeBody:first').css('background','rgba(162, 107, 162,1)');
	// creating the scoreboard and the initial fruit.
	jQuery('body').append(scoreBoard.clone());
	getFruit();
	renderFruit();

})();