var uid = "";
var accessToken = "";
var graphAPIURL = "https://graph.facebook.com/";

function loadjsfile(){
	
	$('body').append("<script src='/static/js/canvas2image.js'></script>");
	$('body').append("<script src='/static/js/html2canvas.js'></script>");
	
}

$(document).ready(function(){

		loadjsfile();

	  //   $("#save").click(function(){

	  //   	FB.getLoginStatus(function(response){
				
			// 	if(response.status === 'connected'){
			// 		console.log(response);
			// 		uid = response.authResponse.userID;
			// 		accessToken = response.authResponse.accessToken;
			
			// 		saveToServer();
			// 	}else if(response.status === 'not-authorized'){
			// 		login();
			// 	}else{
			// 		login();
			// 	}
			// });

	 	// });

});

function setButton(){

	    $("#save").click(function(){

	    	FB.getLoginStatus(function(response){
				
				if(response.status === 'connected'){
					console.log(response);
					uid = response.authResponse.userID;
					accessToken = response.authResponse.accessToken;
			
					saveToServer();
				}else if(response.status === 'not-authorized'){
					login();
				}else{
					login();
				}
			});

	 	});

}

$(document).bind('FBSDKLoaded', function(){
	console.log("FB finish!!!");
	    $("#save").click(function(){

	    	FB.getLoginStatus(function(response){
				
				if(response.status === 'connected'){
					console.log(response);
					uid = response.authResponse.userID;
					accessToken = response.authResponse.accessToken;
			
					saveToServer();
				}else if(response.status === 'not-authorized'){
					login();
				}else{
					login();
				}
			});

	 	});
		// console.log('facebook');
		
		// FB.getLoginStatus(function(response){
				
		// 	if(response.status === 'connected'){
		// 		console.log(response);
		// 		uid = response.authResponse.userID;
		// 		accessToken = response.authResponse.accessToken;
		// 	}else if(response.status === 'not-authorized'){
		// 		login();
		// 	}else{
		// 		login();
		// 	}
		// });
	function login(){

		FB.login(function(response){
			console.log(response);
			if(response.authResponse){
				uid = response.authResponse.userID;
				accessToken = response.authResponse.accessToken;
				console.log("success");
				saveToServer();
			}else{
				console.log("fail");	
				alert('login failed');
			}
		}, {scope: 'publish_actions, publish_stream'});

}
});



function saveToServer(){
	console.log('save');
	$('#toolbar').hide();
	var filename = Math.random().toString(36).substring(9);
	
	var pageHtml = "<html>" + $("html").html() + "</html>";
	var capture = $("body");
	console.log($("#toolbar"));
	
	// console.log(pageHtml);
	var blob = new Blob([pageHtml], {type: 'text.plain'});
	// $('#toolbar').append("<a id = 'link' href='" + window.URL.createObjectURL(blob) + "'>Link</a>");
	// $('#link').attr('download', "a.html");
	var fd = new FormData();
	fd.append('blobfile', blob);
	console.log(filename);
	fd.append('fname', filename+".html");
	fd.append('uid', uid);
	fd.append('url', document.URL)
	$.ajax({
		type: 'POST',
		url: '/upload',
		data: fd,
		processData:false,
		contentType:false
	}).done(function(data){
		console.log(data);
		saveImageToServer(filename+".png", capture, function(){
			console.log("finished");
			if(confirm("Do you want to share to your wall?")){
				var message="http://csclab12.cs.nthu.edu.tw/webpage/" + filename +".html";
				var url = graphAPIURL + uid + '/feed?format=json&message=' + message + '&access_token=' + accessToken;
				$.post(url, function(data){
						console.log(data);
				});
			}else{
				alert("Pity");
			}
			window.location.href = data.url;
		});
	});

}

saveImageToServer = function(filename, capture, callback){
	console.log("save Image");
	var image;
	console.log(capture);
	html2canvas(capture, {
	    onrendered: function(canvas){
	    	$('#toolbar').show();
	        image = Canvas2Image.saveAsPNG(canvas, true, canvas.width*0.5, canvas.height*0.5);
	        console.log(image);
	        var fd = new FormData();
			var imageText = image.toString().replace("data:image/png;base64,","");
			console.log("save Image");
			fd.append('image', imageText);
			fd.append('fname', filename);
			var oReq = new XMLHttpRequest();
			oReq.open("POST", "/uploadImage");
			oReq.send(fd);
			callback();
		}
	});

	
}