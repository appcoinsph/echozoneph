<?php

    include("variables.php");

    $password = trim($_SERVER['QUERY_STRING']);

    if($password == ADMIN_PASSWORD) {
        $new = uniqid('key',TRUE);

        if(!is_dir('keys')) {
            mkdir('keys');
            $file = fopen('keys/.htaccess','w');
            fwrite($file,"Order allow,deny\nDeny from all");
            fclose($file);
        }

        $file = fopen('keys/keys','a');
        fwrite($file,"{$new}\n");
        fclose($file);
?>

<html>
    <head>
        <title>Page created</title>
        <style>
            nl { 
                font-family: monospace 
            }
        </style>
    </head>
    <body>
        <h1>Page key created</h1>
        Your new single-use page link:<br>
        <nl>
        <?php 
            echo "http://" . $_SERVER['HTTP_HOST'] . DOWNLOAD_PATH . "?" . $new; 
        ?></nl>
    </body>
</html>
