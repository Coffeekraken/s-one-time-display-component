import SWebComponent from 'coffeekraken-sugar/js/core/SWebComponent'
import Cookies from 'js-cookie'

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
export default class SOneTimeDisplayComponent extends SWebComponent {

	/**
	 * Default css
	 * @definition 		SWebComponent.defaultCss
	 * @protected
	 */
	static defaultCss(componentName, componentNameDash) {
		return `
			${componentNameDash} {
				display: block;
			}
		`
	}

	/**
	 * Default props
	 * @definition 		SWebComponent.defaultProps
	 * @protected
	 */
	static get defaultProps() {
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
		}
	}

	/**
	 * Physical props
	 * @definition 		SWebComponent.physicalProps
	 * @protected
	 */
	static get physicalProps() {
		return ['enabled','disabled'];
	}

	/**
	 * Mount component
	 * @definition 		SWebComponent.componentMount
	 * @protected
	 */
	componentMount() {
		super.componentMount();

		// get the dismiss element
		const dismissElm = this.querySelector(`[${this.componentNameDash}-dismiss]`);
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
	updateStatus() {
		// check if is dismissed
		if (this.isDismissed()) {
			this.setProps({
				enabled : false,
				disabled : true
			});
		} else {
			this.setProps({
				enabled : true,
				disabled : false
			});
		}
	}

	/**
	 * _onDismiss
	 * When the click on the "dismiss" element
	 * @param	{MouseEvent} 	e 	The mouse event
	 * @return 	{void}
	 */
	_onDismiss(e) {
		// dismiss
		this.dismiss();
	}

	/**
	 * reset
	 * Reset the storage
	 * @return 	{SOneTimeDisplayComponent}
	 */
	reset() {
		// reset the storage
		switch(this.props.method.toLowerCase()) {
			case 'cookie':
				Cookies.remove(this.props.name);
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
	isDismissed() {
		const dismissedTimestamp = this.getDismissedTimestamp();
		if ( ! dismissedTimestamp) return false;
		// check the difference between now and the dismissed
		// timestamp, depending on the timeout in settings
		const now = new Date().getTime() / 1000;
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
	getDismissedTimestamp() {
		let dismissedTimestamp;
		// switch on method
		switch(this.props.method.toLowerCase()) {
			case 'cookie':
				dismissedTimestamp = Cookies.get(this.props.name);
			break;
			case 'localstorage':
				dismissedTimestamp = localStorage.getItem(this.props.name);
			break;
			case 'sessionstorage':
				dismissedTimestamp = sessionStorage.getItem(this.props.name);			break;
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
	dismiss() {
		// switch on method
		switch(this.props.method.toLowerCase()) {
			case 'cookie':
				// set the cookie
				Cookies.set(this.props.name, new Date().getTime() / 1000, {
					expires : new Date(new Date().getTime() + this.props.timeout * 1000)
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
				eval(this.props.onDismiss)
			} else if (typeof this.props.onDismiss === 'function') {
				this.props.onDismiss()
			}
		}
		// update the status
		this.updateStatus();
		// maintain chainability
		return this;
	}
}
