

$(function() {
    $('button.navbar-toggle').click(function(){ 
        $('.navbar-collapse').show('fast',function(){});
        $('.mobile-nav-mask').show('fast', function() {});
    });

    $('.mobile-nav-mask').click(function() {
          
        $('.mobile-nav-mask').hide('fast', function() {});
        $('.navbar-collapse').hide('fast', function() {});
  });
   
  
});


