(function (global) {
    var LoginViewModel, file2App,
        app = global.app = global.app || {};
	
	function setfileApp() {

    }
	
	app.setConnected = function() {
		getFileApp();
		//fla.writeTextFromFile();
    }

    LoginViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
		accessToken:"",
		ll:"",
		isFace:false,
		isTwit:false,

        onLogin: function () {
            var that = this,
                username = that.get("username").trim(),
                password = that.get("password").trim();

            if (username === "" || password === "") {
                navigator.notification.alert("Both fields are required!",
                    function () { }, "Login failed", 'OK');

                return;
            }

            that.set("isLoggedIn", true);
        },

        onLogout: function () {
            var that = this;

            that.clearForm();
            that.set("isLoggedIn", false);
        },

        clearForm: function () {
            var that = this;

            that.set("username", "");
            that.set("password", "");
        },

        checkEnter: function (e) {
            var that = this;

            if (e.keyCode == 13) {
                $(e.target).blur();
                that.onLogin();
            }
        },
		
		foursquareConnect: function() {
			var that = this,
			clientId = "MGFFQTHJI5IZB4INYFISLK30WRE0W5OS3D5PYXOXROR4GPEB",
			redirectUri = "https://www.balistaelektronik.com/";
			var auth_url = "https://foursquare.com/oauth2/authenticate?client_id="+clientId+"&response_type=token&redirect_uri="+redirectUri;
			var ref = window.open(auth_url, '_blank','location=yes');
			ref.addEventListener('loaderror', function(event){var url=event.url.split("#")[1]; that.set("accessToken",url.slice(13,url.length)); /*navigator.notification.alert(that.accessToken);*/ ref.close(); file2App.writeTextToFile();});
        },
		
	
		
		makeTip: function() {
			var that = this;
			var url = "https://api.foursquare.com/v2/tips/add";
			var venue = "51d1462d498ee1b8a613aa4e";
			var txt = document.getElementById("tipText").value.trim();
			var obj = {
				venueId:venue, text:txt, v:"20140421", oauth_token:that.accessToken
            };
			var broadcast = "";
			if(that.isTwit && that.isFace) {
				broadcast = "twitter,facebook";
            }
			else if(that.isTwit) {
				broadcast = "twitter";
            }
			else if(that.isFace) {
				broadcast = "facebook";
            }
			if(broadcast !== "") {
				obj.broadcast = broadcast;
            }
			//url += "?venueId=" + venue + "&text=" + txt + "&v=20140421&oauth_token=" + that.accessToken;
			// navigator.notification.alert(url);
			
			$.post(url,obj, function(data,status) {
				navigator.notification.alert(JSON.stringify(data), function(){}, "ok", "ok");
            }); 
			
			
				
        }	
		
		
    });
	

    app.loginService = {
		initLogin: function() {
			file2App = new FileApp();
			file2App.run();			

        },
		
        viewModel: new LoginViewModel()
    };
	
	function FileApp() {
	}

	FileApp.prototype = {
		fileSystemHelper: null,
		fileNameField: null,
		textField: null,
		login:null,
	     
		run: function() {
			var that = this;
			fileSystemHelper = new FileSystemHelper();
			login = app.loginService.viewModel;
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
	    		fileName = "userInfo";
			var text = "that";
			$.get("https://api.foursquare.com/v2/users/self", {oauth_token:login.accessToken, v:"20140425"}, function(data,status) {
				document.getElementById("profileName").innerText = data.response.user.firstName;
				login.set("isLoggedIn", true);
				document.getElementById("profileImg").src = data.response.user.photo.prefix +"100x100"+ data.response.user.photo.suffix;
            });
			fileSystemHelper.writeLine(fileName, text, that._onSuccess, that._onError)
		},
	    
		_onSuccess: function(value) {
			
			
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
})(window);