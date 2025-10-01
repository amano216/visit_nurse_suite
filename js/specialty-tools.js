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
            <input type="checkbox" id="hfPND"><label for="hfPND"> 夜間発作性呼吸困難（PND）</label>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <input type="checkbox" id="hfOrthopnea"><label for="hfOrthopnea"> 起坐呼吸</label>
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
          <div class="form-group"><input type="checkbox" id="hfJVD"><label for="hfJVD"> 頸静脈怒張（Major）</label></div>
          <div class="form-group"><input type="checkbox" id="hfRales"><label for="hfRales"> ラ音（Major）</label></div>
          <div class="form-group"><input type="checkbox" id="hfCardiomegaly"><label for="hfCardiomegaly"> 心拡大（Major）</label></div>
        </div>
        <div class="form-row">
          <div class="form-group"><input type="checkbox" id="hfEdema"><label for="hfEdema"> 両側下腿浮腫（Minor）</label></div>
          <div class="form-group"><input type="checkbox" id="hfNocturnalCough"><label for="hfNocturnalCough"> 夜間咳（Minor）</label></div>
          <div class="form-group"><input type="checkbox" id="hfHepatomegaly"><label for="hfHepatomegaly"> 肝腫大（Minor）</label></div>
        </div>
        <div class="form-row">
          <div class="form-group"><input type="checkbox" id="hfPleuralEff"><label for="hfPleuralEff"> 胸水（Minor）</label></div>
          <div class="form-group"><input type="checkbox" id="hfTachy"><label for="hfTachy"> 頻脈>120/分（Minor）</label></div>
          <div class="form-group"><input type="checkbox" id="hfCoolExt"><label for="hfCoolExt"> 四肢冷感（低灌流示唆）</label></div>
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
        <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
          <div><strong>【解説】</strong> CATは8項目を各0–5点で評価し、合計0–40点。一般的な目安は 0–9:軽度、10–20:中等度、21–30:重度、31–40:非常に重度。ガイドライン等ではCAT ≥ 10を症状が強い目安として用います。</div>
          <div style="margin-top:6px;"><strong>【出典】</strong>
            <ul style="margin:6px 0 0 20px;">
              <li>Jones PW, et al. Development and first validation of the COPD Assessment Test (CAT). Eur Respir J. 2009;34(3):648-654. PMID: 19720809.</li>
              <li>Kon SS, et al. Validation of the CAT in primary care. BMC Pulm Med. 2011;11:42. PMID: 21835018.</li>
              <li>日本呼吸器学会. COPD診断と治療のためのガイドライン 第6版（2022）.</li>
              <li>CAT 公式サイト: <a href="https://www.catestonline.org/hcp-homepage.html" target="_blank" rel="noopener">https://www.catestonline.org/hcp-homepage.html</a></li>
            </ul>
          </div>
        </div>
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
              <option value="vm">ベンチュリーマスク</option>
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
          <div class="form-group">
            <label for="respRR">呼吸数 RR (/分)</label>
            <input type="number" id="respRR" min="5" max="60" step="1" placeholder="例: 20">
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
  const rr = parseFloat(document.getElementById('respRR')?.value) || 0;

    if (spo2 <= 0 || spo2 > 100) return this.showError('SpO2は1-100%の範囲で入力してください。');

    // FiO2推定
    let fio2 = 0.21;
    if (device === 'nc') {
      // 室内気21% + 1L/分ごとに約4%上昇（上限目安 4L）
      const f = Math.min(Math.max(flow, 0), 4);
      fio2 = Math.min(0.21 + 0.04 * f, 0.45);
    } else if (device === 'vm') {
      // ベンチュリは設定FiO2をそのまま（入力は換算ツール側で扱うため、ここではデバイス選択のみ）
      // 呼吸評価では固定の%がないため、FiO2は推定できない→エラーメッセージで促す
      return this.showError('ベンチュリーマスクは固定FiO2のため、S/F比の推定には具体的なFiO2%が必要です。換算ツールで確認してください。');
    } else if (device === 'sm') {
      // 6-10Lで35-50%を線形近似
      if (flow < 5) return this.showError('シンプルマスクはCO2再呼吸回避のため5L/分以上に設定してください。');
      const f = Math.min(Math.max(flow, 6), 10);
      const slope = (0.50-0.35)/(10-6);
      fio2 = 0.35 + slope*(f-6);
    } else if (device === 'nrb') {
      // 10-15Lで60-80%を線形近似
      const f = Math.min(Math.max(flow||10, 10), 15);
      const slope = (0.80-0.60)/(15-10);
      fio2 = 0.60 + slope*(f-10);
    }

    const sf = spo2 / fio2; // S/F比
  const rox = rr > 0 ? (sf / rr) : null; // ROX指数（参考）

    // カテゴリ
    let catClass = '軽度';
    if (catSum >= 31) catClass = '非常に重い';
    else if (catSum >= 21) catClass = '重い';
    else if (catSum >= 10) catClass = '中等度';

    let sfWarn = '';
    if (sf < 235) sfWarn = '低下（重症の可能性）';
    else if (sf < 315) sfWarn = 'やや低下';

    let roxWarn = '';
    if (rox !== null) {
      if (rox < 3.85) roxWarn = '低値（不良の可能性）';
      else if (rox < 4.88) roxWarn = 'やや低値';
    }

    const el = document.getElementById('respResult'); if (!el) return;
    const alertClass = (sf < 315 || (rox !== null && rox < 4.88) || catSum >= 21 || mmrc >= 3) ? 'alert-warning' : 'alert-success';
    el.innerHTML = `
      <h3>呼吸評価結果</h3>
      <div class="result-item"><strong>mMRC:</strong> ${mmrc}</div>
      <div class="result-item"><strong>CAT合計:</strong> <span class="highlight">${catSum}</span>（${catClass}）</div>
      <div class="result-item"><strong>FiO2推定:</strong> ${(fio2*100).toFixed(0)}%</div>
      <div class="result-item"><strong>S/F比:</strong> <span class="highlight">${sf.toFixed(0)}</span> ${sfWarn}</div>
      ${rox !== null ? `<div class="result-item"><strong>ROX指数:</strong> <span class="highlight">${rox.toFixed(2)}</span> ${roxWarn}</div>` : ''}
      <div class="alert ${alertClass}"><strong>推奨:</strong> 症状が強い/SpO2低下時は医師へ報告・受診を検討。酸素流量・吸入療法・呼吸リハの評価。</div>
    `;
    el.style.display='block';
  }
  showError(msg){ const el = document.getElementById('respResult'); if (el){ el.innerHTML = `<div class="alert alert-danger">${msg}</div>`; el.style.display='block'; } }
  reset(){
    const sel=['mmrc','respDevice']; sel.forEach(id=>{ const e=document.getElementById(id); if(e) e.selectedIndex=0; });
    const nums=['respFlow','respSpO2','respRR']; nums.forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; });
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
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <div><strong>【解説】</strong> ALSFRS-Rは12項目を各0–4点で評価し、合計0–48点。改訂版では呼吸機能の3項目（呼吸困難・起坐呼吸・呼吸不全）が追加され、経時的変化の追跡や治験アウトカム指標として広く用いられます。<br>「食事（カトラリー）」は胃瘻の有無で評価基準が異なるため、患者状況に応じて適切に選択してください。</div>
        <div style="margin-top:6px;"><strong>【参考（生存の概算）】</strong> 文献1（1999）に基づく9か月生存確率の概算: ≤15点≦25%、16–20点≈25–40%、21–25点≈40–60%、26–30点≈60–70%、31–35点≈70–80%、36–40点≈80–90%、≥41点>90%。</div>
        <div style="margin-top:6px;"><strong>【使用上の注意】</strong> オリジナル報告当時から栄養管理や換気補助など治療は進歩しており、現在の生存は延長している可能性があります。本指標はあくまで補助情報として解釈してください。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>1) The ALSFRS-R: a revised ALS functional rating scale that incorporates assessments of respiratory function. J Neurol Sci. 1999;169(1-2):13-21. PMID: 10540002.</li>
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
