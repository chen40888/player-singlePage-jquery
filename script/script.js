(function(window) {

	window.App = (window.App || {});
	var $ = window.jQuery;

	function _on_dom_ready() {
		$(window.document)
			.on('click', '#play', play_music)
			.on('click', '#pause', pause_music)//Pause Button
			.on('click', '#next', next_song) //Next Button
			.on('click', '#stop', stop_music) //Stop Button
			.on('click', '#playlist li', playlist_song)
			.on('change', '#volume', change_vol)
			.on('click', '#prev', prev_song)
			.on('click', '#btn_step_1', next_step_to_save)
			.on('click', '#prev_to_playlist_name', prev_to_change_playlist_name)
			.on('blur','#search_music',search_this_song);

		var audio;

		//Hide Pause Initially
		$('#pause').hide();

		//Initializer - Play First Song
		initAudio($('#playlist').find('li:first-child'));

		function next_step_to_save(e) {
			e.preventDefault();
			$('#setp_1').addClass('hide');
			$('#step_2').removeClass('hide');
		}

		function prev_to_change_playlist_name(e) {
			e.preventDefault();
			$('#step_1').removeClass('hide');
			$('#step_2').addClass('hide');
		}

		function initAudio(element){
			var
			song = element.data('song'),
			title = element.text(),
			cover = element.data('cover'),
			artist = element.data('artist');

			//Create a New Audio Object
			audio = new Audio('media/' + song);

			if(!audio.currentTime){
				$('#duration').html('0.00');
			}

			$('#audio_player')
				.find('.song_title').text(title).end()
				.find('.artist').text(artist);

			//Insert Cover Image
			$('img.cover').attr('src','images/covers/' + cover);

			$('#playlist').find('li').removeClass('active');
			element.addClass('active');
		}

		function play_music() {
			audio.play();
			$('#play').hide();
			$('#pause').show();
			$('#duration').fadeIn(400);
			showDuration();
		}

		function pause_music() {
			audio.pause();
			$('#pause').hide();
			$('#play').show();
		}

		function stop_music() {
			audio.pause();
			audio.currentTime = 0;
			$('#pause').hide();
			$('#play').show();
			$('#duration').fadeOut(400);
		}

		function next_song() {
			audio.pause();
			var next = $('#playlist').find('li.active').next();
			if (next.length == 0) {
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
			$(audio).on('timeupdate', function(){
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
		function search_this_song() {
			$search_val = $('#search_music').val();
			// console.log($search_val);
			var options = {
				url: 'ajax/search.php',
				type: 'POST',
				data: { search_val : $search_val },
				dataType: 'html'
			};

			$.ajax(options).always(_on_success);

			function _on_success(response_text) {
				$('#search_result').html(response_text);
			}

		}
	}

	$(_on_dom_ready);
})(window);

