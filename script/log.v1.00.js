/*! Log v1.00 | (c) 2015 */
(function(window) {

	var raw_params,
		title,
		data = {},
		methods_array = [],
		seen_in_stringify_array = [],
		_console = { logger: _run_actual_logger };

	function w(p, t) {
		raw_params = p;
		title = t;
		_init_with_backtrace();
	}

	function _init_with_backtrace() {
		_init_data_object();

		data.exception_object = new Error('Init logger');
		if(!data.exception_object.stack) data.exception_object.stack = '';
		//console.log("Stack: \n" + data.exception_object.stack);

		_setup();
		_run_main_logic();
	}

	function _init_data_object() {
		data.params = raw_params;
		data.title = title;
		data.type = _return_real_type(raw_params);
		data.is_full = false;
		data.bracktrace_array = [];
		data.single_string = '';
		data.exception_object = null;
		data.function_name = null;
		data.source = null;
		data.line = null;
		data.message = '';
	}

	function _run_actual_logger(console_command, params) {
		try {
			if(console_command == 'log') {
				if(/THIS/.test(data.single_string)) params = params.replace('THIS', 'Was called...');
				if(/INFO/.test(data.single_string)) console_command = 'info';
				if(/ERROR|WARN|BUG/.test(data.single_string)) console_command = 'warn';
			}

			if(is_ie() && console_command.match(/info|group/)) return _console;

			if(console_command == 'start_group') console_command = _return_group_opened_or_closed();

			if(!is_ie() && params && console_command == 'dir' && (typeof params == 'object' || typeof params == 'array')) console.dir(params);
			else if(console_command == 'dir') console.log(params);
			else if(console_command == 'log_methods_array') console.log(params);
			else if(params) console[console_command](params);
			else console[console_command]();

			return _console;

		} catch(exception_object) {
			if(!window.console.log) alert('failed to log | console_command: ' + console_command);
			else window.console.log(exception_object, 'console_command: ' + console_command + ' | exception_object');
			return _console;
		}
	}

	function _return_group_opened_or_closed() {
		if(/OPEN/.test(data.single_string)) return 'group';
		return 'groupCollapsed';
	}

	function _run_main_logic() {
		_add_params_custom_type_to_title();
		_handle_main_output();
		_handle_string_substitution_pattern();
		_console_logger();
	}

	function _add_params_custom_type_to_title() {
		var parse_value;

		//console.log('data.type: ' + data.type + ' | data.title: ' + data.title);
		if(data.type == 'object' || data.type == 'array' || data.type == 'json') {
			data.title += "\n";
			return;
		}

		parse_value = _return_parsed_value(data.params);
		data.title += ' | ' + parse_value;
	}

	function _return_parsed_value(param) {
		var type = _return_real_type(param),
			quotes = (type == 'string') ? '"' : '';

		if(param === undefined) return 'undefined (undefined)';
		else if(type == 'null') return 'null (null)';
		else if(type == 'number' && isNaN(param)) return 'NaN (NaN)';
		else if(type == 'DOM_element') return param.tagName + " DOM Element (object):\n";
		else if(type == 'jQuery') return "jQuery (object):\n";
		else if(param === 0) return '0 (number)';
		else if(param === false) return 'false (boolean)';
		else if(_trim(param) === '') return '"' + param + '" (empty string)';
		else return quotes + param + quotes + ' (' + type + ')';
	}

	function _handle_main_output() {
		if(!data.params || data.is_full) return;

		if(data.type == 'json') data.params = JSON.parse(data.params);
		if(/DUMP/.test(data.single_string) && (typeof data.params == 'object' || data.type == 'array')) _set_detailed_object();
		else if(!/DIR/.test(data.single_string) && ((typeof data.params == 'object' && data.params !== null) || data.type == 'array')) _parse_object_to_pretty_json_and_seperate_methods();
	}

	function _parse_object_to_pretty_json_and_seperate_methods() {
		var new_object = (data.type == 'array') ? data.params : {},
			key;

		for(key in data.params) {
			if(!data.params.hasOwnProperty(key)) continue;
			if(typeof data.params[key] === 'function') methods_array.push(key);
			else new_object[key] = data.params[key];
		}

		data.message = JSON.stringify(new_object, _exclude_already_stringified_objects, 4);
	}

	function _exclude_already_stringified_objects(key, value) {
		if(typeof value == 'object') {
			// if the "indexOf" method exists (on IE8 it doesn't) and the value already exists inside the array:
			if(typeof Array.prototype.indexOf === 'function' && seen_in_stringify_array.indexOf(value) > -1) return null;
			seen_in_stringify_array.push(value);
		}
		return value;
	}

	function _set_detailed_object() {
		var object_count = 0,
			key, value, quotes, type;

		for(key in data.params) {
			if(!data.params.hasOwnProperty(key)) continue;

			value = data.params[key];
			type = typeof value;
			if(value !== null && (type == 'object' || type == 'function')) {
				object_count++;
				continue;
			}

			quotes = (type == 'string') ? '"' : '';
			data.message += '"' + key + '": ' + _return_parsed_value(value) + "\n";
		}

		if(object_count) data.message += 'Inner objects/functions/arrays found: ' + object_count + "\n";
		if(object_count == 1) data.message += data.params;
	}

	function _handle_string_substitution_pattern() {
		var string_substitution_regex = /%s|%d|%i|%f|%o|%c/;
		if(!string_substitution_regex.test(data.message)) return;

		data.title += '(found and removed a string substitution pattern)';
		data.message = data.message.replace(string_substitution_regex, '%%%');
	}

	function _return_ready_source(raw_source) {
		var source = /.*[\/](.*)\.js/.exec(raw_source);
		if(source === null || source[1] === null) return '';

		return (source[1] ? source[1] + '/' : '');
	}

	function _setup() {
		_set_bracktrace_array();
		_set_correct_backtrace_array();
		_set_backtrace_params();
		_add_backtrace_params_to_title();
		_set_single_string();
		_set_is_full();
	}

	function _add_backtrace_params_to_title() {
		var object_or_array_prefix = '',
			title = '',
			function_name = '';

		data.function_name = (data.bracktrace_array[1] ? data.bracktrace_array[1] : '');
		data.source = _return_ready_source(data.bracktrace_array[2]);
		data.line = (data.bracktrace_array[3] ? data.bracktrace_array[3] : '');

		if(typeof data.title == 'string') title = ' | ' + data.title;
		if(data.function_name != '') function_name = data.function_name + '/';

		if(data.type == 'object') object_or_array_prefix = ' | Object: ';
		else if(data.type == 'json') object_or_array_prefix = ' | JSON String: ';
		else if(data.type == 'array') object_or_array_prefix = ' | Array: ';

		data.title = data.source + function_name + data.line + title + object_or_array_prefix;
	}

	function _set_single_string() {
		if(data.type == 'string') data.single_string = data.params + ' | ' + data.title;
		else data.single_string = data.title;
	}

	function _set_is_full() {
		if(/FULL/.test(data.single_string)) data.is_full = true;
	}

	function _set_bracktrace_array() {
		var raw_array = data.exception_object.stack.split("\n"),
			array_size = raw_array.length,
			index;

		//console.log('raw stack trace:', exception_object.stack);

		for(index = 0; index < array_size; index++) {
			if(raw_array[index] == '') continue;
			data.bracktrace_array.push(raw_array[index]);
		}

		//console.log('full data object: ', data);
	}

	function _set_correct_backtrace_array() {
		var current_trace_array, i;
		for(i = 0; i < 6; i++) {
			current_trace_array = /(.*)@(.*):(.*):(.*)/.exec(data.bracktrace_array[i]);
			if(_empty(current_trace_array) || /window\.log|backtrace|^w$/.test(current_trace_array[1])) continue;

			data.bracktrace_array = current_trace_array;
			break;
		}
	}

	function _set_backtrace_params() {
		data.function_name = data.bracktrace_array[1];
		data.source = data.bracktrace_array[2];
		data.line = data.bracktrace_array[3];
	}

	function _return_real_type(param) {
		var to_class = {}.toString,
			base_type = to_class.call(param).replace('[object ', '').replace(']', '').toLowerCase();

		if(base_type == 'string' && parseInt(param) == param) return 'integer';
		if(base_type == 'string' && _is_valid_json(param) && param !== 'true') return 'json';
		if(typeof param == 'object' && param === null) return 'null';
		if(typeof param == 'object' && typeof jQuery != 'undefined' && param instanceof jQuery && typeof param.jquery == 'string') return 'jQuery';
		if(typeof param == 'object' && param !== null && typeof param.tagName != 'undefined') return 'DOM_element';
		return base_type;
	}

	function _is_valid_json(string) {
		return (/^[\],:{}\s]*$/.test(string.replace(/\\["\\\/bfnrtu]/g, '@').
			replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
			replace(/(?:^|:|,)(?:\s*\[)+/g, '')));
	}

	function _trim(text) {
		var trimLeft = /^\s+/,
			trimRight = /\s+$/;

		return (text == null || !text.toString) ? '' : text.toString().replace(trimLeft, '').replace(trimRight, '');
	}

	function _empty(param) {
		return (param === undefined || param === null || _trim(param) === '' || param === 0 || param === false || param.length == 0);
	}

	function _console_logger() {
		if(data.is_full) _console.logger('start_group', data.title).logger('dir', data.params).logger('groupEnd');
		else if(/CLEAR/.test(data.single_string)) _console.logger('clear').logger('warn', data.title);
		else if(/TRACE/.test(data.single_string)) _console.logger('start_group', data.title).logger('trace').logger('groupEnd');
		else if(/date|regexp/.test(data.type)) _console.logger('log', data.title + ' | ' + data.type + ': ' + data.params);
		else if(data.type == 'jQuery') _console.logger('start_group', data.title).logger('info', data.params).logger('info', data.message).logger('groupEnd');
		else if(data.type == 'DOM_element') _console.logger('start_group', data.title).logger('log', data.params).logger('dir', data.params).logger('groupEnd');
		else if(/DIR/.test(data.single_string)) _console.logger('start_group', data.title).logger('dir', data.params).logger('groupEnd');
		else if(_empty(data.message)) _console.logger('log', data.title);
		else _console.logger('start_group', data.title).logger('log', data.message).logger('log_methods_array', data.params).logger('groupEnd');
	}

	function is_ie() {
		return (!!window.navigator.userAgent.match(/Trident/));
	}

	window.is_ie = is_ie;

	window.log = function (raw_params, title) {
		if(window.config && !window.config.log_js) return;
		if(!window.is_ie()) w(raw_params, title);
	};

})(window);
