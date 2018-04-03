(function(window) {

	window.App = (window.App || {});
	var $ = window.jQuery;

	function _on_dom_ready() {
		$(window.document)
			.on('click', '#btn_step_1', next_step_to_save)
			.on('click', '#prev_to_playlist_name', prev_to_change_playlist_name)
			.on('blur', '#search_music', search_this_song);

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
	}

	$(_on_dom_ready);
})(window);

