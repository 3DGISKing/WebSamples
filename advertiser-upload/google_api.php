<?php

$googleClient = null;
$googleDriveService = null;
$googleDocsService = null;

function getGoogleClient()
{
    global $googleClient;
    global $last_error_message;

    if($googleClient)
        return $googleClient;

    $client = new Google_Client();
    $client->setApplicationName('Advertised Upload');
    $client->setScopes([Google_Service_Drive::DRIVE, Google_Service_Docs::DRIVE]);

    $credential_json = __DIR__ . '/tyler_other_client1.json';

    try {
        $client->setAuthConfig($credential_json);
    } catch (Google_Exception $e) {
        $last_error_message = 'failed to find Google API credential!';
        return null;
    }

    $client->setAccessType('offline');
    $client->setPrompt('select_account consent');

    // Load previously authorized token from a file, if it exists.
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.

    /** @var boolean $is_local */

    $tokenPath =  __DIR__ . '/token.json';

    if (file_exists($tokenPath)) {
        $accessToken = json_decode(file_get_contents($tokenPath), true);
        $client->setAccessToken($accessToken);
    }

    // If there is no previous token or it's expired.
    if ($client->isAccessTokenExpired()) {
        // Refresh the token if possible, else fetch a new one.
        if ($client->getRefreshToken()) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
        } else {
            $last_error_message = 'Google API access token expired!';
            return null;
        }
    }

    $googleClient = $client;

    return $client;
}

function getGoogleDriveService() {
    global $googleDriveService;

    if($googleDriveService)
        return $googleDriveService;

    $client = getGoogleClient();

    if($client == null)
        return null;

    $googleDriveService = new Google_Service_Drive($client);

    return $googleDriveService;
}

function getGoogleDocsService() {
    global $googleDocsService;

    if($googleDocsService)
        return $googleDocsService;

    $client = getGoogleClient();

    if($client == null)
        return null;

    $googleDocsService = new Google_Service_Docs($client);

    return $googleDocsService;
}


function upload_file($folderId, $uploadedFileMeta) {
    $googleDriveService = getGoogleDriveService();

    if($googleDriveService == null)
        return false;

    $file_path = $uploadedFileMeta['file_path'];

    $fileMetadata = new Google_Service_Drive_DriveFile(
        array(
            'name' => basename($file_path)
        )
    );

    $fileMetadata->setParents(array($folderId));

    $fileContent = file_get_contents($file_path);

    // why because 'can not modify header information'
    // so I can not redirect to another page

    $file = $googleDriveService->files->create($fileMetadata, array(
        'data' => $fileContent,
        'uploadType' => 'multipart',
        'supportsAllDrives' => true
    ));

    return true;
}

function createFolder($folderName, $parentFolderId) {
    $googleDriveService = getGoogleDriveService();

    $fileMetadata = new Google_Service_Drive_DriveFile(
        array(
            'name' => $folderName,
            'mimeType' => 'application/vnd.google-apps.folder'
        )
    );

    $fileMetadata->setParents(array($parentFolderId));

    $folder = $googleDriveService->files->create($fileMetadata, array(
        'uploadType' => 'multipart',
        'supportsAllDrives' => true
    ));

    return $folder->id;
}

function createAssetInfoDoc($targetFolderId, $businessName, $phone, $streetAddress, $website, $email, $ad, $callToAction, $notesInstructions, $useSameMaterial) {
    $googleDocsService = getGoogleDocsService();
    $googleDriveService = getGoogleDriveService();;

    $newFile = new Google_Service_Drive_DriveFile(array(
        'name' => 'assetInfo'
    ));

    $newFile->setParents(array($targetFolderId));

    // mandatory template file
    // My Drive -> 0data ->template

    $templateFileId = '1neByGQGxx-Cr6QKkdAGku8al8T8yxZRW0g12MS72UKU';

    $templateDocument = $googleDocsService->documents->get($templateFileId);

    // copy template file to target folder
    $driveResponse = $googleDriveService->files->copy($templateFileId, $newFile, array(
        'supportsAllDrives' => true
    ));

    $newFileId = $driveResponse->id;

    $newDocument = $googleDocsService->documents->get($newFileId);

    // mandatory field index

    $businessNameFieldValueEndIndex = 17;
    $phoneFieldValueEndIndex = 26;
    $addressFieldValueEndIndex = 44;
    $websiteFieldValueEndIndex = 55;
    $emailFieldValueEndIndex = 65;
    $adCopyFieldValueEndIndex = 76;
    $callToActionValueEndIndex = 94; // 20
    $notesInstructionFieldValueEndIndex = 116; //23
    $useSameMaterialFieldValueEndIndex =  154; //26

    $requests = array();

    if(!empty($useSameMaterial)) {
        array_push($requests, new Google_Service_Docs_Request(array(
            'insertText' => array(
                'text' => $useSameMaterial,
                'location' => array(
                    'index' =>  $useSameMaterialFieldValueEndIndex - 1
                ),
            )
        )));
    }

    if(!empty($notesInstructions)) {
        array_push($requests, new Google_Service_Docs_Request(array(
            'insertText' => array(
                'text' => $notesInstructions,
                'location' => array(
                    'index' =>  $notesInstructionFieldValueEndIndex - 1
                ),
            )
        )));
    }

    if(!empty($callToAction)) {
        array_push($requests, new Google_Service_Docs_Request(array(
            'insertText' => array(
                'text' => $callToAction,
                'location' => array(
                    'index' =>  $callToActionValueEndIndex - 1
                ),
            )
        )));
    }

    if(!empty($ad)) {
        array_push($requests, new Google_Service_Docs_Request(array(
            'insertText' => array(
                'text' => $ad,
                'location' => array(
                    'index' =>  $adCopyFieldValueEndIndex - 1
                ),
            )
        )));
    }

    if(!empty($email)) {
        array_push($requests, new Google_Service_Docs_Request(array(
            'insertText' => array(
                'text' => $email,
                'location' => array(
                    'index' =>  $emailFieldValueEndIndex - 1
                ),
            )
        )));
    }

    if(!empty($website)) {
        array_push($requests, new Google_Service_Docs_Request(array(
            'insertText' => array(
                'text' => $website,
                'location' => array(
                    'index' =>  $websiteFieldValueEndIndex - 1
                ),
            )
        )));
    }

    if(!empty($streetAddress)) {
        array_push($requests, new Google_Service_Docs_Request(array(
            'insertText' => array(
                'text' => $streetAddress,
                'location' => array(
                    'index' =>  $addressFieldValueEndIndex - 1
                ),
            )
        )));
    }

    if(!empty($phone)) {
        array_push($requests, new Google_Service_Docs_Request(array(
            'insertText' => array(
                'text' => $phone,
                'location' => array(
                    'index' =>  $phoneFieldValueEndIndex - 1
                ),
            )
        )));
    }

    array_push($requests, new Google_Service_Docs_Request(array(
        'insertText' => array(
            'text' => $businessName,
            'location' => array(
                'index' =>  $businessNameFieldValueEndIndex - 1
            ),
        )
    )));

    $batchUpdateRequest = new Google_Service_Docs_BatchUpdateDocumentRequest(array(
        'requests' => $requests
    ));

    try {
        $response = $googleDocsService->documents->batchUpdate($newFileId, $batchUpdateRequest);
    } catch (Google_Exception $e) {
        echo 'e';
    }
}

function createMakeChangeDoc($targetFolderId, $change) {
    $googleDocsService = getGoogleDocsService();
    $googleDriveService = getGoogleDriveService();;

    $newFile = new Google_Service_Drive_DriveFile(array(
        'name' => 'makeChange'
    ));

    $newFile->setParents(array($targetFolderId));

    // mandatory template file
    // My Drive -> 0data ->make-change-template

    $templateFileId = '1xc8aUlA7O4iiJ906EzXuDfDqprROCiH56fbWYefGWLA';

    $templateDocument = $googleDocsService->documents->get($templateFileId);

    // copy template file to target folder
    $driveResponse = $googleDriveService->files->copy($templateFileId, $newFile, array(
        'supportsAllDrives' => true
    ));

    $newFileId = $driveResponse->id;

    $newDocument = $googleDocsService->documents->get($newFileId);

    // mandatory field index

    $changeFieldValueEndIndex = 2;

    $requests = array();

    array_push($requests, new Google_Service_Docs_Request(array(
        'insertText' => array(
            'text' => $change,
            'location' => array(
                'index' =>  $changeFieldValueEndIndex - 1
            ),
        )
    )));

    $batchUpdateRequest = new Google_Service_Docs_BatchUpdateDocumentRequest(array(
        'requests' => $requests
    ));

    $response = $googleDocsService->documents->batchUpdate($newFileId, $batchUpdateRequest);
}

function getChildFolderId($parentFolderId, $childFolderName) {
    $googleDriveService = getGoogleDriveService();

    $optParams = array(
        'corpora' => 'allDrives',
        'includeItemsFromAllDrives' => true,
        'supportsAllDrives' => true,
        'pageSize' => 10,
        'fields' => "nextPageToken, files(contentHints/thumbnail,fileExtension,iconLink,id,name,size,thumbnailLink,webContentLink,webViewLink,mimeType,parents)",
        'q' =>  "mimeType = 'application/vnd.google-apps.folder' " . " and " . "name = '" . $childFolderName.  "'" . " and " .  "'" . $parentFolderId . "' in parents"
    );

    ob_start();
    $results = $googleDriveService->files->listFiles($optParams);
    ob_clean();

    if ($results->count() == 0)
        return null;

    $files = $results->getFiles();

    $file = $files[0];

    return $file['id'];
}