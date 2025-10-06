/**
 * 専門: 呼吸評価（mMRC・CAT・S/F比）
 */

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
              <li>日本呼吸器学会. COPD診断と治療のためのガイドライン 第6版（2022）。</li>
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
