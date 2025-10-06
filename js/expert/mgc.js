// -------- MG Composite（重症筋無力症 合成指標） --------
class MGCompositeTool extends BaseTool {
  constructor(){ super('mgc','MG Composite（重症筋無力症）','眼球運動・球症状・呼吸・体幹/四肢の10項目を加重合計して重症度を評価します。'); }
  getIcon(){ return 'fas fa-dumbbell'; }
  renderContent(){
    const sel = (id, max) => `<div class="form-group"><label for="${id}">${id} (0-${max})</label><select id="${id}">${Array.from({length:max+1},(_,i)=>`<option value="${i}">${i}</option>`).join('')}</select></div>`;
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-eye"></i> 眼（Ocular）</h4>
        <div class="form-row">
          ${sel('Ptosis',4)}
          ${sel('Diplopia',4)}
          ${sel('EyeClosure',4)}
        </div>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-comment"></i> 球（Bulbar）</h4>
        <div class="form-row">
          ${sel('Talking',4)}
          ${sel('Chewing',4)}
          ${sel('Swallowing',6)}
        </div>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-lungs"></i> 呼吸（Respiratory）</h4>
        <div class="form-row">${sel('Breathing',9)}</div>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-child"></i> 体幹/四肢（Axial/Limb）</h4>
        <div class="form-row">
          ${sel('NeckFlexion',4)}
          ${sel('ShoulderAbduction',5)}
          ${sel('HipFlexion',6)}
        </div>
      </div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <div><strong>【解説】</strong> MG Composite（MGC）は MG-ADL と QMG の長所を取り入れて構成された合成指標で、<u>10項目の加重点の合計</u>で重症度変化を捉えます。ここでは各項目の<u>スコアを直接入力</u>し、ドメイン別と総合スコアを自動集計します。</div>
        <div style="margin-top:6px;"><strong>【臨床的変化】</strong> 一般に <u>3点以上の変化</u>は臨床的に意味がある可能性が示唆されています（施設の運用に従って解釈）。</div>
        <div style="margin-top:6px;"><strong>【注意】</strong> 実施手順・アンカー（基準）の詳細は原著に準拠してください。スクリーニング/フォロー用であり、診断は神経内科専門医の評価を要します。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>Burns TM, et al. Construction of an efficient evaluative instrument for myasthenia gravis: the MG composite. Muscle Nerve. 2008;38(6):1553–1562. PMID: 19016543.</li>
            <li>Burns TM, et al. The MG Composite: A valid and reliable outcome measure for myasthenia gravis. Neurology. 2010;74(18):1434–1440. PMID: 20439845.</li>
          </ul>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">集計</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="mgcResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new MGCompositeCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class MGCompositeCalculator {
  calculate(){
    const get=(id)=> parseInt(document.getElementById(id)?.value)||0;
    const ocular = get('Ptosis') + get('Diplopia') + get('EyeClosure');
    const bulbar = get('Talking') + get('Chewing') + get('Swallowing');
    const resp = get('Breathing');
    const limb = get('NeckFlexion') + get('ShoulderAbduction') + get('HipFlexion');
    const total = ocular + bulbar + resp + limb;
    const el=document.getElementById('mgcResult'); if(!el) return;
    el.innerHTML = `
      <h3>MG Composite 集計</h3>
      <div class="result-item"><strong>総合スコア:</strong> <span class="highlight">${total}</span></div>
      <div class="result-item"><strong>ドメイン内訳:</strong> 眼 ${ocular} / 球 ${bulbar} / 呼吸 ${resp} / 体幹・四肢 ${limb}</div>
      <div class="alert ${total>=20?'alert-danger':(total>=10?'alert-warning':'alert-info')}">参考: スコアは重症度の目安です（施設基準/経時変化を優先）。3点以上の変化は臨床的意義の可能性。</div>
    `;
    el.style.display='block';
  }
  reset(){ ['Ptosis','Diplopia','EyeClosure','Talking','Chewing','Swallowing','Breathing','NeckFlexion','ShoulderAbduction','HipFlexion'].forEach(id=>{ const e=document.getElementById(id); if(e) e.selectedIndex=0; }); const r=document.getElementById('mgcResult'); if(r) r.style.display='none'; }
}
