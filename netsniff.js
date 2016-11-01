


<!DOCTYPE html>
<html lang="en" >

<head>

	
	<script>
window.ts_endpoint_url = "https:\/\/slack.com\/beacon\/timing";

(function(e) {
	var n=Date.now?Date.now():+new Date,r=e.performance||{},t=[],a={},i=function(e,n){for(var r=0,a=t.length,i=[];a>r;r++)t[r][e]==n&&i.push(t[r]);return i},o=function(e,n){for(var r,a=t.length;a--;)r=t[a],r.entryType!=e||void 0!==n&&r.name!=n||t.splice(a,1)};r.now||(r.now=r.webkitNow||r.mozNow||r.msNow||function(){return(Date.now?Date.now():+new Date)-n}),r.mark||(r.mark=r.webkitMark||function(e){var n={name:e,entryType:"mark",startTime:r.now(),duration:0};t.push(n),a[e]=n}),r.measure||(r.measure=r.webkitMeasure||function(e,n,r){n=a[n].startTime,r=a[r].startTime,t.push({name:e,entryType:"measure",startTime:n,duration:r-n})}),r.getEntriesByType||(r.getEntriesByType=r.webkitGetEntriesByType||function(e){return i("entryType",e)}),r.getEntriesByName||(r.getEntriesByName=r.webkitGetEntriesByName||function(e){return i("name",e)}),r.clearMarks||(r.clearMarks=r.webkitClearMarks||function(e){o("mark",e)}),r.clearMeasures||(r.clearMeasures=r.webkitClearMeasures||function(e){o("measure",e)}),e.performance=r,"function"==typeof define&&(define.amd||define.ajs)&&define("performance",[],function(){return r}) // eslint-disable-line
})(window);

</script>
<script>;(function() {

'use strict';


window.TSMark = function(mark_label) {
	if (!window.performance || !window.performance.mark) return;
	performance.mark(mark_label);
};
window.TSMark('start_load');


window.TSMeasureAndBeacon = function(measure_label, start_mark_label) {
	if (start_mark_label === 'start_nav' && window.performance && window.performance.timing) {
		window.TSBeacon(measure_label, (new Date()).getTime() - performance.timing.navigationStart);
		return;
	}
	if (!window.performance || !window.performance.mark || !window.performance.measure) return;
	performance.mark(start_mark_label + '_end');
	try {
		performance.measure(measure_label, start_mark_label, start_mark_label + '_end');
		window.TSBeacon(measure_label, performance.getEntriesByName(measure_label)[0].duration);
	} catch(e) { return; }
};


window.TSBeacon = function(label, value) {
	var endpoint_url = window.ts_endpoint_url || 'https://slack.com/beacon/timing';
	(new Image()).src = endpoint_url + '?data=' + encodeURIComponent(label + ':' + value);
};

})();
</script>
 

<script>
window.TSMark('step_load');
</script>	<noscript><meta http-equiv="refresh" content="0; URL=/?redir=%2Ffiles-pri%2FT024HKJ66-F2WT7EKJA%2Fnetsniff.js&amp;nojsmode=1" /></noscript>
<script>(function() {
        'use strict';

	var start_time = Date.now();
	var logs = [];
	var connecting = true;
	var ever_connected = false;
	var log_namespace;

	var logWorker = function(ob) {
		var log_str = ob.secs+' start_label:'+ob.start_label+' measure_label:'+ob.measure_label+' description:'+ob.description;

		if (TS.metrics.getLatestMark(ob.start_label)) {
			TS.metrics.measure(ob.measure_label, ob.start_label);
			TS.log(88, log_str);

			if (ob.do_reset) {
				window.TSMark(ob.start_label);
			}
		} else {
			TS.maybeWarn(88, 'not timing: '+log_str);
		}
	}

	var log = function(k, description) {
		var secs = (Date.now()-start_time)/1000;

		logs.push({
			k: k,
			d: description,
			t: secs,
			c: !!connecting
		})

		if (!window.boot_data) return;
		if (!window.TS) return;
		if (!TS.metrics) return;
		if (!connecting) return;

		
		log_namespace = log_namespace || (function() {
			if (boot_data.app == 'client') return 'client';
			if (boot_data.app == 'space') return 'post';
			if (boot_data.app == 'api') return 'apisite';
			if (boot_data.app == 'mobile') return 'mobileweb';
			if (boot_data.app == 'web' || boot_data.app == 'oauth') return 'web';
			return 'unknown';
		})();

		var modifier = (TS.boot_data.feature_no_rollups) ? '_no_rollups' : '';

		logWorker({
			k: k,
			secs: secs,
			description: description,
			start_label: ever_connected ? 'start_reconnect' : 'start_load',
			measure_label: 'v2_'+log_namespace+modifier+(ever_connected ? '_reconnect__' : '_load__')+k,
			do_reset: false,
		});
	}

	var setConnecting = function(val) {
		val = !!val;
		if (val == connecting) return;

		if (val) {
			log('start');
			if (ever_connected) {
				
				window.TSMark('start_reconnect');
				window.TSMark('step_reconnect');
				window.TSMark('step_load');
			}

			connecting = val;
			log('start');
		} else {
			log('over');
			ever_connected = true;
			connecting = val;
		}
	}

	window.TSConnLogger = {
		log: log,
		logs: logs,
		start_time: start_time,
		setConnecting: setConnecting
	}
})();</script>

<script type="text/javascript">
if(self!==top)window.document.write("\u003Cstyle>body * {display:none !important;}\u003C\/style>\u003Ca href=\"#\" onclick="+
"\"top.location.href=window.location.href\" style=\"display:block !important;padding:10px\">Go to Slack.com\u003C\/a>");

(function() {
	var timer;
	if (self !== top) {
		timer = window.setInterval(function() {
			if (window.$) {
				try {
					$('#page').remove();
					$('#client-ui').remove();
					window.TS = null;
					window.clearInterval(timer);
				} catch(e) {}
			}
		}, 200);
	}
}());

</script>

<script>(function() {
        'use strict';

        window.callSlackAPIUnauthed = function(method, args, callback) {
                var timestamp = Date.now() / 1000;  
                var version = (window.TS && TS.boot_data) ? TS.boot_data.version_uid.substring(0, 8) : 'noversion';
                var url = '/api/' + method + '?_x_id=' + version + '-' + timestamp;
                var req = new XMLHttpRequest();

                req.onreadystatechange = function() {
                        if (req.readyState == 4) {
                                req.onreadystatechange = null;
                                var obj;

                                if (req.status == 200 || req.status == 429) {
                                        try {
                                                obj = JSON.parse(req.responseText);
                                        } catch (err) {
                                                console.warn('unable to do anything with api rsp');
                                        }
                                }

                                obj = obj || {
                                        ok: false
                                }

                                callback(obj.ok, obj, args);
                        }
                }

                var async = true;
                req.open('POST', url, async);

                var form_data = new FormData();
                var has_data = false;
                Object.keys(args).map(function(k) {
                        if (k[0] === '_') return;
                        form_data.append(k, args[k]);
                        has_data = true;
                });

                if (has_data) {
                        req.send(form_data);
                } else {
                        req.send();
                }
        }
})();</script>

						
	
		<script>
			if (window.location.host == 'slack.com' && window.location.search.indexOf('story') < 0) {
				document.cookie = '__cvo_skip_doc=' + escape(document.URL) + '|' + escape(document.referrer) + ';path=/';
			}
		</script>
	

		<script type="text/javascript">
		
		try {
			if(window.location.hash && !window.location.hash.match(/^(#?[a-zA-Z0-9_]*)$/)) {
				window.location.hash = '';
			}
		} catch(e) {}
		
	</script>

	<script type="text/javascript">
				(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		ga('create', "UA-106458-17", 'slack.com');

		
			window.optimizely = [];
		
		
		ga('send', 'pageview');
	
		(function(e,c,b,f,d,g,a){e.SlackBeaconObject=d;
		e[d]=e[d]||function(){(e[d].q=e[d].q||[]).push([1*new Date(),arguments])};
		e[d].l=1*new Date();g=c.createElement(b);a=c.getElementsByTagName(b)[0];
		g.async=1;g.src=f;a.parentNode.insertBefore(g,a)
		})(window,document,"script","https://a.slack-edge.com/dcf8/js/libs/beacon.js","sb");
		sb('set', 'token', '3307f436963e02d4f9eb85ce5159744c');

				sb('track', 'pageview');

		function track(a){ga('send','event','web',a);sb('track',a);}

	</script>



<script type='text/javascript'>
	
	/* safety stub */
	window.mixpanel = {
		track: function() {},
		track_links: function() {},
		track_forms: function() {}
	};

	function mixpanel_track(){}
	function mixpanel_track_forms(){}
	function mixpanel_track_links(){}
	
</script>
	
	<meta name="referrer" content="no-referrer">
		<meta name="superfish" content="nofish">

	<script type="text/javascript">



var TS_last_log_date = null;
var TSMakeLogDate = function() {
	var date = new Date();

	var y = date.getFullYear();
	var mo = date.getMonth()+1;
	var d = date.getDate();

	var time = {
	  h: date.getHours(),
	  mi: date.getMinutes(),
	  s: date.getSeconds(),
	  ms: date.getMilliseconds()
	};

	Object.keys(time).map(function(moment, index) {
		if (moment == 'ms') {
			if (time[moment] < 10) {
				time[moment] = time[moment]+'00';
			} else if (time[moment] < 100) {
				time[moment] = time[moment]+'0';
			}
		} else if (time[moment] < 10) {
			time[moment] = '0' + time[moment];
		}
	});

	var str = y + '/' + mo + '/' + d + ' ' + time.h + ':' + time.mi + ':' + time.s + '.' + time.ms;
	if (TS_last_log_date) {
		var diff = date-TS_last_log_date;
		//str+= ' ('+diff+'ms)';
	}
	TS_last_log_date = date;
	return str+' ';
}

var parseDeepLinkRequest = function(code) {
	var m = code.match(/"id":"([CDG][A-Z0-9]{8})"/);
	var id = m ? m[1] : null;

	m = code.match(/"team":"(T[A-Z0-9]{8})"/);
	var team = m ? m[1] : null;

	m = code.match(/"message":"([0-9]+\.[0-9]+)"/);
	var message = m ? m[1] : null;

	return { id: id, team: team, message: message };
}

if ('rendererEvalAsync' in window) {
	var origRendererEvalAsync = window.rendererEvalAsync;
	window.rendererEvalAsync = function(blob) {
		try {
			var data = JSON.parse(decodeURIComponent(atob(blob)));
			if (data.code.match(/handleDeepLink/)) {
				var request = parseDeepLinkRequest(data.code);
				if (!request.id || !request.team || !request.message) return;

				request.cmd = 'channel';
				TSSSB.handleDeepLinkWithArgs(JSON.stringify(request));
				return;
			} else {
				origRendererEvalAsync(blob);
			}
		} catch (e) {
		}
	}
}
</script>



<script type="text/javascript">

	var TSSSB = {
		call: function() {
			return false;
		}
	};

</script>
<script>TSSSB.env = (function() {
	'use strict';

	var v = {
		win_ssb_version: null,
		win_ssb_version_minor: null,
		mac_ssb_version: null,
		mac_ssb_version_minor: null,
		mac_ssb_build: null,
		lin_ssb_version: null,
		lin_ssb_version_minor: null,
		desktop_app_version: null
	};

	var is_win = (navigator.appVersion.indexOf("Windows") !== -1);
	var is_lin = (navigator.appVersion.indexOf("Linux") !== -1);
	var is_mac = !!(navigator.userAgent.match(/(OS X)/g));

	if (navigator.userAgent.match(/(Slack_SSB)/g) || navigator.userAgent.match(/(Slack_WINSSB)/g)) {
		
		var parts = navigator.userAgent.split('/');
		var version_str = parts[parts.length-1];
		var version_float = parseFloat(version_str);
		var version_parts = version_str.split('.');
		var version_minor = (version_parts.length == 3) ? parseInt(version_parts[2]) : 0;

		if (navigator.userAgent.match(/(AtomShell)/g)) {
			
			if (is_lin) {
				v.lin_ssb_version = version_float;
				v.lin_ssb_version_minor = version_minor;
			} else if (is_win) {
				v.win_ssb_version = version_float;
				v.win_ssb_version_minor = version_minor;
			} else if (is_mac) {
				v.mac_ssb_version = version_float;
				v.mac_ssb_version_minor = version_minor;
			}

			if (version_parts.length >= 3) {
				v.desktop_app_version = {
					major: parseInt(version_parts[0]),
					minor: parseInt(version_parts[1]),
					patch: parseInt(version_parts[2])
				}
			}
		} else {
			
			v.mac_ssb_version = version_float;
			v.mac_ssb_version_minor = version_minor;

			
			
			var app_ver = window.macgap && macgap.app && macgap.app.buildVersion && macgap.app.buildVersion();
			var matches = String(app_ver).match(/(?:\()(.*)(?:\))/);
			v.mac_ssb_build = (matches && matches.length == 2) ? parseInt(matches[1] || 0) : 0;
		}
	}

	return v;
})();
</script>


	<script type="text/javascript">
		
		var was_TS = window.TS;
		delete window.TS;
		TSSSB.call('didFinishLoading');
		if (was_TS) window.TS = was_TS;
	</script>
	    <title>Slack</title>
    <meta name="author" content="Slack">
    <meta name="robots" content="noindex,nofollow">

	
		
	
	
					
	
				
																
	
	
	
			<!-- output_css "core" -->
    <link href="https://a.slack-edge.com/39e82/style/rollup-plastic.css" rel="stylesheet" type="text/css" crossorigin="anonymous">

		<!-- output_css "before_file_pages" -->

	<!-- output_css "file_pages" -->

	<!-- output_css "regular" -->
    <link href="https://a.slack-edge.com/261f/style/index.css" rel="stylesheet" type="text/css" crossorigin="anonymous">
    <link href="https://a.slack-edge.com/1d9c/style/libs/lato-1-compressed.css" rel="stylesheet" type="text/css" crossorigin="anonymous">
    <link href="https://a.slack-edge.com/f18f/style/sticky_nav.css" rel="stylesheet" type="text/css" crossorigin="anonymous">
    <link href="https://a.slack-edge.com/5cdc7/style/footer.css" rel="stylesheet" type="text/css" crossorigin="anonymous">

	

	
	
		<meta name="robots" content="noindex, nofollow" />
	

	
<link id="favicon" rel="shortcut icon" href="https://a.slack-edge.com/66f9/img/icons/favicon-32.png" sizes="16x16 32x32 48x48" type="image/png" />

<link rel="icon" href="https://a.slack-edge.com/0180/img/icons/app-256.png" sizes="256x256" type="image/png" />

<link rel="apple-touch-icon-precomposed" sizes="152x152" href="https://a.slack-edge.com/66f9/img/icons/ios-152.png" />
<link rel="apple-touch-icon-precomposed" sizes="144x144" href="https://a.slack-edge.com/66f9/img/icons/ios-144.png" />
<link rel="apple-touch-icon-precomposed" sizes="120x120" href="https://a.slack-edge.com/66f9/img/icons/ios-120.png" />
<link rel="apple-touch-icon-precomposed" sizes="114x114" href="https://a.slack-edge.com/66f9/img/icons/ios-114.png" />
<link rel="apple-touch-icon-precomposed" sizes="72x72" href="https://a.slack-edge.com/0180/img/icons/ios-72.png" />
<link rel="apple-touch-icon-precomposed" href="https://a.slack-edge.com/66f9/img/icons/ios-57.png" />

<meta name="msapplication-TileColor" content="#FFFFFF" />
<meta name="msapplication-TileImage" content="https://a.slack-edge.com/66f9/img/icons/app-144.png" />
	
	<!--[if lt IE 9]>
	<script src="https://a.slack-edge.com/ef0d/js/libs/html5shiv.js"></script>
	<![endif]-->

</head>

<body class="	index		">

		  			<script>
		
			var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
			if (w > 1440) document.querySelector('body').classList.add('widescreen');
		
		</script>
	
  	
	

	
							





<nav class="top persistent">

	
	<a href="https://slack.com/" class="logo" data-qa="logo" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=logo" aria-label="Slack homepage"></a>

	
						<ul>
				<li><a  href="https://slack.com/is" data-qa="product" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=nav_product">Product</a></li>
				<li><a  href="https://slack.com/pricing" data-qa="pricing" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=nav_pricing">Pricing</a></li>				<li><a  href="https://get.slack.help/hc/en-us" data-qa="support" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=nav_support">Support</a></li>
				<li><a  href="http://slackhq.com" data-qa="blog" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=nav_blog">Blog</a></li>
				<li class="sign_in"><a href="https://slack.com/signin" class="opt_nav_signin" data-qa="sign_in" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=nav_sign_in">Sign in</a></li>
				<li class="sign_in mobile_btn"><a href="https://slack.com/signin" class="opt_nav_signin" data-qa="sign_in" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=nav_sign_in">Sign in</a></li>
				<li class="create_team"><a href="https://slack.com/create" class="opt_nav_create btn_sticky ga_track_signup btn_sticky_filled " data-qa="create_team" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=nav_create_team">Create a new team</a></li>				<li class="mobile_btn mobile_menu_btn">
					<a href="#" class="btn_sticky" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=nav_mobile_menu_btn">Menu</a>
				</li>
			</ul>
			</nav>

<nav class="mobile_menu loading " aria-hidden="true">
			<a href="https://slack.com/" class="logo" data-qa="logo" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=nav_logo" aria-label="Slack homepage"></a>
			<a href="#" class="close" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=nav_menu_close" aria-label="close"><ts-icon class="ts_icon ts_icon_times"></ts-icon></a>
									<ul>
					<li><a  href="https://slack.com/is" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=nav_product">Product</a></li>
					<li><a  href="https://slack.com/pricing" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=nav_pricing">Pricing</a></li>					<li><a  href="https://get.slack.help/hc/en-us" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=nav_support">Support</a></li>
					<li><a  href="http://slackhq.com" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=nav_blog">Blog</a></li>
					<li><a href="https://slack.com/signin" class="opt_nav_signin" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=nav_sign_in">Sign in</a></li>
				</ul>
				<a href="https://slack.com/create" class="opt_nav_create sign_up ga_track_signup " data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=nav_create_team">Create a new team</a>						</nav>

	
	<div id="page" >

		<div id="page_contents" data-qa="page_contents" class="">

<div class="span_4_of_6 col float_none margin_auto no_right_padding">
			<p class="alert alert_info"><i class="ts_icon ts_icon_info_circle"></i> You need to sign in to see this page.</p>

	<p id="error_ratelimit" class="alert alert_warning" style="display: none;"><i class="ts_icon ts_icon_warning"></i> <strong>Too many login failures!</strong><br class="hide_on_mobile" />
		Please take a deep breath and try again in a moment.
</p>
<p id="error_unknown" class="alert alert_error" style="display: none;"><i class="ts_icon ts_icon_warning"></i> Hmmm... something went wrong. Please try again.</p></div>

	<div class="real_content card align_center span_4_of_6 col float_none margin_auto large_bottom_margin right_padding large_bottom_padding">
	<h1 id="signin_header"> Sign in to <span class="break_word">newcity.slack.com</span></h1>

	
	<div class="col span_4_of_6 float_none margin_auto large_bottom_margin">

		<form id="signin_form" action="/" method="post" accept-encoding="UTF-8">
			<input type="hidden" name="signin" value="1">
			<input type="hidden" name="redir" value="/files-pri/T024HKJ66-F2WT7EKJA/netsniff.js">
						<input type="hidden" name="crumb" value="s-1478010910-f3ad27b2ac-☃" />

			<p>Enter your <strong>email address</strong> and <strong>password</strong>.</p>

			<p class=" no_bottom_margin">
				<input type="email" id="email" name="email" size="40" value="" placeholder="you@domain.com">
			</p>

			<p class=" small_bottom_margin">
				<input type="password" id="password" name="password" size="40" placeholder="password">
			</p>
			
			
						

			<p><button id="signin_btn" type="submit" class="btn btn_large full_width ladda-button" data-style="expand-right"><span class="ladda-label">Sign in</span></button></p>

			<p><label class="checkbox"><input type="checkbox" name="remember" checked> Keep me signed in</label></p>

							<p class="small very_small_bottom_margin"><a id="forgot-pw" href="/forgot" class="bold">I forgot my password</a></p>
						
		</form>
	</div>

	<p class="subtle_silver small">
			</p>
</div>
	<div class="real_content align_center">
			<p>If you have an <strong>
<span class="team_email_domains" data-team-email-domains-formatted="@insidenewcity.com">
			@insidenewcity.com
	</span> </strong> email address, you can <a href="/signup/"  class="bold" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=inc_index_secondary_info_create_an_account">create an account</a>.</p>
	
	
			<p>
			Trying to create a team?
				<a data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=inc_download_app_or_sign_in_cta_sign_up_link" href="https://slack.com/" class="bold">Sign up on the home page</a> to get started.
		</p>
	</div>

					
	</div>
	<div id="overlay"></div>
</div>


	
<footer  data-qa="footer">
	<section class="links">
		<div class="grid">
			<div class="col span_1_of_4 nav_col">
				<ul>
					<li class="cat_1">Using Slack</li>
					<li><a href="/is" data-qa="product_footer" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_product">Product</a></li>
					<li><a href="/pricing" data-qa="pricing_footer" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_pricing">Pricing</a></li>
					<li><a href="https://get.slack.help/hc/en-us" data-qa="support_footer" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_support">Support</a></li>
					<li><a href="/guides" data-qa="getting_started" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_getting_started">Slack Guides</a></li>
					<li><a href="/videoguides" data-qa="video_guides" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_video_guides">Video Guides</a></li>
					<li><a href="/apps" data-qa="app_directory" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_app_directory">App Directory</a></li>
					<li><a href="https://api.slack.com/" data-qa="api" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_api">API</a></li>
				</ul>
			</div>
			<div class="col span_1_of_4 nav_col">
				<ul>
					<li class="cat_2">Slack <ts-icon class="ts_icon_heart"></ts-icon></li>
					<li><a href="/jobs" data-qa="jobs" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_jobs">Jobs</a></li>
					<li><a href="/customers" data-qa="customers" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_customers">Customers</a></li>
					<li><a href="/developers" data-qa="developers" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_developers">Developers</a></li>
					<li><a href="/events" data-qa="events" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_events">Events</a></li>
					<li><a href="http://slackhq.com/" data-qa="blog_footer" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_blog">Blog</a></li>
					<li><a href="/podcast" data-qa="podcast" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_podcast">Podcast</a></li>
					<li><a href="https://slack-shop.myshopify.com" data-qa="slack_shop" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_slack_shop">Slack Shop</a></li>
				</ul>
			</div>
			<div class="col span_1_of_4 nav_col">
				<ul>
					<li class="cat_3">Legal</li>
					<li><a href="/privacy-policy" data-qa="privacy" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_privacy">Privacy</a></li>
					<li><a href="/security" data-qa="security" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_security">Security</a></li>
					<li><a href="/terms-of-service" data-qa="tos" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_tos">Terms of Service</a></li>
					<li><a href="/policies" data-qa="policies" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_policies">Policies</a></li>
				</ul>
			</div>
			<div class="col span_1_of_4 nav_col">
				<ul>
					<li class="cat_4">Handy Links</li>
					<li><a href="/downloads" data-qa="downloads" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_downloads">Download desktop app</a></li>
					<li><a href="/downloads" data-qa="downloads_mobile" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_downloads_mobile">Download mobile app</a></li>
					<li><a href="/brand-guidelines" data-qa="brand_guidelines" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_brand_guidelines">Brand Guidelines</a></li>
					<li><a href="http://slackatwork.com" data-qa="slack_at_work" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_slack_at_work">Slack at Work</a></li>
					<li><a href="https://status.slack.com/" data-qa="status" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_status">Status</a></li>
				</ul>
			</div>
		</div>
	</section>

	<div class="footnote">
		<section>
			<a href="https://slack.com" aria-label="Slack homepage" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_slack_icon"><ts-icon class="ts_icon_slack_pillow" aria-hidden="true"></ts-icon></a>
			<ul>
				<li>
					<a href="/help/contact" data-qa="contact_us" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_contact_us">Contact Us</a>
				</li>
				<li>
					<a href="https://twitter.com/SlackHQ" data-qa="slack_twitter" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_slack_twitter" aria-label="Slack on Twitter"><ts-icon class="ts_icon_twitter" aria-hidden="true"></ts-icon></a>
				</li>
				<li class="yt">
					<a href="https://www.youtube.com/channel/UCY3YECgeBcLCzIrFLP4gblw" data-qa="slack_youtube" data-clog-event="WEBSITE_CLICK" data-clog-params="click_target=footer_slack_youtube" aria-label="Slack on YouTube"><ts-icon class="ts_icon_youtube" aria-hidden="true"></ts-icon></a>
				</li>
			</ul>
		</section>
	</div>
</footer>





<script type="text/javascript">

	function vvv(v) {

		var vvv_warning = 'You cannot use vvv on dynamic values. Please make sure you only pass in static file paths.';
		if (TS && TS.warn) {
			TS.warn(vvv_warning);
		} else {
			console.warn(vvv_warning);
		}

		return v;
	}

	var cdn_url = "https:\/\/slack.global.ssl.fastly.net";
	var inc_js_setup_data = {
		emoji_sheets: {
			apple: 'https://a.slack-edge.com/f360/img/emoji_2016_06_08/sheet_apple_64_indexed_256colors.png',
			google: 'https://a.slack-edge.com/f360/img/emoji_2016_06_08/sheet_google_64_indexed_128colors.png',
			twitter: 'https://a.slack-edge.com/f360/img/emoji_2016_06_08/sheet_twitter_64_indexed_128colors.png',
			emojione: 'https://a.slack-edge.com/f360/img/emoji_2016_06_08/sheet_emojione_64_indexed_128colors.png',
		},
	};
</script>

								<!-- output_js "core" -->
<script type="text/javascript" src="https://a.slack-edge.com/4a39f/js/libs/jquery.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://a.slack-edge.com/cd0b/js/TS.min.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://a.slack-edge.com/7c78/js/TS.clog.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://a.slack-edge.com/3f58/js/libs/signals.js" crossorigin="anonymous"></script>

		<!-- output_js "core_web" -->
<script type="text/javascript" src="https://a.slack-edge.com/125e0/js/rollup-core_web.js" crossorigin="anonymous"></script>

		<!-- output_js "secondary" -->

					
	<!-- output_js "regular" -->
<script type="text/javascript" src="https://a.slack-edge.com/381817/js/sticky_nav.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://a.slack-edge.com/78f3/js/libs/warn_capslock.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://a.slack-edge.com/99d9/js/libs/spin.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://a.slack-edge.com/9aa4/js/libs/ladda.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://a.slack-edge.com/c546/js/footer.js" crossorigin="anonymous"></script>

		<script type="text/javascript">
					
				$('input[name="email"]').val() ? $('input[name="password"]').focus() : $('input[name="email"]').focus();
			
						
			if (navigator.userAgent.match(/windows phone/i)) {
				$('input[name="password"]').css('font-family', 'sans-serif,arial,verdana,tahoma');
			}
		

		

		var $signin_btn = $('#signin_btn');
		$signin_btn.data('ladda', Ladda.create(document.querySelector('#signin_btn')));

		var no_sso = false;
		var team_id = 'T024HKJ66';
		var email_regex = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", 'i');

		// signin form
		$('#signin_form').on('submit', function(e) {

			var email = $.trim($('#email').val());
			var password = $.trim($('#password').val());

			// no email or invalid email
			if (!email || !email_regex.test(email)) {
				$('#email').focus().closest('p').addClass('error');
				e.preventDefault();
				return;
			}

			// no password
			if (!password) {
				$('#password').focus().closest('p').addClass('error');
				e.preventDefault();
				return;
			}

			// Prevent the form from submitting twice, which causes the following SSB signin bug:
			// https://slack-bugs.tinyspeck.com/14961
			$signin_btn.attr('disabled', true);
			$signin_btn.attr('aria-disabled', true);
			$signin_btn.data('ladda').start();
		});

		// magic login signin form
		$('#signin_form_magic').on('submit', function(e) {

			e.preventDefault();
			var email = $.trim($('#email').val());

			// no email or invalid email
			if (!email || !email_regex.test(email)) {
				$('#email').focus().closest('p').addClass('error');
			} else {
				$('[name=email]').val(email);
				$('#magic_login_options .js_insert_email').text(email);
				$('#signin_form_magic, #signin_header').addClass('hidden');
				$('#magic_login_options').removeClass('hidden');
				$('#magic_login_use_password').focus();
                        }

                });

		// user given magic login, but wants to enter email/password
		$('#magic_login_use_password').on('click', function(e){

			e.preventDefault();
			$('.error').removeClass('error');
			$('#magic_login_options').addClass('hidden');
			$('#signin_form, #signin_header').removeClass('hidden');
			$('#password').focus();

		});

		$('.code_problem').on('click', function (e) {
			e.preventDefault();
			$('.send_code_block').slideToggle();
		});

		$('.view_more_email_domains_button').on('click', function() {
			var $team_email_domains = $('.team_email_domains');
			$team_email_domains.text($team_email_domains.data('team-email-domains-formatted'));
		});

		$(document).ready(function() {
			$forgot_pw = $('#forgot-pw');
			if ($forgot_pw.length) {
				/**
				 * Grab the current email that the user has entered before going to the
				 * 'forgot password' page so that we can prefill the email field.
				 */
				function grabEmail(e) {
					var $el = $(e.target);
					var new_url = $el.attr('href');
					var email = $('#email').val();

					/**
					 * Simple check to make sure that the user actually typed in what looks like an email.
					 * If what the user entered doesn't look like an email, don't prefill.
					 */
					if (email.length > 0 && email.indexOf('@') != -1) {
						new_url += '?email=' + encodeURIComponent(email);
					}

					$el.attr('href', new_url);
				}
				$forgot_pw.on('click', grabEmail);
			}
		});

		
	</script>

	
		<script type="text/javascript">
				TS.clog.setTeam('T024HKJ66');
					</script>

<style>.color_9f69e7:not(.nuc) {color:#9F69E7;}.color_4bbe2e:not(.nuc) {color:#4BBE2E;}.color_e7392d:not(.nuc) {color:#E7392D;}.color_3c989f:not(.nuc) {color:#3C989F;}.color_674b1b:not(.nuc) {color:#674B1B;}.color_e96699:not(.nuc) {color:#E96699;}.color_e0a729:not(.nuc) {color:#E0A729;}.color_684b6c:not(.nuc) {color:#684B6C;}.color_5b89d5:not(.nuc) {color:#5B89D5;}.color_2b6836:not(.nuc) {color:#2B6836;}.color_99a949:not(.nuc) {color:#99A949;}.color_df3dc0:not(.nuc) {color:#DF3DC0;}.color_4cc091:not(.nuc) {color:#4CC091;}.color_9b3b45:not(.nuc) {color:#9B3B45;}.color_d58247:not(.nuc) {color:#D58247;}.color_bb86b7:not(.nuc) {color:#BB86B7;}.color_5a4592:not(.nuc) {color:#5A4592;}.color_db3150:not(.nuc) {color:#DB3150;}.color_235e5b:not(.nuc) {color:#235E5B;}.color_9e3997:not(.nuc) {color:#9E3997;}.color_53b759:not(.nuc) {color:#53B759;}.color_c386df:not(.nuc) {color:#C386DF;}.color_385a86:not(.nuc) {color:#385A86;}.color_a63024:not(.nuc) {color:#A63024;}.color_5870dd:not(.nuc) {color:#5870DD;}.color_ea2977:not(.nuc) {color:#EA2977;}.color_50a0cf:not(.nuc) {color:#50A0CF;}.color_d55aef:not(.nuc) {color:#D55AEF;}.color_d1707d:not(.nuc) {color:#D1707D;}.color_43761b:not(.nuc) {color:#43761B;}.color_e06b56:not(.nuc) {color:#E06B56;}.color_8f4a2b:not(.nuc) {color:#8F4A2B;}.color_902d59:not(.nuc) {color:#902D59;}.color_de5f24:not(.nuc) {color:#DE5F24;}.color_a2a5dc:not(.nuc) {color:#A2A5DC;}.color_827327:not(.nuc) {color:#827327;}.color_3c8c69:not(.nuc) {color:#3C8C69;}.color_8d4b84:not(.nuc) {color:#8D4B84;}.color_84b22f:not(.nuc) {color:#84B22F;}.color_4ec0d6:not(.nuc) {color:#4EC0D6;}.color_e23f99:not(.nuc) {color:#E23F99;}.color_e475df:not(.nuc) {color:#E475DF;}.color_619a4f:not(.nuc) {color:#619A4F;}.color_a72f79:not(.nuc) {color:#A72F79;}.color_7d414c:not(.nuc) {color:#7D414C;}.color_aba727:not(.nuc) {color:#ABA727;}.color_965d1b:not(.nuc) {color:#965D1B;}.color_4d5e26:not(.nuc) {color:#4D5E26;}.color_dd8527:not(.nuc) {color:#DD8527;}.color_bd9336:not(.nuc) {color:#BD9336;}.color_e85d72:not(.nuc) {color:#E85D72;}.color_dc7dbb:not(.nuc) {color:#DC7DBB;}.color_bc3663:not(.nuc) {color:#BC3663;}.color_9d8eee:not(.nuc) {color:#9D8EEE;}.color_8469bc:not(.nuc) {color:#8469BC;}.color_73769d:not(.nuc) {color:#73769D;}.color_b14cbc:not(.nuc) {color:#B14CBC;}</style>

<!-- slack-www-hhvm215 / 2016-11-01 07:35:10 / v7f313c73d93c71358080ed0e6d443259e77a4d1a / B:H -->

</body>
</html>