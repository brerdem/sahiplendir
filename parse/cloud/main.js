
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:

var Image = require('parse-image');

Parse.Cloud.define("savePost", function(request, response) {
	
			var parseFile = new Parse.File(request.name, {base64: request.base64 });
			parseFile.save().then(function() {
		
			// The file has been saved to Parse.
				console.log('success:'+parseFile.url());
				
				var image = new Image();
				image.setData(request.base64)
				.then(function(image) {
					var size = Math.min(image.width(), image.height());
					return image.crop({
					  left: (image.width() - size) / 2,
					  top: (image.height() - size) / 2,
					  width: size,
					  height: size
					});
				
				}).then(function(image) {
				 // Resize the image to 64x64.
					return image.scale({
					  width: 64,
					  height: 64
					});
				 
				}).then(function(image) {
					// Make sure it's a JPEG to save disk space and bandwidth.
					return image.setFormat("JPEG");
				 
				}).then(function(image) {
					// Get the image data in a Buffer.
					return image.data();
				 
				}).then(function(buffer) {
					// Save the image into a new file.
					var base64 = buffer.toString("base64");
					var cropped = new Parse.File("thumbnail.jpg", { base64: base64 });
					return cropped.save();
				}).then(function(cropped) {
							
					var PostImage = Parse.Object.extend("Image");
					var PostObj = Parse.Object.extend("Post");
					
					var post_image = new PostImage();
					var post = new PostObj();
					
										
					post.set("postTitle", request.postTitle);
					post.set("postMessage", request.postMessage);
					post.set("userPointer", Parse.User.current());
					
					post_image.set("imagePath", parseFile.url());
					post_image.set("imageThumbnailPath", cropped.url());
					post_image.set("postPointer", post);
						
					post_image.save(null, {       
						success: function(item) {
							response.success(true);
							console.log("saved from main.js");		
						
						},
						error: function(error) {
						//Failure Callback
						response.error(error);
						console.log("error");
						
						}
					});
				})
		

		}, function(error) {
		
			console.log(error);
		});
		


});
