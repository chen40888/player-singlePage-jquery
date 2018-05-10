(function(window) {

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

	$('#song_image').on('error', imgError);


		var audio, $playlist_id;

		//Hide Pause Initially
		$('#pause').hide();
		$('.pause_btn').hide();
		$('#wrapper_player').hide();


		function initAudio(element){
			var
			song = element.data('song'),
			title = element.text(),
			cover = element.data('cover'),
			artist = element.data('artist');
			// log(element.length);

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

		function play_music() {
			$('#hook_playlist').find('.action').removeClass('action');
			$('.wrapper_player').attr('data-open', 'true');

			var $this_playlist = $(this).closest('[data-playlist_id]');
			$playlist_id = $(this).closest('[data-playlist_id]').data('playlist_id');

			$('#audio_player').attr('data-playlist_id', $playlist_id);


			var is_on_play = $('#audio_player').attr('data-playlist_id');
			console.log(is_on_play);
			if(is_on_play) {
				$('#hook_playlist').find('.action').removeClass('action');
				$('#id_' + is_on_play).addClass('action')
			}

			$this_playlist.addClass('action');
			if(audio) pause_music(); // הגנה מפני השמעה של כמה שירים במקביל



			show_pause_btn_after_click_on_play($(this), $playlist_id);

			$playlist_wraper = $(this).closest('.playlist');
			$list_songs = $playlist_wraper.find('ul').html();
			$('#playlist').html($list_songs);

			initAudio($('#playlist').find('li:first-child'));
			audio.play();

			audio.addEventListener('ended',next_song); // when this song over play its load the next song

			$('#hook_for_delete_in_playlist').attr('data-del', $playlist_id).attr('data-name', $('#id_' + is_on_play).find('.song_name_header').data('name'));
			$('#duration').fadeIn(400);
			showDuration();
		}

		function pause_music() {
			audio.pause();
			show_play_btn_after_click_on_pause($(this));
		}
		function show_play_btn_after_click_on_pause(this_element) {
			$('.pause_btn, #pause').hide();
			$('.click_play, #play').show();
			$(this_element).hide();
			$play_btn = $(this_element).closest('.play_and_pause').find('.click_play');
			$play_btn.show();
		}
		function show_pause_btn_after_click_on_play(this_element, $playlist_id) {
			var id = $('#id_' +$playlist_id);
			$('.pause_btn, #play').hide();
			$('.click_play, #pause').show();

			$(this_element).hide();
			$pause_btn = $(this_element).closest('.play_and_pause').find('.pause_btn');
			$pause_btn.show();
			$('#wrapper_player').show();

			id.find('.pause_btn').show();
			id.find('.click_play').hide();

		}

		function stop_music() {
			audio.pause();
			audio.currentTime = 0;
			var $audio_player = $('#audio_player');
			$('#hook_playlist').find('.action').removeClass('action');
			$('#pause, .pause_btn, #wrapper_player').hide();
			$('#play').show();
			$('#duration').fadeOut(400);
			$('.click_play').show();
			$audio_player.removeAttr('data-playlist_id');
			$('.wrapper_player').attr('data-open', 'false');
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
			audio.addEventListener('ended',next_song);
		}

		function prev_song() {
			audio.pause();
			var prev = $('#playlist').find('li.active').prev();
			if (prev.length === 0) {
				prev = $('#playlist').find('li:last-child');
			}
			initAudio(prev);
			audio.play();
			showDuration();
		}

		function playlist_song() {
			audio.pause();
			// log(this);
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
			// log(audio.ended);//parseInt
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

		function imgError() {
			$('#song_image').attr('src', '../images/noimage.jpg');
			return true;
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
		var parts = (typeof nested_property_string === 'string' && nested_property_string.split('.')),
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
		return (typeof value !== 'undefined');
	}

})(window);

