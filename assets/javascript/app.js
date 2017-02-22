// Initial array of giph Movies
var giphMovies = ["", "The Matrix", "The Notebook", "Mr. Nobody", "The Lion King", "Titanic", "The Accountant", "Homeward Bound"];
var addGiphMovie = [];
var hasRating;
var hasEmbed;
var imgContainer;
var messageAlert;
var clipboard = new Clipboard('.btn');

// Function for capturing and displaying the GIPHY data
function displayMovieGifs() {
          $("#gifsDisplay").empty();
          var addGiphMovie = $(this).attr("data-name");
          var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + addGiphMovie + "&limit=10&api_key=dc6zaTOxFJmzC";

          $.ajax({
                url: queryURL,
                method: "GET"
              })
          .done(function(response) {
          // console.log(response);
                //loops through data to find images and attach data-state/data-still on each image
                for(i = 0; i < response.data.length; i++) {
                  imgContainer = $('<div class="left col-gif"><img class="gif-thumb" alt="" src="' + 
                  response.data[i].images.fixed_width_still.url 
                  + '" data-state="still" data-animate="' + 
                  response.data[i].images.fixed_width.url 
                  + '" data-still="' + 
                  response.data[i].images.fixed_width_still.url 
                  + '" /></div>');

                  // Displays 'copy embed url' button
                  hasEmbed = response.data[i].embed_url;
                  if(response.data[i].embed_url === '') {
                    console.log("no embed_url");
                  } else {
                    imgContainer.prepend('<button id="copyButton" class="btn" data-clipboard-text="' + hasEmbed + '">Copy Embed URL</button>');
                  }

                  // Displays ratings above image
                  hasRating = response.data[i].rating.toUpperCase();
                  if(response.data[i].rating === '') {
                    imgContainer.prepend('<span class="rating">Rated: NR</span>');
                  } else {
                    imgContainer.prepend('<span class="rating">Rated: ' + hasRating + '</span>');
                  }

                  $('#gifsDisplay').append(imgContainer);
                } //end for loop

            $('.gif-thumb').on('click', gifClick); // triggers function to play/pause GIF on click
          })
        
}

//play/pause gif onclick function
function gifClick(event) {
  console.log(event);
  console.log('this data animate ' + $(event.target).data('animate'));
  console.log($(event.target).attr('class'));
  state = $(event.target).attr('data-state'); 
  if (state == 'still'){
        $(event.target).attr('src', $(event.target).data('animate'));
        $(event.target).attr('data-state', 'animate');
    } else {
        $(event.target).attr('src', $(event.target).data('still'));
        $(event.target).attr('data-state', 'still');
    } // end if-else
} // end gifClick

// Function for rendering new buttons created by input
function renderButtons() {

  // (this is necessary otherwise we will have repeat buttons)
  $("#movies-view").empty();

  // Looping through the array of movies
  for (var i = 0; i < giphMovies.length; i++) {

    // Then dynamicaly generating buttons for each movie in the array
    // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
    var a = $("<button>");
    // Adding a class
    a.addClass("movie");
    // Added a data-attribute
    a.attr("data-name", giphMovies[i]);
    // Provided the initial button text
    a.text(giphMovies[i]);
    // Added the button to the HTML
    $("#movies-view").append(a);
  }
}


// This function handles events when add movie/submit button is clicked
$("#add-movie").on("click", function(event) {
  event.preventDefault();
  $("#message").empty();
  // This line grabs the input from the textbox
  addGiphMovie = $("#movie-input").val().trim();
  console.log(addGiphMovie);
  //only graps input if it does not equal any movies already listed
  var foundTitle = false;
  var letters = /^[a-zA-Z]+$/;
  var lettersCheck = false;
  for (var m = 0; m < giphMovies.length; m++) {
    if(addGiphMovie.toUpperCase() == giphMovies[m].toUpperCase()) {

        foundTitle = true;
    } 
  }// The movie from the textbox is then added to giphMovies array
  
  if (foundTitle == true) {
      //message pops up notifying user that the movie already exists in the list or need to add text
      messageAlert = $("<div class='messageAlert'><ul><li>Invalid text entry</li><li>This movie may already be in the Movie List</li></div>");
      $("#message").html(messageAlert);
  }

  else {
      // if input text doesn't match text in any of the 
      //new buttons (addGiphMovie) will push into the giphMovies array
      giphMovies.push(addGiphMovie);
    }

  // calling renderButtons function to render new buttons
  renderButtons();
    // resets or "clears" input text after submit
    $( 'form' ).each(function(){
    this.reset();
  });

});

// Function for displaying the movie GIFs on click of movie name button.
// A click event listener to all elements with the class "movie".
// Event listener for the document itself because it will
// work for dynamically generated elements.
// $(".movies").on("click") will only add listeners to elements that are on the page at that time.
$(document).on("click", ".movie", displayMovieGifs);

// Calling the renderButtons function to display the intial buttons
renderButtons();