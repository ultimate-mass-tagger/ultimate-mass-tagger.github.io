// THE ULTIMATE MASS TAGGER
function Tags() {
	this.store = {};

	this.add = function (who, why, color, text) {
		this.store[name] = {
			tag: text,
			link: why,
			color: color
		}
	};

	this.json = function () {
		JSON.stringify(this.store);
	}
}

function Subreddits() {
	this.store = {};
	this.tags = null;

	this.add = function (who, why, color, text) {
		this.store[name] = {
			who: who,
			why: why,
			color: color,
			text: text
		};
	};

	this.remove = function (who) {
		delete this.store[name];
	};

	var eachSub = function (sub) {
		var data = this.store[sub.name], tags = this.tags;
		sub.users.forEach(function (user) {
			tags.add(user, data.why, data.color, data.text);
		});
	}.bind(this);

	this.process = function (arr) {
		if (!this.tags) {
			this.tags = new Tags();
			arr.forEach(eachSub);
		}
		return this.tags;
	};
}

var Snoocore = window.Snoocore;
var reddit = new Snoocore({
	userAgent: 'UltimateMassTagger@0.0.1',
	oauth: {
		type: 'implicit',
		key: 'oTOIpSkOdWG4AA',
		redirectUri: 'http://ultimate-mass-tagger.github.io',
		scope: ['flair', 'identity']
	}
});

var needAuth = function() {
	$('#auth-url').attr('href', reddit.getImplicitAuthUrl());
	$('#auth-box').prop('checked', true);
};

var exitLoading = function(callback) {
	setTimeout(function() {
		$('#loading-box').prop('checked', false);
		callback && callback();
	}, 2000);
};

$(function() {
	$('#loading-box').prop('checked', true);
});

var accessToken = window.sessionStorage.getItem('accessToken');
if (accessToken == null) {
	var match = ('' + window.location.hash).match(/access_token=(.*?)&/);
	accessToken = match ? match[1] : '';
	
	if(accessToken !== '') {
		$(function() {
			reddit.auth(accessToken).then(
				// Success
				function() {
					exitLoading();
					$('.app').show();
				},
				
				// Failure
				function() {
					exitLoading(needAuth);
				}
			);
		});
	} else {
		$(function() {
			exitLoading(needAuth);
		});
	}
}
