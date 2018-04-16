(function(window) {

	var $ = window.jQuery;

	window.App = {};
	window.App.send = send;
	window.App.delete_playlist = delete_playlist;

	function send(command, is_post, request, callback) {
		var options = {
			url: 'http://api.local/api/playList/?type=' + command,
			// 'http://api.local/api/playList/api.php/?type=playlist',
			type: (is_post ? 'POST' : 'GET'),
			data: request,
			dataType: 'json'
		};

		// log('command: ' + command + ' | is_post: ' + is_post);
		$.ajax(options).always(_on_response);

		function _on_response(response) {
			if(callback) callback(response);
		}
	}

	function delete_playlist(command, callback) {
		var options = {
			url: 'http://api.local/api/playlist/?type=playlist&&id=' + command,
			type: 'DELETE',
			dataType: 'json'
		};

		// log('command: ' + command + ' | is_post: ' + is_post);
		$.ajax(options).always(_on_response);

		function _on_response(response) {
			if(callback) callback(response);
		}
	}

	//
	// function get_playlist_object_from_server($id, _callback_success) {
	// 	$.ajax({
	// 		url: 'http://api.local/api/playList/api.php/?type=playlist&&id=' + $id,
	// 		type: 'GET',
	// 		dataType: 'json'
	// 	}).always(_parse_response);
	//
	// 	function _parse_response(response){
	// 		// log(response);
	// 		_callback_success(isset(response, 'data') ? response.data : {});
	// 	}
	// }

})(window);

