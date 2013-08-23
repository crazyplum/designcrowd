$(document).ready(function(){
	
	var name = $(".title").attr('id').replace('.html', "");

	

	$.getJSON("/result/"+name, function(data){
		console.log(data);
		//$("#result").append("<img src>")
		//console.log(data.post);

		var html = "";
		$.each(data.post, function(i, post){
			var filename = post[0].replace(".html", "");
			var img = "/static/image_upload/"+filename+".png";
			 //alert(i);
			if (i%3==0){
				html += '<div class="row-fluid">'
			}

			html += "<div class='span4'>"
			html += "<div class='fb-like' data-href='http://csclab12.cs.nthu.edu.tw/webpage/"+filename+".html'' data-width='450' data-layout='box_count' data-show-faces='true' data-send='false'></div>"
			html += "<div class='marketing'><a href='/webpage/"+filename+".html'><div class='small'><img src="+img+" width='75%' height='auto'></div></a></div>";
			html += "</div>"

			if (i%3==2){
			 	html += '</div>';
			 }

			// $("<img/>").attr({
			// 	src: img,
			// 	width: "100px",
			// 	height: "100px"
			// }).appendTo("#result")
		});
		$("#result").append(html);
	})
	.done( function() { 
		
		// $(".marketing").hover(
	 //        function () {
	 //            $(this).addClass("select");
	 //        },
	 //        function () {
	 //            $(this).removeClass("select");
	 //        }
	 //    }
		
		
	    
	})
	.always(function() { 
		// alert($("#result").height());
		// // if ( $("#result").height() <= 100 ){
		// // 	$('#result').css('height', 400 ); 
		// // }

		$(".marketing").anythingZoomer({
			clone :true,
			// If you need to make the left top corner be at exactly 0,0, adjust the offset values below
			offsetX : 0,
			offsetY : 0
		});
		//$('.az-wrap-inner').css({'height':'auto'});
	});


});