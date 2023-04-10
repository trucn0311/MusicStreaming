$(document).ready(function () {
  var audio = new Audio("/play_audio");
  var playing = false;
  var current_time = 0;

  //   var artistSpan = document.getElementById("artist-name");

  $("#play-button").click(function () {
    if (!playing) {
      audio.currentTime = current_time;
      audio.play();
      playing = true;
      $("#play-button").hide();
      $("#stop-button").show();
    }
  });

  $("#stop-button").click(function () {
    if (playing) {
      audio.pause();
      current_time = audio.currentTime;
      playing = false;
      $("#play-button").show();
      $("#stop-button").hide();
    }
  });
  if (localStorage.getItem("dark-mode")) {
    // apply the dark mode styles to the relevant elements
    $("#light-mode").hide();
    $("#dark-mode").show();
    $(".brightness").css("background-color", "#161616");
    $(".brightness").css("color", "white");
  }

  $("#light-mode").click(function () {
    $("#light-mode").hide();
    $("#dark-mode").show();
    $(".brightness").css("transition", "background-color 0.5s ease");
    $(".brightness").css("background-color", "#161616");
    $(".brightness").css("color", "white");

    // save the user's preference to localStorage
    localStorage.setItem("dark-mode", true);
  });
  $("#dark-mode").click(function () {
    $("#light-mode").show();
    $("#dark-mode").hide();
    $(".brightness").css("transition", "background-color 0.5s ease");
    $(".brightness").css("background-color", "white");
    $(".brightness").css("color", "#161616");
    // remove the user's preference from localStorage
    localStorage.removeItem("dark-mode");
  });

  var volume = 1; // default volume
  var volumeSlider = document.getElementById("volume-slider");

  // When the volume slider is changed, update the volume and set the audio volume
  volumeSlider.addEventListener("change", function () {
    volume = volumeSlider.value;
    audio.volume = volume;
  });

  $("#more-info").click(function () {
    if ($("#info-links").css("display") === "none") {
      $("#info-links").css("display", "flex");
      $("#info-links").css("flex-direction", "column");
    } else {
      $("#info-links").css("display", "none");
    }
  });
});
// ***********************************************************************************************************************
// Define variables for elements we'll be manipulating
const searchForm = document.querySelector('form[role="search"]');
const searchInput = searchForm.querySelector('input[type="search"]');
const artistList = document.getElementById("artist-list");

// Define a function to handle the form submission
function handleSearch(event) {
  event.preventDefault(); // prevent the default form submission behavior
  $("#artist-list").css("display", "block");

  // Get the user's search query from the input element
  const query = searchInput.value.trim();

  // Use the query to fetch artist suggestions from the Last.fm API
  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.search&api_key=0ad0ac8cebf05b07eb961b5e492be718&artist=${query}&format=json`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Extract the first three artist suggestions from the response
      const artists = data.results.artistmatches.artist.slice(0, 5);

      // Display the artist suggestions to the user
      const suggestions = artists.map((artist) => artist.name);
      const message = `Did you mean: ${suggestions.join(", ")}?`;

      // Create a clickable list of artist names
      artistList.innerHTML = ""; // clear the previous list
      artists.forEach((artist) => {
        const artistLink = document.createElement("a");
        artistLink.innerText = artist.name;
        artistLink.href = "#";
        artistLink.addEventListener("click", () => {
          $("#artist-list").css("display", "none");
          const chosenArtist = artist.name;
          const encodedArtist = encodeURIComponent(chosenArtist);
          const infoUrl = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=0ad0ac8cebf05b07eb961b5e492be718&artist=${encodedArtist}&format=json`;

          fetch(infoUrl)
            .then((response) => response.json())
            .then((data) => {
              var artistName = data.artist.name;
              artistName = artistName.replace(/\s+/g, "%20");
              // replace with your desired artist name
              var songName = "";
              songName = songName.replace(/\s+/g, "%20");

              const url = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=0ad0ac8cebf05b07eb961b5e492be718&artist=${artistName}&track=${songName}&format=json`;

              fetch(url)
                .then((response) => response.json())
                .then((data) => {
                  const track = data.track;
                  const artistName = document.getElementById("artist-name");
                  const artistName2 = document.getElementById("artist-name2");
                  const artistName3 = document.getElementById("artist-name3");
                  const songTitle = document.getElementById("song-name");
                  const songTitle2 = document.getElementById("song-name2");
                  const albumTitle = document.getElementById("album-name");
                  const duration = document.getElementById("song-length");
                  const duration2 = document.getElementById("song-length2");
                  const albumCover = document.getElementById("album-cover");

                  artistName.innerText = `${track.artist.name}`;
                  artistName2.innerText = `${track.artist.name}`;
                  artistName3.innerText = `${track.artist.name}`;
                  songTitle.innerText = `${track.name}`;
                  songTitle2.innerText = `${track.name}`;
                  albumTitle.innerText = `${track.album.title}`;
                  const durationInSeconds = Math.floor(track.duration / 1000); // convert milliseconds to seconds and round down
                  const minutes = Math.floor(durationInSeconds / 60); // get the number of whole minutes
                  const seconds = durationInSeconds % 60; // get the remaining seconds
                  const formattedDuration = `${minutes
                    .toString()
                    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
                  duration.innerText = formattedDuration; // format as mm:ss with leading zeros
                  duration2.innerText = formattedDuration; // format as mm:ss with leading zeros

                  const albumImage = track.album.image.find(
                    (image) => image.size === "extralarge"
                  )["#text"];
                  albumCover.src = albumImage;
                })

                .catch((error) => console.error(error));

              //get artist bio
              $.getJSON(
                `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=0ad0ac8cebf05b07eb961b5e492be718&format=json`,
                function (data) {
                  var bio = data.artist.bio.summary;
                  bio = bio.replace(/Read more on Last.fm/g, "");
                  $("#artist-bio").html(bio);
                }
              );

              //get artist top songs
              $.getJSON(
                `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${artistName}&api_key=0ad0ac8cebf05b07eb961b5e492be718&format=json`,
                function (data) {
                  var tracks = data.toptracks.track.slice(0, 4);
                  var html = "";
                  $.each(tracks, function (index, track) {
                    html +=
                      '<div class="text-center me-5 mb-5 col-lg-5 track p-3 rounded-2">';
                    html += "<h5>" + (index + 1) + ". " + track.name + "</h5>";
                    html += "<p>" + track.artist.name + "</p>";
                    html += "</div>";
                  });
                  $("#top-tracks").html(html);
                }
              );

              function secondsToMinutes(seconds) {
                var minutes = Math.floor(seconds / 60);
                var remainingSeconds = seconds % 60;
                if (remainingSeconds < 10) {
                  remainingSeconds = "0" + remainingSeconds;
                }
                return minutes + ":" + remainingSeconds;
              }

              //get artist' top albums
              $.getJSON(
                `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artistName}&api_key=0ad0ac8cebf05b07eb961b5e492be718&format=json`,
                function (data) {
                  var albums = data.topalbums.album.slice(0, 4);
                  var html = "";
                  $.each(albums, function (index, album) {
                    html +=
                      '<div class="text-center me-5 mb-5 col-lg-5 album p-3 rounded-2">';
                    html +=
                      '<img class="rounded-3 mb-2" src="' +
                      album.image[2]["#text"] +
                      '" />';
                    html += "<h5>" + album.name + "</h5>";
                    html += "<p>" + album.artist.name + "</p>";
                    html += "</div>";
                  });
                  $("#top-albums").html(html);
                }
              );
            })
            .catch((error) => console.error(error));
        });
        const listItem = document.createElement("p");
        listItem.appendChild(artistLink);
        artistList.appendChild(listItem);
      });
    })
    .catch((error) => console.error(error));
}

// Add an event listener to the search form to handle submissions
searchForm.addEventListener("submit", handleSearch);

// *********************************************************
// replace with your desired artist name
