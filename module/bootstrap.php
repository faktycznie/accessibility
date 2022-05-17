<?php
/**
 * @package DJ-Accessibility
 * @copyright Copyright (C) DJ-Extensions.com, All rights reserved.
 * @license http://www.gnu.org/licenses GNU/GPL
 * @author url: http://dj-extensions.com
 * @author email artur.kaczmarek@design-joomla.eu
 */

namespace DJExtensions\YOOessentials\YOOtheme;
use YOOtheme\Config;
use YOOtheme\Path;

return [

	'events' => [

		'customizer.init' => [
			ConfigListener::class => ['initCustomizer', -10],
		],

	],
	'extend' => [
		Config::class => function (Config $config){

			$plugin_type = \DJAcc::pluginType();

			if($plugin_type) {
				$config->addFile('accessibility', Path::get('../module/assets/json/config.json'));
			} else {
				$config->addFile('accessibility', Path::get('../module/assets/json/fconfig.json'));
			}
		},
	],
];
