<?php

namespace Drupal\contact_form\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Messenger\MessengerInterface;
use Drupal\Core\Mail\MailManagerInterface;
use Drupal\Core\Render\Markup;

class ContactMailController extends ControllerBase {

  /**
   * Handle the contact mail AJAX request.
   */
  public function handleContactMail(Request $request) {
    // Initialize the response array
    $response = ['status' => 'error'];

    // Check if the action is correct
    $mailManager = \Drupal::service('plugin.manager.mail');
    $module = 'contact_form';
    $key = 'contact_form_submit';
    $to = explode(",", theme_get_setting('contact_form_recipient_email'));
    $langcode = \Drupal::currentUser()->getPreferredLangcode();
    $values = $_POST;

    $topics = array_filter($values['topics']);
    $message = "<h2>New Contact Request</h2>";
    $message .= "<p><strong>Selected Topics:</strong> " . implode(', ', $topics) . "</p>";
    $message .= "<p><strong>Your Name: </strong> " . $values['Name'] . "</p>";
    $message .= "<p><strong>Preferred Contact Method:</strong> " . ucfirst($values['contact_method']) . "</p>";

    if ($values['contact_method'] === 'phone') {
      $message .= "<p><strong>Phone Number:</strong> " . $values['phone_number'] . "</p>";
      if (!empty($values['days'])) {
          $days = array_filter($values['days']);
          $message .= "<p><strong>Best Days to Call:</strong> " . ucwords(implode(', ', $days)) . "</p>";
      }
      if (!empty($values['times'])) {
          $times = array_filter($values['times']);
          $message .= "<p><strong>Best Time to Call:</strong> " . ucwords(implode(', ', $times)) . "</p>";
      }
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
      $response['status'] = 'success';
        $response['message'] = 'Thank you! Your message has been sent.';
    } else {
       $response['message'] = 'There was a problem sending your request.';
    }

    // Return the response as JSON
    return new JsonResponse($response);
  }
}
