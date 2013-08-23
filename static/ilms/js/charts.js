var chartIDAry = Array();
var chartWidthAry = Array();
var chartHeightAry = Array();	
var chartSrcAry = Array();
var chartAryIdx = 0;

function setChartList(cid, ww, hh, src)
{	    
    chartIDAry[chartAryIdx] = cid;
    chartWidthAry[chartAryIdx] = ww;	
    chartHeightAry[chartAryIdx] = hh;	
    chartSrcAry[chartAryIdx++] = src;		
}

function showChartList()
{
    var cid;
    var ww;
    var hh;
    var src;
    
    for (i=0; i<chartAryIdx; i++)
    {
        cid = chartIDAry[i];
        ww = chartWidthAry[i];
        hh = chartHeightAry[i];
        src = chartSrcAry[i];       
        
		AC_FL_RunContent
        (
            'ctrl', '_chart' + cid, 
			'codebase', 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,45,2',
            'width', ww,
            'height', hh,
			'scale', 'noscale',
			'salign', 'TL',
			'wmode', 'opaque',
            'movie', src,
            'FlashVars', '/course/inc/index/statistic/day_view.php?1328498406', 
            'src', src,
			'id', 'my_chart',
			'name', 'my_chart',
			'menu', 'true',
			'allowFullScreen', 'true',
			'allowScriptAccess','sameDomain',
			'quality', 'high',
			'align', 'middle',
			'pluginspage', 'http://www.macromedia.com/go/getflashplayer',
			'play', 'true',
			'devicefont', 'false'
		); 
    }
}    