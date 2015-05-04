var users = new Firebase("https://fridge-poetry.firebaseio.com/users");
var words = new Firebase("https://fridge-poetry.firebaseio.com/words");
var currentUser = users.push({'name':'John Doe'});

$('#clear').on('click', function() {
	words.remove();
})

$('#add').on('click', function() {
	writeWord();
})

words.on('child_added', function(data, prevChildName) {
	readWord(data);
})

words.on('child_changed', function(data, prevChildName) {
	readPosition(data);
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
			writePosition(this);
			$(this).css('z-index', '2');
			$('#add img').fadeOut();
			$('#add').animate({bottom: '25px'}, function() {
				$('#add p').fadeIn();
				$('#add').css('background-color', 'rgb(175, 125, 125)');
				$('#add').css('border', '5px dotted white');
			});
			$('#clear').css('z-index', '0');
			$('#clear').animate({bottom: '50px'});
		},
		drag: function() {
			writePosition(this);
		},
		stop: function() {
			writePosition(this);
			$(this).css('z-index', '0');
			$('#add').css('background-color', 'rgb(125, 175, 125)');
			$('#add p').fadeOut();
			$('#add').css('border', 'none');
			$('#clear').fadeIn();
			$('#add').animate({bottom: '60px'}, function() {
				$('#add img').fadeIn();
			});
			$('#clear').css('z-index', '1');
			$('#clear').animate({bottom: '25px'});

			wordTop = $(this).position().top + ($(this).height() / 2);
			wordLeft = $(this).position().left + ($(this).width() / 2);
			buttonStartTop = $('#add').position().top;
			buttonEndTop = $('#add').position().top + 50;
			buttonStartLeft = $('#add').position().left
			buttonEndLeft = $('#add').position().left + 50;

			if((wordTop > buttonStartTop && wordTop < buttonEndTop) && (wordLeft > buttonStartLeft && wordLeft < buttonEndLeft)) {
				words.child($(this).attr('id')).remove();
			}
		}
	});
}

function readUsers(data) {
	var userCount = data.numChildren();
	if(userCount >= 2) {
		$('#user-count p').text(userCount + ' Active Users');
	} else {
		$('#user-count p').text(userCount + ' Active User');
	}
	document.title = "(" + userCount + ")" + " Fridge Poetry";
}

function writeWord() {
	var word = wordLibrary[Math.floor(Math.random() * wordLibrary.length)];
	var wordObject = {};
	wordObject['name'] = word;
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
		word.child('name').val() +
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
