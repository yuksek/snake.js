// var app = chrome.runtime.getBackgroundPage();

function execute() {

	chrome.tabs.executeScript({file: 'javascripts/jquery.min.js'});
	
  	chrome.tabs.executeScript({file: 'javascripts/snake.js'}); 

}

document.getElementById('clickme').addEventListener('click', execute);

