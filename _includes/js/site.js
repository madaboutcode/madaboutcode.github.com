(function($){
  $(function(){
    $('a.popup').click(function(e){
      e.preventDefault();
      var newWindow = window.open($(this).attr('href'), 'popup', 'height=500,width=900');
      if (window.focus) { newWindow.focus(); }
    });
  })
})(jQuery);
