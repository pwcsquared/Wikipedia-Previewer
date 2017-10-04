$(document).ready(function(){
  var openFrame = false;
  $("#search").css("animation-play-state","paused");

  //event listeners to control css animations
  document.addEventListener("animationiteration",animEvent);
  function animEvent(event){
    if (event.target.id === "search"){
      $("#search").css("animation-play-state","paused");
      if (openFrame){
        $(".results").css("display","initial");
      }
    } else if (event.target.id === "mark1"){
      $("#mark1, #mark2").css("animation-play-state","paused");
    }
  };

  //clicking the checkmark/x and pressing enter on the input do the same thing
  $("#check").click(function(){
    displayResults();
  });

  $("input").keydown(function(event){    
    if(event.which == 13){
      displayResults();
    }
  });

  //function to control the animation and display of API data
  var displayResults = function(){
    var playState = $("#search").css("animation-play-state");
    var searchTerm = $("input").val();
    if (playState !== "running" && searchTerm && !openFrame){
      $("#search").addClass("expand");
      $("#mark1").addClass("spin1");
      $("#mark2").addClass("spin2");
      $("#search, #mark1, #mark2").css("animation-play-state","running");
      wikiSearch();
      openFrame = true;
    } else if (playState !== "running" && openFrame){
      $(".results").css("display","none").empty();
      $("#search, #mark1, #mark2").css("animation-play-state","running");
      openFrame = false;
    }
  };

  //function to make API call
  function wikiSearch(){
    var searchTerm = $("input").val();
    $.ajax({
    url: "https://en.wikipedia.org/w/api.php?&action=query&format=json&callback=?&list=search&srsearch=" + searchTerm,
    dataType: 'json',
    type: 'GET',
    success: function(data) {
      for (i = 0; i < data.query.search.length; i++){
        var title = data.query.search[i].title;
        var linkTitle = title.replace(/\s/g, "_");
        var link = "https://en.wikipedia.org/wiki/" + linkTitle;
        var snippet = data.query.search[i].snippet;
        $(".results").append("<a href=" + link + ' target="_blank"><div class="resultBox"><h2>' + title + "</h2><p>" + snippet + "..." + "</p></div></a>")
        }
      }
    });
  }    
});