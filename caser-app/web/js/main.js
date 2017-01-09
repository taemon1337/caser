riot.compile(function() {
  var currentTag = null;
  var currentNav = null;
  var api = riot.api = new Api();

  function mountNavbar(opts) {
    currentNav && currentNav.unmount(true)
    currentNav = riot.mount('#navbar', 'navbar', opts)[0]
  }

  function mount(tag, opts) {
    mountNavbar({ tabs: "home,users,cases,reports", user: api.currentUser, logout: api.logout })
    currentTag && currentTag.unmount(true)
    currentTag = riot.mount('#main', tag, opts)[0]
  }

  function mountResource(resources, resource, id, action) {
    var opts = {};
    if(id) {
      var tag = action === 'edit' ? resource+'-edit' : resource;
      if(id === 'new') {
        opts[resource] = api.new(resource);
        mount(tag, opts);
      } else {
        api.get('/'+resources+'/'+id, function(record) {
          opts[resource] = record;
          mount(tag, opts);
        });
      }
    } else {
      api.get('/'+resources, function(records) {
        opts[resources] = records;
        mount(resources, opts);
      });
    }
  };


  var routes = {
    home: function(id, action) {
      mount('home')
    },
    login: function(id, action, collection) {
      if(api.currentUser) {
        mount('home')
      } else {
        mount('login', { url: [collection,id,action].join('/').replace('//','/') })
      }
    },
    users: function(id, action) {
      mountResource('users','user',id,action);
    },
    cases: function(id, action) {
      mountResource('cases','case',id,action);
    },
    reports: function(id, action) {
      mountResource('reports','report',id,action);
    }
  };

  function handler(collection, id, action) {
    var fn = api.currentUser ? routes[collection || 'home'] : routes.login
    fn ? fn(id, action, collection) : console.error("No route found: ", collection, id, action)
  }

  riot.mount('*')
  route(handler)
  route.start(true);
});
