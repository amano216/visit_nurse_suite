// -------- STOP-Bang（OSA簡易） --------
class STOPBangTool extends BaseTool {
  constructor(){ super('stopbang','STOP-Bang（睡眠時無呼吸）','いびき/日中眠気/無呼吸/高血圧/BMI/年齢/頸囲/性別の8項目。'); }
  getIcon(){ return 'fas fa-moon'; }
  renderContent(){
    return `
      <div class="assessment-section">
        <div class="form-row">
          <div class="form-group"><label><input type="checkbox" id="sbSnore"> いびきが大きい（S）</label></div>
          <div class="form-group"><label><input type="checkbox" id="sbTired"> 日中の疲労/眠気（T）</label></div>
          <div class="form-group"><label><input type="checkbox" id="sbObserved"> 無呼吸の目撃（O）</label></div>
          <div class="form-group"><label><input type="checkbox" id="sbBP"> 高血圧（P）</label></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label for="sbBMI">BMI</label><input type="number" id="sbBMI" step="0.1" placeholder="例: 36"></div>
          <div class="form-group"><label for="sbAge">年齢</label><input type="number" id="sbAge" min="0" max="120" placeholder="例: 58"></div>
          <div class="form-group"><label for="sbNeck">頸囲(cm)</label><input type="number" id="sbNeck" step="0.1" placeholder="例: 42"></div>
          <div class="form-group"><label for="sbSex">性別</label><select id="sbSex"><option value="male">男性</option><option value="female">女性</option></select></div>
        </div>
        <small>加点条件：BMI≥35, 年齢>50, 頸囲>40cm, 男性</small>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">採点</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="sbResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new STOPBangCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class STOPBangCalculator {
  calculate(){
    let score = 0;
    score += (document.getElementById('sbSnore')?.checked?1:0);
    score += (document.getElementById('sbTired')?.checked?1:0);
    score += (document.getElementById('sbObserved')?.checked?1:0);
    score += (document.getElementById('sbBP')?.checked?1:0);
    const bmi=parseFloat(document.getElementById('sbBMI')?.value)||0; if (bmi>=35) score++;
    const age=parseInt(document.getElementById('sbAge')?.value)||0; if (age>50) score++;
    const neck=parseFloat(document.getElementById('sbNeck')?.value)||0; if (neck>40) score++;
    const sex=document.getElementById('sbSex')?.value||'male'; if (sex==='male') score++;
    let risk='低リスク'; let alert='alert-success'; if (score>=5) { risk='高リスク'; alert='alert-danger'; } else if (score>=3) { risk='中等度リスク'; alert='alert-warning'; }
    const el=document.getElementById('sbResult');
    el.innerHTML=`<h3>STOP-Bang</h3><div class="result-item"><strong>合計:</strong> <span class="highlight">${score}</span> / 8（${risk}）</div><div class="alert ${alert}">必要に応じて睡眠検査/耳鼻科紹介を検討。</div>`; el.style.display='block';
  }
  reset(){ ['sbSnore','sbTired','sbObserved','sbBP'].forEach(id=>{ const e=document.getElementById(id); if(e) e.checked=false; }); ['sbBMI','sbAge','sbNeck'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); const s=document.getElementById('sbSex'); if(s) s.selectedIndex=0; const r=document.getElementById('sbResult'); if(r) r.style.display='none'; }
}
