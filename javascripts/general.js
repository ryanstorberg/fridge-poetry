var ref = new Firebase("https://idea-room.firebaseio.com/");

ref.on('child_added', function(data, prevChildName) {
	readPosition(data);
	makeDraggable();
})

ref.on('child_changed', function(data, prevChildName) {
	readPosition(data);
	makeDraggable();
})

ref.on('child_removed', function(data) {
	$('#' + data.key()).remove();
})

function addHandlers() {
	$('button').on('click', function() {
		getWord();
	})
}

var baseURL = 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=-1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
function getWord () {
	var url = baseURL;
	$.ajax ({ 
		url: url,
		dataType: "text" , 
		timeout: 30000 
		}) 
	.success (function (data) { 
		var word = JSON.parse(data).word;
		placeWord(word);
	})
}

function randomVerical() {
	return Math.round(Math.random() * ($(window).height() - 100));
}

function randomHorizontal() {
	return Math.round(Math.random() * ($(window).width() - 100));
}

function placeWord(word) {
  $('body').prepend('<p id=' + word + ' class=\'word ui-widget-content\' style=\'top: ' + randomVerical() + 'px; left: ' + randomHorizontal() + 'px\'>' + word + '</p>');
  writePosition($('#' + word));
}

function makeDraggable() {
	$('.word').draggable({
		start: function() {
			writePosition(this);
		},
		drag: function() {
			writePosition(this);
		},
		stop: function() {
			writePosition(this);
		}
	});

	$('.word').on('dblclick', function() {
		ref.child($(this).attr('id')).remove();
	})
}

function writePosition(object) {
	var vehicle = {};
	var id = $(object).attr('id');
	var position = $(object).position();
	vehicle[id] = { 'top' : position.top, 'left' : position.left };
	ref.update(vehicle)
}

function writePositions() {
	$('.word').each(function() {
		var word = {};
		var id = $(this).attr('id');
		var position = $(this).position();
		word[id] = { 'top' : position.top, 'left' : position.left };
		ref.update(word);
	})
}

function readPosition(data) {
	var top = data.val()['top'];
	var left = data.val()['left'];
	if($('#' + data.key()).length == 1) {
		$('#' + data.key()).css('top', top + 'px');
		$('#' + data.key()).css('left', left + 'px');
	} else {
		$('body').prepend('<p id=' + data.key() + ' class=\'word ui-widget-content\' style=\'top: ' + top + 'px; left: ' + left + 'px\'>' + data.key() + '</p>');
	}
}

function readPositions(data) {
	data.forEach(function(object) {
		var top = object.val()['top'];
		var left = object.val()['left'];
		if($('#' + object.key()).length == 1) {
			$('#' + object.key()).css('top', top + 'px');
			$('#' + object.key()).css('left', left + 'px');
		} else {
			$('body').prepend('<p id=' + object.key() + ' class=\'word ui-widget-content\' style=\'top: ' + top + 'px; left: ' + left + 'px\'>' + object.key() + '</p>');
		}
	})
}

$(document).on('ready', function() {
	ref.once('value', function(data) {
		readPositions(data);
	}, addHandlers())
})
