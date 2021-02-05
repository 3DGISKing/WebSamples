<?php

define("MAX_UPLOAD_PRESS_FILE_SIZE", 10 * 1024 * 1024 * 1024);

function check_submit_error_upload_press($field_data_array) {
    global $last_error_message;

    for ($i = 0; $i < count($field_data_array); $i++) {
        $field_name = $field_data_array[$i]['name'];

        $file_size = $_FILES[$field_name]['size'];

        if($file_size > MAX_UPLOAD_PRESS_FILE_SIZE ) {
            $last_error_message = 'upload size exceeds max limit!';

            delete_uploaded_file($field_data_array);
            return true;
        }
    }

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

    for ($i = 0; $i < count($field_data_array); $i++) {
        $value = $field_data_array[$i]['value'];
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

function set_response_upload_press($response, $form_id){
    if($response['success'] == true) {
        $response['url'] =  home_url('/confirmation-thank-you/') ;
    }
    else {
        $response['errors'] = false;
    }

    return $response;
}
