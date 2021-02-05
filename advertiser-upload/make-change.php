<?php

function check_submit_error_make_change($field_data_array) {
    global $last_error_message;

    $conformationNumber = getConfirmationNumber();

    if($conformationNumber == '') {
        $last_error_message = 'invalid confirmation number: ' . $conformationNumber;
        return true;
    }

    global $rootFolderId;

    ob_start();

    $childFolderId = getChildFolderId($rootFolderId, $conformationNumber);

    if($childFolderId == null)
        $childFolderId = createFolder($conformationNumber, $rootFolderId);

    $change = $field_data_array[0]['value'];

    createMakeChangeDoc($childFolderId, $change);

    for ($i = 0; $i < count($field_data_array); $i++) {
        $field_name = $field_data_array[$i]['name'];

        if(!isset($_FILS[$field_name]))
            continue;

        $file_size = $_FILES[$field_name]['size'];

        if($file_size == 0)
            continue;

        if($file_size > MAX_UPLOAD_ASSET_FILE_SIZE ) {
            $last_error_message = 'upload size exceeds max limit!';

            delete_uploaded_file($field_data_array);
            return true;
        }
    }

    for ($i = 0; $i < count($field_data_array); $i++) {
        $value = $field_data_array[$i]['value'];

        if(!isset($value['file']))
            continue;

        $file = $value['file'];

        if($file['success']) {
            if (!upload_file($childFolderId, $file))
                return true;
        }
    }

    delete_uploaded_file($field_data_array);

    ob_clean();
    return false;
}

function set_response_make_change($response, $form_id){
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