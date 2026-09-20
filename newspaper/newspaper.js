'use strict';
(() => {
  const grid = document.querySelector('#crossword-grid');
  const entries = [
    {n:1,r:0,c:3,word:'MASK',dir:'across'},
    {n:2,r:0,c:4,word:'ARCHIVE',dir:'down'},
    {n:3,r:2,c:1,word:'TRACE',dir:'across'},
    {n:4,r:4,c:3,word:'RITUAL',dir:'across'},
    {n:5,r:6,c:3,word:'REUSE',dir:'across'}
  ];
  const cells = new Map(), inputs = new Map();
  let direction = 'across';
  const status = document.querySelector('#puzzle-status');
  entries.forEach(e => [...e.word].forEach((letter,i) => {
    const r=e.r+(e.dir==='down'?i:0), c=e.c+(e.dir==='across'?i:0), key=r+','+c;
    const cell=cells.get(key)||{letter,number:null};
    if(i===0)cell.number=e.n;
    cells.set(key,cell);
  }));
  function move(r,c,dr,dc){ const next=inputs.get((r+dr)+','+(c+dc)); if(next)next.focus(); }
  for(let r=0;r<7;r++)for(let c=0;c<9;c++){
    const key=r+','+c, cell=cells.get(key), square=document.createElement('div');
    square.className='square'+(cell?'':' empty');
    if(cell){
      if(cell.number){const label=document.createElement('span');label.textContent=cell.number;square.append(label);}
      const input=document.createElement('input');input.type='text';input.maxLength=1;
      input.autocomplete='off';input.spellcheck=false;input.setAttribute('autocapitalize','characters');
      input.setAttribute('aria-label',`Row ${r+1}, column ${c+1}${cell.number?', clue '+cell.number:''}`);
      input.addEventListener('focus',()=>input.select());
      input.addEventListener('input',()=>{input.value=input.value.replace(/[^a-z]/gi,'').toUpperCase();input.classList.remove('wrong','correct');input.removeAttribute('aria-invalid');if(input.value)move(r,c,direction==='down'?1:0,direction==='across'?1:0);status.textContent='Keep going.';});
      input.addEventListener('keydown',event=>{
        const arrows={ArrowLeft:[0,-1],ArrowRight:[0,1],ArrowUp:[-1,0],ArrowDown:[1,0]};
        if(arrows[event.key]){event.preventDefault();move(r,c,...arrows[event.key]);}
        if(event.key==='Backspace'&&!input.value)move(r,c,direction==='down'?-1:0,direction==='across'?-1:0);
      });
      square.append(input);inputs.set(key,input);
    }
    grid.append(square);
  }
  document.querySelector('#direction').addEventListener('click',event=>{direction=direction==='across'?'down':'across';event.currentTarget.textContent='Direction: '+direction;});
  document.querySelector('#check').addEventListener('click',()=>{
    let correct=0,filled=0;
    inputs.forEach((input,key)=>{const ok=input.value===cells.get(key).letter;if(input.value)filled++;if(ok)correct++;input.classList.toggle('wrong',!!input.value&&!ok);input.classList.toggle('correct',ok);input.setAttribute('aria-invalid',String(!!input.value&&!ok));});
    status.textContent=correct===cells.size?'Solved. A small act of persistence.':`${correct} of ${cells.size} squares correct. ${cells.size-filled} still empty. Incorrect letters are marked.`;
  });
  document.querySelector('#reset').addEventListener('click',()=>{inputs.forEach(input=>{input.value='';input.classList.remove('wrong','correct');input.removeAttribute('aria-invalid');});status.textContent='A fresh page.';inputs.values().next().value.focus();});
})();
