// -------- 酸素ボンベ 使用可能時間 --------
class O2TimeTool extends BaseTool {
  constructor(){ super('o2time','酸素ボンベ使用可能時間','現在圧（MPa）と流量（L/分）から残り使用可能時間を推定します。'); }
  getIcon(){ return 'fas fa-wind'; }
  renderContent(){
    const capOpts = [200,400,1200,2800,7000];
    return `
      <div class="assessment-section">
        <div class="form-row">
          <div class="form-group"><label for="o2Capacity">定格内容量（L, 14.7MPa時）</label>
            <select id="o2Capacity">${capOpts.map(v=>`<option value="${v}">${v} L</option>`).join('')}<option value="custom">カスタム</option></select>
          </div>
          <div class="form-group"><label for="o2CapacityCustom">カスタム内容量（L）</label><input type="number" id="o2CapacityCustom" step="1" min="1" placeholder="例: 3000" disabled></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label for="o2Pressure">現在圧（MPa）</label><input type="number" id="o2Pressure" step="0.1" min="0" placeholder="例: 10.5"></div>
          <div class="form-group"><label for="o2Flow">流量（L/分）</label><input type="number" id="o2Flow" step="0.1" min="0.1" placeholder="例: 2"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label for="o2Reserve">残圧の確保（MPa, 任意）</label><input type="number" id="o2Reserve" step="0.1" min="0" placeholder="例: 3"></div>
        </div>
        <small>計算式：残量(L) = 定格内容量 × (現在圧 / 14.7)。残圧は任意で差し引きます。</small>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">計算</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="o2Result" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const inst=new O2TimeCalculator(); const el=s.querySelector('.calculator-instance');
    const capSelHandler=(container)=>{
      const sel=container.querySelector('#o2Capacity'); const custom=container.querySelector('#o2CapacityCustom');
      sel.addEventListener('change',()=>{ custom.disabled = sel.value!=='custom'; if(sel.value!=='custom'){ custom.value=''; } });
    };
    setTimeout(()=>capSelHandler(s));
    el.calculate=()=>inst.calculate(); el.reset=()=>inst.reset(); return s; }
}
class O2TimeCalculator {
  getCapacity(){ const sel=document.getElementById('o2Capacity')?.value||''; if(sel==='custom'){ return parseFloat(document.getElementById('o2CapacityCustom')?.value)||0; } return parseFloat(sel)||0; }
  calculate(){
    const cap = this.getCapacity();
    const p = parseFloat(document.getElementById('o2Pressure')?.value)||0;
    const f = parseFloat(document.getElementById('o2Flow')?.value)||0;
    const r = parseFloat(document.getElementById('o2Reserve')?.value)||0;
    const el=document.getElementById('o2Result');
    if(cap<=0||p<=0||f<=0){ el.innerHTML='<div class="alert alert-danger">内容量・現在圧・流量を入力してください。</div>'; el.style.display='block'; return; }
    const totalL = cap * (p/14.7);
    const reserveL = r>0? cap * (r/14.7) : 0;
    const usableL = Math.max(totalL - reserveL, 0);
    const minutes = usableL / f;
    const h = Math.floor(minutes/60);
    const m = Math.floor(minutes%60);
    const eta = new Date(Date.now() + minutes*60000);
    el.innerHTML = `<h3>酸素ボンベ 使用可能時間</h3>
      <div class="result-item"><strong>残量（推定）:</strong> ${usableL.toFixed(0)} L</div>
      <div class="result-item"><strong>使用可能時間:</strong> <span class="highlight">${h}時間 ${m}分</span> （${minutes.toFixed(1)} 分）</div>
      <div class="alert ${minutes<30?'alert-danger':(minutes<90?'alert-warning':'alert-success')}">枯渇予測: ${eta.toLocaleString()}</div>`;
    el.style.display='block';
  }
  reset(){ ['o2Pressure','o2Flow','o2Reserve','o2CapacityCustom'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); const sel=document.getElementById('o2Capacity'); if(sel) sel.selectedIndex=0; const custom=document.getElementById('o2CapacityCustom'); if(custom) custom.disabled=true; const r=document.getElementById('o2Result'); if(r) r.style.display='none'; }
}
