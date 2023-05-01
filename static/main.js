$(document).ready(function () {
  if (localStorage.getItem("dark-mode")) {
    // apply the dark mode styles to the relevant elements
    $("#light-mode").hide();
    $("#dark-mode").show();
    $(".brightness").css("background", "#161616");
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
  const link = document.querySelector(".chosen-song");
  link.addEventListener("click", chooseSong);

  var audio = new Audio();
  var playing = false;
  var current_time = 0;
  const socket = io.connect('{{ url_for("socketio") }}');

  $("#more-info").click(function () {
    if ($("#info-links").css("display") === "none") {
      $("#info-links").css("display", "flex");
      $("#info-links").css("flex-direction", "column");
    } else {
      $("#info-links").css("display", "none");
    }
  });

  // ***********************************************************************************************************************
  // get song's info

  function chooseSong() {
    var musicMetadata = document.querySelector(".music-metadata");
    musicMetadata.style.display = "flex";
    const text = $("#song-path").text();
    const imagePath = $("#image-path").text();
    const songName = $("#song-name-path").text();
    const songPath = text.split("is")[1].trim().replace("/static", "");
    var decodedFilePath = decodeURIComponent(songPath);
    const songNameaa = decodedFilePath
      .split("/")
      .pop()
      .replace(".mp3", "")
      .trim();
    var encodedSongName = encodeURIComponent(songNameaa);
    const text2 = $("#artist-path").text();
    var encodedArtistName = encodeURIComponent(text2);

    const albumCover = document.getElementById("album-cover");
    albumCover.src = imagePath;
    const songTitle = document.getElementById("song-name");
    songTitle.innerText = `${songName}`;
    const artistName = document.getElementById("artist-name");
    artistName.innerText = `${text2}`;

    function seekTo() {
      // get the slider element
      var slider = document.getElementById("seek-slider");

      // calculate the new time value
      var duration = audio.duration;
      var time = (slider.value * duration) / 100;

      // set the current time of the audio element
      audio.currentTime = time;

      // update the current time display
      var currentTimeDiv = document.getElementById("current-time");
      currentTimeDiv.innerHTML = formatTime(time);
    }

    function formatTime(time) {
      // convert time in seconds to minutes:seconds format
      var minutes = Math.floor(time / 60);
      var seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
    //playing song function
    function playSong() {
      if (!playing) {
        audio.src = decodedFilePath;
        audio.load();
        audio.currentTime = current_time;
        audio.addEventListener("loadedmetadata", () => {
          const duration = audio.duration;
          const minutes = Math.floor(duration / 60)
            .toString()
            .padStart(2, "0");
          const seconds = Math.floor(duration % 60)
            .toString()
            .padStart(2, "0");
          $("#song-length1").text(`${minutes}:${seconds}`);
          $("#song-length2").text(`${minutes}:${seconds}`);
        });
        audio
          .play()
          .then(() => {
            playing = true;
            $("#play-button").hide();
            $("#stop-button").show();
            socket.emit("play_song", decodedFilePath);
          })
          .catch((error) => {
            console.error("Failed to play audio:", error);
          });
      }
    }

    $("#play-button").click(playSong);

    $("#stop-button").click(function () {
      audio.pause();
      current_time = audio.currentTime;
      playing = false;
      $("#play-button").show();
      $("#stop-button").hide();
      socket.emit("stop_song");
    });

    // Trigger play button when the anchor tag is clicked
    $(".chosen-song")
      .on("click", function (event) {
        event.preventDefault();
        playSong();
      })
      .trigger("click");

    // Update the slider when the audio is playing
    audio.addEventListener("timeupdate", function () {
      var slider = document.getElementById("seek-slider");
      var value = (100 / audio.duration) * audio.currentTime;
      slider.value = value;
      var currentTimeDiv = document.getElementById("current-time");
      currentTimeDiv.innerHTML = formatTime(audio.currentTime);
    });

    // Allow the user to seek to a specific point in the audio by clicking the slider
    var slider = document.getElementById("seek-slider");
    slider.addEventListener("click", function (event) {
      var duration = audio.duration;
      var clickX = event.clientX - slider.offsetLeft;
      var percent = (clickX / slider.offsetWidth) * 100;
      var time = (duration * percent) / 100;
      audio.currentTime = time;
    });
    //get the album where the song is from and display it
    $.getJSON(
      `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=0ad0ac8cebf05b07eb961b5e492be718&artist=${encodedArtistName}&track=${encodedSongName}&format=json`,

      function (data) {
        const track = data.track;
        const albumTitle = document.getElementById("album-name");
        const albumCover = document.getElementById("album-cover");

        albumTitle.innerText = `${track.album.title}`;
        const albumImage = track.album.image.find(
          (image) => image.size === "extralarge"
        )?.["#text"];
        albumCover.src = albumImage;
      }
    );
    // //get artist(s) of the song and fetch their top songs
    $.getJSON(
      `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${encodedArtistName}&api_key=0ad0ac8cebf05b07eb961b5e492be718&format=json`,
      function (data) {
        var tracks = data.toptracks.track.slice(0, 4);
        var html = "";
        $.each(tracks, function (index, track) {
          $.getJSON(
            `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=0ad0ac8cebf05b07eb961b5e492be718&artist=${encodeURIComponent(
              track.artist.name
            )}&track=${encodeURIComponent(track.name)}&format=json`,
            function (data) {
              var duration = data.track.duration;
              var album = data.track.album.title;
              html += '<div class=" row col-lg-12 track p-2 rounded-2 ">';
              html +=
                '<div class="col-lg-4 d-flex flex-column justify-content-start">';
              html += "<div>" + track.name + "</div>";
              html +=
                "<p class='ms-1 fw-lighter'>" + track.artist.name + "</p>";
              html += "</div>";
              html +=
                "<div class='col-lg-5 d-flex justify-content-end fw-lighter'>" +
                album +
                "</div>";
              const durationInSeconds = Math.floor(duration / 1000); // convert milliseconds to seconds and round down
              const minutes = Math.floor(durationInSeconds / 60); // get the number of whole minutes
              const seconds = durationInSeconds % 60; // get the remaining seconds
              const formattedDuration = `${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
              html +=
                "<p class='col-lg-3 d-flex justify-content-end'>" +
                formattedDuration +
                "</p>";
              html += "</div>";
              $("#top-tracks").html(html);
            }
          );
        });
      }
    );

    // get artist bio and top albums
    $.when(
      $.getJSON(
        `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodedArtistName}&api_key=0ad0ac8cebf05b07eb961b5e492be718&format=json`
      ),
      $.getJSON(
        `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodedArtistName}&api_key=0ad0ac8cebf05b07eb961b5e492be718&format=json`
      )
    ).done(function (infoData, topAlbumsData) {
      const artistName3 = document.getElementById("artist-name3");
      artistName3.innerText = `${infoData[0].artist.name}`;
      var bio = infoData[0].artist.bio.summary;
      bio = bio.replace(/Read more on Last.fm/g, "");
      $("#artist-bio").html(bio);

      var albums = topAlbumsData[0].topalbums.album.slice(0, 4);
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
    });
  }
});
