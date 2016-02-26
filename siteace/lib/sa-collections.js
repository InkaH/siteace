Websites = new Mongo.Collection("websites");

//secure websites collection
Websites.allow({
	insert:function(){
		if(Meteor.user()){ //only for logged in users
			return true;
		}
		else{ //user is not logged in
			return false;
		}
	}, 
	update:function(){
		if(Meteor.user()){ //only for logged in users
			return true;
		}
		else{ //user is not logged in
			return false;
		}
	}
});

