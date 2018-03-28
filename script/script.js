(function(window) {

	window.App = (window.App || {});
	var $ = window.jQuery;

	function _on_dom_ready() {
		$(window.document)
			.on('click', '#play', play_music)
			.on('click', '#pause', pause_music)
			.on('click', '#next', next_song)
			.on('click', '#stop', stop_music)
			.on('click', '#playlist li', playlist_song)
			.on('change', '#volume', change_vol)
			.on('click', '#prev', prev_song);

		var audio;

		//Hide Pause Initially
		$('#pause').hide();

		//Initializer - Play First Song
		initAudio($('#playlist li:first-child'));

		function initAudio(element){
			var song = element.data('song');
			var title = element.text();
			var cover = element.data('cover');
			var artist = element.data('artist');

			//Create a New Audio Object
			audio = new Audio('media/' + song);

			if(!audio.currentTime){
				$('#duration').html('0.00');
			}

			$('#audio_player .song_title').text(title);
			$('#audio_player .artist').text(artist);

			//Insert Cover Image
			$('img.cover').attr('src','images/covers/' + cover);

			$('#playlist li').removeClass('active');
			element.addClass('active');
		}


		//Play Button

		function play_music() {
			audio.play();
			$('#play').hide();
			$('#pause').show();
			$('#duration').fadeIn(400);
			showDuration();
		}

		//Pause Button

		function pause_music() {
			audio.pause();
			$('#pause').hide();
			$('#play').show();
		}

		//Stop Button

		function stop_music() {
			audio.pause();
			audio.currentTime = 0;
			$('#pause').hide();
			$('#play').show();
			$('#duration').fadeOut(400);
		}

		//Next Button

		function next_song() {
			audio.pause();
			var next = $('#playlist li.active').next();
			if (next.length == 0) {
				next = $('#playlist li:first-child');
			}
			initAudio(next);
			audio.play();
			showDuration();
		}

		//Prev Button

		function prev_song() {
			audio.pause();
			var prev = $('#playlist li.active').prev();
			if (prev.length == 0) {
				prev = $('#playlist li:last-child');
			}
			initAudio(prev);
			audio.play();
			showDuration();
		}

		//Playlist Song Click

		function playlist_song() {
			audio.pause();
			initAudio($(this));
			$('#play').hide();
			$('#pause').show();
			$('#duration').fadeIn(400);
			audio.play();
			showDuration();
		}

		//Volume Control

		function change_vol() {
			audio.volume = parseFloat(this.value / 10);
		}

		//Time Duration
		function showDuration(){
			$(audio).bind('timeupdate', function(){
				//Get hours and minutes
				var s = parseInt(audio.currentTime % 60);
				var m = parseInt((audio.currentTime / 60) % 60);
				//Add 0 if seconds less than 10
				if (s < 10) {
					s = '0' + s;
				}
				$('#duration').html(m + '.' + s);
				var value = 0;
				if (audio.currentTime > 0) {
					value = Math.floor((100 / audio.duration) * audio.currentTime);
				}
				$('.progress').css('width',value+'%');
			});
		}


	}

	$(_on_dom_ready);
})(window);

