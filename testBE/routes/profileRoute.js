'use strict';
module.exports = function(app) {
  var profile = require('../controllers/profileController');

  // profile Routes
  app.route('/all_profile')
    .get(profile.list_all_profile)

  app.route('/profileByName/:name')
    .get(profile.get_a_profile)

  app.route('/register_profile/:data')
    .post(profile.reg_profile)
};