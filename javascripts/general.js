var myFirebaseRef = new Firebase("https://idea-room.firebaseio.com/");

myFirebaseRef.once('value', function(dataSnapShot) {
	readPositions(dataSnapShot);
})

myFirebaseRef.on('value', function(dataSnapShot) {
	readPositions(dataSnapShot);
})

function RandomWord() {
  var requestStr = "http://randomword.setgetgo.com/get.php";
  $.ajax({
    type: "GET",
    url: requestStr,
    dataType: "jsonp",
    jsonpCallback: 'placeWord'
  });
}

function randomVerical() {
	return Math.round(Math.random() * ($(window).height() - 100));
}

function randomHorizontal() {
	return Math.round(Math.random() * ($(window).width() - 100));
}

function placeWord(data) {
  $('body').prepend('<p id=' + data.Word + ' class=\'word ui-widget-content\' style=\'top: ' + randomVerical() + 'px; left: ' + randomHorizontal() + 'px\'>' + data.Word + '</p>');
  makeDraggable();
  writePositions();
}

function makeDraggable() {
	$('.word').draggable({
		drag: function() {
			writePosition(this);
		}
	});
}

function writePosition(object) {
	var vehicle = {};
	var id = $(object).attr('id');
	var position = $(object).position();
	vehicle[id] = { 'top' : position.top, 'left' : position.left };
	myFirebaseRef.update(vehicle)
}

function writePositions() {
	$('.word').each(function() {
		var word = {};
		var id = $(this).attr('id');
		var position = $(this).position();
		word[id] = { 'top' : position.top, 'left' : position.left };
		myFirebaseRef.update(word);
	})
}

function readPosition(dataSnapShot) {
	
}

function readPositions(dataSnapShot) {
	dataSnapShot.forEach(function(word) {
		var top = word.val()['top'];
		var left = word.val()['left'];
		if($('#' + word.key()).length == 1) {
			$('#' + word.key()).css('top', top + 'px');
			$('#' + word.key()).css('left', left + 'px');
		} else {
			$('body').prepend('<p id=' + word.key() + ' class=\'word ui-widget-content\' style=\'top: ' + top + 'px; left: ' + left + 'px\'>' + word.key() + '</p>');
		}
	})
	makeDraggable();
}

$(document).on('ready', function() {
	$('button').on('click', function() {
		RandomWord();
	})
})
