// var app = chrome.runtime.getBackgroundPage();

function execute() {

	chrome.tabs.executeScript({file: 'scripts/jquery.min.js'});
	
  	chrome.tabs.executeScript({file: 'scripts/snake.js'}); 

}

document.getElementById('clickme').addEventListener('click', execute);

