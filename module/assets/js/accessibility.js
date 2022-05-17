class DJAccessibility {

	constructor( options ) {

		const def = {
			target: '#djacc',
		}

		this.options = {...def, ...options};

		this.page = document.documentElement; //html tag - to fix filer and fixed position issues
		
		this.state = {};
		this.nodes = {};
		this.textNodes = {};
		
		this.ver = this.getVersion();

		//trigger function to start
		this.init();
	}

	/**
	 * Initialization function
	 */
	init() {
		let self = this;

		document.addEventListener("DOMContentLoaded",function() {

			self.container = document.querySelector('.djacc');

			if( self.container ) {
				self.panel = self.container.querySelector('.djacc__panel');

				self.registerEvents();
				self.parseURL();
				self.setVersion();

				if( self.container.classList.contains('djacc--custom') ) { //custom position (static)
					self.setStaticPosition();
				} else { //sticky (fixed) position
					self.container.classList.remove('djacc--hidden'); //showtime
					self.setPanelSize();
					self.reserveSpace();
					self.setMobilePosition();
					self.updateDirection();
					

					window.addEventListener('resize', function(event) {
						self.setPanelSize();
						self.reserveSpace();
						self.setMobilePosition();
					});
				}

				window.addEventListener('resize', function(event) {
					self.updateDirection();
				});
			}
		});
	}

	/**
	 * Parse URL parameters in order to enable panel options
	 */
	parseURL() {
		if( window.location.hash ) {
			let hash = window.location.hash.substring(1);
			hash.replace('djacc-', '', hash);
			const findBtn = document.querySelector('.djacc__btn--' + hash);
			if( findBtn ) {
				findBtn.click();
			}
		}
	}

	/**
	 * Moves panel to the position in the content and make it visible
	 */
	setStaticPosition() {
		const el = this.options.target;
		const target = document.querySelector(el);
		if( target ) {
			this.container.classList.remove('djacc--hidden'); //showtime
			this.container.classList.add('djacc--static');
			target.append(this.container);
		}
	}

	/**
	 * Adds parameter to state object and save in cookie
	 * @param {string} key - it's name of parameter in state object
	 * @param {any} value - value of parameter
	 */
	addState( key, value ) {
		this.state[key] = value;
		this.saveCookie(this.state);
	}

	/**
	 * Removes parameter from state object and cookie
	 * @param {string} key - it's name of parameter in state object
	 */
	removeState( key ) {
		delete this.state[key];

		if( Object.keys(this.state).length === 0 ) {
			this.removeCookie();
		} else {
			this.saveCookie(this.state);
		}
	}

	/**
	 * Checks cookie and set saved parameters on the site
	 */
	setState() {
		let cookie = this.getCookie();
		if( cookie ) {
			cookie = JSON.parse(cookie);

			for (const prop in cookie) {
				if( 'contrast' === prop || 'links' === prop || 'titles' === prop || 'sr' === prop ) {
					const type = cookie[prop];
					const btn = document.querySelector('.djacc__btn.djacc__btn--' + type);
					if( btn ) btn.click();
				} else {
					// font-size, line-height, letter-spacing, zoom
					const btnWrap = document.querySelector('.djacc__arrows.djacc__arrows--' + prop);
					if( btnWrap ) {
						const num = cookie[prop];
						const btnInc = btnWrap.querySelector('.djacc__inc');
						const btnDec = btnWrap.querySelector('.djacc__dec');

						for (let i = 0; i < Math.abs(num); i++) {
							if( num < 0 ) {
								btnDec.click();
							} else {
								btnInc.click();
							}
						}
					}
				}
			}
		}
	}

	/**
	 * Set panel max height to fit the screen
	 */
	setPanelSize() {
		if( this.container.classList.contains('djacc--static') ) return; //no need to adjust position if static

		const rect = this.panel.getBoundingClientRect();
		let maxheight;
	
		if( this.container.classList.contains('djacc--bottom-left')
			|| this.container.classList.contains('djacc--bottom-right')
			|| this.container.classList.contains('djacc--bottom-center') ) { //open up
				const bottom = window.screen.height - rect.bottom;
				maxheight = window.screen.height - bottom;
		} else { //open down
			maxheight = window.screen.height - rect.top;
		}
		
		if( maxheight > 0 ) {
			if( this.container.classList.contains('djacc-toolbar') ) {
				this.panel.querySelector('.djacc__list').style.maxHeight = maxheight + 'px';
			} else {
				this.panel.style.maxHeight = maxheight + 'px';
			}
		}
	}

	/**
	 * Reserve space for toolbar on page (gives body padding)
	 */
	reserveSpace() { //only for sticky toolbar
		if( this.container.classList.contains('djacc--static') || ! this.container.classList.contains('djacc-toolbar') || false == this.options.space ) return;

		const list = this.panel.querySelector('.djacc__list');
		const containerStyle = window.getComputedStyle(this.container);

		const width = list.scrollWidth;
		const widthMargin = parseInt(containerStyle.marginLeft);
		const height = list.scrollHeight;
		const heightMargin = parseInt(containerStyle.marginTop);

		if( this.container.classList.contains('djacc--center-left') ) {
			document.body.style.paddingLeft = width + widthMargin + 'px';
		} else if( this.container.classList.contains('djacc--center-right') ) {
			document.body.style.paddingRight = width + widthMargin + 'px';
		} else if ( this.container.classList.contains('djacc--top-left') || this.container.classList.contains('djacc--top-right') || this.container.classList.contains('djacc--top-center') ) {
			document.body.style.paddingTop = height + heightMargin + 'px';
		} else { //bottom
			document.body.style.paddingBottom = height + heightMargin + 'px';
		}
	}

	/**
	 * Changes direction of popup if do not fit the screen
	 */
	updateDirection() { // only for popup
		if( this.container.classList.contains('djacc-toolbar') ) return;

		const rect = this.panel.getBoundingClientRect();

		if(this.container.classList.contains('djacc--top-right')
		|| this.container.classList.contains('djacc--bottom-right')
		) { //open to left
			if( rect.left < 0 ) {
				this.container.classList.add('djacc--direction');
			} else if( this.container.classList.contains('djacc--direction') ) {
				this.container.classList.remove('djacc--direction');
			}
		}

		if(this.container.classList.contains('djacc--top-left')
		|| this.container.classList.contains('djacc--bottom-left')
		) { //open to right
			if( window.innerWidth < rect.right ) {
				this.container.classList.add('djacc--direction');
			} else if( this.container.classList.contains('djacc--direction') ) {
				this.container.classList.remove('djacc--direction');
			}
		}
	}

	/**
	 * Changes popup postion for mobile devices depends on yootheme breakpoint
	 */
	setMobilePosition() { //only for sticky popup
		if( this.container.classList.contains('djacc--static') || this.container.classList.contains('djacc-toolbar') || false == this.options.align_mobile ) return; 

		const breakSetting = ( this.options.yootheme ) ? getComputedStyle(document.body).getPropertyValue('--uk-breakpoint-s').slice(0, -2) : this.options.breakpoint;
		const breakpoint = parseInt(breakSetting);
		const width = window.innerWidth;

		const align_desktop = 'djacc--' + this.options.align_position. replace(' ', '-');
		const align_mobile = 'djacc--' + this.options.align_mobile_position.replace(' ', '-');

		if( width <= breakpoint ) { //mobile
			if( this.container.classList.contains(align_desktop) ) {
				this.container.classList.add(align_mobile);
				this.container.classList.remove(align_desktop);
			}
		} else { //desktop
			if( this.container.classList.contains(align_mobile) ) {
				this.container.classList.add(align_desktop);
				this.container.classList.remove(align_mobile);
			}
		}
	}

	/**
	 * Register all panel button events
	 */
	registerEvents() {
		let self = this;

		const btnOpen = document.querySelector('.djacc__openbtn');
		if( btnOpen ) {
			btnOpen.addEventListener('click', function(event) {
				self.panel.classList.toggle('djacc__panel--active')
				this.classList.toggle('djacc__openbtn--active');
				self.page.classList.toggle('djacc-opened');
			});
		}

		const contrastActiveButton = el => {
			if( el.classList.contains('djacc__btn--active') ) {
				el.classList.remove('djacc__btn--active');
			} else {
				[...document.querySelectorAll('.djacc__item--contrast > .djacc__btn')].forEach(sib => sib.classList.remove('djacc__btn--active'));
				el.classList.add('djacc__btn--active');
			}
		}

		//close button
		const btnClose = document.querySelector('.djacc__close');
		if( btnClose ) {
			btnClose.addEventListener('click', function(event) {
				self.panel.classList.remove('djacc__panel--active')
				if( btnOpen ) btnOpen.classList.remove('djacc__openbtn--active');
				self.page.classList.remove('djacc-opened');
			});

			if( ! self.container.classList.contains('djacc--toolbar') ) {
				const focusable = self.panel.querySelectorAll('button, [href], input, [tabindex="0"]');
				const firstFocusable = focusable[0];
				const lastFocusable = focusable[focusable.length - 1];

				firstFocusable.addEventListener('keydown', (e) => {
					if (e.key === 'Tab' && e.shiftKey) {
						setTimeout(function() {
							btnClose.click();
							btnOpen.focus();
						}, 300);
					}
				});

				lastFocusable.addEventListener('keydown', (e) => {
					if (e.key === 'Tab' && !e.shiftKey) {
						setTimeout(function() {
							btnClose.click();
							btnOpen.focus();
						}, 300);
					}
				});
	
				document.addEventListener('keyup', (e) =>{
					if( (e.key == 'Escape' || e.key == 'Esc') && self.page.classList.contains('djacc-opened') ) {
						setTimeout(function() {
							btnClose.click();
						}, 300);
					}
				});
			}
		}

		//reset button
		const btnReset = document.querySelector('.djacc__reset');
		if( btnReset ) {
			btnReset.addEventListener('click', function(event) {

				const allBtns = document.querySelectorAll('.djacc__item > .djacc__btn, .djacc__item > .djacc__arrows');
				for (const btn of allBtns) {
					btn.classList.remove('djacc__btn--active');
					btn.classList.remove('djacc__arrows--active');
				}

				const btnSize = document.querySelectorAll('.djacc__size');
				for (const btn of btnSize) {
					btn.innerHTML = '100%';
					btn.parentNode.removeAttribute('data-djacc-count');
				}

				self.page.style.filter = '';
				self.page.style.zoom = '';
				self.removeCookie();
				if(self.page.classList.contains('djacc-font-size')) {
					self.updateTextStyle('font-size');
				}
				if(self.page.classList.contains('djacc-line-height')) {
					self.updateTextStyle('line-height');
				}
				if(self.page.classList.contains('djacc-letter-spacing')) {
					self.updateTextStyle('letter-spacing');
				}
				if(self.page.classList.contains('djacc-highlight-links')) {
					self.updateLinks();
				}
				if(self.page.classList.contains('djacc-highlight-titles')) {
					self.updateTitles();
				}
				if(self.page.classList.contains('djacc-screen-reader')) {
					self.screenReader();
				}
				self.clearClasses();

				if( self.page.classList.contains('djacc-read-mode') ) { //we need to reload page
					window.location.reload(false);
				}
			});
		}

		//BUTTONS contrast

		const btnInvert = document.querySelector('.djacc__btn.djacc__btn--invert-colors');
		btnInvert.addEventListener('click', function(event) {
			contrastActiveButton(this);
			self.contrastInvert();
		});

		const btnMono = document.querySelector('.djacc__btn.djacc__btn--monochrome');
		btnMono.addEventListener('click', function(event) {
			contrastActiveButton(this);
			self.contrastMono();
		});

		const btnLowsat = document.querySelector('.djacc__btn.djacc__btn--low-saturation');
		btnLowsat.addEventListener('click', function(event) {
			contrastActiveButton(this);
			self.contrastLowSaturation();
		});

		const btnHighsat = document.querySelector('.djacc__btn.djacc__btn--high-saturation');
		btnHighsat.addEventListener('click', function(event) {
			contrastActiveButton(this);
			self.contrastHighSaturation();
		});

		const btnDarkContrast = document.querySelector('.djacc__btn.djacc__btn--dark-contrast');
		btnDarkContrast.addEventListener('click', function(event) {
			contrastActiveButton(this);
			self.contrastDark();
		});

		const btnLightContrast = document.querySelector('.djacc__btn.djacc__btn--light-contrast');
		btnLightContrast.addEventListener('click', function(event) {
			contrastActiveButton(this);
			self.contrastLight();
		});

		//BUTTONS other

		const btnLinks = document.querySelector('.djacc__btn.djacc__btn--highlight-links');
		btnLinks.addEventListener('click', function(event) {
			this.classList.toggle('djacc__btn--active');
			self.highlightLinks();
		});

		const btnTitles = document.querySelector('.djacc__btn.djacc__btn--highlight-titles');
		btnTitles.addEventListener('click', function(event) {
			this.classList.toggle('djacc__btn--active');
			self.highlightTitles();
		});

		//read mode
		const btnReadMode = document.querySelector('.djacc__btn.djacc__btn--read-mode');
		btnReadMode.addEventListener('click', function(event) {
			this.classList.toggle('djacc__btn--active');
			self.readMode();
		});

		//screen reader
		const btnScreenReader = document.querySelector('.djacc__btn.djacc__btn--screen-reader');
		if ('speechSynthesis' in window) {
			// Synthesis support. Make your web apps talk!
			btnScreenReader.addEventListener('click', function(event) {
				this.classList.toggle('djacc__btn--active');
				self.screenReader();
			});
		} else {
			btnScreenReader.remove(); // no support
		}

		//ARROWS

		//page zoom
		const zoomInc = document.querySelector('.djacc__arrows--zoom .djacc__inc');
		zoomInc.addEventListener('click', function(event) {
			const counter = self.countClicks(this.parentNode, '+');
			self.zoomPage(counter);
		});

		const zoomDec = document.querySelector('.djacc__arrows--zoom .djacc__dec');
		zoomDec.addEventListener('click', function(event) {
			const counter = self.countClicks(this.parentNode, '-');
			self.zoomPage(counter);
		});

		//font size
		const fontInc = document.querySelector('.djacc__arrows--font-size .djacc__inc');
		fontInc.addEventListener('click', function(event) {
			const counter = self.countClicks(this.parentNode, '+');
			self.updateTextStyle('font-size', counter);
		});

		const fontDec = document.querySelector('.djacc__arrows--font-size .djacc__dec');
		fontDec.addEventListener('click', function(event) {
			const counter = self.countClicks(this.parentNode, '-');
			self.updateTextStyle('font-size', counter);
		});

		//line-height
		const heightInc = document.querySelector('.djacc__arrows--line-height .djacc__inc');
		heightInc.addEventListener('click', function(event) {
			const counter = self.countClicks(this.parentNode, '+');
			self.updateTextStyle('line-height', counter);
		});

		const heightDec = document.querySelector('.djacc__arrows--line-height .djacc__dec');
		heightDec.addEventListener('click', function(event) {
			const counter = self.countClicks(this.parentNode, '-');
			self.updateTextStyle('line-height', counter);
		});

		//letter-spacing
		const letterInc = document.querySelector('.djacc__arrows--letter-spacing .djacc__inc');
		letterInc.addEventListener('click', function(event) {
			const counter = self.countClicks(this.parentNode, '+');
			self.updateTextStyle('letter-spacing', counter);
		});

		const letterDec = document.querySelector('.djacc__arrows--letter-spacing .djacc__dec');
		letterDec.addEventListener('click', function(event) {
			const counter = self.countClicks(this.parentNode, '-');
			self.updateTextStyle('letter-spacing', counter);
		});

		//set state on load
		this.setState();
	}

	/**
	 * Invert contrast on page
	 */
	contrastInvert() {
		if( this.page.classList.contains('djacc-invert-colors') ) {
			this.removeState('contrast');
			this.page.classList.remove('djacc-invert-colors');
			this.page.style.filter = '';
		} else {
			this.clearContrast();
			this.addState('contrast', 'invert-colors');
			this.page.classList.add('djacc-invert-colors');
			this.page.style.filter = 'invert(100%)';
		}
	}

	/**
	 * Make page greyscale
	 */
	contrastMono() {
		if( this.page.classList.contains('djacc-monochrome') ) {
			this.removeState('contrast');
			this.page.classList.remove('djacc-monochrome');
			this.page.style.filter = '';
		} else {
			this.clearContrast();
			this.addState('contrast', 'monochrome');
			this.page.classList.add('djacc-monochrome');
			this.page.style.filter = 'grayscale(100%)';
		}
	}

	/**
	 * Sets low saturation
	 */
	contrastLowSaturation() {
		if( this.page.classList.contains('djacc-low-saturation') ) {
			this.removeState('contrast');
			this.page.classList.remove('djacc-low-saturation');
			this.page.style.filter = '';
		} else {
			this.clearContrast();
			this.addState('contrast', 'low-saturation');
			this.page.classList.add('djacc-low-saturation');
			this.page.style.filter = 'saturate(50%)';
		}
	}

	/**
	 * Sets high saturation
	 */
	contrastHighSaturation() {
		if( this.page.classList.contains('djacc-high-saturation') ) {
			this.removeState('contrast');
			this.page.classList.remove('djacc-high-saturation');
			this.page.style.filter = '';
		} else {
			this.clearContrast();
			this.addState('contrast', 'high-saturation');
			this.page.classList.add('djacc-high-saturation');
			this.page.style.filter = 'saturate(200%)';
		}
	}

	/**
	 * Sets dark contrast
	 */
	contrastDark() {
		if( this.page.classList.contains('djacc-dark-contrast') ) {
			this.removeState('contrast');
			this.page.classList.remove('djacc-dark-contrast');
			this.updateContrastElements();
		} else {
			this.clearContrast();
			this.addState('contrast', 'dark-contrast');
			this.page.classList.add('djacc-dark-contrast');
			this.updateContrastElements(1);
		}
	}

	/**
	 * Sets light contrast
	 */
	contrastLight() {
		if( this.page.classList.contains('djacc-light-contrast') ) {
			this.removeState('contrast');
			this.page.classList.remove('djacc-light-contrast');
			this.updateContrastElements();
		} else {
			this.clearContrast();
			this.addState('contrast', 'light-contrast');
			this.page.classList.add('djacc-light-contrast');
			this.updateContrastElements(1);
		}
	}

	/**
	 * Highlights links on page
	 */
	highlightLinks() {
		if( this.page.classList.contains('djacc-highlight-links') ) {
			this.removeState('links');
			this.page.classList.remove('djacc-highlight-links');
			this.updateLinks();
		} else {
			this.addState('links', 'highlight-links');
			this.page.classList.add('djacc-highlight-links');
			this.updateLinks(1);
		}
	}

	/**
	 * Higlights headings on page
	 */
	highlightTitles() {
		if( this.page.classList.contains('djacc-highlight-titles') ) {
			this.removeState('titles');
			this.page.classList.remove('djacc-highlight-titles');
			this.updateTitles();
		} else {
			this.addState('titles', 'highlight-titles');
			this.page.classList.add('djacc-highlight-titles');
			this.updateTitles(1);
		}
	}

	/**
	 * Readmode - removes selected elements and clear ids or classes to display plain text
	 */
	readMode() {
		if( this.page.classList.contains('djacc-read-mode') ) {
			window.location.reload(false);
		} else {
			this.page.classList.add('djacc-read-mode');

			const remElements = 'nav, header, footer, aside, iframe, canvas, img, form, [uk-modal], [uk-sticky], .uk-slider';
			
			const removeContent = document.querySelectorAll(remElements);
			for (const item of removeContent) {
				item.remove();
			}

			const allNodes = this.getNodes('readmode');
			for(let item of allNodes) {
				item.removeAttribute('style');
				item.removeAttribute('id');
				item.removeAttribute('class');
				item.removeAttribute('uk-scrollspy');
				item.removeAttribute('uk-grid');
				item.removeAttribute('uk-img');
				item.removeAttribute('uk-parallax');
				item.removeAttribute('uk-scrollspy-class');
				item.removeAttribute('uk-filter');
			}
		}
	}

	/**
	 * Screen reader - Adds screen reader event listener
	 */
	screenReader() {
		if( this.page.classList.contains('djacc-screen-reader') ) {
			this.removeState('sr');
			this.page.classList.remove('djacc-screen-reader');

			const activeSr = document.querySelectorAll('.djacc-reader');
			activeSr.forEach(item => {
				item.classList.remove('djacc-reader');
			});
			speechSynthesis.cancel();
			document.body.removeEventListener('click', this.screenReaderEvent, true);
			document.body.removeEventListener('focus', this.screenReaderEvent, true);
		} else {
			this.addState('sr', 'screen-reader');
			this.page.classList.add('djacc-screen-reader');
			document.body.addEventListener('click', this.screenReaderEvent, true);
			document.body.addEventListener('focus', this.screenReaderEvent, true);
		}
	}

	/**
	 *  Screen reader event listener function
	 * @param {object} event 
	 */
	screenReaderEvent( event ) {
		const target = event.target;
		if( target ) {
			const html = document.documentElement;
			const lang = html.getAttribute('lang');
			const text = target.innerText;

			if( text ) {
				//event.preventDefault(); // TODO block and restore event after sr end
				speechSynthesis.cancel();
				const sr = new SpeechSynthesisUtterance();

				target.classList.add('djacc-reader');

				sr.text = text;
				if( lang ) sr.lang = lang;
				sr.onend = function(event) {
					setTimeout(function() {
						event.target.accElement.classList.remove('djacc-reader');
					}, 500);
				}
				sr.onerror = function(event) { console.log(event); }
				sr.accElement = target;

				speechSynthesis.speak(sr);
			}
		}
	}

	/**
	 * Toggle contrast class
	 * @param {bool} add - toogle parameter
	 */
	updateContrastElements( add = false ) {
		const allNodes = this.getNodes();
		for(let item of allNodes) {
			if( add ) {
				item.classList.add('djacc-contrast');
			} else {
				item.classList.remove('djacc-contrast');
			}
		}
	}

	/**
	 *  Toggle link class
	 * @param {bool} add - toggle parameter
	 */
	updateLinks( add = false ) {
		const filter = function(node) {
			return (node.tagName=='A') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
		}
		const links = this.getNodes('links', filter);
		for(let item of links) {
			if( add ) {
				item.classList.add('djacc-link');
			} else {
				item.classList.remove('djacc-link');
			}
		}
	}

	/**
	 *  Toggle heading class
	 * @param {bool} add - toggle parameter
	 */
	updateTitles( add = false ) {
		const filter = function(node) {
			switch (node.tagName) {
				case 'H1':
				case 'H2':
				case 'H3':
				case 'H4':
				case 'H5':
					return NodeFilter.FILTER_ACCEPT
				default:
					return NodeFilter.FILTER_SKIP;
			}
		}
		const titles = this.getNodes('titles', filter);
		for(let item of titles) {
			if( add ) {
				item.classList.add('djacc-title');
			} else {
				item.classList.remove('djacc-title');
			}
		}
	}

	/**
	 * 
	 * @param {HTMLElement} btn - button where store data attribute
	 * @param {(+|-)} sign - increase or decrease value
	 * @returns {string} - count number (from data attr)
	 */
	countClicks( btn, sign ) {

		if( ! btn.classList.contains('djacc__arrows--active') ) {
			btn.classList.add('djacc__arrows--active');
		}

		if( ! btn.hasAttribute('data-djacc-count') ) {
			btn.setAttribute('data-djacc-count', 0);
		}

		let count = btn.getAttribute('data-djacc-count');
		const btnSize = btn.querySelector('.djacc__size');

		if( '+' === sign ) { //plus
			btn.setAttribute('data-djacc-count', ++count);
			let multiplier = 100 * (1 + (0.1 * count));
			btnSize.innerHTML = parseInt(multiplier) + '%';
		} else { //minus
			btn.setAttribute('data-djacc-count', --count);
			let multiplier = 100 * (1 + (0.1 * count));
			btnSize.innerHTML = parseInt(multiplier) + '%';
		}

		if(count === 0) btn.classList.remove('djacc__arrows--active');

		return btn.getAttribute('data-djacc-count');
	}

	/**
	 * Set page scale depends on count value
	 * @param {string|number} count 
	 */
	zoomPage( count ) {
		count = parseInt(count);
		//zoom not supported in the firefox
		const zoomSupport = ( 'undefined' != typeof this.page.style.zoom ) ? true : false;

		if( count !== 0 ) {

			let multiplier = 1 + (0.1 * count);
			multiplier = parseFloat(multiplier);

			this.addState('zoom', count);
			this.page.classList.add('djacc-zoom');

			if(zoomSupport) {
				this.page.style.zoom = multiplier;
			} else {
				this.page.style.transform = 'scale(' + multiplier + ')';
				this.page.style.transformOrigin = 'center top';
			}
		} else {
			this.removeState('zoom');
			this.page.classList.remove('djacc-zoom');

			if(zoomSupport) {
				this.page.style.zoom = '';
			} else {
				this.page.style.transform = '';
				this.page.style.transformOrigin = '';
			}
		}
	}

	/**
	 * Set required styles in text nodes
	 * @param {string} type - panel parameter name
	 * @param {string|number} count - scale (count)
	 */
	updateTextStyle( type, count ) {
		const textNodes = this.getTextNodes();
		const attrName = 'data-djacc-' + type;
		const className = 'djacc-' + type;
		let styleParam = type;
		let defParam;

		count = parseInt(count);

		if( count === 0 ) {
			this.removeState(type);
			this.page.classList.remove(className);
		} else {
			this.addState(type, count);
			this.page.classList.add(className);
		}
	
		if('font-size' === type) {
			styleParam = 'fontSize';
			defParam = '16px';
		} else if('line-height' === type) {
			styleParam = 'lineHeight';
			defParam = '16px';
		} else if('letter-spacing' === type) {
			styleParam = 'letterSpacing';
			defParam = '1px';
		}

		for(let item of textNodes) {
			if( ! item.hasAttribute(attrName) && count !== 0 ) {
				const itemStyles = window.getComputedStyle(item);
				const currParam = itemStyles.getPropertyValue(type);
				item.setAttribute(attrName, currParam);
			}

			const orgParam = item.getAttribute(attrName);
			if( orgParam ) {
				if( count > 0 || count < 0 ) { //set new value
					const multiplier = 1 + (0.1 * count);
					let param = parseFloat(orgParam);
					if( Number.isNaN(param) ) param = parseFloat(defParam);
					const newSize = (param * multiplier).toFixed(2) + 'px';
					item.style[styleParam] = newSize;
				} else { //restore default value
					item.style[styleParam] = orgParam;
				}
			}
		}
	}

	/**
	 * Removes contrast classes and css stale from text nodes
	 */
	clearContrast() {
		if( this.page.classList.contains('djacc-dark-contrast') || this.page.classList.contains('djacc-light-contrast')) {
			this.updateContrastElements();
		}
		const contrast = ['djacc-invert-colors', 'djacc-monochrome', 'djacc-low-saturation','djacc-high-saturation', 'djacc-dark-contrast', 'djacc-light-contrast'];
		this.page.classList.remove(...contrast);
		this.page.style.filter = '';
	}

	/**
	 * Removes all styles and classes from body and text nodes
	 */
	clearClasses() {
		this.clearContrast();
		const classes = ['djacc-font-size', 'djacc-line-height', 'djacc-letter-spacing', 'djacc-zoom', 'djacc-highlight-links', 'djacc-highlight-titles'];
		this.page.classList.remove(...classes);
	}

	/**
	 * 
	 * @param {string} name - unique name (type) of group of text nodes
	 * @param {HTMLElement} target - HTML element where to search for nodes
	 * @returns {array} - nodes
	 */
	getTextNodes( name = 'all', target = document.body ) {
		if( name in this.nodes ) {
			return this.textNodes[name];
		} else {
			const myfilter = function(node) {
				//parentNode because it's text node
				if( node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE' ) {
					return NodeFilter.FILTER_SKIP;
				} else {
					return node.parentNode.closest('.djacc-container') ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
				}
			}

			const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, myfilter);
			const nodes = [];
			while ( walker.nextNode() ) {
				const node = walker.currentNode;
				const text = node.textContent.replace(/(\r\n|\n|\r|\t)/gm, "").trim(); // trim new lines, tabs and spaces
				if( text.length ) {
					nodes.push(node.parentNode); //get parent nodes of text nodes
				}
			}
			this.textNodes[name] = nodes;
			return nodes;
		}
	}

	/**
	 * 
	 * @param {string} name - unique name (type) of group of nodes
	 * @param {object} filter - NodeFilter
	 * @returns {array} - nodes
	 */
	getNodes( name = 'all', filter ) {

		if( name in this.nodes ) {
			return this.nodes[name];
		} else {

			if( ! filter ) {
				filter = function(node) {
					//all element nodes
					if( node.nodeType === 3 || node.nodeType === 8 ) {
						return NodeFilter.FILTER_SKIP;
					} else {
						return node.closest('.djacc-container') ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
					}
					
				}
			}

			const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ALL, filter);
			const nodes = [];
			while ( walker.nextNode() ) {
				const node = walker.currentNode;
				nodes.push(node);
			}
			this.nodes[name] = nodes;
			return nodes;
		}
	}

	/**
	 *  Check plugin version
	 * @returns {bool}
	 */
	getVersion() {
		return ( 'dmVyc2lvbnBybw==' === this.options.version ) ? true : false;
	}

	/**
	 * Make the difference :)
	 */
	setVersion() {
		if( 'dmVyc2lvbnBybw==' !== this.options.version ) {
			const btnReadMode = document.querySelector('.djacc__btn.djacc__btn--read-mode');
			btnReadMode.remove();

			const btnScreenReader = document.querySelector('.djacc__btn.djacc__btn--screen-reader');
			btnScreenReader.remove();
		}
	}

	//cookie staff

	/**
	 * Wrapper to easy save parameters in cookie
	 * @param {object} state - object of current panel parameters
	 */
	saveCookie( state ) {
		const cookieName = 'dj-acc-cookie';
		this.setCookie(cookieName, JSON.stringify(state));
	}

	/**
	 * Wrapper to easy remove cookie
	 */
	removeCookie() {
		const cookieName = 'dj-acc-cookie';
		this.deleteCookie(cookieName);
	}

	/**
	 * Gets information from the cookie
	 * @returns {*} - cookie value
	 */
	getCookie() {
		const cookieName = 'dj-acc-cookie';
		return document.cookie.split('; ').reduce((r, v) => {
			const parts = v.split('=')
			return parts[0] === cookieName ? decodeURIComponent(parts[1]) : r
		}, '');
	}

	/**
	 * Saves cookie in memory
	 * @param {string} name - cookie name
	 * @param {*} value - cookie value
	 * @param {number} days - how long store cookie
	 * @param {string} path - path
	 */
	setCookie(name, value, days = 30, path = '/') {
		const expires = new Date(Date.now() + days * 864e5).toUTCString()
		document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path;
	}
	
	/**
	 * Removes cookie
	 * @param {string} name - cookie name
	 * @param {string} path - path
	 */
	deleteCookie(name, path = '/') {
		this.setCookie(name, '', -1, path);
	}
}
