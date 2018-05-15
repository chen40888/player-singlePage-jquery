(function(window) {

	var $ = window.jQuery;

	window.App = {};
	window.App.send = send;
	window.App.valid = valid;
	window.App.delete_playlist = delete_playlist;
	// window.App.validation = validation;
	validation();

	function send(type, is_post, request, callback) {
		var options = {
				url: 'http://www.api.local/api/playlist.php?type=' + type,
				type: (is_post ? 'POST' : 'GET'),
				data: request,
				dataType: 'json'
			};

		// log('url: ' + options.url + ' | is_post: ' + is_post);
		$.ajax(options).always(_on_response);

		function _on_response(response) {
			// console.log(response);
			if(callback) callback(response);
		}
	}

	function delete_playlist(command, callback) {
		var options = {
			url: 'http://www.api.local/api/playlist/?type=playlist&id=' + command,
			type: 'DELETE',
			dataType: 'json'
		};

		// log('command: ' + command + ' | is_post: ' + is_post);
		$.ajax(options).always(_on_response);

		function _on_response(response) {
			if(callback) callback(response);
		}
	}

	function valid(object) {
		// console.log(object);
		var name = object['name'],
			image = object['image'],
			songs_array = object['songs'];

		var regexUrl = RegExp(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/);
		if(name === '' || image === '') {
			return false
		}
		var patt = RegExp(/^.{2,}$/);

		// is_valid_name ? valid($this_input) : problem($this_input);

		for(var i = 0; i < songs_array.length; i++) {
			var song_name = songs_array[i]['name'],
				song_url = songs_array[i]['url'];

			var is_valid_name = patt.test(song_name);
			var is_mp3 = song_url.search(/.mp3/i);
			var song_url_mp3valid = regexUrl.test(song_url);

			console.log('song_url_mp3valid ' +song_url_mp3valid);


			if(song_name === '' || song_url === '' || !is_valid_name || is_mp3 === -1 || !song_url_mp3valid) {
				// console.log($(songs_array[i]).closest('div'));
				// alert();
				// problem(songs_array[i]);
// alert();

				$('#not_valid').show();
				return false;
			}
		}

		// $('#not_valid').removeClass(' not_valid');

		return true;
	}

	function validation() {
		$("#new_playlist").validate();

		$.validator.setDefaults({
			debug: true,
			success: "valid"
		});
	}

})(window);

