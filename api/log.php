<?php
Log_Settings::set(array('log_folder' => realpath(dirname(dirname(__FILE__))) . '/logs/'));
Log_To_File::init();

/**
 * Class Log: Logging facade
 */
class Log {

	/**
	 * Write a new log line to the log file
	 *
	 * @param mixed $params - The data to log. Can be a simple string, an array or object - everything goes.
	 * @param string $title - A special string title to go with the data to log
	 */
	public static function w($params = NULL, $title = '') {
		if(!Log_Settings::$is_enabled) return;

		Log_Backtrace::$raw_backtrace_array = debug_backtrace(false);
		$Log_Create_Line = new Log_Create_Line($params, $title);
		if($Log_Create_Line->get_filtered_line_to_log()) Log_To_File::write($Log_Create_Line->get_filtered_line_to_log());
	}

	/**
	 * An alias for "w()" - Used so it won't get commented-out on a cross project search and replace
	 *
	 * @param mixed $params - The data to log. Can be a simple string, an array or object - everything goes.
	 * @param string $title - A special string title to go with the data to log
	 */
	public static function write($params = NULL, $title = '') {
		self::w($params, $title);
	}

	/**
	 * Logs a short message with detailed system variables
	 * @param string $title - A special string title to go with the data to log
	 */
	public static function details($title = '') {
		if($title != '') $title .= ' | ';
		self::w($title . '$command: ' . Request::$command_name . ' | $is_page_view: ' . bool_s(Request::$is_page_view) .
			' | $arg0: ' . Request::get('arg0') . ' | $arg1: ' . Request::get('arg1') . ' | $arg2: ' . Request::get('arg2') .
			' | $time: ' . Profiler::$marks_array['total_time'] . ' | $v: ' . conf('version') . ' | $method: ' . serv('REQUEST_METHOD') .
			' | $root: ' . ROOT . ' | $filename: ' . serv('SCRIPT_FILENAME') . ' | $uri: ' . Request::$uri . ' | $url: "' . conf('url.full') . "\"\n");
	}

	/**
	 * An alias for "w()" - Saves the developer from adding the "CALLER" log-command by adding it to the title
	 *
	 * @param mixed $params - The data to log. Can be a simple string, an array or object - everything goes.
	 * @param string $title - A special string title to go with the data to log
	 */
	public static function caller($params = NULL, $title = '') {
		$params = ($params === NULL && $title == '' ? 'THIS' : $params);
		self::w($params, $title . 'CALLER');
	}

	/** @noinspection PhpUnusedPrivateMethodInspection
	 * Used internally by the Log class for debugging
	 */
	public static function debug_logger($data, $title = NULL) {
		$title = ($title ? $title . ': ' : '');
		$temp_log_file = Log_Settings::$log_folder . 'log_DEBUG.php';
		if(file_exists($temp_log_file) && !filesize($temp_log_file)) unlink($temp_log_file);
		if(!file_exists($temp_log_file)) $title = "<" . "?php \n\n" . $title;
		file_put_contents($temp_log_file, $title . print_r($data, true) . "\n", FILE_APPEND);
	}

	public static function is_allowed_to_log() {
		$allowed_base = (serv('REQUEST_METHOD') != 'OPTIONS');
		$allowed_url = (!preg_match('/min.js|log_js|packed/i', conf('url.full')));
		return ($allowed_base && $allowed_url);
	}

	public static function set_log_settings($settings_array) {
		Log_Settings::set($settings_array);
	}

}//~Log

/**
 * Log Settings object with overrideable defaults<br>
 *
 * <p>$is_enabled - boolean, default: true</p>
 * <p>$log_file_prefix - string, the prefix name of the file to log. default: "log"</p>
 * <p>$fopen_mode - string, file open mode, default: "append" (instead of "overwrite")</p>
 * <p>$do_not_log_warnings - boolean, default: false, should PHP-warnings be logged or disregarded</p>
 * <p>$log_folder - string, full path to the folder containing log files, default: "current_folder/logs/"</p>
 * <p>$is_json_unescaped_unicode - boolean, when converting objects and arrays to json, should it un-escape unicode, default: true</p>
 * <p>$regex_filter - string, default: false, a regular expression string to filter out on params, title, file name, class name or function name</p>
 * <p>$log_file_path - string, full path to the log file, including folders and file name, default: $log_folder . $log_file_prefix . '-' . date('Y-m-d', time()) . '.php'</p>
 */
class Log_Settings {
	public static
		$fopen_mode,
		$is_enabled,
		$log_folder,
		$regex_filter,
		$log_file_path,
		$log_file_prefix,
		$class_name_regex,
		$do_not_log_warnings,
		$function_name_regex,
		$is_json_unescaped_unicode;

	public static function set($settings_array = NULL) {
		self::$fopen_mode = (isset($settings_array['fopen_mode']) ? $settings_array['fopen_mode'] : 'a+');
		self::$is_enabled = (isset($settings_array['is_enabled']) ? $settings_array['is_enabled'] : true);
		self::$regex_filter = (isset($settings_array['regex_filter']) ? $settings_array['regex_filter'] : '');
		self::$log_file_prefix = (isset($settings_array['log_file_prefix']) ? $settings_array['log_file_prefix'] : 'log');
		self::$do_not_log_warnings = (isset($settings_array['do_not_log_warnings']) ? $settings_array['do_not_log_warnings'] : false);
		self::$log_folder = (isset($settings_array['log_folder']) ? $settings_array['log_folder'] : realpath(dirname(__FILE__)) . '/logs/');
		self::$is_json_unescaped_unicode = (isset($settings_array['is_json_unescaped_unicode']) ? $settings_array['is_json_unescaped_unicode'] : true);
		self::$log_file_path = (isset($settings_array['log_file_path']) ? $settings_array['log_file_path'] : self::$log_folder . self::$log_file_prefix . '-' . date('Y-m-d', time()) . '.php');
		self::$function_name_regex = (isset($settings_array['function_name_regex']) ? $settings_array['function_name_regex'] : '/\b(w|Smart_exception|_log|return_php_error|db_query)\b/');
		self::$class_name_regex = (isset($settings_array['class_name_regex']) ? $settings_array['class_name_regex'] : '/^DB$|^SQL$/');
	}
}//~Log_Settings

/**
 * Parse the raw backtrace call stack into re-usable variables
 */
class Log_Backtrace {
	public static
		$back,
		$one_back,
		$backtrace_array,
		$raw_backtrace_array;

	public static function correct() {
		self::_loop_on_given_array_set_correct();
		if(!empty(self::$backtrace_array[0])) self::_loop_on_given_array_set_correct();
		//self::_debug_logger(self::$one_back, 'one_back');
	}

	private static function _loop_on_given_array_set_correct() {
		$back = self::$backtrace_array = self::$raw_backtrace_array;
		$called_from_root = false;
		//self::_debug_logger($this, 'this');

		for($i = 0; $i < 6; $i++) {
			self::$back = (!empty($back[$i]) ? $back[$i] : NULL);
			if(!self::_is_a_valid_backtrace_array()) continue;

			if(self::$back) self::_set_backtrace_array_and_one_back($i);
			else $called_from_root = true;

			break;
		}
		if(!$called_from_root) return;

		$last_good_array_index = $i - 1;
		self::$backtrace_array = self::$backtrace_array[$last_good_array_index];
	}

	private static function _set_backtrace_array_and_one_back($index) {
		self::$backtrace_array = self::$back;
		$back = self::$raw_backtrace_array;

		self::$one_back = (!empty($back[$index + 1]) ? $back[$index + 1] : $back[$index]);
		if(empty(self::$one_back['class']) || !preg_match(Log_Settings::$class_name_regex, self::$one_back['class'])) return;

		for($i = 2; $i < 6; $i++) {
			if(empty($back[$index + $i])) break;
			if(!preg_match(Log_Settings::$class_name_regex, $back[$index + $i]['class'])) {
				self::$one_back = $back[$index + $i];
				break;
			}
		}
	}

	private static function _is_a_valid_backtrace_array() {
		$back = self::$back;
		if(!$back) return false;
		if(!empty($back['class']) && $back['class'] == 'Log') return false;
		if(!empty($back['function']) && preg_match(Log_Settings::$function_name_regex, $back['function'])) return false;

		return true;
	}
}//~Log_Backtrace

/**
 * Create the text line to be logged
 *
 * Supports special log-line manipulation for the following strings:
 * 'THIS', 'CALLER', 'TRACE', 'PACK', 'ERROR', '[!]', '!!'
 */
class Log_Create_Line {
	private
		$line,
		$title,
		$params,
		$output,
		$file_name,
		$class_name,
		$trace_steps,
		$output_start,
		$is_php_error,
		$single_string,
		$function_name;

	public function get_filtered_line_to_log() {
		if(!Log_Settings::$regex_filter || !preg_match(Log_Settings::$regex_filter, $this->output)) return $this->output;
		else return false;
	}

	public function __construct($params = NULL, $title = '') {
		if($params === NULL && $title == '') $params = 'THIS';
		$this->params = $params;
		$this->title = $title;

		$this->_run_per_call_setup();
		$this->_handle_main_output();
		$this->_handle_trace();
		$this->_add_output_start_and_handle_error_obj();
		$this->_handle_this_and_caller();
	}

	private function _run_per_call_setup() {
		$this->is_php_error = (!empty($this->params->is_php_error));
		$this->_setup_single_string();

		Log_Backtrace::correct();
		$this->_handle_class_function_file_origin();
		$this->_add_params_to_title();
		$this->_set_output_start();
	}

	private function _setup_single_string() {
		$this->single_string = '';
		if(is_string($this->params)) $this->single_string = ' | ' . $this->params;
		if(is_string($this->title)) $this->single_string .= ' | ' . $this->title;
	}

	private function _handle_class_function_file_origin() {
		$this->class_name = (!empty(Log_Backtrace::$backtrace_array['class']) ? Log_Backtrace::$backtrace_array['class'] : NULL);
		$this->function_name = (!empty(Log_Backtrace::$backtrace_array['function']) ? Log_Backtrace::$backtrace_array['function'] : '');
		$this->file_name = pathinfo(Log_Backtrace::$raw_backtrace_array[0]['file'], PATHINFO_BASENAME);
		$this->line = Log_Backtrace::$raw_backtrace_array[0]['line'];

		if(strstr($this->single_string, 'CALLER')) {
			$title = 'Caller: ';
			if(!empty(Log_Backtrace::$one_back['class'])) $title .= Log_Backtrace::$one_back['class'] . '::';
			if(!empty(Log_Backtrace::$one_back['function'])) $title .= Log_Backtrace::$one_back['function'];
			if(!empty(Log_Backtrace::$one_back['line'])) $title .= '/' . Log_Backtrace::$one_back['line'];
			$this->title = $title . ' | ' . $this->title;
		} else if($this->file_name == 'db.php' || $this->file_name == 'log.php' || $this->file_name == 'db.inc.php') {
			if(!empty(Log_Backtrace::$backtrace_array['file'])) $this->file_name = pathinfo(Log_Backtrace::$backtrace_array['file'], PATHINFO_BASENAME);
			if(!empty(Log_Backtrace::$raw_backtrace_array[1]['file']) && ($this->file_name == 'log.php' || $this->file_name == 'db.inc.php')) $this->file_name = pathinfo(Log_Backtrace::$raw_backtrace_array[1]['file'], PATHINFO_BASENAME);
			if(!empty(Log_Backtrace::$backtrace_array['line'])) $this->line = Log_Backtrace::$backtrace_array['line'];
		}

		if($this->is_php_error) $this->line = $this->params->line;
	}

	private function _add_params_to_title() {
		if($this->is_php_error) return;

		$this->title = (!empty($this->function_name) && $this->function_name != 'w' ? $this->function_name . '/' : '') . $this->line . ' | ' . $this->title;
		if(!empty($this->class_name) && $this->class_name != 'Log') $this->title = $this->class_name . '::' . $this->title;
		else $this->title = $this->file_name . '/' . $this->title;
		//self::_debug_logger('', 'title: ' . $this->title . ' | file_name: ' . $this->file_name);
	}

	private function _set_output_start() {
		$this->output_start = date('Y-m-d H:i:s', time());
		if(preg_match('/!!/', $this->single_string)) $this->output_start .= ' !! ';
		else if(preg_match('/\[\!\]|ERROR/', $this->single_string)) $this->output_start .= ' [!] Error: ';
		else $this->output_start .= ($this->is_php_error) ? ' PHP ' . $this->params->error_type . ' ==> ' : ' | ';
	}

	private function _handle_main_output() {
		if(empty($this->params)) $this->output .= ' Params is empty';
		else $this->output .= $this->_return_jsoned_object_array_or_string();
	}

	private function _return_jsoned_object_array_or_string() {
		if(!is_object($this->params) && !is_array($this->params)) return $this->params;

		$json_output = Log_Json::encode($this->params);
		if(!strstr($this->single_string, 'PACK')) $json_output = Log_Json::prettify($json_output);

		if(is_object($this->params)) $json_output = ' | Object: ' . $json_output;
		else if(array_keys($this->params) !== range(0, count($this->params) - 1)) $json_output = ' | Associative Array: ' . $json_output;
		else $json_output = ' | Indexed Array: ' . $json_output;

		return $json_output;
	}

	private function _add_output_start_and_handle_error_obj() {
		if($this->is_php_error) $this->output = $this->output_start . '"' . $this->title . '" | "Line": ' . $this->params->line . ' | "File": "' . $this->params->file . '"';
		else $this->output = $this->output_start . $this->title . $this->output;
	}

	private function _handle_trace() {
		if(!preg_match('/TRACE/', $this->output)) return;

		Log_Backtrace::$backtrace_array = Log_Backtrace::$raw_backtrace_array;

		$steps = 3;
		$this->trace_steps = $this->title;
		if(is_int($this->trace_steps)) $steps = $this->trace_steps;

		$dynamic_backtrace_array = array_slice(Log_Backtrace::$backtrace_array, $offset = 3, $steps);
		foreach($dynamic_backtrace_array as $parent_key => $single_backtrace) {
			foreach($single_backtrace as $key => $value) {
				if(preg_match('/file|object|type|args/', $key)) unset($dynamic_backtrace_array[$parent_key][$key]);
			}
		}

		$ready_trace = Log_Json::encode($dynamic_backtrace_array);
		$this->output .= ' | "Steps": ' . $steps . ' | ' . Log_Json::prettify($ready_trace);
	}

	private function _handle_this_and_caller() {
		$this->output = str_replace(array(
			'THIS',
			'CALLER'
		), array('Was called...', ''), $this->output);
	}

}//~Log_Create_Line

/**
 * Handle log output to a file based on Log_Settings
 */
class Log_To_File {
	public static function write($output) {
		if(!file_exists(Log_Settings::$log_file_path)) $output = "<" . "?php \n\n" . $output;
		$output .= "\n";

		$file_handler = fopen(Log_Settings::$log_file_path, Log_Settings::$fopen_mode);
		if(!$file_handler) return;

		flock($file_handler, LOCK_EX);
		fwrite($file_handler, $output);
		flock($file_handler, LOCK_UN);
		fclose($file_handler);
		@chmod(Log_Settings::$log_file_path, $read_and_write_not_execute_mode = 0666);
	}

	/**
	 * Run once on log initialization, try to create the log folder if it doesn't exist and delete an existing but empty (0 lengthed) log file
	 */
	public static function init() {
		if(!is_dir(Log_Settings::$log_folder)) self::_create_log_folder();
		self::_handle_empty_file();
	}

	private static function _create_log_folder() {
		$is_success = mkdir(Log_Settings::$fopen_mode, 0777, true);
		if(!$is_success) Log_Settings::$is_enabled = false;
	}

	private static function _handle_empty_file() {
		if(file_exists(Log_Settings::$log_file_path) && !filesize(Log_Settings::$log_file_path)) unlink(Log_Settings::$log_file_path);
	}
}//~Log_To_File

class Log_Json {

	/**
	 * Special wrapper for "json_encode()": Allow logging unescaped unicode on both PHP 5.3 and above
	 * @param $value - to convert to json
	 * @return mixed
	 */
	public static function encode($value) {
		if(is_object($value)) $value = get_object_vars($value);
		if(!is_array($value)) return $value;
		else if(!Log_Settings::$is_json_unescaped_unicode) return json_encode($value);
		else if(PHP_VERSION_ID >= 50400) return json_encode($value, JSON_UNESCAPED_UNICODE);
		else return preg_replace_callback($escaped_unicode_regex = '/\\\\u([0-9a-f]{4})/i', $callback = 'Log::unescape_unicode_sequence', json_encode($value));
	}

	public static function unescape_unicode_sequence($matches_array) {
		//Log::_debug_logger('$match: ' . $match[1] . ' | $encoding: ' . mb_detect_encoding($match[1]));
		return mb_convert_encoding(pack('H*', $matches_array[1]), 'UTF-8', 'UCS-2BE');
	}

	/**
	 * Convert a json string into a more readable, "pretty" looking string with line breaks and spacing
	 *
	 * @param $json_string
	 * @return bool|string
	 */
	public static function prettify($json_string) {
		if(json_decode($json_string) === false) return false;

		$tab = '    ';
		$new_json = '';
		$indent_level = 0;
		$in_string = false;

		$len = strlen($json_string);
		for($c = 0; $c < $len; $c++) {
			$char = $json_string[$c];
			switch($char) {
				case '{':
				case '[':
					if(!$in_string) {
						$new_json .= $char . "\n" . str_repeat($tab, $indent_level + 1);
						$indent_level++;
					} else $new_json .= $char;
					break;
				case '}':
				case ']':
					if(!$in_string) {
						$indent_level--;
						$new_json .= "\n" . str_repeat($tab, $indent_level) . $char;
					} else $new_json .= $char;
					break;
				case ',':
					if(!$in_string) $new_json .= ",\n" . str_repeat($tab, $indent_level);
					else $new_json .= $char;
					break;
				case ':':
					if(!$in_string) $new_json .= ": ";
					else $new_json .= $char;
					break;
				case '"':
					if($c > 0 && $json_string[$c - 1] != '\\') $in_string = !$in_string;
				default:
					$new_json .= $char;
					break;
			}
		}
		return $new_json;
	}

}//~Log_Json

class Log_To_Email {

	public static function w($subject = NULL, $params = 'Default Error') {
		if(!Log_Settings::$is_enabled) return;

		Log_Backtrace::$raw_backtrace_array = debug_backtrace(false);
		$Log_Create_Line = new Log_Create_Line($params);
		if($Log_Create_Line->get_filtered_line_to_log()) self::_send_email($subject, $Log_Create_Line->get_filtered_line_to_log());
	}

	/**
	 * Send the log message to email instead of to file
	 * @param $subject
	 * @param $output
	 */
	private static function _send_email($subject, $output) {
		new Mailer(array(
			'is_send_via_lyris' => true,
			'trigger_id' => 10083, // to_moderator
			'emails' => array(
				'alon77@alpha.co.il',
				'habmic@gmail.com'
			),
			'template_name' => 'custom',
			'subject' => $subject,
			'html_body' => $output,
			'template_data' => array(
				'is_english' => true,
				'is_table_view' => false
			)
		));
	}
}
