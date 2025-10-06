// -------- SAS（身体活動能力早見表） --------
class SASTool extends BaseTool {
  constructor(){ super('sas','SAS（身体活動能力）','できる活動から推定METsを算出し、身体活動能力を簡易分類します。'); }
  getIcon(){ return 'fas fa-person-running'; }
  renderContent(){
    const activities = [
      {id:'sas1', label:'身の回りの用事（食事・更衣・室内歩行）', mets:2.0},
      {id:'sas2', label:'ゆっくり歩く（4km/h未満）、食器洗い', mets:2.5},
      {id:'sas3', label:'階段を1-2階上がる、平地を早歩き（約5km/h）', mets:4.0},
      {id:'sas4', label:'軽い掃除や買い物での早歩き（負荷のある持ち運び）', mets:5.0},
      {id:'sas5', label:'軽いジョギング（ゆっくり）または坂道歩行', mets:7.0}
    ];
    return `
      <div class="assessment-section">
        <div class="als-grid">
          ${activities.map(a=>`<div class=\"form-group\"><label><input type=\"radio\" name=\"sasAct\" value=\"${a.mets}\"> ${a.label}（約${a.mets} METs）</label></div>`).join('')}
        </div>
        <small>最も高いレベルで「無理なく可能」な活動を選択してください。</small>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">推定</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="sasResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new SASCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class SASCalculator {
  calculate(){
    const sel = document.querySelector('input[name="sasAct"]:checked');
    if (!sel) { const el=document.getElementById('sasResult'); if(el){ el.innerHTML='<div class="alert alert-danger">活動レベルを選択してください。</div>'; el.style.display='block'; } return; }
    const mets = parseFloat(sel.value)||0;
    let cat='低（<4 METs）'; let alert='alert-warning';
    if (mets>=7) { cat='高（≥7 METs）'; alert='alert-success'; }
    else if (mets>=4) { cat='中（4–6 METs）'; alert='alert-info'; }
    const el=document.getElementById('sasResult');
    el.innerHTML=`<h3>SAS推定</h3><div class="result-item"><strong>推定METs:</strong> <span class="highlight">${mets.toFixed(1)}</span></div><div class="alert ${alert}">身体活動能力: ${cat}。治療/リハや手術前評価の参考に。</div>`;
    el.style.display='block';
  }
  reset(){ const rads=[...document.querySelectorAll('input[name="sasAct"]')]; rads.forEach(r=> r.checked=false); const el=document.getElementById('sasResult'); if(el) el.style.display='none'; }
}
