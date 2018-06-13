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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
   * updateStatus
   * Update the element status
   * @return 	{SOneTimeDisplayComponent}
   */

	}, {
		key: 'updateStatus',
		value: function updateStatus() {
			// check if is dismissed
			if (this.isDismissed()) {
				this.setProps({
					enabled: false,
					disabled: true
				});
			} else {
				this.setProps({
					enabled: true,
					disabled: false
				});
			}
		}

		/**
   * _onDismiss
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
   * reset
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
			}
			// maintain chainability
			return this;
		}

		/**
   * isDismissed
   * Return if the component has been dismissed or not
   * @return 	{Boolean} 		The dismiss status
   */

	}, {
		key: 'isDismissed',
		value: function isDismissed() {
			var dismissedTimestamp = this.getDismissedTimestamp();
			if (!dismissedTimestamp) return false;
			// check the difference between now and the dismissed
			// timestamp, depending on the timeout in settings
			var now = new Date().getTime() / 1000;
			if (dismissedTimestamp + this.props.timeout < now) {
				// reset the storage
				this.reset();
				// the item is not dismissed
				return false;
			}
			// the element is dismissed
			return true;
		}

		/**
   * getDismissedTimestamp
   * Return the timestamp when the element has been dismissed
   * @return 	{Integer} 	The timestampe when the element has been dismissed
   */

	}, {
		key: 'getDismissedTimestamp',
		value: function getDismissedTimestamp() {
			var dismissedTimestamp = void 0;
			// switch on method
			switch (this.props.method.toLowerCase()) {
				case 'cookie':
					dismissedTimestamp = _jsCookie2.default.get(this.props.name);
					break;
				case 'localstorage':
					dismissedTimestamp = localStorage.getItem(this.props.name);
					break;
				case 'sessionstorage':
					dismissedTimestamp = sessionStorage.getItem(this.props.name);break;
				default:
					throw 'You need to set a method through settings in order to use this component... {cookie|localStorage|sessionStorage}';
					break;
			}
			// the element has been dismissed
			return parseFloat(dismissedTimestamp);
		}

		/**
   * dismiss
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
					_jsCookie2.default.set(this.props.name, new Date().getTime() / 1000, {
						expires: new Date(new Date().getTime() + this.props.timeout * 1000)
					});
					break;
				case 'localstorage':
					localStorage.setItem(this.props.name, new Date().getTime() / 1000);
					break;
				case 'sessionstorage':
					sessionstorage.setItem(this.props.name, new Date().getTime() / 1000);
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
     * @type  	{Number}
     */
				timeout: 3600 * 24 * 365,

				/**
     * Set the method to use to store the component display status
     * @values 	{cookie,localStorage,sessionStorage}
     * @type 	{String}
     */
				method: 'cookie',

				/**
     * Set the name used to save the cookie / localStorage or sessionStorage
     * @type 	{String}
     */
				name: 's-one-time-display',

				/**
     * On dismiss callback. Can be an actual function or a string that will be evaluated by javascript
     * @type 	{Function}
     */
				onDismiss: null,

				/**
     * Set if the element is disabled or not.
     * This will be removed if the element is enabled
     * @physicalProp
     * @type 		{Boolean}
     */
				disabled: true,

				/**
     * Set if the element is enabled
     * This will be removed id the element is disabled
     * @physicalProp
     * @type 		{Boolean}
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