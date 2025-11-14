import express from 'express';
import path from 'path';
const app = express();
const __dirname = path.resolve();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.get('/_health',(req,res)=>res.json({ok:true,ts:Date.now()}));

// Local "AI" summarizer: naive extraction + rules
function localSummarize(text){
  // split into sentences
  const sents = text.replace(/\s+/g,' ').trim().split(/(?<=[.!?])\s+/).filter(Boolean);
  // lessons: take up to 3 most "meaningful" sentences (heuristic: longer ones)
  const sorted = [...sents].sort((a,b)=>b.length - a.length);
  const lessons = sorted.slice(0,3).map((t,i)=>((i+1)+". "+t));
  // actions: pick two verbs-like heuristics by extracting phrases with 'akan', 'mulai', 'coba', 'lakukan'
  const actions = [];
  const lower = text.toLowerCase();
  if(lower.includes('mulai')) actions.push('Mulai dari langkah kecil tiap hari.');
  if(lower.includes('coba')) actions.push('Coba iterasi cepat dan belajar dari hasil.');
  if(lower.includes('fokus')) actions.push('Fokus pada kualitas, bukan kuantitas.');
  if(actions.length<2) actions.push('Buat rencana 2 langkah dan eksekusi minggu ini.');
  // motivation
  const motivation = 'Terus konsisten — kemajuan kecil menumpuk jadi sukses besar.';
  return { lessons, actions: actions.slice(0,2), motivation };
}

app.post('/api/ai',(req,res)=>{
  try{
    const q = req.body.prompt || req.body.text || '';
    if(!q || String(q).trim().length<10) return res.status(400).json({error:'Input terlalu pendek. Ketik minimal 10 karakter.'});
    const out = localSummarize(q);
    res.json({ text: 'Pelajaran:\n' + out.lessons.join('\n') + '\n\nLangkah Praktis:\n- ' + out.actions.join('\n- ') + '\n\nMotivasi:\n' + out.motivation });
  }catch(e){
    console.error(e);
    res.status(500).json({error:'Local AI gagal.'});
  }
});

app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log('Server running on',PORT));
