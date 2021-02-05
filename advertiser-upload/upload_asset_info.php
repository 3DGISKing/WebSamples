<?php

function check_submit_error_upload_asset_info($field_data_array)
{
    global $last_error_message;

    $businessName = $_REQUEST['name-1'];
    $phone = $_REQUEST['phone-1'];
    $address = $_REQUEST['address-1-street_address'];
    $website = $_REQUEST['url-1'];
    $emailAddress = $_REQUEST['email-1'];
    $adCopy = $_REQUEST['textarea-1'];
    $callToAction = $_REQUEST['text-1'];
    $notesInstructions = $_REQUEST['textarea-2'];
    $useSameMaterial = $_REQUEST['radio-1'];

    $conformationNumber = getConfirmationNumber();

    if($conformationNumber == '') {
        $last_error_message = 'invalid confirmation number: ' . $conformationNumber;
        return true;
    }

    global $rootFolderId;

    $childFolderId = getChildFolderId($rootFolderId, $conformationNumber);

    if($childFolderId == null)
        $childFolderId = createFolder($conformationNumber, $rootFolderId);

    createAssetInfoDoc($childFolderId, $businessName, $phone, $address, $website, $emailAddress, $adCopy, $callToAction, $notesInstructions,$useSameMaterial);

    return false;
}

function set_response_upload_asset_info($response, $form_id){
    global $last_error_message;

    if($response['success'] == true) {
        $response['url'] =  home_url('/confirmation-thank-you/') ;
    }
    else {
        if($response['message' == ''] && $last_error_message != '')
            $response['message'] = $last_error_message;

        $response['errors'] = false;
    }

    return $response;
}
