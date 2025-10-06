// 創傷評価ツール（DESIGN-R）
class WoundAssessmentTool extends BaseTool {
  constructor(){ super('wound','創傷評価（DESIGN-R）','褥瘡・創傷の重症度を評価します。'); }
  getIcon(){ return 'fas fa-band-aid'; }
  renderContent(){
    return `
      <div class="alert alert-info"><strong>DESIGN-R:</strong> 褥瘡の重症度分類（日本褥瘡学会）</div>
      <div class="form-group"><label for="woundDepth">Depth（深さ）</label>
        <select id="woundDepth">
          <option value="0">皮膚損傷なし</option>
          <option value="1">持続する発赤</option>
          <option value="2">真皮までの部分的皮膚欠損</option>
          <option value="3">皮下組織までの皮膚欠損</option>
          <option value="4">皮下組織を越える深い創傷</option>
          <option value="5">関節腔・体腔に至る創傷</option>
        </select>
      </div>
      <div class="form-group"><label for="woundExudate">Exudate（滲出液）</label>
        <select id="woundExudate">
          <option value="0">なし（+0）</option>
          <option value="1">少量（+1）</option>
          <option value="2">中等量（+3）</option>
          <option value="3">多量（+6）</option>
        </select>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Size（長径×短径 cm）</label>
          <div style="display:flex; gap:8px; align-items:center;">
            <input type="number" id="woundSizeLong" min="0" step="0.1" placeholder="長径 例: 5.0" style="flex:1;">
            <span>×</span>
            <input type="number" id="woundSizeShort" min="0" step="0.1" placeholder="短径 例: 3.0" style="flex:1;">
          </div>
        </div>
        <div class="form-group"><label for="woundInflammation">Inflammation（炎症/感染）</label>
          <select id="woundInflammation">
            <option value="0">局所の炎症徴候なし（+0）</option>
            <option value="1">局所の炎症徴候あり（+1）</option>
            <option value="2">臨界的定着疑い（+3）</option>
            <option value="3">局所の明かな感染徴候あり（+3）</option>
            <option value="4">全身性影響あり（+9）</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label for="woundGranulation">Granulation（肉芽組織）</label>
          <select id="woundGranulation">
            <option value="0">治癒/浅い/DTI疑い（+0）</option>
            <option value="1">良性肉芽 ≧90%（+1）</option>
            <option value="2">良性肉芽 50%~<90%（+3）</option>
            <option value="3">良性肉芽 10%~<50%（+4）</option>
            <option value="4">良性肉芽 <10%（+5）</option>
            <option value="5">良性肉芽なし（+6）</option>
          </select>
        </div>
        <div class="form-group"><label for="woundNecrosis">Necrosis（壊死組織）</label>
          <select id="woundNecrosis">
            <option value="0">なし（+0）</option>
            <option value="1">柔らかい壊死（+3）</option>
            <option value="2">硬く厚い壊死（+6）</option>
          </select>
        </div>
      </div>
      <div class="form-group"><label for="woundPocket">Pocket（ポケット）</label>
        <select id="woundPocket">
          <option value="0">なし（+0）</option>
          <option value="1"><4 cm²（+6）</option>
          <option value="2">4~<16 cm²（+9）</option>
          <option value="3">16~<36 cm²（+12）</option>
          <option value="4">≧36 cm²（+24）</option>
        </select>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="woundResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <strong>【出典】</strong> 日本褥瘡学会「改定DESIGN-R®︎2020」など
      </div>`;
  }
  render(){ const s=super.render(); const calc=new WoundCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>calc.calculate(); el.reset=()=>calc.reset(); return s; }
}
class WoundCalculator {
  calculate(){
    const exudateMap={ '0':0,'1':1,'2':3,'3':6 };
    const lengthCm=parseFloat(document.getElementById('woundSizeLong')?.value)||0;
    const shortCm=parseFloat(document.getElementById('woundSizeShort')?.value)||0; const area=lengthCm*shortCm; let sizeScore=0;
    if(area===0) sizeScore=0; else if(area<4) sizeScore=3; else if(area<16) sizeScore=6; else if(area<36) sizeScore=8; else if(area<64) sizeScore=9; else if(area<100) sizeScore=12; else sizeScore=15;
    const inflammationMap={ '0':0,'1':1,'2':3,'3':3,'4':9 };
    const granulationMap={ '0':0,'1':1,'2':3,'3':4,'4':5,'5':6 };
    const necrosisMap={ '0':0,'1':3,'2':6 };
    const pocketMap={ '0':0,'1':6,'2':9,'3':12,'4':24 };
    const exudate=exudateMap[document.getElementById('woundExudate')?.value||'0'];
    const inflammation=inflammationMap[document.getElementById('woundInflammation')?.value||'0'];
    const granulation=granulationMap[document.getElementById('woundGranulation')?.value||'0'];
    const necrosis=necrosisMap[document.getElementById('woundNecrosis')?.value||'0'];
    const pocket=pocketMap[document.getElementById('woundPocket')?.value||'0'];
    const totalScore=exudate+sizeScore+inflammation+granulation+necrosis+pocket;
    this.displayResult(totalScore,{depth:document.getElementById('woundDepth')?.value||'0', exudate, area, lengthCm, shortCm, sizeScore, inflammation, granulation, necrosis, pocket});
  }
  displayResult(totalScore,values){
    const resultDiv=document.getElementById('woundResult'); if(!resultDiv) return;
    let severity,recommendation,alertClass; if(totalScore<=3){ severity='軽度'; recommendation='基本的な創傷ケアを継続'; alertClass='alert-success'; } else if(totalScore<=7){ severity='中等度'; recommendation='専門的な創傷ケアを検討'; alertClass='alert-warning'; } else { severity='重度'; recommendation='集中的な創傷管理を強く推奨'; alertClass='alert-danger'; }
    const depthTexts=['皮膚損傷なし','持続する発赤','真皮まで','皮下組織まで','深い創傷','関節腔・体腔まで'];
    const exudateTexts=['なし（+0）','少量（+1）','中等量（+3）','多量（+6）'];
    const inflammationTexts=['局所炎症なし（+0）','局所炎症あり（+1）','臨界的定着疑い（+3）','局所感染（+3）','全身性影響（+9）'];
    const granulationTexts=['治癒/浅い/DTI疑い（+0）','良性肉芽≧90%（+1）','良性肉芽50~<90%（+3）','良性肉芽10~<50%（+4）','良性肉芽<10%（+5）','良性肉芽なし（+6）'];
    const necrosisTexts=['なし（+0）','柔らかい壊死（+3）','硬く厚い壊死（+6）'];
    const pocketTexts=['なし（+0）','<4（+6）','4~<16（+9）','16~<36（+12）','≧36（+24）'];
    resultDiv.innerHTML=`<h3>創傷評価結果（DESIGN-R）</h3>
      <div class="result-item"><strong>深さ:</strong> ${depthTexts[values.depth]} (${values.depth}点)</div>
      <div class="result-item"><strong>滲出液:</strong> ${exudateTexts[values.exudate]} (${values.exudate}点)</div>
      <div class="result-item"><strong>大きさ:</strong> 長径 ${values.lengthCm||0} cm × 短径 ${values.shortCm||0} cm = 面積 ${values.area||0} cm² (${values.sizeScore}点)</div>
      <div class="result-item"><strong>炎症/感染:</strong> ${inflammationTexts[values.inflammation]} (${values.inflammation}点)</div>
      <div class="result-item"><strong>肉芽組織:</strong> ${granulationTexts[values.granulation]} (${values.granulation}点)</div>
      <div class="result-item"><strong>壊死組織:</strong> ${necrosisTexts[values.necrosis]} (${values.necrosis}点)</div>
      <div class="result-item"><strong>ポケット:</strong> ${pocketTexts[values.pocket]} (${values.pocket}点)</div>
      <div class="result-item"><strong>総スコア:</strong> <span class="highlight">${totalScore}点</span></div>
      <div class="alert ${alertClass}"><strong>重症度:</strong> ${severity}<br><strong>推奨:</strong> ${recommendation}</div>`;
    resultDiv.style.display='block';
  }
  reset(){ ['woundDepth','woundExudate','woundInflammation','woundGranulation','woundNecrosis','woundPocket'].forEach(id=>{ const e=document.getElementById(id); if(e) e.selectedIndex=0; }); const l=document.getElementById('woundSizeLong'); if(l) l.value=''; const s=document.getElementById('woundSizeShort'); if(s) s.value=''; const r=document.getElementById('woundResult'); if(r) r.style.display='none'; }
}
