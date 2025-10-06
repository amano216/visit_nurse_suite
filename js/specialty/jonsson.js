/**
 * 専門: Jónsson分類（喘鳴）
 */

class JonssonWheezeTool extends BaseTool {
  constructor(){ super('jonsson','Jónsson分類（喘鳴）','喘鳴（wheezes）の強度を 0–4 の5段階で分類します。'); }
  getIcon(){ return 'fas fa-wind'; }
  renderContent(){
    const opt = (v, jp, en) => `
      <div class="form-group">
        <label class="radio">
          <input type="radio" name="jonGrade" value="${v}">
          <span><strong>Grade ${v}：</strong> ${jp} <small style="color:#666">(${en})</small></span>
        </label>
      </div>`;
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-ear-listen"></i> 分類を選択</h4>
        ${opt(0,'喘鳴なし','no wheezing')}
        ${opt(1,'強制呼気時でのみ聴取','wheezing heard only on forced exhalation')}
        ${opt(2,'平静呼気で聴取','wheezing heard only on expiration during normal tidal breathing')}
        ${opt(3,'平静呼吸で吸・呼気にて聴取','wheezing heard on inspiration and expiration')}
        ${opt(4,'呼吸音減弱（silent chest）','silent chest with markedly diminished breath sounds')}
      </div>

      <div class="citation" style="font-size:0.9em; color:#555; margin-top:8px;">
        <div><strong>【使用上の注意】</strong> 本分類は研究指標の一つであり、喘息の重症度や転帰、PEF等との関連は確立していません。ガイドラインでの標準分類ではありません。</div>
        <div style="margin-top:6px;"><strong>【補足】</strong> Grade 4（silent chest）は重篤な気流閉塞のサインとなり得ます。バイタル悪化や呼吸困難の増悪を伴う場合は緊急対応を検討してください。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong> Jónsson J, et al. Chest. 1988;94(4):723–726. PMID: 3168567.</div>
      </div>

      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">判定</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="jonssonResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new JonssonWheezeCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}

class JonssonWheezeCalculator {
  calculate(){
    const sel = document.querySelector('input[name="jonGrade"]:checked');
    const grade = sel ? parseInt(sel.value) : 0;
    const map = {
      0: {jp:'喘鳴なし', en:'no wheezing', cls:'alert-success', note:'聴取上、喘鳴は認めません。臨床症状やSpO2と総合判断してください。'},
      1: {jp:'強制呼気時のみ', en:'forced exhalation only', cls:'alert-info', note:'軽度の気道狭窄の可能性。経過観察や誘因回避等を検討。'},
      2: {jp:'平静呼気で聴取', en:'expiration during tidal breathing', cls:'alert-warning', note:'気道狭窄の進行が疑われます。治療調整や再評価を検討。'},
      3: {jp:'吸気・呼気で聴取', en:'inspiration and expiration', cls:'alert-warning', note:'全呼吸相での喘鳴は重症化サインになり得ます。臨床所見に応じて対応。'},
      4: {jp:'呼吸音減弱（silent chest）', en:'silent chest', cls:'alert-danger', note:'重篤な気流閉塞の可能性。直ちに医療者レビュー・緊急対応を検討。'}
    };
    const info = map[grade] || map[0];
    const el = document.getElementById('jonssonResult'); if(!el) return;
    el.innerHTML = `
      <h3>Jónsson分類</h3>
      <div class="result-item"><strong>判定:</strong> <span class="highlight">Grade ${grade}</span> — ${info.jp} <small>(${info.en})</small></div>
      <div class="alert ${info.cls}">${info.note}</div>
    `;
    el.style.display='block';
  }
  reset(){ const r = document.querySelector('input[name="jonGrade"]:checked'); if(r) r.checked=false; const el=document.getElementById('jonssonResult'); if(el) el.style.display='none'; }
}
