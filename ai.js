const goBtn = document.getElementById('goBtn');
const inputText = document.getElementById('inputText');
const output = document.getElementById('output');
const samples = document.getElementById('samples');

samples.addEventListener('click', (e)=>{
  if(e.target && e.target.matches('.sample')){
    inputText.value = e.target.textContent.trim();
  }
});

async function callLocalAI(text){
  try{
    const res = await fetch('/api/ai', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({prompt: text})});
    const j = await res.json();
    if(j.error) return {error: j.error};
    return {text: j.text};
  }catch(err){
    return {error: err.message || 'Gagal menghubungi server'};
  }
}

goBtn.addEventListener('click', async ()=>{
  const t = inputText.value.trim();
  if(!t){ output.textContent = 'Masukkan cerita terlebih dahulu.'; return; }
  goBtn.disabled = true;
  output.textContent = 'Memproses...';
  const r = await callLocalAI(t);
  if(r.error) output.textContent = 'Error: '+r.error;
  else output.textContent = r.text;
  goBtn.disabled = false;
});
