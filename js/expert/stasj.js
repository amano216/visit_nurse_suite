// -------- STAS-J（医療者評価） --------
class STASJTool extends BaseTool {
  constructor(){ super('stasj','STAS-J（医療者評価）','緩和ケア介入の成果を医療者視点で評価（0=問題なし～4=極めて重い）。'); }
  getIcon(){ return 'fas fa-people-group'; }
  renderContent(){
    const items=[
      '痛み','他の身体症状','患者の不安','家族の不安','患者の情報理解','家族の情報理解','コミュニケーション','患者の介護負担','家族の介護負担','霊的/実存的苦痛'
    ];
    const options = Array.from({length:5}).map((_,v)=>`<option value="${v}">${v}</option>`).join('');
    const rows = items.map((label,i)=>`
      <div class="form-group"><label for="stas_${i}">${label}</label><select id="stas_${i}">${options}</select></div>
    `).join('');
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-list-check"></i> 評価（0=問題なし ～ 4=極めて重い）</h4>
        <div class="form-row">${rows}</div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calc()">集計</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="stasjResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new STASJCalculator(); const el=s.querySelector('.calculator-instance'); el.calc=()=>c.calc(); el.reset=()=>c.reset(); return s; }
}
class STASJCalculator {
  calc(){
    const labels=['痛み','他の身体症状','患者の不安','家族の不安','患者の情報理解','家族の情報理解','コミュニケーション','患者の介護負担','家族の介護負担','霊的/実存的苦痛'];
    const scores = labels.map((_,i)=> parseInt(document.getElementById(`stas_${i}`)?.value)||0);
    const total = scores.reduce((a,b)=>a+b,0);
    const avg = total / scores.length;
    const high = scores.map((v,i)=>({v,i})).filter(x=>x.v>=3).map(x=>labels[x.i]);
    const riskClass = total>=25? 'alert-danger' : (total>=15? 'alert-warning' : 'alert-info');
    const el=document.getElementById('stasjResult'); if(!el) return;
    el.innerHTML = `
      <h3>STAS-J 集計</h3>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 40（平均 ${avg.toFixed(1)}）</div>
      ${high.length? `<div class="alert ${riskClass}"><strong>高負担項目:</strong> ${high.join('、')}</div>` : `<div class="alert ${riskClass}">全般の負担レベル: ${avg.toFixed(1)}</div>`}
    `;
    el.style.display='block';
  }
  reset(){
    for(let i=0;i<10;i++){ const e=document.getElementById(`stas_${i}`); if(e) e.value='0'; }
    const r=document.getElementById('stasjResult'); if(r) r.style.display='none';
  }
}
