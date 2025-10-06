// -------- Mini-Cog --------
class MiniCogTool extends BaseTool {
  constructor(){ super('minicog','Mini-Cog（認知スクリーニング）','3語記銘（0-3点）と時計描画（0/2点）で0-5点評価します。'); }
  getIcon(){ return 'fas fa-brain'; }
  renderContent(){
    return `
      <div class="assessment-section">
        <div class="form-row">
          <div class="form-group"><label for="mcRecall">3語再生</label><select id="mcRecall"><option value="0">0 語</option><option value="1">1 語</option><option value="2">2 語</option><option value="3">3 語</option></select></div>
          <div class="form-group"><label for="mcClock">時計描画</label><select id="mcClock"><option value="0">異常(0点)</option><option value="2">正常(2点)</option></select></div>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">採点</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="mcResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new MiniCogCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class MiniCogCalculator {
  calculate(){ const recall=parseInt(document.getElementById('mcRecall')?.value)||0; const clock=parseInt(document.getElementById('mcClock')?.value)||0; const total=recall+clock; const el=document.getElementById('mcResult'); const pos = total<3; const cat = pos? '認知症の可能性あり' : '可能性は低い'; el.innerHTML=`<h3>Mini-Cog</h3><div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 5</div><div class="alert ${pos?'alert-warning':'alert-success'}">${cat}（3未満で陽性）</div>`; el.style.display='block'; }
  reset(){ ['mcRecall','mcClock'].forEach(id=>{ const e=document.getElementById(id); if(e) e.selectedIndex=0; }); const r=document.getElementById('mcResult'); if(r) r.style.display='none'; }
}
