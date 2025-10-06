// -------- O2投与量⇔FiO2換算 --------
class O2FiO2Tool extends BaseTool {
  constructor(){ super('o2fio2','O2投与量⇔FiO2換算','デバイスと流量からFiO2を推定、目標FiO2から推奨流量を逆算します。'); }
  getIcon(){ return 'fas fa-head-side-mask'; }
  renderContent(){
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-head-side-mask"></i> デバイスと流量</h4>
        <div class="form-row">
          <div class="form-group"><label for="o2dev">デバイス</label>
            <select id="o2dev">
              <option value="air">室内空気</option>
              <option value="nc">鼻カニュラ</option>
              <option value="sm">シンプルマスク</option>
              <option value="vm">ベンチュリーマスク</option>
              <option value="nrb">リザーバーマスク</option>
            </select>
          </div>
          <div class="form-group"><label for="o2flow">流量 (L/分)</label><input id="o2flow" type="number" step="0.5" min="0" placeholder="例: 2"><small>鼻カニュラは「室内気21% + 1L/分ごとに約4%上昇」の経験則（上限目安4L）。ベンチュリーマスクは下の%設定を使用。</small></div>
          <div class="form-group"><label for="o2venturi">ベンチュリーバルブ（%）</label>
            <select id="o2venturi">
              <option value="">-- 選択 --</option>
              <option value="24">24%</option>
              <option value="28">28%</option>
              <option value="35">35%</option>
              <option value="40">40%</option>
              <option value="60">60%</option>
            </select>
          </div>
        </div>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-bullseye"></i> 目標FiO2（逆算）</h4>
        <div class="form-row">
          <div class="form-group"><label for="o2fio2target">目標FiO2 (%)</label><input id="o2fio2target" type="number" min="21" max="100" step="1" placeholder="例: 30"></div>
          <div class="form-group"><label for="o2dev2">デバイス（逆算）</label>
            <select id="o2dev2">
              <option value="nc">鼻カニュラ</option>
              <option value="sm">シンプルマスク</option>
            </select>
          </div>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calc()">計算</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="o2fio2Result" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new O2FiO2Calculator(); const el=s.querySelector('.calculator-instance'); el.calc=()=>c.calc(); el.reset=()=>c.reset(); return s; }
}
class O2FiO2Calculator {
  estFiO2(device, flow){
    if (device==='air') return 0.21;
    if (device==='nc') {
      if (!flow || flow <= 0) return 0.21;
      const f = Math.min(Math.max(flow, 0), 4);
      return Math.min(0.21 + 0.04*f, 0.45);
    }
    if (device==='vm') {
      const v = parseFloat(document.getElementById('o2venturi')?.value)||NaN;
      return Number.isFinite(v) ? v/100 : NaN;
    }
    if (device==='sm') {
      if (flow < 5) return NaN;
      const f = Math.min(Math.max(flow, 6), 10);
      const slope = (0.50-0.35)/(10-6);
      return 0.35 + slope*(f-6);
    }
    if (device==='nrb') {
      const f = Math.min(Math.max(flow||10, 10), 15);
      const slope = (0.80-0.60)/(15-10);
      return 0.60 + slope*(f-10);
    }
    return NaN;
  }
  invFlowForTarget(device, targetFiO2){
    const t = targetFiO2/100;
    if (device==='nc') {
      if (t<=0.21) return 0;
      const maxT = 0.21 + 0.04*4;
      if (t>=maxT) return 4;
      const flow = (t-0.21)/0.04;
      return Math.min(Math.max(flow, 0), 4);
    }
    if (device==='sm') {
      if (t<=0.35) return 6; if (t>=0.50) return 10; const slope=(10-6)/(0.50-0.35); return 6 + (t-0.35)*slope; }
    if (device==='nrb') {
      if (t<=0.60) return 10; if (t>=0.80) return 15; const slope=(15-10)/(0.80-0.60); return 10 + (t-0.60)*slope; }
    return NaN;
  }
  fio2Text(device, flow, value){
    if (device==='sm') return '35–50%';
    if (device==='nrb') return '60–80%';
    const pct = (value*100).toFixed(0)+'%';
    if (device==='vm') return pct;
    return pct;
  }
  calc(){
    const dev=document.getElementById('o2dev')?.value||'air';
    const flow=parseFloat(document.getElementById('o2flow')?.value)||0;
    const tgt=parseFloat(document.getElementById('o2fio2target')?.value)||NaN;
    const dev2=document.getElementById('o2dev2')?.value||'nc';
    const el=document.getElementById('o2fio2Result'); if(!el) return;
    const fio2 = this.estFiO2(dev, flow);
    const recFlow = Number.isFinite(tgt)? this.invFlowForTarget(dev2, tgt) : NaN;
    if (!Number.isFinite(fio2)) { el.innerHTML='<div class="alert alert-danger">デバイス/流量を正しく入力してください。</div>'; el.style.display='block'; return; }
    const fio2Text = this.fio2Text(dev, flow, fio2);
    let recText='';
    if (Number.isFinite(recFlow)) {
      recText = `<div class="result-item"><strong>目標${dev2}の推奨流量:</strong> <span class="highlight">${recFlow.toFixed(1)}</span> L/分</div>`;
    }
    el.innerHTML = `
      <h3>O2⇔FiO2換算</h3>
      <div class="result-item"><strong>推定FiO2:</strong> <span class="highlight">${fio2Text}</span>（${dev}${flow>0?` / ${flow} L/分`:''}）</div>
      ${recText}
      <div class="alert ${fio2>=0.4?'alert-warning':'alert-info'}">目安換算です。臨床状況に応じてSpO2・呼吸状態を確認し、必要時は医師と相談してください。</div>
    `;
    el.style.display='block';
  }
  reset(){ ['o2flow','o2fio2target'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); const d=document.getElementById('o2dev'); if(d) d.selectedIndex=0; const d2=document.getElementById('o2dev2'); if(d2) d2.selectedIndex=0; const r=document.getElementById('o2fio2Result'); if(r) r.style.display='none'; }
}
