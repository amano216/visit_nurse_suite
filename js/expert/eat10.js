// -------- EAT-10（嚥下スクリーニング） --------
class EAT10Tool extends BaseTool {
  constructor(){ super('eat10','EAT-10（嚥下スクリーニング）','10項目×0–4点で嚥下に関する主観的な困難度を評価します。合計0–40点。'); }
  getIcon(){ return 'fas fa-utensils'; }
  renderContent(){
    const opts = ['0: 問題なし','1: わずかに問題','2: 中等度の問題','3: 重度の問題','4: 極めて重度の問題']
      .map((t,i)=>`<option value="${i}">${t}</option>`).join('');
    const items = Array.from({length:10}).map((_,i)=>
      `<div class="form-group"><label for="eat_${i}">質問 ${i+1}</label><select id="eat_${i}">${opts}</select></div>`
    ).join('');
    return `
      <div class="assessment-section">
        <div class="als-grid">${items}</div>
        <small>各項目 0–4 点（0=問題なし, 4=極めて重度）。合計 0–40 点。</small>
      </div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <div><strong>【解説】</strong> EAT-10 は自記式の嚥下スクリーニングで、<u>合計スコアが 3 点以上</u>を問題ありとみなします（正常コホート平均 0.40±1.01 → +2SD 上限 ≈ 2.41）。</div>
        <div style="margin-top:6px;"><strong>【エビデンス】</strong> 妥当性・再現性が良好と報告されています。一方で、<u>日本語版の再テスト信頼性</u>は十分に検証途上とされます。</div>
        <div style="margin-top:6px;"><strong>【使用上の注意】</strong> スクリーニング目的です。誤嚥性肺炎リスクや栄養状態、口腔機能等と総合的に判断し、必要に応じて専門評価（嚥下内視鏡/造影）をご検討ください。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>Belafsky PC, et al. Validity and reliability of the Eating Assessment Tool (EAT-10). Ann Otol Rhinol Laryngol. 2008;117(12):919–924. PMID: 19140539.</li>
            <li>日本語版EAT-10の作成と信頼性・妥当性の検証. 静脈経腸栄養. 2014;29(3):75(871).</li>
          </ul>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">集計</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="eatResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new EAT10Calculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class EAT10Calculator {
  calculate(){
    const scores = Array.from({length:10}).map((_,i)=> parseInt(document.getElementById(`eat_${i}`)?.value) || 0);
    const total = scores.reduce((a,b)=>a+b,0);
    const abnormal = total>=3;
    const el=document.getElementById('eatResult'); if(!el) return;
    el.innerHTML = `
      <h3>EAT-10 集計</h3>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 40</div>
      <div class="alert ${abnormal?'alert-warning':'alert-success'}">${abnormal? '3点以上：問題あり（専門評価の検討）' : '2点以下：目安として正常域'}</div>
    `;
    el.style.display='block';
  }
  reset(){ for(let i=0;i<10;i++){ const e=document.getElementById(`eat_${i}`); if(e) e.selectedIndex=0; } const r=document.getElementById('eatResult'); if(r) r.style.display='none'; }
}
