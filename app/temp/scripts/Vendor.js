/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	var lazy = __webpack_require__(8);
	var modernizr = __webpack_require__(9);

/***/ },

/***/ 8:
/***/ function(module, exports) {

	(function(window, factory) {
		var lazySizes = factory(window, window.document);
		window.lazySizes = lazySizes;
		if(typeof module == 'object' && module.exports){
			module.exports = lazySizes;
		}
	}(window, function l(window, document) {
		'use strict';
		/*jshint eqnull:true */
		if(!document.getElementsByClassName){return;}

		var lazySizesConfig;

		var docElem = document.documentElement;

		var Date = window.Date;

		var supportPicture = window.HTMLPictureElement;

		var _addEventListener = 'addEventListener';

		var _getAttribute = 'getAttribute';

		var addEventListener = window[_addEventListener];

		var setTimeout = window.setTimeout;

		var requestAnimationFrame = window.requestAnimationFrame || setTimeout;

		var requestIdleCallback = window.requestIdleCallback;

		var regPicture = /^picture$/i;

		var loadEvents = ['load', 'error', 'lazyincluded', '_lazyloaded'];

		var regClassCache = {};

		var forEach = Array.prototype.forEach;

		var hasClass = function(ele, cls) {
			if(!regClassCache[cls]){
				regClassCache[cls] = new RegExp('(\\s|^)'+cls+'(\\s|$)');
			}
			return regClassCache[cls].test(ele[_getAttribute]('class') || '') && regClassCache[cls];
		};

		var addClass = function(ele, cls) {
			if (!hasClass(ele, cls)){
				ele.setAttribute('class', (ele[_getAttribute]('class') || '').trim() + ' ' + cls);
			}
		};

		var removeClass = function(ele, cls) {
			var reg;
			if ((reg = hasClass(ele,cls))) {
				ele.setAttribute('class', (ele[_getAttribute]('class') || '').replace(reg, ' '));
			}
		};

		var addRemoveLoadEvents = function(dom, fn, add){
			var action = add ? _addEventListener : 'removeEventListener';
			if(add){
				addRemoveLoadEvents(dom, fn);
			}
			loadEvents.forEach(function(evt){
				dom[action](evt, fn);
			});
		};

		var triggerEvent = function(elem, name, detail, noBubbles, noCancelable){
			var event = document.createEvent('CustomEvent');

			event.initCustomEvent(name, !noBubbles, !noCancelable, detail || {});

			elem.dispatchEvent(event);
			return event;
		};

		var updatePolyfill = function (el, full){
			var polyfill;
			if( !supportPicture && ( polyfill = (window.picturefill || lazySizesConfig.pf) ) ){
				polyfill({reevaluate: true, elements: [el]});
			} else if(full && full.src){
				el.src = full.src;
			}
		};

		var getCSS = function (elem, style){
			return (getComputedStyle(elem, null) || {})[style];
		};

		var getWidth = function(elem, parent, width){
			width = width || elem.offsetWidth;

			while(width < lazySizesConfig.minSize && parent && !elem._lazysizesWidth){
				width =  parent.offsetWidth;
				parent = parent.parentNode;
			}

			return width;
		};

		var rAF = (function(){
			var running, waiting;
			var fns = [];
			var secondFns = [];

			var run = function(){
				var runFns = fns;

				fns = secondFns;

				running = true;
				waiting = false;

				while(runFns.length){
					runFns.shift()();
				}

				running = false;
			};

			var rafBatch = function(fn, queue){
				if(running && !queue){
					fn.apply(this, arguments);
				} else {
					fns.push(fn);

					if(!waiting){
						waiting = true;
						(document.hidden ? setTimeout : requestAnimationFrame)(run);
					}
				}
			};

			rafBatch._lsFlush = run;

			return rafBatch;
		})();

		var rAFIt = function(fn, simple){
			return simple ?
				function() {
					rAF(fn);
				} :
				function(){
					var that = this;
					var args = arguments;
					rAF(function(){
						fn.apply(that, args);
					});
				}
			;
		};

		var throttle = function(fn){
			var running;
			var lastTime = 0;
			var gDelay = 125;
			var RIC_DEFAULT_TIMEOUT = 666;
			var rICTimeout = RIC_DEFAULT_TIMEOUT;
			var run = function(){
				running = false;
				lastTime = Date.now();
				fn();
			};
			var idleCallback = requestIdleCallback ?
				function(){
					requestIdleCallback(run, {timeout: rICTimeout});
					if(rICTimeout !== RIC_DEFAULT_TIMEOUT){
						rICTimeout = RIC_DEFAULT_TIMEOUT;
					}
				}:
				rAFIt(function(){
					setTimeout(run);
				}, true)
			;

			return function(isPriority){
				var delay;
				if((isPriority = isPriority === true)){
					rICTimeout = 44;
				}

				if(running){
					return;
				}

				running =  true;

				delay = gDelay - (Date.now() - lastTime);

				if(delay < 0){
					delay = 0;
				}

				if(isPriority || (delay < 9 && requestIdleCallback)){
					idleCallback();
				} else {
					setTimeout(idleCallback, delay);
				}
			};
		};

		//based on http://modernjavascript.blogspot.de/2013/08/building-better-debounce.html
		var debounce = function(func) {
			var timeout, timestamp;
			var wait = 99;
			var run = function(){
				timeout = null;
				func();
			};
			var later = function() {
				var last = Date.now() - timestamp;

				if (last < wait) {
					setTimeout(later, wait - last);
				} else {
					(requestIdleCallback || run)(run);
				}
			};

			return function() {
				timestamp = Date.now();

				if (!timeout) {
					timeout = setTimeout(later, wait);
				}
			};
		};


		var loader = (function(){
			var lazyloadElems, preloadElems, isCompleted, resetPreloadingTimer, loadMode, started;

			var eLvW, elvH, eLtop, eLleft, eLright, eLbottom;

			var defaultExpand, preloadExpand, hFac;

			var regImg = /^img$/i;
			var regIframe = /^iframe$/i;

			var supportScroll = ('onscroll' in window) && !(/glebot/.test(navigator.userAgent));

			var shrinkExpand = 0;
			var currentExpand = 0;

			var isLoading = 0;
			var lowRuns = -1;

			var resetPreloading = function(e){
				isLoading--;
				if(e && e.target){
					addRemoveLoadEvents(e.target, resetPreloading);
				}

				if(!e || isLoading < 0 || !e.target){
					isLoading = 0;
				}
			};

			var isNestedVisible = function(elem, elemExpand){
				var outerRect;
				var parent = elem;
				var visible = getCSS(document.body, 'visibility') == 'hidden' || getCSS(elem, 'visibility') != 'hidden';

				eLtop -= elemExpand;
				eLbottom += elemExpand;
				eLleft -= elemExpand;
				eLright += elemExpand;

				while(visible && (parent = parent.offsetParent) && parent != document.body && parent != docElem){
					visible = ((getCSS(parent, 'opacity') || 1) > 0);

					if(visible && getCSS(parent, 'overflow') != 'visible'){
						outerRect = parent.getBoundingClientRect();
						visible = eLright > outerRect.left &&
							eLleft < outerRect.right &&
							eLbottom > outerRect.top - 1 &&
							eLtop < outerRect.bottom + 1
						;
					}
				}

				return visible;
			};

			var checkElements = function() {
				var eLlen, i, rect, autoLoadElem, loadedSomething, elemExpand, elemNegativeExpand, elemExpandVal, beforeExpandVal;

				if((loadMode = lazySizesConfig.loadMode) && isLoading < 8 && (eLlen = lazyloadElems.length)){

					i = 0;

					lowRuns++;

					if(preloadExpand == null){
						if(!('expand' in lazySizesConfig)){
							lazySizesConfig.expand = docElem.clientHeight > 500 && docElem.clientWidth > 500 ? 500 : 370;
						}

						defaultExpand = lazySizesConfig.expand;
						preloadExpand = defaultExpand * lazySizesConfig.expFactor;
					}

					if(currentExpand < preloadExpand && isLoading < 1 && lowRuns > 2 && loadMode > 2 && !document.hidden){
						currentExpand = preloadExpand;
						lowRuns = 0;
					} else if(loadMode > 1 && lowRuns > 1 && isLoading < 6){
						currentExpand = defaultExpand;
					} else {
						currentExpand = shrinkExpand;
					}

					for(; i < eLlen; i++){

						if(!lazyloadElems[i] || lazyloadElems[i]._lazyRace){continue;}

						if(!supportScroll){unveilElement(lazyloadElems[i]);continue;}

						if(!(elemExpandVal = lazyloadElems[i][_getAttribute]('data-expand')) || !(elemExpand = elemExpandVal * 1)){
							elemExpand = currentExpand;
						}

						if(beforeExpandVal !== elemExpand){
							eLvW = innerWidth + (elemExpand * hFac);
							elvH = innerHeight + elemExpand;
							elemNegativeExpand = elemExpand * -1;
							beforeExpandVal = elemExpand;
						}

						rect = lazyloadElems[i].getBoundingClientRect();

						if ((eLbottom = rect.bottom) >= elemNegativeExpand &&
							(eLtop = rect.top) <= elvH &&
							(eLright = rect.right) >= elemNegativeExpand * hFac &&
							(eLleft = rect.left) <= eLvW &&
							(eLbottom || eLright || eLleft || eLtop) &&
							((isCompleted && isLoading < 3 && !elemExpandVal && (loadMode < 3 || lowRuns < 4)) || isNestedVisible(lazyloadElems[i], elemExpand))){
							unveilElement(lazyloadElems[i]);
							loadedSomething = true;
							if(isLoading > 9){break;}
						} else if(!loadedSomething && isCompleted && !autoLoadElem &&
							isLoading < 4 && lowRuns < 4 && loadMode > 2 &&
							(preloadElems[0] || lazySizesConfig.preloadAfterLoad) &&
							(preloadElems[0] || (!elemExpandVal && ((eLbottom || eLright || eLleft || eLtop) || lazyloadElems[i][_getAttribute](lazySizesConfig.sizesAttr) != 'auto')))){
							autoLoadElem = preloadElems[0] || lazyloadElems[i];
						}
					}

					if(autoLoadElem && !loadedSomething){
						unveilElement(autoLoadElem);
					}
				}
			};

			var throttledCheckElements = throttle(checkElements);

			var switchLoadingClass = function(e){
				addClass(e.target, lazySizesConfig.loadedClass);
				removeClass(e.target, lazySizesConfig.loadingClass);
				addRemoveLoadEvents(e.target, rafSwitchLoadingClass);
			};
			var rafedSwitchLoadingClass = rAFIt(switchLoadingClass);
			var rafSwitchLoadingClass = function(e){
				rafedSwitchLoadingClass({target: e.target});
			};

			var changeIframeSrc = function(elem, src){
				try {
					elem.contentWindow.location.replace(src);
				} catch(e){
					elem.src = src;
				}
			};

			var handleSources = function(source){
				var customMedia, parent;

				var sourceSrcset = source[_getAttribute](lazySizesConfig.srcsetAttr);

				if( (customMedia = lazySizesConfig.customMedia[source[_getAttribute]('data-media') || source[_getAttribute]('media')]) ){
					source.setAttribute('media', customMedia);
				}

				if(sourceSrcset){
					source.setAttribute('srcset', sourceSrcset);
				}

				//https://bugzilla.mozilla.org/show_bug.cgi?id=1170572
				if(customMedia){
					parent = source.parentNode;
					parent.insertBefore(source.cloneNode(), source);
					parent.removeChild(source);
				}
			};

			var lazyUnveil = rAFIt(function (elem, detail, isAuto, sizes, isImg){
				var src, srcset, parent, isPicture, event, firesLoad;

				if(!(event = triggerEvent(elem, 'lazybeforeunveil', detail)).defaultPrevented){

					if(sizes){
						if(isAuto){
							addClass(elem, lazySizesConfig.autosizesClass);
						} else {
							elem.setAttribute('sizes', sizes);
						}
					}

					srcset = elem[_getAttribute](lazySizesConfig.srcsetAttr);
					src = elem[_getAttribute](lazySizesConfig.srcAttr);

					if(isImg) {
						parent = elem.parentNode;
						isPicture = parent && regPicture.test(parent.nodeName || '');
					}

					firesLoad = detail.firesLoad || (('src' in elem) && (srcset || src || isPicture));

					event = {target: elem};

					if(firesLoad){
						addRemoveLoadEvents(elem, resetPreloading, true);
						clearTimeout(resetPreloadingTimer);
						resetPreloadingTimer = setTimeout(resetPreloading, 2500);

						addClass(elem, lazySizesConfig.loadingClass);
						addRemoveLoadEvents(elem, rafSwitchLoadingClass, true);
					}

					if(isPicture){
						forEach.call(parent.getElementsByTagName('source'), handleSources);
					}

					if(srcset){
						elem.setAttribute('srcset', srcset);
					} else if(src && !isPicture){
						if(regIframe.test(elem.nodeName)){
							changeIframeSrc(elem, src);
						} else {
							elem.src = src;
						}
					}

					if(srcset || isPicture){
						updatePolyfill(elem, {src: src});
					}
				}

				if(elem._lazyRace){
					delete elem._lazyRace;
				}
				removeClass(elem, lazySizesConfig.lazyClass);

				rAF(function(){
					if( !firesLoad || elem.complete ){
						if(firesLoad){
							resetPreloading(event);
						} else {
							isLoading--;
						}
						switchLoadingClass(event);
					}
				}, true);
			});

			var unveilElement = function (elem){
				var detail;

				var isImg = regImg.test(elem.nodeName);

				//allow using sizes="auto", but don't use. it's invalid. Use data-sizes="auto" or a valid value for sizes instead (i.e.: sizes="80vw")
				var sizes = isImg && (elem[_getAttribute](lazySizesConfig.sizesAttr) || elem[_getAttribute]('sizes'));
				var isAuto = sizes == 'auto';

				if( (isAuto || !isCompleted) && isImg && (elem.src || elem.srcset) && !elem.complete && !hasClass(elem, lazySizesConfig.errorClass)){return;}

				detail = triggerEvent(elem, 'lazyunveilread').detail;

				if(isAuto){
					 autoSizer.updateElem(elem, true, elem.offsetWidth);
				}

				elem._lazyRace = true;
				isLoading++;

				lazyUnveil(elem, detail, isAuto, sizes, isImg);
			};

			var onload = function(){
				if(isCompleted){return;}
				if(Date.now() - started < 999){
					setTimeout(onload, 999);
					return;
				}
				var afterScroll = debounce(function(){
					lazySizesConfig.loadMode = 3;
					throttledCheckElements();
				});

				isCompleted = true;

				lazySizesConfig.loadMode = 3;

				throttledCheckElements();

				addEventListener('scroll', function(){
					if(lazySizesConfig.loadMode == 3){
						lazySizesConfig.loadMode = 2;
					}
					afterScroll();
				}, true);
			};

			return {
				_: function(){
					started = Date.now();

					lazyloadElems = document.getElementsByClassName(lazySizesConfig.lazyClass);
					preloadElems = document.getElementsByClassName(lazySizesConfig.lazyClass + ' ' + lazySizesConfig.preloadClass);
					hFac = lazySizesConfig.hFac;

					addEventListener('scroll', throttledCheckElements, true);

					addEventListener('resize', throttledCheckElements, true);

					if(window.MutationObserver){
						new MutationObserver( throttledCheckElements ).observe( docElem, {childList: true, subtree: true, attributes: true} );
					} else {
						docElem[_addEventListener]('DOMNodeInserted', throttledCheckElements, true);
						docElem[_addEventListener]('DOMAttrModified', throttledCheckElements, true);
						setInterval(throttledCheckElements, 999);
					}

					addEventListener('hashchange', throttledCheckElements, true);

					//, 'fullscreenchange'
					['focus', 'mouseover', 'click', 'load', 'transitionend', 'animationend', 'webkitAnimationEnd'].forEach(function(name){
						document[_addEventListener](name, throttledCheckElements, true);
					});

					if((/d$|^c/.test(document.readyState))){
						onload();
					} else {
						addEventListener('load', onload);
						document[_addEventListener]('DOMContentLoaded', throttledCheckElements);
						setTimeout(onload, 20000);
					}

					if(lazyloadElems.length){
						checkElements();
						rAF._lsFlush();
					} else {
						throttledCheckElements();
					}
				},
				checkElems: throttledCheckElements,
				unveil: unveilElement
			};
		})();


		var autoSizer = (function(){
			var autosizesElems;

			var sizeElement = rAFIt(function(elem, parent, event, width){
				var sources, i, len;
				elem._lazysizesWidth = width;
				width += 'px';

				elem.setAttribute('sizes', width);

				if(regPicture.test(parent.nodeName || '')){
					sources = parent.getElementsByTagName('source');
					for(i = 0, len = sources.length; i < len; i++){
						sources[i].setAttribute('sizes', width);
					}
				}

				if(!event.detail.dataAttr){
					updatePolyfill(elem, event.detail);
				}
			});
			var getSizeElement = function (elem, dataAttr, width){
				var event;
				var parent = elem.parentNode;

				if(parent){
					width = getWidth(elem, parent, width);
					event = triggerEvent(elem, 'lazybeforesizes', {width: width, dataAttr: !!dataAttr});

					if(!event.defaultPrevented){
						width = event.detail.width;

						if(width && width !== elem._lazysizesWidth){
							sizeElement(elem, parent, event, width);
						}
					}
				}
			};

			var updateElementsSizes = function(){
				var i;
				var len = autosizesElems.length;
				if(len){
					i = 0;

					for(; i < len; i++){
						getSizeElement(autosizesElems[i]);
					}
				}
			};

			var debouncedUpdateElementsSizes = debounce(updateElementsSizes);

			return {
				_: function(){
					autosizesElems = document.getElementsByClassName(lazySizesConfig.autosizesClass);
					addEventListener('resize', debouncedUpdateElementsSizes);
				},
				checkElems: debouncedUpdateElementsSizes,
				updateElem: getSizeElement
			};
		})();

		var init = function(){
			if(!init.i){
				init.i = true;
				autoSizer._();
				loader._();
			}
		};

		(function(){
			var prop;

			var lazySizesDefaults = {
				lazyClass: 'lazyload',
				loadedClass: 'lazyloaded',
				loadingClass: 'lazyloading',
				preloadClass: 'lazypreload',
				errorClass: 'lazyerror',
				//strictClass: 'lazystrict',
				autosizesClass: 'lazyautosizes',
				srcAttr: 'data-src',
				srcsetAttr: 'data-srcset',
				sizesAttr: 'data-sizes',
				//preloadAfterLoad: false,
				minSize: 40,
				customMedia: {},
				init: true,
				expFactor: 1.5,
				hFac: 0.8,
				loadMode: 2
			};

			lazySizesConfig = window.lazySizesConfig || window.lazysizesConfig || {};

			for(prop in lazySizesDefaults){
				if(!(prop in lazySizesConfig)){
					lazySizesConfig[prop] = lazySizesDefaults[prop];
				}
			}

			window.lazySizesConfig = lazySizesConfig;

			setTimeout(function(){
				if(lazySizesConfig.init){
					init();
				}
			});
		})();

		return {
			cfg: lazySizesConfig,
			autoSizer: autoSizer,
			loader: loader,
			init: init,
			uP: updatePolyfill,
			aC: addClass,
			rC: removeClass,
			hC: hasClass,
			fire: triggerEvent,
			gW: getWidth,
			rAF: rAF,
		};
	}
	));


/***/ },

/***/ 9:
/***/ function(module, exports) {

	/*!
	 * modernizr v3.3.1
	 * Build http://modernizr.com/download?-flexbox-svg-setclasses-dontmin
	 *
	 * Copyright (c)
	 *  Faruk Ates
	 *  Paul Irish
	 *  Alex Sexton
	 *  Ryan Seddon
	 *  Patrick Kettner
	 *  Stu Cox
	 *  Richard Herrera

	 * MIT License
	 */

	/*
	 * Modernizr tests which native CSS3 and HTML5 features are available in the
	 * current UA and makes the results available to you in two ways: as properties on
	 * a global `Modernizr` object, and as classes on the `<html>` element. This
	 * information allows you to progressively enhance your pages with a granular level
	 * of control over the experience.
	*/

	;(function(window, document, undefined){
	  var tests = [];
	  

	  /**
	   *
	   * ModernizrProto is the constructor for Modernizr
	   *
	   * @class
	   * @access public
	   */

	  var ModernizrProto = {
	    // The current version, dummy
	    _version: '3.3.1',

	    // Any settings that don't work as separate modules
	    // can go in here as configuration.
	    _config: {
	      'classPrefix': '',
	      'enableClasses': true,
	      'enableJSClass': true,
	      'usePrefixes': true
	    },

	    // Queue of tests
	    _q: [],

	    // Stub these for people who are listening
	    on: function(test, cb) {
	      // I don't really think people should do this, but we can
	      // safe guard it a bit.
	      // -- NOTE:: this gets WAY overridden in src/addTest for actual async tests.
	      // This is in case people listen to synchronous tests. I would leave it out,
	      // but the code to *disallow* sync tests in the real version of this
	      // function is actually larger than this.
	      var self = this;
	      setTimeout(function() {
	        cb(self[test]);
	      }, 0);
	    },

	    addTest: function(name, fn, options) {
	      tests.push({name: name, fn: fn, options: options});
	    },

	    addAsyncTest: function(fn) {
	      tests.push({name: null, fn: fn});
	    }
	  };

	  

	  // Fake some of Object.create so we can force non test results to be non "own" properties.
	  var Modernizr = function() {};
	  Modernizr.prototype = ModernizrProto;

	  // Leak modernizr globally when you `require` it rather than force it here.
	  // Overwrite name so constructor name is nicer :D
	  Modernizr = new Modernizr();

	  

	  var classes = [];
	  

	  /**
	   * is returns a boolean if the typeof an obj is exactly type.
	   *
	   * @access private
	   * @function is
	   * @param {*} obj - A thing we want to check the type of
	   * @param {string} type - A string to compare the typeof against
	   * @returns {boolean}
	   */

	  function is(obj, type) {
	    return typeof obj === type;
	  }
	  ;

	  /**
	   * Run through all tests and detect their support in the current UA.
	   *
	   * @access private
	   */

	  function testRunner() {
	    var featureNames;
	    var feature;
	    var aliasIdx;
	    var result;
	    var nameIdx;
	    var featureName;
	    var featureNameSplit;

	    for (var featureIdx in tests) {
	      if (tests.hasOwnProperty(featureIdx)) {
	        featureNames = [];
	        feature = tests[featureIdx];
	        // run the test, throw the return value into the Modernizr,
	        // then based on that boolean, define an appropriate className
	        // and push it into an array of classes we'll join later.
	        //
	        // If there is no name, it's an 'async' test that is run,
	        // but not directly added to the object. That should
	        // be done with a post-run addTest call.
	        if (feature.name) {
	          featureNames.push(feature.name.toLowerCase());

	          if (feature.options && feature.options.aliases && feature.options.aliases.length) {
	            // Add all the aliases into the names list
	            for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
	              featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
	            }
	          }
	        }

	        // Run the test, or use the raw value if it's not a function
	        result = is(feature.fn, 'function') ? feature.fn() : feature.fn;


	        // Set each of the names on the Modernizr object
	        for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
	          featureName = featureNames[nameIdx];
	          // Support dot properties as sub tests. We don't do checking to make sure
	          // that the implied parent tests have been added. You must call them in
	          // order (either in the test, or make the parent test a dependency).
	          //
	          // Cap it to TWO to make the logic simple and because who needs that kind of subtesting
	          // hashtag famous last words
	          featureNameSplit = featureName.split('.');

	          if (featureNameSplit.length === 1) {
	            Modernizr[featureNameSplit[0]] = result;
	          } else {
	            // cast to a Boolean, if not one already
	            /* jshint -W053 */
	            if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
	              Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
	            }

	            Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
	          }

	          classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
	        }
	      }
	    }
	  }
	  ;

	  /**
	   * docElement is a convenience wrapper to grab the root element of the document
	   *
	   * @access private
	   * @returns {HTMLElement|SVGElement} The root element of the document
	   */

	  var docElement = document.documentElement;
	  

	  /**
	   * A convenience helper to check if the document we are running in is an SVG document
	   *
	   * @access private
	   * @returns {boolean}
	   */

	  var isSVG = docElement.nodeName.toLowerCase() === 'svg';
	  

	  /**
	   * setClasses takes an array of class names and adds them to the root element
	   *
	   * @access private
	   * @function setClasses
	   * @param {string[]} classes - Array of class names
	   */

	  // Pass in an and array of class names, e.g.:
	  //  ['no-webp', 'borderradius', ...]
	  function setClasses(classes) {
	    var className = docElement.className;
	    var classPrefix = Modernizr._config.classPrefix || '';

	    if (isSVG) {
	      className = className.baseVal;
	    }

	    // Change `no-js` to `js` (independently of the `enableClasses` option)
	    // Handle classPrefix on this too
	    if (Modernizr._config.enableJSClass) {
	      var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
	      className = className.replace(reJS, '$1' + classPrefix + 'js$2');
	    }

	    if (Modernizr._config.enableClasses) {
	      // Add the new classes
	      className += ' ' + classPrefix + classes.join(' ' + classPrefix);
	      isSVG ? docElement.className.baseVal = className : docElement.className = className;
	    }

	  }

	  ;

	  /**
	   * If the browsers follow the spec, then they would expose vendor-specific style as:
	   *   elem.style.WebkitBorderRadius
	   * instead of something like the following, which would be technically incorrect:
	   *   elem.style.webkitBorderRadius

	   * Webkit ghosts their properties in lowercase but Opera & Moz do not.
	   * Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
	   *   erik.eae.net/archives/2008/03/10/21.48.10/

	   * More here: github.com/Modernizr/Modernizr/issues/issue/21
	   *
	   * @access private
	   * @returns {string} The string representing the vendor-specific style properties
	   */

	  var omPrefixes = 'Moz O ms Webkit';
	  

	  var cssomPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.split(' ') : []);
	  ModernizrProto._cssomPrefixes = cssomPrefixes;
	  


	  /**
	   * contains checks to see if a string contains another string
	   *
	   * @access private
	   * @function contains
	   * @param {string} str - The string we want to check for substrings
	   * @param {string} substr - The substring we want to search the first string for
	   * @returns {boolean}
	   */

	  function contains(str, substr) {
	    return !!~('' + str).indexOf(substr);
	  }

	  ;

	  /**
	   * createElement is a convenience wrapper around document.createElement. Since we
	   * use createElement all over the place, this allows for (slightly) smaller code
	   * as well as abstracting away issues with creating elements in contexts other than
	   * HTML documents (e.g. SVG documents).
	   *
	   * @access private
	   * @function createElement
	   * @returns {HTMLElement|SVGElement} An HTML or SVG element
	   */

	  function createElement() {
	    if (typeof document.createElement !== 'function') {
	      // This is the case in IE7, where the type of createElement is "object".
	      // For this reason, we cannot call apply() as Object is not a Function.
	      return document.createElement(arguments[0]);
	    } else if (isSVG) {
	      return document.createElementNS.call(document, 'http://www.w3.org/2000/svg', arguments[0]);
	    } else {
	      return document.createElement.apply(document, arguments);
	    }
	  }

	  ;

	  /**
	   * Create our "modernizr" element that we do most feature tests on.
	   *
	   * @access private
	   */

	  var modElem = {
	    elem: createElement('modernizr')
	  };

	  // Clean up this element
	  Modernizr._q.push(function() {
	    delete modElem.elem;
	  });

	  

	  var mStyle = {
	    style: modElem.elem.style
	  };

	  // kill ref for gc, must happen before mod.elem is removed, so we unshift on to
	  // the front of the queue.
	  Modernizr._q.unshift(function() {
	    delete mStyle.style;
	  });

	  

	  /**
	   * getBody returns the body of a document, or an element that can stand in for
	   * the body if a real body does not exist
	   *
	   * @access private
	   * @function getBody
	   * @returns {HTMLElement|SVGElement} Returns the real body of a document, or an
	   * artificially created element that stands in for the body
	   */

	  function getBody() {
	    // After page load injecting a fake body doesn't work so check if body exists
	    var body = document.body;

	    if (!body) {
	      // Can't use the real body create a fake one.
	      body = createElement(isSVG ? 'svg' : 'body');
	      body.fake = true;
	    }

	    return body;
	  }

	  ;

	  /**
	   * injectElementWithStyles injects an element with style element and some CSS rules
	   *
	   * @access private
	   * @function injectElementWithStyles
	   * @param {string} rule - String representing a css rule
	   * @param {function} callback - A function that is used to test the injected element
	   * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
	   * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
	   * @returns {boolean}
	   */

	  function injectElementWithStyles(rule, callback, nodes, testnames) {
	    var mod = 'modernizr';
	    var style;
	    var ret;
	    var node;
	    var docOverflow;
	    var div = createElement('div');
	    var body = getBody();

	    if (parseInt(nodes, 10)) {
	      // In order not to give false positives we create a node for each test
	      // This also allows the method to scale for unspecified uses
	      while (nodes--) {
	        node = createElement('div');
	        node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
	        div.appendChild(node);
	      }
	    }

	    style = createElement('style');
	    style.type = 'text/css';
	    style.id = 's' + mod;

	    // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
	    // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
	    (!body.fake ? div : body).appendChild(style);
	    body.appendChild(div);

	    if (style.styleSheet) {
	      style.styleSheet.cssText = rule;
	    } else {
	      style.appendChild(document.createTextNode(rule));
	    }
	    div.id = mod;

	    if (body.fake) {
	      //avoid crashing IE8, if background image is used
	      body.style.background = '';
	      //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
	      body.style.overflow = 'hidden';
	      docOverflow = docElement.style.overflow;
	      docElement.style.overflow = 'hidden';
	      docElement.appendChild(body);
	    }

	    ret = callback(div, rule);
	    // If this is done after page load we don't want to remove the body so check if body exists
	    if (body.fake) {
	      body.parentNode.removeChild(body);
	      docElement.style.overflow = docOverflow;
	      // Trigger layout so kinetic scrolling isn't disabled in iOS6+
	      docElement.offsetHeight;
	    } else {
	      div.parentNode.removeChild(div);
	    }

	    return !!ret;

	  }

	  ;

	  /**
	   * domToCSS takes a camelCase string and converts it to kebab-case
	   * e.g. boxSizing -> box-sizing
	   *
	   * @access private
	   * @function domToCSS
	   * @param {string} name - String name of camelCase prop we want to convert
	   * @returns {string} The kebab-case version of the supplied name
	   */

	  function domToCSS(name) {
	    return name.replace(/([A-Z])/g, function(str, m1) {
	      return '-' + m1.toLowerCase();
	    }).replace(/^ms-/, '-ms-');
	  }
	  ;

	  /**
	   * nativeTestProps allows for us to use native feature detection functionality if available.
	   * some prefixed form, or false, in the case of an unsupported rule
	   *
	   * @access private
	   * @function nativeTestProps
	   * @param {array} props - An array of property names
	   * @param {string} value - A string representing the value we want to check via @supports
	   * @returns {boolean|undefined} A boolean when @supports exists, undefined otherwise
	   */

	  // Accepts a list of property names and a single value
	  // Returns `undefined` if native detection not available
	  function nativeTestProps(props, value) {
	    var i = props.length;
	    // Start with the JS API: http://www.w3.org/TR/css3-conditional/#the-css-interface
	    if ('CSS' in window && 'supports' in window.CSS) {
	      // Try every prefixed variant of the property
	      while (i--) {
	        if (window.CSS.supports(domToCSS(props[i]), value)) {
	          return true;
	        }
	      }
	      return false;
	    }
	    // Otherwise fall back to at-rule (for Opera 12.x)
	    else if ('CSSSupportsRule' in window) {
	      // Build a condition string for every prefixed variant
	      var conditionText = [];
	      while (i--) {
	        conditionText.push('(' + domToCSS(props[i]) + ':' + value + ')');
	      }
	      conditionText = conditionText.join(' or ');
	      return injectElementWithStyles('@supports (' + conditionText + ') { #modernizr { position: absolute; } }', function(node) {
	        return getComputedStyle(node, null).position == 'absolute';
	      });
	    }
	    return undefined;
	  }
	  ;

	  /**
	   * cssToDOM takes a kebab-case string and converts it to camelCase
	   * e.g. box-sizing -> boxSizing
	   *
	   * @access private
	   * @function cssToDOM
	   * @param {string} name - String name of kebab-case prop we want to convert
	   * @returns {string} The camelCase version of the supplied name
	   */

	  function cssToDOM(name) {
	    return name.replace(/([a-z])-([a-z])/g, function(str, m1, m2) {
	      return m1 + m2.toUpperCase();
	    }).replace(/^-/, '');
	  }
	  ;

	  // testProps is a generic CSS / DOM property test.

	  // In testing support for a given CSS property, it's legit to test:
	  //    `elem.style[styleName] !== undefined`
	  // If the property is supported it will return an empty string,
	  // if unsupported it will return undefined.

	  // We'll take advantage of this quick test and skip setting a style
	  // on our modernizr element, but instead just testing undefined vs
	  // empty string.

	  // Property names can be provided in either camelCase or kebab-case.

	  function testProps(props, prefixed, value, skipValueTest) {
	    skipValueTest = is(skipValueTest, 'undefined') ? false : skipValueTest;

	    // Try native detect first
	    if (!is(value, 'undefined')) {
	      var result = nativeTestProps(props, value);
	      if (!is(result, 'undefined')) {
	        return result;
	      }
	    }

	    // Otherwise do it properly
	    var afterInit, i, propsLength, prop, before;

	    // If we don't have a style element, that means we're running async or after
	    // the core tests, so we'll need to create our own elements to use

	    // inside of an SVG element, in certain browsers, the `style` element is only
	    // defined for valid tags. Therefore, if `modernizr` does not have one, we
	    // fall back to a less used element and hope for the best.
	    var elems = ['modernizr', 'tspan'];
	    while (!mStyle.style) {
	      afterInit = true;
	      mStyle.modElem = createElement(elems.shift());
	      mStyle.style = mStyle.modElem.style;
	    }

	    // Delete the objects if we created them.
	    function cleanElems() {
	      if (afterInit) {
	        delete mStyle.style;
	        delete mStyle.modElem;
	      }
	    }

	    propsLength = props.length;
	    for (i = 0; i < propsLength; i++) {
	      prop = props[i];
	      before = mStyle.style[prop];

	      if (contains(prop, '-')) {
	        prop = cssToDOM(prop);
	      }

	      if (mStyle.style[prop] !== undefined) {

	        // If value to test has been passed in, do a set-and-check test.
	        // 0 (integer) is a valid property value, so check that `value` isn't
	        // undefined, rather than just checking it's truthy.
	        if (!skipValueTest && !is(value, 'undefined')) {

	          // Needs a try catch block because of old IE. This is slow, but will
	          // be avoided in most cases because `skipValueTest` will be used.
	          try {
	            mStyle.style[prop] = value;
	          } catch (e) {}

	          // If the property value has changed, we assume the value used is
	          // supported. If `value` is empty string, it'll fail here (because
	          // it hasn't changed), which matches how browsers have implemented
	          // CSS.supports()
	          if (mStyle.style[prop] != before) {
	            cleanElems();
	            return prefixed == 'pfx' ? prop : true;
	          }
	        }
	        // Otherwise just return true, or the property name if this is a
	        // `prefixed()` call
	        else {
	          cleanElems();
	          return prefixed == 'pfx' ? prop : true;
	        }
	      }
	    }
	    cleanElems();
	    return false;
	  }

	  ;

	  /**
	   * List of JavaScript DOM values used for tests
	   *
	   * @memberof Modernizr
	   * @name Modernizr._domPrefixes
	   * @optionName Modernizr._domPrefixes
	   * @optionProp domPrefixes
	   * @access public
	   * @example
	   *
	   * Modernizr._domPrefixes is exactly the same as [_prefixes](#modernizr-_prefixes), but rather
	   * than kebab-case properties, all properties are their Capitalized variant
	   *
	   * ```js
	   * Modernizr._domPrefixes === [ "Moz", "O", "ms", "Webkit" ];
	   * ```
	   */

	  var domPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.toLowerCase().split(' ') : []);
	  ModernizrProto._domPrefixes = domPrefixes;
	  

	  /**
	   * fnBind is a super small [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) polyfill.
	   *
	   * @access private
	   * @function fnBind
	   * @param {function} fn - a function you want to change `this` reference to
	   * @param {object} that - the `this` you want to call the function with
	   * @returns {function} The wrapped version of the supplied function
	   */

	  function fnBind(fn, that) {
	    return function() {
	      return fn.apply(that, arguments);
	    };
	  }

	  ;

	  /**
	   * testDOMProps is a generic DOM property test; if a browser supports
	   *   a certain property, it won't return undefined for it.
	   *
	   * @access private
	   * @function testDOMProps
	   * @param {array.<string>} props - An array of properties to test for
	   * @param {object} obj - An object or Element you want to use to test the parameters again
	   * @param {boolean|object} elem - An Element to bind the property lookup again. Use `false` to prevent the check
	   */
	  function testDOMProps(props, obj, elem) {
	    var item;

	    for (var i in props) {
	      if (props[i] in obj) {

	        // return the property name as a string
	        if (elem === false) {
	          return props[i];
	        }

	        item = obj[props[i]];

	        // let's bind a function
	        if (is(item, 'function')) {
	          // bind to obj unless overriden
	          return fnBind(item, elem || obj);
	        }

	        // return the unbound function or obj or value
	        return item;
	      }
	    }
	    return false;
	  }

	  ;

	  /**
	   * testPropsAll tests a list of DOM properties we want to check against.
	   * We specify literally ALL possible (known and/or likely) properties on
	   * the element including the non-vendor prefixed one, for forward-
	   * compatibility.
	   *
	   * @access private
	   * @function testPropsAll
	   * @param {string} prop - A string of the property to test for
	   * @param {string|object} [prefixed] - An object to check the prefixed properties on. Use a string to skip
	   * @param {HTMLElement|SVGElement} [elem] - An element used to test the property and value against
	   * @param {string} [value] - A string of a css value
	   * @param {boolean} [skipValueTest] - An boolean representing if you want to test if value sticks when set
	   */
	  function testPropsAll(prop, prefixed, elem, value, skipValueTest) {

	    var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
	    props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

	    // did they call .prefixed('boxSizing') or are we just testing a prop?
	    if (is(prefixed, 'string') || is(prefixed, 'undefined')) {
	      return testProps(props, prefixed, value, skipValueTest);

	      // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
	    } else {
	      props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
	      return testDOMProps(props, prefixed, elem);
	    }
	  }

	  // Modernizr.testAllProps() investigates whether a given style property,
	  // or any of its vendor-prefixed variants, is recognized
	  //
	  // Note that the property names must be provided in the camelCase variant.
	  // Modernizr.testAllProps('boxSizing')
	  ModernizrProto.testAllProps = testPropsAll;

	  

	  /**
	   * testAllProps determines whether a given CSS property is supported in the browser
	   *
	   * @memberof Modernizr
	   * @name Modernizr.testAllProps
	   * @optionName Modernizr.testAllProps()
	   * @optionProp testAllProps
	   * @access public
	   * @function testAllProps
	   * @param {string} prop - String naming the property to test (either camelCase or kebab-case)
	   * @param {string} [value] - String of the value to test
	   * @param {boolean} [skipValueTest=false] - Whether to skip testing that the value is supported when using non-native detection
	   * @example
	   *
	   * testAllProps determines whether a given CSS property, in some prefixed form,
	   * is supported by the browser.
	   *
	   * ```js
	   * testAllProps('boxSizing')  // true
	   * ```
	   *
	   * It can optionally be given a CSS value in string form to test if a property
	   * value is valid
	   *
	   * ```js
	   * testAllProps('display', 'block') // true
	   * testAllProps('display', 'penguin') // false
	   * ```
	   *
	   * A boolean can be passed as a third parameter to skip the value check when
	   * native detection (@supports) isn't available.
	   *
	   * ```js
	   * testAllProps('shapeOutside', 'content-box', true);
	   * ```
	   */

	  function testAllProps(prop, value, skipValueTest) {
	    return testPropsAll(prop, undefined, undefined, value, skipValueTest);
	  }
	  ModernizrProto.testAllProps = testAllProps;
	  
	/*!
	{
	  "name": "Flexbox",
	  "property": "flexbox",
	  "caniuse": "flexbox",
	  "tags": ["css"],
	  "notes": [{
	    "name": "The _new_ flexbox",
	    "href": "http://dev.w3.org/csswg/css3-flexbox"
	  }],
	  "warnings": [
	    "A `true` result for this detect does not imply that the `flex-wrap` property is supported; see the `flexwrap` detect."
	  ]
	}
	!*/
	/* DOC
	Detects support for the Flexible Box Layout model, a.k.a. Flexbox, which allows easy manipulation of layout order and sizing within a container.
	*/

	  Modernizr.addTest('flexbox', testAllProps('flexBasis', '1px', true));

	/*!
	{
	  "name": "SVG",
	  "property": "svg",
	  "caniuse": "svg",
	  "tags": ["svg"],
	  "authors": ["Erik Dahlstrom"],
	  "polyfills": [
	    "svgweb",
	    "raphael",
	    "amplesdk",
	    "canvg",
	    "svg-boilerplate",
	    "sie",
	    "dojogfx",
	    "fabricjs"
	  ]
	}
	!*/
	/* DOC
	Detects support for SVG in `<embed>` or `<object>` elements.
	*/

	  Modernizr.addTest('svg', !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect);


	  // Run each test
	  testRunner();

	  // Remove the "no-js" class if it exists
	  setClasses(classes);

	  delete ModernizrProto.addTest;
	  delete ModernizrProto.addAsyncTest;

	  // Run the things that are supposed to run after the tests
	  for (var i = 0; i < Modernizr._q.length; i++) {
	    Modernizr._q[i]();
	  }

	  // Leak Modernizr namespace
	  window.Modernizr = Modernizr;


	;

	})(window, document);

/***/ }

/******/ });