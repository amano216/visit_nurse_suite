// -------- IPOS（患者/医療者） --------
class IPOSTool extends BaseTool {
  constructor(){ super('ipos','IPOS（患者/医療者）','3–7日の短期変化に着目し、症状・心理・社会・スピリチュアルを包括評価。'); }
  getIcon(){ return 'fas fa-user-injured'; }
  renderContent(){
    const items=['痛み','息苦しさ','吐き気','食欲不振','便通の問題','疲労/倦怠','不安','気分の落ち込み','情報への満足','家族/介護者の不安','スピリチュアルな安寧'];
    const options = Array.from({length:5}).map((_,v)=>`<option value="${v}">${v}</option>`).join('');
    const rows = items.map((label,i)=>`
      <div class="form-group"><label for="ipos_${i}">${label}</label><select id="ipos_${i}">${options}</select></div>
    `).join('');
    return `
      <div class="assessment-section">
        <div class="form-row">
          <div class="form-group"><label for="iposMode">評価者</label>
            <select id="iposMode"><option value="patient">患者（自己評価）</option><option value="clinician">医療者</option></select>
          </div>
          <div class="form-group"><small>0=問題なし/満足、4=非常に強い問題/不満（項目により意味は反転しない前提の簡易版）</small></div>
        </div>
        <div class="form-row">${rows}</div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calc()">集計</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="iposResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new IPOSCalculator(); const el=s.querySelector('.calculator-instance'); el.calc=()=>c.calc(); el.reset=()=>c.reset(); return s; }
}
class IPOSCalculator {
  calc(){
    const labels=['痛み','息苦しさ','吐き気','食欲不振','便通の問題','疲労/倦怠','不安','気分の落ち込み','情報への満足','家族/介護者の不安','スピリチュアルな安寧'];
    const scores = labels.map((_,i)=> parseInt(document.getElementById(`ipos_${i}`)?.value)||0);
    const total = scores.reduce((a,b)=>a+b,0);
    const avg = total / scores.length;
    const high = scores.map((v,i)=>({v,i})).filter(x=>x.v>=3).map(x=>labels[x.i]);
    const mode = document.getElementById('iposMode')?.value||'patient';
    const tag = mode==='patient' ? '患者自己評価' : '医療者評価';
    const riskClass = total>=22? 'alert-danger' : (total>=12? 'alert-warning' : 'alert-info');
    const el=document.getElementById('iposResult'); if(!el) return;
    el.innerHTML = `
      <h3>IPOS 集計（${tag}）</h3>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 44（平均 ${avg.toFixed(1)}）</div>
      ${high.length? `<div class="alert ${riskClass}"><strong>高負担項目:</strong> ${high.join('、')}</div>` : `<div class="alert ${riskClass}">全般の負担レベル: ${avg.toFixed(1)}</div>`}
    `;
    el.style.display='block';
  }
  reset(){
    for(let i=0;i<11;i++){ const e=document.getElementById(`ipos_${i}`); if(e) e.value='0'; }
    const r=document.getElementById('iposResult'); if(r) r.style.display='none';
  }
}
