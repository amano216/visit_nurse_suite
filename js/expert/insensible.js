// -------- 不感蒸泄（推定） --------
class InsensibleLossTool extends BaseTool {
  constructor(){ super('insensible','不感蒸泄（推定）','体重と体温から不感蒸泄量（皮膚・呼気からの水分喪失）を推定します。'); }
  getIcon(){ return 'fas fa-droplet'; }
  renderContent(){
    return `
      <div class="form-row">
        <div class="form-group"><label for="insWeight">体重 (kg)</label><input type="number" id="insWeight" step="0.1" min="1" placeholder="例: 55.0"></div>
        <div class="form-group"><label for="insTemp">体温 (℃)</label><input type="number" id="insTemp" step="0.1" min="30" max="43" placeholder="例: 37.2"></div>
      </div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <div><strong>【計算式】</strong> 不感蒸泄 (mL/日) = <u>15 × 体重(kg)</u> + <u>200 × (体温 - 36.8)</u></div>
        <div style="margin-top:6px;"><strong>【解説】</strong> 不感蒸泄は<em>発汗以外</em>の皮膚および呼気からの水分喪失を指します。安静・常温の健常成人ではおおよそ <u>約900 mL/日（皮膚∼600、呼気∼300）</u> が目安ですが、<u>発熱・熱傷・過換気</u>などで増加します。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>一般社団法人日本静脈経腸栄養学会. 静脈経腸栄養テキストブック. 南江堂, 東京, 2017.</li>
            <li>日本救急医学会. 医学用語 解説集「不感蒸泄」。</li>
          </ul>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">推定する</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="insResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new InsensibleLossCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class InsensibleLossCalculator {
  calculate(){
    const w = parseFloat(document.getElementById('insWeight')?.value)||0;
    const t = parseFloat(document.getElementById('insTemp')?.value)||0;
    const el = document.getElementById('insResult'); if(!el) return;
    if (w<=0 || t<=0){ el.innerHTML = '<div class="alert alert-danger">体重と体温を入力してください。</div>'; el.style.display='block'; return; }
    const base = 15 * w; // mL/日
    const feverAdj = 200 * (t - 36.8); // mL/日（体温補正）
    const totalRaw = base + feverAdj;
    const total = Math.max(totalRaw, 0); // 下限0
    const totalL = total / 1000;
    const skinApprox = total * (2/3);
    const respApprox = total * (1/3);
    let cat='目安域（標準）'; let alert='alert-success';
    if (total<700){ cat='やや少なめ（環境・低体温など）'; alert='alert-info'; }
    else if (total>1100){ cat='増加の可能性（発熱・熱傷・過換気等）'; alert='alert-warning'; }
    const formula = `15×${w.toFixed(1)} + 200×(${t.toFixed(1)}−36.8)`;
    el.innerHTML = `
      <h3>不感蒸泄 推定結果</h3>
      <div class="result-item"><strong>推定量:</strong> <span class="highlight">${total.toFixed(0)}</span> mL/日（約 ${totalL.toFixed(2)} L/日）</div>
      <div class="result-item"><strong>内訳（参考）:</strong> 皮膚 ≈ ${Math.round(skinApprox)} mL/日 / 呼気 ≈ ${Math.round(respApprox)} mL/日</div>
      <div class="result-item"><strong>計算式:</strong> ${formula} = ${totalRaw.toFixed(0)} mL/日</div>
      <div class="alert ${alert}">${cat}</div>
      <small class="text-muted">注: 実際の喪失量は環境温度・湿度・活動量・皮膚病変・呼吸状態（過換気/人工呼吸）等で大きく変動します。</small>
    `;
    el.style.display='block';
  }
  reset(){ ['insWeight','insTemp'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); const r=document.getElementById('insResult'); if(r) r.style.display='none'; }
}
