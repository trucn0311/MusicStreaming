function playTrack (current_song , isPlaying){
    console.log(`Now Playing ${current_song}`);
    isPlaying = true;

    return isPlaying;
}

function pauseTrack(current_song , isPlaying){
    console.log(`Pausing the song ${current_song}`);
    isPlaying = false;

    return isPlaying;
}

function loadTrack (current_song){
    let title = current_song;
    let art =`${current_song}.jpg`;
    let artist = 'Song Artist';

    return `${title} by ${artist} is loaded with cover art ${art}`;
}

//Starting from zero
function nextTrack(song_list){
    let index = 0;
    return song_list[index + 1];
}

function prevTrack(song_list){
    let index = 0;
    
    return song_list[song_list.length - 1];
}

function setVolume(volume){
    
    let newValue = volume / 2;

    return newValue;
    
}

function seekTo(durationSecs , slider_pos){
    let movePointer = durationSecs * (slider_pos / 100);
    return movePointer;
}

//takes in the seconds and then changes to mins : secs format
function timeConversion(currentTime){
    let minutes = Math.floor(currentTime /60);
    let seconds = Math.floor(currentTime - minutes * 60);

    return `${minutes}:${seconds}`;

}


describe('Song Player', () => {
    const song_list = ['Timeless' , 'Hey Ya!' , 'Temperature']; 
   

    it('song is playing', () => {
        let isPlaying = false;
        const songName = "Unforgettable";

        isPlaying = playTrack(songName , isPlaying);

        expect(isPlaying).toBe(true);
    });

    it('song is paused' , () => {
        let isPlaying = true;
        const songName = "Unforgettable";

        isPlaying = pauseTrack(songName , isPlaying);

        expect(isPlaying).toBe(false);
    });

    it('switching to next track' , () => {
        let current_song = song_list[0];
        current_song = nextTrack(song_list);

        expect(current_song).toBe('Hey Ya!');
    });

    it('switching to previous track' , () => {
        let current_song = song_list[0];
        current_song = prevTrack(song_list);

        expect(current_song).toBe('Temperature');
    });

    song_list.forEach((song) => {
        it(`Song ${song} is Loaded`, () => {
            const result = loadTrack(song);
            expect(result).toBe(`${song} by Song Artist is loaded with cover art ${song}.jpg`)
        });
    });


    it('Changing the Volume', () => {
        let parameter = 1;
        parameter = setVolume(parameter);

        expect(parameter).toBe(0.5);
    });

    it('Changing the Volume', () => {
        let parameter = 2;
        parameter = setVolume(parameter);

        expect(parameter).toBe(1);
    });

    it('Changing the Volume', () => {
        let parameter = .5;
        parameter = setVolume(parameter);

        expect(parameter).toBe(0.25);
    });


    it('Moving the slider' , () => {
        let duration = 150;
        let position = 20;
        let timeElapsed = 0;

        timeElapsed = seekTo(duration , position);

        expect(timeElapsed).toBe(30);

    });

    it('Moving the slider' , () => {
        let duration = 180;
        let position = 40;
        let timeElapsed = 0;

        timeElapsed = seekTo(duration , position);

        //72 secs would be 1:12 for the time
        expect(timeElapsed).toBe(72);

    });

    it('Formatting the Time' , () => {
        let timeElapsed = 72;
        let display = '00:00';

        display = timeConversion(timeElapsed);

        expect(display).toBe('1:12');
        
    });

    it('Formatting the Time' , () => {
        let timeElapsed = 30;
        let display = '00:00';

        display = timeConversion(timeElapsed);

        expect(display).toBe('0:30');
        
    });

    it('Formatting the Time' , () => {
        let timeElapsed = 95;
        let display = '00:00';

        display = timeConversion(timeElapsed);

        expect(display).toBe('1:35');
        
    });


});