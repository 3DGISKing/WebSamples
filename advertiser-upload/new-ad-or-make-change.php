<?php
$isNewAdOrMakeChange = null;

function check_response_new_ad_or_make_change($field_data_array) {
    global $isNewAdOrMakeChange;

    $isNewAdOrMakeChange = $field_data_array[0]['value'];

    return false;
}

function set_response_new_ad_or_make_change($response, $form_id){
    global $isNewAdOrMakeChange;

    if($response['success'] == true) {
        if($isNewAdOrMakeChange == 'make-changes-to-my-existing-ad')
            $response['url'] =  home_url('/make-change/') ;
        else
            $response['url'] =  home_url('/press-or-asset/');
    }
    else {
        $response['errors'] = false;
    }

    return $response;
}

function handle_submit_new_ad_or_make_change( $form_id) {

}