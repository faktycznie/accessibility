"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DJAccessibility = /*#__PURE__*/function () {
  function DJAccessibility(options) {
    _classCallCheck(this, DJAccessibility);

    var def = {
      target: '#djacc'
    };
    this.options = _objectSpread(_objectSpread({}, def), options);
    this.page = document.documentElement; //html tag - to fix filer and fixed position issues

    this.state = {};
    this.nodes = {};
    this.textNodes = {};
    this.ver = this.getVersion(); //trigger function to start

    this.init();
  }
  /**
   * Initialization function
   */


  _createClass(DJAccessibility, [{
    key: "init",
    value: function init() {
      var self = this;
      document.addEventListener("DOMContentLoaded", function () {
        self.container = document.querySelector('.djacc');

        if (self.container) {
          self.panel = self.container.querySelector('.djacc__panel');
          self.registerEvents();
          self.parseURL();
          self.setVersion();

          if (self.container.classList.contains('djacc--custom')) {
            //custom position (static)
            self.setStaticPosition();
          } else {
            //sticky (fixed) position
            self.container.classList.remove('djacc--hidden'); //showtime

            self.setPanelSize();
            self.reserveSpace();
            self.setMobilePosition();
            self.updateDirection();
            window.addEventListener('resize', function (event) {
              self.setPanelSize();
              self.reserveSpace();
              self.setMobilePosition();
            });
          }

          window.addEventListener('resize', function (event) {
            self.updateDirection();
          });
        }
      });
    }
    /**
     * Parse URL parameters in order to enable panel options
     */

  }, {
    key: "parseURL",
    value: function parseURL() {
      if (window.location.hash) {
        var hash = window.location.hash.substring(1);
        hash.replace('djacc-', '', hash);
        var findBtn = document.querySelector('.djacc__btn--' + hash);

        if (findBtn) {
          findBtn.click();
        }
      }
    }
    /**
     * Moves panel to the position in the content and make it visible
     */

  }, {
    key: "setStaticPosition",
    value: function setStaticPosition() {
      var el = this.options.target;
      var target = document.querySelector(el);

      if (target) {
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

  }, {
    key: "addState",
    value: function addState(key, value) {
      this.state[key] = value;
      this.saveCookie(this.state);
    }
    /**
     * Removes parameter from state object and cookie
     * @param {string} key - it's name of parameter in state object
     */

  }, {
    key: "removeState",
    value: function removeState(key) {
      delete this.state[key];

      if (Object.keys(this.state).length === 0) {
        this.removeCookie();
      } else {
        this.saveCookie(this.state);
      }
    }
    /**
     * Checks cookie and set saved parameters on the site
     */

  }, {
    key: "setState",
    value: function setState() {
      var cookie = this.getCookie();

      if (cookie) {
        cookie = JSON.parse(cookie);

        for (var prop in cookie) {
          if ('contrast' === prop || 'links' === prop || 'titles' === prop || 'sr' === prop) {
            var type = cookie[prop];
            var btn = document.querySelector('.djacc__btn.djacc__btn--' + type);
            if (btn) btn.click();
          } else {
            // font-size, line-height, letter-spacing, zoom
            var btnWrap = document.querySelector('.djacc__arrows.djacc__arrows--' + prop);

            if (btnWrap) {
              var num = cookie[prop];
              var btnInc = btnWrap.querySelector('.djacc__inc');
              var btnDec = btnWrap.querySelector('.djacc__dec');

              for (var i = 0; i < Math.abs(num); i++) {
                if (num < 0) {
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

  }, {
    key: "setPanelSize",
    value: function setPanelSize() {
      if (this.container.classList.contains('djacc--static')) return; //no need to adjust position if static

      var rect = this.panel.getBoundingClientRect();
      var maxheight;

      if (this.container.classList.contains('djacc--bottom-left') || this.container.classList.contains('djacc--bottom-right') || this.container.classList.contains('djacc--bottom-center')) {
        //open up
        var bottom = window.screen.height - rect.bottom;
        maxheight = window.screen.height - bottom;
      } else {
        //open down
        maxheight = window.screen.height - rect.top;
      }

      if (maxheight > 0) {
        if (this.container.classList.contains('djacc-toolbar')) {
          this.panel.querySelector('.djacc__list').style.maxHeight = maxheight + 'px';
        } else {
          this.panel.style.maxHeight = maxheight + 'px';
        }
      }
    }
    /**
     * Reserve space for toolbar on page (gives body padding)
     */

  }, {
    key: "reserveSpace",
    value: function reserveSpace() {
      //only for sticky toolbar
      if (this.container.classList.contains('djacc--static') || !this.container.classList.contains('djacc-toolbar') || false == this.options.space) return;
      var list = this.panel.querySelector('.djacc__list');
      var containerStyle = window.getComputedStyle(this.container);
      var width = list.scrollWidth;
      var widthMargin = parseInt(containerStyle.marginLeft);
      var height = list.scrollHeight;
      var heightMargin = parseInt(containerStyle.marginTop);

      if (this.container.classList.contains('djacc--center-left')) {
        document.body.style.paddingLeft = width + widthMargin + 'px';
      } else if (this.container.classList.contains('djacc--center-right')) {
        document.body.style.paddingRight = width + widthMargin + 'px';
      } else if (this.container.classList.contains('djacc--top-left') || this.container.classList.contains('djacc--top-right') || this.container.classList.contains('djacc--top-center')) {
        document.body.style.paddingTop = height + heightMargin + 'px';
      } else {
        //bottom
        document.body.style.paddingBottom = height + heightMargin + 'px';
      }
    }
    /**
     * Changes direction of popup if do not fit the screen
     */

  }, {
    key: "updateDirection",
    value: function updateDirection() {
      // only for popup
      if (this.container.classList.contains('djacc-toolbar')) return;
      var rect = this.panel.getBoundingClientRect();

      if (this.container.classList.contains('djacc--top-right') || this.container.classList.contains('djacc--bottom-right')) {
        //open to left
        if (rect.left < 0) {
          this.container.classList.add('djacc--direction');
        } else if (this.container.classList.contains('djacc--direction')) {
          this.container.classList.remove('djacc--direction');
        }
      }

      if (this.container.classList.contains('djacc--top-left') || this.container.classList.contains('djacc--bottom-left')) {
        //open to right
        if (window.innerWidth < rect.right) {
          this.container.classList.add('djacc--direction');
        } else if (this.container.classList.contains('djacc--direction')) {
          this.container.classList.remove('djacc--direction');
        }
      }
    }
    /**
     * Changes popup postion for mobile devices depends on yootheme breakpoint
     */

  }, {
    key: "setMobilePosition",
    value: function setMobilePosition() {
      //only for sticky popup
      if (this.container.classList.contains('djacc--static') || this.container.classList.contains('djacc-toolbar') || false == this.options.align_mobile) return;
      var breakSetting = this.options.yootheme ? getComputedStyle(document.body).getPropertyValue('--uk-breakpoint-s').slice(0, -2) : this.options.breakpoint;
      var breakpoint = parseInt(breakSetting);
      var width = window.innerWidth;
      var align_desktop = 'djacc--' + this.options.align_position.replace(' ', '-');
      var align_mobile = 'djacc--' + this.options.align_mobile_position.replace(' ', '-');

      if (width <= breakpoint) {
        //mobile
        if (this.container.classList.contains(align_desktop)) {
          this.container.classList.add(align_mobile);
          this.container.classList.remove(align_desktop);
        }
      } else {
        //desktop
        if (this.container.classList.contains(align_mobile)) {
          this.container.classList.add(align_desktop);
          this.container.classList.remove(align_mobile);
        }
      }
    }
    /**
     * Register all panel button events
     */

  }, {
    key: "registerEvents",
    value: function registerEvents() {
      var self = this;
      var btnOpen = document.querySelector('.djacc__openbtn');

      if (btnOpen) {
        btnOpen.addEventListener('click', function (event) {
          self.panel.classList.toggle('djacc__panel--active');
          this.classList.toggle('djacc__openbtn--active');
          self.page.classList.toggle('djacc-opened');
        });
      }

      var contrastActiveButton = function contrastActiveButton(el) {
        if (el.classList.contains('djacc__btn--active')) {
          el.classList.remove('djacc__btn--active');
        } else {
          _toConsumableArray(document.querySelectorAll('.djacc__item--contrast > .djacc__btn')).forEach(function (sib) {
            return sib.classList.remove('djacc__btn--active');
          });

          el.classList.add('djacc__btn--active');
        }
      }; //close button


      var btnClose = document.querySelector('.djacc__close');

      if (btnClose) {
        btnClose.addEventListener('click', function (event) {
          self.panel.classList.remove('djacc__panel--active');
          if (btnOpen) btnOpen.classList.remove('djacc__openbtn--active');
          self.page.classList.remove('djacc-opened');
        });

        if (!self.container.classList.contains('djacc--toolbar')) {
          var focusable = self.panel.querySelectorAll('button, [href], input, [tabindex="0"]');
          var firstFocusable = focusable[0];
          var lastFocusable = focusable[focusable.length - 1];
          firstFocusable.addEventListener('keydown', function (e) {
            if (e.key === 'Tab' && e.shiftKey) {
              setTimeout(function () {
                btnClose.click();
                btnOpen.focus();
              }, 300);
            }
          });
          lastFocusable.addEventListener('keydown', function (e) {
            if (e.key === 'Tab' && !e.shiftKey) {
              setTimeout(function () {
                btnClose.click();
                btnOpen.focus();
              }, 300);
            }
          });
          document.addEventListener('keyup', function (e) {
            if ((e.key == 'Escape' || e.key == 'Esc') && self.page.classList.contains('djacc-opened')) {
              setTimeout(function () {
                btnClose.click();
              }, 300);
            }
          });
        }
      } //reset button


      var btnReset = document.querySelector('.djacc__reset');

      if (btnReset) {
        btnReset.addEventListener('click', function (event) {
          var allBtns = document.querySelectorAll('.djacc__item > .djacc__btn, .djacc__item > .djacc__arrows');

          var _iterator = _createForOfIteratorHelper(allBtns),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var btn = _step.value;
              btn.classList.remove('djacc__btn--active');
              btn.classList.remove('djacc__arrows--active');
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          var btnSize = document.querySelectorAll('.djacc__size');

          var _iterator2 = _createForOfIteratorHelper(btnSize),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var _btn = _step2.value;
              _btn.innerHTML = '100%';

              _btn.parentNode.removeAttribute('data-djacc-count');
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          self.page.style.filter = '';
          self.page.style.zoom = '';
          self.removeCookie();

          if (self.page.classList.contains('djacc-font-size')) {
            self.updateTextStyle('font-size');
          }

          if (self.page.classList.contains('djacc-line-height')) {
            self.updateTextStyle('line-height');
          }

          if (self.page.classList.contains('djacc-letter-spacing')) {
            self.updateTextStyle('letter-spacing');
          }

          if (self.page.classList.contains('djacc-highlight-links')) {
            self.updateLinks();
          }

          if (self.page.classList.contains('djacc-highlight-titles')) {
            self.updateTitles();
          }

          if (self.page.classList.contains('djacc-screen-reader')) {
            self.screenReader();
          }

          self.clearClasses();

          if (self.page.classList.contains('djacc-read-mode')) {
            //we need to reload page
            window.location.reload(false);
          }
        });
      } //BUTTONS contrast


      var btnInvert = document.querySelector('.djacc__btn.djacc__btn--invert-colors');
      btnInvert.addEventListener('click', function (event) {
        contrastActiveButton(this);
        self.contrastInvert();
      });
      var btnMono = document.querySelector('.djacc__btn.djacc__btn--monochrome');
      btnMono.addEventListener('click', function (event) {
        contrastActiveButton(this);
        self.contrastMono();
      });
      var btnLowsat = document.querySelector('.djacc__btn.djacc__btn--low-saturation');
      btnLowsat.addEventListener('click', function (event) {
        contrastActiveButton(this);
        self.contrastLowSaturation();
      });
      var btnHighsat = document.querySelector('.djacc__btn.djacc__btn--high-saturation');
      btnHighsat.addEventListener('click', function (event) {
        contrastActiveButton(this);
        self.contrastHighSaturation();
      });
      var btnDarkContrast = document.querySelector('.djacc__btn.djacc__btn--dark-contrast');
      btnDarkContrast.addEventListener('click', function (event) {
        contrastActiveButton(this);
        self.contrastDark();
      });
      var btnLightContrast = document.querySelector('.djacc__btn.djacc__btn--light-contrast');
      btnLightContrast.addEventListener('click', function (event) {
        contrastActiveButton(this);
        self.contrastLight();
      }); //BUTTONS other

      var btnLinks = document.querySelector('.djacc__btn.djacc__btn--highlight-links');
      btnLinks.addEventListener('click', function (event) {
        this.classList.toggle('djacc__btn--active');
        self.highlightLinks();
      });
      var btnTitles = document.querySelector('.djacc__btn.djacc__btn--highlight-titles');
      btnTitles.addEventListener('click', function (event) {
        this.classList.toggle('djacc__btn--active');
        self.highlightTitles();
      }); //read mode

      var btnReadMode = document.querySelector('.djacc__btn.djacc__btn--read-mode');
      btnReadMode.addEventListener('click', function (event) {
        this.classList.toggle('djacc__btn--active');
        self.readMode();
      }); //screen reader

      var btnScreenReader = document.querySelector('.djacc__btn.djacc__btn--screen-reader');

      if ('speechSynthesis' in window) {
        // Synthesis support. Make your web apps talk!
        btnScreenReader.addEventListener('click', function (event) {
          this.classList.toggle('djacc__btn--active');
          self.screenReader();
        });
      } else {
        btnScreenReader.remove(); // no support
      } //ARROWS
      //page zoom


      var zoomInc = document.querySelector('.djacc__arrows--zoom .djacc__inc');
      zoomInc.addEventListener('click', function (event) {
        var counter = self.countClicks(this.parentNode, '+');
        self.zoomPage(counter);
      });
      var zoomDec = document.querySelector('.djacc__arrows--zoom .djacc__dec');
      zoomDec.addEventListener('click', function (event) {
        var counter = self.countClicks(this.parentNode, '-');
        self.zoomPage(counter);
      }); //font size

      var fontInc = document.querySelector('.djacc__arrows--font-size .djacc__inc');
      fontInc.addEventListener('click', function (event) {
        var counter = self.countClicks(this.parentNode, '+');
        self.updateTextStyle('font-size', counter);
      });
      var fontDec = document.querySelector('.djacc__arrows--font-size .djacc__dec');
      fontDec.addEventListener('click', function (event) {
        var counter = self.countClicks(this.parentNode, '-');
        self.updateTextStyle('font-size', counter);
      }); //line-height

      var heightInc = document.querySelector('.djacc__arrows--line-height .djacc__inc');
      heightInc.addEventListener('click', function (event) {
        var counter = self.countClicks(this.parentNode, '+');
        self.updateTextStyle('line-height', counter);
      });
      var heightDec = document.querySelector('.djacc__arrows--line-height .djacc__dec');
      heightDec.addEventListener('click', function (event) {
        var counter = self.countClicks(this.parentNode, '-');
        self.updateTextStyle('line-height', counter);
      }); //letter-spacing

      var letterInc = document.querySelector('.djacc__arrows--letter-spacing .djacc__inc');
      letterInc.addEventListener('click', function (event) {
        var counter = self.countClicks(this.parentNode, '+');
        self.updateTextStyle('letter-spacing', counter);
      });
      var letterDec = document.querySelector('.djacc__arrows--letter-spacing .djacc__dec');
      letterDec.addEventListener('click', function (event) {
        var counter = self.countClicks(this.parentNode, '-');
        self.updateTextStyle('letter-spacing', counter);
      }); //set state on load

      this.setState();
    }
    /**
     * Invert contrast on page
     */

  }, {
    key: "contrastInvert",
    value: function contrastInvert() {
      if (this.page.classList.contains('djacc-invert-colors')) {
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

  }, {
    key: "contrastMono",
    value: function contrastMono() {
      if (this.page.classList.contains('djacc-monochrome')) {
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

  }, {
    key: "contrastLowSaturation",
    value: function contrastLowSaturation() {
      if (this.page.classList.contains('djacc-low-saturation')) {
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

  }, {
    key: "contrastHighSaturation",
    value: function contrastHighSaturation() {
      if (this.page.classList.contains('djacc-high-saturation')) {
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

  }, {
    key: "contrastDark",
    value: function contrastDark() {
      if (this.page.classList.contains('djacc-dark-contrast')) {
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

  }, {
    key: "contrastLight",
    value: function contrastLight() {
      if (this.page.classList.contains('djacc-light-contrast')) {
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

  }, {
    key: "highlightLinks",
    value: function highlightLinks() {
      if (this.page.classList.contains('djacc-highlight-links')) {
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

  }, {
    key: "highlightTitles",
    value: function highlightTitles() {
      if (this.page.classList.contains('djacc-highlight-titles')) {
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

  }, {
    key: "readMode",
    value: function readMode() {
      if (this.page.classList.contains('djacc-read-mode')) {
        window.location.reload(false);
      } else {
        this.page.classList.add('djacc-read-mode');
        var remElements = 'nav, header, footer, aside, iframe, canvas, img, form, [uk-modal], [uk-sticky], .uk-slider';
        var removeContent = document.querySelectorAll(remElements);

        var _iterator3 = _createForOfIteratorHelper(removeContent),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var item = _step3.value;
            item.remove();
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        var allNodes = this.getNodes('readmode');

        var _iterator4 = _createForOfIteratorHelper(allNodes),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var _item = _step4.value;

            _item.removeAttribute('style');

            _item.removeAttribute('id');

            _item.removeAttribute('class');

            _item.removeAttribute('uk-scrollspy');

            _item.removeAttribute('uk-grid');

            _item.removeAttribute('uk-img');

            _item.removeAttribute('uk-parallax');

            _item.removeAttribute('uk-scrollspy-class');

            _item.removeAttribute('uk-filter');
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
    }
    /**
     * Screen reader - Adds screen reader event listener
     */

  }, {
    key: "screenReader",
    value: function screenReader() {
      if (this.page.classList.contains('djacc-screen-reader')) {
        this.removeState('sr');
        this.page.classList.remove('djacc-screen-reader');
        var activeSr = document.querySelectorAll('.djacc-reader');
        activeSr.forEach(function (item) {
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

  }, {
    key: "screenReaderEvent",
    value: function screenReaderEvent(event) {
      var target = event.target;

      if (target) {
        var html = document.documentElement;
        var lang = html.getAttribute('lang');
        var text = target.innerText;

        if (text) {
          //event.preventDefault(); // TODO block and restore event after sr end
          speechSynthesis.cancel();
          var sr = new SpeechSynthesisUtterance();
          target.classList.add('djacc-reader');
          sr.text = text;
          if (lang) sr.lang = lang;

          sr.onend = function (event) {
            setTimeout(function () {
              event.target.accElement.classList.remove('djacc-reader');
            }, 500);
          };

          sr.onerror = function (event) {
            console.log(event);
          };

          sr.accElement = target;
          speechSynthesis.speak(sr);
        }
      }
    }
    /**
     * Toggle contrast class
     * @param {bool} add - toogle parameter
     */

  }, {
    key: "updateContrastElements",
    value: function updateContrastElements() {
      var add = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var allNodes = this.getNodes();

      var _iterator5 = _createForOfIteratorHelper(allNodes),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var item = _step5.value;

          if (add) {
            item.classList.add('djacc-contrast');
          } else {
            item.classList.remove('djacc-contrast');
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
    /**
     *  Toggle link class
     * @param {bool} add - toggle parameter
     */

  }, {
    key: "updateLinks",
    value: function updateLinks() {
      var add = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var filter = function filter(node) {
        return node.tagName == 'A' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      };

      var links = this.getNodes('links', filter);

      var _iterator6 = _createForOfIteratorHelper(links),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var item = _step6.value;

          if (add) {
            item.classList.add('djacc-link');
          } else {
            item.classList.remove('djacc-link');
          }
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }
    /**
     *  Toggle heading class
     * @param {bool} add - toggle parameter
     */

  }, {
    key: "updateTitles",
    value: function updateTitles() {
      var add = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var filter = function filter(node) {
        switch (node.tagName) {
          case 'H1':
          case 'H2':
          case 'H3':
          case 'H4':
          case 'H5':
            return NodeFilter.FILTER_ACCEPT;

          default:
            return NodeFilter.FILTER_SKIP;
        }
      };

      var titles = this.getNodes('titles', filter);

      var _iterator7 = _createForOfIteratorHelper(titles),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var item = _step7.value;

          if (add) {
            item.classList.add('djacc-title');
          } else {
            item.classList.remove('djacc-title');
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
    /**
     * 
     * @param {HTMLElement} btn - button where store data attribute
     * @param {(+|-)} sign - increase or decrease value
     * @returns {string} - count number (from data attr)
     */

  }, {
    key: "countClicks",
    value: function countClicks(btn, sign) {
      if (!btn.classList.contains('djacc__arrows--active')) {
        btn.classList.add('djacc__arrows--active');
      }

      if (!btn.hasAttribute('data-djacc-count')) {
        btn.setAttribute('data-djacc-count', 0);
      }

      var count = btn.getAttribute('data-djacc-count');
      var btnSize = btn.querySelector('.djacc__size');

      if ('+' === sign) {
        //plus
        btn.setAttribute('data-djacc-count', ++count);
        var multiplier = 100 * (1 + 0.1 * count);
        btnSize.innerHTML = parseInt(multiplier) + '%';
      } else {
        //minus
        btn.setAttribute('data-djacc-count', --count);

        var _multiplier = 100 * (1 + 0.1 * count);

        btnSize.innerHTML = parseInt(_multiplier) + '%';
      }

      if (count === 0) btn.classList.remove('djacc__arrows--active');
      return btn.getAttribute('data-djacc-count');
    }
    /**
     * Set page scale depends on count value
     * @param {string|number} count 
     */

  }, {
    key: "zoomPage",
    value: function zoomPage(count) {
      count = parseInt(count); //zoom not supported in the firefox

      var zoomSupport = 'undefined' != typeof this.page.style.zoom ? true : false;

      if (count !== 0) {
        var multiplier = 1 + 0.1 * count;
        multiplier = parseFloat(multiplier);
        this.addState('zoom', count);
        this.page.classList.add('djacc-zoom');

        if (zoomSupport) {
          this.page.style.zoom = multiplier;
        } else {
          this.page.style.transform = 'scale(' + multiplier + ')';
          this.page.style.transformOrigin = 'center top';
        }
      } else {
        this.removeState('zoom');
        this.page.classList.remove('djacc-zoom');

        if (zoomSupport) {
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

  }, {
    key: "updateTextStyle",
    value: function updateTextStyle(type, count) {
      var textNodes = this.getTextNodes();
      var attrName = 'data-djacc-' + type;
      var className = 'djacc-' + type;
      var styleParam = type;
      var defParam;
      count = parseInt(count);

      if (count === 0) {
        this.removeState(type);
        this.page.classList.remove(className);
      } else {
        this.addState(type, count);
        this.page.classList.add(className);
      }

      if ('font-size' === type) {
        styleParam = 'fontSize';
        defParam = '16px';
      } else if ('line-height' === type) {
        styleParam = 'lineHeight';
        defParam = '16px';
      } else if ('letter-spacing' === type) {
        styleParam = 'letterSpacing';
        defParam = '1px';
      }

      var _iterator8 = _createForOfIteratorHelper(textNodes),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var item = _step8.value;

          if (!item.hasAttribute(attrName) && count !== 0) {
            var itemStyles = window.getComputedStyle(item);
            var currParam = itemStyles.getPropertyValue(type);
            item.setAttribute(attrName, currParam);
          }

          var orgParam = item.getAttribute(attrName);

          if (orgParam) {
            if (count > 0 || count < 0) {
              //set new value
              var multiplier = 1 + 0.1 * count;
              var param = parseFloat(orgParam);
              if (Number.isNaN(param)) param = parseFloat(defParam);
              var newSize = (param * multiplier).toFixed(2) + 'px';
              item.style[styleParam] = newSize;
            } else {
              //restore default value
              item.style[styleParam] = orgParam;
            }
          }
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
    }
    /**
     * Removes contrast classes and css stale from text nodes
     */

  }, {
    key: "clearContrast",
    value: function clearContrast() {
      var _this$page$classList;

      if (this.page.classList.contains('djacc-dark-contrast') || this.page.classList.contains('djacc-light-contrast')) {
        this.updateContrastElements();
      }

      var contrast = ['djacc-invert-colors', 'djacc-monochrome', 'djacc-low-saturation', 'djacc-high-saturation', 'djacc-dark-contrast', 'djacc-light-contrast'];

      (_this$page$classList = this.page.classList).remove.apply(_this$page$classList, contrast);

      this.page.style.filter = '';
    }
    /**
     * Removes all styles and classes from body and text nodes
     */

  }, {
    key: "clearClasses",
    value: function clearClasses() {
      var _this$page$classList2;

      this.clearContrast();
      var classes = ['djacc-font-size', 'djacc-line-height', 'djacc-letter-spacing', 'djacc-zoom', 'djacc-highlight-links', 'djacc-highlight-titles'];

      (_this$page$classList2 = this.page.classList).remove.apply(_this$page$classList2, classes);
    }
    /**
     * 
     * @param {string} name - unique name (type) of group of text nodes
     * @param {HTMLElement} target - HTML element where to search for nodes
     * @returns {array} - nodes
     */

  }, {
    key: "getTextNodes",
    value: function getTextNodes() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'all';
      var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;

      if (name in this.nodes) {
        return this.textNodes[name];
      } else {
        var myfilter = function myfilter(node) {
          //parentNode because it's text node
          if (node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE') {
            return NodeFilter.FILTER_SKIP;
          } else {
            return node.parentNode.closest('.djacc-container') ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
          }
        };

        var walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, myfilter);
        var nodes = [];

        while (walker.nextNode()) {
          var node = walker.currentNode;
          var text = node.textContent.replace(/(\r\n|\n|\r|\t)/gm, "").trim(); // trim new lines, tabs and spaces

          if (text.length) {
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

  }, {
    key: "getNodes",
    value: function getNodes() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'all';
      var filter = arguments.length > 1 ? arguments[1] : undefined;

      if (name in this.nodes) {
        return this.nodes[name];
      } else {
        if (!filter) {
          filter = function filter(node) {
            //all element nodes
            if (node.nodeType === 3 || node.nodeType === 8) {
              return NodeFilter.FILTER_SKIP;
            } else {
              return node.closest('.djacc-container') ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
            }
          };
        }

        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ALL, filter);
        var nodes = [];

        while (walker.nextNode()) {
          var node = walker.currentNode;
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

  }, {
    key: "getVersion",
    value: function getVersion() {
      return 'dmVyc2lvbnBybw==' === this.options.version ? true : false;
    }
    /**
     * Make the difference :)
     */

  }, {
    key: "setVersion",
    value: function setVersion() {
      if ('dmVyc2lvbnBybw==' !== this.options.version) {
        var btnReadMode = document.querySelector('.djacc__btn.djacc__btn--read-mode');
        btnReadMode.remove();
        var btnScreenReader = document.querySelector('.djacc__btn.djacc__btn--screen-reader');
        btnScreenReader.remove();
      }
    } //cookie staff

    /**
     * Wrapper to easy save parameters in cookie
     * @param {object} state - object of current panel parameters
     */

  }, {
    key: "saveCookie",
    value: function saveCookie(state) {
      var cookieName = 'dj-acc-cookie';
      this.setCookie(cookieName, JSON.stringify(state));
    }
    /**
     * Wrapper to easy remove cookie
     */

  }, {
    key: "removeCookie",
    value: function removeCookie() {
      var cookieName = 'dj-acc-cookie';
      this.deleteCookie(cookieName);
    }
    /**
     * Gets information from the cookie
     * @returns {*} - cookie value
     */

  }, {
    key: "getCookie",
    value: function getCookie() {
      var cookieName = 'dj-acc-cookie';
      return document.cookie.split('; ').reduce(function (r, v) {
        var parts = v.split('=');
        return parts[0] === cookieName ? decodeURIComponent(parts[1]) : r;
      }, '');
    }
    /**
     * Saves cookie in memory
     * @param {string} name - cookie name
     * @param {*} value - cookie value
     * @param {number} days - how long store cookie
     * @param {string} path - path
     */

  }, {
    key: "setCookie",
    value: function setCookie(name, value) {
      var days = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 30;
      var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '/';
      var expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path;
    }
    /**
     * Removes cookie
     * @param {string} name - cookie name
     * @param {string} path - path
     */

  }, {
    key: "deleteCookie",
    value: function deleteCookie(name) {
      var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';
      this.setCookie(name, '', -1, path);
    }
  }]);

  return DJAccessibility;
}();