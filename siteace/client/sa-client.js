///routing config

//default template
Router.configure({
  layoutTemplate: 'applicationLayout'
});

//render templates to navbar & main
Router.route('/', function () {
   	this.render('navbar', {
    	to:"navbar"
  	});
	this.render('website_form', {
		to:"main"
	});
	this.render('website_list', {
		to:"main2"
	});
	 
});

//render single website template with id variable coming in
Router.route('/website/:_id', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('website', {
    to:"main", 
    data:function(){
      //this.params refers to the parameters coming to this particular route
      return Websites.findOne({_id:this.params._id});
    }
  });
});

 ///scrolling 

  //set limit to how many images we query from the db at one time 
  Session.set("itemLimit", 8);

  lastScrollTop = 0;
  //listen to scroll event to load more images when the user scrolls down
  $(window).scroll(function(event){
    //check if we're near the bottom of the window
    if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
      //check where we are in the page
      var scrollTop = $(this).scrollTop();
      //check if we're going down
      if(scrollTop > lastScrollTop){
        //we're heading down so show more images
        Session.set("itemLimit", Session.get("itemLimit") + 4);
      }

      lastScrollTop = scrollTop;
    }
  });

   //configure the behaviour of {{>loginButtons}} by adding some fields
  //to the signup form
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  });

/////
// template helpers 
/////

// helper function that returns all available websites
Template.website_list.helpers({
	websites:function(){
		return Websites.find({}, {sort:{upvote: -1}, limit:Session.get("itemLimit")});
	}
});

/////
// template events 
/////

Template.website_item.events({
	"click .js-upvote":function(event){
		// access the id for the website in the database
		// (this is the data context for the template)
		var website_id = this._id;
		console.log("Up voting website with id "+website_id);
		//get the rating
      	var upvote = this.upvote;
      	console.log(upvote);
      	//update the upvote, if no one has rated yet the value is 0
     	Websites.update({_id:website_id}, {$inc: {upvote:1}});
		return false;// prevent the button from reloading the page
	}, 
	"click .js-downvote":function(event){
		var website_id = this._id;
		console.log("Down voting website with id "+website_id);
		//get the rating
      	var downvote = this.downvote;
      	console.log(downvote);
      	//update the downvote, if no one has rated yet the value is 0
     	Websites.update({_id:website_id}, {$inc: {downvote:-1}});
		return false;// prevent the button from reloading the page
	}
});

Template.website_form.events({
	"click .js-toggle-website-form":function(event){
		$("#website_form").toggle('slow');
	}, 
	"submit .js-save-website-form":function(event){
		// get form values
		var url = event.target.url.value;
		var title = event.target.title.value;
		var description = event.target.description.value;
		console.log("The url entered is: "+url);
		console.log("The title entered is: "+title);
		console.log("The description entered is: "+description);
		if(Meteor.user()){
			Websites.insert({
				title: title, 
	    		url:url, 
	    		description:description, 
	    		createdOn:new Date(),
	            rating:null,
	            comments:[]
			});
		}
		//dismiss after adding website
      	$(".hidden_div").css("display", "none");
		return false;// stop the form submit from reloading the page
	}
});

Template.website.events({
	"submit .js-add-comment-form":function(event){
		// get comment value
		var comment = event.target.comment.value;
		var website_id = this._id;
		console.log("Commenting website with id: "+website_id);
		console.log("Comment: " + comment);
		if(Meteor.user()){
			// add comment to the comments array
			Websites.update({_id:website_id}, {$push: {comments:comment}});
		}
		//clear textarea after submitting
		$("#comment").val("");
		return false;// stop the form submit from reloading the page
	}
});

