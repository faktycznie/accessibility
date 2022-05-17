<?php
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Plugin Name: DJ-Accessibility Pro
 * Plugin URI: https://dj-extensions.com/yootheme/dj-accessibility
 * Description: Accessibility plugin for WordPress
 * Version: 1.02
 * Author: DJ-Extensions.com
 * Author URI: https://dj-extensions.com
 * Text Domain: dj-accessibility
 * License: https://dj-extensions.com/license DJ-Extensions Proprietary Use License
 */

if( ! defined( 'DJACC' ) ) {
	define ('DJACC', true);
	define ('DJACC_DEBUG', false);
	define ('DJACC_VERSION', '1.02');
	define ('DJACC_PATH', __DIR__);

	//load main class
	require_once __DIR__ . '/base.php';
}
?>
