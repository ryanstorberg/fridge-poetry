var users = new Firebase("https://fridge-poetry.firebaseio.com/users");
var words = new Firebase("https://fridge-poetry.firebaseio.com/words");
var currentUser = users.push({'user':'active'});
var currentElement;

$('button').on('click', function() {
		writeWord();
})

words.on('child_added', function(data, prevChildName) {
	readWord(data);
})

words.on('child_changed', function(data, prevChildName) {
	if(data.key() != currentElement) {
		readPosition(data);
	}
})

words.on('child_removed', function(data) {
	$('#' + data.key()).remove();
})

users.on('value', function(data) {
	readUsers(data);
})

currentUser.onDisconnect().remove();

function makeDraggable(word) {
	$('#' + word.key()).draggable({
		start: function() {
			currentElement = $(this).attr('id');
			writePosition(this);
			$(this).css('z-index', '2');
			$('button').css('background-color', 'rgb(175, 125, 125)');
			$('button img').attr('src', 'images/minus.png');
		},
		drag: function() {
			writePosition(this);
		},
		stop: function() {
			currentElement = null;
			writePosition(this);
			$(this).css('z-index', '0');
			$('button').css('background-color', 'rgb(125, 175, 125)');
			$('button img').attr('src', 'images/plus.png');

			wordTop = $(this).position().top + ($(this).height() / 2);
			wordLeft = $(this).position().left + ($(this).width() / 2);
			buttonStartTop = $('button').position().top;
			buttonEndTop = $('button').position().top + 50;
			buttonStartLeft = $('button').position().left
			buttonEndLeft = $('button').position().left + 50;

			if((wordTop > buttonStartTop && wordTop < buttonEndTop) && (wordLeft > buttonStartLeft && wordLeft < buttonEndLeft)) {
				words.child($(this).attr('id')).remove();
			}
		}
	});
}

function readUsers(data) {
	var userCount = data.numChildren();
	if(userCount > 2) {
		$('#user-count p').text('You\'re sharing this screen with ' + (userCount - 1) + ' other people');
	} else if(userCount == 2){
		$('#user-count p').text('You\'re sharing this screen with ' + (userCount - 1) + ' other person');
	} else {
		$('#user-count p').text('There\'s nobody else here with you');
	}
}

function writeWord() {
	var word = wordLibrary[Math.floor(Math.random() * wordLibrary.length)];
	var wordObject = {};
	wordObject['term'] = word;
	wordObject['position'] = {};
	wordObject['position']['top'] = Math.round(Math.random() * ($(window).height() - 100));
	wordObject['position']['left'] = Math.round(Math.random() * ($(window).width() - 100));
	words.push(wordObject);
}

function readWord(word) {
	var top = word.child('position/top').val();
	var left = word.child('position/left').val();
	$('body').prepend(
		"<p id='" + word.key() + "'" +
		"class='word ui-widget-content'" +
		"style='top:" + top + "px; left:" + left + "px'>" +
		word.child('term').val() +
		"</p>"
	);
	makeDraggable(word);
}

function writePosition(word) {
	var wordObject = {};
	var id = $(word).attr('id');
	var position = $(word).position();
	wordObject['position'] = { 'top' : position.top, 'left' : position.left };
	words.child(id).update(wordObject);
}

function readPosition(word) {
	var top = word.child('position/top').val();
	var left = word.child('position/left').val();
	$('#' + word.key()).css('top', top + 'px');
	$('#' + word.key()).css('left', left + 'px');
}

$(document).on('ready', function() {
	users.once('value', function(data) {
		readUsers(data);
	})
})
