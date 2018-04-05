(function(window) {

	window.App = (window.App || {});
	var $ = window.jQuery;

	function _on_dom_ready() {
		$(window.document)
			.on('click', '#save_playlist', save_this_playlist)
			.on('blur', '#search_music', search_this_song);

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
				$playlist_url = $('#playlist_url').val(),
				$a = $('#songs_urls').find('.url_song_input');
			// console.log($a);
			var	$arr = [];
			$a.each(get_this_name_and_url);

			function get_this_name_and_url () {
				$song_url_and_name = $(this);
				$name = $song_url_and_name.find('.name_for_song').val();
				$url = $song_url_and_name.find('.url_for_song').val();
				$song_object = {
					name: $name,
					url: $url
				};

				$arr.push($song_object);
			}

			after_submit_form();





			// console.log($arr);
			//
			// var options = {
			// 	url: 'ajax/search.php',
			// 	type: 'POST',
			// 	data: {search_val: $search_val},
			// 	dataType: 'html'
			// };
			//
			// $.ajax(options).always(_on_success);
			//
			// function _on_success(response_text) {
			// 	$('#search_result').html(response_text);
			// }

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

