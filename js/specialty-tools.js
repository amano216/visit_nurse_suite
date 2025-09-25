/**
 * 専門領域ツール: ストマ（OST/DET）、心不全（NYHA/Framingham/プロファイル）、
 * 呼吸（mMRC/CAT/SF）、ALS-FRS-R
 * 既存のBaseTool/Calculatorパターンに準拠
 */

// --------------- ストマ（Ostomy/DET）---------------
class OstomyTool extends BaseTool {
  constructor() {
    super('ostomy', 'ストマケア（DET・装具推奨）', 'DETスコアと条件からケアと装具選定を提案します。');
  }
  getIcon() { return 'fas fa-toilet'; }
  renderContent() {
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-info-circle"></i> 基本情報</h4>
        <div class="form-row">
          <div class="form-group">
            <label for="ostType">ストマタイプ</label>
            <select id="ostType">
              <option value="colostomy">結腸（コロストミー）</option>
              <option value="ileostomy">回腸（イレオストミー）</option>
              <option value="urostomy">尿路ストマ</option>
            </select>
          </div>
          <div class="form-group">
            <label for="ostShape">形状</label>
            <select id="ostShape">
              <option value="round">円形</option>
              <option value="oval">楕円/不整</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="ostDiameter">ストマ径（mm/円形）</label>
            <input type="number" id="ostDiameter" min="0" step="0.5" placeholder="例: 25">
          </div>
          <div class="form-group">
            <label for="ostProtrusion">突出高（mm）</label>
            <input type="number" id="ostProtrusion" min="0" step="0.5" placeholder="例: 2">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="ostLongAxis">長径（mm/楕円時）</label>
            <input type="number" id="ostLongAxis" min="0" step="0.5" placeholder="例: 30">
          </div>
          <div class="form-group">
            <label for="ostShortAxis">短径（mm/楕円時）</label>
            <input type="number" id="ostShortAxis" min="0" step="0.5" placeholder="例: 22">
          </div>
        </div>
      </div>

      <div class="assessment-section">
        <h4><i class="fas fa-stethoscope"></i> 皮膚評価（DET）</h4>
        <div class="form-row">
          <div class="form-group">
            <label for="ostDetDiscolor">変色（Discoloration） 0-2</label>
            <select id="ostDetDiscolor">
              <option value="0">0: なし</option>
              <option value="1">1: 軽度</option>
              <option value="2">2: 高度</option>
            </select>
          </div>
          <div class="form-group">
            <label for="ostDetErosion">びらん（Erosion） 0-2</label>
            <select id="ostDetErosion">
              <option value="0">0: なし</option>
              <option value="1">1: 軽度</option>
              <option value="2">2: 高度</option>
            </select>
          </div>
          <div class="form-group">
            <label for="ostDetTissue">過形成（Tissue overgrowth） 0-2</label>
            <select id="ostDetTissue">
              <option value="0">0: なし</option>
              <option value="1">1: 軽度</option>
              <option value="2">2: 高度</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="ostDetArea">面積係数</label>
          <select id="ostDetArea">
            <option value="0">0: なし</option>
            <option value="1">1: < 25%</option>
            <option value="2">2: 25-50%</option>
            <option value="3">3: > 50%</option>
          </select>
        </div>
      </div>

      <div class="assessment-section">
        <h4><i class="fas fa-toolbox"></i> 装具/排泄情報</h4>
        <div class="form-row">
          <div class="form-group">
            <label for="ostWearDays">装具装着日数（日）</label>
            <input type="number" id="ostWearDays" min="0" step="1" placeholder="例: 2">
          </div>
          <div class="form-group">
            <label for="ostLeakFreq">漏れ頻度</label>
            <select id="ostLeakFreq">
              <option value="none">なし</option>
              <option value="sometimes">時々</option>
              <option value="often">頻回</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="ostOutputConsistency">排泄性状</label>
            <select id="ostOutputConsistency">
              <option value="solid">固形</option>
              <option value="pasty">粘稠</option>
              <option value="liquid">水様</option>
              <option value="urine">尿（尿路ストマ）</option>
            </select>
          </div>
          <div class="form-group">
            <label for="ostOutputFreq">排泄頻度（回/日）</label>
            <input type="number" id="ostOutputFreq" min="0" step="1" placeholder="例: 6">
          </div>
        </div>
      </div>

      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="ostomyResult" class="result-container" style="display: none;"></div>
      <div class="calculator-instance" style="display: none;"></div>
    `;
  }
  render() {
    const section = super.render();
    const calculator = new OstomyCalculator();
    const el = section.querySelector('.calculator-instance');
    el.calculate = () => calculator.calculate();
    el.reset = () => calculator.reset();
    return section;
  }
}

class OstomyCalculator {
  calculate() {
    const type = document.getElementById('ostType')?.value;
    const shape = document.getElementById('ostShape')?.value;
    const diameter = parseFloat(document.getElementById('ostDiameter')?.value) || 0;
    const protrusion = parseFloat(document.getElementById('ostProtrusion')?.value) || 0;
    const longAxis = parseFloat(document.getElementById('ostLongAxis')?.value) || 0;
    const shortAxis = parseFloat(document.getElementById('ostShortAxis')?.value) || 0;

    const dis = parseInt(document.getElementById('ostDetDiscolor')?.value) || 0;
    const ero = parseInt(document.getElementById('ostDetErosion')?.value) || 0;
    const tis = parseInt(document.getElementById('ostDetTissue')?.value) || 0;
    const area = parseInt(document.getElementById('ostDetArea')?.value) || 0;

    const wearDays = parseInt(document.getElementById('ostWearDays')?.value) || 0;
    const leak = document.getElementById('ostLeakFreq')?.value || 'none';
    const consistency = document.getElementById('ostOutputConsistency')?.value || 'solid';
    const freq = parseInt(document.getElementById('ostOutputFreq')?.value) || 0;

    // 基本バリデーション
    if (shape === 'round' && diameter <= 0) return this.showError('円形の場合はストマ径（mm）を入力してください。');
    if (shape === 'oval' && (longAxis <= 0 || shortAxis <= 0)) return this.showError('楕円の場合は長径/短径（mm）を入力してください。');

    // DET合計（面積係数で重み付け）
    const detBase = dis + ero + tis;
    const detScore = detBase * area; // シンプルなモデル

    // カテゴリ
    let detCategory = '軽度';
    let alertClass = 'alert-success';
    if (detScore >= 8) { detCategory = '重度'; alertClass = 'alert-danger'; }
    else if (detScore >= 4) { detCategory = '中等度'; alertClass = 'alert-warning'; }

    // カットサイズ推奨
    const baseSize = shape === 'round' ? diameter : Math.max(longAxis, shortAxis);
    const cutMin = baseSize + 1; // +1mm
    const cutMax = baseSize + 2; // +2mm

    // 装具・ケア提案
    const suggestions = [];
    if (protrusion < 2 || leak === 'often' || consistency === 'liquid') {
      suggestions.push('凸面装具の検討');
    }
    if (detScore >= 4) {
      suggestions.push('皮膚保護剤（リング/粉/ペースト）の使用');
    }
    if (wearDays < 2 || leak !== 'none') {
      suggestions.push('ベースプレートの密着性再評価（カットサイズ調整/面板交換頻度の見直し）');
    }
    if (type === 'urostomy') {
      suggestions.push('尿路ストマ用アクセサリ（夜間排尿バッグ連結など）');
    }

    const resultEl = document.getElementById('ostomyResult');
    if (!resultEl) return;
    resultEl.innerHTML = `
      <h3>ストマケア評価結果</h3>
      <div class="result-item"><strong>DET合計:</strong> <span class="highlight">${detScore}</span>（${detCategory}）</div>
      <div class="result-item"><strong>推奨カットサイズ:</strong> ${cutMin.toFixed(1)}〜${cutMax.toFixed(1)} mm</div>
      <div class="result-item"><strong>タイプ/形状:</strong> ${type} / ${shape === 'round' ? '円形' : '楕円'}</div>
      <div class="alert ${alertClass}"><strong>ケア提案:</strong> ${suggestions.length ? suggestions.join('、') : '現状維持で経過観察'}</div>
    `;
    resultEl.style.display = 'block';
  }
  showError(msg){
    const el = document.getElementById('ostomyResult');
    if (el){ el.innerHTML = `<div class="alert alert-danger">${msg}</div>`; el.style.display='block'; }
  }
  reset(){
    ['ostType','ostShape','ostDetDiscolor','ostDetErosion','ostDetTissue','ostDetArea','ostLeakFreq','ostOutputConsistency']
      .forEach(id=>{ const e=document.getElementById(id); if(e) e.selectedIndex=0; });
    ['ostDiameter','ostProtrusion','ostLongAxis','ostShortAxis','ostWearDays','ostOutputFreq']
      .forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; });
    const r = document.getElementById('ostomyResult'); if (r) r.style.display='none';
  }
}

// --------------- 心不全（NYHA/Framingham/プロファイル）---------------
class HeartFailureTool extends BaseTool {
  constructor(){ super('hf','心不全評価（NYHA・Framingham・プロファイル）','症状・所見から心不全重症度と対応を提案します。'); }
  getIcon(){ return 'fas fa-heart'; }
  renderContent(){
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-walking"></i> 症状/機能</h4>
        <div class="form-row">
          <div class="form-group">
            <label for="hfDyspneaActivity">労作時息切れ</label>
            <select id="hfDyspneaActivity">
              <option value="none">なし/通常活動で問題なし</option>
              <option value="ordinary">通常の活動で息切れ</option>
              <option value="less">軽い活動で息切れ</option>
              <option value="rest">安静時も息切れ</option>
            </select>
          </div>
          <div class="form-group">
            <label><input type="checkbox" id="hfPND"> 夜間発作性呼吸困難（PND）</label>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label><input type="checkbox" id="hfOrthopnea"> 起坐呼吸</label>
          </div>
          <div class="form-group">
            <label for="hfWeightGain">体重増加（直近数日, kg）</label>
            <input type="number" id="hfWeightGain" step="0.1" min="0" placeholder="例: 2.0">
          </div>
        </div>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-user-md"></i> 身体所見（Framingham）</h4>
        <div class="form-row">
          <div class="form-group"><label><input type="checkbox" id="hfJVD"> 頸静脈怒張（Major）</label></div>
          <div class="form-group"><label><input type="checkbox" id="hfRales"> ラ音（Major）</label></div>
          <div class="form-group"><label><input type="checkbox" id="hfCardiomegaly"> 心拡大（Major）</label></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label><input type="checkbox" id="hfEdema"> 両側下腿浮腫（Minor）</label></div>
          <div class="form-group"><label><input type="checkbox" id="hfNocturnalCough"> 夜間咳（Minor）</label></div>
          <div class="form-group"><label><input type="checkbox" id="hfHepatomegaly"> 肝腫大（Minor）</label></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label><input type="checkbox" id="hfPleuralEff"> 胸水（Minor）</label></div>
          <div class="form-group"><label><input type="checkbox" id="hfTachy"> 頻脈>120/分（Minor）</label></div>
          <div class="form-group"><label><input type="checkbox" id="hfCoolExt"> 四肢冷感（低灌流示唆）</label></div>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="hfResult" class="result-container" style="display:none;"></div>
      <div class="calculator-instance" style="display:none;"></div>
    `;
  }
  render(){
    const section = super.render();
    const calc = new HeartFailureCalculator();
    const el = section.querySelector('.calculator-instance');
    el.calculate = () => calc.calculate();
    el.reset = () => calc.reset();
    return section;
  }
}

class HeartFailureCalculator {
  calculate(){
    const dysp = document.getElementById('hfDyspneaActivity')?.value || 'none';
    const pnd = document.getElementById('hfPND')?.checked || false;
    const ortho = document.getElementById('hfOrthopnea')?.checked || false;
    const gain = parseFloat(document.getElementById('hfWeightGain')?.value) || 0;

    const major = [
      document.getElementById('hfJVD')?.checked,
      document.getElementById('hfRales')?.checked,
      document.getElementById('hfCardiomegaly')?.checked,
    ].filter(Boolean).length;
    const minor = [
      document.getElementById('hfEdema')?.checked,
      document.getElementById('hfNocturnalCough')?.checked,
      document.getElementById('hfHepatomegaly')?.checked,
      document.getElementById('hfPleuralEff')?.checked,
      document.getElementById('hfTachy')?.checked,
    ].filter(Boolean).length;

    // NYHA判定
    let nyha = 'I';
    if (dysp === 'rest') nyha = 'IV';
    else if (dysp === 'less') nyha = 'III';
    else if (dysp === 'ordinary' || pnd || ortho) nyha = 'II';

    // Framingham陽性
    const framinghamPositive = (major >= 2) || (major >= 1 && minor >= 2);

    // プロファイル（Wet/Dry, Warm/Cold）
    const wetSigns = (document.getElementById('hfEdema')?.checked || ortho || pnd || document.getElementById('hfJVD')?.checked || document.getElementById('hfRales')?.checked);
    const dryWet = wetSigns ? 'Wet' : 'Dry';
    const warmCold = (document.getElementById('hfCoolExt')?.checked) ? 'Cold' : 'Warm';

    // 推奨
    const suggestions = [];
    if (dryWet === 'Wet') suggestions.push('うっ血是正（利尿薬調整）を検討');
    if (warmCold === 'Cold') suggestions.push('低灌流の評価（血圧・末梢循環）と医師報告');
    if (gain >= 2) suggestions.push('体重増加あり：塩分/水分管理と服薬の見直し');
    if (!suggestions.length) suggestions.push('現状の管理継続（悪化兆候に注意）');

    const el = document.getElementById('hfResult'); if (!el) return;
    const alertClass = (dryWet==='Wet' || warmCold==='Cold' || framinghamPositive) ? 'alert-warning' : 'alert-success';
    el.innerHTML = `
      <h3>心不全評価結果</h3>
      <div class="result-item"><strong>NYHA分類:</strong> <span class="highlight">Class ${nyha}</span></div>
      <div class="result-item"><strong>Framingham:</strong> ${framinghamPositive ? '<span class="highlight">陽性</span>' : '陰性'}（Major: ${major}, Minor: ${minor}）</div>
      <div class="result-item"><strong>プロファイル:</strong> ${warmCold} & ${dryWet}</div>
      <div class="alert ${alertClass}"><strong>推奨:</strong> ${suggestions.join('、')}</div>
    `;
    el.style.display='block';
  }
  reset(){
    const checks = ['hfPND','hfOrthopnea','hfJVD','hfRales','hfCardiomegaly','hfEdema','hfNocturnalCough','hfHepatomegaly','hfPleuralEff','hfTachy','hfCoolExt'];
    checks.forEach(id=>{ const e=document.getElementById(id); if(e) e.checked=false; });
    const sels = ['hfDyspneaActivity']; sels.forEach(id=>{ const e=document.getElementById(id); if(e) e.selectedIndex=0; });
    const nums = ['hfWeightGain']; nums.forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; });
    const r = document.getElementById('hfResult'); if (r) r.style.display='none';
  }
}

// --------------- 呼吸（mMRC/CAT/SF）---------------
class RespiratoryTool extends BaseTool {
  constructor(){ super('resp','呼吸評価（mMRC・CAT・S/F比）','呼吸症状と在宅酸素条件から重症度を評価します。'); }
  getIcon(){ return 'fas fa-lungs'; }
  renderContent(){
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-wind"></i> mMRC息切れスケール</h4>
        <div class="form-group">
          <label for="mmrc">mMRCグレード</label>
          <select id="mmrc">
            <option value="0">0: 激しい運動時のみ息切れ</option>
            <option value="1">1: 早歩き/坂道で息切れ</option>
            <option value="2">2: 同年代より遅い/平地で息切れ</option>
            <option value="3">3: 100m程度で立ち止まる</option>
            <option value="4">4: 着替えなどでも息切れ/外出困難</option>
          </select>
        </div>
      </div>

      <div class="assessment-section">
        <h4><i class="fas fa-list"></i> CAT（COPD Assessment Test）</h4>
        <div class="cat-grid">
          ${Array.from({length:8}).map((_,i)=>`
            <div class="form-group">
              <label for="catQ${i+1}">CAT 質問${i+1}（0-5）</label>
              <input type="range" id="catQ${i+1}" min="0" max="5" value="0" class="cat-slider">
            </div>
          `).join('')}
        </div>
        <div class="result-item" id="catLive">CAT合計: <span class="highlight">0</span>/40</div>
      </div>

      <div class="assessment-section">
        <h4><i class="fas fa-head-side-mask"></i> S/F比（SpO2/FiO2）</h4>
        <div class="form-row">
          <div class="form-group">
            <label for="respDevice">酸素デバイス</label>
            <select id="respDevice">
              <option value="air">室内空気</option>
              <option value="nc">鼻カニュラ</option>
              <option value="sm">シンプルマスク</option>
              <option value="nrb">リザーバーマスク</option>
            </select>
          </div>
          <div class="form-group">
            <label for="respFlow">流量 (L/min)</label>
            <input type="number" id="respFlow" min="0" step="0.5" placeholder="例: 2">
          </div>
          <div class="form-group">
            <label for="respSpO2">SpO2 (%)</label>
            <input type="number" id="respSpO2" min="50" max="100" step="1" placeholder="例: 94">
          </div>
        </div>
      </div>

      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="respResult" class="result-container" style="display:none;"></div>
      <div class="calculator-instance" style="display:none;"></div>
    `;
  }
  render(){
    const section = super.render();
    const calc = new RespiratoryCalculator();
    const el = section.querySelector('.calculator-instance');
    el.calculate = () => calc.calculate();
    el.reset = () => calc.reset();

    // CAT ライブ合計
    section.addEventListener('input', (e)=>{
      if (String(e.target.id).startsWith('catQ')) {
        const sum = Array.from({length:8}).reduce((acc,_,i)=> acc + (parseInt(section.querySelector(`#catQ${i+1}`)?.value)||0), 0);
        const live = section.querySelector('#catLive');
        if (live) live.innerHTML = `CAT合計: <span class="highlight">${sum}</span>/40`;
      }
    });

    return section;
  }
}

class RespiratoryCalculator {
  calculate(){
    const mmrc = parseInt(document.getElementById('mmrc')?.value) || 0;
    const catSum = Array.from({length:8}).reduce((acc,_,i)=> acc + (parseInt(document.getElementById(`catQ${i+1}`)?.value)||0), 0);
    const device = document.getElementById('respDevice')?.value || 'air';
    const flow = parseFloat(document.getElementById('respFlow')?.value) || 0;
    const spo2 = parseFloat(document.getElementById('respSpO2')?.value) || 0;

    if (spo2 <= 0 || spo2 > 100) return this.showError('SpO2は1-100%の範囲で入力してください。');

    // FiO2推定
    let fio2 = 0.21;
    if (device === 'nc') {
      fio2 = Math.min(0.24 + 0.04 * flow, 0.44);
    } else if (device === 'sm') {
      // 6-10Lを想定して0.4-0.6で近似
      if (flow <= 0) return this.showError('シンプルマスクの流量を入力してください（6-10L目安）。');
      fio2 = Math.max(0.4, Math.min(0.6, 0.3 + 0.03 * flow));
    } else if (device === 'nrb') {
      fio2 = 0.8; // 目安
    }

    const sf = spo2 / fio2; // S/F比

    // カテゴリ
    let catClass = '軽度';
    if (catSum >= 31) catClass = '非常に重い';
    else if (catSum >= 21) catClass = '重い';
    else if (catSum >= 10) catClass = '中等度';

    let sfWarn = '';
    if (sf < 235) sfWarn = '低下（重症の可能性）';
    else if (sf < 315) sfWarn = 'やや低下';

    const el = document.getElementById('respResult'); if (!el) return;
    const alertClass = (sf < 315 || catSum >= 21 || mmrc >= 3) ? 'alert-warning' : 'alert-success';
    el.innerHTML = `
      <h3>呼吸評価結果</h3>
      <div class="result-item"><strong>mMRC:</strong> ${mmrc}</div>
      <div class="result-item"><strong>CAT合計:</strong> <span class="highlight">${catSum}</span>（${catClass}）</div>
      <div class="result-item"><strong>FiO2推定:</strong> ${(fio2*100).toFixed(0)}%</div>
      <div class="result-item"><strong>S/F比:</strong> <span class="highlight">${sf.toFixed(0)}</span> ${sfWarn}</div>
      <div class="alert ${alertClass}"><strong>推奨:</strong> 症状が強い/SpO2低下時は医師へ報告・受診を検討。酸素流量・吸入療法・呼吸リハの評価。</div>
    `;
    el.style.display='block';
  }
  showError(msg){ const el = document.getElementById('respResult'); if (el){ el.innerHTML = `<div class="alert alert-danger">${msg}</div>`; el.style.display='block'; } }
  reset(){
    const sel=['mmrc','respDevice']; sel.forEach(id=>{ const e=document.getElementById(id); if(e) e.selectedIndex=0; });
    const nums=['respFlow','respSpO2']; nums.forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; });
    Array.from({length:8}).forEach((_,i)=>{ const e=document.getElementById(`catQ${i+1}`); if(e) e.value=0; });
    const live = document.getElementById('catLive'); if (live) live.innerHTML = 'CAT合計: <span class="highlight">0</span>/40';
    const r = document.getElementById('respResult'); if (r) r.style.display='none';
  }
}

// --------------- ALS-FRS-R（12項目）---------------
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

    const el = document.getElementById('alsResult'); if (!el) return;
    el.innerHTML = `
      <h3>ALS-FRS-R結果</h3>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 48</div>
      <div class="result-item"><strong>Bulbar:</strong> ${bulbar} / 12</div>
      <div class="result-item"><strong>Fine motor:</strong> ${fine} / 12</div>
      <div class="result-item"><strong>Gross motor:</strong> ${gross} / 12</div>
      <div class="result-item"><strong>Respiratory:</strong> ${resp} / 12</div>
      <div class="alert ${alertClass}"><strong>総合評価:</strong> ${category}。経時的変化に注意し、必要に応じて専門医へ相談してください。</div>
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
