// -------- A-DROP（JRS 肺炎重症度） --------
class ADROPTTool extends BaseTool {
  constructor(){ super('adrop','A-DROP（肺炎重症度）','年齢/脱水/呼吸/意識/血圧の5項目で重症度を評価します。'); }
  getIcon(){ return 'fas fa-lungs'; }
  renderContent(){
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-user"></i> 基本情報</h4>
        <div class="form-row">
          <div class="form-group"><label for="adSex">性別</label><select id="adSex"><option value="male">男性</option><option value="female">女性</option></select></div>
          <div class="form-group"><label for="adAge">年齢</label><input type="number" id="adAge" min="0" max="120" placeholder="例: 82"></div>
        </div>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-tint"></i> 脱水（Dehydration）</h4>
        <div class="form-row">
          <div class="form-group"><label for="adBun">BUN (mg/dL)</label><input type="number" id="adBun" step="0.1" min="0" placeholder="例: 28"></div>
          <div class="form-group"><label><input type="checkbox" id="adDehydration"> 臨床的脱水所見あり</label></div>
        </div>
        <small>※ BUN≥21 または臨床的脱水で1点</small>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-lungs"></i> 呼吸（Respiration）</h4>
        <div class="form-row">
          <div class="form-group"><label for="adSpO2">SpO2 (%)</label><input type="number" id="adSpO2" min="50" max="100" step="1" placeholder="例: 89"></div>
          <div class="form-group"><label for="adPaO2">PaO2 (mmHg/任意)</label><input type="number" id="adPaO2" min="30" step="1" placeholder="任意"></div>
        </div>
        <small>※ SpO2≤90% または PaO2≤60 で1点</small>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-brain"></i> 意識（Orientation）</h4>
        <div class="form-group"><label><input type="checkbox" id="adConfusion"> 見当識障害/意識障害あり</label></div>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-heartbeat"></i> 血圧（Pressure）</h4>
        <div class="form-group"><label for="adSBP">収縮期血圧 (mmHg)</label><input type="number" id="adSBP" min="40" max="250" placeholder="例: 85"></div>
        <small>※ SBP≤90 で1点</small>
      </div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <div><strong>【解説】</strong> A-DROPは日本呼吸器学会の市中肺炎重症度分類で、<u>年齢（A）</u>、<u>脱水（D）</u>、<u>呼吸（R）</u>、<u>意識（O）</u>、<u>血圧（P）</u>の5因子を各1点で加点します（CURB-65を日本人向けに調整）。</div>
        <div style="margin-top:6px;"><strong>【重症度と対応】</strong> 0点: 軽症（外来）、1–2点: 中等症（外来/入院）、3点: 重症（入院）、4–5点: 超重症（ICU）。<u>ショックがあれば超重症</u>として扱います。</div>
        <div style="margin-top:6px;"><strong>【エビデンス】</strong> 観察研究のメタ解析に基づき、市中肺炎のスクリーニングとして<strong>弱く推奨</strong>。CURB-65やPSIと同程度の予測能が示されています。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong> 一般社団法人 日本呼吸器学会. 成人肺炎診療ガイドライン2024（市中肺炎）。</div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="adropResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new ADROPCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class ADROPCalculator {
  calculate(){
    const sex=document.getElementById('adSex')?.value||'male';
    const age=parseInt(document.getElementById('adAge')?.value)||0;
    const bun=parseFloat(document.getElementById('adBun')?.value)||0;
    const dehyd=document.getElementById('adDehydration')?.checked||false;
    const spo2=parseFloat(document.getElementById('adSpO2')?.value)||0;
    const pao2=parseFloat(document.getElementById('adPaO2')?.value)||0;
    const sbp=parseFloat(document.getElementById('adSBP')?.value)||0;

    const aPos = (sex==='male' && age>=70) || (sex==='female' && age>=75);
    const dPos = (bun>=21) || dehyd;
    const rPos = (spo2>0 && spo2<=90) || (pao2>0 && pao2<=60);
    const oPos = document.getElementById('adConfusion')?.checked||false;
    const pPos = (sbp>0 && sbp<=90);

    const score=[aPos,dPos,rPos,oPos,pPos].filter(Boolean).length;

    let risk='軽症'; let alert='alert-success';
    if (score>=4){ risk='超重症'; alert='alert-danger'; }
    else if (score===3){ risk='重症'; alert='alert-warning'; }
    else if (score<=2 && score>=1){ risk='中等症'; alert='alert-info'; }

    const el=document.getElementById('adropResult');
    el.innerHTML=`<h3>A-DROP結果</h3>
      <div class="result-item"><strong>スコア:</strong> <span class="highlight">${score}</span> / 5（${risk}）</div>
      <div class="result-item"><strong>該当:</strong> A:${aPos?'1':'0'} D:${dPos?'1':'0'} R:${rPos?'1':'0'} O:${oPos?'1':'0'} P:${pPos?'1':'0'}</div>
      <div class="alert ${alert}">在宅での対応可否を検討。中等症以上は医師連絡・受診/入院評価を推奨。</div>`;
    el.style.display='block';
  }
  reset(){ ['adAge','adBun','adSpO2','adPaO2','adSBP'].forEach(id=>{const e=document.getElementById(id); if(e) e.value='';}); ['adDehydration','adConfusion'].forEach(id=>{const e=document.getElementById(id); if(e) e.checked=false;}); const s=document.getElementById('adSex'); if(s) s.selectedIndex=0; const r=document.getElementById('adropResult'); if(r) r.style.display='none'; }
}
