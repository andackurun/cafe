(function (global) {
    var fSquareView, login,
        app = global.app = global.app || {};

    fSquareView = kendo.data.ObservableObject.extend({
		//login: app.loginService.viewModel,
		
		makeAlert: function() {
			var that = this;	
			navigator.notification.alert(JSON.stringify(login.isTwit));
        },
		
		
		
		makeCheckIn: function() {
			
			var that=this,
			venueId = "51d1462d498ee1b8a613aa4e";
			
			/*msg = "balista rocks",
			ll = "39.899681,32.77503";
			var url = "https://api.foursquare.com/v2/checkins/add?";
			url += "v=20140410&broadcast=public&"+ "oauth_token=" + that.accessToken + "&venueId=" + venueId + "&shout=" + msg;
			//navigator.notification.alert(that.accessToken);
			$.post(url,function(data,status){navigator.notification.alert("data:" + data + "Status:" + status);});
			*/
		
			navigator.geolocation.getCurrentPosition(
				function(position) {
					//that.setPosition(position);
                	ll = position.coords.latitude.toFixed(5) + "," + position.coords.longitude.toFixed(5);
					var url =  "https://api.foursquare.com/v2/venues/search";
					var query = "balista";
					var rad = "100";
					$.get(url,{ll:ll, query:query, radius:rad, oauth_token:login.accessToken, v:"20140414"}, function(data,status){
						var checkInUrl = "https://api.foursquare.com/v2/checkins/add"
						var venueId = data.response.venues[0].id;
						var msg = document.getElementById("text").value;
						
						//$.post(url,{venueId:venueId, shout:msg, oauth_token:login.accessToken, v:"20140421"}, function(data,status){navigator.notification.alert("data:" + data + "Status:" + status);});
						if(JSON.parse(data).response.venues.length === 1)
						navigator.notification.alert("tru");
						else
						navigator.notification.alert("fal");
						
						//navigator.notification.alert("data:" + JSON.stringify(data) + "Status:" + status);
					});
				
					
                },
				function (error) {
                  
                    navigator.notification.alert("Unable to determine current location. Cannot connect to GPS satellite.",
                        function () { }, "Location failed", 'OK');
                },
                {
                    timeout: 30000,
                    enableHighAccuracy: true
                }
			);
			
			//"https://api.foursquare.com/v2/venues/search?ll=39.898424,32.797434&query=zeynel çilli&radius=1000&v=20140411&oauth_token=" +that.accessToken;  
			//$.get(url, function(data,status){navigator.notification.alert("data:" + JSON.stringify(data) + "Status:" + status);});
        	
		}
        	
    });
	

    app.fSquareService = {
		onInit: function() {			
			document.getElementById("text").value='';
			$("#text").focus();
			login = app.loginService.viewModel;
			// navigator.notification.alert("21");			
        },
        viewModel: new fSquareView()
    };
})(window);