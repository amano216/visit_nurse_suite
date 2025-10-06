// -------- オピオイド等価換算（OME/BT） --------
class OpioidEquivalenceTool extends BaseTool {
  constructor(){ super('ome','オピオイド等価換算（OME/BT）','日常用量から経口モルヒネ換算量（OME）とブレイクスルー量（10%目安）を算出します。'); }
  getIcon(){ return 'fas fa-scale-balanced'; }
  renderContent(){
    return `
      <div class="alert alert-info"><i class="fas fa-info-circle"></i> 目安換算です。腎機能/年齢/鎮痛効果/副作用を踏まえ、主治医の指示・施設方針を優先してください。</div>
      <div class="assessment-section">
        <h4><i class="fas fa-prescription-bottle"></i> ベースライン用量</h4>
        <div class="form-row">
          <div class="form-group">
            <label for="omeDrug">薬剤/経路</label>
            <select id="omeDrug">
              <option value="morphine_po">モルヒネ（経口, mg/日）</option>
              <option value="oxycodone_po">オキシコドン（経口, mg/日）</option>
              <option value="fentanyl_td">フェンタニル（貼付, mcg/時）</option>
            </select>
          </div>
          <div class="form-group">
            <label for="omeDose" id="omeDoseLabel">用量（mg/日 または mcg/時）</label>
            <input type="number" id="omeDose" step="0.1" min="0" placeholder="例: 30">
          </div>
        </div>
      </div>

      <div class="assessment-section">
        <h4><i class="fas fa-syringe"></i> ブレイクスルー用薬（換算先）</h4>
        <div class="form-row">
          <div class="form-group">
            <label for="omeRescue">換算先</label>
            <select id="omeRescue">
              <option value="morphine_po">モルヒネ（経口）</option>
              <option value="oxycodone_po">オキシコドン（経口）</option>
            </select>
          </div>
          <div class="form-group">
            <label for="omeBtPct">BT割合（%/回）</label>
            <input type="number" id="omeBtPct" step="1" min="5" max="20" value="10">
          </div>
        </div>
      </div>

      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">計算</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="omeResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const calc=new OpioidEquivalenceCalculator(); const el=s.querySelector('.calculator-instance');
    const doseLabelUpdater=()=>{
      const d=s.querySelector('#omeDrug')?.value||'morphine_po';
      const lab=s.querySelector('#omeDoseLabel'); if(!lab) return;
      lab.textContent = (d==='fentanyl_td')? '用量（mcg/時）' : '用量（mg/日）';
    };
    s.querySelector('#omeDrug')?.addEventListener('change', doseLabelUpdater);
    setTimeout(doseLabelUpdater,0);
    el.calculate=()=>calc.calculate(); el.reset=()=>calc.reset(); return s; }
}
class OpioidEquivalenceCalculator {
  constructor(){
    // 換算係数（mgあたりのOME/日）。貼付フェンタニルは mcg/時 → 1 mcg/h ≒ 2.4 mg OME/日 とする。
    this.factors = {
      morphine_po: 1.0,
      oxycodone_po: 1.5,
      fentanyl_td_per_mcg_h: 2.4,
    };
  }
  calcOME(drug, dose){
    if (drug === 'fentanyl_td') { // dose: mcg/h
      return dose * this.factors.fentanyl_td_per_mcg_h;
    }
    // dose: mg/day
    const f = (drug==='oxycodone_po')? this.factors.oxycodone_po : this.factors.morphine_po;
    return dose * f;
  }
  toRescue(rescueDrug, omeMg){
    const f = (rescueDrug==='oxycodone_po')? this.factors.oxycodone_po : this.factors.morphine_po;
    return omeMg / f;
  }
  toFentanylMcgPerHour(omeMg){ return omeMg / this.factors.fentanyl_td_per_mcg_h; }
  roundDose(mg){ return Math.round(mg*2)/2; } // 0.5mg丸め
  calculate(){
    const drug = document.getElementById('omeDrug')?.value||'morphine_po';
    const dose = parseFloat(document.getElementById('omeDose')?.value)||0;
    const rescue = document.getElementById('omeRescue')?.value||'morphine_po';
    const pct = parseFloat(document.getElementById('omeBtPct')?.value)||10;
    const el = document.getElementById('omeResult'); if(!el) return;
    if (dose<=0){ el.innerHTML='<div class="alert alert-danger">用量を入力してください。</div>'; el.style.display='block'; return; }
    const ome = this.calcOME(drug, dose);
    const btOme = ome * (pct/100);
    const btRescue = this.roundDose(this.toRescue(rescue, btOme));
    const drugText = { morphine_po:'モルヒネ（経口）', oxycodone_po:'オキシコドン（経口）', fentanyl_td:'フェンタニル（貼付）' }[drug];
    const rescueText = { morphine_po:'モルヒネ（経口）', oxycodone_po:'オキシコドン（経口）' }[rescue];
    // 等価換算表（スイッチング）
    const morEq = this.toRescue('morphine_po', ome); // mg/day
    const oxyEq = this.toRescue('oxycodone_po', ome); // mg/day
    const fenEq = this.toFentanylMcgPerHour(ome); // mcg/h
    el.innerHTML = `
      <h3>OME/BT換算結果</h3>
      <div class="result-item"><strong>ベース薬剤/用量:</strong> ${drugText} ${dose} ${drug==='fentanyl_td'?'mcg/h':'mg/日'}</div>
      <div class="result-item"><strong>OME（経口モルヒネ換算）:</strong> <span class="highlight">${ome.toFixed(1)}</span> mg/日</div>
      <div class="result-item"><strong>BT目安 (${pct}%/回):</strong> ${btOme.toFixed(1)} mg OME/回</div>
      <div class="result-item"><strong>換算（${rescueText}）:</strong> <span class="highlight">約 ${btRescue}</span> mg/回</div>
      <h4 style="margin-top:12px"><i class="fas fa-arrows-rotate"></i> 等価換算（スイッチング）</h4>
      <div class="table-like">
        <div>モルヒネ経口</div><div><span class="highlight">${morEq.toFixed(1)}</span> mg/日</div>
        <div>オキシコドン経口</div><div><span class="highlight">${oxyEq.toFixed(1)}</span> mg/日</div>
        <div>フェンタニル貼付</div><div><span class="highlight">${fenEq.toFixed(1)}</span> mcg/時</div>
      </div>
      <div class="alert alert-info">注意：併用薬/腎機能/高齢者/せん妄などで減量が必要な場合があります。臨床状況に応じて調整してください。</div>
    `;
    el.style.display='block';
  }
  reset(){ ['omeDose'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); const s1=document.getElementById('omeDrug'); if(s1) s1.selectedIndex=0; const s2=document.getElementById('omeRescue'); if(s2) s2.selectedIndex=0; const p=document.getElementById('omeBtPct'); if(p) p.value=10; const r=document.getElementById('omeResult'); if(r) r.style.display='none'; }
}
