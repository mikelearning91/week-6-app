// Global Variables
// Initial array of giph Movies
var giphMovies = ["", "The Matrix", "The Notebook", "Mr. Nobody", "The Lion King", "Titanic", "The Accountant", "Homeward Bound"];
// New movie typed into search input
var addGiphMovie = [];
// Rating data
var hasRating;
// Iframe url
var hasEmbed;
// Container for giph data
var imgContainer;
// Error message for invalid input into search input
var messageAlert;
// Copy to clipboard for iframe url
var clipboard = new Clipboard('.btn');

// Function for capturing and displaying the GIPHY data
function displayMovieGifs() {
          $("#gifsDisplay").empty(); // Will empty gif display area on each new movie button click
          var addGiphMovie = $(this).attr("data-name");
          var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + addGiphMovie + "&limit=10&api_key=dc6zaTOxFJmzC";
          // Ajax call to giphy api
          $.ajax({
                url: queryURL,
                method: "GET"
              })
          .done(function(response) {
          // console.log(response); --> Use this to console.log all giph data

                // Loops through data to find images and attach data-state/data-still on each image
                for(i = 0; i < response.data.length; i++) {
                  imgContainer = $('<div class="left col-gif"><img class="gif-thumb" alt="" src="' + 
                  response.data[i].images.fixed_width_still.url 
                  + '" data-state="still" data-animate="' + 
                  response.data[i].images.fixed_width.url 
                  + '" data-still="' + 
                  response.data[i].images.fixed_width_still.url 
                  + '" /></div>');

                  // Displays 'copy iframe' button above each image
                  hasEmbed = "<iframe src='" + response.data[i].embed_url + "' width='480' height='215' frameBorder='0' class='giphy-embed' allowFullScreen></iframe>";
                  if(response.data[i].embed_url === '') {
                    console.log("no embed_url");
                  } else {
                    imgContainer.prepend('<button id="copyButton" class="btn" data-clipboard-text="' + hasEmbed + '">Copy iframe</button>');
                  }

                  // Displays ratings above each image
                  hasRating = response.data[i].rating.toUpperCase();
                  if(response.data[i].rating === '') {
                    imgContainer.prepend('<span class="rating">Rated: NR</span>');
                  } else {
                    imgContainer.prepend('<span class="rating">Rated: ' + hasRating + '</span>');
                  }

                  $('#gifsDisplay').hide().append(imgContainer).fadeIn('fast');
                } // End for loop
            // This will hide the "tip" on .movie click
            $("#tip").fadeOut('fast');
            $('.gif-thumb').on('click', gifClick); // calls function to play/pause GIF on click
          }) // End ajax response function
        
} // End function

// Play/pause gif onclick function
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
    } // End if-else
} // End gifClick

// Function for rendering new buttons created by text/search input
function renderButtons() {

  // Necessary otherwise there will be repeat buttons everytime a new button is added)
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
  } // End for loop
} // End function


// This function handles events when "GO"/submit button is clicked
$("#add-movie").on("click", function(event) {
  event.preventDefault();
  $("#message").empty();
  // This line grabs the input from the textbox
  addGiphMovie = $("#movie-input").val().trim();
  console.log(addGiphMovie);
  // Only graps input if it does not equal any movies already listed
  var foundTitle = false;
  for (var m = 0; m < giphMovies.length; m++) {
    if(addGiphMovie.toUpperCase() == giphMovies[m].toUpperCase()) {

        foundTitle = true;
    } // End if
  }// End for loop
  
  if (foundTitle == true) {
      // Message pops up notifying user that the movie already exists in the list or need to add text tot he search input
      messageAlert = $("<div class='messageAlert'><ul><li>Invalid text entry</li><li>This movie may already be in the Movie List</li></div>");
      $("#message").html(messageAlert);
  } // End if

  else {
      // If input text doesn't match text in any of the 
      // New buttons (addGiphMovie) will push into the giphMovies array and create a new button
      giphMovies.push(addGiphMovie);
    } // End else

  // Calling function to render new buttons
  renderButtons();
    // Resets or "clears" input text after submit
    $( '#movie-form' ).each(function(){
    this.reset();
  }); // End reset form function

}); // End onclick function

// Hide directions on first movie click


// Function for displaying the movie GIFs on click of movie name button.
// A click event listener to all elements with the class "movie".
// Event listener for the document itself because it will
// work for dynamically generated elements.
// $(".movies").on("click") will only add listeners to elements that are on the page at that time.
$(document).on("click", ".movie", displayMovieGifs);

// Calling the renderButtons function to display the intial buttons
renderButtons();