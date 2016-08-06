var form = document.querySelector("#main-form");
var finishMessage = document.querySelector("#finish-message");
var formGoalSelector = form.querySelector("#goal-fieldset");
var submitButton = document.querySelector("#submit-button");
var addButton 	= form.querySelector("#add-file-button");
var fileList 	= form.querySelector("#file-list");
var errorList = form.querySelector("#error-fieldset");
var fromEmailInput = form.querySelector("#from-email-input");
var toEmailInput = form.querySelector("#to-email-input");

var loremStrings = ["Lorem ipsum", "dolor sit", "amet", "consectetur adipiscing", "Vivamus", "scelerisque augue", "et fermentum", "tempus"]

// helpers
function randomInt(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}
function testEmail(email) {
	var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	return re.test(email);
}
function printErrors(element, index, array) {
	errorList.innerHTML += "<p>- " + element + "</p>"
}

// change form action
formGoalSelector.addEventListener("click", function(event) {
	if (event.target.tagName.toLowerCase() === "input") {
		var value = event.target.getAttribute("value");
		form.setAttribute("data-goal", value);
	}	
});

// check form status
function checkFormStatus() {
	if (fileList.children.length == 0) {
		form.setAttribute("data-status", "empty");
	} else {
		form.setAttribute("data-status", "dirty");
	}
};
checkFormStatus();

// add file
addButton.addEventListener("click", function(event) {
	// clear invalid
	addButton.parentNode.classList.remove("invalid");

	// create random string for file name
	var index = fileList.children.length + 1;
	var string = loremStrings[randomInt(0, loremStrings.length)];
	var fileName = index + ". " + string + ".zip";

	// create HTML child
	var html = "<fs-button>" + fileName + "<iron-icon icon=\"clear\"></iron-icon></fs-button>";
	var child = document.createElement("li");
	child.innerHTML = html;
	child.classList.add("init");

	// insert child at first
	fileList.insertBefore(child, fileList.firstChild);
	// animation
	setTimeout(function() {
		child.classList.remove("init");
	}, 100);

	checkFormStatus();
});

// remove file
fileList.addEventListener('click', function(event) {
	// check if is fs-button
	if (event.target.tagName.toLowerCase() === "fs-button") {
		fileList.removeChild(event.target.parentNode);

		checkFormStatus();
	};
});

// submit form

function progressHandler(element, currentValue, rate) {
	setTimeout(function() {
		if (currentValue < 100) {
			var testValue = currentValue + rate;
			var newValue = (testValue > 100 ? 100 : testValue);
			element.querySelector("paper-progress").setAttribute("value", newValue);
			progressHandler(element, newValue, rate);
		} else {
			fileUploaded++;
			if (fileUploaded == fileList.children.length) {
				document.querySelector("fs-mail-container").animateOut();
			};
		}
	}, 500);
};

var fileUploaded = 0;
submitButton.addEventListener("click", function() {
	// let validate
	function validate() {
		var errors = [];
		if (fileList.children.length == 0) {
			errors.push("Cần chọn ít nhất 1 tập tin");
			addButton.parentNode.classList.add("invalid");
		}
		if (form.getAttribute("data-goal") == "mail") {
			var fromValue = fromEmailInput.querySelector("input").value;
			var toValue = toEmailInput.querySelector("input").value
			if (!testEmail(fromValue)) {
				errors.push("Xin kiểm tra email nhận")
				fromEmailInput.classList.add("invalid");
			};
			if (!testEmail(toValue)) {
				errors.push("Xin kiểm tra email gửi")
				toEmailInput.classList.add("invalid");
			};
		}
		return errors;
	}

	var errors = validate();
	if (errors.length == 0) {
		form.setAttribute("data-send", "sending");

		document.querySelector("#finish-message").classList.remove("hide");

		errorList.classList.remove("show");

		submitButton.setAttribute("data-status", "sending");

		[].forEach.call(fileList.querySelectorAll('li'), function (el) {
			var progress = document.createElement("paper-progress");
			progress.setAttribute("value", "0");
			el.insertBefore(progress, el.firstChild);
			progressHandler(el, 0, randomInt(5, 30));
		});
	} else {
		errorList.innerHTML ="";
		errors.forEach(printErrors);
		errorList.classList.add("show");
	};
});

// clear invalid
[].forEach.call(form.querySelectorAll('fs-input > input'), function (el) {
	el.addEventListener("focus", function(event) {
		event.target.parentNode.classList.remove("invalid");
	})
});