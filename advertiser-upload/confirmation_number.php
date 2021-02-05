<?php
$haveYouAdvertisedBefore = null;
$isRerunCurrentAd = null;

function check_submit_error_confirmation_number($field_data_array) {
    global $haveYouAdvertisedBefore;
    global $isRerunCurrentAd;

    $confirmationNumber = $field_data_array[0]['value'];

    if(strlen($confirmationNumber) != 9)
        return true;

    if(!preg_match('/[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]/', $confirmationNumber))
        return true;

    $haveYouAdvertisedBefore = $field_data_array[3]['value'];

    if(count($field_data_array) > 4)
        $isRerunCurrentAd = $field_data_array[4]['value'];

    return false;
}

function set_response_confirmation_number($response, $form_id){
    global $haveYouAdvertisedBefore;
    global $isRerunCurrentAd;

    if($response['success'] == true) {
        if($haveYouAdvertisedBefore == 'no')
            $response['url'] = home_url('/press-or-asset/') ;
        else {
            if($isRerunCurrentAd == 'yes')
                $response['url'] = home_url('/confirmation-thank-you/');
            else
                $response['url'] = home_url('/new-ad-or-make-change/');
        }
    }
    else {
        $response['errors'] = false;
        $response['message'] = 'Confirmation Number is formatted incorrectly. Did you include a dash? Please check your email for reference.';
    }

    return $response;
}

function handle_submit_confirmation_number( $form_id) {

}
