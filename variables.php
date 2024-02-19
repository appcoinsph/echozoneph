<?

    define('PROTECTED_DOWNLOAD','download.php');

    define('DOWNLOAD_PATH','/.work/page.php');

    define('SUGGESTED_FILENAME','download-doc.php');

    define('ADMIN_PASSWORD','1234');

    define('EXPIRATION_DATE', '+36 hours');

    header("Cache-Control: no-cache, must-revalidate");
    header("Expires: ".date('U', strtotime(EXPIRATION_DATE)));

?>
