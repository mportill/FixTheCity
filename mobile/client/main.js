Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function() {
console.log("redirectig to basic");
  this.redirect('basic');
});

Meteor.startup(function() {
  AutoForm.setDefaultTemplate("semanticUI");
});
