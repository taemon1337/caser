(function($) {

  var Api = function(opts) {
    opts = opts || {};
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.api = opts.api || window.location.origin + "/api";
    this._cache = opts.cache || {};
  };

  Api.prototype = {
    cache: function(path, cb) {
      var self = this;
      if(self._cache[path]) {
        cb(self._cache[path]);
      } else {
        $.get(self.api+path).then(function(resp) {
          self._cache[path] = self.parse(resp);
          cb(self._cache[path]);
        });
      }
    },
    storeUser: function(user, cb) {
      if(user) {
        sessionStorage.setItem("currentUser", JSON.stringify(user));
        this.currentUser = user;
        cb(user);
      } else {
        console.log("Invalid User");
      }
    },
    login: function(path, user, cb) {
      var self = this;

      if(self.currentUser) {
        console.log("User is already logged in!", self.currentUser);
      } else {
        $.get('/users/'+user.uid)
        .then(function(record) { self.storeUser(record, cb) })
        .catch(function(err) {
          self.save("/users", user, function(record) {
            self.storeUser(record, cb);
          });
        });
      }
    },
    logout: function() {
      sessionStorage.setItem("currentUser", null);
      this.currentUser = null;
      location.reload();
    },
    new: function(resource) {
      return {};
    },
    get: function(path, cb) {
      var self = this;

      $.get(self.api+path)
        .then(function(resp) { cb(self.parse(resp)) })
        .catch(self.error)
      ;
    },
    save: function(path, record, cb) {
      var self = this;
      var isNew = !record._id;
      var headers = record._etag ? { "If-Match": record._etag } : {};
      
      $.ajax({
        url: self.api+path,
        method: isNew ? "POST" : "PATCH",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(record),
        headers: headers
      }).then(function(resp) {
        for(var attr in resp) { record[attr] = resp[attr]; }
        cb(record)
      }).catch(self.error);
    },
    delete: function(path, record, cb) {
      var self = this;
      var headers = record._etag ? { "If-Match": record._etag } : {};

      $.ajax({
        url: self.api+path,
        method: "DELETE",
        dataType: "json",
        contentType: "application/json",
        headers: headers
      }).then(function(resp) {
        if(cb) { cb(resp); }
      }).catch(self.error);
    },
    error: function(err) {
      console.log("Error: ", err);
    },
    parse: function(resp) {
      if(resp._items) {
        return resp._items;
      } else {
        return resp;
      }
    }
  };

  window.Api = Api;
})($);
