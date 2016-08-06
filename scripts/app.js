var body = document.querySelector("body");
var aside = document.querySelector("body > aside");
var paperTabs = document.querySelector("paper-tabs");

var showAside = function() {
	body.classList.add("show-aside");
};

var hideAside = function() {
	body.classList.remove("show-aside");
};

// Hide aside when click
aside.addEventListener("click", hideAside);
document.querySelector(".hide-aside-link").addEventListener("click", function() {
	hideAside();
	
	// restore current tab
	var current = paperTabs.selected
	setTimeout(function() {
		paperTabs.selected = current;
	}, 500);
});
aside.querySelector(".container").addEventListener("click", function(event) {
	event.stopPropagation();
});

// Show aside when click .show-aside elements
[].forEach.call(document.querySelectorAll('.show-aside'), function (el) {
	el.addEventListener("click", showAside, false);
});

// Change pages to match tabs
document.querySelector("paper-tabs").addEventListener("click", function(event) {
	setTimeout(function() {
		var selected = document.querySelector("paper-tabs").selected
		document.querySelector("iron-pages").selected = selected
	}, 100);
});

// native shadow dom check
if(!document.head.createShadowRoot) {
	document.querySelector("body").classList.add("no-shadow-dom");
};

// load mail container
var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		setTimeout(function(){
			document.querySelector("fs-mail-container").animateIn();
		}, 100);
	}
}, 100);

document.querySelector("#reload-link").addEventListener("click", function() {
	location.reload();
})