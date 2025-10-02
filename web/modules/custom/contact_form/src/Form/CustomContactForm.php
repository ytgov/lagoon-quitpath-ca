<?php

namespace Drupal\contact_form\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Mail\MailManagerInterface;
use Drupal\Core\Render\Markup;

class CustomContactForm extends FormBase {

  public function getFormId() {
    return 'custom_contact_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $form["#prefix"] = "<section class='space-y-2.5 mx-auto container !pt-0 contact-form-wrapper'>";
    $form["#suffix"] = "</section>";

    $form['topics'] = [
      '#type' => 'checkboxes',
      '#title' => $this->t("<h2 class='s48-w400'>Please contact me regarding:</h2><h3 class='s24-w400 pt-5'><strong>Select the options that describe what you’d like us to contact you about</strong></h3>"),
      '#options' => [
        'Speaking with a quit coach' => $this->t('Speaking with a quit coach'),
        'Quit aids' => $this->t('Quit aids'),
        'Building a quit plan' => $this->t('Building a quit plan'),
        'Thinking of quitting' => $this->t('Thinking of quitting'),
      ],
      '#required' => TRUE,
    ];

    $form['Name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Your Name'),
      '#required' => TRUE,
    ];

    $form['contact_method'] = [
      '#type' => 'radios',
      '#title' => $this->t('Preferred method of contact'),
      '#options' => [
        'phone' => $this->t('Phone'),
        'text' => $this->t('Text'),
        'email' => $this->t('Email'),
      ],
      '#required' => TRUE,
    ];

    $form['phone_number'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Phone number'),
      '#states' => [
        'visible' => [
          ':input[name="contact_method"]' => ['value' => 'phone'],
        ],
      ],
      '#attributes' => [
        'placeholder' => '(000) 000-0000',
        'pattern' => '\(\d{3}\) \d{3}-\d{4}',
        'maxlength' => 14,
      ],
    ];

    $form['days'] = [
      '#type' => 'checkboxes',
      '#title' => $this->t('Best days to call'),
      '#options' => [
        'monday' => $this->t('Monday'),
        'tuesday' => $this->t('Tuesday'),
        'wednesday' => $this->t('Wednesday'),
        'thursday' => $this->t('Thursday'),
        'friday' => $this->t('Friday'),
      ],
      '#states' => [
        'visible' => [
          ':input[name="contact_method"]' => ['value' => 'phone'],
        ],
      ],
    ];

    $form['times'] = [
      '#type' => 'checkboxes',
      '#title' => $this->t('Best time to call'),
      '#options' => [
        'morning' => $this->t('Morning'),
        'afternoon' => $this->t('Afternoon'),
      ],
      '#states' => [
        'visible' => [
          ':input[name="contact_method"]' => ['value' => 'phone'],
        ],
      ],
    ];

    $form['message_permission'] = [
      '#type' => 'radios',
      '#title' => $this->t('Is it okay to leave a message?'),
      '#options' => [
        'yes' => $this->t('Yes'),
        'no' => $this->t('No'),
      ],
      '#states' => [
        'visible' => [
          ':input[name="contact_method"]' => ['value' => 'phone'],
        ],
      ],
    ];

    $form['text_phone'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Phone number'),
      '#states' => [
        'visible' => [
          ':input[name="contact_method"]' => ['value' => 'text'],
        ],
      ],
      '#attributes' => [
        'placeholder' => '(000) 000-0000',
        'pattern' => '\(\d{3}\) \d{3}-\d{4}',
        'maxlength' => 14,
      ],
    ];

    $form['email'] = [
      '#type' => 'email',
      '#title' => $this->t('Email address'),
      '#states' => [
        'visible' => [
          ':input[name="contact_method"]' => ['value' => 'email'],
        ],
      ],
    ];

    $message = $form_state->get('custom_form_message');
    if (empty($message)) {
        $form['submit'] = [
          '#type' => 'submit',
          '#value' => $this->t('Submit'),
        //   '#ajax' => [
        //     'callback' => '::ajaxSubmitHandler',
        //     'wrapper' => 'custom-form-message-wrapper',
        //     'effect' => 'fade',
        //   ],
        ];
    }

    // Message wrapper shown after submit via AJAX
    $message = $form_state->get('custom_form_message');
    $form['message_wrapper'] = [
      '#type' => 'container',
      '#attributes' => ['id' => 'custom-form-message-wrapper'],
      'message' => [
        '#markup' => $message ? '<div class="' . ($message['type'] === 'error' ? 'error-message' : 'success-message pt-5') . '">' . $message['text'] . '</div>' : '',
      ],
    ];

    $form['#validate'][] = '::validatePhoneNumber';

    return $form;
  }

  /**
   * AJAX callback.
   */
  public function ajaxSubmitHandler(array &$form, FormStateInterface $form_state) {
       $form_state->setValues([]);
    return $form['message_wrapper'];
  }

  /**
   * Validation handler.
   */
  public function validatePhoneNumber(array &$form, FormStateInterface $form_state) {
    // Validation logic goes here
  }

  /**
   * Submit handler.
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $mailManager = \Drupal::service('plugin.manager.mail');
    $module = 'contact_form';
    $key = 'contact_form_submit';
    $to = explode(",", theme_get_setting('contact_form_recipient_email'));
    $langcode = \Drupal::currentUser()->getPreferredLangcode();

    $values = $form_state->getValues();

    $topics = array_filter($values['topics']);
    $message = "<h2>New Contact Request</h2>";
    $message .= "<p><strong>Selected Topics:</strong> " . implode(', ', $topics) . "</p>";
    $message .= "<p><strong>Preferred Contact Method:</strong> " . $values['contact_method'] . "</p>";

    if ($values['contact_method'] === 'phone') {
      $message .= "<p><strong>Phone Number:</strong> " . $values['phone_number'] . "</p>";
      $days = array_filter($values['days']);
      $message .= "<p><strong>Best Days to Call:</strong> " . implode(', ', $days) . "</p>";
      $times = array_filter($values['times']);
      $message .= "<p><strong>Best Time to Call:</strong> " . implode(', ', $times) . "</p>";
      $message .= "<p><strong>Okay to Leave Message:</strong> " . ucfirst($values['message_permission']) . "</p>";
    } elseif ($values['contact_method'] === 'text') {
      $message .= "<p><strong>Text Phone Number:</strong> " . $values['text_phone'] . "</p>";
    } elseif ($values['contact_method'] === 'email') {
      $message .= "<p><strong>Email Address:</strong> " . $values['email'] . "</p>";
    }

    $params['message'] = Markup::create($message);

    $send_success = FALSE;
    foreach ($to as $mail_to) {
      $result = $mailManager->mail($module, $key, trim($mail_to), $langcode, $params, NULL, TRUE);
      if ($result['result'] === TRUE) {
        $send_success = TRUE;
      }
    }

    if ($send_success) {
      $form_state->set('custom_form_message', [
        'type' => 'success',
        'text' => $this->t('Thank you! Your message has been sent.'),
      ]);
      // Optionally reset form values
      $form_state->setValues([]);
    } else {
      $form_state->set('custom_form_message', [
        'type' => 'error',
        'text' => $this->t('There was a problem sending your message.'),
      ]);
    }

    // Required for AJAX callback to reflect changes
    //$form_state->setRebuild(TRUE);
  }

}
