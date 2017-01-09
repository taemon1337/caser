<case-edit>
  <div class="row">
    <div class="col-xs-12">
      <form onsubmit={ save } class="form-horizontal">
        <form-group label="Id">
          <input type="text" readonly class="form-control" value={ parent.case._id }>
        </form-group>

        <form-group label="Case Title">
          <input onchange={ parent.fieldChange } type="text" class="form-control" placeholder="case title or issue number..." name="title" value={ parent.case.title }>
        </form-group>

        <form-group label="Case Description">
          <textarea onchange={ parent.fieldChange } class="form-control" rows=4 name="description" placeholder="summary or description">{ parent.case.description }</textarea>
        </form-group>

        <form-group>
          <button type="submit" class="btn btn-primary">Save</button>
          <button onclick={ parent.cancel } type="button" class="btn btn-default">Cancel</button>
        </form-group>
      </form>
    </div>
  </div>

  <script>
    var self = this
    this.case = opts.case

    this.save = function() {
      var url = self.case._id ? "/cases/"+self.case._id : "/cases"
      riot.api.save(url, self.case, function(record) {
        console.log("SAVED: ", record)
        self.update({ case: record })
      })
    }

    this.fieldChange = function(e) {
      console.log('FIELD CHANGE: ', e.target.name, $(e.target).val())
      self.case[e.target.name] = $(e.target).val()
      self.update({ case: self.case })
    }

    this.cancel = function() {
      window.history.back()
    }
  </script>
</case-edit>
