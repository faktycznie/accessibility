<?php
/**
 * @package DJ-Accessibility
 * @copyright Copyright (C) DJ-Extensions.com, All rights reserved.
 * @license http://www.gnu.org/licenses GNU/GPL
 * @author url: http://dj-extensions.com
 * @author email artur.kaczmarek@design-joomla.eu
 */

defined( 'ABSPATH' ) || exit;

if( ! class_exists( 'DJAccUpdate' ) ) {

	class DJAccUpdate {

		public function __construct() {

			//clear cache
			if( !empty($_GET['force-check']) ) {
				set_site_transient('update_plugins', null);
			}

			$this->plugin_name = 'DJ-Accessibility Pro';
			$this->plugin_slug = 'dj-accessibility';
			$this->plugin_basename = plugin_basename(DJACC_PATH . '/dj-accessibility.php');
			$this->version = DJACC_VERSION;
			$this->remote = 'https://dj-extensions.com/index.php?option=com_ars&view=update&task=stream&format=xml&id=16';
			$this->dlid = DJAcc::getDID();
			$this->changelog = 'https://dj-extensions.com/support/changelogs/dj-accessibility/';
			$this->banner_hi = 'https://dj-extensions.com/images/wordpress/dj-accessibility/banner-1544x500.png';
			$this->banner_low = 'https://dj-extensions.com/images/wordpress/dj-accessibility/banner-772x250.png';
			$this->php_requires = '5.6';
			$this->wp_requires = '5.5';

			add_filter( 'plugins_api', array( $this, 'info' ), 20, 3 );
			add_filter( 'pre_set_site_transient_update_plugins', array( $this, 'update' ) );
		}

		public function request() {

			$remote = wp_remote_get(
				$this->remote,
				array(
					'timeout' => 10,
					'headers' => array(
						'Accept' => 'application/xml'
					)
				)
			);

			if(
				is_wp_error( $remote )
				|| 200 !== wp_remote_retrieve_response_code( $remote )
				|| empty( wp_remote_retrieve_body( $remote ) )
			) {
				return false;
			}

			$remote = wp_remote_retrieve_body( $remote );
			$remote = $this->parseXML($remote);

			$remote = $remote['updates'][0]; //first element from xml

			if( empty($remote) ) return false;

			$file_url = $remote['downloads']['downloadurl'];

			$dlid = $this->dlid;
			if( !empty($dlid) ) $file_url .= '&dlid=' . $dlid;

			//all needed data by info and update methods
			$data = array(
							'name' => $this->plugin_name,
							'plugin' => $this->plugin_basename,
							'slug' => $this->plugin_slug,
							'author' => '<a href="https://dj-extensions.com">DJ-Extensions.com</a>',
							'author_profile' => 'https://dj-extensions.com',
							'version' => $remote['version'],
							'new_version'=> $remote['version'],
							'download_url' => $file_url,
							'package' => $file_url,
							'download_link' => $file_url,
							'trunk' => $file_url,
							'requires' => $this->wp_requires,
							//'tested' => '5.8',
							'requires_php' => $this->php_requires,
							//'last_updated' => '2021-01-30 02:10:00',
							'sections' => array(
											//'description' => 'some description',
											//'installation' => 'installation tips',
											'changelog' => '<a href="' . $this->changelog . '" target="_blank">Click here to check changelog</a>',
										),
							'banners' => array(
											'low' => $this->banner_low,
											'high' => $this->banner_hi,
										),
						);

			return (object) $data;
		}

		function xml2array( $xmlObject, $out = array() ) {
			foreach ( (array) $xmlObject as $index => $node ) {
				$out[$index] = (is_object($node) ||  is_array($node)) ? $this->xml2array($node) : $node;
			}
			return $out;
		}

		function parseXML( $xml ) {
			$data = array();

			if ( !empty($xml) ) {
				//libxml_use_internal_errors(true); //for debug
				$xml = simplexml_load_string($xml);

				if (is_object($xml) && $xml instanceof SimpleXMLElement) {
					$updates = $xml->xpath('//updates/update');
					$data['updates'] = $this->xml2array($updates);
				}
			}
			return $data;
		}


		function info( $res, $action, $args ) {

			// do nothing if you're not getting plugin information right now
			if( 'plugin_information' !== $action ) {
				return false;
			}

			// do nothing if it is not our plugin
			if( $this->plugin_slug !== $args->slug ) {
				return false;
			}

			// get updates
			$remote = $this->request();

			if( ! $remote ) {
				return false;
			}

			return $remote;

		}

		public function update( $transient ) {

			if ( empty($transient->checked ) ) {
				return $transient;
			}

			$remote = $this->request();

			if(
				$remote
				&& version_compare( $this->version, $remote->version, '<' )
				&& version_compare( $remote->requires, get_bloginfo( 'version' ), '<' )
				&& version_compare( $remote->requires_php, PHP_VERSION, '<' )
			) {
				$transient->response[ $remote->plugin ] = $remote;
			} else {
				$transient->no_update[ $remote->plugin ] = $remote;
			}

			return $transient;

		}

	}

	new DJAccUpdate();

}