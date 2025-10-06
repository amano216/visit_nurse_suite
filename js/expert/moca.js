// -------- MoCA（Montreal Cognitive Assessment）--------
class MoCATool extends BaseTool {
  constructor() { super('moca', 'MoCA認知評価', '軽度認知障害（MCI）のスクリーニングツール（30点満点）。'); }
  getIcon() { return 'fas fa-brain'; }
  renderContent() {
    const numInput = (id, label, max) => `
      <div class="form-group">
        <label for="${id}">${label} (0-${max})</label>
        <input type="number" id="${id}" min="0" max="${max}" value="0">
      </div>`;
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-puzzle-piece"></i> 視空間・遂行機能</h4>
        <div class="form-row">
          ${numInput('mocaVSP1', '交互試行', 1)}
          ${numInput('mocaVSP2', '立方体模写', 1)}
          ${numInput('mocaVSP3', '時計描画', 3)}
        </div>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-paw"></i> 呼称</h4>
        <div class="form-row">
          ${numInput('mocaNaming', '動物呼称', 3)}
        </div>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-memory"></i> 記憶</h4>
        <div class="form-group"><label>単語の即時再生（採点なし）</label></div>
        <div class="form-group">
          <label for="mocaMemory">遅延再生 (0-5)</label>
          <input type="number" id="mocaMemory" min="0" max="5" value="0">
        </div>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-hand-pointer"></i> 注意</h4>
        <div class="form-row">
          ${numInput('mocaAttention1', '順唱', 1)}
          ${numInput('mocaAttention2', '逆唱', 1)}
          ${numInput('mocaAttention3', 'タップ課題', 1)}
          ${numInput('mocaAttention4', '連続引き算', 3)}
        </div>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-comment-dots"></i> 復唱・語想起</h4>
        <div class="form-row">
          ${numInput('mocaRepetition', '文章復唱', 2)}
          ${numInput('mocaFluency', '語想起', 1)}
        </div>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-project-diagram"></i> 抽象・見当識</h4>
        <div class="form-row">
          ${numInput('mocaAbstract', '抽象概念', 2)}
          ${numInput('mocaOrientation', '見当識', 6)}
        </div>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-user-graduate"></i> 教育年数調整</h4>
        <div class="form-group">
          <input type="checkbox" id="mocaEdu"><label for="mocaEdu"> 教育年数12年以下の場合、1点を加算する</label>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">合計点計算</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="mocaResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render() { const s = super.render(); const c = new MoCACalculator(); const el = s.querySelector('.calculator-instance'); el.calculate = () => c.calculate(); el.reset = () => c.reset(); return s; }
}

class MoCACalculator {
  calculate() {
    const ids = ['mocaVSP1', 'mocaVSP2', 'mocaVSP3', 'mocaNaming', 'mocaMemory', 'mocaAttention1', 'mocaAttention2', 'mocaAttention3', 'mocaAttention4', 'mocaRepetition', 'mocaFluency', 'mocaAbstract', 'mocaOrientation'];
    let total = 0;
    for (const id of ids) {
      total += parseInt(document.getElementById(id)?.value) || 0;
    }
    const eduAdj = document.getElementById('mocaEdu')?.checked;
    if (eduAdj) {
      total += 1;
    }
    const finalScore = Math.min(total, 30); // 30点満点

    let category = '正常範囲';
    let alertClass = 'alert-success';
    if (finalScore < 26) {
      category = 'MCIの可能性あり';
      alertClass = 'alert-warning';
    }

    const el = document.getElementById('mocaResult');
    el.innerHTML = `<h3>MoCA評価結果</h3>
      <div class="result-item"><strong>合計点:</strong> <span class="highlight">${finalScore} / 30</span></div>
      <div class="alert ${alertClass}"><strong>評価:</strong> ${category}</div>
      <small>カットオフ値は26点未満。最終的な診断は専門医の判断が必要です。</small>`;
    el.style.display = 'block';
  }

  reset() {
    const ids = ['mocaVSP1', 'mocaVSP2', 'mocaVSP3', 'mocaNaming', 'mocaMemory', 'mocaAttention1', 'mocaAttention2', 'mocaAttention3', 'mocaAttention4', 'mocaRepetition', 'mocaFluency', 'mocaAbstract', 'mocaOrientation'];
    ids.forEach(id => {
      const e = document.getElementById(id);
      if (e) e.value = 0;
    });
    const edu = document.getElementById('mocaEdu');
    if (edu) edu.checked = false;
    const r = document.getElementById('mocaResult');
    if (r) r.style.display = 'none';
  }
}
