/**
 * 専門: ALS-FRS-R（12項目）
 */

class ALSFRSTool extends BaseTool {
  constructor(){ super('alsfrs','ALS-FRS-R（12項目）','ALS機能評価（0-48点）を算出します。'); }
  getIcon(){ return 'fas fa-dna'; }
  renderContent(){
    const items = [
      {id:'alsSpeech', label:'言語'},
      {id:'alsSalivation', label:'流涎'},
      {id:'alsSwallow', label:'嚥下'},
      {id:'alsHandwriting', label:'書字'},
      {id:'alsCutting', label:'食事（カトラリー）'},
      {id:'alsDressing', label:'整容'},
      {id:'alsBedMobility', label:'起居/寝返り'},
      {id:'alsWalking', label:'歩行'},
      {id:'alsStairs', label:'階段'},
      {id:'alsDyspnea', label:'呼吸困難'},
      {id:'alsOrthopnea', label:'起坐呼吸'},
      {id:'alsRespInsuff', label:'呼吸不全'}
    ];
    const block = (title, ids) => `
      <div class="assessment-section">
        <h4><i class="fas fa-layer-group"></i> ${title}</h4>
        <div class="als-grid">
          ${ids.map((i)=>`
            <div class="form-group">
              <label for="${i.id}">${i.label}（0-4）</label>
              <select id="${i.id}">
                <option value="4">4: 正常</option>
                <option value="3">3: 軽度低下</option>
                <option value="2">2: 中等度低下</option>
                <option value="1">1: 高度低下</option>
                <option value="0">0: 不能</option>
              </select>
            </div>
          `).join('')}
        </div>
      </div>`;

    return `
      ${block('Bulbar（球麻痺）',[items[0],items[1],items[2]])}
      ${block('Fine motor（巧緻運動）',[items[3],items[4],items[5]])}
      ${block('Gross motor（粗大運動）',[items[6],items[7],items[8]])}
      ${block('Respiratory（呼吸）',[items[9],items[10],items[11]])}
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <div><strong>【解説】</strong> ALSFRS-Rは12項目を各0–4点で評価し、合計0–48点。改訂版では呼吸機能の3項目（呼吸困難・起坐呼吸・呼吸不全）が追加され、経時的変化の追跡や治験アウトカム指標として広く用いられます。<br>「食事（カトラリー）」は胃瘻の有無で評価基準が異なるため、患者状況に応じて適切に選択してください。</div>
        <div style="margin-top:6px;"><strong>【参考（生存の概算）】</strong> 文献1（1999）に基づく9か月生存確率の概算: ≤15点≦25%、16–20点≈25–40%、21–25点≈40–60%、26–30点≈60–70%、31–35点≈70–80%、36–40点≈80–90%、≥41点>90%。</div>
        <div style="margin-top:6px;"><strong>【使用上の注意】</strong> オリジナル報告当時から栄養管理や換気補助など治療は進歩しており、現在の生存は延長している可能性があります。本指標はあくまで補助情報として解釈してください。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>1) J Neurol Sci. 1999;169(1-2):13-21. PMID: 10540002.</li>
            <li>2) 日本語版改訂 ALS Functional Rating Scale の検討（脳と神経. 2001;53:346-355）より改変。</li>
          </ul>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="alsResult" class="result-container" style="display:none;"></div>
      <div class="calculator-instance" style="display:none;"></div>
    `;
  }
  render(){
    const section = super.render();
    const calc = new ALSFRSCalculator();
    const el = section.querySelector('.calculator-instance');
    el.calculate = ()=> calc.calculate();
    el.reset = ()=> calc.reset();
    return section;
  }
}

class ALSFRSCalculator {
  calculate(){
    const ids = ['alsSpeech','alsSalivation','alsSwallow','alsHandwriting','alsCutting','alsDressing','alsBedMobility','alsWalking','alsStairs','alsDyspnea','alsOrthopnea','alsRespInsuff'];
    let total = 0;
    const scores = {};
    for (const id of ids){
      const v = parseInt(document.getElementById(id)?.value);
      if (Number.isNaN(v)) return this.showError('全ての項目を選択してください。');
      scores[id]=v; total += v;
    }
    // サブスケール
    const bulbar = scores.alsSpeech + scores.alsSalivation + scores.alsSwallow;
    const fine = scores.alsHandwriting + scores.alsCutting + scores.alsDressing;
    const gross = scores.alsBedMobility + scores.alsWalking + scores.alsStairs;
    const resp = scores.alsDyspnea + scores.alsOrthopnea + scores.alsRespInsuff;

    let category = '軽度障害';
    let alertClass = 'alert-success';
    if (total < 25) { category = '高度障害'; alertClass='alert-danger'; }
    else if (total < 35) { category = '中等度障害'; alertClass='alert-warning'; }

    // 9か月生存確率（1999報告に基づく概算）
    let surv = '';
    if (total <= 15) surv = '≦25%';
    else if (total <= 20) surv = '約25–40%';
    else if (total <= 25) surv = '約40–60%';
    else if (total <= 30) surv = '約60–70%';
    else if (total <= 35) surv = '約70–80%';
    else if (total <= 40) surv = '約80–90%';
    else surv = '>90%';

    const el = document.getElementById('alsResult'); if (!el) return;
    el.innerHTML = `
      <h3>ALS-FRS-R結果</h3>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 48</div>
      <div class="result-item"><strong>Bulbar:</strong> ${bulbar} / 12</div>
      <div class="result-item"><strong>Fine motor:</strong> ${fine} / 12</div>
      <div class="result-item"><strong>Gross motor:</strong> ${gross} / 12</div>
      <div class="result-item"><strong>Respiratory:</strong> ${resp} / 12</div>
      <div class="result-item"><strong>9か月生存確率（概算・1999）:</strong> ${surv}</div>
      <div class="alert ${alertClass}"><strong>総合評価:</strong> ${category}。経時的変化に注意し、必要に応じて専門医へ相談してください。</div>
      <div class="text-muted" style="font-size:0.9em; margin-top:6px;">治療進歩により現在の生存は当時より延長している可能性があります。指標は補助的に解釈してください。</div>
    `;
    el.style.display='block';
  }
  showError(msg){ const el=document.getElementById('alsResult'); if (el){ el.innerHTML = `<div class="alert alert-danger">${msg}</div>`; el.style.display='block'; } }
  reset(){
    const ids = ['alsSpeech','alsSalivation','alsSwallow','alsHandwriting','alsCutting','alsDressing','alsBedMobility','alsWalking','alsStairs','alsDyspnea','alsOrthopnea','alsRespInsuff'];
    ids.forEach(id=>{ const e=document.getElementById(id); if(e) e.selectedIndex=0; });
    const r = document.getElementById('alsResult'); if (r) r.style.display='none';
  }
}
