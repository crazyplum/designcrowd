	function showEvent(date)
	{
		d = date.split("-");
		$load("course/inc/index/calendar/findevent.php", _param={courseID:"0", y:d[0], m:d[1], d:d[2]}, wbox);
	}

	function wbox(obj)
	{
		var evts = obj.event.evts;
		var _html = "";
		
		_html += "<div>";
			var d = evts[0].start.split("-");
			_html += "<span class=em>" + d[1] + "-" + d[2] + " " + evts[0].msgEvent + "</span>";
		_html += "</div>";
		_html += "<div>";
			for(var i=0; i<evts.length; i++)
			{
				var d = "";

				var start = evts[i].start.split("-");
				var end   = evts[i].end.split("-");

				if(evts[i].start != evts[i].end)
				{
					if(start[0] != end[0]) d = start[0] + "/" + start[1] + "/" + start[2] + "~" + end[0] + "/" + end[1] + "/" + end[2];
					else 				   d = start[1] + "/" + start[2] + "~" + end[1] + "/" + end[2];
				}
				else d = start[1] + "/" + start[2];
				
				var _url = "course/inc/index/calendar/showevent.php?id=" + evts[i].id;
				
				_html += "<br><div class=hidden style=width:420px>";
					_html += "<span class=normal>";
						if(evts[i].note) _html += "<a href='javascript:$showModal(\"LMS\",\"" + _url + "\", 750, 500, hide)'>";
							_html += evts[i].title;
						if(evts[i].note) _html += "</a>";
					_html += "</span>";
				_html += "</div>";
				
				if(evts[i].note) _html += "<div style='border-top:1px dotted #666; white-space:normal'>" + evts[i].note;
				if(evts[i].add == "1") _html += " ......";
				if(evts[i].note) _html += "</div>";
			}
		_html += "</div>";
		$("info").innerHTML = _html;
	}
	function hide($obj)	
	{ 
		$closeModal(); 
		if (!$modalarg) return;
		if ($modalarg.reload) { window.location.reload(); return; }
	}
	function CompareTime(date1, date2)
	{
		var arr = date1.split("-");
		if(arr[1].length<2) arr[1] = "0"+arr[1];
		if(arr[2].length<2) arr[2] = "0"+arr[2];

		var d1 = new Date(arr[0], arr[1], arr[2]);

		var arr = date2.split("-");
		if(arr[1].length<2) arr[1] = "0"+arr[1];
		if(arr[2].length<2) arr[2] = "0"+arr[2];
		var d2 = new Date(arr[0], arr[1], arr[2]);

		var s = d1 - d2;
		if(s == 0) return 0;
		else if( s > 0 ) return 1;
		else return -1;
	}