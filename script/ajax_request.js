(function(window) {

	window.App = (window.App || {});
	var $ = window.jQuery;

	function _on_dom_ready() {
		var
			$playlist_name,
			$playlist_url_image,
			playlist_object = {};

		_bring_all_playlists();

		$(window.document)
			.on('click', '#save_playlist', save_this_playlist)
			// .on('click', '#btn_step_1', _save_playlist_name_and_url)
			.on('click', '#preview', _show_image)
			.on('click', '#delete_this_playlist', delete_from_db)
			.on('blur', '#search_music', search_this_song);

		function delete_from_db() {
			$id_to_delete = $(this).attr('data-delete');
			window.App.delete_playlist($id_to_delete, _on_delete_playlist_success);
			$('#id_' + $id_to_delete).remove();

			function _on_delete_playlist_success(response) {
				$('#message').show();
				setTimeout(function() {
					$('#message').hide();
				}, 4000);

				console.log(response);

			}

		}

		function _show_image(e) {
			e.preventDefault();
			$playlist_url_image = $('#playlist_url').val();
			$('#hook_image_for_playlist').attr('src', $playlist_url_image);
		}

		function _bring_all_playlists() {
			window.App.send('playlist', false, {}, _on_get_playlist_success);

			function _on_get_playlist_success(response) {
				// log(response);
				var $playlist_data = response.data;
				if(!isset($playlist_data, 'length')) return;

				var index = 0;
				for(index; index < $playlist_data.length; index++) {
					var playlist_id = $playlist_data[index].id;
					// log(playlist_id);
					create_playlist(playlist_id);
				}
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
			// log($search_val);
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
			// log($a);
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

			window.App.send('playlist', true, playlist_object, _on_post_playlist_success);

			function _on_post_playlist_success(response) {
				// console.log(response);
				var playlist_id = (isset(response, 'data.id') ? response.data.id : 0);

				if(playlist_id) create_playlist(playlist_id);
				log(playlist_id);
			}
		}

		function create_playlist(playlist_id) {
			window.App.send('playlist&&id=' + playlist_id, false, {}, _on_get_playlist_id_success);

			// get_playlist_object_from_server(playlist_id, _on_get_playlist_id_success);

			function _on_get_playlist_id_success(playlist_object) {
				// console.log(playlist_object);
				playlist_object = playlist_object.data;
				var $playlist_name = playlist_object.name,
					$playlist_image = playlist_object.image,
					$songs_array = JSON.parse(playlist_object.songs),
					index = 0,
					$hook_playlist = $('#hook_playlist'),
					$clone = $($('#hook_playlist_template').html()),
					$song_name, $song_url;

				if(!isset($songs_array, 'length')) return;

				for(index; index < $songs_array.length; index++) {
					$song_name = $songs_array[index].name;
					$song_url = $songs_array[index].url;

					$clone.find('ul').append('<li data-song="' + $song_url + '" data-cover="' + $playlist_image + '"></li>').find('li').eq(index).html($song_name);
				}

				$clone
					.attr('id', 'id_' + playlist_id)
					.find('.song_name_header').html($playlist_name);

				$clone
					.find('.playlist_btns').find('a')
					.attr('data-del', playlist_id)
					.attr('data-name', $playlist_name);

				$hook_playlist.append($clone);
				// new CircleType(document.getElementById('id_' + playlist_id)).radius(100);

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

