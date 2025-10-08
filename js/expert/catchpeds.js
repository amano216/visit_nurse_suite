// -------- CATCH（小児頭部外傷ルール） --------
class CATCHPedsTool extends BaseTool {
  constructor(){
    super('catchpeds','CATCH（小児頭部外傷）','小児頭部外傷における頭部CTの適応判断を支援します（Canadian Assessment of Tomography for Childhood Head injury）。');
  }
  getIcon(){ return 'fas fa-child'; }
  renderContent(){
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-circle-info"></i> 対象条件（全て満たす）</h4>
        <div class="form-row">
          <div class="form-group"><label>年齢（歳）</label><input type="number" id="catch_age" min="0" max="16" step="1" placeholder="例: 6"></div>
          <div class="form-group"><label>受傷からの時間（時間）</label><input type="number" id="catch_hours" min="0" step="0.1" placeholder="例: 3.5"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><input type="checkbox" id="catch_gcs1315"><label for="catch_gcs1315"> 来院時GCS 13–15</label></div>
          <div class="form-group"><input type="checkbox" id="catch_criteria_any"><label for="catch_criteria_any"> 下記いずれかの症状あり（意識消失／健忘・見当識障害／嘔吐2回以上／2歳以下の易刺激性）</label></div>
        </div>
      </div>

      <div class="assessment-section">
        <h4><i class="fas fa-triangle-exclamation"></i> 高リスク（介入を要する可能性）</h4>
        <div class="form-row">
          <div class="form-group"><input type="checkbox" id="catch_hr_gcs2h"><label for="catch_hr_gcs2h"> 受傷2時間後もGCS &lt; 15</label></div>
          <div class="form-group"><input type="checkbox" id="catch_hr_fracture"><label for="catch_hr_fracture"> 開放／陥没骨折が疑われる</label></div>
        </div>
        <div class="form-row">
          <div class="form-group"><input type="checkbox" id="catch_hr_headache"><label for="catch_hr_headache"> 悪化する頭痛</label></div>
          <div class="form-group"><input type="checkbox" id="catch_hr_irritable"><label for="catch_hr_irritable"> 診察で易刺激性</label></div>
        </div>
      </div>

      <div class="assessment-section">
        <h4><i class="fas fa-square-exclamation"></i> 中リスク（CTで所見を認めやすい）</h4>
        <div class="form-row">
          <div class="form-group"><input type="checkbox" id="catch_mr_basal"><label for="catch_mr_basal"> 基底骨折徴候（耳血腫・パンダ目・CSF漏・Battle徴）</label></div>
          <div class="form-group"><input type="checkbox" id="catch_mr_scalp"><label for="catch_mr_scalp"> 大きな柔らかい頭皮血腫（boggy）</label></div>
        </div>
        <div class="form-group"><label>危険な受傷機転（いずれか）</label>
          <div class="form-row" style="gap:8px;">
            <label><input type="checkbox" class="catch_mech"> 交通外傷（車外放出 など）</label>
            <label><input type="checkbox" class="catch_mech"> 高所からの落下（≥3ft／5段以上）</label>
            <label><input type="checkbox" class="catch_mech"> ヘルメット未着用の自転車転倒</label>
          </div>
        </div>
      </div>

      <div class="citation" style="font-size:0.9em; color:#555; margin-top:8px;">
        <div><strong>【どんなルール？】</strong> 小児軽症頭部外傷における頭部CTの適応を判断する意思決定ルールです。<u>高リスクのいずれか</u>で<strong>CT撮像強く推奨</strong>、<u>中リスクのいずれか</u>で<strong>CT撮像を考慮</strong>します。</div>
        <div style="margin-top:6px;"><strong>【対象】</strong> 17歳未満、来院時GCS13–15、受傷後24時間以内、かつ症状（意識消失/健忘/見当識障害/嘔吐≥2/2歳以下の易刺激性）のいずれか。</div>
        <div style="margin-top:6px;"><strong>【注意】</strong> 陰性でも見逃しがゼロではありません。神経学的悪化・けいれん・抗凝固療法など別の理由がある場合は本ルールに関わらずCT/観察を検討。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong> Osmond MH, et al. CATCH: a clinical decision rule for CT in children with minor head injury. CMAJ. 2010;182(4):341–348. PMID: 20142371.</div>
      </div>

      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">判定</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="catchResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){
    const s=super.render();
    const c=new CATCHPedsCalculator();
    const el=s.querySelector('.calculator-instance');
    el.calculate=()=>c.calculate();
    el.reset=()=>c.reset();
    return s;
  }
}

class CATCHPedsCalculator {
  calculate(){
    const age = parseInt(document.getElementById('catch_age')?.value);
    const hours = parseFloat(document.getElementById('catch_hours')?.value);
    const gcs1315 = !!document.getElementById('catch_gcs1315')?.checked;
    const anySym = !!document.getElementById('catch_criteria_any')?.checked;

    const ageOk = Number.isFinite(age) && age < 17;
    const hoursOk = Number.isFinite(hours) && hours <= 24;
    const eligible = ageOk && hoursOk && gcs1315 && anySym;

    const hr = [
      !!document.getElementById('catch_hr_gcs2h')?.checked,
      !!document.getElementById('catch_hr_fracture')?.checked,
      !!document.getElementById('catch_hr_headache')?.checked,
      !!document.getElementById('catch_hr_irritable')?.checked,
    ];
    const mr = [
      !!document.getElementById('catch_mr_basal')?.checked,
      !!document.getElementById('catch_mr_scalp')?.checked,
      Array.from(document.querySelectorAll('.catch_mech')).some(x=>x.checked)
    ];
    const hrCount = hr.filter(Boolean).length;
    const mrCount = mr.filter(Boolean).length;

    const el = document.getElementById('catchResult'); if(!el) return;

    if (!eligible){
      el.innerHTML = `
        <h3>CATCH 適用外</h3>
        <div class="alert alert-info">本ルールの対象条件を満たしていません（年齢&lt;17、受傷≤24時間、GCS13–15、症状のいずれか）。臨床判断や他ルール（PECARN/CHALICE など）をご検討ください。</div>
      `;
      el.style.display='block';
      return;
    }

    let verdict = '';
    let cls = 'alert-success';
    if (hrCount>0){ verdict = '頭部CTを撮像（高リスク項目あり）＋神経外科コンサルトを検討'; cls='alert-danger'; }
    else if (mrCount>0){ verdict = '頭部CT撮像を考慮（中リスク項目あり）'; cls='alert-warning'; }
    else { verdict = '原則CT不要（経過観察と再評価）'; cls='alert-success'; }

    el.innerHTML = `
      <h3>CATCH 判定</h3>
      <div class="result-item"><strong>高リスク:</strong> ${hrCount} / 4、<strong>中リスク:</strong> ${mrCount} / 3</div>
      <div class="alert ${cls}"><strong>推奨:</strong> ${verdict}</div>
      <small>注: 本ルール陰性でも臨床的に必要なら画像検査を行ってください。</small>
    `;
    el.style.display='block';
  }
  reset(){
    ['catch_age','catch_hours'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; });
    ['catch_gcs1315','catch_criteria_any','catch_hr_gcs2h','catch_hr_fracture','catch_hr_headache','catch_hr_irritable','catch_mr_basal','catch_mr_scalp']
      .forEach(id=>{ const e=document.getElementById(id); if(e) e.checked=false; });
    document.querySelectorAll('.catch_mech').forEach(e=> e.checked=false);
    const r=document.getElementById('catchResult'); if(r) r.style.display='none';
  }
}
