<?php

/**
 * @file
 * Functions to support quitpath theme settings.
 */

use Drupal\Core\Form\FormStateInterface;

/**
 * Implements hook_form_FORM_ID_alter() for system_theme_settings.
 */
function quitpath_form_system_theme_settings_alter(&$form, FormStateInterface $form_state) {
  $form['#attached']['library'][] = 'quitpath/color-picker';

  $color_config = [
    'colors' => [
      'base_primary_color' => 'Primary base color',
    ],
    'schemes' => [
      'default' => [
        'label' => 'Blue Lagoon',
        'colors' => [
          'base_primary_color' => '#1b9ae4',
        ],
      ],
      'firehouse' => [
        'label' => 'Firehouse',
        'colors' => [
          'base_primary_color' => '#a30f0f',
        ],
      ],
      'ice' => [
        'label' => 'Ice',
        'colors' => [
          'base_primary_color' => '#57919e',
        ],
      ],
      'plum' => [
        'label' => 'Plum',
        'colors' => [
          'base_primary_color' => '#7a4587',
        ],
      ],
      'slate' => [
        'label' => 'Slate',
        'colors' => [
          'base_primary_color' => '#47625b',
        ],
      ],
    ],
  ];

  $form['#attached']['drupalSettings']['quitpath']['colorSchemes'] = $color_config['schemes'];

  $form['quitpath_settings']['quitpath_utilities'] = [
    '#type' => 'fieldset',
    '#title' => t('quitpath Utilities'),
  ];
  $form['quitpath_settings']['quitpath_utilities']['mobile_menu_all_widths'] = [
    '#type' => 'checkbox',
    '#title' => t('Enable mobile menu at all widths'),
    '#config_target' => 'quitpath.settings:mobile_menu_all_widths',
    '#description' => t('Enables the mobile menu toggle at all widths.'),
  ];
  $form['quitpath_settings']['quitpath_utilities']['site_branding_bg_color'] = [
    '#type' => 'select',
    '#title' => t('Header site branding background color'),
    '#options' => [
      'default' => t('Primary Branding Color'),
      'gray' => t('Gray'),
      'white' => t('White'),
    ],
    '#config_target' => 'quitpath.settings:site_branding_bg_color',
  ];
  $form['quitpath_settings']['quitpath_utilities']['quitpath_color_scheme'] = [
    '#type' => 'fieldset',
    '#title' => t('quitpath Color Scheme Settings'),
  ];
  $form['quitpath_settings']['quitpath_utilities']['quitpath_color_scheme']['description'] = [
    '#type' => 'html_tag',
    '#tag' => 'p',
    '#value' => t('These settings adjust the look and feel of the quitpath theme. Changing the color below will change the base hue, saturation, and lightness values the quitpath theme uses to determine its internal colors.'),
  ];
  $form['quitpath_settings']['quitpath_utilities']['quitpath_color_scheme']['color_scheme'] = [
    '#type' => 'select',
    '#title' => t('quitpath Color Scheme'),
    '#empty_option' => t('Custom'),
    '#empty_value' => '',
    '#options' => [
      'default' => t('Blue Lagoon (Default)'),
      'firehouse' => t('Firehouse'),
      'ice' => t('Ice'),
      'plum' => t('Plum'),
      'slate' => t('Slate'),
    ],
    '#input' => FALSE,
    '#wrapper_attributes' => [
      'style' => 'display:none;',
    ],
  ];

  foreach ($color_config['colors'] as $key => $title) {
    $form['quitpath_settings']['quitpath_utilities']['quitpath_color_scheme'][$key] = [
      '#type' => 'textfield',
      '#maxlength' => 7,
      '#size' => 10,
      '#title' => t($title),
      '#description' => t('Enter color in hexadecimal format (#abc123).') . '<br/>' . t('Derivatives will be formed from this color.'),
      '#config_target' => "quitpath.settings:$key",
      '#attributes' => [
        // Regex copied from Color::validateHex()
        'pattern' => '^[#]?([0-9a-fA-F]{3}){1,2}$',
      ],
      '#wrapper_attributes' => [
        'data-drupal-selector' => 'quitpath-color-picker',
      ],
    ];
  }
  // Add a new textfield.
  $form['footer_logo'] = [
    '#type' => 'managed_file',
    '#title' => t('Footer Logo'),
    '#upload_location' => 'public://',
    '#default_value' => theme_get_setting('footer_logo'),
    '#upload_validators' => [
      'file_validate_extensions' => ['png jpg jpeg webp svg'],
    ],
  ];

  $form['footer_copyrights'] = [
    '#type' => 'textfield',
    '#title' => t('Footer Copyrights'),
    '#default_value' => theme_get_setting('footer_copyrights'),
  ];
  
  $form['contact_form_recipient_email'] = [
    '#type' => 'textfield',
    '#title' => t('Contact Form Recipient Email'),
    '#default_value' => theme_get_setting('contact_form_recipient_email'),
    '#description' => t('You can add multiple emails with comma separated.')
  ];
  // Add custom submit handler.
  $form['#submit'][] = 'quitpath_theme_settings_submit';
}

function quitpath_theme_settings_submit($form, FormStateInterface $form_state) {
  $fid = $form_state->getValue('footer_logo');
  if (!empty($fid[0])) {
    $file = \Drupal\file\Entity\File::load($fid[0]);
    if ($file) {
      $file->setPermanent();
      $file->save();
    }
  }
}
