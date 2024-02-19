<?php
if (!isset($_SESSION)) {
    $session = session_start();
} 
if ($session && !isset($_SESSION['login_time'])) {
    if ($session == 1) {
        $_SESSION['login_time']=time();
        echo "Login :".$_SESSION['login_time'];
        echo "<br>";
        $_SESSION['idle_time']=$_SESSION['login_time']+20;
        echo "Session Idle :".$_SESSION['idle_time'];
        echo "<br>";
    } else{
        $_SESSION['login_time']="";
    }
} else {
    if (time()>$_SESSION['idle_time']){
        echo "Session Idle :".$_SESSION['idle_time'];
        echo "<br>";
        echo "Current :".time();
        echo "<br>";
        echo "Session Time Out";
        session_destroy();
        session_unset();
    } else {
        echo "Logged In<br>";
    }
}
?>
