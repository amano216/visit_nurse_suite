// -------- Braden --------
class BradenTool extends BaseTool {
  constructor(){ super('braden','Braden圧迫リスク','6項目（6-23点）で褥瘡リスクを評価します。'); }
  getIcon(){ return 'fas fa-procedures'; }
  renderContent(){
    const sel = (id, max, min=1) => `
      <div class="form-group"><label for="${id}">${id.toUpperCase()} (${min}-${max})</label>
        <select id="${id}">
          ${Array.from({length:max-min+1}, (_,k)=>`<option value="${max-k}">${max-k}</option>`).join('')}
        </select>
      </div>`;
    return `
      <div class="form-row">
        ${sel('sensory',4)}${sel('moisture',4)}${sel('activity',4)}
      </div>
      <div class="form-row">
        ${sel('mobility',4)}${sel('nutrition',4)}
        <div class="form-group"><label for="friction">FRICTION (1-3)</label>
          <select id="friction">
            <option value="3">3</option><option value="2">2</option><option value="1">1</option>
          </select>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="bradenResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new BradenCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class BradenCalculator {
  calculate(){
    const vals=['sensory','moisture','activity','mobility','nutrition','friction'].map(id=>parseInt(document.getElementById(id)?.value)||0);
    if (vals.some(v=>v===0)) return this.err('全ての項目を選択してください。');
    const total = vals.reduce((a,b)=>a+b,0);
    let risk='なし', alert='alert-success';
    if (total<=9){ risk='極高'; alert='alert-danger'; }
    else if (total<=12){ risk='高'; alert='alert-warning'; }
    else if (total<=14){ risk='中等度'; alert='alert-warning'; }
    else if (total<=18){ risk='軽度'; alert='alert-info'; }
    const el=document.getElementById('bradenResult');
    el.innerHTML=`<h3>Braden結果</h3>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 23</div>
      <div class="alert ${alert}"><strong>リスク:</strong> ${risk}</div>`;
    el.style.display='block';
  }
  err(m){ const el=document.getElementById('bradenResult'); el.innerHTML=`<div class="alert alert-danger">${m}</div>`; el.style.display='block'; }
  reset(){ ['sensory','moisture','activity','mobility','nutrition'].forEach(id=>{const e=document.getElementById(id); if(e) e.selectedIndex=0;}); const f=document.getElementById('friction'); if(f) f.selectedIndex=0; const r=document.getElementById('bradenResult'); if(r) r.style.display='none'; }
}
