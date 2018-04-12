(function(window) {

	window.App = (window.App || {});
	var $ = window.jQuery;

	function _on_dom_ready() {
		var
			$playlist_name,
			$playlist_url_image,
			playlist_object = {};

		$(window.document)
			.on('click', '#save_playlist', save_this_playlist)
			// .on('click', '#btn_step_1', _save_playlist_name_and_url)
			.on('blur', '#playlist_url', _show_image)
			.on('blur', '#search_music', search_this_song);
		function _show_image() {
			$playlist_url_image = $('#playlist_url').val();
			$('#hook_image_for_playlist').attr('src',$playlist_url_image);
		}
		function _save_playlist_name_and_url() {
			//צריך לעשות פה איזה בדיקה שהשדות עברו regexp והם בסדר

				$playlist_name = $('#playlist_name').val();
				$playlist_url_image = $('#playlist_url').val();

			// validations //
			// var regexUrl = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
			// var regexMp3Url = "^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?.mp3$"

		}

		function search_this_song() {
			$search_val = $('#search_music').val();
			// console.log($search_val);
			var options = {
				url: 'ajax/search.php',
				type: 'POST',
				data: {search_val: $search_val},
				dataType: 'html'
			};

			$.ajax(options).always(_on_success);

			function _on_success(response_text) {
				$('#search_result').html(response_text);
			}

		}

		function save_this_playlist(e) {
			e.preventDefault();
			var
				$playlist_name = $('#playlist_name').val(),
				$playlist_url_image = $('#playlist_url').val(),
				$songs_araay = $('#songs_urls').find('.url_song_input');
			// console.log($a);
			var	$songs_arr = [];
			$songs_araay.each(get_this_name_and_url);

			function get_this_name_and_url () {
				$song_url_and_name = $(this);
				$name = $song_url_and_name.find('.name_for_song').val();
				$url = $song_url_and_name.find('.url_for_song').val();
				$song_object = {
					name: $name,
					url: $url
				};

				$songs_arr.push($song_object);
			}

			playlist_object = {
				name: $playlist_name,
				image: $playlist_url_image,
				songs: $songs_arr
			};

			after_submit_form();

			// console.log($arr);

			var options = {
				url: 'http://api.local/api/playList/api.php/?type=playlist',
				type: 'POST',
				data: playlist_object,
				dataType: 'html'
			};

			$.ajax(options).always(_on_success);

			function _on_success(response_text) {
				// console.log(response_text);
				$event_object = JSON.parse(response_text);
				$playlist_id = $event_object.data.id;

				$playlist_object = bring_playlist_object($playlist_id);

				// console.log($playlist_object);

				create_playlist($playlist_object);
			}

		}

		function create_playlist(playlist_object) {
			// console.log(playlist_object);
			var
				$playlist_name = playlist_object.name,
				$playlist_image = playlist_object.image,
				$songs_array = playlist_object.songs;
			// console.log(playlist_image);
			// console.log(playlist_name);
			// console.log(songs_array);

			var $song_list = song_order_list($songs_array);

			// var $playlist ='<div class="col-md-3 col-sm-6 col-xs-12 playlist"><div class="playlist_content"><div class="playlist_btns"><a href="#"><span class="glyphicon glyphicon-trash delete_playlist"></span></a>
			// <a href="#"><span class="glyphicon glyphicon-pencil"></span></a>
			// <a href="#" class="play_and_pause">
			// 	<span class="glyphicon glyphicon-play click_play"></span>
			// 	<span class="glyphicon glyphicon-pause pause_btn"></span>
			// 	</a>
			// 	</div>
			// 	</div>
			// 	<ul class="hidden">
			// 	<li data-song="one.mp3" data-cover="cover1.jpg" data-artist="Linkin Park">
			// 	one.mp3
			// 	</li>
			// 	<li data-song="two.mp3" data-cover="cover1.jpg" data-artist="Linkin Park">
			// 	One Step Closer.mp3
			// </li>
			// <li data-song="two.mp3" data-cover="cover1.jpg" data-artist="Linkin Park">With
			// two.mp3
			// </li>
			// <li data-song="Linkin Park - Points Of Authority.mp3" data-cover="cover1.jpg"
			// data-artist="Linkin Park">Points Of Authority.mp3
			// </li>
			// <li data-song="Linkin Park - Crawling.mp3" data-cover="cover1.jpg" data-artist="Linkin Park">
			// 	Crawling.mp3
			// 	</li>
			// 	<li data-song="Linkin Park - Runaway.mp3" data-cover="cover1.jpg" data-artist="Linkin Park">
			// 	Runaway.mp3
			// 	</li></ul></div>
		}
		function song_order_list($songs_array) {
			var i;
			for(i = 0; i < $songs_array.length; i++) {
			console.log($songs_array[i]);
			}

		}

		function bring_playlist_object($id) {

			var options = {
				url: 'http://api.local/api/playList/api.php/?type=playlist&&id=' + $id,
				type: 'GET',
				dataType: 'html'
			};

			$.ajax(options).always(_on_success);

			return playlist_object;

			function _on_success(response_text) {
				// console.log(response_text);
				playlist_object = response_text; //לבדוק שזה לא פוגע בכלום
			}

		}

		function after_submit_form() {
			$('#new_playlist')[0].reset();
			$('#myModal').modal('hide');
			$('#setp_1').removeClass();
			$('#step_2').addClass('hide');
		}
	}

	$(_on_dom_ready);
})(window);

