List = new Mongo.Collection("list");
var MAP_ZOOM = 15;
if (Meteor.isClient) {
  // This code only runs on the client
  
  Template.body.helpers({
    /*list: function(){
      return List.find({}, {sort: {createdAt: -1}});
    },*/
    /*list: function(){
      var myArray = List.find({}, {sort: {createdAt: -1}}).fetch();
      var distinctHead = _.uniq(myArray, true, function(List) {return List.heading});
      return distinctHead;
    },*/
    settings: function () {
      return {
        collection: List,
        fields: [
          {key: 'createdAt', label: 'Date Added'},
          {key: 'topic', label: 'Issue'},
          {key: 'latitude', label: 'Location'}
        ]
      };
    }
  });
  
  Template.entry.events({
    "click .delete": function () {
      List.remove(this._id);
    }
  });
}

Router.route('/', {
  name: 'home',
    template: 'home'
});
Router.route('/show',{
  name:'show',
  template: 'show'
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

