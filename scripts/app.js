(function (global) {
    var mobileSkin = "", fileApp, login,
        app = global.app = global.app || {};
	
    app.application = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout"});
	

	var pushNotification = window.plugins.pushNotification;
 
    var apnSuccessfulRegistration = function(token) {
       alert("Successfully got a token:" + token);
    }
 
    var apnFailedRegistration = function(error) {
        alert("Error: ");
    }
 
    var deviceReady = function() {
		$(document.body).height(window.innerHeight);
        if (device.platform == "iOS") {
            pushNotification.register(apnSuccessfulRegistration,
            apnFailedRegistration, {
                "badge": "true",
                "sound": "true",
                "alert": "true",
                "ecb": "pushCallbacks.onNotificationAPN" //tell PushPlugin to call onNotificationAPN of global pushCallbacks object
            });
        }
		/*
		login = app.loginService.viewModel; 		
		fileApp = new FileApp();
		fileApp.run();
		fileApp.readTextFromFile();*/
    }
	
	
    //subscribe to "deviceready" event with a local function
    document.addEventListener("deviceready", deviceReady, false);
	
	function getFileApp() {
		navigator.notification.alert("123");
    	return fileApp;	
    }
	
	function FileApp() {
	}

	FileApp.prototype = {
		fileSystemHelper: null,
		fileNameField: null,
		textField: null,
	     
		run: function() {
			var that = this;
			fileSystemHelper = new FileSystemHelper();
		},
	    
		_deleteFile: function () {
			var that = this,
			    fileName = that.fileNameField.value;
	        
			if (that._isValidFileName(fileName)) {
				fileSystemHelper.deleteFile(fileName, that._onSuccess, that._onError);
			}
			else {
				var error = { code: 44, message: "Invalid filename"};
				that._onError(error);
			}
		},
		
		readTextFromFile: function() {
			var that = this,
			    fileName = "userInfo";
	        
			fileSystemHelper.readTextFromFile(fileName, that._onSuccess, that._onError);
			
		},
	    
		writeTextToFile: function() {
			var that = this,
	    		fileName = "userInfo",
	    		text = "that";
			
			fileSystemHelper.writeLine(fileName, text, that._onSuccess, that._onError)
		},
	    
		_onSuccess: function(value) {
			login.set("isLoggedIn", true);
			navigator.notification.alert("1111");
		},
	    
		_onError: function(error) {
			var that = this;
			login.set("isLoggedIn", false);
		},
	    
		_isValidFileName: function(fileName) {
			//var patternFileName = /^[\w]+\.[\w]{1,5}$/;

			return fileName.length > 2;
		}
	}
	
	app.getTipsForUser = function() {
		var url = "http://r8app.com/statdb/comments.php";
		companyid = 8;
		userid = 98;
		$.get(url, {companyid:"8", userid:"98"}, function(data,status){
			var obj = JSON.parse(data);
		/*
			var unList = $("<ul>");
			unList.attr("class", "km-list");
			for(var i=0; i<obj.length; i++) {
				var list1 = $("<li>").text(obj[i].eval);
				
				unList.append(list1);
			}
				$("#tipsofUser").append(unList); */
        });
    };
	
	app.getImage = function() {
		alert("qwe");
		document.getElementById("hastane").style.display = "none";
		document.getElementById("img").style.display = "inline";
    }
	
	/*
	app.changeSkin = function (e) {
        if (e.sender.element.text() === "Flat") {
            e.sender.element.text("Native");
            mobileSkin = "flat";
        }
        else {
            e.sender.element.text("Flat");
            mobileSkin = "";
        }

        app.application.skin(mobileSkin);
    };
	*/
    
})(window);