jQuery(document).ready(function($){
    
    $(this).on('click', '#search-icon', function(){
        if ($('#search-block-form input[type="search"]').val() !== '') {
            $('#search-block-form').submit();
        }
    });
    
    $('html[lang=fr] input[required]').each(function() {
      this.oninvalid = function(e) {
        e.target.setCustomValidity(Drupal.t('Veuillez remplir ce champ.'));
      };
      this.oninput = function(e) {
        e.target.setCustomValidity('');
      };
    });
    
     $('form#custom-contact-form').submit( function(event){ 
        var validation = 'pass';
        
        var checked = false;
    
        // Loop through each checkbox to check if at least one is selected
        $('input[type="checkbox"][name^="topics"]').each(function() {
          if ($(this).prop('checked')) {
            checked = true; // At least one checkbox is checked
            return false; // Exit loop early if a checkbox is checked
          }
        });
    
        // If no checkboxes are selected, prevent form submission
        if (!checked) {
          event.preventDefault(); // Stop form submission
          // Check if the error message already exists to avoid duplicates
          if ($('.error').length === 0) {
            // Append the error message only if it does not exist
            $('#edit-topics').after("<div class='error'>Please select at least one topic.</div>");
          }
          return false; // Prevent form submission
        }
        
        if (!$('input[name="contact_method"]:checked').val()) {
          event.preventDefault(); // Stop form submission
          $('div#edit-contact-method').focus();
          $('.error').remove();
          $('div#edit-contact-method').after("<div class='error'>Preferred method of contact field is required.</div>");
          return;
        }
        
        $('input[type="radio"][name="contact_method"]:checked').each(function() {
            var selected_value = $(this).val();

            if (selected_value == 'phone') {
                var selected_phone = $('input#edit-phone-number').val();
                if (selected_phone == '' || selected_phone == null) {
                    event.preventDefault(); 
                    $('input#edit-phone-number').focus();
                    $('.error').remove();
                    $('input#edit-phone-number').after("<div class='error'>Phone number field is required.</div>");
                    validation = 'fail'; 
                    return;
                }
            }
            if (selected_value == 'text') {
                var selected_phone = $('input#edit-text-phone').val();
                if (selected_phone == '' || selected_phone == null) {
                    event.preventDefault(); 
                    $('input#edit-text-phone').focus();
                    $('.error').remove();
                    $('input#edit-text-phone').after("<div class='error'>Phone number field is required.</div>");
                    validation = 'fail';
                    return;
                }
            }
            if (selected_value == 'email') {
                var selected_phone = $('input#edit-email').val();
                if (selected_phone == '' || selected_phone == null) {
                    event.preventDefault(); 
                    $('input#edit-email').focus();
                    $('.error').remove();
                    $('input#edit-email').after("<div class='error'>Email field is required.</div>");
                    validation = 'fail';
                    return;
                }
            }
            
          });
        
        if (validation != 'fail') {
            var queryString = $(this).serialize();
            event.preventDefault();
            $.ajax({
              url: '/contact-mail',
              type: 'POST',
              dataType: 'json',
              data: queryString,
              success: function(response) {
                console.log(response); // Debug the response
                if (response.status === 'success') {
                  $('form#custom-contact-form').after("<div id='custom-form-message-wrapper' ><div class='success-message pt-5'>" + response.message + "</div></div>");
                  $('input').val('');
                  $('.error').remove();
                  $('input[type="checkbox"]').prop('checked', false);
                  $('input[type="radio"]').prop('checked', false);
                  $('form#custom-contact-form .js-form-submit').hide();
                } else {
                  //alert('Request failed');
                }
              },
              error: function(xhr, status, error) {
                console.log(error); // Log the error
                //alert('An error occurred: ' + error);
              }
            });
        }
        
     });
    
    $('#smoking').addClass('active');

    $(this).on('click', '#mobile-menu-button', function(){
        $(this).find('.open-menu').toggle();
        $(this).find('.close-menu').toggle();
        $('body').toggleClass('overflow-hidden');
        
        $("#mobile-menu").toggleClass('hidden');
    })
    
    $(this).on('click', '.menu-item .icon', function(){
        console.log("Menu open");
        $(this).closest('ul').find('.sub-menu').addClass('hidden');
        $(this).closest('ul').find('.menu-item').removeClass('active');
        
        $(this).closest('.menu-item').toggleClass('active');

        if ($(this).is('li')) {
            console.log('li clicked');
            $(this).closest('.menu-item').find('.sub-menu').toggleClass('hidden');
        } else {
            $(this).closest('li').find('.sub-menu').toggleClass('hidden');
        }
    })
    
    $(this).on('click', '.search-opener, #search-block-form .search-form-icon.close-icon', function(){
        $('body').find('.menus').slideToggle();
        $('body').find('.region--search').slideToggle();
    })

    $(this).on('click', '.like', function(){
        $('#edit-was-this-page-helpful-yes').click();
    })
    
    $(this).on('click', '.dislike', function(){
        $('#edit-was-this-page-helpful-no').click();
    })


  const $likeBtn = $('.like-dislike-btn .like');
  const $dislikeBtn = $('.like-dislike-btn .dislike');
  const $formWrapper = $('.region.region--feedback');

  function updateState(buttonType) {
    if (buttonType === 'like') {
      $likeBtn.toggleClass('active');
      $dislikeBtn.removeClass('active');
    } else if (buttonType === 'dislike') {
      $dislikeBtn.toggleClass('active');
      $likeBtn.removeClass('active');
    }

    if ($likeBtn.hasClass('active') || $dislikeBtn.hasClass('active')) {
      $formWrapper.slideDown(); // Show the form
    } else {
      $formWrapper.slideUp(); // Hide the form
    }
  }

  $likeBtn.on('click', function () {
    updateState('like');
  });

  $dislikeBtn.on('click', function () {
    updateState('dislike');
  });
  
    // $(this).on('click', '.like', function() {
    //     $(this).toggleClass('active');
    //     $('body').find(".region.region--feedback").slideToggle();
    // })
    
    // $(this).on('click', '.dislike', function() {
    //     $('.like').removeClass('active');
    //     $(this).toggleClass('active');
    //     $('body').find('.region.region--feedback').toggleClass('active');
    //     $('body').find(".region.region--feedback.active").slideUp();
    //     $('body').find(".region.region--feedback:not('.active')").slideDown();
    // })
    
    // $(this).on('click', '.like, .dislike', function() {
    //     $('.like-dislike-btn img').removeClass('active');
    //     $(this).toggleClass('active');
    //     $('body').find('.region.region--feedback').toggleClass('active');
    //     $('body').find('.region.region--feedback').slideToggle();
    // })

    // $(this).on('click', '.dislike', function(){
    //     $('.like-dislike-btn img').removeClass('active');
    //     $(this).addClass('active');
    //     $('body').find('.region.region--feedback').toggleClass('active');
    //     $('body').find('.region.region--feedback').slideToggle();
    // })
    
    $(this).on('mouseenter', '.primary-nav__menu-link--has-children', function(){
        $(this).closest('.sub-menu').toggleClass('hidden');
    })

    // $(this).on('click', '.menu-item', function(){
    //     $(this).closest('ul').find('.sub-menu').addClass('hidden');
    //     $(this).closest('ul').find('.menu-item').removeClass('active');
        
    //     $(this).toggleClass('active');

    //     if ($(this).is('li')) {
    //         console.log('li clicked');
    //         $(this).find('.sub-menu').toggleClass('hidden');
    //     } else {
    //         $(this).closest('li').find('.sub-menu').toggleClass('hidden');
    //     }
    // });
    $('#fagersttest').addClass('active');
    // next button
    $('[class^="question-"] .next-prev-btn p:last-child').not('.question-5 .next-prev-btn p:last-child').click(function() {
        var class_name = $(this).closest('[class^="question-"]').attr("class");
        class_name = class_name.replace("hidden", "");
        var parent_name = $(this).closest('[class^="question-"]').parent().attr("class");
        var parent_class = '.' + parent_name.replace(/\s+/g, '.');

        if (!$(parent_class + " ." + class_name + ' input').is(':checked')) {
            // Please select an option to processed
            $('.red_error').remove();
            var lang = $('html').attr('lang');
            if (lang == "fr") {
                var message = "Veuillez sélectionner une option pour continuer.";
            }
            else {
                var message = "Please select an option to proceed";
            }
            
            $(this).parent().before("<p class='red_error' style='color:red'>* "+message+"</a>");
            return false;
            //alert("Selected value: " + $(this).val());
        }
        var $currentQuestion = $(this).closest('[class^="question-"]');
        $currentQuestion.hide();
        $currentQuestion.next().show();
    });
    
    // previous button
    $('[class^="question-"] .next-prev-btn p:first-child').not('.question-0 .next-prev-btn p:first-child').click(function() {
        $('.red_error').remove();
        var $currentQuestion = $(this).closest('[class^="question-"]');
        $currentQuestion.hide();
        $currentQuestion.prev().show();
    });
    
    // last question
    $('#fagerst_test .question-5 .next-prev-btn p:last-child').click(function() {
        if (!$('.question-5 input').is(':checked')) {
            $('.red_error').remove();
            var lang = $('html').attr('lang');
            if (lang == "fr") {
                var message = "Veuillez sélectionner une option pour continuer.";
            }
            else {
                var message = "Please select an option to proceed";
            }
            $(this).parent().before("<p class='red_error' style='color:red'> "+message+"</a>");
            return false;
            //alert("Selected value: " + $(this).val());
        }
        $(this).closest('[class^="question-"]').hide();
        
        $('#fagerström-test-result').show();

        // Ensure you declare data only once
        let formData = $('#fagerst_test').serializeArray();
        let total = 0;

        for (let i = 0; i < formData.length; i++) {
            total += parseInt(formData[i].value, 10);
        }
        $("#fagerström-test-result .your_score").html('<h2 class="s30-w500">Your Score: ' + total + '</h2>');
    });
    
    $('#e-cigarette-test .question-5 .next-prev-btn p:last-child').click(function() {
        if (!$('.question-5 input').is(':checked')) {
            $('.red_error').remove();
            var lang = $('html').attr('lang');
            if (lang == "fr") {
                var message = "Veuillez sélectionner une option pour continuer.";
            }
            else {
                var message = "Please select an option to proceed";
            }
            $(this).parent().before("<p class='red_error' style='color:red'> "+message+"</a>");
            return false;
            //alert("Selected value: " + $(this).val());
        }
        $(this).closest('[class^="question-"]').hide();
        
        $('#e-cigarette-test-result').show();

        // Ensure you declare data only once
        let formData = $('#e-cigarette-test').serializeArray();
        let total = 0;

        for (let i = 0; i < formData.length; i++) {
            total += parseInt(formData[i].value, 10);
        }
        $("#e-cigarette-test-result .your_score").html('<h2 class="s30-w500">Your Score: ' + total + '</h2>');
    });

    $('[class^="question-"]').not('.question-0').hide();

/**
    $('.question-0 .next-prev-btn p').click( function(){
       $(this).parent().parent().parent().parent().hide(); 
       $(this).parent().parent().parent().parent().next().show();
    });
    $('.question-1 .next-prev-btn p:first-child').click( function(){
       $(this).parent().parent().parent().parent().hide(); 
       $(this).parent().parent().parent().parent().prev().show();
    });
    $('.question-1 .next-prev-btn p:last-child').click( function(){
       $(this).parent().parent().parent().parent().hide(); 
       $(this).parent().parent().parent().parent().next().show();
    });
    $('.question-2 .next-prev-btn p:first-child').click( function(){
       $(this).parent().parent().parent().parent().hide(); 
       $(this).parent().parent().parent().parent().prev().show();
    });
    $('.question-2 .next-prev-btn p:last-child').click( function(){
       $(this).parent().parent().parent().parent().hide(); 
       $(this).parent().parent().parent().parent().next().show();
    });
    $('.question-3 .next-prev-btn p:first-child').click( function(){
       $(this).parent().parent().parent().parent().hide(); 
       $(this).parent().parent().parent().parent().prev().show();
    });
    $('.question-3 .next-prev-btn p:last-child').click( function(){
       $(this).parent().parent().parent().parent().hide(); 
       $(this).parent().parent().parent().parent().next().show();
    });
    $('.question-4 .next-prev-btn p:first-child').click( function(){
       $(this).parent().parent().parent().parent().hide(); 
       $(this).parent().parent().parent().parent().prev().show();
    });
    $('.question-4 .next-prev-btn p:last-child').click( function(){
       $(this).parent().parent().parent().parent().hide(); 
       $(this).parent().parent().parent().parent().next().show();
    });
    $('.question-5 .next-prev-btn p:first-child').click( function(){
       $(this).parent().parent().parent().parent().hide(); 
       $(this).parent().parent().parent().parent().prev().show();
    });
    $('.question-5 .next-prev-btn p:last-child').click( function(){
       $(this).parent().parent().parent().parent().hide(); 
       $(this).parent().parent().parent().parent().next().hide();
       $('.score_section').show();
       var data = $('#fagerst_test').serializeArray();
        let total = 0;

        for (let i = 0; i < data.length; i++) {
          total += parseInt(data[i].value, 10);
        }
        
        var data = '<h4 class="">Your Score: ' + total + '</h4>';
        $("#your_score").html(data);
    });
    */
    // $('.cost_options').click( function(){
    //   var id = $(this).attr('id');
    //   $('.cost_question').hide();
    //   $('.'+id).show();
    // });
    $('.cost_options').click( function(){
       let id = $(this).attr('id');
       
       $(this).parent().find('.cost_options').removeClass('active');
       $('.score_section').hide();
       $(this).addClass('active');
       
       $('body').find('.cost_question').fadeOut();
       $('.'+id).fadeIn();

       if (id == "fagersttest" && jQuery('#fagerström-test-result .your_score').has('h2').length) {
           $('#fagerström-test-result').fadeIn();
        }
        if (id == "e-cigarette" && jQuery('#e-cigarette-test-result .your_score').has('h2').length) {
           $('#e-cigarette-test-result').fadeIn();
        }
    });
    $('#cigarettes_form').submit( function(event){
        event.preventDefault();
        var data = $(this).serializeArray();
        var price_per_cigrate = data[1].value / data[2].value;
        var perday = data[0].value * price_per_cigrate;
        var perweek = data[0].value * price_per_cigrate * 7;
        var permonth = data[0].value * price_per_cigrate * 30;
        var peryear = data[0].value * price_per_cigrate * 365;
        var lifetime = data[0].value * price_per_cigrate * 365 * data[3].value;
        
        var result = "<h4>Your Results</h4><p>Here’s how much your smoking, vaping or tobacco use is really costing you. This is just the money – not the time, energy or peace of mind it takes away from you.</p> <p>$"+perday.toFixed(2)+" per day <br> $"+perweek.toFixed(2)+" per week <br> $"+permonth.toFixed(2)+" per month <br> $"+peryear.toFixed(2)+" per year <br> $"+lifetime.toFixed(2)+" over your lifetime of use</p>"
        
        $(this).html(result);
    });
    $('#vaping_form').submit( function(event){
        event.preventDefault();
        var data = $(this).serializeArray();
        var pods_per_day = data[1].value / 7;
        var cost_per_device = Math.round(data[0].value) / Math.round(data[2].value * 365);

        var perday = Math.round(pods_per_day) + cost_per_device;
        var perweek = Math.round (pods_per_day * 7) + (cost_per_device *7);
        var permonth = Math.round (pods_per_day * 30) + (cost_per_device * 30);
        var peryear = Math.round (pods_per_day * 365) + (cost_per_device * 365);
        var lifetime = Math.round (data[2].value * pods_per_day * 365) + Math.round(data[0].value);
        
        var result = "<h4>Your Results</h4> <p>Here’s how much your smoking, vaping or tobacco use is really costing you. This is just the money – not the time, energy or peace of mind it takes away from you.</p> <p>$"+perday.toFixed(2)+" per day <br> $"+perweek.toFixed(2)+" per week <br> $"+permonth.toFixed(2)+" per month <br> $"+peryear.toFixed(2)+" per year <br> $"+lifetime.toFixed(2)+" over your lifetime of use</p>"
        
        $(this).html(result);
    });
    
    $('#chewing_form').submit( function(event){
        event.preventDefault();
        var data = $(this).serializeArray();
        var can_per_day = data[0].value / 7;
        var perday = data[1].value * can_per_day;
        var perweek = data[1].value * can_per_day * 7;
        var permonth = data[1].value * can_per_day * 30;
        var peryear = data[1].value * can_per_day * 365;
        var lifetime = data[1].value * can_per_day * 365 * data[2].value;
        
        var result = "<h4>Your Results</h4> <p>Here’s how much your smoking, vaping or tobacco use is really costing you. This is just the money – not the time, energy or peace of mind it takes away from you.</p> <p>$"+perday.toFixed(2)+" per day <br> $"+perweek.toFixed(2)+" per week <br> $"+permonth.toFixed(2)+" per month <br> $"+peryear.toFixed(2)+" per year <br> $"+lifetime.toFixed(2)+" over your lifetime of use</p>"
        
        $(this).html(result);
    });
})

/**
// Mobile menu functionality
const mobileMenuButton = document.getElementById('mobile-menu-button');
const closeMobileMenuButton = document.getElementById('close-mobile-menu');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuContent = document.getElementById('mobile-menu-content');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

function openMobileMenu() {
    if (!mobileMenu || !mobileMenuContent) return;
    mobileMenu.classList.remove('hidden');
    setTimeout(() => {
        mobileMenuContent.classList.remove('translate-x-full');
    }, 10);
}

function closeMobileMenu() {
    if (!mobileMenu || !mobileMenuContent) return;
    mobileMenuContent.classList.add('translate-x-full');
    setTimeout(() => {
        mobileMenu.classList.add('hidden');
    }, 300);
}

// Add event listeners only if elements exist
if (mobileMenuButton) mobileMenuButton.addEventListener('click', openMobileMenu);
if (closeMobileMenuButton) closeMobileMenuButton.addEventListener('click', closeMobileMenu);
if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

// Mobile submenu toggle
function toggleMobileSubmenu(button) {
    if (!button) return;
    const submenu = button.nextElementSibling;
    const arrow = button.querySelector('svg');
    
    if (!submenu || !arrow) return;
    
    if (submenu.classList.contains('hidden')) {
        submenu.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
    } else {
        submenu.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
    }
}

// Desktop menu hover functionality
const desktopMenuItems = document.querySelectorAll('.menu-wrapper li.group');

desktopMenuItems.forEach(menuItem => {
    if (!menuItem) return;
    const submenu = menuItem.querySelector('div[class*="absolute"]');
    const arrow = menuItem.querySelector('svg');

    if (!submenu || !arrow) return;

    menuItem.addEventListener('mouseenter', () => {
        submenu.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
    });

    menuItem.addEventListener('mouseleave', () => {
        submenu.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
    });
});

// Close menus when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-wrapper')) {
        const submenus = document.querySelectorAll('.menu-wrapper div[class*="absolute"]');
        const arrows = document.querySelectorAll('.menu-wrapper svg');
        
        submenus.forEach(submenu => submenu.classList.add('hidden'));
        arrows.forEach(arrow => arrow.style.transform = 'rotate(0deg)');
    }
});

// Desktop menu functionality
const desktopMenuButtons = document.querySelectorAll('.menu-wrapper button');
let activeMenu = null;

function closeAllMenus() {
    desktopMenuButtons.forEach(button => {
        const submenu = button.nextElementSibling;
        const arrow = button.querySelector('svg');
        submenu.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
    });
    activeMenu = null;
}

desktopMenuButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const submenu = button.nextElementSibling;
        const arrow = button.querySelector('svg');

        if (activeMenu === submenu) {
            // Close current menu
            submenu.classList.add('hidden');
            arrow.style.transform = 'rotate(0deg)';
            activeMenu = null;
        } else {
            // Close other menus
            closeAllMenus();
            // Open clicked menu
            submenu.classList.remove('hidden');
            arrow.style.transform = 'rotate(180deg)';
            activeMenu = submenu;
        }
        e.stopPropagation();
    });
});

// Close menus when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-wrapper')) {
        closeAllMenus();
    }
});
 */
jQuery("#edit-phone-number").on("input", function(e){
    var input = jQuery(this).val().replace(/\D/g, ""); // Remove all non-digit characters

    // Limit to 10 digits max
    input = input.substring(0, 10);

    var formatted = "";

    if (input.length > 0) {
      formatted += "(" + input.substring(0, 3);
    }
    if (input.length >= 4) {
      formatted += ") " + input.substring(3, 6);
    }
    if (input.length >= 7) {
      formatted += "-" + input.substring(6, 10);
    }

    jQuery(this).val(formatted);
  });
  
  jQuery("#edit-text-phone").on("input", function(e){
    var input = jQuery(this).val().replace(/\D/g, ""); // Remove all non-digit characters

    // Limit to 10 digits max
    input = input.substring(0, 10);

    var formatted = "";

    if (input.length > 0) {
      formatted += "(" + input.substring(0, 3);
    }
    if (input.length >= 4) {
      formatted += ") " + input.substring(3, 6);
    }
    if (input.length >= 7) {
      formatted += "-" + input.substring(6, 10);
    }

    jQuery(this).val(formatted);
  });
  
 jQuery("#edit-email").on("input", function(){
    var email = jQuery(this).val();
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // Test if the email matches the pattern
    if (emailPattern.test(email)) {
      jQuery(this).css('border', '1px solid #ccc');
     // $(this).css('border', '2px solid green'); // Success: valid email
      jQuery(this).next('.error-message').remove(); // Remove any previous error message
    } else {
      jQuery(this).css('border', '2px solid red'); // Error: invalid email
      if (!jQuery(this).next('.error-message').length) {
        jQuery(this).after('<span class="error-message" style="color: red;">Invalid email format</span>');
      }
    }
  });
  

function setSubmenuTop() {
  const header = document.querySelector('header');
  const subMenus = document.querySelectorAll('li.primary-nav__menu-item--has-children > .sub-menu');
 
  if (!header || !subMenus.length) return;
 
  // Get header height and subtract 30px
  const headerHeight = header.getBoundingClientRect().height - 30;
 
  // Apply to each submenu
  subMenus.forEach(menu => {
    menu.style.top = `${headerHeight}px`;
  });
}
 
// Run on load and resize
window.addEventListener('load', setSubmenuTop);
window.addEventListener('resize', setSubmenuTop);