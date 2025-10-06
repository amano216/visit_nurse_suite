// SIRS（全身性炎症反応症候群）評価ツール
class SIRSTool extends BaseTool {
  constructor(){ super('sirs','SIRS評価','全身性炎症反応症候群を評価します。'); }
  getIcon(){ return 'fas fa-thermometer-full'; }
  renderContent(){
    return `
      <div class="alert alert-info"><strong>SIRS:</strong> 4項目中2項目以上該当で陽性</div>
      <div class="form-row">
        <div class="form-group">
          <label for="bodyTemp">体温 (℃)</label>
          <input type="number" id="bodyTemp" step="0.1" placeholder="例: 37.5">
          <small>正常: 36.0-37.5℃</small>
        </div>
        <div class="form-group">
          <label for="heartRateSirs">心拍数 (回/分)</label>
          <input type="number" id="heartRateSirs" placeholder="例: 95">
          <small>正常: 60-100回/分</small>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="respiratoryRateSirs">呼吸数 (回/分)</label>
          <input type="number" id="respiratoryRateSirs" placeholder="例: 22">
          <small>正常: 12-20回/分</small>
        </div>
        <div class="form-group">
          <label for="wbcCount">白血球数 (/μL)</label>
          <input type="number" id="wbcCount" placeholder="例: 12000">
          <small>正常: 4000-11000/μL</small>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="sirsResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const calc=new SIRSCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>calc.calculate(); el.reset=()=>calc.reset(); return s; }
}
class SIRSCalculator {
  calculate(){
    const bodyTemp=parseFloat(document.getElementById('bodyTemp')?.value)||0;
    const heartRate=parseInt(document.getElementById('heartRateSirs')?.value)||0;
    const respiratoryRate=parseInt(document.getElementById('respiratoryRateSirs')?.value)||0;
    const wbcCount=parseInt(document.getElementById('wbcCount')?.value)||0;
    if(!bodyTemp||!heartRate||!respiratoryRate||!wbcCount){return this.showError('すべての項目を入力してください。');}
    let score=0; const criteria={};
    if(bodyTemp<36.0||bodyTemp>38.0){score++; criteria.temperature=true;} else criteria.temperature=false;
    if(heartRate>90){score++; criteria.heartRate=true;} else criteria.heartRate=false;
    if(respiratoryRate>20){score++; criteria.respiratoryRate=true;} else criteria.respiratoryRate=false;
    if(wbcCount<4000||wbcCount>12000){score++; criteria.wbcCount=true;} else criteria.wbcCount=false;
    this.displayResult(score,criteria,{bodyTemp,heartRate,respiratoryRate,wbcCount});
  }
  displayResult(score,criteria,values){
    const resultDiv=document.getElementById('sirsResult'); if(!resultDiv) return;
    const isPositive=score>=2; const alertClass=isPositive?'alert-danger':'alert-success'; const resultText=isPositive?'SIRS陽性':'SIRS陰性';
    resultDiv.innerHTML=`<h3>SIRS評価結果</h3>
      <div class="result-item"><strong>体温:</strong> ${values.bodyTemp}℃ ${criteria.temperature?'<span class="highlight">基準該当</span>':'正常範囲'}</div>
      <div class="result-item"><strong>心拍数:</strong> ${values.heartRate}回/分 ${criteria.heartRate?'<span class="highlight">基準該当</span>':'正常範囲'}</div>
      <div class="result-item"><strong>呼吸数:</strong> ${values.respiratoryRate}回/分 ${criteria.respiratoryRate?'<span class="highlight">基準該当</span>':'正常範囲'}</div>
      <div class="result-item"><strong>白血球数:</strong> ${values.wbcCount}/μL ${criteria.wbcCount?'<span class="highlight">基準該当</span>':'正常範囲'}</div>
      <div class="result-item"><strong>該当項目数:</strong> <span class="highlight">${score}/4項目</span></div>
      <div class="alert ${alertClass}"><strong>結果:</strong> ${resultText}<br>${isPositive?'感染や炎症が疑われます。医師報告を検討。':'現時点でSIRS基準は満たしません。'}</div>`;
    resultDiv.style.display='block';
  }
  showError(message){ const r=document.getElementById('sirsResult'); if(r){ r.innerHTML=`<div class="alert alert-danger">${message}</div>`; r.style.display='block'; } }
  reset(){ ['bodyTemp','heartRateSirs','respiratoryRateSirs','wbcCount'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); const r=document.getElementById('sirsResult'); if(r) r.style.display='none'; }
}
