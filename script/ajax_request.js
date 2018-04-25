(function(window) {

	window.App = (window.App || {});
	var $ = window.jQuery,
		$playlist_url_image,
		$doc = $(window.document);

	$doc
		.on('click', '#hook_save_playlist', _update_or_create_playlist)
		.on('click', '#preview', _show_image)
		.on('keyup', '#search_music', _search_playlist_name)
		.on('click', '#delete_this_playlist', _delete_from_db);

	$(_on_dom_ready);

	function _search_playlist_name() {
		window.App.send('playlist', false, {}, _on_get_all_playlist_for_search);

		function _on_get_all_playlist_for_search(all_playlists_objects) {
			var $search_this = $('#search_music').val(),
				playlist_data = all_playlists_objects.data;
			$('#hook_playlist').html('');

			searchStringInArray($search_this, playlist_data);

			function searchStringInArray(str, array_object) {
				for(var j = 0; j < array_object.length; j++) {
					var id = array_object[j].id;
					if(array_object[j].name.match(str)) _create_playlist(id, playlist_data[j]);
				}
				return -1;
			}
		}
	}

	function _update_or_create_playlist() {
		// window.App.validation();

		var songs_array = [],
			playlist_name = $('#playlist_name').val(),
			playlist_url_image = $('#playlist_url').val(),
			request;

		$('#songs_urls').find('.url_song_input').each(_update_songs_array_with_name_and_url);

		request = {
			name: playlist_name,
			image: playlist_url_image,
			songs: songs_array
		};

		if($('#hook_action_type').val() === 'edit') _on_update();
		else _on_create();

		_reset_submit_form();

		return false;

		function _on_update() {
			window.App.send('songs&id=' + $doc.data('playlist_id'), true, request, _on_post_playlist_success);
		}

		function _on_create() {
			window.App.send('playlist', true, request, _on_post_playlist_success);
		}

		function _update_songs_array_with_name_and_url() {
			var $this = $(this),
				name = $this.find('.name_for_song').val(),
				url = $this.find('.url_for_song').val(),
				song_object = {
					name: name,
					url: url
				};

			songs_array.push(song_object);
		}

		function _on_post_playlist_success(response) {
			var playlist_id = (isset(response, 'data.id') ? response.data.id : 0);

			if(playlist_id) window.App.send('playlist&id=' + playlist_id, false, {}, _on_get_playlist_callback);
		}

		function _on_get_playlist_callback(response) {
			if(isset(response, 'data.id')) _create_playlist(response.data.id, response.data);
		}
	}

	function _reset_submit_form() {
		$('#new_playlist')[0].reset();
		$('#myModal').modal('hide');
		$('#step_1').removeClass();
		$('#step_2').addClass('hide');

		var $new_input = '<div class="url_song_input"><div class="col-xs-6"><label>Song Url :</label><input class="form-control url_for_song" type="text"></div><div class="col-xs-6"><label>Song Name :</label><input class="form-control name_for_song" type="text"></div></div>';

		$('#songs_urls').html($new_input + $new_input + $new_input);
	}

	function _delete_from_db() {
		$id_to_delete = $(this).attr('data-delete');
		window.App.delete_playlist($id_to_delete, _on_delete_playlist_success);
		$('#id_' + $id_to_delete).remove();

		function _on_delete_playlist_success(response) {
			$('#message').show();
			setTimeout(function() {
				$('#message').hide();
			}, 4000);

			// log(response);
		}

	}

	function _show_image(e) {
		e.preventDefault();
		$playlist_url_image = $('#playlist_url').val();
		$('#hook_image_for_playlist').attr('src', $playlist_url_image);
	}

	function _on_dom_ready() {
		_bring_all_playlists();
	}

	function _bring_all_playlists() {
		window.App.send('playlist', false, {}, _on_get_playlist_success);

		function _on_get_playlist_success(response) {
			if(isset(response.data, 'length')) _create_list_with_data(response.data);
		}

		function _create_list_with_data(playlist_data) {
			var index = 0;

			for(index; index < playlist_data.length; index++) {
				_create_playlist(playlist_data[index].id, playlist_data[index]);
			}
		}
	}

	function _create_playlist(playlist_id, playlist_object) {
		var playlist_name = playlist_object.name,
			playlist_image = playlist_object.image,
			$songs_array = playlist_object.songs,
			index = 0,
			$clone = $($('#hook_playlist_template').html()),
			song_name, song_url;

		// console.log(playlist_id);
		// console.log(playlist_object);
		if(!isset($songs_array, 'length')) return;

		for(index; index < $songs_array.length; index++) {
			song_name = $songs_array[index].name;
			song_url = $songs_array[index].url;
			$clone.find('ul').append('<li data-song="' + song_url + '" data-cover="' + playlist_image + '"></li>').find('li').eq(index).html(song_name);
		}

		$clone
			.attr('data-playlist_id', playlist_id)
			.attr('id', 'id_' + playlist_id)
			.find('.song_name_header').html(playlist_name).end()
			.find('.playlist_btns a').data('del', playlist_id).data('name', playlist_name).end().find('h2').attr('id', 'header_title_' + playlist_id);

		// console.log($clone);
		$('#hook_playlist').append($clone);
		new CircleType(document.getElementById('header_title_' + playlist_id)).radius(120);

	}

})(window);

