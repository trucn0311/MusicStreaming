let nowPlaying = document.querySelector('.now-playing');
let trackArt = document.getElementById('track-art');
let trackName = document.querySelector('.track-name');
let trackArtist = document.querySelector('.track-artist');

let play_pause = document.querySelector('.playpause-track');
let next_Track = document.querySelector('.next-track');
let prev_Track = document.querySelector('.prev-track');

let seek_slider = document.getElementById('seek-slider');
let volume_slider = document.querySelector('.volume_slider');

let currentTime = document.getElementById('current-time');
let duration = document.getElementById('total-duration');

//let wave = document.getElementById('wave');
let currentTrack = document.createElement('audio');
document.body.appendChild(currentTrack);

let playButton = document.getElementById('play-button');

let index = 0;
let isPlaying = false;
let isRandom = false;
let updateTime;




const songChoices = [
    {
        img : 'static/Back 2 Boston.jpg',
        name :'Back 2 Boston',
        artist : 'Jvy Rvre',
        music: 'static/Back 2 Boston.wav'

    },
    {
        img : 'static/Café rough.jpg',
        name :'Café rough',
        artist : 'Jvy Rvre',
        music: 'static/Café rough.wav'

    },
    {
        img : 'static/Call On.jpg',
        name :'Call On',
        artist : 'Jvy Rvre',
        music: 'static/Call On.wav'

    },
    {
        img : 'static/Mixed Signals.jpg',
        name :'Mixed Signals',
        artist : 'Jvy Rvre',
        music: 'static/Mixed Signals.wav'

    },
    {
        img : 'static/Reminiscing.jpg',
        name :'Reminiscing',
        artist : 'ImDrssd',
        music: 'static/Reminiscing.wav'

    },
    {
        img : 'static/Serenity.jpg',
        name :'Serenity',
        artist : 'HashBrown',
        music: 'static/Serenity.wav'

    },
];


loadTrack(index);

function loadTrack(index){
    clearInterval(updateTime);
    reset();

    console.log(currentTrack);

    currentTrack.src = songChoices[index].music;
    currentTrack.innerHTML = `<source src="${currentTrack.src}" type="audio/wav">`

    console.log(currentTrack.src);
    currentTrack.load();

    trackArt.src =  songChoices[index].img;
    console.log(trackArt.src);

    trackName.textContent = songChoices[index].name;
    trackArtist.textContent = songChoices[index].artist;
    nowPlaying.textContent = "Playing " + (index+ 1) + " of " + songChoices.length;

    updateTime = setInterval(seekUpdate , 1000);

    currentTrack.addEventListener('ended' , nextTrack);

  

}



function reset (){
    if(currentTime === null){
    currentTime.textContent = "00:00";
    duration.textContent = "00:00";
    seek_slider.value = 0;
    }
}

function randomTrack (){
    random ? pauseRandom() : playRandom();
}

function playRandom(){
    israndom = true;
    //randomIcon.classList.add('randomActive');
}

function pauseRandom(){
    random = false;
    //randomIcon.classList.remove('randomActive');
}
function repeatTrack(){
    let currentTrack = index;
    loadTrack(currentTrack);
    playTrack();
}
function playPauseTrack(){
    console.log('PlayPause Button Clicked');
    isPlaying ? pauseTrack() : playTrack();
}



function playTrack(){
    console.log(`Attempting to play ${currentTrack.src}`);
    currentTrack.play();
    isPlaying = true;
    trackArt.classList.add('rotate');
    //wave.classList.add('loader');
    play_pause.classList.remove('bi-play-circle');
    play_pause.classList.add('bi-pause-circle');

}

function pauseTrack(){
    currentTrack.pause();
    isPlaying = false;
    trackArt.classList.remove('rotate');
   // wave.classList.remove('loader');
    play_pause.classList.remove('bi-pause-circle');
    play_pause.classList.add('bi-play-circle');
}

function nextTrack(){
    
    if(index < songChoices.length -1 ){
        index+=1;
    }else{
        index = 0;
    }
    loadTrack(index);
    playTrack();
}

function prevTrack(){
    
    if(index > 0 ){
        index-=1;
    }else{
        index = songChoices.length-1;
    }
    loadTrack(index);
    playTrack();
}

function seekTo(){
    let seekTo = currentTrack.duration * (seek_slider.value / 100);
    currentTrack.currentTime = seekTo;
}
function setVolume(){
    currentTrack.volume = volume_slider.value / 100;
}

function seekUpdate(){
    let seekPos = 0;

    if(!isNaN (currentTrack.duration)){
        seekPos = currentTrack.currentTime * (100 / currentTrack.duration);
        seek_slider.value = seekPos;

        let currentMins = Math.floor(currentTrack.currentTime / 60);
        let currentSecs = Math.floor(currentTrack.currentTime  - currentMins * 60);
        let durationMins = Math.floor(currentTrack.duration /60);
        let durationSecs = Math.floor(currentTrack.duration - durationMins * 60); 

        if(currentSecs < 10 ){currentSecs = "0" + currentSecs;}
        if(durationSecs < 10 ){durationSecs = "0" + durationSecs;}
        if(currentMins < 10 ){currentMins = "0" + currentMins;}
        if(durationMins < 10 ){durationMins = "0" + durationMins;}


        currentTime.textContent = currentMins + ":" + currentSecs;
        duration.textContent = durationMins + ":" + durationSecs;


    }
}



