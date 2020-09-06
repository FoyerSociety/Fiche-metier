
$(".hideDiv").hide();
fixParcours();

function showDiv() {
  var i = 0;
  $(".hideDiv:hidden").each(function(){
  if (i==0){
    $(this).show();
  }
  i++;
  });
};

function removeDiv() {
    var i = 1;
    var elInput = $(".hideDiv:visible");
    elInput.each(function(){
        if ((i)==elInput.length){
            $(this).hide();
        }
        i++;
    });
    $(".hideDiv:first").show();
};


function fixParcours(){
  var i = 0;
  $(".hideDiv:hidden").each(function(){
    if (i<3) $(this).show();
    i++;
  });
}


