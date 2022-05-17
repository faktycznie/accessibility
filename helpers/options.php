<?php
/**
 * @package DJ-Accessibility
 * @copyright Copyright (C) DJ-Extensions.com, All rights reserved.
 * @license http://www.gnu.org/licenses GNU/GPL
 * @author url: http://dj-extensions.com
 * @author email artur.kaczmarek@design-joomla.eu
 */

if( file_exists( DJACC_PATH . '/includes/cmb2_license.php' ) ) require_once DJACC_PATH . '/includes/cmb2_license.php';

add_action( 'cmb2_admin_init', 'djacc_register_options_metabox' );
/**
 * Hook in and register a metabox to handle a plugin options page and adds a menu item.
 */
function djacc_register_options_metabox() {

	/**
	 * Registers options page menu item and form.
	 */

	$cmb = new_cmb2_box( array(
		'id'           => 'djacc_options',
		'title'        => DJAcc::getName(),
		'object_types' => array( 'options-page' ),
		'option_key'      => 'djacc_options', // The option key and admin menu page slug.
		'icon_url'        => 'dashicons-universal-access-alt', // Menu icon. Only applicable if 'parent_slug' is left empty.
		'menu_title'      => esc_html__( 'DJ-Accessibility', 'dj-accessibility' ), // Falls back to 'title' (above).
	) );

	$plugin_type = DJAcc::pluginType();

	if( $plugin_type ) {
		$cmb->add_field( array(
			'name'             => esc_html__( 'License key', 'dj-accessibility' ),
			'desc'             => '',
			'id'               => 'djacc_dlid',
			'type'             => 'license',
		) );
	}

	if( DJACC_YOOTHEME ) {

		$cmb->add_field( array(
			'name' => '',
			'desc' => '<a class="button button-secondary" href="' . admin_url('customize.php?theme=yootheme') . '">' . esc_html__( 'Open Yootheme Accessibility options', 'dj-accessibility' ) . '</a>',
			'type' => 'title',
			'id'   => 'djacc_yootheme_button'
		) );

		return;
	}

	$cmb->add_field( array(
		'name'             => esc_html__('Position type', 'dj-accessibility'),
		'desc'             => esc_html__('Position sticky means that the panel stays in the same place even if the page is scrolled. Custom position requires DJ-Accessibility widget or custom HTML code on the page:', 'dj-accessibility') . '<br><i>&lt;div id="djacc"&gt;&lt;/div&gt;</i>',
		'id'               => 'djacc_position',
		'type'             => 'select',
		'default'          => 'sticky',
		'options'          => array(
			'sticky' => esc_html__( 'Sticky (fixed)', 'dj-accessibility' ),
			'custom' => esc_html__( 'Custom position (static)', 'dj-accessibility' ),
		),
	) );

	if( $plugin_type ) {
		$layouts = array(
			'popup'   => esc_html__( 'Popup', 'dj-accessibility' ),
			'toolbar' => esc_html__( 'Toolbar', 'dj-accessibility' ),
		);
	} else {
		$layouts = array(
			'popup'   => esc_html__( 'Popup', 'dj-accessibility' ),
		);
	}

	$cmb->add_field( array(
		'name'             => esc_html__('Layout', 'dj-accessibility'),
		'id'               => 'djacc_layout',
		'type'             => 'select',
		'default'          => 'popup',
		'options'          => $layouts,
	) );

	$cmb->add_field( array(
		'name'             => esc_html__('Theme', 'dj-accessibility'),
		'id'               => 'djacc_style',
		'type'             => 'select',
		'default'          => 'dark',
		'options'          => array(
			'dark'  => esc_html__( 'Dark', 'dj-accessibility' ),
			'light' => esc_html__( 'Light', 'dj-accessibility' ),
		),
	) );

	$cmb->add_field( array(
		'name'             => esc_html__('Popup open direction', 'dj-accessibility'),
		'desc'             => esc_html__('Choose the direction where the popup will open.', 'dj-accessibility'),
		'id'               => 'djacc_direction',
		'type'             => 'select',
		'default'          => 'top left',
		'options'          => array(
			'top center'    => esc_html__( 'down', 'dj-accessibility' ),
			'top right'     => esc_html__( 'down left', 'dj-accessibility' ),
			'top left'      => esc_html__( 'down right', 'dj-accessibility' ),
			'center left'   => esc_html__( 'left', 'dj-accessibility' ),
			'center right'  => esc_html__( 'right', 'dj-accessibility' ),
			'bottom center' => esc_html__( 'up', 'dj-accessibility' ),
			'bottom right'  => esc_html__( 'up left', 'dj-accessibility' ),
			'bottom left'   => esc_html__( 'up right', 'dj-accessibility' ),
		),
		'attributes'    => array(
			'data-conditional'     => wp_json_encode(array(
				'djacc_layout'=>'popup',
				'djacc_position'=> 'custom',
			)),
		),
	) );

	$cmb->add_field( array(
		'name'             => esc_html__('Position', 'dj-accessibility'),
		'id'               => 'djacc_align_popup',
		'type'             => 'select',
		'default'          => 'top right',
		'options'          => array(
			'top center'    => esc_html__( 'top', 'dj-accessibility' ),
			'top left'      => esc_html__( 'top left', 'dj-accessibility' ),
			'top right'     => esc_html__( 'top right', 'dj-accessibility' ),
			'center left'   => esc_html__( 'left', 'dj-accessibility' ),
			'center right'  => esc_html__( 'right', 'dj-accessibility' ),
			'bottom center' => esc_html__( 'bottom', 'dj-accessibility' ),
			'bottom left'   => esc_html__( 'bottom left', 'dj-accessibility' ),
			'bottom right'  => esc_html__( 'bottom right', 'dj-accessibility' ),
		),
		'attributes'    => array(
			'data-conditional'     => wp_json_encode(array(
				'djacc_layout'=>'popup',
				'djacc_position'=> 'sticky',
			)),
		),
	) );

	$cmb->add_field( array(
		'name'             => esc_html__('Position', 'dj-accessibility'),
		'id'               => 'djacc_align_toolbar',
		'type'             => 'select',
		'default'          => 'top right',
		'options'          => array(
			'top center'    => esc_html__( 'top', 'dj-accessibility' ),
			'center left'   => esc_html__( 'left', 'dj-accessibility' ),
			'center right'  => esc_html__( 'right', 'dj-accessibility' ),
			'bottom center' => esc_html__( 'bottom', 'dj-accessibility' ),
		),
		'attributes'    => array(
			'data-conditional'     => wp_json_encode(array(
				'djacc_layout'=>'toolbar',
				'djacc_position'=> 'sticky',
			)),
		),
	) );

	$cmb->add_field( array(
		'name' => esc_html__('Use mobile position', 'dj-accessibility'),
		'id'   => 'djacc_align_mobile_ch',
		'type' => 'checkbox',
		'sanitization_cb'  => 'djacc_sanitize_checkbox',
		'attributes'    => array(
			'data-conditional'     => wp_json_encode(array(
				'djacc_layout'=>'popup',
				'djacc_position'=> 'sticky',
			)),
		),
	) );

	$cmb->add_field( array(
		'name'             => esc_html__('Mobile position', 'dj-accessibility'),
		'desc'             => esc_html__('The panel position will be changed for mobile devices (< 767px)', 'dj-accessibility'),
		'id'               => 'djacc_align_mobile',
		'type'             => 'select',
		'default'          => 'bottom right',
		'options'          => array(
			'top center'    => esc_html__( 'top', 'dj-accessibility' ),
			'top left'      => esc_html__( 'top left', 'dj-accessibility' ),
			'top right'     => esc_html__( 'top right', 'dj-accessibility' ),
			'center left'   => esc_html__( 'left', 'dj-accessibility' ),
			'center right'  => esc_html__( 'right', 'dj-accessibility' ),
			'bottom center' => esc_html__( 'bottom', 'dj-accessibility' ),
			'bottom left'   => esc_html__( 'bottom left', 'dj-accessibility' ),
			'bottom right'  => esc_html__( 'bottom right', 'dj-accessibility' ),
		),
		'attributes'    => array(
			'data-conditional'     => wp_json_encode(array(
				'djacc_layout'=>'popup',
				'djacc_position'=> 'sticky',
				'djacc_align_mobile_ch'=> 'on',
			)),
		),
	) );

	$cmb->add_field( array(
		'name' => esc_html__('Reserve space', 'dj-accessibility'),
		'desc' => esc_html__('Choose whether the toolbar should cover the page or not.', 'dj-accessibility'),
		'id'   => 'djacc_space',
		'type' => 'checkbox',
		'default'=> true,
		'sanitization_cb'  => 'djacc_sanitize_checkbox',
		'attributes'    => array(
			'data-conditional'     => wp_json_encode(array(
				'djacc_layout'=>'toolbar',
				'djacc_position'=> 'sticky',
			)),
		),
	) );

	$cmb->add_field( array(
		'name'    => esc_html__('Offset top/bottom', 'dj-accessibility'),
		'desc'    => esc_html__('Space above and below the panel.', 'dj-accessibility'),
		'id'      => 'djacc_voff_popup',
		'default' => '20',
		'type'    => 'text_small',
		'attributes'    => array(
			'type' => 'number',
			'data-conditional'     => wp_json_encode(array(
				'djacc_layout'=>'popup',
				'djacc_position'=> 'sticky',
			)),
		),
	) );

	$cmb->add_field( array(
		'name'    => esc_html__('Offset left/right', 'dj-accessibility'),
		'desc'    => esc_html__('Space to the left or right of the panel.', 'dj-accessibility'),
		'id'      => 'djacc_hoff_popup',
		'default' => '20',
		'type'    => 'text_small',
		'attributes'    => array(
			'type' => 'number',
			'data-conditional'     => wp_json_encode(array(
				'djacc_layout'=>'popup',
				'djacc_position'=> 'sticky',
			)),
		),
	) );

	$cmb->add_field( array(
		'name'    => esc_html__('Offset top/bottom', 'dj-accessibility'),
		'desc'    => esc_html__('Space above and below the panel.', 'dj-accessibility'),
		'id'      => 'djacc_voff_toolbar',
		'default' => '0',
		'type'    => 'text_small',
		'attributes'    => array(
			'type' => 'number',
			'data-conditional'     => wp_json_encode(array(
				'djacc_layout'=>'toolbar',
				'djacc_position'=> 'sticky',
			)),
		),
	) );

	$cmb->add_field( array(
		'name'    => esc_html__('Offset left/right', 'dj-accessibility'),
		'desc'    => esc_html__('Space to the left or right of the panel.', 'dj-accessibility'),
		'id'      => 'djacc_hoff_toolbar',
		'default' => '0',
		'type'    => 'text_small',
		'attributes'    => array(
			'type' => 'number',
			'data-conditional'     => wp_json_encode(array(
				'djacc_layout'=>'toolbar',
				'djacc_position'=> 'sticky',
			)),
		),
	) );

	$cmb->add_field( array(
		'name'    => esc_html__('Button', 'dj-accessibility'),
		'id'      => 'djacc_image',
		'type'    => 'file',
		'text'    => array(
			'add_upload_file_text' => esc_html__('Add image', 'dj-accessibility')
		),
		// query_args are passed to wp.media's library query.
		'query_args' => array(
			// Or only allow gif, jpg, or png images
			// 'type' => array(
			// 	'image/gif',
			// 	'image/jpeg',
			// 	'image/png',
			// ),
		),
		'preview_size' => 'thumbnail', // Image size to use when previewing in the admin.
		'attributes'    => array(
			'data-conditional'     => wp_json_encode(array(
				'djacc_layout'=>'popup',
			)),
		),
	) );

	$cmb->add_field( array(
		'name'    => esc_html__('Button width', 'dj-accessibility'),
		'id'      => 'djacc_width',
		'default' => '48',
		'type'    => 'text_small',
		'attributes'    => array(
			'type' => 'number',
			'data-conditional'     => wp_json_encode(array(
				'djacc_layout'=>'popup',
				'operator'    => '&&',
				'djacc_image'=> '!',
			)),
		),
	) );

	$cmb->add_field( array(
		'name'    => esc_html__('Button height', 'dj-accessibility'),
		'id'      => 'djacc_height',
		'default' => '48',
		'type'    => 'text_small',
		'attributes'    => array(
			'type' => 'number',
			'data-conditional'     => wp_json_encode(array(
				'djacc_layout'=>'popup',
				'operator'    => '&&',
				'djacc_image'=> '!',
			)),
		),
	) );

}

function djacc_sanitize_checkbox($value, $field_args, $field) {
	// Return 0 instead of false if null value given.
	return is_null($value) ? 0 : $value;
}

?>