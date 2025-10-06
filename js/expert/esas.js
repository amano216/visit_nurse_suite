// -------- ESAS-r --------
class ESASTool extends BaseTool {
  constructor(){ super('esas','ESAS-r 症状評価','主要症状を0-10で評価し、負担の高い症状を把握します。'); }
  getIcon(){ return 'fas fa-notes-medical'; }
  renderContent(){
    const items = ['痛み','だるさ','眠気','吐き気','食欲低下','息切れ','抑うつ','不安','全体的なつらさ','その他'];
    return `
      <div class="assessment-section">
        <div class="cat-grid">
          ${items.map((label,i)=>`<div class=\"form-group\"><label>${label}（0-10）</label><input type=\"range\" min=\"0\" max=\"10\" value=\"0\" id=\"esas${i}\"></div>`).join('')}
        </div>
        <div class="result-item" id="esasLive">合計: <span class="highlight">0</span> / 100</div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="esasResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new ESASCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset();
    s.addEventListener('input', (e)=>{ if(String(e.target.id).startsWith('esas')){ const sum=Array.from({length:10}).reduce((a,_,i)=> a + (parseInt(s.querySelector(`#esas${i}`)?.value)||0),0); const live=s.querySelector('#esasLive'); if(live) live.innerHTML=`合計: <span class=\"highlight\">${sum}</span> / 100`; } });
    return s; }
}
class ESASCalculator {
  calculate(){
    const scores=Array.from({length:10}).map((_,i)=>parseInt(document.getElementById(`esas${i}`)?.value)||0);
    const sum=scores.reduce((a,b)=>a+b,0);
    const high=scores.map((v,i)=>({v,i})).filter(o=>o.v>=7).map(o=>o.i);
    const el=document.getElementById('esasResult');
    const highSymptoms=high.length? `高負担症状: ${high.map(i=>i+1).join(', ')}` : '高負担症状なし';
    el.innerHTML=`<h3>ESAS-r</h3><div class="result-item"><strong>合計:</strong> <span class="highlight">${sum}</span></div><div class="alert ${high.length? 'alert-warning':'alert-success'}">${highSymptoms}</div>`;
    el.style.display='block';
  }
  reset(){ Array.from({length:10}).forEach((_,i)=>{ const e=document.getElementById(`esas${i}`); if(e) e.value=0; }); const live=document.getElementById('esasLive'); if(live) live.innerHTML='合計: <span class="highlight">0</span> / 100'; const r=document.getElementById('esasResult'); if(r) r.style.display='none'; }
}
