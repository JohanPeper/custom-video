const video = document.querySelector('.player--video');
const playIcon = document.querySelector('.play-icon');
const playBtn = document.querySelector('.play-btn');
const playerControls = document.querySelector('.player--controls');
const progress = document.querySelector('.progress');
const volumeSlider = document.querySelector('.volume');
const volumeIcon = document.querySelector('.volume-icon');
const skipBtns = document.querySelectorAll("[data-skip]");
let curVol = video.volume;
let curVideoTime = Math.round(video.currentTime * 100);
let root = document.documentElement;

function showControls () {
    playerControls.style.display = 'flex';
}

function togglePlay() {
    changePlayIcon();

    if (video.paused || video.ended) {
        video.play();
        playBtn.style.display = 'none';
        return;
    }

    video.pause();
    playBtn.style.display = 'block';
};

function changePlayIcon() {
    if (video.paused || video.ended) {
        playIcon.style.cssText = 'background : no-repeat url(./assets/img/pause.svg);'
        return;
    }

    playIcon.style.cssText = 'background : no-repeat url(./assets/img/play.svg);';
};

function handleProgress() {
    const progressValue = Math.round((video.currentTime / video.duration) * 1000);
    progress.value = `${progressValue}`;
    let proValPrc = progressValue/10; // Progress value in percent

    //Different color of the progress bar before and after the slider
    root.style.setProperty('--currentVideoTime', proValPrc + '%' );
    progress.style.cssText =  'background: linear-gradient(to right,rgb(20, 1, 36) 0%,rgb(20, 1, 36) var(--currentVideoTime), rgb(109, 107, 107) 1%,  rgb(43, 41, 41) 100%);'

    if (video.ended) {
        progress.value = '0';
        video.pause();
        playIcon.style.cssText = 'background : no-repeat url(./assets/img/play.svg);'
    }
}

function scrub(e) {
    const scrubTime = (e.offsetX / progress.max) * video.duration;
    video.currentTime = scrubTime;
}

function volumeChange(e) {
    video.volume = volumeSlider.value / 100;
        curVol = video.volume;
        let curVolPrc = curVol * 100;
    if(video.volume < 0.01) {
        video.volume = 0;
        volumeIcon.style.cssText = 'background : no-repeat url(./assets/img/mute.svg);'
        return
    }
    video.volume = curVol;
    volumeIcon.style.cssText = 'background : no-repeat url(./assets/img/volume.svg);'     

    root.style.setProperty('--currentVolume', curVolPrc + '%' );
    volumeSlider.style.cssText =  'background: linear-gradient(to right, rgb(20, 1, 36) 0%,rgb(20, 1, 36) var(--currentVolume), rgb(109, 107, 107) 1%,  rgb(43, 41, 41) 100%);'
}

function muteIcon () { 
    if(video.volume > 0.01){
        curVol = video.volume;
        video.volume = 0;
        volumeIcon.style.cssText = 'background : no-repeat url(./assets/img/mute.svg);'
        return
    }
    video.volume = curVol;
    volumeIcon.style.cssText = 'background : no-repeat url(./assets/img/volume.svg);'    
}

function handleSkip() {
    video.currentTime += +this.dataset.skip;
}

playBtn.addEventListener('click',showControls);
video.addEventListener("click", togglePlay);
playIcon.addEventListener("click", togglePlay);
playBtn.addEventListener('click',togglePlay);
video.addEventListener("timeupdate", handleProgress);

let isMouseDown = false;

progress.addEventListener("mousedown", () => (isMouseDown = true));
progress.addEventListener("mousemove", (e) => isMouseDown && scrub(e));
progress.addEventListener("mouseup", () => (isMouseDown = false));
progress.addEventListener('click', scrub);

volumeSlider.addEventListener('change', volumeChange);
volumeSlider.addEventListener('input', volumeChange);
volumeIcon.addEventListener('click',muteIcon);

skipBtns.forEach((btn) => {
    btn.addEventListener("click", handleSkip);
});

document.addEventListener("keydown", function (e) {
    if (e.code === 'Space') {
        togglePlay();
    }
});

volumeChange();
handleProgress()
