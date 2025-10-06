// -------- PPS --------
class PPSTool extends BaseTool {
  constructor(){ super('pps','Palliative Performance Scale','パフォーマンス%（0-100）で在宅緩和ケアの方針検討に役立てます。'); }
  getIcon(){ return 'fas fa-percentage'; }
  renderContent(){
    return `
      <div class="form-group">
        <label for="ppsValue">PPS（%）</label>
        <select id="ppsValue">${[100,90,80,70,60,50,40,30,20,10,0].map(v=>`<option value="${v}">${v}%</option>`).join('')}</select>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <div id="ppsResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new PPSCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); return s; }
}
class PPSCalculator { calculate(){ const v=parseInt(document.getElementById('ppsValue')?.value)||0; const el=document.getElementById('ppsResult'); let note='自立'; if(v<=50) note='要介助・ベッド中心'; else if(v<=70) note='家事/外出制限'; el.innerHTML=`<h3>PPS</h3><div class="result-item"><strong>値:</strong> <span class="highlight">${v}%</span></div><div class="alert ${v<=50?'alert-warning':'alert-info'}">目安: ${note}</div>`; el.style.display='block'; } }
