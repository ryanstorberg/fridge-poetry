var word_set = ["&","boil","for","is","&","boy","forest","is","a","breast","frantic","it","a","but","friend","it","a","but","from","it","a","but","from","juice","a","but","garden","lake","a","butt","girl","language","about","by","go","languid","above","by","goddess","lather","ache","can","gorgeous","lazy","ad","chant","gown","less","after","chocolate","hair","let","all","cool","has","lick","am","could","have","lie","am","crush","have","life","an","cry","he","light","an","d","he","like","and","day","head","like","and","death","heave","like","and","delirious","her","live","and","diamond","her","love","apparatus","did","here","luscious","are","do","him","lust","are","do","his","ly","arm","dream","his","ly","as","dress","honey","ly","as","drive","hot","ly","as","drool","how","mad","as","drunk","I","man","ask","eat","I","me","at","ed","I","me","at","ed","I","me","at","ed","if","mean","away","ed","in","meat","bare","egg","in","men","be","elaborate","in","milk","beat","enormous","ing","mist","beauty","er","ing","moan","bed","es","ing","moon","beneath","est","ing","mother","bitter","fast","ing","music","black","feet","ing","must","blood","fiddle","is","my","blow","finger","is","my","blue","fluff","is","my","need","s","the","y","never","s","the","y","no","s","their","yet","no","s","there","you","not","s","these","you","not","sad","they","you","of","said","those","you","of","sausage","though","of","say","thousand","of","scream","through","on","sea","time","on","see","tiny","one","shadow","to","or","she","to","our","she","to","over","shine","together","pant","ship","tongue","peach","shot","trudge","petal","show","TV","picture","sing","ugly","pink","sit","up","play","skin","urge","please","sky","us","pole","sleep","use","pound","smear","want","puppy","smell","want","purple","smooth","was","put","so","watch","r","soar","water","r","some","wax","rain","sordid","we","raw","spray","we","recall","spring","were","red","still","what","repulsive","stop","when","rip","storm","whisper","rock","suit","who","rose","summer","why","run","sun","will","rust","sweat","wind","s","sweet","with","s","swim","with","s","symphony","woman","s","the","worship","s","the","y","s","the","y"]
var users = new Firebase("https://fridge-poetry.firebaseio.com/users");
var words = new Firebase("https://fridge-poetry.firebaseio.com/words");
var currentUser = users.push({'user':'active'});
currentUser.onDisconnect().remove();

words.on('child_added', function(data, prevChildName) {
	readWord(data);
	makeDraggable();
})

words.on('child_changed', function(data, prevChildName) {
	readPosition(data);
	makeDraggable();
})

words.on('child_removed', function(data) {
	$('#' + data.key()).remove();
})

users.on('value', function(data) {
	updateUsers(data);
})

function updateUsers(data) {
	var userCount = data.numChildren();
	if(userCount > 2) {
		$('#user-count p').text('You\'re sharing this screen with ' + (userCount - 1) + ' other people');
	} else if(userCount == 2){
		$('#user-count p').text('You\'re sharing this screen with ' + (userCount - 1) + ' other person');
	} else {
		$('#user-count p').text('There\'s nobody else here with you');
	}
}

function addHandlers() {
	$('button').on('click', function() {
		getWord();
	})
}


function getWord () {
	var word = word_set[Math.floor(Math.random() * word_set.length)];
	writeWord(word);
}

function randomVerical() {
	return Math.round(Math.random() * ($(window).height() - 100));
}

function randomHorizontal() {
	return Math.round(Math.random() * ($(window).width() - 100));
}

function makeDraggable() {
	$('.word').draggable({
		start: function() {
			writePosition(this);
			$(this).css('z-index', '2');
			$('button').css('background-color', 'rgb(175, 125, 125)');
			$('button img').attr('src', 'images/minus.png');
		},
		drag: function() {
			writePosition(this);
		},
		stop: function() {
			writePosition(this);
			$(this).css('z-index', '0');
			$('button').css('background-color', 'rgb(125, 175, 125)');
			$('button img').attr('src', 'images/plus.png');

			wordTop = $(this).position().top + ($(this).height() / 2);
			wordLeft = $(this).position().left + ($(this).width() / 2);
			buttonStartTop = $('button').position().top;
			buttonEndTop = $('button').position().top + 50
			buttonStartLeft = $('button').position().left
			buttonEndLeft = $('button').position().left + 50

			if((wordTop > buttonStartTop && wordTop < buttonEndTop) && (wordLeft > buttonStartLeft && wordLeft < buttonEndLeft)) {
				words.child($(this).attr('id')).remove();
			}
		}
	});
}

function readWords(words) {
	words.forEach(function(word) {
		var top = word.child('position/top').val();
		var left = word.child('position/left').val();
		$('body').prepend('<p id=' + word.key() + ' class=\'word ui-widget-content\' style=\'top: ' + top + 'px; left: ' + left + 'px\'>' + word.val()['term'] + '</p>');
	})
}

function writeWord(word) {
	var wordObject = {};
	wordObject['term'] = word;
	wordObject['position'] = {};
	wordObject['position']['top'] = randomVerical();
	wordObject['position']['left'] = randomHorizontal();
	words.push(wordObject);
}

function readWord(word) {
	var top = word.child('position/top').val();
	var left = word.child('position/left').val();
	$('body').prepend('<p id=' + word.key() + ' class=\'word ui-widget-content\' style=\'top: ' + top + 'px; left: ' + left + 'px\'>' + word.val()['term'] + '</p>');
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
		updateUsers(data);
	})
	words.once('value', function(data) {
		readWords(data);
	}, addHandlers())
})
