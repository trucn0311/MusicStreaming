$(document).ready(function () {
  var audio = new Audio("/play_audio");
  var playing = false;
  var current_time = 0;
  var durationSpan = document.getElementById("duration");

  //   var artistSpan = document.getElementById("artist-name");

  audio.addEventListener("loadedmetadata", () => {
    const duration = audio.duration;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);

    durationSpan.innerText = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  });

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
});
