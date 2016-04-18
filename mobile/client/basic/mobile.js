Orders = new Meteor.Collection('list', {connection: null});


Schemas.contact = new SimpleSchema({
  details: {
    type: String,
    label: 'comment',
     optional: true
  },
  name: {
    type: String,
    label: 'name',
    optional: true
  }
});


Schemas.categories = new SimpleSchema({
  topic: {
    type: String,
    label: 'topic',
  }
});

Schemas.picture = new SimpleSchema({
  image:{
    type: String,
    label: 'data',
    blackbox: true,
    autoform:{
      type: "hidden"
    },
    autoValue: function(){
      var obj;
      obj =Session.get("pic");
      console.log("Set: pic");
     
      return obj;
   } 
  }
});

Schemas.gps = new SimpleSchema({
   
  gps:{
    type: Object,
    label: 'gps',
    blackbox: true,
    autoform:{
      type: "hidden"
    },
    autoValue: function() {
        obj =new Object();
        obj.lat= Session.get("lat");
        obj.lng= Session.get("lng");
        return obj;
    }
  }
});
Schemas.categories1 = new SimpleSchema({
  categories: {
    type: String,
    label: 'Categories',
    allowedValues: ['Graffiti', 'Pothole', 'Streetlight', 'Traffic-Signal', 'Sidewalk', 'Park-oncerns', 'Illegal-Dumping', 'Other'],
    autoform: {
      options: [{
        label: 'Graffiti',
        value: 'Graffiti'
      }, {
        label: 'Pothole',
        value: 'Pothole'
      }, {
        label: 'Streetlight',
        value: 'Streetlight'
      }, {
        label: 'Traffic Signal',
        value: 'Traffic-Signal'
      }, {
        label: 'Sidewalk',
        value: 'Sidewalk'
      }, {
        label: 'Park Concerns',
        value: 'Park-Concerns'
      }, {
        label: 'Illegal Dumping',
        value: 'Illegal-Dumping'
      }, {
        label: 'Other',
        value: 'Other'
      }]
    }
  }
});

Orders.attachSchema([
 
  Schemas.picture,
  Schemas.gps,
  Schemas.categories,
   Schemas.contact
]);
Template.gpsbutton.events({
  'click .getGPS' : function(event, template){
      //chemas.picture.clean(image, getAutoValues);
      var loc;

      loc = Geolocation.latLng();
      if (! loc){
          alert("GPS didn't work. Please try again.");
      } 
      else{
         Session.set("lat", loc.lat);
         Session.set("lng", loc.lng);
      }
  }
});
Template.picbutton.events({
    'click .takePhoto': function(event, template) {
      console.log("taking Photo");
    
        var cameraOptions = {
            width: 800,
            height: 600
        };

        MeteorCamera.getPicture(cameraOptions, function (error, data) {
           
           if(error){
            alert("error");
            $('.photo').attr('src', "error"); 
            
            Session.set("pic", "error");
           }
           else{
             $('.photo').attr('src', data); 
             $('.photo').show();
            Session.set("pic", data);

           
          }
        });
    }
  });
Template.basic.helpers({
  pic: function() {
      if(Router.current().location.get().path == '/basic/picture'){
          console.log(Router.current().location.get().path );
          return true;
      }
      else{
        console.log(Router.current().location.get().path );
          return false;
      } 
  },
  gps: function() {
      if(Router.current().location.get().path == '/basic/gps'){
         
          return true;
      }
      else{
        
          return false;
      } 
  },
  steps: function() {
    return [{
      id: 'picture',
      title: 'Picture',
      schema: Schemas.picture
    
    }, {
        id: 'gps',
      title: 'gps',
      schema: Schemas.gps
      
     
    },{
        id: 'categories',
      title: 'Categories',
      schema: Schemas.categories
      
     
    },
     {
      id: 'contact',
      title: 'Optional',
      schema: Schemas.contact,
       onSubmit: function(data, wizard) {
        var self = this;
        Orders.insert(
          _.extend(wizard.mergedData(), data),
           function(err, id) {
          if (err) {
            self.done();
          } else {
             Session.set("pic", null);
             Session.set("lat", null);
             Session.set("lng", null);
            Router.go('viewOrder', {
              _id: id
            });
          }
        });
      }
    }


    ];
  }
});

Wizard.useRouter('iron:router');

Router.route('/basic/:step?', {
  name: 'basic',

  onBeforeAction: function() {
     if (!this.params.step) {
      this.redirect('basic', {
        step: 'picture'
      });
    } 
    else {
      this.next();
    }
  }
});

Router.route('/orders/:_id', {
  name: 'viewOrder',
  template: 'viewOrder',
  data: function() {
    return Orders.findOne(this.params._id);
  }
});
Template.viewOrder.helpers({
    list: function(){
      return Orders.find({});
    }
  });