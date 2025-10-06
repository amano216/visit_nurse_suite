// -------- CURB-65（市中肺炎 重症度） --------
class CURB65Tool extends BaseTool {
  constructor(){ super('curb65','CURB-65（市中肺炎）','意識・尿素/尿素窒素・呼吸数・血圧・年齢の5項目で重症度を評価します。'); }
  getIcon(){ return 'fas fa-lungs'; }
  renderContent(){
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-user"></i> 基本情報</h4>
        <div class="form-row">
          <div class="form-group"><label for="cAge">年齢</label><input id="cAge" type="number" min="0" max="120" placeholder="例: 72"></div>
          <div class="form-group"><label><input type="checkbox" id="cConfusion"> 意識混濁（新規の見当識障害）</label></div>
        </div>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-vial"></i> 尿素/尿素窒素（いずれか）</h4>
        <div class="form-row">
          <div class="form-group"><label for="cUreaType">測定種類</label>
            <select id="cUreaType">
              <option value="urea">尿素（mmol/L）</option>
              <option value="bun">BUN（mg/dL）</option>
            </select>
          </div>
          <div class="form-group"><label for="cUrea">尿素 (mmol/L)</label><input id="cUrea" type="number" step="0.1" min="0" placeholder="例: 8.2"></div>
          <div class="form-group"><label for="cBun">BUN (mg/dL)</label><input id="cBun" type="number" step="0.1" min="0" placeholder="例: 24"></div>
        </div>
        <small>閾値: 尿素 ≥7 mmol/L または BUN >20 mg/dL を1点（単位換算の近似）。</small>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-lungs"></i> 呼吸・血圧</h4>
        <div class="form-row">
          <div class="form-group"><label for="cRR">呼吸数 (/分)</label><input id="cRR" type="number" min="0" step="1" placeholder="例: 32"></div>
          <div class="form-group"><label for="cSBP">収縮期血圧 (mmHg)</label><input id="cSBP" type="number" min="30" max="300" placeholder="例: 88"></div>
          <div class="form-group"><label for="cDBP">拡張期血圧 (mmHg)</label><input id="cDBP" type="number" min="20" max="200" placeholder="例: 58"></div>
        </div>
  <small>呼吸数 ≥30 で1点。血圧は SBP &lt;90 または DBP ≤60 で1点。</small>
      </div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <div><strong>【解説】</strong> CURB-65 は <u>Confusion</u> / <u>Urea</u> / <u>Respiratory rate</u> / <u>Blood pressure</u> / <u>Age ≥65</u> の5要素を各1点、合計0–5点で重症度評価します。<u>A-DROP は日本人向け改変版</u>です。</div>
        <div style="margin-top:6px;"><strong>【重症度と推奨】</strong> 0–1点: 外来加療可、2点: 入院推奨、3–5点: 重症（入院・ICU考慮）。<u>≥2点で入院が推奨</u>されます。</div>
        <div style="margin-top:6px;"><strong>【エビデンス】</strong> 30日死亡をアウトカムとした感度は約92.8%、特異度は約49.2%（Thorax 2003）。胸部CT所見は予後予測に有用との報告もあります（ERJ Open Res 2020）。</div>
        <div style="margin-top:6px;"><strong>【使用上の注意】</strong> 高齢者ではA-DROP同様、<u>スコア単独では不十分</u>な可能性があります。既往・合併症・社会背景・低酸素/ショックの有無等の補助情報を踏まえ、入院/外来判断を行ってください。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>Lim WS, et al. Thorax. 2003;58(5):377–382. PMID: 12728155.</li>
            <li>Okimoto N, et al. ERJ Open Res. 2020;6(4):00079-2020. PMID: 33263023.</li>
          </ul>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="curbResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new CURB65Calculator(); const el=s.querySelector('.calculator-instance');
    setTimeout(()=>{
      const typeSel=s.querySelector('#cUreaType'); const urea=s.querySelector('#cUrea'); const bun=s.querySelector('#cBun');
      const syncVis=()=>{ if(!typeSel||!urea||!bun) return; const t=typeSel.value; urea.parentElement.style.display = (t==='urea')? 'block':'none'; bun.parentElement.style.display = (t==='bun')? 'block':'none'; };
      typeSel?.addEventListener('change', syncVis); syncVis();
    },0);
    el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class CURB65Calculator {
  calculate(){
    const age=parseInt(document.getElementById('cAge')?.value)||0;
    const conf= document.getElementById('cConfusion')?.checked||false;
    const type= document.getElementById('cUreaType')?.value||'urea';
    const urea= parseFloat(document.getElementById('cUrea')?.value)||NaN;
    const bun= parseFloat(document.getElementById('cBun')?.value)||NaN;
    const rr= parseFloat(document.getElementById('cRR')?.value)||0;
    const sbp= parseFloat(document.getElementById('cSBP')?.value)||0;
    const dbp= parseFloat(document.getElementById('cDBP')?.value)||0;

    const aPos = age>=65;
    const cPos = !!conf;
    let uPos = false;
    if (type==='urea') { if (Number.isFinite(urea)) uPos = (urea>=7.0); }
    else { if (Number.isFinite(bun)) uPos = (bun>20); }
    const rPos = rr>=30;
    const bPos = (sbp>0 && sbp<90) || (dbp>0 && dbp<=60);

    const providedUrea = (type==='urea' && Number.isFinite(urea)) || (type==='bun' && Number.isFinite(bun));
    if (!providedUrea) { const el=document.getElementById('curbResult'); if(el){ el.innerHTML='<div class="alert alert-danger">尿素（mmol/L）またはBUN（mg/dL）のいずれかを入力してください。</div>'; el.style.display='block'; } return; }

    const score=[cPos,uPos,rPos,bPos,aPos].filter(Boolean).length;
    let risk='低リスク'; let alert='alert-success'; let advice='外来加療が可能（フォローアップを計画）';
    if (score===2){ risk='中等度'; alert='alert-info'; advice='入院推奨（合併症/社会背景を考慮）'; }
    else if (score>=3){ risk='高リスク（重症）'; alert='alert-danger'; advice='入院・ICU考慮。ショック/低酸素の有無を評価'; }

    const el=document.getElementById('curbResult'); if(!el) return;
    el.innerHTML = `
      <h3>CURB-65 結果</h3>
      <div class="result-item"><strong>スコア:</strong> <span class="highlight">${score}</span> / 5（${risk}）</div>
      <div class="result-item"><strong>内訳:</strong> C:${cPos?'1':'0'} U:${uPos?'1':'0'} R:${rPos?'1':'0'} B:${bPos?'1':'0'} 65歳以上:${aPos?'1':'0'}</div>
      <div class="alert ${alert}">${advice}</div>
    `;
    el.style.display='block';
  }
  reset(){ ['cAge','cRR','cSBP','cDBP','cUrea','cBun'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); const ck=document.getElementById('cConfusion'); if(ck) ck.checked=false; const tp=document.getElementById('cUreaType'); if(tp) tp.selectedIndex=0; const r=document.getElementById('curbResult'); if(r) r.style.display='none'; }
}
