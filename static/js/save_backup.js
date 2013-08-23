var uid = "";
var accessToken = "";
var graphAPIURL = "https://graph.facebook.com/"

$(document).ready(function(){

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

});

$(document).bind('FBSDKLoaded', function(){
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
});

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

function saveToServer(){
	console.log('save');
	$('#toolbar').hide();
	var pageHtml = "<html>" + $("html").html() + "</html>";
	$('#toolbar').show();
	// console.log(pageHtml);
	var blob = new Blob([pageHtml], {type: 'text.plain'});
	// $('#toolbar').append("<a id = 'link' href='" + window.URL.createObjectURL(blob) + "'>Link</a>");
	// $('#link').attr('download', "a.html");
	var fd = new FormData();
	fd.append('blobfile', blob);
	var filename = Math.random().toString(36).substring(9)+'.html';
	console.log(filename);
	fd.append('fname', filename);
	fd.append('uid', uid);
	fd.append('url', document.URL)
	//console.log(fd)
	// var oReq = new XMLHttpRequest();
	// oReq.open("POST", "/upload");
	// oReq.send(fd);
	$.ajax({
		type: 'POST',
		url: '/upload',
		data: fd,
		processData:false,
		contentType:false
	}).done(function(data){
		console.log(data);
		// window.location.href = data.url;
		if(confirm("Do you want to share to your wall?")){
			var message="http://csclab12.cs.nthu.edu.tw/webpage/" + filename;
			var url = graphAPIURL + uid + '/feed?format=json&message=' + message + '&access_token=' + accessToken;
			$.post(url, function(data){
					console.log(data);
			});
		}else{
			alert("Pity");
		}
	});
	

}