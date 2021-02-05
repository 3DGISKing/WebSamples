<?php
/**

 * @package advertiser-upload
 */
/*
Plugin Name: advertiser-upload
Plugin URI: https://akismet.com/
Description: Campus Advertiser Uploader
Version: 1.0.0
Author: Zhefeng Jin
Author URI: https://www.linkedin.com/in/zhefeng-jin-4ab9b3145/
License: GPLv2 or later
Text Domain: akismet
*/

if(!(strpos($_SERVER['SERVER_NAME'], 'localhost') === false)){
    $is_local = true;
}
else
    $is_local = false;

$conformationNumber = '';

// VG -Production -> Art from Advertisers -> _Advertiser_Form_Uploads
$rootFolderId = '13GL_WntLwzt8UOYt309JZhmd48nWcV2t';

require __DIR__ . '/vendor/autoload.php';

if($is_local == true)
    require_once __DIR__ . '/form_ids.php';
else
    require_once __DIR__ . '/remote_form_ids.php';

require __DIR__ . '/google_api.php';
require __DIR__ . '/confirmation_number.php';
require __DIR__ . '/press-or-asset.php';
require __DIR__ . '/upload_asset.php';
require __DIR__ . '/upload_asset_info.php';
require __DIR__ . '/upload-press.php';
require __DIR__ . '/make-change.php';
require __DIR__ . '/new-ad-or-make-change.php';

$last_error_message = '';

register_activation_hook( __FILE__, 'advertiser_upload_install' );

function advertiser_upload_install() {

}

register_deactivation_hook( __FILE__, 'advertiser_upload_uninstall');

function advertiser_upload_uninstall() {

}

// short code sample
// [forminator_form id="7"]

add_filter('forminator_custom_form_handle_form_user_can_submit', 'check_can_submit', 10, 2);

function check_can_submit($can_submit, $form_id) {
    // for now we always return true;
    return true;
}

add_filter('forminator_custom_form_submit_errors', 'check_submit_error', 10, 3);

function check_submit_error($submit_errors, $form_id, $field_data_array) {
    global $confirmationNumberFormId;
    global $uploadAssetsFormId;
    global $uploadAssetInfoFormId;
    global $pressOrAssetFormId;
    global $uploadPressFormId;
    global $makeChangeFormId;
    global $newAdOrMakeChangeFormId;

    if($form_id == $confirmationNumberFormId)
        return check_submit_error_confirmation_number($field_data_array);
    else if ($form_id == $makeChangeFormId)
        return check_submit_error_make_change($field_data_array);
    else if ($form_id == $pressOrAssetFormId)
        return false;
    else if ($form_id == $uploadPressFormId)
        return check_submit_error_upload_press($field_data_array);
    else if($form_id == $uploadAssetsFormId)
        return check_submit_error_upload_assets($field_data_array);
    else if($form_id == $uploadAssetInfoFormId)
        return check_submit_error_upload_asset_info($field_data_array);
    else if ($form_id == $newAdOrMakeChangeFormId)
        return check_response_new_ad_or_make_change($field_data_array);
    else
        return true;
}

add_filter('forminator_custom_form_submit_response', 'set_response', 10, 2);

function set_response($response, $form_id) {
    global $confirmationNumberFormId;
    global $pressOrAssetFormId;
    global $uploadPressFormId;
    global $uploadAssetsFormId;
    global $uploadAssetInfoFormId;
    global $makeChangeFormId;
    global $newAdOrMakeChangeFormId;

    if($form_id == $confirmationNumberFormId)
        return set_response_confirmation_number($response, $form_id);
    else if ($form_id == $makeChangeFormId)
        return set_response_make_change($response, $form_id);
    else if($form_id == $pressOrAssetFormId)
        return set_response_press_or_asset($response, $form_id);
    else if($form_id == $uploadPressFormId)
        return set_response_upload_press($response, $form_id);
    else if($form_id == $uploadAssetsFormId)
        return set_response_upload_assets($response, $form_id);
    else if($form_id == $uploadAssetInfoFormId)
        return set_response_upload_asset_info($response, $form_id);
    else if($form_id == $newAdOrMakeChangeFormId) {
        return set_response_new_ad_or_make_change($response, $form_id);
    }
    else
        return $response;
}

add_action( 'forminator_custom_form_after_handle_submit', 'handle_submit' , 15, 2);

function handle_submit( $form_id, $response) {
    $success =  $response['success'];

    if($success != true)
        return;

    global $confirmationNumberFormId;
    global $uploadAssetsFormId;
    global $uploadAssetInfoFormId;
    global $pressOrAssetFormId;
    global $uploadPressFormId;
    global $makeChangeFormId;
    global $newAdOrMakeChangeFormId;

    if($form_id == $confirmationNumberFormId)
        handle_submit_confirmation_number($form_id);
    else if($form_id == $makeChangeFormId) {

    }
    else if ($form_id == $pressOrAssetFormId) {

    }
    else if($form_id == $uploadAssetsFormId) {

    }
    else if($form_id == $uploadAssetInfoFormId) {

    }
    else if($form_id == $uploadPressFormId) {

    }
    else if($form_id == $newAdOrMakeChangeFormId) {

    }
    else
        wp_die('can not find form : ' . $form_id);
}

add_action( 'forminator_custom_form_after_save_entry', 'after_save_entry' );

function after_save_entry( $form_id) {

}

add_action( 'forminator:form:submit:success', function() {

});

function getConfirmationNumber() {
    global $confirmationNumberFormId;

    $entries = Forminator_API::get_entries( $confirmationNumberFormId);

    $entry = $entries[0];

    return $entry->get_meta('text-1');
}

add_action('forminator_before_form_render', function($id) {

});