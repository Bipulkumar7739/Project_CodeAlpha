const images = [
  {
    src:'https://picsum.photos/id/1025/1200/800',title:'Hills',cat:'nature',desc:'Morning mist on hills'
  },

  {
    src:'https://picsum.photos/id/1025/1200/800',title:'Dog',cat:'people',desc:'Friendly dog portrait'

  },

  {
    src:'https://picsum.photos/id/1003/1200/800',title:'Bridge',cat:'architecture',desc:'Bridge silhouette'

  },

  {
    src:'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',title:'hotgirl',cat:'nature',desc:'Trail in forest'

  },

  {
    src:'https://picsum.photos/id/1031/1200/800',title:'City',cat:'architecture',desc:'City sunset'

  },

  {
    src:'https://images.unsplash.com/photo-1494790108377-be9c29b29330',title:'Smile',cat:'people',desc:'Street portrait'

  }
  
];

let state = 
{
  list: [...images],
  filter: 'all',
  fx: 'none',
  current: 0,
  view: []
};

const gallery = document.getElementById('gallery');

function render() 
{
  gallery.innerHTML = '';
  let list = state.list.filter(i => state.filter === 'all' || i.cat === state.filter);
  list.forEach((it, idx) => 
  {
    let card = document.createElement('div');
    card.className = 'koya-card';
    card.dataset.idx = idx;
    card.innerHTML = `
      <img src="${it.src}" class="koya-thumb" style="filter:${state.fx}" alt="">
      <div class="meta">${it.title}</div>
    `;
    card.onclick = () => openLb(list, idx);
    gallery.appendChild(card);
  });
}
render();

document.querySelectorAll('input[name=category]').forEach(r => 
{
  r.onchange = () => {
    state.filter = r.value;
    render();
  };
});

document.getElementById('img-filter').onchange = e => 
{
  state.fx = e.target.value;
  render();
};

document.getElementById('shuffleBtn').onclick = () => 
{
  for (let i = state.list.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [state.list[i], state.list[j]] = [state.list[j], state.list[i]];
  }
  render();
};

document.getElementById('addPlaceholder').onclick = () => 
{
  state.list.unshift({
    src: "https://picsum.photos/seed/${Math.random()}/1200/800",
    title: 'New',
    cat: 'nature',
    desc: 'Added'
  });
  render();
};

const lb = document.getElementById('lightbox');
const kbImg = document.getElementById('kbImg');
const kbTitle = document.getElementById('kbTitle');
const kbDesc = document.getElementById('kbDesc');

function openLb(list, idx) 
{
  state.view = list;
  state.current = idx;
  show();
  lb.classList.add('open');
}

function show() 
{
  let it = state.view[state.current];
  kbImg.src = it.src;
  kbTitle.textContent = it.title;
  kbDesc.textContent = it.desc;
}

document.getElementById('prevBtn').onclick = () => 
{
  state.current = (state.current - 1 + state.view.length) % state.view.length;
  show();
};

document.getElementById('nextBtn').onclick = () => 
{
  state.current = (state.current + 1) % state.view.length;
  show();
};

document.getElementById('navPrev').onclick = () => 
{
  state.current = (state.current - 1 + state.view.length) % state.view.length;
  show();
};

document.getElementById('navNext').onclick = () =>
{
  state.current = (state.current + 1) % state.view.length;
  show();
};

document.getElementById('closeLb').onclick = () => lb.classList.remove('open');

document.getElementById('downloadBtn').onclick = () => 
{
  let a = document.createElement('a');
  a.href = kbImg.src;
  a.download = 'image.jpg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};