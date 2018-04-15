(function(window) {

	window.App = (window.App || {});
	var $ = window.jQuery;

	window.isset = isset;
	window.is_defined = is_defined;
	$(_on_dom_ready);

	function _on_dom_ready() {
		$(window.document)
			.on('click', '#play, .click_play', play_music)
			.on('click', '[href="#"]', _prevent_default)
			.on('click', '#pause, .pause_btn', pause_music)//Pause Button
			.on('click', '#next', next_song) //Next Button
			.on('click', '#stop', stop_music) //Stop Button
			.on('click', '#playlist li', playlist_song)
			.on('change', '#volume', change_vol)
			.on('click', '#prev', prev_song);

		var audio;

		//Hide Pause Initially
		$('#pause').hide();
		$('.pause_btn').hide();
		$('#main_player').hide();


		function initAudio(element){
			var
			song = element.data('song'),
			title = element.text(),
			cover = element.data('cover'),
			artist = element.data('artist');
			// console.log(element.length);

			//Create a New Audio Object
			audio = new Audio(song);

			if(!audio.currentTime){
				$('#duration').html('0.00');
			}

			$('#audio_player')
				.find('.song_title').text(title).end()
				.find('.artist').text(artist);

			//Insert Cover Image
			$('img.cover').attr('src', cover);

			$('#playlist').find('li').removeClass('active');
			element.addClass('active');
		}

		function _prevent_default(e) {
			e.preventDefault();
		}

		function play_music(event_object) {
			if(audio) pause_music(); // הגנה מפני השמעה של כמה שירים במקביל
			show_pause_btn_after_click_on_play($(this));

			$playlist_wraper = $(this).closest('.playlist');
			$list_songs = $playlist_wraper.find('ul').html();
			$('#playlist').html($list_songs);

			initAudio($('#playlist').find('li:first-child'));
			audio.play();

			$('#duration').fadeIn(400);
			showDuration();
		}

		function pause_music() {
			audio.pause();
			show_play_btn_after_click_on_pause($(this));
		}
		function show_play_btn_after_click_on_pause(this_elemtnt) {
			$('.pause_btn, #pause').hide();
			$('.click_play').show();
			// $('#pause').hide();
			$('#play').show();
			$(this_elemtnt).hide();
			$play_btn = $(this_elemtnt).closest('.play_and_pause').find('.click_play');
			$play_btn.show();
		}
		function show_pause_btn_after_click_on_play(this_elemtnt) {
			$('.pause_btn, #play').hide();
			$('.click_play, #pause').show();
			// $('#play').hide();
			// $('#pause').show();
			$(this_elemtnt).hide();
			$pause_btn = $(this_elemtnt).closest('.play_and_pause').find('.pause_btn');
			$pause_btn.show();
			$('#main_player').show();
		}

		function stop_music() {
			audio.pause();
			audio.currentTime = 0;
			$('#pause, .pause_btn, #main_player').hide();
			$('#play').show();
			$('#duration').fadeOut(400);
			// $('#main_player').hide();
			// $('.pause_btn').hide();
			$('.click_play').show();
		}

		function next_song() {
			audio.pause();
			var next = $('#playlist').find('li.active').next();
			if (next.length === 0) {
				next = $('#playlist').find('li:first-child');
			}
			initAudio(next);
			audio.play();
			showDuration();
		}

		function prev_song() {
			audio.pause();
			var prev = $('#playlist').find('li.active').prev();
			if (prev.length == 0) {
				prev = $('#playlist').find('li:last-child');
			}
			initAudio(prev);
			audio.play();
			showDuration();
		}

		function playlist_song() {
			audio.pause();
			// console.log(this);
			initAudio($(this));
			$('#play').hide();
			$('#pause').show();
			$('#duration').fadeIn(400);
			audio.play();
			showDuration();
		}

		function change_vol() {
			audio.volume = parseFloat(this.value / 10);
		}

		//Time Duration
		function showDuration(){
			$(audio).on('timeupdate', update_time);
			console.log(audio.ended);//parseInt
			function update_time (){
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
			}
		}
	}

	/**
	 * Provided an object and a string representing a nested property, isset returns true when all parts are set
	 *
	 * http://stackoverflow.com/questions/4343028/in-javascript-test-for-property-deeply-nested-in-object-graph
	 * @param {object} object
	 * @param {string} nested_property_string
	 * @returns {boolean}
	 */
	function isset(object, nested_property_string) {
		var parts = (typeof nested_property_string == 'string' && nested_property_string.split('.')),
			current = object;

		if(!parts) return false;
		for(var i = 0; i < parts.length; i++) {
			if(!current || !current[parts[i]]) {
				return false;
			}
			current = current[parts[i]];
		}
		return true;
	}

	function is_defined(value) {
		return (typeof value != 'undefined');
	}

})(window);

