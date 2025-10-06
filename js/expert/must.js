// -------- MUST --------
class MUSTTool extends BaseTool {
  constructor(){ super('must','MUST 栄養リスク','BMI/体重減少/急性疾患効果の3要素で栄養リスクを判定します。'); }
  getIcon(){ return 'fas fa-seedling'; }
  renderContent(){
    return `
      <div class="form-row">
        <div class="form-group"><label for="mustHeight">身長(cm)</label><input type="number" id="mustHeight" step="0.1" min="50"></div>
        <div class="form-group"><label for="mustWeight">現在体重(kg)</label><input type="number" id="mustWeight" step="0.1" min="1"></div>
        <div class="form-group"><label for="mustPrevWeight">3-6ヶ月前体重(kg)</label><input type="number" id="mustPrevWeight" step="0.1" min="1"></div>
      </div>
  <div class="form-group"><label><input type="checkbox" id="mustAcute"> 急性疾患により&gt;5日間の経口摂取不能</label></div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <div><strong>【解説】</strong> MUST（Malnutrition Universal Screening Tool）は、<u>BMI</u>、<u>過去3–6ヶ月の体重減少</u>、<u>急性疾患による摂取不能（>5日）</u>の3項目を点数化し合計で判定します。</div>
        <div style="margin-top:6px;"><strong>【スコアの計算】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>BMI: &lt;18.5 = 2点、18.5–20 = 1点、&gt;20 = 0点</li>
            <li>体重減少（過去3–6ヶ月）: &gt;10% = 2点、5–10% = 1点、&lt;5% = 0点</li>
            <li>急性疾患効果: >5日間の経口摂取不能 = 2点、それ以外 = 0点</li>
          </ul>
        </div>
        <div style="margin-top:6px;"><strong>【スコアの評価】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>0点: 低リスク（スクリーニング継続：病院 毎週／介護施設 毎月／地域 例：75歳以上は毎年）</li>
            <li>1点: 中リスク（入院・施設では3日間の摂取量を記録、改善なければ移行時等に再評価。スクリーニング継続：病院 毎週／施設 月1以上／地域 2–3ヶ月毎）</li>
            <li>2点以上: 高リスク（管理栄養士に紹介、栄養摂取量の増加、ケアプランの監視と見直し：病院 毎週／施設 毎週以上／地域 2–3ヶ月毎）</li>
          </ul>
        </div>
        <div style="margin-top:6px;"><strong>【使用上の注意】</strong> 点数が低くても臨床的リスクが高い場合（例: 神経性食思不振症など）があります。入院中は早期の管理栄養士介入を検討してください。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>Malnutrition Action Group (BAPEN). The "MUST" explanatory booklet. http://www.bapen.org.uk/pdfs/must/must_explan.pdf</li>
            <li>Stratton RJ, et al. Malnutrition in hospital outpatients and inpatients... Br J Nutr. 2004;92(5):799–808. PMID: 15533269.</li>
          </ul>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="mustResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new MUSTCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class MUSTCalculator {
  calculate(){
    const h=parseFloat(document.getElementById('mustHeight')?.value)||0; const w=parseFloat(document.getElementById('mustWeight')?.value)||0; const pw=parseFloat(document.getElementById('mustPrevWeight')?.value)||0; const acute=document.getElementById('mustAcute')?.checked||false;
    if (h<=0||w<=0||pw<=0) return this.err('身長・現在体重・過去体重を入力してください。');
    const bmi=w/Math.pow(h/100,2);
  let bmiScore=0; if (bmi<18.5) bmiScore=2; else if (bmi<=20) bmiScore=1; // 18.5–20を含む
    const loss=((pw-w)/pw)*100; let lossScore=0; if (loss>10) lossScore=2; else if (loss>=5) lossScore=1;
    const acuteScore=acute?2:0; const total=bmiScore+lossScore+acuteScore;
    let risk='低'; let alert='alert-success'; if (total>=2){ risk='高'; alert='alert-danger'; } else if (total===1){ risk='中'; alert='alert-warning'; }
    const el=document.getElementById('mustResult');
    let advice='スクリーニング継続（病院: 毎週 / 介護施設: 毎月 / 地域: 年1程度）';
    if (total===1) advice='3日間の摂取量記録、移行時に再評価。スクリーニング継続（病院: 毎週 / 施設: 月1以上 / 地域: 2–3ヶ月毎）';
    if (total>=2) advice='管理栄養士へ紹介、栄養摂取増加、ケアプランの監視・見直し（病院: 毎週 / 施設: 毎週以上 / 地域: 2–3ヶ月毎）';
    el.innerHTML=`<h3>MUST</h3>
      <div class="result-item"><strong>BMI:</strong> ${bmi.toFixed(1)}（スコア ${bmiScore}）</div>
      <div class="result-item"><strong>体重減少:</strong> ${loss.toFixed(1)}%（スコア ${lossScore}）</div>
      <div class="result-item"><strong>急性疾患効果:</strong> スコア ${acuteScore}</div>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span></div>
      <div class="alert ${alert}"><strong>栄養リスク:</strong> ${risk}</div>
      <div class="text-muted" style="margin-top:6px;">推奨: ${advice}</div>`;
    el.style.display='block';
  }
  err(m){ const el=document.getElementById('mustResult'); el.innerHTML=`<div class="alert alert-danger">${m}</div>`; el.style.display='block'; }
  reset(){ ['mustHeight','mustWeight','mustPrevWeight'].forEach(id=>{const e=document.getElementById(id); if(e) e.value='';}); const c=document.getElementById('mustAcute'); if(c) c.checked=false; const r=document.getElementById('mustResult'); if(r) r.style.display='none'; }
}
