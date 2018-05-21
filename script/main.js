(function(window) {

	window.App = (window.App || {});
	var $ = window.jQuery,
		$doc = $(window.document);

	function _on_dom_ready() {
		$doc
			.on('click', '#btn_step_1', _on_clicked_first_next_step_update_or_move)
			.on('click', '#prev_to_playlist_name', prev_to_change_playlist_name)
			.on('click', '.edit_playlist', _on_clicked_edit_get_playlist)
			.on('click', '.edit_playlist_now_play', _on_clicked_edit_get_playlist_for_player)
			.on('click', '#add_song', add_more_col)
			.on('click', '.hook_for_delete', delete_this_playlist)
			.on('blur', '.url_for_song', regexp_for_mp3)
			.on('blur', '.name_for_song', regexp_for_name)
			.on('blur', '#playlist_url', regexp_for_image)
			.on('click', '[data-target="#myModal"]', _on_clicked_to_open_modal);


		function _on_clicked_to_open_modal() {
			$('#hook_action_type').val($(this).data('type'));
		}

		function _on_clicked_edit_get_playlist_for_player() {

			var	$id = $('#audio_player').data('playlist_id'),
			id_to_update = $('#hook_for_id').val();
			console.log(id_to_update);
			window.App.send('playlist&id=' + id_to_update, false, {}, _on_success_update_modal_with_playlist_data);

		}

		function _on_clicked_edit_get_playlist() {
			toggle_modal_to_start();
			var	$playlist = $(this).closest('.playlist'),
				id_to_update = $playlist.attr('id');

			id_to_update = id_to_update.split('_')[1];
			$doc.data('playlist_id', id_to_update);
			$('#hook_for_id').val(id_to_update);


			window.App.send('playlist&id=' + id_to_update, false, {}, _on_success_update_modal_with_playlist_data);
		}

		function _on_success_update_modal_with_playlist_data(response) {
			var playlist_object = response.data,
				$songs_urls = $('#songs_urls'),
				playlist_name = playlist_object.name,
				playlist_image = playlist_object.image,
				songs_array = playlist_object.songs,
				index = 0,
				song_name,
				song_url;

			$('#playlist_name').val(playlist_name);
			$('#playlist_url').val(playlist_image);

			$songs_urls.html('');

			for(index; index < songs_array.length; index++) {
				song_name = songs_array[index].name;
				song_url = songs_array[index].url;

				$songs_urls.append(_add_song_to_edit(song_url, song_name));
			}
		}

		function _on_clicked_first_next_step_update_or_move() {
			var
				id_to_update = $doc.data('playlist_id'),
				playlist_name = $('#playlist_name').val(),
				playlist_url_image = $('#playlist_url').val(),
				playlist_object = {
					name: playlist_name,
					image: playlist_url_image
				};

			_toggle_step();
			// log('id_to_update: ' + id_to_update);
			if(($('#hook_action_type').val() === 'edit')) _on_edit_do_update();

			return false;

			function _on_edit_do_update() {
				// var id_to_update = $('#hook_for_id').val();
				id_to_update = $('#hook_for_id').val();
				console.log(id_to_update);
				window.App.send('playlist&id=' + id_to_update, true, playlist_object, _on_update_name_and_image);
				_after_update_name_and_image_seccess(id_to_update, playlist_object);
			}

			function _on_update_name_and_image() {
				$('#id_' + id_to_update)
					.find('li').attr('data-cover', playlist_url_image).end()
					.find('.song_name_header').html(playlist_name);
				new CircleType(document.getElementById('header_title_' + id_to_update)).radius(120);

			}

			function _toggle_step() {
				$('#step_1').addClass('hide');
				$('#step_2').removeClass('hide');
			}
		}
		function _after_update_name_and_image_seccess(id, playlist_object) {
			$('#id_' + id).find('li').each(_change_image);

			function _change_image() {
				$(this).attr('data-cover', playlist_object.image);
			}
		}


		function _add_song_to_edit($song_url, $song_name) {
			var $new_input ='<div class="url_song_input"><div class="col-xs-6"><label>Song Url :</label><input class="form-control url_for_song" value="' + $song_url + '" type="text"></div><div class="col-xs-6"><label>Song Name :</label><input class="form-control name_for_song" type="text" value="' + $song_name + '"></div></div>';
			$('#songs_urls').append($new_input);
			return false
		}

		function add_more_col(e) {
			e.preventDefault();
			var $new_input ='<div class="url_song_input"><div class="col-xs-6"><label>Song Url :</label><input placeholder="plz enter here mp3 song with url adress" class="form-control url_for_song" type="text"></div><div class="col-xs-6"><label>Song Name :</label><input class="form-control name_for_song" type="text"></div></div>';
			$('#songs_urls').append($new_input);
		}

		function delete_this_playlist(e) {
			e.preventDefault();
			var
				$id_to_delete = $(this),
				this_name = $id_to_delete.data('name'),
				this_id = $id_to_delete.data('del');

			$('#this_playlist_name').html(this_name);
			$('#delete_this_playlist').attr('data-delete', this_id);
		}

		function regexp_for_name() {
			var $this_input = $(this);
			var $song_name = $(this).val();
			var patt = RegExp(/^.{2,}$/);
			var is_valid_name = patt.test($song_name);
			is_valid_name ? valid($this_input) : problem($this_input);

		}
		function regexp_for_image() {
			var $this_input = $(this);
			var image_url = $(this).val();
			var patt = RegExp(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g);
			var is_valid_image = patt.test(image_url);

			is_valid_image ? valid($this_input) : problem($this_input);

		}

		function problem($this_input) {
			$this_input.addClass(' problem');
		}

		function valid($this_input) {
			$this_input.removeClass(' problem');
		}

		function regexp_for_mp3() {
			var $this_input = $(this);
			var $input_val = $(this).val();
			var is_mp3 = $input_val.search(/.mp3/i);
			if(is_mp3 === -1 || is_mp3 === '') {
				problem($this_input)
			} else {
				valid($this_input)
			}
		}

		function toggle_modal_to_start() {
			$('#step_1').removeClass();
			$('#step_2').addClass('hide');
			$('#hook_image_for_playlist').attr('src', '');
		}
		function prev_to_change_playlist_name(e) {
			e.preventDefault();
			$('#step_1').removeClass();
			$('#step_2').addClass('hide');
		}
	}

	$(_on_dom_ready);
})(window);

