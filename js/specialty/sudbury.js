/**
 * 専門: Sudbury Vertigo Risk Score（めまい）
 */

class SudburyVertigoTool extends BaseTool {
  constructor(){ super('sudbury','Sudbury Vertigo Risk Score（めまい）','めまい患者における重症原因（脳卒中/TIA/椎骨動脈解離/脳腫瘍）のリスク予測スコア。'); }
  getIcon(){ return 'fas fa-person'; }
  renderContent(){
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-clipboard-list"></i> リスク因子</h4>
        <div class="form-row">
          <div class="form-group"><label><input type="checkbox" id="sv_male"> 男性（+1）</label></div>
          <div class="form-group"><label><input type="checkbox" id="sv_age65"> 65歳以上（+1）</label></div>
          <div class="form-group"><label><input type="checkbox" id="sv_htn"> 高血圧（+1）</label></div>
          <div class="form-group"><label><input type="checkbox" id="sv_dm"> 糖尿病（+3）</label></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label><input type="checkbox" id="sv_motorSens"> 運動/感覚障害（+5）</label></div>
          <div class="form-group">
            <label>小脳症状（+6）</label>
            <div class="form-row" style="gap:8px;">
              <label><input type="checkbox" class="sv_cereb"> 複視</label>
              <label><input type="checkbox" class="sv_cereb"> 構音障害</label>
              <label><input type="checkbox" class="sv_cereb"> 嚥下障害</label>
              <label><input type="checkbox" class="sv_cereb"> 測定障害（dysmetria）</label>
              <label><input type="checkbox" class="sv_cereb"> 失調</label>
            </div>
          </div>
          <div class="form-group"><label><input type="checkbox" id="sv_bppv"> BPPV診断（-5）</label></div>
        </div>
      </div>

      <div class="citation" style="font-size:0.9em; color:#555; margin-top:8px;">
        <div><strong>【どんなスコア？】</strong> 2024年にカナダの前向き多施設コホートで開発・検証された、めまい患者における<strong>重症原因の予測スコア</strong>です（対象2,078人、重症診断5.3%）。</div>
        <div style="margin-top:6px;"><strong>【性能】</strong> カットオフ <u>&lt;5点</u> で <u>感度100%</u>（95%CI 97–100%）、特異度72.1%（95%CI 70.1–74%）、C統計量0.96（95%CI 0.92–0.98）。低リスク群では重症診断0%と報告。</div>
        <div style="margin-top:6px;"><strong>【使用上の注意】</strong> 現時点で外部検証や本邦検証は限定的です。臨床判断（神経所見、HINTS、危険兆候、バイタル）を優先し、スコアは補助として用いてください。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong> Ohle R, et al. Development of a Clinical Risk Score to Risk Stratify for a Serious Cause of Vertigo in Patients Presenting to the Emergency Department. Ann Emerg Med. 2024 Aug 1:S0196-0644(24)00326-3. PMID: 39093245.</div>
      </div>

      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">計算</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="sudburyResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new SudburyVertigoCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}

class SudburyVertigoCalculator {
  calculate(){
    const val = (id,pts)=> (document.getElementById(id)?.checked? pts:0);
    const male = val('sv_male',1);
    const age65 = val('sv_age65',1);
    const htn = val('sv_htn',1);
    const dm = val('sv_dm',3);
    const motorSens = val('sv_motorSens',5);
    const cerebAny = Array.from(document.querySelectorAll('.sv_cereb')).some(ch=> ch.checked) ? 6 : 0;
    const bppv = val('sv_bppv',-5);
    const total = male + age65 + htn + dm + motorSens + cerebAny + bppv;

    let risk='低リスク'; let advice='追加検査不要（臨床により異なる）'; let rate='0%'; let cls='alert-success';
    if (total>=9){ risk='高リスク'; advice='緊急検査・治療、専門医紹介を検討'; rate='41%'; cls='alert-danger'; }
    else if (total>=5){ risk='中リスク'; advice='他の診断がなければ追加検査を検討'; rate='2.1%'; cls='alert-warning'; }

    const el=document.getElementById('sudburyResult'); if(!el) return;
    el.innerHTML = `
      <h3>Sudbury Vertigo Risk Score</h3>
      <div class="result-item"><strong>合計点:</strong> <span class="highlight">${total}</span></div>
      <div class="alert ${cls}"><strong>${risk}</strong>（参考: 重症診断率 ${rate}） — ${advice}</div>
      <small>注: しきい値 &lt;5 点で感度100%と報告。陰性でも危険兆候があれば神経所見・HINTS等で再評価。</small>
    `;
    el.style.display='block';
  }
  reset(){ ['sv_male','sv_age65','sv_htn','sv_dm','sv_motorSens','sv_bppv'].forEach(id=>{ const e=document.getElementById(id); if(e) e.checked=false; }); document.querySelectorAll('.sv_cereb').forEach(e=> e.checked=false); const r=document.getElementById('sudburyResult'); if(r) r.style.display='none'; }
}
