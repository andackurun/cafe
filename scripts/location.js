(function (global) {
    var map,
        geocoder,
        LocationViewModel, mapOptions,officePosition,
        app = global.app = global.app || {};

    LocationViewModel = kendo.data.ObservableObject.extend({
        _lastMarker: null,
        _isLoading: false,

        address: "",
        isGoogleMapsInitialized: false,

        onNavigateHome: function () {
            var that = this,
                position;
		

          that._isLoading = true;
            that.showLoading();

            navigator.geolocation.getCurrentPosition(
                function (position) {
                    position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    map.panTo(position);
                    that._putMarker(position);

                    that._isLoading = false;
                    that.hideLoading();
                },
                function (error) {
                    //default map coordinates
                    position = new google.maps.LatLng(39.918621, 32.857169);
                    map.panTo(position);
					that._putMarker(position);
                    that._isLoading = false;
                    that.hideLoading();

                    navigator.notification.alert("Unable to determine current location. Cannot connect to GPS satellite.",
                        function () { }, "Location failed", 'OK');
                },
                {
                    timeout: 30000,
                    enableHighAccuracy: true
                }
            );
        },
		officePlaces: function() {
			var that = this;
			that._isLoading = true;
            that.showLoading();
			
			map.panTo(mapOptions.center);
			that._putMarker(mapOptions.center);
			
			that._isLoading = false;
            that.hideLoading();
			
        },

        onSearchAddress: function () {
            var that = this;

            geocoder.geocode(
                {
                    'address': that.get("address")
                },
                function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        navigator.notification.alert("Unable to find address.",
                            function () { }, "Search failed", 'OK');

                        return;
                    }

                    map.panTo(results[0].geometry.location);
                    that._putMarker(results[0].geometry.location);
                });
        },

        showLoading: function () {
            if (this._isLoading) {
                app.application.showLoading();
            }
        },

        hideLoading: function () {
            app.application.hideLoading();
        },

        _putMarker: function (position) {
            var that = this;

            if (that._lastMarker !== null && that._lastMarker !== undefined) {
                that._lastMarker.setMap(null);
            }

            that._lastMarker = new google.maps.Marker({
                map: map,
                position: position
            });
        }
    });
	
	/*app.clickLink=function(obj) {		
		
		
    };*/

    app.locationService = {
        initLocation: function () {
           

            if (typeof google === "undefined"){
                return;
            } 

            app.locationService.viewModel.set("isGoogleMapsInitialized", true);

            geocoder = new google.maps.Geocoder();
            app.locationService.viewModel.officePlaces.apply(app.locationService.viewModel, []);
			
        },
		

        show: function () {
            if (!app.locationService.viewModel.get("isGoogleMapsInitialized")) {
                return;
            }
            //show loading mask in case the location is not loaded yet 
            //and the user returns to the same tab
            app.locationService.viewModel.showLoading();

            //resize the map in case the orientation has been changed while showing other tab
            google.maps.event.trigger(map, "resize");
		app.locationService.viewModel.officePlaces.apply(app.locationService.viewModel, []);
			
        },

        hide: function () {
            //hide loading mask if user changed the tab as it is only relevant to location tab
            app.locationService.viewModel.hideLoading();
        },
		clickLink: function(obj) {
			mapOptions = {
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                },

                mapTypeControl: false,
                streetViewControl: false,
				// center:new google.maps.LatLng(39.918621, 32.857169)
            };
		if(obj.getAttribute("value") === "1") {
			//navigator.notification.alert("1");	
			mapOptions.center = new google.maps.LatLng(39.882115, 32.753737);
		}
		else {
			//navigator.notification.alert("2");
			mapOptions.center = new google.maps.LatLng(39.886034, 32.779520); 
		}
		
		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        },
		
        viewModel: new LocationViewModel()
    };
}
)(window);