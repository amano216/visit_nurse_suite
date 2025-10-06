// -------- Charlson Comorbidity Index (CCI) --------
class CharlsonTool extends BaseTool {
  constructor(){ super('cci','Charlson併存疾患指数（CCI）','併存疾患の重み付け合計で予後を推定します（必要に応じて年齢点加算）。'); }
  getIcon(){ return 'fas fa-list-check'; }
  renderContent(){
    const item = (id,label,score)=>`<div class="form-group"><label><input type="checkbox" id="${id}" value="${score}"> ${label}（${score}）</label></div>`;
    return `
      <div class="assessment-section">
        <div class="form-row">
          <div>
            ${item('cciMI','心筋梗塞',1)}
            ${item('cciCHF','うっ血性心不全',1)}
            ${item('cciPVD','末梢血管疾患',1)}
            ${item('cciCVD','脳血管疾患',1)}
            ${item('cciDementia','認知症',1)}
            ${item('cciCOPD','慢性肺疾患',1)}
            ${item('cciCTD','結合組織疾患',1)}
            ${item('cciUlcer','消化性潰瘍',1)}
            ${item('cciLiverMild','肝疾患（軽度）',1)}
            ${item('cciDM','糖尿病（合併症なし）',1)}
          </div>
          <div>
            ${item('cciDMC','糖尿病（臓器障害あり）',2)}
            ${item('cciHemiplegia','片麻痺',2)}
            ${item('cciRenal','中等度〜重度腎疾患',2)}
            ${item('cciCancer','固形がん',2)}
            ${item('cciLeukemia','白血病',2)}
            ${item('cciLymphoma','リンパ腫',2)}
            ${item('cciLiverSev','肝疾患（中等度〜重度）',3)}
            ${item('cciMets','転移性固形がん',6)}
            ${item('cciAIDS','AIDS',6)}
          </div>
        </div>
        <div class="form-group">
          <input type="checkbox" id="cciAgeUse"><label for="cciAgeUse"> 年齢ポイントを加算する</label>
        </div>
        <div class="form-group">
          <label for="cciAge">年齢</label>
          <input type="number" id="cciAge" min="0" max="120" placeholder="例: 78" disabled>
        </div>
        <small>年齢点の目安：50-59:+1, 60-69:+2, 70-79:+3, 80以上:+4（参考）</small>
      </div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <div><strong>【解説】</strong> Charlson併存疾患指数（CCI）は、死亡に寄与する併存疾患に重み付けを行い合計する指標。必要に応じて年齢ポイントを加算して用います。</div>
        <div style="margin-top:6px;"><strong>【相互排他】</strong> 「糖尿病（合併症なし）」と「糖尿病（臓器障害あり）」、「肝疾患（軽度）」と「肝疾患（中等度〜重度）」、「固形がん」と「転移性固形がん」は重複加点せず高い方のみ採用。</div>
        <div style="margin-top:6px;"><strong>【参考：10年生存率（1987式）】</strong> 10年生存率 ≈ 0.983^{ e^{CCI×0.9} }（CCIは年齢点を含まない疾患スコア）。古いコホートに基づくため目安として解釈。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong> Charlson ME, et al. J Chronic Dis. 1987;40(5):373–383. PMID:3558716 ／ Quan H, et al. Am J Epidemiol. 2011;173(6):676–682. PMID:21330339</div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">計算</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="cciResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){
    const s = super.render();
    const c = new CharlsonCalculator();
    const el = s.querySelector('.calculator-instance');
    el.calculate = () => c.calculate();
    el.reset = () => c.reset();
    const ageUseCheckbox = s.querySelector('#cciAgeUse');
    const ageInput = s.querySelector('#cciAge');
    ageUseCheckbox?.addEventListener('change', () => {
      if(!ageInput) return;
      ageInput.disabled = !ageUseCheckbox.checked;
      if (!ageUseCheckbox.checked) ageInput.value = '';
    });
    return s;
  }
}
class CharlsonCalculator {
  agePoint(age){ if (age>=80) return 4; if (age>=70) return 3; if (age>=60) return 2; if (age>=50) return 1; return 0; }
  calculate(){
    const ids=['cciMI','cciCHF','cciPVD','cciCVD','cciDementia','cciCOPD','cciCTD','cciUlcer','cciLiverMild','cciDM','cciDMC','cciHemiplegia','cciRenal','cciCancer','cciLeukemia','cciLymphoma','cciLiverSev','cciMets','cciAIDS'];
    const get=(id)=> !!document.getElementById(id)?.checked; const w=(id)=> parseInt(document.getElementById(id)?.value)||0;
    const dm=get('cciDM'), dmc=get('cciDMC');
    const livMild=get('cciLiverMild'), livSev=get('cciLiverSev');
    const ca=get('cciCancer'), mets=get('cciMets');
    let diseaseScore=0;
    ids.forEach(id=>{
      if (id==='cciDM' && dmc) return;
      if (id==='cciLiverMild' && livSev) return;
      if (id==='cciCancer' && mets) return;
      if (get(id)) diseaseScore += w(id);
    });
    const useAge = document.getElementById('cciAgeUse')?.checked||false; const age=parseInt(document.getElementById('cciAge')?.value)||0; const ap = useAge? this.agePoint(age):0; const sum = diseaseScore + ap;
    const el=document.getElementById('cciResult');
    const surv10 = Math.pow(0.983, Math.exp(diseaseScore * 0.9));
    const survPct = isFinite(surv10)? (surv10*100).toFixed(1)+'%' : '-';
    el.innerHTML=`<h3>Charlson CCI</h3>
      <div class="result-item"><strong>疾患合計:</strong> ${diseaseScore}</div>
      <div class="result-item"><strong>年齢点:</strong> ${ap}</div>
      <div class="result-item"><strong>合計スコア:</strong> <span class="highlight">${sum}</span></div>
      <div class="result-item"><strong>参考: 10年生存率（1987式）:</strong> ${survPct}</div>
      <div class="text-muted" style="font-size:0.9em;">注: 1987年コホートに基づく推定であり、現在の治療進歩を反映しない可能性があります。</div>
      <div class="alert ${sum>=6?'alert-danger':(sum>=3?'alert-warning':'alert-info')}">高スコアほど予後不良リスクが高い可能性（施設方針/主治医の判断を優先）。</div>`;
    el.style.display='block';
  }
  reset(){
    ['cciAgeUse','cciMI','cciCHF','cciPVD','cciCVD','cciDementia','cciCOPD','cciCTD','cciUlcer','cciLiverMild','cciDM','cciDMC','cciHemiplegia','cciRenal','cciCancer','cciLeukemia','cciLymphoma','cciLiverSev','cciMets','cciAIDS'].forEach(id=>{ const e=document.getElementById(id); if(!e) return; if(e.type==='checkbox') e.checked=false; else e.value=''; });
    const ageInput = document.getElementById('cciAge');
    if(ageInput) { ageInput.value = ''; ageInput.disabled = true; }
    const r=document.getElementById('cciResult'); if(r) r.style.display='none';
  }
}
