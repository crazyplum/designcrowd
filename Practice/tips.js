
The jQuery team has also created an even shorter method for the document ready event:
$(function(){

   // jQuery methods go here...

});


Tip: When chaining, the line of code could become quite long. However, jQuery is not very strict on the syntax; 
	 you can format it like you want, including line breaks and indentations.
$("#p1").css("color","red")
  .slideUp(2000)
  .slideDown(2000);