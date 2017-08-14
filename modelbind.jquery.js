(function( $ ) {

  var ModelBind = function(context, config) {
    var CONFIG = {
      autoUpdate: true,
      bindAttribute: "id"
    };

    var MODEL = config.model;

    var AUTO_UPDATE = config.autoUpdate;

    $.extend(CONFIG, config);

    this.init = function() {
      var self = this;
      this.updateForm();

      if(AUTO_UPDATE) {
        $elems = this.getElems();

        // Add listeners to all form fields
        $elems.change(function(){
          self.updateModel();
        });

        // Add listeners to all properties of the model
        $.each(MODEL, function(k,v){
          Object.defineProperty(MODEL, k, {set: function(a){
            v = a;
            $("["+CONFIG.bindAttribute+"="+k+"]").val(a);
          }});
          Object.defineProperty(MODEL, k, {get: function(a){ return v;  }});
        });
      }

      return context;
    };

    this.getElems = function() {
      return $(context).find("input[type=text],input[type=radio],input[type=checkbox],select,textarea");
    };

    this.updateModel = function() {
      var $elems = this.getElems();
      $elems.each(function(i,v){
        MODEL[$(v).attr(CONFIG.bindAttribute)] = $(this).val();
      });
    };

    this.updateForm = function() {
      var $elems = this.getElems();
      $elems.each(function(i,v){
        $(this).val( MODEL[$(v).attr(CONFIG.bindAttribute)] );
      });
    };

    this.getModel = function() {
      return MODEL;
    };

  }

  $.fn.modelbind = function() {

    var instance = $(this).data("instance");

    if (typeof instance === "undefined") {
        instance = new ModelBind(this, arguments[0]);
        var newContext = instance.init();
        $(newContext).data("instance", instance);
    } else {
        // Call any of the "public" functions. If you add a public function
        // in the widget, it should be added here to expose it to the user
        if (typeof arguments[0] === "string") {
            if (arguments[0] === "updateModel") {
                instance.updateModel();
            } else if (arguments[0] === "updateForm") {
                instance.updateForm();
            } else if (arguments[0] === "getModel") {
                return instance.getModel();
            }
        }
    }
  }
})( jQuery );
