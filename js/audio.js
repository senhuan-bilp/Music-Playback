var body = document.body;
var playPause = document.getElementsByClassName("playPause")[0];
var audio = document.getElementById("audioTag");
var recordImg = document.getElementById("record-img");
var beforeMusic = document.getElementsByClassName("beforeMusic")[0];
var nextMusic = document.getElementsByClassName("nextMusic")[0];
//歌曲信息
var musicTitle = document.getElementsByClassName("music-title")[0];
var authorName = document.getElementsByClassName("author-name")[0];
//播放时间
var playedTime = document.getElementsByClassName("played-time")[0];
var totalTime = document.getElementsByClassName("audio-time")[0];
//进度条
var progressPlay = document.getElementsByClassName("progress-play")[0];
//播放模式
var playMode=document.getElementsByClassName('playMode')[0];
//音量
var volume=document.getElementsByClassName('volumn')[0];
var volumnTogger=document.getElementById('volumn-togger');
//倍速
var speed=document.getElementById('speed');
//列表
var closeContainer=document.getElementsByClassName('colse-container')[0];
var listContainer=document.getElementsByClassName('list-container')[0];
var listIcon=document.getElementById('list');
var musicLists=document.getElementsByClassName('musicLists')[0];
//歌曲名称
var musicsData = [['郑曼莉', '25216950602'], ['Yesterday', 'Alok/Safi Tukker'], ['江南烟雨色', '杨树人'], ['Vision pt.II', 'Vicetone'],];
var musicId = 0;
//初始化音乐
function initMusic() {
    audio.src = `./mp3/music${musicId}.mp3`;
    audio.load();
    recordImg.classList.remove('rotate-play');
    //当音乐的元数据完成加载时触发
    audio.onloadedmetadata = function () {
        recordImg.style.backgroundImage = `url(./img/record${musicId}.jpg)`;
        body.style.backgroundImage = `url(./img/bg${musicId}.png)`;
        musicTitle.innerText = musicsData[musicId][0];
        authorName.innerText = musicsData[musicId][1];
        refreshRotate();
        totalTime.innerText = formatTime(audio.duration);
        audio.currentTime = 0;
    };
}

initMusic();

//初始化并自动播放
function initAndPlay() {
    initMusic();
    rotateRecord();
    audio.play();
    playPause.classList.remove('icon-play');
    playPause.classList.add('icon-pause');
}
//点击播放按钮事件
playPause.addEventListener('click', function () {
    if (audio.paused) {
        audio.play();
        rotateRecord();
        playPause.classList.remove('icon-play');
        playPause.classList.add('icon-pause');
    } else {
        audio.pause();
        rotateRecordStop();
        playPause.classList.remove('icon-pause');
        playPause.classList.add('icon-play');
    }
});
//让唱片旋转
function rotateRecord() {
    recordImg.style.animationPlayState = "running";
}
//停止旋转
function rotateRecordStop() {
    recordImg.style.animationPlayState = "paused";
}
//刷新旋转角度
function refreshRotate() {
    recordImg.classList.add("rotate-play");
}

//跳转下一首
nextMusic.addEventListener('click', function () {
    musicId++;
    if (musicId >= musicsData.length) {
        musicId = 0;
    }
    initAndPlay();

})
//跳转上一首
beforeMusic.addEventListener('click', function () {
    musicId--;
    if (musicId < 0) {
        musicId = musicsData.length - 1;
    }
    initAndPlay();
})

//时间格式化
function formatTime(value) {
    var hour = parseInt(value / 3600);
    var minutes = parseInt((value % 3600) / 60);
    var seconds = parseInt(value % 60);

    if (hour > 0) {
        return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

audio.addEventListener('timeupdate', updateProgress);
//音乐进度更新
function updateProgress() {
    playedTime.innerText = formatTime(audio.currentTime);
    var value = audio.currentTime / audio.duration;
    progressPlay.style.width = value * 100 + "%";
}

//音乐模式
var modeId=1;
playMode.addEventListener('click',function(){
    modeId++;
    if(modeId>3){
        modeId=1;
    }
    playMode.style.backgroundImage=`url('./img/mode${modeId}.png')`;
});
//音乐播放完
audio.addEventListener(`ended`,function(){
    if(modeId==2){
        musicId=(musicId+1)%musicsData.length;
    }else if(modeId==3){
        var oldId=musicId;
        while(true){
             musicId=Math.floor(Math.random()*musicsData.length);
             if(musicId!=oldId){
                break;
             }
        }
       
    }
    initAndPlay();
});

//记录上一次的音量
var lastVolume=70;
audio.volume=lastVolume/100;
//音量控制
volume.addEventListener('click',setVolume);
function setVolume(){
    if(audio.muted||audio.volume===0){
        audio.muted=false;
        volumnTogger.value=lastVolume;
        audio.volume=lastVolume/100;
    }else{
        audio.muted=true;
        lastVolume=volumnTogger.value;
        volumnTogger.value=0;
    }
    updateVolumnIcon();

}

volumnTogger.addEventListener('input',updateVolume);
//音量滑块
function updateVolume(){
    const volumeValue=volumnTogger.value/100;
    audio.volume=volumeValue;
    if(volumeValue>0){
        audio.muted=false;
    }
    updateVolumnIcon();
}

//更新音量
function updateVolumnIcon(){
    if(audio.muted||audio.volume==0){
        volume.style.backgroundImage=`url('./img/静音.png')`;
    }else{
         volume.style.backgroundImage=`url('./img/音量.png')`;
    }
}

//倍速
speed.addEventListener('click',function(){
    var speedText=speed.innerText;
    if(speedText=="1.0X"){
        speed.innerText="1.5X";
        audio.playbackRate=1.5;
    } else if(speedText=="1.5X"){
        speed.innerText="2.0X";
        audio.playbackRate=2.0;
    } else if(speedText=="2.0X"){
        speed.innerText="0.5X";
        audio.playbackRate=0.5;
    } else if(speedText=="0.5X") {
        speed.innerText="1.0X";
        audio.playbackRate=1.0;
    }
});


//列表
listIcon.addEventListener('click',function(){
    listContainer.classList.remove('list-hide');
    listContainer.classList.add('list-show');
    closeContainer.style.display='block';
    listContainer.style.display='block';

});
closeContainer.addEventListener('click',function(){
    listContainer.classList.remove('list-show');
    listContainer.classList.add('list-hide');
    closeContainer.style.display='none';
    // listContainer.style.display='none';
});



//歌曲名称
// var musicsData = [['洛春赋', '云汐'], ['Yesterday', 'Alok/Safi Tukker'], ['江南烟雨色', '杨树人'], ['Vision pt.II', 'Vicetone'],];
// var musicId = 0;
//自动生成音乐列表
function createMusic() {
    for(let i=0;i<musicsData.length;i++){
        let div=document.createElement('div');
        div.innerText=`${musicsData[i][0]}`;
        musicLists.appendChild(div);
        div.addEventListener('click',function(){
            musicId=i;
            initAndPlay();
        })
    }
}
document.addEventListener('DOMContentLoaded',createMusic);

