<cases>
  <div class="row">
    <div class="col-xs-12">
      <div class="pull-right">
        <a href="#cases/new/edit" class="btn btn-primary">
          New Case
          <span class="fa fa-plus"></span>
        </a>
      </div>

      <h1>Cases</h1>
    </div>

    <riot-table headers={ headers } records={ cases } fetch={ fetch } record_buttons={ record_buttons }></riot-table>
  </div>

  <script>
    var self = this
    this.cases = opts.cases || []

    this.headers = opts.headers || {
      title: { template: "<a href='/#cases/{ _id }'>{ title }</a>" },
      state: { template: "<h5>{ hashColorLabel(state) }</h5>" },
      description: { template: "{ description.length > 100 ? description.split(' ').slice(0,15).join(' ')+'...' : description }" },
      owner: {
        text: "ASSIGNED TO",
        tag: "select-user",
        options: {
          field: "owner",
          fetch: function(cb) {
            riot.api.cache('/users', function(resp) {
              cb(resp);
            })
          }
        }
      }
    }

    this.record_buttons = opts.record_buttons || [
      { text: "Edit", fa: "pencil", event: "case:edit", href: function(record) { return '/cases/'+record._id+'/edit' }},
      { text: "Delete", fa: "trash", event: "case:delete" }
    ]

    this.fetch = function(cb) { riot.api.get("/cases", cb) }

    this.on('case:edit', function(record) {
      riot.route('/cases/'+record._id+'/edit')
    })

    this.on('user:selected', function(resp) {
      console.log("user selected: ", resp)
      resp.record.owner = resp.value;
      riot.api.save("/cases/"+resp.record._id, resp.record, function(res) {
        console.log("set case owner: ", res)
      })
    })

    this.on('case:delete', function(record) {
      var a = confirm('Are you sure you want to delete Case ' + record.title + '?')
      if(a) {
        riot.api.delete('/cases/'+record._id, record, function() {
          self.tags['riot-table'].reload()
        })
      }
    })

  </script>
</cases>
