<?php

function set_response_press_or_asset($response, $form_id){
    if($response['success'] == true) {
        $entries = Forminator_API::get_entries( $form_id);

        $entry = $entries[0];

        $isNewOrRenewal = $entry->get_meta('radio-1');

        if($isNewOrRenewal == 'press-ready-art-upload')
            $response['url'] =  home_url('/upload-press/') ;
        else
            $response['url'] =  home_url('/upload-assets/');
    }
    else {
        $response['errors'] = false;
    }

    return $response;
}

function handle_submit_press_or_asset( $form_id) {

}
