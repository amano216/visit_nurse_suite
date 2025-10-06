// -------- Cockcroft-Gault --------
class CrClTool extends BaseTool {
  constructor(){ super('crcl','腎機能推定（Cockcroft-Gault）','年齢・体重・血清CrからCrClを推定します。'); }
  getIcon(){ return 'fas fa-vial'; }
  renderContent(){
    return `
      <div class="form-row">
        <div class="form-group"><label for="crclAge">年齢</label><input type="number" id="crclAge" min="1" max="120" placeholder="例: 75"></div>
        <div class="form-group"><label for="crclSex">性別</label><select id="crclSex"><option value="male">男性</option><option value="female">女性</option></select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label for="crclWeight">体重(kg)</label><input type="number" id="crclWeight" step="0.1" min="1"></div>
        <div class="form-group"><label for="crclScr">血清クレアチニン(mg/dL)</label><input type="number" id="crclScr" step="0.01" min="0.1" placeholder="例: 0.9"></div>
        <div class="form-group"><label for="crclScrMethod">Cr測定法</label>
          <select id="crclScrMethod">
            <option value="enz">酵素法</option>
            <option value="jaffe">Jaffe法</option>
          </select>
        </div>
      </div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <div><strong>【解説】</strong> Cockcroft–Gault式: CCr (mL/min) = (140−年齢)×体重 / (72×血清Cr)（女性は×0.85）。原著（1976）ではJaffe法Crが用いられており、本邦の酵素法Crでは <u>血清Crに+0.2 mg/dLを加算</u> して近似することが推奨されています。</div>
        <div style="margin-top:6px;"><strong>【使用上の注意】</strong> 体重・筋量が極端（低体重・肥満・サルコペニア等）の場合は不正確になり得ます。必要に応じて体重の扱い（実測/理想/調整）や他式の併用を検討してください。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>Cockcroft DW, Gault MH. Prediction of creatinine clearance from serum creatinine. Nephron. 1976;16(1):31-41.</li>
            <li>日本腎臓学会 編. エビデンスに基づくCKD診療ガイドライン 2023.</li>
          </ul>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">計算実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="crclResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new CrClCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class CrClCalculator {
  calculate(){
    const age=parseInt(document.getElementById('crclAge')?.value)||0;
    const sex=document.getElementById('crclSex')?.value||'male';
    const wt=parseFloat(document.getElementById('crclWeight')?.value)||0;
    const scr=parseFloat(document.getElementById('crclScr')?.value)||0;
    const method=document.getElementById('crclScrMethod')?.value||'enz';
    if (age<=0||wt<=0||scr<=0) return this.err('年齢・体重・Crを入力してください。');
    const scrAdj = method==='enz' ? scr + 0.2 : scr; // 酵素法→+0.2補正
    let crcl=((140-age)*wt)/(72*scrAdj); if (sex==='female') crcl*=0.85;
    const el=document.getElementById('crclResult'); const cat=crcl<30?'高度低下':(crcl<60?'中等度低下':'軽度〜正常'); const alert=crcl<60?'alert-warning':'alert-success';
    const methodNote = method==='enz' ? `（酵素法→+0.2補正後のCr=${scrAdj.toFixed(2)} mg/dL）` : '（Jaffe法Cr）';
    el.innerHTML=`<h3>Cockcroft-Gault</h3>
      <div class="result-item"><strong>CrCl:</strong> <span class="highlight">${crcl.toFixed(1)}</span> mL/min</div>
      <div class="result-item"><strong>使用Cr:</strong> ${scr.toFixed(2)} mg/dL ${methodNote}</div>
      <div class="alert ${alert}">腎機能: ${cat}</div>`; el.style.display='block';
  }
  err(m){ const el=document.getElementById('crclResult'); el.innerHTML=`<div class="alert alert-danger">${m}</div>`; el.style.display='block'; }
  reset(){ ['crclAge','crclSex','crclWeight','crclScr','crclScrMethod'].forEach(id=>{const e=document.getElementById(id); if(!e) return; if(e.tagName==='SELECT') e.selectedIndex=0; else e.value='';}); const r=document.getElementById('crclResult'); if(r) r.style.display='none'; }
}
