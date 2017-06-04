(function(){

	var snakeBody = jQuery('<div class="snakeBody">');

	var fruitBody = jQuery('<div class="fruitBody">');

	var positionList = JSON.parse(localStorage.getItem('positionList') || "[]");

	var score = JSON.parse(localStorage.getItem('score')) || 0;

	var scoreBoard = jQuery('<div id="scoreBoard" class="score">Your Score : '+score+'<br>Press CTRL to disable/re-enable deadlyBoundaries<br>Press ALT to disable/re-enable deadlyTail</div>');

	var fruit = {};

	var deadlyBoundaries = true;

	var deadlyTail = true;

	var direction = JSON.parse(localStorage.getItem('direction')) || {
		horizontal: 1,
		vertical: 0
	};

	var getNextPosition = function(elem){
		var position = {};
        //***
		direction.horizontal && (position.left = Number(jQuery(elem).css('left').replace('px','')) + (direction.horizontal * 15));
		direction.vertical && (position.top = Number(jQuery(elem).css('top').replace('px','')) + (direction.vertical * 15));
		!(direction.horizontal) && (position.left = Number(jQuery(elem).css('left').replace('px','')));
		!(direction.vertical) && (position.top = Number(jQuery(elem).css('top').replace('px','')));

		if(deadlyBoundaries){
			if(position.top < 0 || position.left < 0 || position.top > jQuery(window).height() || position.left > jQuery(window).width()){
				gameOver();
			}
		}
		else{
			position.top && ((position.top > jQuery(window).height() && (position.top = 0)) || (position.top < 0 && (position.top = jQuery(window).height())));
			position.left && ((position.left > jQuery(window).width() && (position.left = 0)) || (position.left < 0 && (position.left = jQuery(window).width())));
		}
		if(deadlyTail)
			checkCollision(position);
		return position;
	};

	var elemaniGetir = function(){
		var targetArea = {
			top: Number(jQuery('.snakeBody:first').css('top').replace('px','')) + (direction.vertical && direction.vertical * 15),
			left: Number(jQuery('.snakeBody:first').css('left').replace('px','')) + (direction.vertical && direction.horizontal * 15)
		};
		return jQuery(document.elementFromPoint(targetArea.left, targetArea.top));
	};

	var saveGameData = function(){
		localStorage.setItem('positionList', JSON.stringify(positionList));
		localStorage.setItem('direction', JSON.stringify(direction));
		localStorage.setItem('score', JSON.stringify(score));
	};

	var getRandomNumber = function(limit) {
      return parseInt( Math.random() * limit % limit / 15);
    }

	var getFruit = function(){
      fruit = {
      	top: getRandomNumber(jQuery(window).height())*15, 
      	left: getRandomNumber(jQuery(window).width())*15};
    }

    var renderFruit = function() {
      jQuery('.fruitBody').remove()
      jQuery('body').append(fruitBody.clone().css(fruit));
    }

	jQuery(document).keydown(function(e){

		if(jQuery.inArray(e.keyCode , [17,18,32,37,38,39,40]) == -1) return;

		if(e.keyCode == 32){
			saveGameData();
			elemaniGetir().length >0 && (elemaniGetir()[0].click());
			e.preventDefault();
			return;
		}

		if(e.keyCode == 17){
			deadlyBoundaries = !deadlyBoundaries;
			e.preventDefault();
			return;
		}

		if(e.keyCode == 18){
			deadlyTail = !deadlyTail;
			e.preventDefault();
			return;
		}

		direction = {
			horizontal: ((e.keyCode == 37 && direction.horizontal!= 1) && -1) || ((e.keyCode == 39 && direction.horizontal!= -1) && 1) || ((e.keyCode == 37 && direction.horizontal== 1) && 1) || ((e.keyCode == 39 && direction.horizontal== -1) && -1) || 0,
			vertical: ((e.keyCode == 38 && direction.vertical!= 1) && -1) || ((e.keyCode == 40 && direction.vertical!= -1) && 1) || ((e.keyCode == 38 && direction.vertical== 1) && 1) || ((e.keyCode == 40 && direction.vertical== -1) && -1) || 0
		};
		e.preventDefault();

	});

	var checkCollision = function(position){
  		for(var i = 0; i < positionList.length; i++){
    		if(position.top == positionList[i].top && position.left == positionList[i].left){
    			gameOver();
    		}
  		}
	}

	var gameOver = function(){
		clearInterval(movementInterval);
		clearInterval(scoreInterval);
		alert("Game Over! Your score is: "+score);
		jQuery('.snakeBody').remove();
		jQuery('.fruitBody').remove();
		jQuery('.score').remove();
	}

	var movementInterval = setInterval(function(){
	
		jQuery('.snakeBody').each(function(key){
			positionList[key] = {
				top: Number(jQuery(this).css('top').replace('px','')),
				left: Number(jQuery(this).css('left').replace('px',''))
			};
			if(key == 0)
				jQuery(this).css(getNextPosition(jQuery(this)));
			else 
				jQuery(this).css(positionList[key-1]);	
			console.log(positionList[0].top+' '+positionList[0].left);		
		});

		if(positionList[0].top == fruit.top && positionList[0].left == fruit.left){
			score += 2;
       		jQuery('#scoreBoard').html( 'Your Score : <span style="animation: pulse 3s">' + score +'</span><br>Press CTRL to disable/re-enable deadlyBoundaries<br>Press ALT to disable/re-enable deadlyTail');
       		jQuery('body').append(snakeBody.clone().css(positionList[i] || {}));
       		getFruit();
			renderFruit();
		}

	}, 200);

	var scoreInterval = setInterval(function(){
		
		score += 1;
        jQuery('#scoreBoard').html( 'Your Score : <span style="animation: pulse 3s">' + score +'</span><br>Press CTRL to disable/re-enable deadlyBoundaries<br>Press ALT to disable/re-enable deadlyTail</div>' );

	}, 10000);

	jQuery('body').append('<style>@keyframes pulse { 0% { color: rgba(0, 0, 255, 0.5); } 100% { color: rgba(255, 255, 255, 0.8); } } @keyframes stretch {0% {transform: scale(.3); background-color: red;  border-radius: 100%; } 50% {   background-color: orange  }  100% { transform: scale(1.5);    background-color: yellow;  }} .fruitBody { z-index:99999999; animation-name: stretch;  animation-duration: 1.5s; animation-timing-function: ease-out; animation-delay: 0s; animation-direction: alternate; animation-iteration-count: infinite; animation-fill-mode: none; animation-play-state: running;  width: 15px; height: 15px; position: fixed; top: 0; left:0; background: rgba(0, 255, 255, 1);} .score {z-index:99999999; color: rgba(255, 255, 255, 0.8);position: fixed; right:5px; width:400px; top: 5px; padding:5px;font-size: 16px;font-weight: bold;text-align: left;background-color: rgba(0, 0, 255, 0.5);} .snakeBody { z-index:99999999; width: 15px; height: 15px; position: fixed; top: 0; left:0; background: purple;border-style: solid; border-width: 1px;border-color:rgba(238,130,238,0.3)} .snakeBody:first-child {background: rgba(162, 107, 162,1);}</style>');

	var i=0;
	while(i<20){
		jQuery('body').append(snakeBody.clone().css(positionList[i] || {}));
		i++;
	}
	jQuery('.snakeBody:first').css('background','rgba(162, 107, 162,1)');
	jQuery('body').append(scoreBoard.clone());
	getFruit();
	renderFruit();

})();