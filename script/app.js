(function(window) {

	var $ = window.jQuery;

	window.App = {};
	window.App.send = send;
	window.App.delete_playlist = delete_playlist;

	function send(type, is_post, request, callback) {
		var options = {
				url: 'http://www.api.local/api/playlist.php?type=' + type,
				type: (is_post ? 'POST' : 'GET'),
				data: request,
				dataType: 'json'
			};

		log('url: ' + options.url + ' | is_post: ' + is_post);
		$.ajax(options).always(_on_response);

		function _on_response(response) {
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

})(window);

