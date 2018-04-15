(function(window) {

	window.App = (window.App || {});
	var $ = window.jQuery;

	function _on_dom_ready() {
		var
			$playlist_name,
			$playlist_url_image,
			playlist_object = {};


		// create_playlist(1);
		_bring_all_playlists();

		$(window.document)
			.on('click', '#save_playlist', save_this_playlist)
			// .on('click', '#btn_step_1', _save_playlist_name_and_url)
			.on('blur', '#playlist_url', _show_image)
			.on('blur', '#search_music', search_this_song);

		function _show_image() {
			$playlist_url_image = $('#playlist_url').val();
			$('#hook_image_for_playlist').attr('src', $playlist_url_image);
		}

		function _bring_all_playlists() {
			// console.log('here');

			var options = {
				url: 'http://api.local/api/playList/api.php/?type=playlist',
				type: 'GET',
				dataType: 'json'
			};

			$.ajax(options).always(_on_success);

			function _on_success(response_text) {
				// console.log(response_text);
				// var $all_playlists_object = JSON.parse(response_text);
				var $playlist_data = response_text.data;
				// console.log(response_text);
				// console.log($all_playlists_object);
				// console.log($playlist_data[0].songs);
				// console.log($playlist_data.songs);
				// $all_playlists_object = $all_playlists_object.data;

				var index = 0;
				for(index; index < $playlist_data.length; index++) {
				var playlist_id = $playlist_data[index].id;
						// console.log(playlist_id);
					create_playlist(playlist_id);
				}


					// console.log(response_text);

			}

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
				$songs_array = $('#songs_urls').find('.url_song_input');
			// console.log($a);
			var $songs_arr = [];
			$songs_array.each(get_this_name_and_url);

			function get_this_name_and_url() {
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


				// console.log($playlist_object);

				create_playlist($playlist_id);
			}

		}

		function create_playlist($playlist_id) {
			get_playlist_object_from_server($playlist_id, _on_success_callback);

			function _on_success_callback(playlist_object) {
				// playlist_object = JSON.parse(playlist_object);
				// console.log(JSON.parse(playlist_object.songs));
				var $playlist_name = playlist_object.name,
					$playlist_image = playlist_object.image,
					$songs_array = JSON.parse(playlist_object.songs),
					index = 0,
					$hook_playlist = $('#hook_playlist'),
					$clone = $($('#hook_playlist_template').html()),
					$song_name, $song_url;

				// console.log(playlist_object);
				// console.log($songs_array.length);
				// console.log($playlist_name);

				if(!isset($songs_array, 'length')) return;

				for(index; index < $songs_array.length; index++) {
					$song_name = $songs_array[index].name;
					$song_url = $songs_array[index].url;
					// console.log($song_url);
					// console.log($songs_array[index]);//wtfffff?????????????


					// <li data-song="two.mp3" data-cover="cover1.jpg" data-artist="Linkin Park">With two.mp3</li>

					$clone.find('ul').append('<li data-song="' + $song_url + '" data-cover="' + $playlist_image + '"></li>').find('li').eq(index).html($song_name);
				}

				$clone
					.attr('id', 'id_' + $playlist_id)
					.find('.song_name_header').html($playlist_name);
					// .attr('id','title_' + $playlist_id);


				$hook_playlist.append($clone);
			}
		}

		function get_playlist_object_from_server($id, _callback_success) {
			$.ajax({
				url: 'http://api.local/api/playList/api.php/?type=playlist&&id=' + $id,
				type: 'GET',
				dataType: 'json'
			}).always(_parse_response);

			function _parse_response(response){
				// console.log(response);
				_callback_success(isset(response, 'data') ? response.data : {});
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

