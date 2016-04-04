<?php

require_once($_SERVER['DOCUMENT_ROOT'] . '/Include/header.php');   

$content = "
    <canvas id='scene' oncontextmenu='return true'>
        This text is displayed if your browser does not support HTML5 Canvas.
    </canvas>
";
echo $content;

require_once($_SERVER['DOCUMENT_ROOT'] . '/Include/footer.php');   

?>