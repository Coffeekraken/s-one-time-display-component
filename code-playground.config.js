module.exports = {
	// server port
	port : 3000,

	// title
	title : 's-one-time-display-component',

	// layout
	layout : 'right',

	// compile server
	compileServer : {

		// compile server port
		port : 4000

	},

	// editors
	editors : {
		html : {
			language : 'html',
			data : `
				<div class="container">
					<h1 class="h3 m-b-small">
						Coffeekraken s-one-time-display-component
					</h1>
					<p class="p m-b-bigger">
						Webcomponent that provide the ability to display itself depending on a cookie or a local|sessionStorage flag.
					</p>
					<s-one-time-display timeout="86400">
						<p class="p m-b">I will be displayed until someone click on the button bellow</p>
						<button class="btn" s-one-time-display-dismiss>
							Dismiss
						</button>
					</s-one-time-display>
				</div>
			`
		},
		css : {
			language : 'sass',
			data : `
				@import 'node_modules/coffeekraken-sugar/index';
				@import 'node_modules/coffeekraken-s-button-component/index';
				@import 'node_modules/coffeekraken-s-typography-component/index';
				@include s-init();
				@include s-classes();
				@include s-typography-classes();
				@include s-button-classes();
				body {
					background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
				}
				.container {
					@include s-position(absolute, middle, center);
					min-width:80vw;
				}
				s-one-time-display {
					display:none;
					background: white;
					padding: s-space(big);
					@include s-depth(5);

					&[enabled] {
						display: block;
					}
				}
			`
		},
		js : {
			language : 'js',
			data : `
				import '@babel/polyfill'
				import SOneTimeDisplayComponent from './dist/index'
			`
		}
	}
}
