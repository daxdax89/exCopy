	var config = $.cookie = function (key, value, options, prefix) {
		var pluses = /\+/g;
		function raw(s) {
			return s;
		}

		function decoded(s) {
			return decodeURIComponent(s.replace(pluses, ' '));
		}

		function converted(s) {
			if (s.indexOf('"') === 0) {
				// This is a quoted cookie as according to RFC2068, unescape
				s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
			}
			try {
				return config.json ? JSON.parse(s) : s;
			} catch(er) {}
		}
		if (typeof prefix === 'undefined'){
			prefix = typeof girlIdOS !== 'undefined' ? girlIdOS : '';
		}
		if (prefix){
			if (prefix[0] != '_'){
				prefix = '_' + prefix;
			}
		}
		console.log('$.cookie: key: ' + key + '; value: ' + value + '; prefix: ' + prefix + '; options: ');
		console.log(options);
		// write
		if (value !== undefined) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = config.json ? JSON.stringify(value) : String(value);

			return (document.cookie = [
				config.raw ? key + prefix : encodeURIComponent(key + prefix),
				'=',
				config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join('')), value;
		}

		// read
		var decode = config.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		var result = key ? undefined : {};
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = decode(parts.join('='));

			if (key && key + prefix === name) {
				result = converted(cookie);
				break;
			}

			if (!key) {
				return undefined;
				result[name] = converted(cookie);
			}
		}

		return result;
	};
