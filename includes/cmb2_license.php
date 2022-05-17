<?php
/**
 * CMB2 License field
 *
 * @author Artur Kaczmarek
 */

if ( !defined( 'ABSPATH' ) ) exit;

if ( ! class_exists( 'CMB2_Field_license' ) ) {
/**
 * Class CMB2_Field_license
 */
	class CMB2_Field_license {

		public function __construct() {
			add_action( 'cmb2_render_license', [$this, 'render_license'], 10, 5 );
			add_filter( 'cmb2_sanitize_license', [$this, 'sanitize_license'], 10, 5 );
			add_filter( 'cmb2_types_esc_license', [$this, 'escape_license'], 10, 4 );

			add_action( 'wp_ajax_djacc_save_id', [$this, 'ajaxSave'] );    // If called from admin panel
			add_action( 'wp_ajax_nopriv_djacc_save_id', [$this, 'ajaxSave'] );    // If called from front end
		}

		public function render_license( $field, $field_escaped_value, $field_object_id, $field_object_type, $field_type_object ) {
			// the properties of the fields.
			$field_escaped_value = wp_parse_args( $field_escaped_value, [
				'key' => '',
			] );

			$input_id = $field_type_object->_id( '_key' );
			$mclass = ( !empty($field_escaped_value['key']) ) ? 'djacc-license-saved' : 'djacc-no-license';
		?>
			<div class="djacc-license <?php echo esc_attr($mclass); ?>" style="overflow: hidden;">
				<?php echo $field_type_object->input( [
					'name' => $field_type_object->_name( '[key]' ),
					'id' => $input_id,
					'value' => $field_escaped_value['key'],
				] ); ?>
				<button class="button button-primary dj-acc-license-btn"><?php esc_html_e('Save', 'dj-accessibility');?></button>
				<p class="cmb2-metabox-description dj-acc-license-message"></p>
				<script>
					jQuery(document).ready(function() {

						var input = jQuery('#<?php echo esc_js($input_id); ?>');
						var wrapper = input.parent();
						var button = input.next('.dj-acc-license-btn');
						var msg = button.next('.dj-acc-license-message');
						var loader = jQuery('<span class=\"dashicons dashicons-update djacc-spin\" />');
				
						button.click(function(e) {
							e.preventDefault();
							button.prop('disabled', true);
							button.prepend(loader);

							jQuery.ajax({
								url: "<?php echo admin_url('admin-ajax.php'); ?>",
								data: {
									action: 'djacc_save_id',
									dlid: input.val(),
								}
							}).done(function(resp) {
								var data = resp.data;

								button.prop('disabled', false);
								loader.detach();
								
								if( 'message' in data ) {
									msg.html(data.message);
								}

								if( 'mclass' in data ) {
									wrapper.removeClass('djacc-license-saved djacc-no-license');
									wrapper.addClass(data.mclass);
								}

							})
							.fail(function(resp) {
								console.log(resp);
								button.prop('disabled', false);
								loader.detach();
							});
						});
					});
				</script>
			</div>
			<?php
			echo $field_type_object->_desc( true );
		}

		/**
		 * Sanitize Field.
		 */
		public static function sanitize_license( $check, $meta_value, $object_id, $field_args, $sanitize_object ) {
			if ( !is_array( $meta_value ) || !( array_key_exists('repeatable', $field_args ) && $field_args['repeatable'] == TRUE ) ) {
				return $check;
			}
			$new_values = array();
			foreach ( $meta_value as $key => $val ) {
				if( !empty( $meta_value[$key]['key'] ) ) {
					$new_values[$key] = array_filter( array_map( 'sanitize_text_field', $val ) );
				}
			}
			
			return array_filter( array_values( $new_values ) );
		}

		/**
		 * Escape Field.
		 */
		public static function escape_license( $check, $meta_value, $field_args, $field_object ) {
			if ( !is_array( $meta_value ) || ! $field_args['repeatable'] ) {
				return $check;
			}

			$new_values = array();
			foreach ( $meta_value as $key => $val ) {
				if( !empty( $meta_value[$key]['key'] ) ) {
					$new_values[$key] = array_filter( array_map( 'esc_attr', $val ) );
				}
			}
			
			return array_filter( array_values( $new_values ) );
		}

		public function ajaxSave() {
			$dlid = ( !empty($_GET['dlid']) ) ? sanitize_text_field($_GET['dlid']) : '';

			$opt = get_option( 'djacc_options' );
			$old_key = ( !empty($opt['djacc_dlid']['key']) ) ? true : false;
			$opt['djacc_dlid'] = array('key' => $dlid);
			update_option( 'djacc_options', $opt );

			if( !empty($dlid) ) {
				$return = array(
					'message' => __('Key saved.', 'dj-accessibility'),
					'mclass'  => 'djacc-license-saved'
				);
			} else {
				$message = ( $old_key ) ? __('Key removed.', 'dj-accessibility') : __('Provide key.', 'dj-accessibility');
				$return = array(
					'message' => $message,
					'mclass'  => 'djacc-no-license'
				);
			}

			wp_send_json_success($return);
		}
	}

	$cmb2_field_license = new CMB2_Field_license();
}