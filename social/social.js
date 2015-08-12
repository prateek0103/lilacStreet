userdata=new Mongo.Collection("userdata");
  relationship=new Mongo.Collection("relationship");
//var frnds = {0: {firstname: "", _id:"", email:"",lastname:"",username:""}};

if (Meteor.isClient) {
  Session.keys = {};
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });


  $( document ).ready(function(){$(".button-collapse").sideNav();});

  Template.registerHelper("usernamedata", function(){
    return Meteor.users.find({});
      });

      Template.registerHelper("isNotPresent", function(user){
      //  console.log(user);
      if(userdata.find({username:user}).count()==0){
        var boolResult = true;
      }
    //  console.log(boolResult);
      return boolResult;
      //  return userdata.find({username:currentUser.username}, {fields: {'onlyThisField':1}});
          });
          Template.registerHelper('log', function(what) {
  // You can use `this` and/or `Template.instance()`
  // to get template data access
  console.log(what);
});

          Template.body.events({
            'click #friends,focus #friends' : function(event){

              var inFocus = true;
            }
          });



          Template.search.events({
            'keyup #friends':function(e){
              //delete Session.key['friends'];

              var con = new RegExp(e.target.value,"i")


            var frnds= userdata.find({"$or":[{firstname: {$regex:con}},{lastname: {$regex:con}},{username: {$regex:con}},{email: {$regex:con}}]}).fetch();

              Session.set('friends', frnds);

            },
            'click #addButton':function(e){
              console.log(1);
              var count = relationship.find({"$or":[{
                user1: Meteor.user().username,
                user2: this.username,
                status: 1
              },{user1: this.username,
              user2: Meteor.user().username,
              status: 1}]}).count();
              if(count===0){
              relationship.insert({
                user1: Meteor.user().username,
                user2: this.username,
                status: 1
              });
            console.log("inserted");
            }
}
          });

          Template.search.helpers({
            frndsi: function(){

              return Session.get('friends');
            },
            visible: function(user){
              if(user==Meteor.user().username)
              {return false;}
              else {
                return true;
              }
            },

            check: function(){
                //console.log("rendered");
                var relation = relationship.find({"$or":[{user1:Meteor.user().username,user2:this.username},{user1:this.username,user2:Meteor.user().username}]}).fetch();
                //1 Request sent
                //2 Request accepted
                //3 Request Denied
                //4 Blocked
                console.log(relation);
                if(typeof relation !== 'undefined' && relation.length>0)
                switch(relation[0].status){
                  case 1://console.log(1);
                  $('#addButton').addClass("blue");
                  $('#addButton').html("sent");
                  $('#icon').text("done");
                  break;

                  case 2:$('#addButton').addClass("green");
                  $('#addButton').html("accepted");
                  $('#icon').html("done");
                  break;

                  case 3:$('#addButton').addClass("red");
                  $('#addButton').html("denied");
                  $('#icon').html("done");
                  break;

                  case 4:$('#addButton').addClass("grey");
                  $('#addButton').html("blocked");
                  $('#icon').html("done");
                  break;
              }}
          });


        Template.newuser.events({
          'click #btnSubmit' : function(e){

            var fname = $("#fnamee").val();
            var lname = $("#lnamee").val();
            var email = $("#emaill").val();

            userdata.insert({
              firstname: fname,
              lastname: lname,
              email: email,
              username: Meteor.user().username
            });
          }
        });


}

if (Meteor.isServer) {

  relationship._ensureIndex({user1:1, user2:1, status:1}, {unique:1});
}
