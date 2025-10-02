<?php

namespace Drupal\contact_form\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Contact Form Block' block.
 *
 * @Block(
 *   id = "contact_form_block",
 *   admin_label = @Translation("Contact Form Block"),
 *   category = @Translation("Custom")
 * )
 */
class ContactFormBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    // Return the custom form inside the block.
    return \Drupal::formBuilder()->getForm('Drupal\contact_form\Form\CustomContactForm');
  }

}
