/**
 * 専門: 心不全評価（NYHA/Framingham/プロファイル）
 */

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
