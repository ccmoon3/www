angular.module('starter.controllers', [])

.config(function($compileProvider){
$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);
})

.controller('BrushCtrl', function($scope,$state,Camera) {

   $scope.savePhoto = function(){
       window.canvas2ImagePlugin.saveImageDataToLibrary(
           function(msg){
               console.log(msg);
               alert("Save Successfully!");
           },
           function(err){
               console.log(err);
               alert("Save Failed..");
           },
           document.getElementById('after')
       );
   }

   $scope.takePhoto = function() {
         Camera.getPicture().then(function(imageURI) {
              console.log(imageURI);
              $scope.lastPhoto = imageURI;
              $scope.ImageURI =  imageURI;
             UploadPicture(imageURI);
         }, function(err) {
            console.err(err);
         }, {
             quality: 75,
             allowEdit : true,
             saveToPhotoAlbum: true
         });
    }
  $scope.ShowPictures = function(){
                navigator.camera.getPicture(  UploadPicture, function(message) {
                                },{
                                quality: 75,
                                destinationType: navigator.camera.DestinationType.FILE_URI,
                                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                            }
               );
  };

     function UploadPicture(imageURI) {

                                if (imageURI.substring(0,21)=="content://com.android") {
                                    var photo_split=imageURI.split("%3A");
                                    imageURI="content://media/external/images/media/"+photo_split[1];
                                }

                                var canvas = document.getElementById('after');
                                var ctx = canvas.getContext('2d');
                                       var MaxWidth = window.innerWidth - 20;
                                var image = new Image();

                              image.onload = function() {
                                      			//todo:wrap function
                                  if(image.width> MaxWidth ||image.height> MaxHeight||(image.height< MaxHeight && image.width< MaxWidth)){
                                      scale =  Math.min(MaxWidth / image.width,MaxHeight / image.height );
                                      image.height = scale * image.height;
                                      image.width = scale * image.width;
                                  }
                                  canvas.width = image.width;
                                  canvas.height = image.height;
                                  Width = canvas.width;
                                  Height = canvas.height;
                                  ctx.drawImage(image, 0, 0, image.width, image.height);
                              };

                                image.src = imageURI;
                                $scope.apply();
                                alert($scope.ImageURI );
                                window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
                                    $scope.image = fileEntry.nativeURL;
                                })

                        }
                            $scope.Test = function() {
                              $state.go('tab.filter');
                            };
            var stage;
         		var isDrawing;
         		var drawingCanvas;
         		var oldPt;
         		var oldMidPt;
         		var image;
                var imageAfter;
         		var bitmap;
         		var blur;
         		var cursor;
         		var size = 20;
         		var rect;
                var canvas = document.getElementById('after');
                var Width;
                var Height;
                var scale = 1;
                var MaxWidth = 0.95*window.innerWidth;
                var MaxHeight = 0.8*window.innerHeight;

       function loadImage(imageURI) {

             var ctx = canvas.getContext('2d');
             image = new Image();
             image.onload = function() {
                     			//todo:wrap function
        /*         if(image.width> MaxWidth ||image.height> MaxHeight||(image.height< MaxHeight && image.width< MaxWidth)){
                     scale =  Math.min(MaxWidth / image.width,MaxHeight / image.height );
                     image.height = scale * image.height;
                     image.width = scale * image.width;
                 }*/
                 canvas.width = image.width;
                 canvas.height = image.height;
      //           Width = canvas.width;
      //           Height = canvas.height;
                 ctx.drawImage(image, 0, 0, image.width, image.height);
             };
              image.src =  document.getElementById('ori').src;
        //        image.src =imageURI;
        }

         	/*	window.localStorage.setItem( 'item_name', item_value);
                 item_value = window.localStorage.getItem( 'item_name' );
                 window.localStorage.removeItem( 'item_name' );*/


         		 $scope.filterTest =function() {
         			image = new Image();
         			imageAfter = new Image();

             //        loadImage("img/test.jpg");
              //       image.src = document.getElementById('ori').src;
                       image.src = canvas.toDataURL() ;

                     Caman("#after",function () {
                            this.revert();
                            this.greyscale();
                            this.render(function () {
                                 imageAfter.src = this.toBase64();
                             });
                      })
                     imageAfter.onload = handleComplete;
         			 stage = new createjs.Stage("after");
         		}
         		function handleComplete() {
         			createjs.Touch.enable(stage);
         			stage.enableMouseOver();

                    canvas.addEventListener("touchstart", function(e) { handleMouseDown(e);},false);
             	    canvas.addEventListener("touchend", function(e) { handleMouseUp(e);},false);
                    canvas.addEventListener("touchmove", function(e) { handleMouseMove(e);},false);
                    rect = canvas.getBoundingClientRect();

         			drawingCanvas = new createjs.Shape();

         			//todo:wrap function
         			 Height=image.height;
         			 Width=image.width ;
         			bitmap = new createjs.Bitmap(image);
         	        blur = new createjs.Bitmap(imageAfter);

         			stage.addChild(blur,bitmap);
         			updateCacheImage(false);

         			cursor = new createjs.Shape(new createjs.Graphics().beginFill("#FFFFFF").drawCircle(0, 0, size));
         			cursor.cursor = "pointer";

         			stage.addChild(cursor);
         		}

         		function handleMouseDown(e) {
             		if( navigator.userAgent.match(/Android/i) ) {
         	        	e.preventDefault();
         		    }
         		    var touch = e.targetTouches[0];
         			oldPt = new createjs.Point((touch.pageX-rect.left), (touch.pageY-rect.top));
         		 	oldMidPt = oldPt;
         			isDrawing = true;
         		}

         		function handleMouseMove(e) {
         		        		if( navigator.userAgent.match(/Android/i) ) {
                         		e.preventDefault();
                         		}
         		    var touch = e.targetTouches[0];
         			cursor.x = touch.pageX-rect.left;
         			cursor.y = touch.pageY-rect.top;

         			if (!isDrawing) {
         				stage.update();
         				return;
         			}

         			var midPoint = new createjs.Point((oldPt.x + touch.pageX -rect.left)/2, (oldPt.y + touch.pageY -rect.top)/2);

         			drawingCanvas.graphics.setStrokeStyle(size, "round", "round")
         				.beginStroke("rgba(0,0,0,0.15)")
         				.moveTo(midPoint.x, midPoint.y)
         				.curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

         			oldPt.x = (touch.pageX-rect.left);
         			oldPt.y = (touch.pageY-rect.top);
         			oldMidPt.x = midPoint.x;
         			oldMidPt.y = midPoint.y;

         			updateCacheImage(true);
         		}

         		function handleMouseUp(e) {
         			updateCacheImage(true);
         			isDrawing = false;
         		}

         		function updateCacheImage(update) {
         			if (update) {
         				drawingCanvas.updateCache();
         			} else {
         				drawingCanvas.cache(0, 0,Width, Height);
         			}
         			bitmap.filters = [new createjs.AlphaMaskFilter(drawingCanvas.cacheCanvas)];
         			if (update) {
         				bitmap.updateCache(0, 0, Width, Height);

         			} else {
         				bitmap.cache(0, 0, Width, Height);
         			}
         			stage.update();
         		}
})


.controller('FilterCtrl', function($scope) {

             var stage;
         		var isDrawing;
         		var drawingCanvas;
         		var oldPt;
         		var oldMidPt;
         		var image;
                var imageAfter;
         		var bitmap;
         		var blur;
         		var cursor;
         		var size = 20;
         		var rect;
                var canvas = document.getElementById('test');
                var Width;
                var Height;
                var scale = 1;
                var MaxWidth = 0.95*window.innerWidth;
                var MaxHeight = 0.8*window.innerHeight;

       function loadImage(imageURI) {

             var ctx = canvas.getContext('2d');
             image = new Image();
             image.onload = function() {
                     			//todo:wrap function
        /*         if(image.width> MaxWidth ||image.height> MaxHeight||(image.height< MaxHeight && image.width< MaxWidth)){
                     scale =  Math.min(MaxWidth / image.width,MaxHeight / image.height );
                     image.height = scale * image.height;
                     image.width = scale * image.width;
                 }*/
                 canvas.width = image.width;
                 canvas.height = image.height;
      //           Width = canvas.width;
      //           Height = canvas.height;
                 ctx.drawImage(image, 0, 0, image.width, image.height);
             };
              image.src =  document.getElementById('originalImage').src;
        //        image.src =imageURI;
        }

         	/*	window.localStorage.setItem( 'item_name', item_value);
                 item_value = window.localStorage.getItem( 'item_name' );
                 window.localStorage.removeItem( 'item_name' );*/


         		 $scope.filterTest =function() {
         			image = new Image();
         			imageAfter = new Image();

                     loadImage("img/test.jpg");
                     image.src = "img/test.jpg";

                     Caman("#test",function () {
                            this.revert();
                            this.greyscale();
                            this.render(function () {
                                 imageAfter.src = this.toBase64();
                             });
                      })
                     imageAfter.onload = handleComplete;
         			 stage = new createjs.Stage("test");
         		}
         		function handleComplete() {
         			createjs.Touch.enable(stage);
         			stage.enableMouseOver();

                    canvas.addEventListener("touchstart", function(e) { handleMouseDown(e);},false);
             	    canvas.addEventListener("touchend", function(e) { handleMouseUp(e);},false);
                    canvas.addEventListener("touchmove", function(e) { handleMouseMove(e);},false);
                    rect = canvas.getBoundingClientRect();

         			drawingCanvas = new createjs.Shape();

         			//todo:wrap function
         			 Height=image.height;
         			 Width=image.width ;
         			bitmap = new createjs.Bitmap(image);
         	        blur = new createjs.Bitmap(imageAfter);

         			stage.addChild(blur,bitmap);
         			updateCacheImage(false);

         			cursor = new createjs.Shape(new createjs.Graphics().beginFill("#FFFFFF").drawCircle(0, 0, size));
         			cursor.cursor = "pointer";

         			stage.addChild(cursor);
         		}

         		function handleMouseDown(e) {
             		if( navigator.userAgent.match(/Android/i) ) {
         	        	e.preventDefault();
         		    }
         		    var touch = e.targetTouches[0];
         			oldPt = new createjs.Point((touch.pageX-rect.left), (touch.pageY-rect.top));
         		 	oldMidPt = oldPt;
         			isDrawing = true;
         		}

         		function handleMouseMove(e) {
         		        		if( navigator.userAgent.match(/Android/i) ) {
                         		e.preventDefault();
                         		}
         		    var touch = e.targetTouches[0];
         			cursor.x = touch.pageX-rect.left;
         			cursor.y = touch.pageY-rect.top;

         			if (!isDrawing) {
         				stage.update();
         				return;
         			}

         			var midPoint = new createjs.Point((oldPt.x + touch.pageX -rect.left)/2, (oldPt.y + touch.pageY -rect.top)/2);

         			drawingCanvas.graphics.setStrokeStyle(size, "round", "round")
         				.beginStroke("rgba(0,0,0,0.15)")
         				.moveTo(midPoint.x, midPoint.y)
         				.curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

         			oldPt.x = (touch.pageX-rect.left);
         			oldPt.y = (touch.pageY-rect.top);
         			oldMidPt.x = midPoint.x;
         			oldMidPt.y = midPoint.y;

         			updateCacheImage(true);
         		}

         		function handleMouseUp(e) {
         			updateCacheImage(true);
         			isDrawing = false;
         		}

         		function updateCacheImage(update) {
         			if (update) {
         				drawingCanvas.updateCache();
         			} else {
         				drawingCanvas.cache(0, 0,Width, Height);
         			}
         			bitmap.filters = [new createjs.AlphaMaskFilter(drawingCanvas.cacheCanvas)];
         			if (update) {
         				bitmap.updateCache(0, 0, Width, Height);

         			} else {
         				bitmap.cache(0, 0, Width, Height);
         			}
         			stage.update();
         		}


});
