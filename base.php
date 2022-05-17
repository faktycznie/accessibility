<?php
/**
 * @package DJ-Accessibility
 * @copyright Copyright (C) DJ-Extensions.com, All rights reserved.
 * @license http://www.gnu.org/licenses GNU/GPL
 * @author url: http://dj-extensions.com
 * @author email artur.kaczmarek@design-joomla.eu
 */

use YOOtheme\Application;

if ( !class_exists ( 'DJAccessibility' ) ) {

	require_once __DIR__ . '/helpers/helper.php';
	if( file_exists(__DIR__ . '/helpers/pro.php') ) require_once __DIR__ . '/helpers/pro.php';
	if( file_exists(__DIR__ . '/helpers/updates.php') ) require_once __DIR__ . '/helpers/updates.php';

	class DJAccessibility {
		function __construct() {
			add_action( 'plugins_loaded', array( $this, 'init' ) );
			add_action( 'after_setup_theme', array( $this, 'init_module' ) );
			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_files' ) );
			add_action( 'wp_body_open', array( $this, 'prepend_body' ) );
			add_action( 'wp_footer', array( $this, 'prepend_body' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin' ) );
		}

		public function init() {

			load_plugin_textdomain('dj-accessibility', false, dirname(plugin_basename(__FILE__)) . '/languages/');

			// check if YOOtheme Pro is loaded
			define('DJACC_YOOTHEME', DJAcc::checkYootheme());

			if( is_admin() ) {
				require __DIR__ . '/includes/cmb2/init.php';
				require __DIR__ . '/helpers/options.php';
			}
		}

		function init_module() {
			if( DJACC_YOOTHEME ) {
				/* Load Needed Classes */
				require __DIR__ . '/module/src/ConfigListener.php';
				
			
				// Load a single module from the same directory
				$app = Application::getInstance();
				$app->load(__DIR__ . '/module/bootstrap.php');
			}
		}

		function prepend_body() {
			if( is_admin() ) {
				return;
			}

			if ( doing_action( 'wp_body_open' ) ) {
				remove_action ( 'wp_footer', array( $this, 'prepend_body' ) );
			}

			//load template
			DJAcc::getLayout();
		}

		function enqueue_files() {

			$min = ( DJACC_DEBUG ) ? '' : '.min';
			$ver = ( DJACC_DEBUG ) ? DJACC_VERSION . '-' . time() : DJACC_VERSION;
	
			wp_enqueue_style('djacc-style', plugin_dir_url( __FILE__ ) . 'module/assets/css/accessibility.css', array(), $ver );
			wp_enqueue_script('djacc-script', plugin_dir_url( __FILE__ ) . 'module/assets/js/accessibility' . $min . '.js', array(), $ver, true);
		
			//inline css styles
			$position = DJAcc::getParam('position', 'sticky');
			$layout = DJAcc::getParam('layout', 'popup');

			if( 'sticky' == $position ) {
				if('popup' == $layout) {
					$voff = DJAcc::getParam('voff_popup', 20);
					$hoff = DJAcc::getParam('hoff_popup', 20);
				} else {
					$voff = DJAcc::getParam('voff_toolbar', 0);
					$hoff = DJAcc::getParam('hoff_toolbar', 0);
				}
				if( $voff > 0 || $hoff > 0 ) {
					wp_add_inline_style('djacc-style', '.djacc { margin: '.esc_attr($voff).'px '.esc_attr($hoff).'px; }');
				}
			}

			if( 'popup' == $layout ) {
				$align = DJAcc::getParam('align_popup', 'top right');
				$btn = DJAcc::getParam('image', false);
				$width = DJAcc::getParam('width', 48);
				$height = DJAcc::getParam('height', 48);
				if( $btn ) {
					wp_add_inline_style('djacc-style', '.djacc-popup .djacc__openbtn { width: '.esc_attr($width).'px; height: '.esc_attr($height).'px; }');
				}
			} else {
				$align = DJAcc::getParam('align_toolbar', 'top center');
			}
			
			$align_mobile = DJAcc::getParam('align_mobile_ch', false);
			$align_mobile_position  = DJAcc::getParam('align_mobile', 'bottom right');
			$direction = DJAcc::getParam('direction', 'top left');
			$space = DJAcc::getParam('space', true);

			$plugin_type = DJAcc::pluginType();

			$options = json_encode(array(
				'yootheme'               => DJACC_YOOTHEME,
				'position'               => esc_js($position),
				'layout'                 => esc_js($layout),
				'align_position'         => esc_js($align),
				'align_mobile'           => esc_js($align_mobile),
				'align_mobile_position'  => esc_js($align_mobile_position),
				'breakpoint'             => '767px',
				'direction'              => esc_js($direction),
				'space'                  => esc_js($space),
				'version'                => esc_js($plugin_type),
			));

			// init script
			$js = 'new DJAccessibility(' . $options . ')';
			wp_add_inline_script('djacc-script', $js);

		}

		function enqueue_admin( $hook ) {
			
			if ( 'toplevel_page_djacc_options' != $hook ) {
				return;
			}
			wp_enqueue_style('djacc-admin-style', plugin_dir_url( __FILE__ ) . 'assets/djacc-admin.css', array(), DJACC_VERSION);
			wp_enqueue_script('cmb2-dj-conditional', plugin_dir_url( __FILE__ ) . 'assets/cmb2-dj-conditional.js', array('jquery'), DJACC_VERSION, true);
		
		}
	}
	new DJAccessibility();
}
?>