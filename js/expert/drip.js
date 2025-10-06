// -------- 点滴速度（滴下計算） --------
class DripRateTool extends BaseTool {
  constructor(){ super('drip','点滴速度（滴下計算）','投与量やmL/h、秒/滴から滴下数を20滴/60滴で早見計算します。'); }
  getIcon(){ return 'fas fa-droplet'; }
  renderContent(){
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-prescription-bottle-medical"></i> 投与量から計算</h4>
        <div class="form-row">
          <div class="form-group"><label for="dripVolume">総投与量 (mL)</label><input id="dripVolume" type="number" min="0" step="1" placeholder="例: 500"></div>
          <div class="form-group"><label for="dripHours">時間 (時)</label><input id="dripHours" type="number" min="0" step="1" placeholder="例: 3"></div>
          <div class="form-group"><label for="dripMinutes">時間 (分)</label><input id="dripMinutes" type="number" min="0" step="1" placeholder="例: 0"></div>
        </div>
      </div>

      <div class="assessment-section">
        <h4><i class="fas fa-gauge"></i> mL/h 指定</h4>
        <div class="form-row">
          <div class="form-group"><label for="dripMlh">mL/h</label><input id="dripMlh" type="number" min="0" step="1" placeholder="例: 100"></div>
        </div>
      </div>

      <div class="assessment-section">
        <h4><i class="fas fa-stopwatch"></i> 秒/滴 指定（早見）</h4>
        <div class="form-row">
          <div class="form-group"><label for="dripSecPerDrop">秒/滴</label><input id="dripSecPerDrop" type="number" min="0.5" step="0.1" placeholder="例: 3.0"></div>
          <div class="form-group"><small>秒/滴を入力すると、20滴/mL・60滴/mLのmL/hを自動表示します。</small></div>
        </div>
      </div>

      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calc()">計算</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="dripResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new DripRateCalculator(); const el=s.querySelector('.calculator-instance'); el.calc=()=>c.calc(); el.reset=()=>c.reset(); return s; }
}

class DripRateCalculator {
  dropsPerMin(mlh, factor){ return (mlh * factor) / 60; }
  secPerDrop(gttPerMin){ return gttPerMin>0 ? 60 / gttPerMin : NaN; }
  mlhFromSecPerDrop(sec, factor){ return sec>0 ? (3600 / (sec * factor)) : NaN; }
  calc(){
    const vol = parseFloat(document.getElementById('dripVolume')?.value)||0;
    const h = parseFloat(document.getElementById('dripHours')?.value)||0;
    const m = parseFloat(document.getElementById('dripMinutes')?.value)||0;
    const mlhInput = parseFloat(document.getElementById('dripMlh')?.value)||0;
    const sec = parseFloat(document.getElementById('dripSecPerDrop')?.value)||0;
    const el = document.getElementById('dripResult'); if(!el) return;

    let mlh = 0;
    if (vol>0 && (h>0 || m>0)) {
      const totalMin = h*60 + m;
      if (totalMin<=0) { el.innerHTML='<div class="alert alert-danger">投与時間を正しく入力してください。</div>'; el.style.display='block'; return; }
      mlh = vol / (totalMin/60);
    }
    if (mlhInput>0) mlh = mlhInput; // 明示指定があれば優先

    const lines = [];
    if (mlh>0) {
      const gtt20 = this.dropsPerMin(mlh, 20);
      const gtt60 = this.dropsPerMin(mlh, 60);
      const sec20 = this.secPerDrop(gtt20);
      const sec60 = this.secPerDrop(gtt60);
      lines.push(`<div class="result-item"><strong>mL/h:</strong> <span class="highlight">${mlh.toFixed(0)}</span></div>`);
      const d10_20 = Math.round(gtt20/6);
      const d10_60 = Math.round(gtt60/6);
      lines.push(`<div class="result-item">20滴/mL: <strong>${gtt20.toFixed(0)}</strong> 滴/分（約 ${sec20.toFixed(1)} 秒/滴・10秒で約 ${d10_20} 滴）</div>`);
      lines.push(`<div class="result-item">60滴/mL: <strong>${gtt60.toFixed(0)}</strong> 滴/分（約 ${sec60.toFixed(1)} 秒/滴・10秒で約 ${d10_60} 滴）</div>`);
    }

    if (sec>0) {
      const gtt = 60/sec;
      const mlh20 = this.mlhFromSecPerDrop(sec, 20);
      const mlh60 = this.mlhFromSecPerDrop(sec, 60);
      const d10 = Math.round(gtt/6);
      lines.push(`<div class="result-item"><strong>秒/滴:</strong> <span class="highlight">${sec.toFixed(1)}</span> 秒 → <strong>${gtt.toFixed(0)}</strong> 滴/分（10秒で約 ${d10} 滴）</div>`);
      lines.push(`<div class="result-item">20滴/mL: <strong>${mlh20.toFixed(0)}</strong> mL/h（${gtt.toFixed(0)} 滴/分・10秒で約 ${d10} 滴）</div>`);
      lines.push(`<div class="result-item">60滴/mL: <strong>${mlh60.toFixed(0)}</strong> mL/h（${gtt.toFixed(0)} 滴/分・10秒で約 ${d10} 滴）</div>`);
    }

    el.innerHTML = `
      <h3>点滴速度 計算結果</h3>
      ${lines.length? lines.join('') : '<div class="alert alert-info">条件を入力して「計算」を押してください。</div>'}
    `;
    el.style.display='block';
  }
  reset(){ ['dripVolume','dripHours','dripMinutes','dripMlh','dripSecPerDrop'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); const r=document.getElementById('dripResult'); if(r) r.style.display='none'; }
}
