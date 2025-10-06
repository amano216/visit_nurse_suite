// 疼痛評価ツール（NRS）
class PainAssessmentTool extends BaseTool {
  constructor(){ super('pain','疼痛評価（NRS）','数値評価スケールで疼痛を評価します。'); }
  getIcon(){ return 'fas fa-exclamation-circle'; }
  renderContent(){
    return `
      <div class="alert alert-info"><strong>NRS:</strong> 0-10の数値で疼痛強度を評価</div>
      <div class="form-group">
        <label for="painScore">疼痛スコア (0-10)</label>
        <input type="range" id="painScore" min="0" max="10" value="0" class="pain-slider">
        <div class="pain-scale">
          <span class="pain-value" id="painValue">0</span>
          <div class="pain-labels"><span>0: 痛みなし</span><span>5: 中等度の痛み</span><span>10: 最悪</span></div>
        </div>
      </div>
      <div class="form-group"><label for="painType">疼痛の性質</label>
        <select id="painType">
          <option value="nociceptive">侵害受容性疼痛</option>
          <option value="neuropathic">神経障害性疼痛</option>
          <option value="mixed">混合性疼痛</option>
          <option value="psychogenic">心因性疼痛</option>
        </select>
      </div>
      <div class="form-row">
        <div class="form-group"><label for="painLocation">疼痛部位</label><input type="text" id="painLocation" placeholder="例: 腰部、右膝"></div>
        <div class="form-group"><label for="painDuration">持続時間</label>
          <select id="painDuration"><option value="acute">急性</option><option value="chronic">慢性</option></select>
        </div>
      </div>
      <div class="form-group"><label for="painFrequency">頻度</label>
        <select id="painFrequency"><option value="constant">持続性</option><option value="intermittent">間欠性</option><option value="breakthrough">突出痛</option></select>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="painResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const calc=new PainCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>calc.calculate(); el.reset=()=>calc.reset(); s.addEventListener('input',(e)=>{ if(e.target.id==='painScore'){ const v=s.querySelector('#painValue'); if(v){ v.textContent=e.target.value; v.className=`pain-value pain-level-${Math.floor(e.target.value/3)}`; } }}); return s; }
}
class PainCalculator {
  calculate(){ const painScore=parseInt(document.getElementById('painScore')?.value)||0; const painType=document.getElementById('painType')?.value||''; const painLocation=document.getElementById('painLocation')?.value||''; const painDuration=document.getElementById('painDuration')?.value||''; const painFrequency=document.getElementById('painFrequency')?.value||''; this.displayResult({painScore,painType,painLocation,painDuration,painFrequency}); }
  displayResult(values){ const r=document.getElementById('painResult'); if(!r) return; let intensity,management,alertClass; if(values.painScore<=3){ intensity='軽度'; management='非薬物療法＋軽度鎮痛薬検討'; alertClass='alert-success'; } else if(values.painScore<=6){ intensity='中等度'; management='鎮痛薬の定期投与＋非薬物療法'; alertClass='alert-warning'; } else { intensity='重度'; management='強力な鎮痛薬＋医師へ報告/方針見直し'; alertClass='alert-danger'; }
    const typeTexts={ nociceptive:'侵害受容性疼痛', neuropathic:'神経障害性疼痛', mixed:'混合性疼痛', psychogenic:'心因性疼痛' };
    const durationTexts={ acute:'急性疼痛', chronic:'慢性疼痛' };
    const frequencyTexts={ constant:'持続性', intermittent:'間欠性', breakthrough:'突出痛' };
    r.innerHTML=`<h3>疼痛評価結果</h3>
      <div class="result-item"><strong>疼痛スコア:</strong> <span class="highlight">${values.painScore}/10</span></div>
      <div class="result-item"><strong>疼痛強度:</strong> ${intensity}</div>
      <div class="result-item"><strong>疼痛の性質:</strong> ${typeTexts[values.painType]||values.painType}</div>
      <div class="result-item"><strong>疼痛部位:</strong> ${values.painLocation||'未記入'}</div>
      <div class="result-item"><strong>持続時間:</strong> ${durationTexts[values.painDuration]||values.painDuration}</div>
      <div class="result-item"><strong>頻度:</strong> ${frequencyTexts[values.painFrequency]||values.painFrequency}</div>
      <div class="alert ${alertClass}"><strong>推奨管理:</strong> ${management}</div>`;
    r.style.display='block'; }
  reset(){ const s=document.getElementById('painScore'); if(s){ s.value=0; const pv=document.getElementById('painValue'); if(pv){ pv.textContent='0'; pv.className='pain-value pain-level-0'; } } ['painType','painDuration','painFrequency'].forEach(id=>{ const e=document.getElementById(id); if(e) e.selectedIndex=0; }); const loc=document.getElementById('painLocation'); if(loc) loc.value=''; const r=document.getElementById('painResult'); if(r) r.style.display='none'; }
}
