'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _SWebComponent2 = require('coffeekraken-sugar/js/core/SWebComponent');

var _SWebComponent3 = _interopRequireDefault(_SWebComponent2);

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

var _ironDb = require('iron-db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class 	SOneTimeDisplayComponent
 * @extends 	SWebComponent
 * Webcomponent class that provide the ability to display itself depending on a cookie or a local|sessionStorage flag.
 * The flag itself can be set by using the simple `.dismiss()` method, or by clicking on the element that has the `s-one-time-display-dismiss` attribute inside the component.
 * This webcomponent does not provide any default css so you will have to handle that by yourself depending on these attributes:
 * - `enabled`: Present on the webcomponent when it has to be displayed
 * - `disabled`: Present on the webcomponent when it has to be hided
 * @example 	html
 * <s-one-time-display timeout="86400">
 * 	<p>This is my cool element that will be displayed until someone click on the button bellow</p>
 * <button s-one-time-display-dismiss>
 * 	Dismiss
 * </button>
 * </s-one-time-display>
 * <style>
 * 	s-one-time-display {
 * 		display: none;
 * 	}
 * 	s-one-time-display[enabled] {
 * 		display: block;
 * 	}
 * </style>
 */
var SOneTimeDisplayComponent = function (_SWebComponent) {
	_inherits(SOneTimeDisplayComponent, _SWebComponent);

	function SOneTimeDisplayComponent() {
		_classCallCheck(this, SOneTimeDisplayComponent);

		return _possibleConstructorReturn(this, (SOneTimeDisplayComponent.__proto__ || Object.getPrototypeOf(SOneTimeDisplayComponent)).apply(this, arguments));
	}

	_createClass(SOneTimeDisplayComponent, [{
		key: 'componentMount',


		/**
   * Mount component
   * @definition 		SWebComponent.componentMount
   * @protected
   */
		value: function componentMount() {
			_get(SOneTimeDisplayComponent.prototype.__proto__ || Object.getPrototypeOf(SOneTimeDisplayComponent.prototype), 'componentMount', this).call(this);

			// get the dismiss element
			var dismissElm = this.querySelector('[' + this.componentNameDash + '-dismiss]');
			if (dismissElm) {
				dismissElm.addEventListener('click', this._onDismiss.bind(this));
			}

			// update the status
			this.updateStatus();
		}

		/**
   * Update the element status
   * @return 	{SOneTimeDisplayComponent}
   */

	}, {
		key: 'updateStatus',
		value: function updateStatus() {
			var _this2 = this;

			// check if is dismissed
			this.isDismissed().then(function (value) {
				if (value) {
					_this2.setProps({
						enabled: false,
						disabled: true
					});
				} else {
					_this2.setProps({
						enabled: true,
						disabled: false
					});
				}
			});
		}

		/**
   * When the click on the "dismiss" element
   * @param	{MouseEvent} 	e 	The mouse event
   * @return 	{void}
   */

	}, {
		key: '_onDismiss',
		value: function _onDismiss(e) {
			// dismiss
			this.dismiss();
		}

		/**
   * Reset the storage
   * @return 	{SOneTimeDisplayComponent}
   */

	}, {
		key: 'reset',
		value: function reset() {
			// reset the storage
			switch (this.props.method.toLowerCase()) {
				case 'cookie':
					_jsCookie2.default.remove(this.props.name);
					break;
				case 'localstorage':
					localStorage.removeItem(this.props.name);
					break;
				case 'sessionstorage':
					sessionStorage.removeItem(this.props.name);
					break;
				case 'irondb':
					_ironDb.IronDB.remove(this.props.name);
					break;
			}
			// maintain chainability
			return this;
		}

		/**
   * Return if the component has been dismissed or not
   * @return 	{Boolean} 		The dismiss status
   */

	}, {
		key: 'isDismissed',
		value: function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
				var dismissedTimestamp, now;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.next = 2;
								return this.getDismissedTimestamp();

							case 2:
								dismissedTimestamp = _context.sent;

								if (dismissedTimestamp) {
									_context.next = 5;
									break;
								}

								return _context.abrupt('return', false);

							case 5:
								// check the difference between now and the dismissed
								// timestamp, depending on the timeout in settings
								now = new Date().getTime() / 1000;

								if (!(dismissedTimestamp + this.props.timeout < now)) {
									_context.next = 9;
									break;
								}

								// reset the storage
								this.reset();
								// the item is not dismissed
								return _context.abrupt('return', false);

							case 9:
								return _context.abrupt('return', true);

							case 10:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function isDismissed() {
				return _ref.apply(this, arguments);
			}

			return isDismissed;
		}()

		/**
   * Return the timestamp when the element has been dismissed
   * @return 	{Integer} 	The timestampe when the element has been dismissed
   */

	}, {
		key: 'getDismissedTimestamp',
		value: function () {
			var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.t0 = this.props.method.toLowerCase();
								_context2.next = _context2.t0 === 'cookie' ? 3 : _context2.t0 === 'localstorage' ? 4 : _context2.t0 === 'sessionstorage' ? 5 : _context2.t0 === 'irondb' ? 6 : 11;
								break;

							case 3:
								return _context2.abrupt('return', parseInt(_jsCookie2.default.get(this.props.name)));

							case 4:
								return _context2.abrupt('return', parseInt(localStorage.getItem(this.props.name)));

							case 5:
								return _context2.abrupt('return', parseInt(sessionStorage.getItem(this.props.name)));

							case 6:
								_context2.t1 = parseInt;
								_context2.next = 9;
								return _ironDb.IronDB.get(this.props.name);

							case 9:
								_context2.t2 = _context2.sent;
								return _context2.abrupt('return', (0, _context2.t1)(_context2.t2));

							case 11:
								throw 'You need to set a method through settings in order to use this component... {cookie|localStorage|sessionStorage}';

							case 12:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function getDismissedTimestamp() {
				return _ref2.apply(this, arguments);
			}

			return getDismissedTimestamp;
		}()

		/**
   * Dismiss the displayed element
   * @return  	{SOneTimeDisplayComponent}
   */

	}, {
		key: 'dismiss',
		value: function dismiss() {
			// switch on method
			switch (this.props.method.toLowerCase()) {
				case 'cookie':
					// set the cookie
					_jsCookie2.default.set(this.props.name, parseInt(new Date().getTime() / 1000), {
						expires: new Date(new Date().getTime() + this.props.timeout * 1000)
					});
					break;
				case 'localstorage':
					localStorage.setItem(this.props.name, parseInt(new Date().getTime() / 1000));
					break;
				case 'sessionstorage':
					sessionstorage.setItem(this.props.name, parseInt(new Date().getTime() / 1000));
					break;
				case 'irondb':
					_ironDb.IronDB.set(this.props.name, parseInt(new Date().getTime() / 1000));
					break;
			}
			// dismiss callback
			if (this.props.onDismiss) {
				if (typeof this.props.onDismiss === 'string') {
					eval(this.props.onDismiss);
				} else if (typeof this.props.onDismiss === 'function') {
					this.props.onDismiss();
				}
			}
			// update the status
			this.updateStatus();
			// maintain chainability
			return this;
		}
	}], [{
		key: 'defaultCss',


		/**
   * Default css
   * @definition 		SWebComponent.defaultCss
   * @protected
   */
		value: function defaultCss(componentName, componentNameDash) {
			return '\n\t\t\t' + componentNameDash + ' {\n\t\t\t\tdisplay: block;\n\t\t\t}\n\t\t';
		}

		/**
   * Default props
   * @definition 		SWebComponent.defaultProps
   * @protected
   */

	}, {
		key: 'defaultProps',
		get: function get() {
			return {
				/**
     * How many times in seconds to hide the element when dismissed
     * @prop
     * @type  	{Number}
     */
				timeout: 3600 * 24 * 365,

				/**
     * Set the method to use to store the component display status
     * @prop
     * @values 	cookie,localStorage,sessionStorage,ironDb
     * @type 	{String}
     */
				method: 'ironDb',

				/**
     * Set the name used to save the cookie / localStorage or sessionStorage
     * @prop
     * @type 	{String}
     */
				name: 's-one-time-display',

				/**
     * On dismiss callback. Can be an actual function or a string that will be evaluated by javascript
     * @prop
     * @type 	{Function}
     */
				onDismiss: null,

				/**
     * Set if the element is disabled or not.
     * This will be removed if the element is enabled
     * @physicalProp
     * @type 		{Boolean}
     * @private
     */
				disabled: true,

				/**
     * Set if the element is enabled
     * This will be removed id the element is disabled
     * @physicalProp
     * @type 		{Boolean}
     * @private
     */
				enabled: false
			};
		}

		/**
   * Physical props
   * @definition 		SWebComponent.physicalProps
   * @protected
   */

	}, {
		key: 'physicalProps',
		get: function get() {
			return ['enabled', 'disabled'];
		}
	}]);

	return SOneTimeDisplayComponent;
}(_SWebComponent3.default);

exports.default = SOneTimeDisplayComponent;