(function (global) {
    var questionaireView, login,
        app = global.app = global.app || {};

    questionaireView = kendo.data.ObservableObject.extend({
		//login: app.loginService.viewModel,
		catid:"",
		getQuestion: function() {
			var that=this,
				url = "http://www.r8app.com/questions.php",
				hash = "4b5ff2ec1b6ae8332e090e49f7400b6a",
				catId = that.catid;
			$("#deneQuestion").empty();
			
			$.get(url, {ch:hash, cat:catId, eval:""}, function(data,status){
				if(status) {
					var obj = JSON.parse(data);
					for(var i=0; i<obj.length; i++) {
						var list1 = $("<li>").text(obj[i].text);
					
						var list2 = $("<li>");
						for(var j=1; j<6; j++) {
							var lab1 = $("<label>");
							var img = $("<img>").attr('src', './styles/images/' + j +'.png');
							lab1.attr('for', obj[i].id+j);
							var input = $('<input type="radio">').attr({id:obj[i].id+j, name:obj[i].name, value:j});
							var div = $('<div>').attr('class', "checkboxgroup");
							
							img.appendTo(lab1);
							lab1.appendTo(div);
							input.appendTo(div);
							list2.append(div);	
	                    }
						var unList = $("<ul>");
						unList.attr("class", "km-list");
						unList.append(list1);
						unList.append(list2);
						$("#deneQuestion").append(unList);
					}
					
					
					//$("#deneQuestion").append('<ul class="km-list"><li>' + obj[0].text+ '</li></ul>');
                }
            });
        }
		
        	
    });
	

    app.questionService = {
		onInit: function() {
			login = app.loginService.viewModel;
			app.questionService.viewModel.getQuestion.apply(app.questionService.viewModel, []);
			// navigator.notification.alert("21");			
        },
        viewModel: new questionaireView()
    };
})(window);