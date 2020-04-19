<html lang="ar">

<head>
    <meta charset="utf-8">
    <title>Semantic Arabic Tagging</title>
    <link rel="stylesheet" type="text/css" href="css/style.css" />
    <script src="js/main-page-js.js"></script>
</head>

<body>
    <div>
        <?php include "mynav.php"; ?>
    </div>
    <div id=main>
        <h2> Main page </h2>
        <p> one long para </p>
        <table id="poem">
            <tr>
                <td>
                    <span id="term11" onmouseover=createDIV(this.id) onclick=termclicked(this.id) onmouseout=resethover(this.id)> لَوَتْ </span>
                    <span id="term12" onmouseover=createDIV(this.id) onclick=termclicked(this.id) onmouseout=resethover(this.id)> بِالسَّلامِ </span>
                    <span id="term13" onmouseover=createDIV(this.id) onclick=termclicked(this.id) onmouseout=resethover(this.id)> بَنَانًا </span>
                    <span id="term14" onmouseover=createDIV(this.id) onclick=termclicked(this.id) onmouseout=resethover(this.id)> خَضيبا </span>
                </td>
                <td>
                    <span id="term21" onmouseover=createDIV(this.id) onclick=termclicked(this.id) onmouseout=resethover(this.id)> وَلَحْظًا </span>
                    <span id="term22" onmouseover=createDIV(this.id) onclick=termclicked(this.id) onmouseout=resethover(this.id)> يشوقُ </span>
                    <span id="term23" onmouseover=createDIV(this.id) onclick=termclicked(this.id) onmouseout=resethover(this.id)> الفؤادَ </span>
                    <span id="term24" onmouseover=createDIV(this.id) onclick=termclicked(this.id) onmouseout=resethover(this.id)> الطَّرُوبا </span>
                </td>
            </tr>
            <tr>
                <td>وَزَارَتْ على عَجَلٍ فاكْتَسى</td>
                <td>لِزَوْرَتِها ((أَبْرَقُ الحَزْنِ)) طيبا</td>
            </tr>
            <tr>
                <td>فكانَ العبيرُ بها وَاشِيًا</td>
                <td>وَجَرْسُ الحُلِيِّ عليها رَقيبا</td>
            </tr>
            <tr>
                <td>وَلَمْ أَنْسَ لَيْلَتَنَا في العِنَا</td>
                <td>قِ لَفَّ الصَّبَا بِقَضيبٍ قَضيبا </td>
            </tr>
        </table>
        <div id="tagsdiv"></div>
        <div id="difdiv"></div>
    </div>
</body>

</html>