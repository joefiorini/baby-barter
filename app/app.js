import Resolver from 'resolver';
import Adapter from 'appkit/adapters/application';
import SessionInit from 'appkit/initializers/session';
import router from 'appkit/router';

Ember.ENV.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.create({
  LOG_ACTIVE_GENERATION: true,
  LOG_VIEW_LOOKUPS: true,
  modulePrefix: 'appkit', // TODO: loaded via config
  Resolver: Resolver,
  Router: Ember.Router.extend({
    router: router,
    location: 'history'
  })
});

Adapter.reopen({
  host: 'http://ember-dev-27896.use1.actionbox.io:3000'
});

Ember.TextField.reopen({
  attributeBindings: ["autofocus"]
});


App.initializer(SessionInit);

export default App;
