
let tracks=[
{
    title:"Helix Dawn",artist:"SoundHelix",src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
},

{
    title:"City Pulse",artist:"SoundHelix",src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
},

{
    title:"Night Cruise",artist:"SoundHelix",src:"https://youtu.be/VPUKCSzQ2YY?si=Ogvlgk2Dd9lgLynY.mp3"
},

{
    title:"Chill Beats", artist:"LoFi", src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
},

{
    title:"Sunset Drive", artist:"DJ Flow", src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
},

{
    title:"Brown Rang",artist:"Yo Yo Honey Singh",src:"https://www.example.com/honey-singh-brown-rang.mp3"
},

{
    title:"Desi Kalakaar",artist:"Yo Yo Honey Singh",src:"https://www.example.com/honey-singh-desi-kalakaar.mp3"
}

];
    const qs=(s,e=document)=>e.querySelector(s);
    const qsa=(s,e=document)=>[...e.querySelectorAll(s)
];

const fmt=s=>
{
    s=Math.floor(s);
    let m=Math.floor(s/60);
    let r=(s%60).toString().padStart(2,'0');
    return `${m}:${r}`
};


    const audio=qs('#audio'),
    titleEl=qs('#songTitle'),
    artistEl=qs('#songArtist'),
    coverEl=qs('#coverArt'),
    playBtn=qs('#playBtn'),
    prevBtn=qs('#prevBtn'),
    nextBtn=qs('#nextBtn'),
    shuffleBtn=qs('#shuffleBtn'),
    autoplayBtn=qs('#autoplayBtn'),
    muteBtn=qs('#muteBtn'),
    volRange=qs('#volume'),
    volNum=qs('#volNum'),
    statusBadge=qs('#statusBadge'),
    modeBadge=qs('#modeBadge'),
    bar=qs('#bar'),
    fill=qs('#fill'),
    thumb=qs('#thumb'),
    now=qs('#now'),
    total=qs('#total'),
    playlistEl=qs('#playlist'),
    fileInput=qs('#fileInput');
    const store=

{
    index:0,
    shuffled:false,
    autoplay:true,
    order:[...tracks.keys()]
};

function shuffleArray(a)
{
    let b=a.slice();
    for(let i=b.length-1;
    i>0;i--){let j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}
    return b
}

function renderPlaylist()
{
    playlistEl.innerHTML='';
    store.order.forEach(idx=>{let t=tracks[idx];
    let row=document.createElement('div');
    row.className='track';
    row.setAttribute('data-idx',idx);
    row.innerHTML=`<strong>${t.title}</strong><br><span>${t.artist}</span>`;
    row.onclick=()=>load(idx,true);playlistEl.appendChild(row)});
    markCurrent()
}

function markCurrent()
{
    qsa('.track',
    playlistEl).forEach(el=>{let cur=Number(el.getAttribute('data-idx'))===store.index;
    el.setAttribute('aria-current',cur)})
}

function load(idx,andPlay=false)
{
    store.index=idx;
    let t=tracks[idx];
    audio.src=t.src;
    titleEl.textContent=t.title;
    artistEl.textContent=t.artist;
    coverEl.textContent=t.title[0];
    statusBadge.textContent='Loading…';
    audio.onloadedmetadata=()=>{total.textContent=fmt(audio.duration)};
    if(andPlay)play();
    else pause();
    markCurrent()
}

function play()
{
    audio.play().then(()=>{playBtn.textContent='⏸';
    statusBadge.textContent='Playing'}).catch(()=>{statusBadge.textContent='Error'})

}
function pause()
{
    audio.pause();playBtn.textContent='▶️';statusBadge.textContent='Paused'
}

function next()
{
    let pos=store.order.indexOf(store.index);
    let nextPos=(pos+1)%store.order.length;
    load(store.order[nextPos],true)
}

function prev()
{
    let pos=store.order.indexOf(store.index);
    let prevPos=(pos-1+store.order.length)%store.order.length;
    load(store.order[prevPos],true)
}

function setShuffle(on)
{
    store.shuffled=on;
    store.order=on?shuffleArray([...tracks.keys()]):[...tracks.keys()];
    renderPlaylist()
}

function setAutoplay(on)
{
    store.autoplay=on;
    modeBadge.textContent=`Autoplay: ${on?'On':'Off'}`
}

function updateProgress()
{
    let pct=(audio.currentTime/(audio.duration||1))*100;
    fill.style.width=pct+'%';
    thumb.style.left=pct+'%';
    now.textContent=fmt(audio.currentTime)
}

function seek(x)
{
    let rect=bar.querySelector('.progress-bar').getBoundingClientRect();
    let ratio=(x-rect.left)/rect.width;
    ratio=Math.min(Math.max(ratio,0),1);
    audio.currentTime=ratio*(audio.duration||0)
}

let dragging=false;bar.onpointerdown=e=>
{
    dragging=true;seek(e.clientX)};
    window.onpointermove=e=>{if(dragging)seek(e.clientX)};
    window.onpointerup=()=>{dragging=false

};

function applyVolume(v)
{
    audio.volume=v;volRange.value=v;
    volNum.textContent=Math.round(v*100)+'%';
    muteBtn.textContent=(audio.muted||v===0)?'🔈':'🔇'
}

    volRange.oninput=()=>applyVolume(Number(volRange.value));
    muteBtn.onclick=()=>
{
    audio.muted=!audio.muted;applyVolume(Number(volRange.value))
}

    playBtn.onclick=()=>audio.paused?play():pause();
    prevBtn.onclick=prev;
    nextBtn.onclick=next;
    shuffleBtn.onclick=()=>setShuffle(!store.shuffled);
    autoplayBtn.onclick=()=>setAutoplay(!store.autoplay);
window.onkeydown=e=>
{
    if(['INPUT','TEXTAREA'].includes(e.target.tagName))return;
    if(e.code==='Space'){e.preventDefault();
    audio.paused?play():pause()}if(e.key==='ArrowRight')next();
    if(e.key==='ArrowLeft')prev()
}

audio.ontimeupdate=updateProgress;audio.onended=()=>
{
    statusBadge.textContent='Ended';if(store.autoplay)next()
}

fileInput.addEventListener('change',e=>
{
    const files=[...e.target.files];
    files.forEach(f=>{
    const url=URL.createObjectURL(f);
    tracks.push({title:f.name,artist:'Local File',src:url});
  });
    store.order=[...tracks.keys()];
    renderPlaylist();
});

    (function init(){applyVolume(0.8);
    setAutoplay(true);setShuffle(false);
    renderPlaylist();
    load(store.order[0],false)})();
