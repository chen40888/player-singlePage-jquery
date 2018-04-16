(function(window) {

	window.App = (window.App || {});
	var $ = window.jQuery;

	function _on_dom_ready() {
		$(window.document)
			.on('click', '#btn_step_1', next_step_to_save)
			.on('click', '#prev_to_playlist_name', prev_to_change_playlist_name)
			.on('click', '.edit_playlist', bring_playlist_data)
			.on('click', '#add_song', add_more_col)
			// .on('click', '.delete_playlist', delete_this_playlist)
			.on('click', '.hook_for_delete', delete_this_playlist)
			.on('blur', '.url_for_song', regexp_for_mp3)
			.on('blur', '.name_for_song', regexp_for_name);

		function bring_playlist_data() {
		var	$id_to_update = $(this).closest('.playlist').attr('id');
			$id_to_update = $id_to_update.split("_")[1];
		$('#btn_step_1').attr('data-edit', $id_to_update);

		$('#myModal').attr('data-new', false);
		}
		function add_more_col(e) {
			e.preventDefault();
			var $new_input ='<div class="url_song_input"><div class="col-xs-6"><label>Song Url :</label><input class="form-control url_for_song" type="text"></div><div class="col-xs-6"><label>Song Name :</label><input class="form-control name_for_song" type="text"></div></div>';
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

		function problem($this_input) {
			$this_input.addClass(' problem');
			return false
		}

		function valid($this_input) {
			$this_input.removeClass(' problem');
			return true
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

		function next_step_to_save(e) {
			e.preventDefault();
			// $btn = $(this).data('edit');
			var is_new = $('#myModal').data('new');

			console.log(is_new);

			// if(isset($btn)) {
			// 	console.log('isset');
			// 	// need to save step_1
			// }
			$('#setp_1').addClass('hide');
			$('#step_2').removeClass('hide');
		}

		function prev_to_change_playlist_name(e) {
			e.preventDefault();
			$('#setp_1').removeClass();
			$('#step_2').addClass('hide');
		}

	}

	$(_on_dom_ready);
})(window);

