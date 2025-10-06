/**
 * 専門: ストマケア（DET・装具推奨）
 * 既存の BaseTool / Calculator パターンに準拠
 */

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
