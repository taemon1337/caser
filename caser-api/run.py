from eve import Eve
from os import getenv

settings = {
  'URL_PREFIX': 'api',
  'RESOURCE_METHODS': ['GET','POST'],
  'MONGO_HOST': 'caser-mongo',
  'MONGO_PORT': 27017,
  'MONGO_DBNAME': 'caser-library',
  'RESOURCE_METHODS': ['GET','POST'],
  'ITEM_METHODS': ['GET','PUT','PATCH','DELETE'],
  'MULTIPART_FORM_FIELDS_AS_JSON': True,
  'DATE_FORMAT': '%Y-%m-%d %H:%M:%S',
  'DOMAIN': {
    'users': {
      'cache_control': '',
      'cache_expires': 0,
      'allow_unknown': True,
      'additional_lookup': {
        'url': 'regex("[\w]+")',
        'field': 'uid'
      },
      'schema': {
        'uid': {
          'type': 'string',
          'required': True,
          'unique': True
        },
        'name': {
          'type': 'string',
          'required': True,
          'unique': True
        }
      }
    },
    'cases': {
      'allow_unknown': True,
      'schema': {
        'owner': {
          'type': 'objectid',
          'data_relation': {
            'resource': 'users',
            'field': 'uid',
            'embeddable': True
          }
        },
        'title': {
          'type': 'string',
          'required': True
        },
        'state': {
          'type': 'string',
          'default': 'new',
          'allowed': ['new','open','closed','archived','cancelled']
        },
        'findings': {
          'type': 'list',
          'schema': {
            'type': 'objectid',
            'data_relation': {
              'resource': 'findings',
              'field': '_id',
              'embeddable': True
            }
          }
        }
      }
    },
    'findings': {
      'schema': {
        'title': {
          'type': 'string',
          'required': True
        },
        'description': {
          'type': 'string',
          'required': True
        }
      }
    },
    'reports': {
      'allow_unknown': True,
      'schema': {
        'author': {
          'type': 'objectid',
          'required': True,
          'data_relation': {
            'resource': 'users',
            'field': 'name',
            'embeddable': True
          }
        },
        'title': {
          'type': 'string',
          'required': True
        },
        'version': {
          'type': 'number',
          'default': 0
        },
        'state': {
          'type': 'string',
          'allowed': ['working','submit','approved','rejected','cancelled']
        },
        'comments': {
          'type': 'list',
          'schema': {
            'author': {
              'type': 'objectid',
              'required': True,
              'data_relation': {
                'resource': 'users',
                'field': 'name',
                'embeddable': True
              }
            },
            'comment': {
              'type': 'string',
              'required': True
            }
          }
        }
      }
    }
  }
}

app = Eve(settings=settings)

if __name__ == "__main__":
  host = getenv("HOST","0.0.0.0")
  port = int(getenv("PORT","8080"))
  debug = getenv("DEBUG",True)
  app.run(host=host, port=port, debug=debug)

