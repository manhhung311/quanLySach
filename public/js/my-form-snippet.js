define([
       "class",
       "views/snippet", 
], function(
  Class,
  SnippetView
){
  return SnippetView.extend({
    init: function(options){
    	this._super(options);
        
        // class name is actually not needed;
        this.clsname = "MyFormSnippetView";
        this.parentModel = this.options.parentModel;
        this.options = _.omit(this.options, 'parentModel');
    },
    
    events:{
      "click"   : "preventPropagation" //stops checkbox / radio reacting.
      , "mousedown" : "mouseDownHandler"
      , "mouseup"   : "mouseUpHandler"
    }, 
    
    mouseDownHandler : function(mouseDownEvent){
      mouseDownEvent.stopPropagation();
      mouseDownEvent.preventDefault();
      var that = this;
      //popover
      $(".popover").remove();
      this.$el.popover("show");
      $(".popover #save").on("click", this.saveHandler(that));
      $(".popover #cancel").on("click", this.cancelHandler(that));
      //add drag event for all but form name
      if(this.model.get("title") !== "Form Name"){
        $("body").on("mousemove", function(mouseMoveEvent){
          if(
            Math.abs(mouseDownEvent.pageX - mouseMoveEvent.pageX) > 10 ||
            Math.abs(mouseDownEvent.pageY - mouseMoveEvent.pageY) > 10
          ){
            that.$el.popover('dispose');
            $("#build > form > fieldset").trigger("mySnippetDrag", [mouseDownEvent, 
                                                  that.model, {at: that.$el.index()}]);
            that.mouseUpHandler();
          };
        });
      }
    }, 
    
    preventPropagation: function(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    
    mouseUpHandler : function(mouseUpEvent) {
        $("body").off("mousemove");
    },
    
    saveHandler : function(boundContext) {
      return function(mouseEvent) {
        mouseEvent.preventDefault();
        var fields = $(".popover .field");
        _.each(fields, function(e){

          var $e = $(e), 
              type = $e.attr("data-type"), 
              name = $e.attr("id");

          switch(type) {
            case "checkbox":
              boundContext.model.setField(name, $e.is(":checked"));
              break;
            case "input":
              boundContext.model.setField(name, $e.val());
              break;
            case "textarea":
              boundContext.model.setField(name, $e.val());
              break;
            case "textarea-split":
              boundContext.model.setField(name,
                _.chain($e.val().split("\n"))
                  .map(function(t){return $.trim(t)})
                  .filter(function(t){return t.length > 0})
                  .value()
                  );
              break;
            case "select":
              var valarr = _.map($e.find("option"), function(e){
                return {value: e.value, selected: e.selected, label:$(e).text()};
              });
              boundContext.model.setField(name, valarr);
              break;
          }
        });
        boundContext.parentModel.change(boundContext.model, 
                         {at:boundContext.$el.index()});
        $(".popover").remove();
      }
    }, 
    
    cancelHandler : function(boundContext) {
      return function(mouseEvent) {
        mouseEvent.preventDefault();
        $(".popover").remove();
        //boundContext.model.trigger("change");
      }
    }

  });
});