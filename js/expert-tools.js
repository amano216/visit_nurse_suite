/**
 * 上級訪問看護向けスクリーニング/リスク/機能ツール集
 * - Braden圧迫リスク
 * - Morse転倒リスク
 * - ESAS-r 症状評価
 * - PPS（Palliative Performance Scale）
 * - Cockcroft-Gault クリアランス
 * - 急性意識障害スクリーニング（4項）
 * - SARC-F サルコペニア簡易評価
 * - MUST 栄養リスク
 */

// 共通: BaseToolは app.js から

// -------- Braden --------
class BradenTool extends BaseTool {
  constructor(){ super('braden','Braden圧迫リスク','6項目（6-23点）で褥瘡リスクを評価します。'); }
  getIcon(){ return 'fas fa-procedures'; }
  renderContent(){
    const sel = (id, max, min=1) => `
      <div class="form-group"><label for="${id}">${id.toUpperCase()} (${min}-${max})</label>
        <select id="${id}">
          ${Array.from({length:max-min+1}, (_,k)=>`<option value="${max-k}">${max-k}</option>`).join('')}
        </select>
      </div>`;
    return `
      <div class="form-row">
        ${sel('sensory',4)}${sel('moisture',4)}${sel('activity',4)}
      </div>
      <div class="form-row">
        ${sel('mobility',4)}${sel('nutrition',4)}
        <div class="form-group"><label for="friction">FRICTION (1-3)</label>
          <select id="friction">
            <option value="3">3</option><option value="2">2</option><option value="1">1</option>
          </select>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="bradenResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new BradenCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class BradenCalculator {
  calculate(){
    const vals=['sensory','moisture','activity','mobility','nutrition','friction'].map(id=>parseInt(document.getElementById(id)?.value)||0);
    if (vals.some(v=>v===0)) return this.err('全ての項目を選択してください。');
    const total = vals.reduce((a,b)=>a+b,0);
    let risk='なし', alert='alert-success';
    if (total<=9){ risk='極高'; alert='alert-danger'; }
    else if (total<=12){ risk='高'; alert='alert-warning'; }
    else if (total<=14){ risk='中等度'; alert='alert-warning'; }
    else if (total<=18){ risk='軽度'; alert='alert-info'; }
    const el=document.getElementById('bradenResult');
    el.innerHTML=`<h3>Braden結果</h3>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 23</div>
      <div class="alert ${alert}"><strong>リスク:</strong> ${risk}</div>`;
    el.style.display='block';
  }
  err(m){ const el=document.getElementById('bradenResult'); el.innerHTML=`<div class="alert alert-danger">${m}</div>`; el.style.display='block'; }
  reset(){ ['sensory','moisture','activity','mobility','nutrition'].forEach(id=>{const e=document.getElementById(id); if(e) e.selectedIndex=0;}); const f=document.getElementById('friction'); if(f) f.selectedIndex=0; const r=document.getElementById('bradenResult'); if(r) r.style.display='none'; }
}

// -------- Morse Fall --------
class MorseFallTool extends BaseTool {
  constructor(){ super('morse','Morse転倒リスク','6項目で転倒リスクを評価します。'); }
  getIcon(){ return 'fas fa-person-falling'; }
  renderContent(){
    return `
      <div class="form-row">
        <div class="form-group"><label>過去3ヶ月の転倒</label><select id="mfHistory"><option value="0">なし(0)</option><option value="25">あり(25)</option></select></div>
        <div class="form-group"><label>併存疾患（2つ以上）</label><select id="mfSecondary"><option value="0">いいえ(0)</option><option value="15">はい(15)</option></select></div>
        <div class="form-group"><label>補助具</label><select id="mfAid"><option value="0">なし/ベッド上(0)</option><option value="15">杖/一本杖(15)</option><option value="30">歩行器/家具伝い(30)</option></select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>点滴/ヘパリンロック</label><select id="mfIV"><option value="0">なし(0)</option><option value="20">あり(20)</option></select></div>
        <div class="form-group"><label>歩行様式</label><select id="mfGait"><option value="0">正常/車椅子(0)</option><option value="10">やや不安定(10)</option><option value="20">不安定(20)</option></select></div>
        <div class="form-group"><label>判断力</label><select id="mfMental"><option value="0">自分の限界理解(0)</option><option value="15">過大評価/無頓着(15)</option></select></div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="morseResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new MorseFallCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class MorseFallCalculator {
  calculate(){
    const vals=['mfHistory','mfSecondary','mfAid','mfIV','mfGait','mfMental'].map(id=>parseInt(document.getElementById(id)?.value)||0);
    const total=vals.reduce((a,b)=>a+b,0);
    let risk='低', alert='alert-success';
    if (total>=45){ risk='高'; alert='alert-danger'; }
    else if (total>=25){ risk='中'; alert='alert-warning'; }
    const el=document.getElementById('morseResult');
    el.innerHTML=`<h3>Morse転倒リスク</h3><div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span></div><div class="alert ${alert}"><strong>リスク:</strong> ${risk}</div>`;
    el.style.display='block';
  }
  reset(){ ['mfHistory','mfSecondary','mfAid','mfIV','mfGait','mfMental'].forEach(id=>{const e=document.getElementById(id); if(e) e.selectedIndex=0;}); const r=document.getElementById('morseResult'); if(r) r.style.display='none'; }
}

// -------- ESAS-r --------
class ESASTool extends BaseTool {
  constructor(){ super('esas','ESAS-r 症状評価','主要症状を0-10で評価し、負担の高い症状を把握します。'); }
  getIcon(){ return 'fas fa-notes-medical'; }
  renderContent(){
    const items = ['痛み','だるさ','眠気','吐き気','食欲低下','息切れ','抑うつ','不安','全体的なつらさ','その他'];
    return `
      <div class="assessment-section">
        <div class="cat-grid">
          ${items.map((label,i)=>`<div class=\"form-group\"><label>${label}（0-10）</label><input type=\"range\" min=\"0\" max=\"10\" value=\"0\" id=\"esas${i}\"></div>`).join('')}
        </div>
        <div class="result-item" id="esasLive">合計: <span class="highlight">0</span> / 100</div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="esasResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new ESASCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset();
    s.addEventListener('input', (e)=>{ if(String(e.target.id).startsWith('esas')){ const sum=Array.from({length:10}).reduce((a,_,i)=> a + (parseInt(s.querySelector(`#esas${i}`)?.value)||0),0); const live=s.querySelector('#esasLive'); if(live) live.innerHTML=`合計: <span class=\"highlight\">${sum}</span> / 100`; } });
    return s; }
}
class ESASCalculator {
  calculate(){
    const scores=Array.from({length:10}).map((_,i)=>parseInt(document.getElementById(`esas${i}`)?.value)||0);
    const sum=scores.reduce((a,b)=>a+b,0);
    const high=scores.map((v,i)=>({v,i})).filter(o=>o.v>=7).map(o=>o.i);
    const el=document.getElementById('esasResult');
    const highSymptoms=high.length? `高負担症状: ${high.map(i=>i+1).join(', ')}` : '高負担症状なし';
    el.innerHTML=`<h3>ESAS-r</h3><div class="result-item"><strong>合計:</strong> <span class="highlight">${sum}</span></div><div class="alert ${high.length? 'alert-warning':'alert-success'}">${highSymptoms}</div>`;
    el.style.display='block';
  }
  reset(){ Array.from({length:10}).forEach((_,i)=>{ const e=document.getElementById(`esas${i}`); if(e) e.value=0; }); const live=document.getElementById('esasLive'); if(live) live.innerHTML='合計: <span class="highlight">0</span> / 100'; const r=document.getElementById('esasResult'); if(r) r.style.display='none'; }
}

// -------- PPS --------
class PPSTool extends BaseTool {
  constructor(){ super('pps','Palliative Performance Scale','パフォーマンス%（0-100）で在宅緩和ケアの方針検討に役立てます。'); }
  getIcon(){ return 'fas fa-percentage'; }
  renderContent(){
    return `
      <div class="form-group">
        <label for="ppsValue">PPS（%）</label>
        <select id="ppsValue">${[100,90,80,70,60,50,40,30,20,10,0].map(v=>`<option value="${v}">${v}%</option>`).join('')}</select>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <div id="ppsResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new PPSCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); return s; }
}
class PPSCalculator { calculate(){ const v=parseInt(document.getElementById('ppsValue')?.value)||0; const el=document.getElementById('ppsResult'); let note='自立'; if(v<=50) note='要介助・ベッド中心'; else if(v<=70) note='家事/外出制限'; el.innerHTML=`<h3>PPS</h3><div class="result-item"><strong>値:</strong> <span class="highlight">${v}%</span></div><div class="alert ${v<=50?'alert-warning':'alert-info'}">目安: ${note}</div>`; el.style.display='block'; } }

// -------- Cockcroft-Gault --------
class CrClTool extends BaseTool {
  constructor(){ super('crcl','腎機能推定（Cockcroft-Gault）','年齢・体重・血清CrからCrClを推定します。'); }
  getIcon(){ return 'fas fa-vial'; }
  renderContent(){
    return `
      <div class="form-row">
        <div class="form-group"><label for="crclAge">年齢</label><input type="number" id="crclAge" min="1" max="120" placeholder="例: 75"></div>
        <div class="form-group"><label for="crclSex">性別</label><select id="crclSex"><option value="male">男性</option><option value="female">女性</option></select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label for="crclWeight">体重(kg)</label><input type="number" id="crclWeight" step="0.1" min="1"></div>
        <div class="form-group"><label for="crclScr">血清クレアチニン(mg/dL)</label><input type="number" id="crclScr" step="0.01" min="0.1" placeholder="例: 0.9"></div>
        <div class="form-group"><label for="crclScrMethod">Cr測定法</label>
          <select id="crclScrMethod">
            <option value="enz">酵素法</option>
            <option value="jaffe">Jaffe法</option>
          </select>
        </div>
      </div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <div><strong>【解説】</strong> Cockcroft–Gault式: CCr (mL/min) = (140−年齢)×体重 / (72×血清Cr)（女性は×0.85）。原著（1976）ではJaffe法Crが用いられており、本邦の酵素法Crでは <u>血清Crに+0.2 mg/dLを加算</u> して近似することが推奨されています。</div>
        <div style="margin-top:6px;"><strong>【使用上の注意】</strong> 体重・筋量が極端（低体重・肥満・サルコペニア等）の場合は不正確になり得ます。必要に応じて体重の扱い（実測/理想/調整）や他式の併用を検討してください。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>Cockcroft DW, Gault MH. Prediction of creatinine clearance from serum creatinine. Nephron. 1976;16(1):31-41.</li>
            <li>日本腎臓学会 編. エビデンスに基づくCKD診療ガイドライン 2023.</li>
          </ul>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">計算実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="crclResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new CrClCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class CrClCalculator {
  calculate(){
    const age=parseInt(document.getElementById('crclAge')?.value)||0;
    const sex=document.getElementById('crclSex')?.value||'male';
    const wt=parseFloat(document.getElementById('crclWeight')?.value)||0;
    const scr=parseFloat(document.getElementById('crclScr')?.value)||0;
    const method=document.getElementById('crclScrMethod')?.value||'enz';
    if (age<=0||wt<=0||scr<=0) return this.err('年齢・体重・Crを入力してください。');
    const scrAdj = method==='enz' ? scr + 0.2 : scr; // 酵素法→+0.2補正
    let crcl=((140-age)*wt)/(72*scrAdj); if (sex==='female') crcl*=0.85;
    const el=document.getElementById('crclResult'); const cat=crcl<30?'高度低下':(crcl<60?'中等度低下':'軽度〜正常'); const alert=crcl<60?'alert-warning':'alert-success';
    const methodNote = method==='enz' ? `（酵素法→+0.2補正後のCr=${scrAdj.toFixed(2)} mg/dL）` : '（Jaffe法Cr）';
    el.innerHTML=`<h3>Cockcroft-Gault</h3>
      <div class="result-item"><strong>CrCl:</strong> <span class="highlight">${crcl.toFixed(1)}</span> mL/min</div>
      <div class="result-item"><strong>使用Cr:</strong> ${scr.toFixed(2)} mg/dL ${methodNote}</div>
      <div class="alert ${alert}">腎機能: ${cat}</div>`; el.style.display='block';
  }
  err(m){ const el=document.getElementById('crclResult'); el.innerHTML=`<div class="alert alert-danger">${m}</div>`; el.style.display='block'; }
  reset(){ ['crclAge','crclSex','crclWeight','crclScr','crclScrMethod'].forEach(id=>{const e=document.getElementById(id); if(!e) return; if(e.tagName==='SELECT') e.selectedIndex=0; else e.value='';}); const r=document.getElementById('crclResult'); if(r) r.style.display='none'; }
}

// -------- Delirium Quick (4項) --------
class Delirium4Tool extends BaseTool {
  constructor(){ super('delirium4','急性意識障害スクリーニング（4項）','覚醒、時間場所見当、注意、急性変化の4項を点数化します。'); }
  getIcon(){ return 'fas fa-bed'; }
  renderContent(){
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-brain"></i> AIUEOTIPS（意識障害の原因の語呂合わせ）</h4>
        <div class="form-group">
          <ul style="margin:6px 0 0 20px;">
            <li><strong>A</strong>（Alcohol/薬物）：アルコール、鎮静薬、中毒</li>
            <li><strong>I</strong>（Insulin/代謝）：低血糖・高血糖、電解質異常、甲状腺機能異常</li>
            <li><strong>U</strong>（Uremia/臓器）：腎不全、肝性脳症、CO2ナルコーシス</li>
            <li><strong>E</strong>（Electrolytes/環境）：低Na/高Na、低体温/高体温、脱水</li>
            <li><strong>O</strong>（Oxygen/脳血管）：低酸素、脳梗塞・脳出血、てんかん後</li>
            <li><strong>T</strong>（Trauma）：頭部外傷、硬膜下血腫</li>
            <li><strong>I</strong>（Infection）：髄膜炎/脳炎、敗血症</li>
            <li><strong>P</strong>（Psychiatric/中毒）：精神疾患、薬物性（抗うつ薬・抗精神病薬など）</li>
            <li><strong>S</strong>（Space-occupying/その他）：脳腫瘍、水頭症、急性閉塞性水頭症 など</li>
          </ul>
        </div>
        <div class="form-group" style="margin-top:6px;">
          <strong>関連する表・スコア</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>アルコール離脱の評価: CIWA-Ar</li>
            <li>アルコール依存スクリーニング: CAGE</li>
            <li>血中エタノール濃度予測 / 浸透圧ギャップ</li>
            <li>低Na血症の診断フローチャート</li>
          </ul>
        </div>
        <div class="alert alert-info">注意: この語呂合わせは緊急度の順ではありません。実臨床では①ABC（気道・呼吸・循環）の安定、②低血糖の除外、③頭蓋内疾患の評価を優先し、検査は同時並行で行います。</div>
        <div class="text-muted" style="font-size:0.9em;">注: 呼称としては海外のAEIOU TIPSが原型とされ、本邦ではAIUEOTIPSとして普及しています。</div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>覚醒状態</label><select id="dlAlert"><option value="0">正常(0)</option><option value="4">異常(4)</option></select></div>
        <div class="form-group"><label>見当識（AMT4相当）</label><select id="dlOrient"><option value="0">誤り0-1(0)</option><option value="2">誤り2+(2)</option></select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>注意（逆唱/日付/月逆唱等）</label><select id="dlAttention"><option value="0">良好(0)</option><option value="1">不良(1)</option></select></div>
        <div class="form-group"><label>急性変化/変動</label><select id="dlAcute"><option value="0">なし(0)</option><option value="4">あり(4)</option></select></div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <div id="dlResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new Delirium4Calculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); return s; }
}
class Delirium4Calculator { calculate(){ const sc=[parseInt(document.getElementById('dlAlert')?.value)||0,parseInt(document.getElementById('dlOrient')?.value)||0,parseInt(document.getElementById('dlAttention')?.value)||0,parseInt(document.getElementById('dlAcute')?.value)||0]; const total=sc.reduce((a,b)=>a+b,0); const el=document.getElementById('dlResult'); const pos= total>=4; el.innerHTML=`<h3>4項スクリーニング</h3><div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 11</div><div class="alert ${pos?'alert-warning':'alert-success'}">${pos?'陽性の可能性：急ぎ評価を':'陰性の可能性'}</div>`; el.style.display='block'; } }

// -------- SARC-F --------
class SARCFTool extends BaseTool {
  constructor(){ super('sarcf','SARC-F（サルコペニア）','5項目0-2点でサルコペニアの可能性を評価します。'); }
  getIcon(){ return 'fas fa-dumbbell'; }
  renderContent(){
    return `
      <div class="form-row">
        <div class="form-group">
          <label for="筋力低下">約4.5kgの持ち上げ/運搬はどのくらいむずかしいですか？</label>
          <select id="筋力低下">
            <option value="0">まったくむずかしくない（0）</option>
            <option value="1">いくらかむずかしい（1）</option>
            <option value="2">とてもむずかしい／できない（2）</option>
          </select>
        </div>
        <div class="form-group">
          <label for="歩行補助">部屋の中を歩くことはどのくらいむずかしいですか？</label>
          <select id="歩行補助">
            <option value="0">まったくむずかしくない（0）</option>
            <option value="1">いくらかむずかしい（1）</option>
            <option value="2">とてもむずかしい／杖などが必要／できない（2）</option>
          </select>
        </div>
        <div class="form-group">
          <label for="椅子立ち上がり">ベッドや椅子から立ち上がることはどのくらいむずかしいですか？</label>
          <select id="椅子立ち上がり">
            <option value="0">まったくむずかしくない（0）</option>
            <option value="1">いくらかむずかしい（1）</option>
            <option value="2">とてもむずかしい／介助が必要（2）</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="階段昇降困難">10段くらいの階段をのぼることはどのくらいむずかしいですか？</label>
          <select id="階段昇降困難">
            <option value="0">まったくむずかしくない（0）</option>
            <option value="1">いくらかむずかしい（1）</option>
            <option value="2">とてもむずかしい／できない（2）</option>
          </select>
        </div>
        <div class="form-group">
          <label for="転倒歴">過去2年間に何回程度転びましたか？</label>
          <select id="転倒歴">
            <option value="0">まったくない（0）</option>
            <option value="1">1–3回（1）</option>
            <option value="2">4回以上（2）</option>
          </select>
        </div>
      </div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <div><strong>【解説】</strong> SARC-Fは5項目を各0–2点で評価し、合計0–10点。<u>4点以上でスクリーニング陽性</u>とされ、IADL障害、歩行速度低下、入院、死亡などと関連することが報告されています。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>Malmstrom TK, Morley JE. SARC-F: a symptom score to predict persons with sarcopenia at risk for poor functional outcomes. J Cachexia Sarcopenia Muscle. 2016;7(1):28–36. PMID: 27066316.</li>
            <li>Tanaka S, Kamiya K, et al. Utility of SARC-F for Assessing Physical Function in Elderly Patients With Cardiovascular Disease. J Am Med Dir Assoc. 2017;18(2):176–181. PMID: 28043805.</li>
          </ul>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <div id="sarcfResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new SARCFCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); return s; }
}
class SARCFCalculator { calculate(){ const ids=['筋力低下','歩行補助','椅子立ち上がり','階段昇降困難','転倒歴']; const total=ids.reduce((a,id)=> a + (parseInt(document.getElementById(id)?.value)||0),0); const el=document.getElementById('sarcfResult'); const pos= total>=4; el.innerHTML=`<h3>SARC-F</h3><div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 10</div><div class="alert ${pos?'alert-warning':'alert-success'}">${pos?'陽性（4点以上）：サルコペニアの可能性あり。詳細評価を検討':'陰性の可能性：ただし臨床所見と併せて判断'}</div>`; el.style.display='block'; } }

// -------- MUST --------
class MUSTTool extends BaseTool {
  constructor(){ super('must','MUST 栄養リスク','BMI/体重減少/急性疾患効果の3要素で栄養リスクを判定します。'); }
  getIcon(){ return 'fas fa-seedling'; }
  renderContent(){
    return `
      <div class="form-row">
        <div class="form-group"><label for="mustHeight">身長(cm)</label><input type="number" id="mustHeight" step="0.1" min="50"></div>
        <div class="form-group"><label for="mustWeight">現在体重(kg)</label><input type="number" id="mustWeight" step="0.1" min="1"></div>
        <div class="form-group"><label for="mustPrevWeight">3-6ヶ月前体重(kg)</label><input type="number" id="mustPrevWeight" step="0.1" min="1"></div>
      </div>
  <div class="form-group"><label><input type="checkbox" id="mustAcute"> 急性疾患により&gt;5日間の経口摂取不能</label></div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <div><strong>【解説】</strong> MUST（Malnutrition Universal Screening Tool）は、<u>BMI</u>、<u>過去3–6ヶ月の体重減少</u>、<u>急性疾患による摂取不能（>5日）</u>の3項目を点数化し合計で判定します。</div>
        <div style="margin-top:6px;"><strong>【スコアの計算】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>BMI: &lt;18.5 = 2点、18.5–20 = 1点、&gt;20 = 0点</li>
            <li>体重減少（過去3–6ヶ月）: &gt;10% = 2点、5–10% = 1点、&lt;5% = 0点</li>
            <li>急性疾患効果: >5日間の経口摂取不能 = 2点、それ以外 = 0点</li>
          </ul>
        </div>
        <div style="margin-top:6px;"><strong>【スコアの評価】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>0点: 低リスク（スクリーニング継続：病院 毎週／介護施設 毎月／地域 例：75歳以上は毎年）</li>
            <li>1点: 中リスク（入院・施設では3日間の摂取量を記録、改善なければ移行時等に再評価。スクリーニング継続：病院 毎週／施設 月1以上／地域 2–3ヶ月毎）</li>
            <li>2点以上: 高リスク（管理栄養士に紹介、栄養摂取量の増加、ケアプランの監視と見直し：病院 毎週／施設 毎週以上／地域 2–3ヶ月毎）</li>
          </ul>
        </div>
        <div style="margin-top:6px;"><strong>【使用上の注意】</strong> 点数が低くても臨床的リスクが高い場合（例: 神経性食思不振症など）があります。入院中は早期の管理栄養士介入を検討してください。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>Malnutrition Action Group (BAPEN). The "MUST" explanatory booklet. http://www.bapen.org.uk/pdfs/must/must_explan.pdf</li>
            <li>Stratton RJ, et al. Malnutrition in hospital outpatients and inpatients... Br J Nutr. 2004;92(5):799–808. PMID: 15533269.</li>
          </ul>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="mustResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new MUSTCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class MUSTCalculator {
  calculate(){
    const h=parseFloat(document.getElementById('mustHeight')?.value)||0; const w=parseFloat(document.getElementById('mustWeight')?.value)||0; const pw=parseFloat(document.getElementById('mustPrevWeight')?.value)||0; const acute=document.getElementById('mustAcute')?.checked||false;
    if (h<=0||w<=0||pw<=0) return this.err('身長・現在体重・過去体重を入力してください。');
    const bmi=w/Math.pow(h/100,2);
  let bmiScore=0; if (bmi<18.5) bmiScore=2; else if (bmi<=20) bmiScore=1; // 18.5–20を含む
    const loss=((pw-w)/pw)*100; let lossScore=0; if (loss>10) lossScore=2; else if (loss>=5) lossScore=1;
    const acuteScore=acute?2:0; const total=bmiScore+lossScore+acuteScore;
    let risk='低'; let alert='alert-success'; if (total>=2){ risk='高'; alert='alert-danger'; } else if (total===1){ risk='中'; alert='alert-warning'; }
    const el=document.getElementById('mustResult');
    // リスク別推奨
    let advice='スクリーニング継続（病院: 毎週 / 介護施設: 毎月 / 地域: 年1程度）';
    if (total===1) advice='3日間の摂取量記録、移行時に再評価。スクリーニング継続（病院: 毎週 / 施設: 月1以上 / 地域: 2–3ヶ月毎）';
    if (total>=2) advice='管理栄養士へ紹介、栄養摂取増加、ケアプランの監視・見直し（病院: 毎週 / 施設: 毎週以上 / 地域: 2–3ヶ月毎）';
    el.innerHTML=`<h3>MUST</h3>
      <div class="result-item"><strong>BMI:</strong> ${bmi.toFixed(1)}（スコア ${bmiScore}）</div>
      <div class="result-item"><strong>体重減少:</strong> ${loss.toFixed(1)}%（スコア ${lossScore}）</div>
      <div class="result-item"><strong>急性疾患効果:</strong> スコア ${acuteScore}</div>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span></div>
      <div class="alert ${alert}"><strong>栄養リスク:</strong> ${risk}</div>
      <div class="text-muted" style="margin-top:6px;">推奨: ${advice}</div>`;
    el.style.display='block';
  }
  err(m){ const el=document.getElementById('mustResult'); el.innerHTML=`<div class="alert alert-danger">${m}</div>`; el.style.display='block'; }
  reset(){ ['mustHeight','mustWeight','mustPrevWeight'].forEach(id=>{const e=document.getElementById(id); if(e) e.value='';}); const c=document.getElementById('mustAcute'); if(c) c.checked=false; const r=document.getElementById('mustResult'); if(r) r.style.display='none'; }
}

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
            <li>日本救急医学会. 医学用語 解説集「不感蒸泄」. https://www.jaam.jp/dictionary/dictionary/index.html</li>
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
    // 参考: 安静時の目安として皮膚:呼気 ≒ 2:1 程度で内訳表示（厳密ではない）
    const skinApprox = total * (2/3);
    const respApprox = total * (1/3);
    // 参考域
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

// -------- Clinical Frailty Scale (CFS 1-9) --------
class CFSTool extends BaseTool {
  constructor(){ super('cfs','Clinical Frailty Scale (CFS)','1（健常）〜9（末期）でフレイルの程度を判定します。'); }
  getIcon(){ return 'fas fa-user-injured'; }
  renderContent(){
    const options = [
      '1: 非常に健常', '2: 健常', '3: 管理された疾患', '4: 脆弱（脆弱前）',
      '5: 軽度フレイル', '6: 中等度フレイル', '7: 高度フレイル', '8: 非常に高度フレイル', '9: 末期（余命<6ヶ月）'
    ];
    return `
      <div class="form-group">
        <label for="cfsScore">CFSスコア</label>
        <select id="cfsScore">${options.map((t,i)=>`<option value="${i+1}">${t}</option>`).join('')}</select>
      </div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <div><strong>【解説】</strong> CFS（Clinical Frailty Scale）は2005年に提案された、全体的な健康状態に基づく「虚弱」の程度を簡便に把握するスケールです。日本語版では“Frailty”を“虚弱”と表現しています（国内普及の表現）。</div>
        <div style="margin-top:6px;"><strong>【エビデンス】</strong> CFSはFrailty Indexと高い相関（r≈0.80）を示し、スコア上昇に伴い死亡・施設入所リスクが上昇することが示されています。また、2013年の国際コンセンサスでは、フレイルティのスクリーニングとしてCFSの活用が推奨されています。</div>
        <div style="margin-top:6px;"><strong>【使用上の注意】</strong> 診断名ではなく重症度の把握を目的とした補助ツールです。病状変化に応じて定期的に再評価してください。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>Rockwood K, et al. A global clinical measure of fitness and frailty in elderly people. CMAJ. 2005;173(5):489–495. PMID: 16129869.</li>
            <li>Morley JE, et al. Frailty consensus: A call to action. J Am Med Dir Assoc. 2013;14(6):392–397. PMID: 23764209.</li>
            <li>一般社団法人 日本老年医学会. 臨床虚弱尺度（Clinical Frailty Scale）日本語版.</li>
          </ul>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <div id="cfsResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new CFSCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); return s; }
}
class CFSCalculator { calculate(){ const v=parseInt(document.getElementById('cfsScore')?.value)||1; const el=document.getElementById('cfsResult'); const alert = v>=7?'alert-danger':(v>=5?'alert-warning':'alert-success'); const plan = v>=7?'集中的な介護支援と転倒・嚥下・栄養の包括対応':(v>=5?'介護サービス/リハ/栄養介入を強化':'活動性維持と疾患管理の継続'); el.innerHTML=`<h3>CFS結果</h3><div class="result-item"><strong>スコア:</strong> <span class="highlight">${v}</span> / 9</div><div class="alert ${alert}">${plan}</div>`; el.style.display='block'; } }

// -------- PHQ-9（抑うつ） --------
class PHQ9Tool extends BaseTool {
  constructor(){ super('phq9','PHQ-9（抑うつスクリーニング）','過去2週間の9項目（0-3点）で抑うつの程度を評価します。'); }
  getIcon(){ return 'fas fa-face-meh'; }
  renderContent(){
    const items = [
      '物事に対して興味や喜びが持てない',
      '気分が落ち込む、憂うつ、絶望的な気持ちになる',
      '寝つきが悪い/眠りが浅い/眠りすぎる',
      '疲れたり、気力がわかなかったりする',
      '食欲がない/食べ過ぎる',
      '自分はダメな人間だと思う/自分や家族を失望させた',
      '集中することが難しい',
      '動きや話し方が遅くなった/または落ち着かず動き回る',
      '死んだ方がましだと思う/自傷行為を考えた'
    ];
    const opts = '<option value="0">0: まったくない</option><option value="1">1: いく日か</option><option value="2">2: 半分以上</option><option value="3">3: ほとんど毎日</option>';
    return `
      <div class="assessment-section">
        <div class="als-grid">
          ${items.map((t,i)=>`<div class=\"form-group\"><label for=\"phq${i}\">${i+1}. ${t}</label><select id=\"phq${i}\">${opts}</select></div>`).join('')}
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">採点</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="phqResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new PHQ9Calculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}

// -------- MG Composite（重症筋無力症 合成指標） --------
class MGCompositeTool extends BaseTool {
  constructor(){ super('mgc','MG Composite（重症筋無力症）','眼球運動・球症状・呼吸・体幹/四肢の10項目を加重合計して重症度を評価します。'); }
  getIcon(){ return 'fas fa-dumbbell'; }
  renderContent(){
    const sel = (id, max) => `<div class="form-group"><label for="${id}">${id} (0-${max})</label><select id="${id}">${Array.from({length:max+1},(_,i)=>`<option value="${i}">${i}</option>`).join('')}</select></div>`;
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-eye"></i> 眼（Ocular）</h4>
        <div class="form-row">
          ${sel('Ptosis',4)}
          ${sel('Diplopia',4)}
          ${sel('EyeClosure',4)}
        </div>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-comment"></i> 球（Bulbar）</h4>
        <div class="form-row">
          ${sel('Talking',4)}
          ${sel('Chewing',4)}
          ${sel('Swallowing',6)}
        </div>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-lungs"></i> 呼吸（Respiratory）</h4>
        <div class="form-row">${sel('Breathing',9)}</div>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-child"></i> 体幹/四肢（Axial/Limb）</h4>
        <div class="form-row">
          ${sel('NeckFlexion',4)}
          ${sel('ShoulderAbduction',5)}
          ${sel('HipFlexion',6)}
        </div>
      </div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <div><strong>【解説】</strong> MG Composite（MGC）は MG-ADL と QMG の長所を取り入れて構成された合成指標で、<u>10項目の加重点の合計</u>で重症度変化を捉えます。ここでは各項目の<u>スコアを直接入力</u>し、ドメイン別と総合スコアを自動集計します。</div>
        <div style="margin-top:6px;"><strong>【臨床的変化】</strong> 一般に <u>3点以上の変化</u>は臨床的に意味がある可能性が示唆されています（施設の運用に従って解釈）。</div>
        <div style="margin-top:6px;"><strong>【注意】</strong> 実施手順・アンカー（基準）の詳細は原著に準拠してください。スクリーニング/フォロー用であり、診断は神経内科専門医の評価を要します。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>Burns TM, et al. Construction of an efficient evaluative instrument for myasthenia gravis: the MG composite. Muscle Nerve. 2008;38(6):1553–1562. PMID: 19016543.</li>
            <li>Burns TM, et al. The MG Composite: A valid and reliable outcome measure for myasthenia gravis. Neurology. 2010;74(18):1434–1440. PMID: 20439845.</li>
          </ul>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">集計</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="mgcResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new MGCompositeCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class MGCompositeCalculator {
  calculate(){
    const get=(id)=> parseInt(document.getElementById(id)?.value)||0;
    const ocular = get('Ptosis') + get('Diplopia') + get('EyeClosure');
    const bulbar = get('Talking') + get('Chewing') + get('Swallowing');
    const resp = get('Breathing');
    const limb = get('NeckFlexion') + get('ShoulderAbduction') + get('HipFlexion');
    const total = ocular + bulbar + resp + limb;
    const el=document.getElementById('mgcResult'); if(!el) return;
    el.innerHTML = `
      <h3>MG Composite 集計</h3>
      <div class="result-item"><strong>総合スコア:</strong> <span class="highlight">${total}</span></div>
      <div class="result-item"><strong>ドメイン内訳:</strong> 眼 ${ocular} / 球 ${bulbar} / 呼吸 ${resp} / 体幹・四肢 ${limb}</div>
      <div class="alert ${total>=20?'alert-danger':(total>=10?'alert-warning':'alert-info')}">参考: スコアは重症度の目安です（施設基準/経時変化を優先）。3点以上の変化は臨床的意義の可能性。</div>
    `;
    el.style.display='block';
  }
  reset(){ ['Ptosis','Diplopia','EyeClosure','Talking','Chewing','Swallowing','Breathing','NeckFlexion','ShoulderAbduction','HipFlexion'].forEach(id=>{ const e=document.getElementById(id); if(e) e.selectedIndex=0; }); const r=document.getElementById('mgcResult'); if(r) r.style.display='none'; }
}

// -------- EAT-10（嚥下スクリーニング） --------
class EAT10Tool extends BaseTool {
  constructor(){ super('eat10','EAT-10（嚥下スクリーニング）','10項目×0–4点で嚥下に関する主観的な困難度を評価します。合計0–40点。'); }
  getIcon(){ return 'fas fa-utensils'; }
  renderContent(){
    const opts = ['0: 問題なし','1: わずかに問題','2: 中等度の問題','3: 重度の問題','4: 極めて重度の問題']
      .map((t,i)=>`<option value="${i}">${t}</option>`).join('');
    const items = Array.from({length:10}).map((_,i)=>
      `<div class="form-group"><label for="eat_${i}">質問 ${i+1}</label><select id="eat_${i}">${opts}</select></div>`
    ).join('');
    return `
      <div class="assessment-section">
        <div class="als-grid">${items}</div>
        <small>各項目 0–4 点（0=問題なし, 4=極めて重度）。合計 0–40 点。</small>
      </div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <div><strong>【解説】</strong> EAT-10 は自記式の嚥下スクリーニングで、<u>合計スコアが 3 点以上</u>を問題ありとみなします（正常コホート平均 0.40±1.01 → +2SD 上限 ≈ 2.41）。</div>
        <div style="margin-top:6px;"><strong>【エビデンス】</strong> 妥当性・再現性が良好と報告されています。一方で、<u>日本語版の再テスト信頼性</u>は十分に検証途上とされます。</div>
        <div style="margin-top:6px;"><strong>【使用上の注意】</strong> スクリーニング目的です。誤嚥性肺炎リスクや栄養状態、口腔機能等と総合的に判断し、必要に応じて専門評価（嚥下内視鏡/造影）をご検討ください。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>Belafsky PC, et al. Validity and reliability of the Eating Assessment Tool (EAT-10). Ann Otol Rhinol Laryngol. 2008;117(12):919–924. PMID: 19140539.</li>
            <li>日本語版EAT-10の作成と信頼性・妥当性の検証. 静脈経腸栄養. 2014;29(3):75(871).</li>
          </ul>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">集計</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="eatResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new EAT10Calculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class EAT10Calculator {
  calculate(){
    const scores = Array.from({length:10}).map((_,i)=> parseInt(document.getElementById(`eat_${i}`)?.value) || 0);
    const total = scores.reduce((a,b)=>a+b,0);
    const abnormal = total>=3;
    const el=document.getElementById('eatResult'); if(!el) return;
    el.innerHTML = `
      <h3>EAT-10 集計</h3>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 40</div>
      <div class="alert ${abnormal?'alert-warning':'alert-success'}">${abnormal? '3点以上：問題あり（専門評価の検討）' : '2点以下：目安として正常域'}</div>
    `;
    el.style.display='block';
  }
  reset(){ for(let i=0;i<10;i++){ const e=document.getElementById(`eat_${i}`); if(e) e.selectedIndex=0; } const r=document.getElementById('eatResult'); if(r) r.style.display='none'; }
}
class PHQ9Calculator {
  calculate(){ const total = Array.from({length:9}).reduce((a,_,i)=> a + (parseInt(document.getElementById(`phq${i}`)?.value)||0), 0); const el=document.getElementById('phqResult'); let cat='最小'; let alert='alert-success'; if(total>=20){cat='重度'; alert='alert-danger';} else if(total>=15){cat='中等度〜重度'; alert='alert-warning';} else if(total>=10){cat='中等度'; alert='alert-warning';} else if(total>=5){cat='軽度'; alert='alert-info';} el.innerHTML=`<h3>PHQ-9結果</h3><div class=\"result-item\"><strong>合計:</strong> <span class=\"highlight\">${total}</span> / 27（${cat}）</div><div class=\"alert ${alert}\">必要に応じて医師/専門職に相談し、危険兆候（自傷念慮）に注意してください。</div>`; el.style.display='block'; }
  reset(){ Array.from({length:9}).forEach((_,i)=>{ const e=document.getElementById(`phq${i}`); if(e) e.selectedIndex=0; }); const r=document.getElementById('phqResult'); if(r) r.style.display='none'; }
}

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
        <div style="margin-top:6px;"><strong>【出典】</strong> 一般社団法人 日本呼吸器学会. 成人肺炎診療ガイドライン2024（市中肺炎）.</div>
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

    // A
    const aPos = (sex==='male' && age>=70) || (sex==='female' && age>=75);
    // D
    const dPos = (bun>=21) || dehyd;
    // R
    const rPos = (spo2>0 && spo2<=90) || (pao2>0 && pao2<=60);
    // O
    const oPos = document.getElementById('adConfusion')?.checked||false;
    // P
    const pPos = (sbp>0 && sbp<=90);

    const score=[aPos,dPos,rPos,oPos,pPos].filter(Boolean).length;

  let risk='軽症'; let alert='alert-success';
    if (score>=4){ risk='超重症'; alert='alert-danger'; }
    else if (score===3){ risk='重症'; alert='alert-warning'; }
    else if (score<=2 && score>=1){ risk='中等症'; alert='alert-info'; }

    const el=document.getElementById('adropResult');
    // ショック（収縮期≲90で反応不良や乳酸上昇など）が疑われる場合は超重症として扱うべき点に留意。
    el.innerHTML=`<h3>A-DROP結果</h3>
      <div class="result-item"><strong>スコア:</strong> <span class="highlight">${score}</span> / 5（${risk}）</div>
      <div class="result-item"><strong>該当:</strong> A:${aPos?'1':'0'} D:${dPos?'1':'0'} R:${rPos?'1':'0'} O:${oPos?'1':'0'} P:${pPos?'1':'0'}</div>
      <div class="alert ${alert}">在宅での対応可否を検討。中等症以上は医師連絡・受診/入院評価を推奨。</div>`;
    el.style.display='block';
  }
  reset(){ ['adAge','adBun','adSpO2','adPaO2','adSBP'].forEach(id=>{const e=document.getElementById(id); if(e) e.value='';}); ['adDehydration','adConfusion'].forEach(id=>{const e=document.getElementById(id); if(e) e.checked=false;}); const s=document.getElementById('adSex'); if(s) s.selectedIndex=0; const r=document.getElementById('adropResult'); if(r) r.style.display='none'; }
}

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
    // 入力タイプに応じて表示制御
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

    // 項目採点
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

// -------- RASS-PAL（緩和ケア鎮静評価） --------
class RASSPALTool extends BaseTool {
  constructor(){ super('rasspal','RASS-PAL（緩和ケアRASS）','-5〜+4（10段階）の鎮静/せん妄評価。緩和ケア向けのRASS拡張です。'); }
  getIcon(){ return 'fas fa-bed'; }
  renderContent(){
    const levels = [
      {v:4,t:'+4 乱暴/攻撃的'},
      {v:3,t:'+3 非常に不穏'},
      {v:2,t:'+2 不穏'},
      {v:1,t:'+1 落ち着きがない'},
      {v:0,t:' 0 覚醒/落ち着き'},
      {v:-1,t:'-1 うとうと（声かけで覚醒）'},
      {v:-2,t:'-2 軽度鎮静（短時間覚醒）'},
      {v:-3,t:'-3 中等度鎮静（声かけで軽度反応）'},
      {v:-4,t:'-4 深鎮静（身体刺激で最小反応）'},
      {v:-5,t:'-5 反応なし'}
    ];
    return `
      <div class="form-group">
        <label for="rassScore">RASS-PAL スコア</label>
        <select id="rassScore">${levels.map(l=>`<option value="${l.v}">${l.t}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label for="rassGoal">鎮静目標</label><select id="rassGoal"><option value="-2">-2</option><option value="-3">-3</option><option value="-4">-4</option></select></div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価</button>
      <div id="rassResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new RASSPALCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); return s; }
}
class RASSPALCalculator { calculate(){ const v=parseInt(document.getElementById('rassScore')?.value)||0; const goal=parseInt(document.getElementById('rassGoal')?.value)||-2; const el=document.getElementById('rassResult'); let msg='観察継続'; let alert='alert-success'; if (v>=2) { msg='せん妄/興奮の可能性：原因評価と薬物/非薬物的介入を検討'; alert='alert-warning'; } else if (v<=-4) { msg='深鎮静：呼吸抑制/副作用の監視と減量を検討'; alert='alert-warning'; } const target = (v===goal)? '目標達成' : (v>goal? '鎮静不足' : '過鎮静'); el.innerHTML=`<h3>RASS-PAL</h3><div class="result-item"><strong>現在:</strong> <span class="highlight">${v}</span>（目標: ${goal} → ${target}）</div><div class="alert ${alert}">${msg}</div>`; el.style.display='block'; } }

// -------- Zarit 8（介護負担） --------
class Zarit8Tool extends BaseTool {
  constructor(){ super('zarit8','Zarit-8（介護負担）','介護者の負担感を8項目（各0-4点）で評価します。'); }
  getIcon(){ return 'fas fa-users'; }
  renderContent(){
    const items = [
      '時間が自分の思うように使えない',
      '介護によるストレスを感じる',
      '体力的に疲れる',
      '経済的な負担を感じる',
      '家族・友人との関係に影響がある',
      '介護によって健康が損なわれている',
      '介護を続けられるか不安がある',
      '介護のために自由が制限されている'
    ];
    const opts = '<option value="0">0: まったくない</option><option value="1">1: たまに</option><option value="2">2: ときどき</option><option value="3">3: よくある</option><option value="4">4: ほとんどいつも</option>';
    return `
      <div class="assessment-section">
        <div class="als-grid">
          ${items.map((t,i)=>`<div class=\"form-group\"><label for=\"z8_${i}\">${i+1}. ${t}</label><select id=\"z8_${i}\">${opts}</select></div>`).join('')}
        </div>
        <small>参考目安: 合計が高いほど負担感が強い（0-32点）。</small>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">採点</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="zarit8Result" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new Zarit8Calculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class Zarit8Calculator {
  calculate(){
    const total = Array.from({length:8}).reduce((a,_,i)=> a + (parseInt(document.getElementById(`z8_${i}`)?.value)||0), 0);
    let cat='低負担'; let alert='alert-success';
    if (total>=21) { cat='高負担'; alert='alert-danger'; }
    else if (total>=13) { cat='中等度の負担'; alert='alert-warning'; }
    else if (total>=8) { cat='軽度の負担'; alert='alert-info'; }
    const el=document.getElementById('zarit8Result');
    el.innerHTML=`<h3>Zarit-8結果</h3><div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 32（${cat}）</div><div class="alert ${alert}">必要に応じて家族支援/レスパイト/社会資源の活用を検討。</div>`;
    el.style.display='block';
  }
  reset(){ Array.from({length:8}).forEach((_,i)=>{ const e=document.getElementById(`z8_${i}`); if(e) e.selectedIndex=0; }); const r=document.getElementById('zarit8Result'); if(r) r.style.display='none'; }
}

// -------- OHAT-J（口腔健康評価） --------
class OHATJTool extends BaseTool {
  constructor(){ super('ohatj','OHAT-J（口腔評価）','8項目（各0-2点）で口腔の健康状態を評価します。'); }
  getIcon(){ return 'fas fa-tooth'; }
  renderContent(){
    const items = [
      '唇', '舌', '歯肉・口腔粘膜', '唾液', '残存歯', '義歯', '口腔清掃', '歯痛/不快感'
    ];
    const opts = '<option value="0">0: 正常</option><option value="1">1: 変化あり</option><option value="2">2: 問題あり</option>';
    return `
      <div class="assessment-section">
        <div class="als-grid">
          ${items.map((t,i)=>`<div class=\"form-group\"><label for=\"oh${i}\">${i+1}. ${t}</label><select id=\"oh${i}\">${opts}</select></div>`).join('')}
        </div>
        <small>合計0-16点。目安: 0-2 良好 / 3-5 軽度変化 / 6以上 受診・介入検討</small>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">採点</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="ohatjResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new OHATJCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class OHATJCalculator {
  calculate(){
    const total = Array.from({length:8}).reduce((a,_,i)=> a + (parseInt(document.getElementById(`oh${i}`)?.value)||0), 0);
    let cat='良好'; let alert='alert-success';
    if (total>=6) { cat='要介入/受診検討'; alert='alert-danger'; }
    else if (total>=3) { cat='軽度の変化あり'; alert='alert-warning'; }
    const el=document.getElementById('ohatjResult');
    el.innerHTML=`<h3>OHAT-J結果</h3><div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 16（${cat}）</div><div class="alert ${alert}">口腔ケア・義歯調整・歯科受診の検討。</div>`;
    el.style.display='block';
  }
  reset(){ Array.from({length:8}).forEach((_,i)=>{ const e=document.getElementById(`oh${i}`); if(e) e.selectedIndex=0; }); const r=document.getElementById('ohatjResult'); if(r) r.style.display='none'; }
}

// -------- SAS（身体活動能力早見表） --------
class SASTool extends BaseTool {
  constructor(){ super('sas','SAS（身体活動能力）','できる活動から推定METsを算出し、身体活動能力を簡易分類します。'); }
  getIcon(){ return 'fas fa-person-running'; }
  renderContent(){
    const activities = [
      {id:'sas1', label:'身の回りの用事（食事・更衣・室内歩行）', mets:2.0},
      {id:'sas2', label:'ゆっくり歩く（4km/h未満）、食器洗い', mets:2.5},
      {id:'sas3', label:'階段を1-2階上がる、平地を早歩き（約5km/h）', mets:4.0},
      {id:'sas4', label:'軽い掃除や買い物での早歩き（負荷のある持ち運び）', mets:5.0},
      {id:'sas5', label:'軽いジョギング（ゆっくり）または坂道歩行', mets:7.0}
    ];
    return `
      <div class="assessment-section">
        <div class="als-grid">
          ${activities.map(a=>`<div class=\"form-group\"><label><input type=\"radio\" name=\"sasAct\" value=\"${a.mets}\"> ${a.label}（約${a.mets} METs）</label></div>`).join('')}
        </div>
        <small>最も高いレベルで「無理なく可能」な活動を選択してください。</small>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">推定</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="sasResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new SASCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class SASCalculator {
  calculate(){
    const sel = document.querySelector('input[name="sasAct"]:checked');
    if (!sel) { const el=document.getElementById('sasResult'); if(el){ el.innerHTML='<div class="alert alert-danger">活動レベルを選択してください。</div>'; el.style.display='block'; } return; }
    const mets = parseFloat(sel.value)||0;
    let cat='低（<4 METs）'; let alert='alert-warning';
    if (mets>=7) { cat='高（≥7 METs）'; alert='alert-success'; }
    else if (mets>=4) { cat='中（4–6 METs）'; alert='alert-info'; }
    const el=document.getElementById('sasResult');
    el.innerHTML=`<h3>SAS推定</h3><div class="result-item"><strong>推定METs:</strong> <span class="highlight">${mets.toFixed(1)}</span></div><div class="alert ${alert}">身体活動能力: ${cat}。治療/リハや手術前評価の参考に。</div>`;
    el.style.display='block';
  }
  reset(){ const rads=[...document.querySelectorAll('input[name="sasAct"]')]; rads.forEach(r=> r.checked=false); const el=document.getElementById('sasResult'); if(el) el.style.display='none'; }
}

// -------- CAM（Confusion Assessment Method） --------
class CAMTool extends BaseTool {
  constructor(){ super('cam','CAM（せん妄評価）','急性発症/変動、注意障害、思考のまとまりのなさ、意識レベルの変化で診断します。'); }
  getIcon(){ return 'fas fa-brain'; }
  renderContent(){
    return `
      <div class="assessment-section">
        <div class="form-group"><label><input type="checkbox" id="camAcute"> 1) 急性発症または経過の変動</label></div>
        <div class="form-group"><label><input type="checkbox" id="camAttention"> 2) 注意障害（集中困難・逸脱）</label></div>
        <div class="form-group"><label><input type="checkbox" id="camThinking"> 3) 思考のまとまりのなさ（支離滅裂・まとまりがない）</label></div>
        <div class="form-group"><label><input type="checkbox" id="camConscious"> 4) 意識レベルの変化（覚醒度の異常）</label></div>
        <small>診断アルゴリズム：1と2があり、かつ3または4のいずれかがある場合にCAM陽性</small>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="camResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new CAMCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class CAMCalculator {
  calculate(){
    const a=document.getElementById('camAcute')?.checked||false;
    const att=document.getElementById('camAttention')?.checked||false;
    const think=document.getElementById('camThinking')?.checked||false;
    const cons=document.getElementById('camConscious')?.checked||false;
    const positive = (a && att && (think || cons));
    const el=document.getElementById('camResult');
    el.innerHTML=`<h3>CAM評価</h3>
      <div class="result-item"><strong>結果:</strong> <span class="highlight">${positive?'陽性':'陰性'}</span></div>
      <div class="result-item">1:${a?'✓':'×'} / 2:${att?'✓':'×'} / 3:${think?'✓':'×'} / 4:${cons?'✓':'×'}</div>
      <div class="alert ${positive?'alert-warning':'alert-success'}">${positive?'急性せん妄の可能性あり。原因検索、環境調整、薬剤見直しを検討。':'経過観察。変動や夜間悪化に注意。'}</div>`;
    el.style.display='block';
  }
  reset(){ ['camAcute','camAttention','camThinking','camConscious'].forEach(id=>{ const e=document.getElementById(id); if(e) e.checked=false; }); const r=document.getElementById('camResult'); if(r) r.style.display='none'; }
}

// -------- Mini-Cog --------
class MiniCogTool extends BaseTool {
  constructor(){ super('minicog','Mini-Cog（認知スクリーニング）','3語記銘（0-3点）と時計描画（0/2点）で0-5点評価します。'); }
  getIcon(){ return 'fas fa-brain'; }
  renderContent(){
    return `
      <div class="assessment-section">
        <div class="form-row">
          <div class="form-group"><label for="mcRecall">3語再生</label><select id="mcRecall"><option value="0">0 語</option><option value="1">1 語</option><option value="2">2 語</option><option value="3">3 語</option></select></div>
          <div class="form-group"><label for="mcClock">時計描画</label><select id="mcClock"><option value="0">異常(0点)</option><option value="2">正常(2点)</option></select></div>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">採点</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="mcResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new MiniCogCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class MiniCogCalculator {
  calculate(){ const recall=parseInt(document.getElementById('mcRecall')?.value)||0; const clock=parseInt(document.getElementById('mcClock')?.value)||0; const total=recall+clock; const el=document.getElementById('mcResult'); const pos = total<3; const cat = pos? '認知症の可能性あり' : '可能性は低い'; el.innerHTML=`<h3>Mini-Cog</h3><div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 5</div><div class="alert ${pos?'alert-warning':'alert-success'}">${cat}（3未満で陽性）</div>`; el.style.display='block'; }
  reset(){ ['mcRecall','mcClock'].forEach(id=>{ const e=document.getElementById(id); if(e) e.selectedIndex=0; }); const r=document.getElementById('mcResult'); if(r) r.style.display='none'; }
}

// -------- Charlson Comorbidity Index (CCI) --------
class CharlsonTool extends BaseTool {
  constructor(){ super('cci','Charlson併存疾患指数（CCI）','併存疾患の重み付け合計で予後を推定します（必要に応じて年齢点加算）。'); }
  getIcon(){ return 'fas fa-list-check'; }
  renderContent(){
    const item = (id,label,score)=>`<div class=\"form-group\"><label><input type=\"checkbox\" id=\"${id}\" value=\"${score}\"> ${label}（${score}）</label></div>`;
    return `
      <div class="assessment-section">
        <div class="form-row">
          <div>
            ${item('cciMI','心筋梗塞',1)}
            ${item('cciCHF','うっ血性心不全',1)}
            ${item('cciPVD','末梢血管疾患',1)}
            ${item('cciCVD','脳血管疾患',1)}
            ${item('cciDementia','認知症',1)}
            ${item('cciCOPD','慢性肺疾患',1)}
            ${item('cciCTD','結合組織疾患',1)}
            ${item('cciUlcer','消化性潰瘍',1)}
            ${item('cciLiverMild','肝疾患（軽度）',1)}
            ${item('cciDM','糖尿病（合併症なし）',1)}
          </div>
          <div>
            ${item('cciDMC','糖尿病（臓器障害あり）',2)}
            ${item('cciHemiplegia','片麻痺',2)}
            ${item('cciRenal','中等度〜重度腎疾患',2)}
            ${item('cciCancer','固形がん',2)}
            ${item('cciLeukemia','白血病',2)}
            ${item('cciLymphoma','リンパ腫',2)}
            ${item('cciLiverSev','肝疾患（中等度〜重度）',3)}
            ${item('cciMets','転移性固形がん',6)}
            ${item('cciAIDS','AIDS',6)}
          </div>
        </div>
        <div class="form-group">
          <input type="checkbox" id="cciAgeUse"><label for="cciAgeUse"> 年齢ポイントを加算する</label>
        </div>
        <div class="form-group">
          <label for="cciAge">年齢</label>
          <input type="number" id="cciAge" min="0" max="120" placeholder="例: 78" disabled>
        </div>
        <small>年齢点の目安：50-59:+1, 60-69:+2, 70-79:+3, 80以上:+4（参考）</small>
      </div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <div><strong>【解説】</strong> Charlson併存疾患指数（CCI）は、死亡に寄与する併存疾患に重み付けを行い合計する指標。必要に応じて年齢ポイントを加算して用います。</div>
        <div style="margin-top:6px;"><strong>【相互排他】</strong> 「糖尿病（合併症なし）」と「糖尿病（臓器障害あり）」、「肝疾患（軽度）」と「肝疾患（中等度〜重度）」、「固形がん」と「転移性固形がん」は重複加点せず高い方のみ採用。</div>
        <div style="margin-top:6px;"><strong>【参考：10年生存率（1987式）】</strong> 10年生存率 ≈ 0.983^{ e^{CCI×0.9} }（CCIは年齢点を含まない疾患スコア）。古いコホートに基づくため目安として解釈。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong> Charlson ME, et al. J Chronic Dis. 1987;40(5):373–383. PMID:3558716 ／ Quan H, et al. Am J Epidemiol. 2011;173(6):676–682. PMID:21330339</div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">計算</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="cciResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){
    const s = super.render();
    const c = new CharlsonCalculator();
    const el = s.querySelector('.calculator-instance');
    el.calculate = () => c.calculate();
    el.reset = () => c.reset();

    const ageUseCheckbox = s.querySelector('#cciAgeUse');
    const ageInput = s.querySelector('#cciAge');
    ageUseCheckbox.addEventListener('change', () => {
      ageInput.disabled = !ageUseCheckbox.checked;
      if (!ageUseCheckbox.checked) {
        ageInput.value = '';
      }
    });
    return s;
  }
}
class CharlsonCalculator {
  agePoint(age){ if (age>=80) return 4; if (age>=70) return 3; if (age>=60) return 2; if (age>=50) return 1; return 0; }
  calculate(){
    const ids=['cciMI','cciCHF','cciPVD','cciCVD','cciDementia','cciCOPD','cciCTD','cciUlcer','cciLiverMild','cciDM','cciDMC','cciHemiplegia','cciRenal','cciCancer','cciLeukemia','cciLymphoma','cciLiverSev','cciMets','cciAIDS'];
    const get=(id)=> !!document.getElementById(id)?.checked; const w=(id)=> parseInt(document.getElementById(id)?.value)||0;
    const dm=get('cciDM'), dmc=get('cciDMC');
    const livMild=get('cciLiverMild'), livSev=get('cciLiverSev');
    const ca=get('cciCancer'), mets=get('cciMets');
    let diseaseScore=0;
    ids.forEach(id=>{
      if (id==='cciDM' && dmc) return;
      if (id==='cciLiverMild' && livSev) return;
      if (id==='cciCancer' && mets) return;
      if (get(id)) diseaseScore += w(id);
    });
    const useAge = document.getElementById('cciAgeUse')?.checked||false; const age=parseInt(document.getElementById('cciAge')?.value)||0; const ap = useAge? this.agePoint(age):0; const sum = diseaseScore + ap;
    const el=document.getElementById('cciResult');
    const surv10 = Math.pow(0.983, Math.exp(diseaseScore * 0.9));
    const survPct = isFinite(surv10)? (surv10*100).toFixed(1)+'%' : '-';
    el.innerHTML=`<h3>Charlson CCI</h3>
      <div class="result-item"><strong>疾患合計:</strong> ${diseaseScore}</div>
      <div class="result-item"><strong>年齢点:</strong> ${ap}</div>
      <div class="result-item"><strong>合計スコア:</strong> <span class="highlight">${sum}</span></div>
      <div class="result-item"><strong>参考: 10年生存率（1987式）:</strong> ${survPct}</div>
      <div class="text-muted" style="font-size:0.9em;">注: 1987年コホートに基づく推定であり、現在の治療進歩を反映しない可能性があります。</div>
      <div class="alert ${sum>=6?'alert-danger':(sum>=3?'alert-warning':'alert-info')}">高スコアほど予後不良リスクが高い可能性（施設方針/主治医の判断を優先）。</div>`;
    el.style.display='block';
  }
  reset(){
    ['cciAgeUse','cciMI','cciCHF','cciPVD','cciCVD','cciDementia','cciCOPD','cciCTD','cciUlcer','cciLiverMild','cciDM','cciDMC','cciHemiplegia','cciRenal','cciCancer','cciLeukemia','cciLymphoma','cciLiverSev','cciMets','cciAIDS'].forEach(id=>{ const e=document.getElementById(id); if(!e) return; if(e.type==='checkbox') e.checked=false; else e.value=''; });
    const ageInput = document.getElementById('cciAge');
    if(ageInput) {
      ageInput.value = '';
      ageInput.disabled = true;
    }
    const r=document.getElementById('cciResult');
    if(r) r.style.display='none';
  }
}

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

// -------- STOPP/START（参考チェック） --------
class STOPPSTARTTool extends BaseTool {
  constructor(){ super('stoppstart','STOPP/START（高齢者処方・参考）','自施設の最新版に基づく処方適正チェックの補助。公式基準の要約ではありません。'); }
  getIcon(){ return 'fas fa-prescription-bottle-medical'; }
  renderContent(){
    const item=(id,txt)=>`<div class=\"form-group\"><label><input type=\"checkbox\" id=\"${id}\"> ${txt}</label></div>`;
    return `
      <div class="alert alert-info"><i class="fas fa-info-circle"></i> 参考用ツールです。正確な判断は自施設のガイドライン/主治医の指示に従ってください。</div>
      <div class="form-group"><input id="stoppSearch" class="search-input" placeholder="カテゴリ/薬剤名で検索..."></div>
      <div id="stoppList" class="als-grid">
        <div><h4>過量/重複/期間</h4>${item('stopp1','重複処方/長期投与の見直し')}</div>
        <div><h4>抗コリン負荷</h4>${item('stopp2','抗コリン作用の強い薬剤の併用に注意')}</div>
        <div><h4>鎮静/転倒</h4>${item('stopp3','ベンゾ系・Z薬・オピオイドの併用/量')}</div>
        <div><h4>腎機能</h4>${item('stopp4','CrCl低下時の用量調整・禁忌の確認')}</div>
        <div><h4>START 追加検討</h4>${item('start1','適応があるのに未導入の薬剤（例：骨粗鬆症治療など）')}</div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').exportNotes()">チェック内容をコピー</button>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const inst=new STOPPSTARTRef(); const el=s.querySelector('.calculator-instance'); el.exportNotes=()=>inst.exportNotes(); const search=s.querySelector('#stoppSearch'); if(search){ search.addEventListener('input', (e)=> inst.filterList(e.target.value, s.querySelector('#stoppList')) ); } return s; }
}
class STOPPSTARTRef {
  filterList(q, container){ if(!q){ Array.from(container.querySelectorAll('div')).forEach(d=>d.style.display=''); return; } const query=q.toLowerCase(); Array.from(container.children).forEach(div=>{ const t=(div.innerText||'').toLowerCase(); div.style.display = t.includes(query)? '':'none'; }); }
  exportNotes(){ const checked=[...document.querySelectorAll('#stoppList input[type="checkbox"]')].filter(c=>c.checked).map(c=>c.parentElement.innerText.trim()); const text = `STOPP/START参考チェック\n- ${checked.join('\n- ')}`; navigator.clipboard?.writeText(text); alert('チェック内容をコピーしました'); }
}

// -------- Beers Criteria（参考チェック） --------
class BeersTool extends BaseTool {
  constructor(){ super('beers','Beers Criteria（参考）','高齢者の潜在的不適切処方の参考。公式基準の転載ではありません。'); }
  getIcon(){ return 'fas fa-book-medical'; }
  renderContent(){
    const item=(id,txt)=>`<div class=\"form-group\"><label><input type=\"checkbox\" id=\"${id}\"> ${txt}</label></div>`;
    return `
      <div class="alert alert-info"><i class="fas fa-info-circle"></i> 参考用の一般的留意点のみを掲載。正式版は学会発行資料をご確認ください。</div>
      <div class="form-group"><input id="beersSearch" class="search-input" placeholder="カテゴリ/薬剤名で検索..."></div>
      <div id="beersList" class="als-grid">
        <div><h4>抗コリン性</h4>${item('be1','強い抗コリン薬の累積負荷')}</div>
        <div><h4>鎮静/転倒</h4>${item('be2','高リスク鎮静薬（例：長時間型BZD等）')}</div>
        <div><h4>NSAIDs</h4>${item('be3','消化管/腎合併症リスク・PPI併用の検討')}</div>
        <div><h4>腎機能</h4>${item('be4','CrClに応じた用量・禁忌の確認')}</div>
        <div><h4>相互作用</h4>${item('be5','高リスク相互作用の回避')}</div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').exportNotes()">チェック内容をコピー</button>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const inst=new BeersRef(); const el=s.querySelector('.calculator-instance'); el.exportNotes=()=>inst.exportNotes(); const search=s.querySelector('#beersSearch'); if(search){ search.addEventListener('input', (e)=> inst.filterList(e.target.value, s.querySelector('#beersList')) ); } return s; }
}
class BeersRef { filterList(q, container){ if(!q){ Array.from(container.querySelectorAll('div')).forEach(d=>d.style.display=''); return; } const query=q.toLowerCase(); Array.from(container.children).forEach(div=>{ const t=(div.innerText||'').toLowerCase(); div.style.display = t.includes(query)? '':'none'; }); } exportNotes(){ const checked=[...document.querySelectorAll('#beersList input[type="checkbox"]')].filter(c=>c.checked).map(c=>c.parentElement.innerText.trim()); const text = `Beers参考チェック\n- ${checked.join('\n- ')}`; navigator.clipboard?.writeText(text); alert('チェック内容をコピーしました'); } }

// -------- STOP-Bang（OSA簡易） --------
class STOPBangTool extends BaseTool {
  constructor(){ super('stopbang','STOP-Bang（睡眠時無呼吸）','いびき/日中眠気/無呼吸/高血圧/BMI/年齢/頸囲/性別の8項目。'); }
  getIcon(){ return 'fas fa-moon'; }
  renderContent(){
    return `
      <div class="assessment-section">
        <div class="form-row">
          <div class="form-group"><label><input type="checkbox" id="sbSnore"> いびきが大きい（S）</label></div>
          <div class="form-group"><label><input type="checkbox" id="sbTired"> 日中の疲労/眠気（T）</label></div>
          <div class="form-group"><label><input type="checkbox" id="sbObserved"> 無呼吸の目撃（O）</label></div>
          <div class="form-group"><label><input type="checkbox" id="sbBP"> 高血圧（P）</label></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label for="sbBMI">BMI</label><input type="number" id="sbBMI" step="0.1" placeholder="例: 36"></div>
          <div class="form-group"><label for="sbAge">年齢</label><input type="number" id="sbAge" min="0" max="120" placeholder="例: 58"></div>
          <div class="form-group"><label for="sbNeck">頸囲(cm)</label><input type="number" id="sbNeck" step="0.1" placeholder="例: 42"></div>
          <div class="form-group"><label for="sbSex">性別</label><select id="sbSex"><option value="male">男性</option><option value="female">女性</option></select></div>
        </div>
        <small>加点条件：BMI≥35, 年齢>50, 頸囲>40cm, 男性</small>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">採点</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="sbResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new STOPBangCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class STOPBangCalculator {
  calculate(){
    let score = 0;
    score += (document.getElementById('sbSnore')?.checked?1:0);
    score += (document.getElementById('sbTired')?.checked?1:0);
    score += (document.getElementById('sbObserved')?.checked?1:0);
    score += (document.getElementById('sbBP')?.checked?1:0);
    const bmi=parseFloat(document.getElementById('sbBMI')?.value)||0; if (bmi>=35) score++;
    const age=parseInt(document.getElementById('sbAge')?.value)||0; if (age>50) score++;
    const neck=parseFloat(document.getElementById('sbNeck')?.value)||0; if (neck>40) score++;
    const sex=document.getElementById('sbSex')?.value||'male'; if (sex==='male') score++;
    let risk='低リスク'; let alert='alert-success'; if (score>=5) { risk='高リスク'; alert='alert-danger'; } else if (score>=3) { risk='中等度リスク'; alert='alert-warning'; }
    const el=document.getElementById('sbResult');
    el.innerHTML=`<h3>STOP-Bang</h3><div class="result-item"><strong>合計:</strong> <span class="highlight">${score}</span> / 8（${risk}）</div><div class="alert ${alert}">必要に応じて睡眠検査/耳鼻科紹介を検討。</div>`; el.style.display='block';
  }
  reset(){ ['sbSnore','sbTired','sbObserved','sbBP'].forEach(id=>{ const e=document.getElementById(id); if(e) e.checked=false; }); ['sbBMI','sbAge','sbNeck'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); const s=document.getElementById('sbSex'); if(s) s.selectedIndex=0; const r=document.getElementById('sbResult'); if(r) r.style.display='none'; }
}

// -------- DNAR/ACP支援チェックリスト --------
class ACPTool extends BaseTool {
  constructor(){ super('acp','DNAR/ACP支援チェック','意思決定支援・方針確認のチェックリスト（自施設ポリシーに準拠）。'); }
  getIcon(){ return 'fas fa-file-signature'; }
  renderContent(){
    const chk=(id,txt)=>`<div class=\"form-group\"><label><input type=\"checkbox\" id=\"${id}\"> ${txt}</label></div>`;
    return `
      <div class="alert alert-info"><i class="fas fa-info-circle"></i> 医療判断ではありません。施設の手順書/主治医の指示に従ってください。</div>
      <div class="assessment-section">
        <h4><i class="fas fa-users"></i> 事前準備</h4>
        ${chk('acpDm','意思決定代行者/キーパーソンの確認')}
        ${chk('acpCom','コミュニケーション能力/理解度の評価')}
        ${chk('acpInfo','現状/予後/選択肢の情報提供')}
        <h4><i class="fas fa-heart"></i> 目標と希望</h4>
        ${chk('acpGoal','治療目標（延命/緩和/快適優先）')}
        ${chk('acpCode','コードステータス（DNAR含む）確認')}
        ${chk('acpHosp','入院/在宅の希望と条件')}
        <h4><i class="fas fa-notes-medical"></i> 具体的選好</h4>
        ${chk('acpVent','人工呼吸/非侵襲換気の希望')}
        ${chk('acpFeeding','経管/静脈栄養・補液の方針')}
        ${chk('acpTrans','輸血/抗菌薬/検査の範囲')}
        <h4><i class="fas fa-file-signature"></i> 文書と共有</h4>
        ${chk('acpDoc','同意書/POLST/指示書の有無と保管')}
        ${chk('acpShare','家族/多職種/救急隊への共有')}
        <div class="form-group"><label for="acpNotes">メモ</label><textarea id="acpNotes" rows="4" placeholder="特記事項や合意内容..." style="width:100%"></textarea></div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').exportSummary()">サマリーをコピー</button>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const inst=new ACPHelper(); const el=s.querySelector('.calculator-instance'); el.exportSummary=()=>inst.exportSummary(); return s; }
}
class ACPHelper {
  exportSummary(){
    const ids=['acpDm','acpCom','acpInfo','acpGoal','acpCode','acpHosp','acpVent','acpFeeding','acpTrans','acpDoc','acpShare'];
    const done = ids.filter(id=> document.getElementById(id)?.checked).map(id=> document.querySelector(`label[for="${id}"]`)?.innerText || document.getElementById(id).parentElement.innerText );
    const notes = document.getElementById('acpNotes')?.value || '';
    const text = `DNAR/ACP チェックリスト\n完了:\n- ${done.join('\n- ')}\nメモ:\n${notes}`;
    navigator.clipboard?.writeText(text);
    alert('サマリーをコピーしました');
  }
}

// -------- 酸素ボンベ 使用可能時間 --------
class O2TimeTool extends BaseTool {
  constructor(){ super('o2time','酸素ボンベ使用可能時間','現在圧（MPa）と流量（L/分）から残り使用可能時間を推定します。'); }
  getIcon(){ return 'fas fa-wind'; }
  renderContent(){
    const capOpts = [200,400,1200,2800,7000];
    return `
      <div class="assessment-section">
        <div class="form-row">
          <div class="form-group"><label for="o2Capacity">定格内容量（L, 14.7MPa時）</label>
            <select id="o2Capacity">${capOpts.map(v=>`<option value="${v}">${v} L</option>`).join('')}<option value="custom">カスタム</option></select>
          </div>
          <div class="form-group"><label for="o2CapacityCustom">カスタム内容量（L）</label><input type="number" id="o2CapacityCustom" step="1" min="1" placeholder="例: 3000" disabled></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label for="o2Pressure">現在圧（MPa）</label><input type="number" id="o2Pressure" step="0.1" min="0" placeholder="例: 10.5"></div>
          <div class="form-group"><label for="o2Flow">流量（L/分）</label><input type="number" id="o2Flow" step="0.1" min="0.1" placeholder="例: 2"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label for="o2Reserve">残圧の確保（MPa, 任意）</label><input type="number" id="o2Reserve" step="0.1" min="0" placeholder="例: 3"></div>
        </div>
        <small>計算式：残量(L) = 定格内容量 × (現在圧 / 14.7)。残圧は任意で差し引きます。</small>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">計算</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="o2Result" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const inst=new O2TimeCalculator(); const el=s.querySelector('.calculator-instance');
    const capSelHandler=(container)=>{
      const sel=container.querySelector('#o2Capacity'); const custom=container.querySelector('#o2CapacityCustom');
      sel.addEventListener('change',()=>{ custom.disabled = sel.value!=='custom'; if(sel.value!=='custom'){ custom.value=''; } });
    };
    setTimeout(()=>capSelHandler(s));
    el.calculate=()=>inst.calculate(); el.reset=()=>inst.reset(); return s; }
}
class O2TimeCalculator {
  getCapacity(){ const sel=document.getElementById('o2Capacity')?.value||''; if(sel==='custom'){ return parseFloat(document.getElementById('o2CapacityCustom')?.value)||0; } return parseFloat(sel)||0; }
  calculate(){
    const cap = this.getCapacity();
    const p = parseFloat(document.getElementById('o2Pressure')?.value)||0;
    const f = parseFloat(document.getElementById('o2Flow')?.value)||0;
    const r = parseFloat(document.getElementById('o2Reserve')?.value)||0;
    const el=document.getElementById('o2Result');
    if(cap<=0||p<=0||f<=0){ el.innerHTML='<div class="alert alert-danger">内容量・現在圧・流量を入力してください。</div>'; el.style.display='block'; return; }
    const totalL = cap * (p/14.7);
    const reserveL = r>0? cap * (r/14.7) : 0;
    const usableL = Math.max(totalL - reserveL, 0);
    const minutes = usableL / f;
    const h = Math.floor(minutes/60);
    const m = Math.floor(minutes%60);
    const eta = new Date(Date.now() + minutes*60000);
    el.innerHTML = `<h3>酸素ボンベ 使用可能時間</h3>
      <div class="result-item"><strong>残量（推定）:</strong> ${usableL.toFixed(0)} L</div>
      <div class="result-item"><strong>使用可能時間:</strong> <span class="highlight">${h}時間 ${m}分</span> （${minutes.toFixed(1)} 分）</div>
      <div class="alert ${minutes<30?'alert-danger':(minutes<90?'alert-warning':'alert-success')}">枯渇予測: ${eta.toLocaleString()}</div>`;
    el.style.display='block';
  }
  reset(){ ['o2Pressure','o2Flow','o2Reserve','o2CapacityCustom'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); const sel=document.getElementById('o2Capacity'); if(sel) sel.selectedIndex=0; const custom=document.getElementById('o2CapacityCustom'); if(custom) custom.disabled=true; const r=document.getElementById('o2Result'); if(r) r.style.display='none'; }
}

// -------- ABCD-Stoma 評価（参考） --------

// -------- Skin Tear（ISTAP分類） --------
class SkinTearTool extends BaseTool {
  constructor(){ super('skintear','Skin Tear（ISTAP）','皮膚裂傷をISTAP 1〜3で分類し、ケアの指針を表示します。'); }
  getIcon(){ return 'fas fa-band-aid'; }
  renderContent(){
    return `
      <div class="assessment-section">
        <div class="form-group"><label><input type="radio" name="stType" value="1"> 型1：皮膚弁喪失なし（整復可能）</label></div>
        <div class="form-group"><label><input type="radio" name="stType" value="2"> 型2：部分的皮膚弁喪失</label></div>
        <div class="form-group"><label><input type="radio" name="stType" value="3"> 型3：完全な皮膚弁喪失</label></div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').showPlan()">ケア提案</button>
      <div id="stResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const inst=new SkinTearHelper(); const el=s.querySelector('.calculator-instance'); el.showPlan=()=>inst.showPlan(); return s; }
}
class SkinTearHelper { showPlan(){ const v=document.querySelector('input[name="stType"]:checked')?.value; const el=document.getElementById('stResult'); if(!v){ el.innerHTML='<div class="alert alert-danger">分類を選択してください。</div>'; el.style.display='block'; return; } let plan=''; if(v==='1'){ plan='湿潤環境の確保、皮膚弁を整復し非固着性ドレッシングで保護。テープ牽引を避ける。'; } else if(v==='2'){ plan='創周囲の保護、適度な吸収能のある非固着性材で固定。ずれ/緊張の最小化。'; } else { plan='創の保護と感染兆候の監視。医師へ報告し、適切な創管理材/止血・鎮痛を検討。'; } el.innerHTML=`<h3>ISTAP分類: 型${v}</h3><div class="alert ${v==='3'?'alert-danger':(v==='2'?'alert-warning':'alert-info')}">${plan}</div><small>参考分類。臨床判断と施設手順を優先。</small>`; el.style.display='block'; } }

// -------- PAINAD --------
class PAINADTool extends BaseTool {
  constructor(){ super('painad','PAINAD（認知症向け疼痛評価）','呼吸/発声/表情/身体言語/なだめの5項目（各0-2点）で評価。'); }
  getIcon(){ return 'fas fa-head-side-cough'; }
  renderContent(){
    const opt=(id,opts)=>`<div class=\"form-group\"><label for=\"${id}\">${id}</label><select id=\"${id}\">${opts}</select></div>`;
    const o=(arr)=>arr.map((t,i)=>`<option value=\"${i}\">${i}: ${t}</option>`).join('');
    return `
      <div class="assessment-section">
        <div class="form-row">
          ${opt('呼吸',o(['正常','やや不規則/ため息','喘鳴/うめき/過呼吸']))}
          ${opt('発声',o(['なし','時折のうめき/うなる','持続/頻回のうめき/叫び']))}
          ${opt('表情',o(['笑顔/穏やか','しかめ面/緊張','苦痛/しかめ面が持続']))}
        </div>
        <div class="form-row">
          ${opt('身体言語',o(['リラックス','落ち着きがない/身じろぎ','防御/硬直/攻撃的']))}
          ${opt('なだめ',o(['不要','時に必要','頻繁/持続的に必要']))}
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">採点</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="painadResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const inst=new PAINADCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>inst.calculate(); el.reset=()=>inst.reset(); return s; }
}
class PAINADCalculator { calculate(){ const ids=['呼吸','発声','表情','身体言語','なだめ']; const total = ids.reduce((a,id)=> a + (parseInt(document.getElementById(id)?.value)||0),0); let cat='軽度'; let alert='alert-info'; if(total>=7){cat='重度'; alert='alert-danger';} else if(total>=4){cat='中等度'; alert='alert-warning';} const el=document.getElementById('painadResult'); el.innerHTML=`<h3>PAINAD</h3><div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 10（${cat}）</div><div class="alert ${alert}">鎮痛介入の検討と非薬物的ケア、再評価の計画。</div>`; el.style.display='block'; } reset(){ ['呼吸','発声','表情','身体言語','なだめ'].forEach(id=>{ const e=document.getElementById(id); if(e) e.selectedIndex=0; }); const r=document.getElementById('painadResult'); if(r) r.style.display='none'; } }

// -------- Abbey Pain Scale --------
class AbbeyPainTool extends BaseTool {
  constructor(){ super('abbeypain','Abbey Pain Scale','6領域（各0-3点）で非言語的疼痛を評価します。'); }
  getIcon(){ return 'fas fa-hand-holding-medical'; }
  renderContent(){
    const opt=(id)=>`<div class=\"form-group\"><label for=\"${id}\">${id}</label><select id=\"${id}\"><option value=\"0\">0: なし</option><option value=\"1\">1: 軽度</option><option value=\"2\">2: 中等度</option><option value=\"3\">3: 高度</option></select></div>`;
    return `
      <div class="assessment-section">
        <div class="form-row">
          ${opt('表情の変化')}
          ${opt('声の変化')}
          ${opt('身体言語の変化')}
        </div>
        <div class="form-row">
          ${opt('ふるまいの変化')}
          ${opt('生理学的変化')}
          ${opt('身体的変化')}
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">採点</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="abbeyResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const inst=new AbbeyPainCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>inst.calculate(); el.reset=()=>inst.reset(); return s; }
}
class AbbeyPainCalculator { calculate(){ const ids=['表情の変化','声の変化','身体言語の変化','ふるまいの変化','生理学的変化','身体的変化']; const total=ids.reduce((a,id)=> a + (parseInt(document.getElementById(id)?.value)||0),0); let cat='疼痛なし'; let alert='alert-success'; if(total>=14){cat='きわめて強い疼痛'; alert='alert-danger';} else if(total>=8){cat='強い疼痛'; alert='alert-warning';} else if(total>=4){cat='中等度の疼痛'; alert='alert-info';} const el=document.getElementById('abbeyResult'); el.innerHTML=`<h3>Abbey Pain Scale</h3><div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 18（${cat}）</div><div class="alert ${alert}">鎮痛薬の調整や非薬物的介入、一定時間後の再評価を。</div>`; el.style.display='block'; } reset(){ ['表情の変化','声の変化','身体言語の変化','ふるまいの変化','生理学的変化','身体的変化'].forEach(id=>{ const e=document.getElementById(id); if(e) e.selectedIndex=0; }); const r=document.getElementById('abbeyResult'); if(r) r.style.display='none'; } }

// -------- O2投与量⇔FiO2換算 --------
class O2FiO2Tool extends BaseTool {
  constructor(){ super('o2fio2','O2投与量⇔FiO2換算','デバイスと流量からFiO2を推定、目標FiO2から推奨流量を逆算します。'); }
  getIcon(){ return 'fas fa-head-side-mask'; }
  renderContent(){
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-head-side-mask"></i> デバイスと流量</h4>
        <div class="form-row">
          <div class="form-group"><label for="o2dev">デバイス</label>
            <select id="o2dev">
              <option value="air">室内空気</option>
              <option value="nc">鼻カニュラ</option>
              <option value="sm">シンプルマスク</option>
              <option value="vm">ベンチュリーマスク</option>
              <option value="nrb">リザーバーマスク</option>
            </select>
          </div>
          <div class="form-group"><label for="o2flow">流量 (L/分)</label><input id="o2flow" type="number" step="0.5" min="0" placeholder="例: 2"><small>鼻カニュラは「室内気21% + 1L/分ごとに約4%上昇」の経験則（上限目安4L）。ベンチュリーマスクは下の%設定を使用。</small></div>
          <div class="form-group"><label for="o2venturi">ベンチュリーバルブ（%）</label>
            <select id="o2venturi">
              <option value="">-- 選択 --</option>
              <option value="24">24%</option>
              <option value="28">28%</option>
              <option value="35">35%</option>
              <option value="40">40%</option>
              <option value="60">60%</option>
            </select>
          </div>
        </div>
      </div>
      <div class="assessment-section">
        <h4><i class="fas fa-bullseye"></i> 目標FiO2（逆算）</h4>
        <div class="form-row">
          <div class="form-group"><label for="o2fio2target">目標FiO2 (%)</label><input id="o2fio2target" type="number" min="21" max="100" step="1" placeholder="例: 30"></div>
          <div class="form-group"><label for="o2dev2">デバイス（逆算）</label>
            <select id="o2dev2">
              <option value="nc">鼻カニュラ</option>
              <option value="sm">シンプルマスク</option>
            </select>
          </div>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calc()">計算</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="o2fio2Result" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new O2FiO2Calculator(); const el=s.querySelector('.calculator-instance'); el.calc=()=>c.calc(); el.reset=()=>c.reset(); return s; }
}
class O2FiO2Calculator {
  estFiO2(device, flow){
    if (device==='air') return 0.21;
    if (device==='nc') {
      if (!flow || flow <= 0) return 0.21;
      // 経験則: 0.21 + 0.04 × 流量（L/分）
      // 上限: 流量は4Lまで、FiO2は概ね0.37程度
      const f = Math.min(Math.max(flow, 0), 4);
      return Math.min(0.21 + 0.04*f, 0.45);
    }
    if (device==='vm') {
      const v = parseFloat(document.getElementById('o2venturi')?.value)||NaN;
      return Number.isFinite(v) ? v/100 : NaN; // ベンチュリは設定値をそのまま採用
    }
    if (device==='sm') {
      if (flow < 5) return NaN; // CO2再呼吸の懸念、5L未満は非推奨
      // 6-10Lで FiO2 0.35-0.50 を線形で近似（中間値を返す）
      const f = Math.min(Math.max(flow, 6), 10);
      const slope = (0.50-0.35)/(10-6); // 0.0375
      return 0.35 + slope*(f-6);
    }
    if (device==='nrb') {
      // 10-15Lで 0.60-0.80 を線形で近似（中間値を返す）
      const f = Math.min(Math.max(flow||10, 10), 15);
      const slope = (0.80-0.60)/(15-10); // 0.04
      return 0.60 + slope*(f-10);
    }
    return NaN;
  }
  invFlowForTarget(device, targetFiO2){
    const t = targetFiO2/100;
    if (device==='nc') {
      if (t<=0.21) return 0;
      const maxT = 0.21 + 0.04*4; // 4Lの目安: 0.37
      if (t>=maxT) return 4;
      const flow = (t-0.21)/0.04;
      return Math.min(Math.max(flow, 0), 4);
    }
    if (device==='sm') {
      // 0.35-0.50 ~ 6-10L の線形近似
      if (t<=0.35) return 6; if (t>=0.50) return 10; const slope=(10-6)/(0.50-0.35); return 6 + (t-0.35)*slope; }
    if (device==='nrb') {
      // 0.60-0.80 ~ 10-15L の線形近似
      if (t<=0.60) return 10; if (t>=0.80) return 15; const slope=(15-10)/(0.80-0.60); return 10 + (t-0.60)*slope; }
    return NaN;
  }
  fio2Text(device, flow, value){
    if (device==='sm') return '35–50%';
    if (device==='nrb') return '60–80%';
    const pct = (value*100).toFixed(0)+'%';
    if (device==='vm') return pct; // 設定値
    return pct; // nc/airなど単一値
  }
  calc(){
    const dev=document.getElementById('o2dev')?.value||'air';
    const flow=parseFloat(document.getElementById('o2flow')?.value)||0;
    const tgt=parseFloat(document.getElementById('o2fio2target')?.value)||NaN;
    const dev2=document.getElementById('o2dev2')?.value||'nc';
    const el=document.getElementById('o2fio2Result'); if(!el) return;
    const fio2 = this.estFiO2(dev, flow);
    const recFlow = Number.isFinite(tgt)? this.invFlowForTarget(dev2, tgt) : NaN;
    if (!Number.isFinite(fio2)) { el.innerHTML='<div class="alert alert-danger">デバイス/流量を正しく入力してください。</div>'; el.style.display='block'; return; }
    const fio2Text = this.fio2Text(dev, flow, fio2);
    let recText='';
    if (Number.isFinite(recFlow)) {
      recText = `<div class="result-item"><strong>目標${dev2}の推奨流量:</strong> <span class="highlight">${recFlow.toFixed(1)}</span> L/分</div>`;
    }
    el.innerHTML = `
      <h3>O2⇔FiO2換算</h3>
      <div class="result-item"><strong>推定FiO2:</strong> <span class="highlight">${fio2Text}</span>（${dev}${flow>0?` / ${flow} L/分`:''}）</div>
      ${recText}
      <div class="alert ${fio2>=0.4?'alert-warning':'alert-info'}">目安換算です。臨床状況に応じてSpO2・呼吸状態を確認し、必要時は医師と相談してください。</div>
    `;
    el.style.display='block';
  }
  reset(){ ['o2flow','o2fio2target'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); const d=document.getElementById('o2dev'); if(d) d.selectedIndex=0; const d2=document.getElementById('o2dev2'); if(d2) d2.selectedIndex=0; const r=document.getElementById('o2fio2Result'); if(r) r.style.display='none'; }
}

// -------- 点滴速度（滴下計算） --------
class DripRateTool extends BaseTool {
  constructor(){ super('drip','点滴速度（滴下計算）','投与量やmL/h、秒/滴から滴下数を20滴/60滴で早見計算します。'); }
  getIcon(){ return 'fas fa-droplet'; }
  renderContent(){
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-prescription-bottle-medical"></i> 投与量から計算</h4>
        <div class="form-row">
          <div class="form-group"><label for="dripVolume">総投与量 (mL)</label><input id="dripVolume" type="number" min="0" step="1" placeholder="例: 500"></div>
          <div class="form-group"><label for="dripHours">時間 (時)</label><input id="dripHours" type="number" min="0" step="1" placeholder="例: 3"></div>
          <div class="form-group"><label for="dripMinutes">時間 (分)</label><input id="dripMinutes" type="number" min="0" step="1" placeholder="例: 0"></div>
        </div>
      </div>

      <div class="assessment-section">
        <h4><i class="fas fa-gauge"></i> mL/h 指定</h4>
        <div class="form-row">
          <div class="form-group"><label for="dripMlh">mL/h</label><input id="dripMlh" type="number" min="0" step="1" placeholder="例: 100"></div>
        </div>
      </div>

      <div class="assessment-section">
        <h4><i class="fas fa-stopwatch"></i> 秒/滴 指定（早見）</h4>
        <div class="form-row">
          <div class="form-group"><label for="dripSecPerDrop">秒/滴</label><input id="dripSecPerDrop" type="number" min="0.5" step="0.1" placeholder="例: 3.0"></div>
          <div class="form-group"><small>秒/滴を入力すると、20滴/mL・60滴/mLのmL/hを自動表示します。</small></div>
        </div>
      </div>

      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calc()">計算</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="dripResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new DripRateCalculator(); const el=s.querySelector('.calculator-instance'); el.calc=()=>c.calc(); el.reset=()=>c.reset(); return s; }
}

class DripRateCalculator {
  dropsPerMin(mlh, factor){ return (mlh * factor) / 60; }
  secPerDrop(gttPerMin){ return gttPerMin>0 ? 60 / gttPerMin : NaN; }
  mlhFromSecPerDrop(sec, factor){ return sec>0 ? (3600 / (sec * factor)) : NaN; }
  calc(){
    const vol = parseFloat(document.getElementById('dripVolume')?.value)||0;
    const h = parseFloat(document.getElementById('dripHours')?.value)||0;
    const m = parseFloat(document.getElementById('dripMinutes')?.value)||0;
    const mlhInput = parseFloat(document.getElementById('dripMlh')?.value)||0;
    const sec = parseFloat(document.getElementById('dripSecPerDrop')?.value)||0;
    const el = document.getElementById('dripResult'); if(!el) return;

    let mlh = 0;
    if (vol>0 && (h>0 || m>0)) {
      const totalMin = h*60 + m;
      if (totalMin<=0) { el.innerHTML='<div class="alert alert-danger">投与時間を正しく入力してください。</div>'; el.style.display='block'; return; }
      mlh = vol / (totalMin/60);
    }
    if (mlhInput>0) mlh = mlhInput; // 明示指定があれば優先

    const lines = [];
    if (mlh>0) {
      const gtt20 = this.dropsPerMin(mlh, 20);
      const gtt60 = this.dropsPerMin(mlh, 60);
      const sec20 = this.secPerDrop(gtt20);
      const sec60 = this.secPerDrop(gtt60);
      lines.push(`<div class="result-item"><strong>mL/h:</strong> <span class="highlight">${mlh.toFixed(0)}</span></div>`);
      const d10_20 = Math.round(gtt20/6);
      const d10_60 = Math.round(gtt60/6);
      lines.push(`<div class="result-item">20滴/mL: <strong>${gtt20.toFixed(0)}</strong> 滴/分（約 ${sec20.toFixed(1)} 秒/滴・10秒で約 ${d10_20} 滴）</div>`);
      lines.push(`<div class="result-item">60滴/mL: <strong>${gtt60.toFixed(0)}</strong> 滴/分（約 ${sec60.toFixed(1)} 秒/滴・10秒で約 ${d10_60} 滴）</div>`);
    }

    if (sec>0) {
      const gtt = 60/sec;
      const mlh20 = this.mlhFromSecPerDrop(sec, 20);
      const mlh60 = this.mlhFromSecPerDrop(sec, 60);
      const d10 = Math.round(gtt/6);
      lines.push(`<div class="result-item"><strong>秒/滴:</strong> <span class="highlight">${sec.toFixed(1)}</span> 秒 → <strong>${gtt.toFixed(0)}</strong> 滴/分（10秒で約 ${d10} 滴）</div>`);
      lines.push(`<div class="result-item">20滴/mL: <strong>${mlh20.toFixed(0)}</strong> mL/h（${gtt.toFixed(0)} 滴/分・10秒で約 ${d10} 滴）</div>`);
      lines.push(`<div class="result-item">60滴/mL: <strong>${mlh60.toFixed(0)}</strong> mL/h（${gtt.toFixed(0)} 滴/分・10秒で約 ${d10} 滴）</div>`);
    }

    el.innerHTML = `
      <h3>点滴速度 計算結果</h3>
      ${lines.length? lines.join('') : '<div class="alert alert-info">条件を入力して「計算」を押してください。</div>'}
    `;
    el.style.display='block';
  }
  reset(){ ['dripVolume','dripHours','dripMinutes','dripMlh','dripSecPerDrop'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); const r=document.getElementById('dripResult'); if(r) r.style.display='none'; }
}

// -------- STAS-J（医療者評価） --------
class STASJTool extends BaseTool {
  constructor(){ super('stasj','STAS-J（医療者評価）','緩和ケア介入の成果を医療者視点で評価（0=問題なし～4=極めて重い）。'); }
  getIcon(){ return 'fas fa-people-group'; }
  renderContent(){
    const items=[
      '痛み','他の身体症状','患者の不安','家族の不安','患者の情報理解','家族の情報理解','コミュニケーション','患者の介護負担','家族の介護負担','霊的/実存的苦痛'
    ];
    const options = Array.from({length:5}).map((_,v)=>`<option value="${v}">${v}</option>`).join('');
    const rows = items.map((label,i)=>`
      <div class="form-group"><label for="stas_${i}">${label}</label><select id="stas_${i}">${options}</select></div>
    `).join('');
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-list-check"></i> 評価（0=問題なし ～ 4=極めて重い）</h4>
        <div class="form-row">${rows}</div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calc()">集計</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="stasjResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new STASJCalculator(); const el=s.querySelector('.calculator-instance'); el.calc=()=>c.calc(); el.reset=()=>c.reset(); return s; }
}
class STASJCalculator {
  calc(){
    const labels=['痛み','他の身体症状','患者の不安','家族の不安','患者の情報理解','家族の情報理解','コミュニケーション','患者の介護負担','家族の介護負担','霊的/実存的苦痛'];
    const scores = labels.map((_,i)=> parseInt(document.getElementById(`stas_${i}`)?.value)||0);
    const total = scores.reduce((a,b)=>a+b,0);
    const avg = total / scores.length;
    const high = scores.map((v,i)=>({v,i})).filter(x=>x.v>=3).map(x=>labels[x.i]);
    const riskClass = total>=25? 'alert-danger' : (total>=15? 'alert-warning' : 'alert-info');
    const el=document.getElementById('stasjResult'); if(!el) return;
    el.innerHTML = `
      <h3>STAS-J 集計</h3>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 40（平均 ${avg.toFixed(1)}）</div>
      ${high.length? `<div class="alert ${riskClass}"><strong>高負担項目:</strong> ${high.join('、')}</div>` : `<div class="alert ${riskClass}">全般の負担レベル: ${avg.toFixed(1)}</div>`}
    `;
    el.style.display='block';
  }
  reset(){
    for(let i=0;i<10;i++){ const e=document.getElementById(`stas_${i}`); if(e) e.value='0'; }
    const r=document.getElementById('stasjResult'); if(r) r.style.display='none';
  }
}

// -------- IPOS（患者/医療者） --------
class IPOSTool extends BaseTool {
  constructor(){ super('ipos','IPOS（患者/医療者）','3–7日の短期変化に着目し、症状・心理・社会・スピリチュアルを包括評価。'); }
  getIcon(){ return 'fas fa-user-injured'; }
  renderContent(){
    const items=['痛み','息苦しさ','吐き気','食欲不振','便通の問題','疲労/倦怠','不安','気分の落ち込み','情報への満足','家族/介護者の不安','スピリチュアルな安寧'];
    const options = Array.from({length:5}).map((_,v)=>`<option value="${v}">${v}</option>`).join('');
    const rows = items.map((label,i)=>`
      <div class="form-group"><label for="ipos_${i}">${label}</label><select id="ipos_${i}">${options}</select></div>
    `).join('');
    return `
      <div class="assessment-section">
        <div class="form-row">
          <div class="form-group"><label for="iposMode">評価者</label>
            <select id="iposMode"><option value="patient">患者（自己評価）</option><option value="clinician">医療者</option></select>
          </div>
          <div class="form-group"><small>0=問題なし/満足、4=非常に強い問題/不満（項目により意味は反転しない前提の簡易版）</small></div>
        </div>
        <div class="form-row">${rows}</div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calc()">集計</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="iposResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new IPOSCalculator(); const el=s.querySelector('.calculator-instance'); el.calc=()=>c.calc(); el.reset=()=>c.reset(); return s; }
}
class IPOSCalculator {
  calc(){
    const labels=['痛み','息苦しさ','吐き気','食欲不振','便通の問題','疲労/倦怠','不安','気分の落ち込み','情報への満足','家族/介護者の不安','スピリチュアルな安寧'];
    const scores = labels.map((_,i)=> parseInt(document.getElementById(`ipos_${i}`)?.value)||0);
    const total = scores.reduce((a,b)=>a+b,0);
    const avg = total / scores.length;
    const high = scores.map((v,i)=>({v,i})).filter(x=>x.v>=3).map(x=>labels[x.i]);
    const mode = document.getElementById('iposMode')?.value||'patient';
    const tag = mode==='patient' ? '患者自己評価' : '医療者評価';
    const riskClass = total>=22? 'alert-danger' : (total>=12? 'alert-warning' : 'alert-info');
    const el=document.getElementById('iposResult'); if(!el) return;
    el.innerHTML = `
      <h3>IPOS 集計（${tag}）</h3>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 44（平均 ${avg.toFixed(1)}）</div>
      ${high.length? `<div class="alert ${riskClass}"><strong>高負担項目:</strong> ${high.join('、')}</div>` : `<div class="alert ${riskClass}">全般の負担レベル: ${avg.toFixed(1)}</div>`}
    `;
    el.style.display='block';
  }
  reset(){
    for(let i=0;i<11;i++){ const e=document.getElementById(`ipos_${i}`); if(e) e.value='0'; }
    const r=document.getElementById('iposResult'); if(r) r.style.display='none';
  }
}

// -------- オピオイド等価換算（OME/BT） --------
class OpioidEquivalenceTool extends BaseTool {
  constructor(){ super('ome','オピオイド等価換算（OME/BT）','日常用量から経口モルヒネ換算量（OME）とブレイクスルー量（10%目安）を算出します。'); }
  getIcon(){ return 'fas fa-scale-balanced'; }
  renderContent(){
    return `
      <div class="alert alert-info"><i class="fas fa-info-circle"></i> 目安換算です。腎機能/年齢/鎮痛効果/副作用を踏まえ、主治医の指示・施設方針を優先してください。</div>
      <div class="assessment-section">
        <h4><i class="fas fa-prescription-bottle"></i> ベースライン用量</h4>
        <div class="form-row">
          <div class="form-group">
            <label for="omeDrug">薬剤/経路</label>
            <select id="omeDrug">
              <option value="morphine_po">モルヒネ（経口, mg/日）</option>
              <option value="oxycodone_po">オキシコドン（経口, mg/日）</option>
              <option value="fentanyl_td">フェンタニル（貼付, mcg/時）</option>
            </select>
          </div>
          <div class="form-group">
            <label for="omeDose" id="omeDoseLabel">用量（mg/日 または mcg/時）</label>
            <input type="number" id="omeDose" step="0.1" min="0" placeholder="例: 30">
          </div>
        </div>
      </div>

      <div class="assessment-section">
        <h4><i class="fas fa-syringe"></i> ブレイクスルー用薬（換算先）</h4>
        <div class="form-row">
          <div class="form-group">
            <label for="omeRescue">換算先</label>
            <select id="omeRescue">
              <option value="morphine_po">モルヒネ（経口）</option>
              <option value="oxycodone_po">オキシコドン（経口）</option>
            </select>
          </div>
          <div class="form-group">
            <label for="omeBtPct">BT割合（%/回）</label>
            <input type="number" id="omeBtPct" step="1" min="5" max="20" value="10">
          </div>
        </div>
      </div>

      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">計算</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="omeResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const calc=new OpioidEquivalenceCalculator(); const el=s.querySelector('.calculator-instance');
    const doseLabelUpdater=()=>{
      const d=s.querySelector('#omeDrug')?.value||'morphine_po';
      const lab=s.querySelector('#omeDoseLabel'); if(!lab) return;
      lab.textContent = (d==='fentanyl_td')? '用量（mcg/時）' : '用量（mg/日）';
    };
    s.querySelector('#omeDrug')?.addEventListener('change', doseLabelUpdater);
    setTimeout(doseLabelUpdater,0);
    el.calculate=()=>calc.calculate(); el.reset=()=>calc.reset(); return s; }
}
class OpioidEquivalenceCalculator {
  constructor(){
    // 換算係数（mgあたりのOME/日）。貼付フェンタニルは mcg/時 → 1 mcg/h ≒ 2.4 mg OME/日 とする。
    this.factors = {
      morphine_po: 1.0,
      oxycodone_po: 1.5,
      fentanyl_td_per_mcg_h: 2.4,
    };
  }
  calcOME(drug, dose){
    if (drug === 'fentanyl_td') { // dose: mcg/h
      return dose * this.factors.fentanyl_td_per_mcg_h;
    }
    // dose: mg/day
    const f = (drug==='oxycodone_po')? this.factors.oxycodone_po : this.factors.morphine_po;
    return dose * f;
  }
  toRescue(rescueDrug, omeMg){
    const f = (rescueDrug==='oxycodone_po')? this.factors.oxycodone_po : this.factors.morphine_po;
    return omeMg / f;
  }
  toFentanylMcgPerHour(omeMg){ return omeMg / this.factors.fentanyl_td_per_mcg_h; }
  roundDose(mg){ return Math.round(mg*2)/2; } // 0.5mg丸め
  calculate(){
    const drug = document.getElementById('omeDrug')?.value||'morphine_po';
    const dose = parseFloat(document.getElementById('omeDose')?.value)||0;
    const rescue = document.getElementById('omeRescue')?.value||'morphine_po';
    const pct = parseFloat(document.getElementById('omeBtPct')?.value)||10;
    const el = document.getElementById('omeResult'); if(!el) return;
    if (dose<=0){ el.innerHTML='<div class="alert alert-danger">用量を入力してください。</div>'; el.style.display='block'; return; }
    const ome = this.calcOME(drug, dose);
    const btOme = ome * (pct/100);
    const btRescue = this.roundDose(this.toRescue(rescue, btOme));
    const drugText = { morphine_po:'モルヒネ（経口）', oxycodone_po:'オキシコドン（経口）', fentanyl_td:'フェンタニル（貼付）' }[drug];
    const rescueText = { morphine_po:'モルヒネ（経口）', oxycodone_po:'オキシコドン（経口）' }[rescue];
    // 等価換算表（スイッチング）
    const morEq = this.toRescue('morphine_po', ome); // mg/day
    const oxyEq = this.toRescue('oxycodone_po', ome); // mg/day
    const fenEq = this.toFentanylMcgPerHour(ome); // mcg/h
    el.innerHTML = `
      <h3>OME/BT換算結果</h3>
      <div class="result-item"><strong>ベース薬剤/用量:</strong> ${drugText} ${dose} ${drug==='fentanyl_td'?'mcg/h':'mg/日'}</div>
      <div class="result-item"><strong>OME（経口モルヒネ換算）:</strong> <span class="highlight">${ome.toFixed(1)}</span> mg/日</div>
      <div class="result-item"><strong>BT目安 (${pct}%/回):</strong> ${btOme.toFixed(1)} mg OME/回</div>
      <div class="result-item"><strong>換算（${rescueText}）:</strong> <span class="highlight">約 ${btRescue}</span> mg/回</div>
      <h4 style="margin-top:12px"><i class="fas fa-arrows-rotate"></i> 等価換算（スイッチング）</h4>
      <div class="table-like">
        <div>モルヒネ経口</div><div><span class="highlight">${morEq.toFixed(1)}</span> mg/日</div>
        <div>オキシコドン経口</div><div><span class="highlight">${oxyEq.toFixed(1)}</span> mg/日</div>
        <div>フェンタニル貼付</div><div><span class="highlight">${fenEq.toFixed(1)}</span> mcg/時</div>
      </div>
      <div class="alert alert-info">注意：併用薬/腎機能/高齢者/せん妄などで減量が必要な場合があります。臨床状況に応じて調整してください。</div>
    `;
    el.style.display='block';
  }
  reset(){ ['omeDose'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); const s1=document.getElementById('omeDrug'); if(s1) s1.selectedIndex=0; const s2=document.getElementById('omeRescue'); if(s2) s2.selectedIndex=0; const p=document.getElementById('omeBtPct'); if(p) p.value=10; const r=document.getElementById('omeResult'); if(r) r.style.display='none'; }
}

// -------- GAS（Goal Attainment Scaling） --------
class GASTool extends BaseTool {
  constructor(){ super('gas','GAS（Goal Attainment Scaling）','個別目標の達成度を-2～+2で評価し、合算（Tスコア）で客観化。'); }
  getIcon(){ return 'fas fa-bullseye'; }
  renderContent(){
    return `
      <div class="form-group">
        <button class="btn btn-secondary" type="button" onclick="this.parentElement.parentElement.querySelector('.calculator-instance').addRow()"><i class="fas fa-plus"></i> 目標を追加</button>
      </div>
      <div class="table-responsive">
        <table class="table" id="gasTable">
          <thead><tr><th>目標</th><th>重み</th><th>達成度</th><th>操作</th></tr></thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="alert alert-info">達成度の定義: +2 期待をはるかに超える / +1 期待を上回る / 0 期待通り / -1 期待を下回る / -2 はるかに下回る</div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calc()">集計</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="gasResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new GASCalculator(); const el=s.querySelector('.calculator-instance'); el.addRow=()=>c.addRow(); el.calc=()=>c.calc(); el.reset=()=>c.reset(); // 初期行
    c.addRow('例: 1日1回は椅子から自力で立ち上がる',1,0);
    return s; }
}
class GASCalculator {
  rowTemplate(goal='',w=1,score=0){
    const options=[-2,-1,0,1,2].map(v=>`<option value="${v}" ${v===score?'selected':''}>${v}</option>`).join('');
    return `<tr>
      <td><input type="text" class="input" placeholder="目標を記入" value="${goal}"></td>
      <td><input type="number" class="input" min="0" step="0.1" value="${w}"></td>
      <td><select class="input">${options}</select></td>
      <td><button class="btn btn-sm btn-danger" type="button">削除</button></td>
    </tr>`;
  }
  addRow(goal='',w=1,score=0){
    const tbody=document.querySelector('#gasTable tbody'); if(!tbody) return;
    const temp=document.createElement('tbody'); temp.innerHTML=this.rowTemplate(goal,w,score); const tr=temp.firstElementChild;
    tr.querySelector('button').addEventListener('click',()=>tr.remove());
    tbody.appendChild(tr);
  }
  calc(){
    const tbody=document.querySelector('#gasTable tbody'); if(!tbody) return;
    const rows=[...tbody.querySelectorAll('tr')];
    if(rows.length===0){ this.addRow(); return; }
    let sumWX=0, sumW2=0; const details=[];
    rows.forEach(tr=>{
      const goal=tr.cells[0].querySelector('input')?.value?.trim()||'(未記入)';
      const w=parseFloat(tr.cells[1].querySelector('input')?.value)||0;
      const x=parseInt(tr.cells[2].querySelector('select')?.value)||0;
      sumWX += w * x; sumW2 += w * w; details.push({goal,w,x});
    });
    const tscore = sumW2>0 ? 50 + (10 * sumWX) / Math.sqrt(sumW2) : 50;
    const el=document.getElementById('gasResult'); if(!el) return;
    const high = details.filter(d=>d.x<=-1 || d.w>=2);
    el.innerHTML = `
      <h3>GAS 集計</h3>
      <div class="result-item"><strong>Σ(w×x):</strong> ${sumWX.toFixed(2)}</div>
      <div class="result-item"><strong>Tスコア:</strong> <span class="highlight">${tscore.toFixed(1)}</span>（50で期待どおり、>50で期待超過）</div>
      ${high.length? `<div class="alert alert-warning"><strong>重点フォロー:</strong> ${high.map(h=>`${h.goal}（w${h.w}, x${h.x}）`).join('、')}</div>`: ''}
    `;
    el.style.display='block';
  }
  reset(){ const tbody=document.querySelector('#gasTable tbody'); if(tbody){ tbody.innerHTML=''; } const r=document.getElementById('gasResult'); if(r) r.style.display='none'; }
}

// -------- 在宅環境チェックリスト --------
class HomeEnvTool extends BaseTool {
  constructor(){ super('homeenv','在宅環境チェックリスト','転倒・バリアフリー・衛生・緊急対応などを3段階で評価（0良好/1改善/2危険）。'); }
  getIcon(){ return 'fas fa-house-chimney'; }
  renderContent(){
    const items=[
      {cat:'転倒',label:'玄関・通路の段差がある',tip:'段差解消スロープ・手すり設置を検討'},
      {cat:'転倒',label:'夜間照明が不十分',tip:'ナイトライトの設置'},
      {cat:'転倒',label:'浴室/トイレに手すりがない',tip:'L型手すりや立ち座り支援具'},
      {cat:'転倒',label:'床が滑りやすい/散乱物が多い',tip:'ノンスリップマット/動線の整理'},
      {cat:'転倒',label:'敷物・コードの固定なし',tip:'コードの結束/滑り止めシート'},
      {cat:'バリア',label:'出入口や通路の幅が車いすに不十分',tip:'家具配置の見直し'},
      {cat:'バリア',label:'ベッド/トイレ高さが不適合',tip:'高さ調整/置台'},
      {cat:'衛生',label:'換気不良・カビ/害虫の問題',tip:'換気・清掃/専門業者相談'},
      {cat:'安全',label:'火災/ガス/CO警報器未設置',tip:'警報器の設置・点検'},
      {cat:'安全',label:'緊急連絡先の掲示がない',tip:'目につく場所へ掲示/家族連絡網'},
      {cat:'備え',label:'救急セットや常備薬が整っていない',tip:'救急箱整備/リスト更新'},
      {cat:'防災',label:'家具の固定・転倒防止が不十分',tip:'耐震固定/落下対策'},
    ];
    const options = `<option value="0">0 良好</option><option value="1">1 改善</option><option value="2">2 危険</option>`;
    const rows = items.map((it,i)=>`<tr><td>${it.cat}</td><td>${it.label}</td><td><select id="home_${i}">${options}</select></td></tr>`).join('');
    return `
      <div class="table-responsive"><table class="table"><thead><tr><th>カテゴリ</th><th>項目</th><th>評価</th></tr></thead><tbody>${rows}</tbody></table></div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calc()">集計</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="homeEnvResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new HomeEnvCalculator(); const el=s.querySelector('.calculator-instance'); el.calc=()=>c.calc(); el.reset=()=>c.reset(); return s; }
}
class HomeEnvCalculator {
  calc(){
    const labels=[
      ['転倒','玄関・通路の段差がある','段差解消スロープ・手すり設置を検討'],
      ['転倒','夜間照明が不十分','ナイトライトの設置'],
      ['転倒','浴室/トイレに手すりがない','L型手すりや立ち座り支援具'],
      ['転倒','床が滑りやすい/散乱物が多い','ノンスリップマット/動線の整理'],
      ['転倒','敷物・コードの固定なし','コードの結束/滑り止めシート'],
      ['バリア','出入口や通路の幅が車いすに不十分','家具配置の見直し'],
      ['バリア','ベッド/トイレ高さが不適合','高さ調整/置台'],
      ['衛生','換気不良・カビ/害虫の問題','換気・清掃/専門業者相談'],
      ['安全','火災/ガス/CO警報器未設置','警報器の設置・点検'],
      ['安全','緊急連絡先の掲示がない','目につく場所へ掲示/家族連絡網'],
      ['備え','救急セットや常備薬が整っていない','救急箱整備/リスト更新'],
      ['防災','家具の固定・転倒防止が不十分','耐震固定/落下対策']
    ];
    const scores = labels.map((_,i)=> parseInt(document.getElementById(`home_${i}`)?.value)||0);
    const total = scores.reduce((a,b)=>a+b,0);
    const cats = {};
    labels.forEach((l,i)=>{ cats[l[0]]=(cats[l[0]]||0)+scores[i]; });
    const highIdx = scores.map((v,i)=> v===2? i : -1).filter(i=>i>=0);
    const el=document.getElementById('homeEnvResult'); if(!el) return;
    const riskClass = total>=10? 'alert-danger' : (total>=5? 'alert-warning' : 'alert-info');
    const catStr = Object.entries(cats).map(([k,v])=>`${k}:${v}`).join(' / ');
    const tips = highIdx.map(i=>`・${labels[i][1]} → 推奨: ${labels[i][2]}`).join('<br>');
    el.innerHTML = `
      <h3>在宅環境 集計</h3>
      <div class="result-item"><strong>総リスクスコア:</strong> <span class="highlight">${total}</span>（カテゴリ内訳: ${catStr}）</div>
      ${highIdx.length? `<div class="alert ${riskClass}"><strong>緊急/優先改善:</strong><br>${tips}</div>` : `<div class="alert ${riskClass}">大きな危険は見られません</div>`}
    `;
    el.style.display='block';
  }
  reset(){ for(let i=0;i<12;i++){ const e=document.getElementById(`home_${i}`); if(e) e.value='0'; } const r=document.getElementById('homeEnvResult'); if(r) r.style.display='none'; }
}

// -------- ソーシャルネットワーク・マッピング（簡易スコア） --------
class SocialNetworkTool extends BaseTool {
  constructor(){ super('socnet','ソーシャルネットワーク・マッピング','関係者を登録し支援力スコアを推定。緊急時対応や空白領域を可視化。'); }
  getIcon(){ return 'fas fa-project-diagram'; }
  renderContent(){
    return `
      <div class="form-row">
        <div class="form-group"><label>氏名/関係</label><input type="text" id="sn_name" class="input" placeholder="例: 長男 太郎（家族）"></div>
        <div class="form-group"><label>距離</label><select id="sn_prox"><option value="cohab">同居</option><option value="near">近所</option><option value="walk">徒歩圏</option><option value="car">車移動</option></select></div>
        <div class="form-group"><label>連絡頻度/週</label><input type="number" id="sn_freq" class="input" min="0" max="21" value="1"></div>
        <div class="form-group"><label>信頼度</label><input type="number" id="sn_trust" class="input" min="1" max="5" value="4"></div>
        <div class="form-group"><label>緊急連絡可</label><select id="sn_emer"><option value="yes">はい</option><option value="no">いいえ</option></select></div>
      </div>
      <button class="btn btn-secondary" type="button" onclick="this.parentElement.querySelector('.calculator-instance').addMember()"><i class="fas fa-user-plus"></i> 追加</button>
      <div id="sn_list" class="list"></div>
      <hr>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calc()">集計</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="snResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new SocialNetworkCalculator(); const el=s.querySelector('.calculator-instance'); el.addMember=()=>c.addMember(); el.calc=()=>c.calc(); el.reset=()=>c.reset(); return s; }
}
class SocialNetworkCalculator {
  constructor(){ this.members=[]; }
  addMember(){
    const name=document.getElementById('sn_name')?.value?.trim(); if(!name) return;
    const prox=document.getElementById('sn_prox')?.value||'car';
    const freq=parseFloat(document.getElementById('sn_freq')?.value)||0;
    const trust=parseFloat(document.getElementById('sn_trust')?.value)||1;
    const emer=(document.getElementById('sn_emer')?.value||'no')==='yes';
    this.members.push({name,prox,freq,trust,emer});
    this.renderList();
  }
  renderList(){
    const list=document.getElementById('sn_list'); if(!list) return;
    list.innerHTML = this.members.length? this.members.map((m,i)=>`
      <div class="chip">
        <span>${m.name}｜${this.proxLabel(m.prox)}｜頻度${m.freq}/週｜信頼${m.trust}｜緊急${m.emer?'○':'×'}</span>
        <button class="btn btn-sm btn-danger" type="button" onclick="window.snDel${i}()">削除</button>
      </div>`).join('') : '<div class="text-muted">未登録</div>';
    // 削除ハンドラ
    this.members.forEach((_,i)=>{ window[`snDel${i}`]=()=>{ this.members.splice(i,1); this.renderList(); }; });
  }
  proxLabel(p){ return p==='cohab'?'同居':p==='near'?'近所':p==='walk'?'徒歩圏':'車移動'; }
  proxWeight(p){ return p==='cohab'?1.3:p==='near'?1.2:p==='walk'?1.1:1.0; }
  calc(){
    const n=this.members.length; const el=document.getElementById('snResult'); if(!el) return;
    if(n===0){ el.innerHTML='<div class="alert alert-info">関係者を1名以上追加してください。</div>'; el.style.display='block'; return; }
    let support=0; let emerCount=0; const byProx={cohab:0,near:0,walk:0,car:0};
    this.members.forEach(m=>{ const avail = m.emer?1.2:1.0; if(m.emer) emerCount++; byProx[m.prox]++; support += m.trust * (1 + Math.min(m.freq,14)/7) * this.proxWeight(m.prox) * avail; });
    const gaps=[]; if(byProx.cohab===0 && byProx.near===0) gaps.push('近距離の支援者がいない'); if(emerCount===0) gaps.push('緊急連絡可能者がいない');
    el.innerHTML = `
      <h3>ソーシャル支援 集計</h3>
      <div class="result-item"><strong>登録人数:</strong> ${n} 名</div>
      <div class="result-item"><strong>推定支援力スコア:</strong> <span class="highlight">${support.toFixed(1)}</span></div>
      <div class="result-item"><strong>緊急連絡可:</strong> ${emerCount} 名</div>
      ${gaps.length? `<div class="alert alert-warning"><strong>空白領域:</strong> ${gaps.join('、')}</div>` : '<div class="alert alert-success">支援ネットワークは概ね良好です</div>'}
    `;
    el.style.display='block';
  }
  reset(){ this.members=[]; this.renderList(); const r=document.getElementById('snResult'); if(r) r.style.display='none'; }
}

// -------- ZR-HOME（Quick/Detail 二層） --------
class ZRHomeTool extends BaseTool {
  constructor(){ super('zrhome','在宅環境評価 ZR-HOME（Q/D）','2–3分のスクリーニング（Q）と10–15分の詳細版（D）で、在宅環境リスクと介入優先度を可視化します。'); }
  getIcon(){ return 'fas fa-house-circle-check'; }
  renderContent(){
    return `
      <div class="form-row">
        <div class="form-group"><label>評価日</label><input type="date" id="zr_date" class="input"></div>
        <div class="form-group"><label>評価者</label><input type="text" id="zr_evaluator" class="input" placeholder="氏名"></div>
        <div class="form-group"><label>対象</label><input type="text" id="zr_subject" class="input" placeholder="例: Aさん（85）"></div>
      </div>
      <div class="tabs">
        <button class="btn btn-secondary" type="button" onclick="this.closest('section').querySelector('.calculator-instance').showTab('q')">Q：2–3分</button>
        <button class="btn btn-secondary" type="button" onclick="this.closest('section').querySelector('.calculator-instance').showTab('d')">D：詳細</button>
      </div>
      <div id="zr_q" class="assessment-section"></div>
      <div id="zr_d" class="assessment-section" style="display:none"></div>
      <div class="form-group"><label>改善計画（担当／期限／実施方法）</label><textarea id="zr_plan" class="input" rows="3" placeholder="例: 手すり設置／来週／L字手すり＋ノンスリップ"></textarea></div>
      <div class="form-group"><label>共有先</label><input id="zr_share" class="input" placeholder="家族・ケアマネ・OT・改修業者"></div>
      <div class="form-row"><div class="form-group"><label>再評価日</label><input type="date" id="zr_reval" class="input"></div></div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calc()">集計</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="zrhomeResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){
    const s=super.render();
    const c=new ZRHomeCalculator();
    const inst=s.querySelector('.calculator-instance');
    inst.showTab=(t)=>c.showTab(t);
    inst.calc=()=>c.calc();
    inst.reset=()=>c.reset();
    c.mountQ(); c.mountD();
    return s;
  }
}

class ZRHomeCalculator {
  constructor(){
    // Quick: 10項目 0–2
    this.qItems = [
      {key:'path', label:'主要動線（玄関↔トイレ↔寝室）に段差・障害物がある'},
      {key:'floor', label:'床の滑り（浴室/洗面/台所）'},
      {key:'light', label:'照明・夜間導線（足元灯・スイッチ位置）'},
      {key:'stairs', label:'階段・手すり（連続手すり・踏面）'},
      {key:'bath', label:'浴室安全（マット/手すり/浴槽出入り）'},
      {key:'toilet', label:'トイレ安全（立ち座り補助）'},
      {key:'cable', label:'コード・配線（医療機器/酸素/延長コードの転倒・火災リスク）'},
      {key:'fire', label:'火の管理（ガス/電磁調理器/警報器）'},
      {key:'emer', label:'緊急時対応（緊急連絡掲示、呼び出し手段、鍵預かり）'},
      {key:'person', label:'本人の状態（認知/ふらつき/視力で環境がハイリスク化）'}
    ];
    // Detail: 12領域 0–3 × 重み
    this.dDomains = [
      {key:'d_path', label:'動線・段差', w:1.5, star:true},
      {key:'d_floor', label:'床・滑り', w:1.5, star:true},
      {key:'d_bathwc', label:'浴室・トイレ', w:1.5, star:true},
      {key:'d_stairs', label:'階段・手すり', w:1.5, star:true},
      {key:'d_light', label:'照明・視認性', w:1.2},
      {key:'d_cable', label:'コード・配線/医療機器', w:1.3},
      {key:'d_fire', label:'火災・警報', w:1.3},
      {key:'d_clutter', label:'収納・散乱物', w:1.0},
      {key:'d_entry', label:'玄関・外構', w:1.0},
      {key:'d_kitchen', label:'キッチン安全', w:1.0},
      {key:'d_emersys', label:'緊急時体制', w:1.2},
      {key:'d_person', label:'本人要因×環境', w:1.4}
    ];
  }
  mountQ(){
    const root=document.getElementById('zr_q'); if(!root) return;
    const opt = '<option value="0">0 問題なし</option><option value="1">1 軽微</option><option value="2">2 要対応</option>';
    root.innerHTML = `<h4>ZR-HOME-Q（10項目／0–2点）</h4><div class="table-responsive"><table class="table"><thead><tr><th>#</th><th>項目</th><th>評価</th></tr></thead><tbody>${this.qItems.map((it,i)=>`<tr><td>${i+1}</td><td>${it.label}</td><td><select id="q_${it.key}">${opt}</select></td></tr>`).join('')}</tbody></table></div>`;
  }
  mountD(){
    const root=document.getElementById('zr_d'); if(!root) return;
    const opt = '<option value="0">0 安全</option><option value="1">1 軽度</option><option value="2">2 中等度</option><option value="3">3 重度</option>';
    root.innerHTML = `<h4>ZR-HOME-D（12領域／0–3点×重み）</h4><div class="table-responsive"><table class="table"><thead><tr><th>領域</th><th>評点</th><th>重み</th></tr></thead><tbody>${this.dDomains.map(d=>`<tr><td>${d.label}${d.star?' <span class=\'badge\'>★</span>':''}</td><td><select id="d_${d.key}">${opt}</select></td><td>${d.w}</td></tr>`).join('')}</tbody></table></div>`;
  }
  showTab(t){
    const q=document.getElementById('zr_q'); const d=document.getElementById('zr_d');
    if(q&&d){ q.style.display = (t==='q')?'block':'none'; d.style.display = (t==='d')?'block':'none'; }
  }
  calc(){
    const mode = document.getElementById('zr_q')?.style.display!=='none' ? 'q' : 'd';
    if(mode==='q') return this.calcQ();
    return this.calcD();
  }
  calcQ(){
    const scores = this.qItems.map(it => parseInt(document.getElementById(`q_${it.key}`)?.value)||0);
    const total = scores.reduce((a,b)=>a+b,0);
    const level = total<=4? '低' : total<=9? '中' : total<=14? '高' : '極高（即対応）';
    // 赤札条件
    const redKeys = ['stairs','bath','light','cable','fire'];
    const reds = this.qItems.map((it,idx)=> ({it,idx,score:scores[idx]})).filter(x=> redKeys.includes(x.it.key) && x.score===2);
    const el=document.getElementById('zrhomeResult'); if(!el) return;
    el.innerHTML = `
      <h3>ZR-HOME-Q 集計</h3>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 20（判定: ${level}）</div>
      ${reds.length? `<div class="alert alert-danger"><strong>赤札（GO/NO-GO）:</strong> ${reds.map(r=>`${r.it.label}`).join('、')} → 即対応</div>`:''}
      ${this.suggestFromQ(scores)}
      ${this.footerBlock()}
    `;
    el.style.display='block';
  }
  calcD(){
    const vals = this.dDomains.map(d=> ({d,score: parseInt(document.getElementById(`d_${d.key}`)?.value)||0}));
    const R = vals.reduce((s,x)=> s + x.score * x.d.w, 0);
    const level = R<10? '低' : R<20? '中' : R<35? '高（2週間以内に対応）' : '極高（即日計画）';
    const contrib = vals.filter(x=> x.score>=2);
    const el=document.getElementById('zrhomeResult'); if(!el) return;
    el.innerHTML = `
      <h3>ZR-HOME-D 集計</h3>
      <div class="result-item"><strong>総合リスク R:</strong> <span class="highlight">${R.toFixed(1)}</span>（判定: ${level}）</div>
      ${contrib.length? `<div class="alert ${R>=35?'alert-danger':R>=20?'alert-warning':'alert-info'}"><strong>優先介入領域:</strong> ${contrib.map(c=>`${c.d.label}（${c.score}×${c.d.w}）`).join('、')}</div>`:''}
      ${this.suggestFromD(vals)}
      ${this.footerBlock()}
    `;
    el.style.display='block';
  }
  suggestFromQ(scores){
    const m=(idx)=> scores[idx]>=2;
    const map=[
      m(1)? '床・滑り: 速乾マット/ノンスリップ/水はけ改善（即日〜1週）' : '',
      m(3)? '階段・手すり: 連続手すり/踏面修繕/段差テープ（1–2週）' : '',
      m(2)? '照明: 足元灯/人感ライト/スイッチ増設（即日〜1週）' : '',
      m(6)? 'コード・医療機器: 配線整理/延長コード縮減/転倒ルート除外（即日）' : '',
      m(9)? '本人要因×環境: PT/OT評価/用具適合/訓練（計画化）' : ''
    ].filter(Boolean);
    return map.length? `<div class="result-item"><strong>推奨介入:</strong><br>${map.map(x=>'・'+x).join('<br>')}</div>` : '';
  }
  suggestFromD(vals){
    const get=(key)=> vals.find(v=>v.d.key===key)?.score||0;
    const list=[];
    if(get('d_floor')>=2) list.push('床・滑り: 速乾マット/ノンスリップ/排水改善（即日〜1週）');
    if(get('d_stairs')>=2) list.push('階段・手すり: 連続手すり/踏面修繕/段差識別テープ（1–2週）');
    if(get('d_light')>=2) list.push('照明: 足元灯/人感ライト/スイッチ位置改善（即日〜1週）');
    if(get('d_cable')>=2) list.push('コード/医療機器: 配線整理/延長コード縮減/ルート最適化（即日）');
    if(get('d_person')>=2) list.push('本人要因×環境: PT/OT評価、訓練、用具適合（計画化）');
    const refStars = vals.filter(v=> (v.d.star || v.d.w>=1.3) && v.score>=2);
    const refer = refStars.length? '<div class="alert alert-info"><strong>専門連携:</strong> ★領域で2–3点あり → 福祉住環境コーディネーター/OTへリファー</div>' : '';
    return `${list.length? `<div class="result-item"><strong>推奨介入:</strong><br>${list.map(x=>'・'+x).join('<br>')}</div>`:''}${refer}`;
  }
  footerBlock(){
    const date=document.getElementById('zr_date')?.value||'';
    const evalr=document.getElementById('zr_evaluator')?.value||'';
    const subj=document.getElementById('zr_subject')?.value||'';
    const plan=document.getElementById('zr_plan')?.value||'';
    const share=document.getElementById('zr_share')?.value||'';
    const reval=document.getElementById('zr_reval')?.value||'';
    return `
      <hr>
      <div class="result-item"><strong>評価日/評価者/対象:</strong> ${date} / ${evalr} / ${subj}</div>
      ${plan? `<div class="result-item"><strong>改善計画:</strong><br>${plan.replace(/\n/g,'<br>')}</div>`:''}
      ${share? `<div class="result-item"><strong>共有先:</strong> ${share}</div>`:''}
      ${reval? `<div class="result-item"><strong>再評価日:</strong> ${reval}</div>`:''}
      <div class="text-muted">用語運用: 0=問題なし/安全、1=軽微/軽度、2=要対応/中等度、3=重度。二者評価で差分1点以内を目標。</div>
    `;
  }
  reset(){ ['zr_date','zr_evaluator','zr_subject','zr_plan','zr_share','zr_reval'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); const r=document.getElementById('zrhomeResult'); if(r) r.style.display='none'; this.mountQ(); this.mountD(); this.showTab('q'); }
}

// -------- SNA-Lite（3分版：ネットワーク簡易スコア） --------
class SNALiteTool extends BaseTool {
  constructor(){ super('snalite','SNA-Lite（ネットワーク3分評価）','マップに添える簡易スコア：8項目×0/1/2で合計、介入の優先度を明示。任意で重み付きRを算出。'); }
  getIcon(){ return 'fas fa-network-wired'; }
  renderContent(){
    const items=[
      {k:'size', label:'規模（Size）', help:'定期連絡または即応が期待できる人・資源の人数：0=6人以上/1=3–5人/2=0–2人'},
      {k:'div', label:'多様性（Diversity）', help:'家族・友人・近隣・福祉/医療・地域/ボラ等の種類数：0=4種類以上/1=2–3/2=0–1'},
      {k:'avail', label:'即応可能性（Availability）', help:'困った時に当日中に動ける人・資源：0=3以上/1=1–2/2=0'},
      {k:'redun', label:'代替性（Redundancy）', help:'主要タスクごとに代役がもう1人：0=3領域以上/1=1–2/2=0'},
      {k:'spof', label:'結節点依存（Single Point of Failure）', help:'同一人物に過度集中：0=分散/1=やや集中/2=1人に依存'},
      {k:'tie', label:'関係強度（Tie Strength）', help:'週1以上のやり取り：0=3以上/1=1–2/2=0'},
      {k:'prox', label:'地理的近接（Proximity）', help:'30分以内で駆けつけ可：0=3以上/1=1–2/2=0'},
      {k:'holes', label:'空白領域（Structural Holes）', help:'孤立ノード/未接続小島：0=目立たない/1=少し/2=顕著'}
    ];
    const opts='<option value="0">0 良好</option><option value="1">1 注意</option><option value="2">2 リスク</option>';
    const rows = items.map((it,i)=>`
      <tr>
        <td>${i+1}</td>
        <td>${it.label}<div class="subtext">${it.help}</div></td>
        <td><select id="sna_${it.k}">${opts}</select></td>
      </tr>
    `).join('');
    return `
      <div class="form-row">
        <div class="form-group"><label>評価日</label><input type="date" id="sna_date" class="input"></div>
        <div class="form-group"><label>評価者</label><input type="text" id="sna_eval" class="input" placeholder="氏名"></div>
      </div>
      <div class="table-responsive"><table class="table"><thead><tr><th>#</th><th>項目</th><th>0/1/2</th></tr></thead><tbody>${rows}</tbody></table></div>
      <div class="form-row">
        <div class="form-group"><label><input type="checkbox" id="sna_weighted"> 重み付きR（＋1分）を計算する</label></div>
      </div>
      <div class="form-group"><label>主要不足/コメント</label><textarea id="sna_notes" class="input" rows="2" placeholder="例：即応・近接が不足。30分圏内の駆けつけ資源を開拓"></textarea></div>
      <div class="form-row">
        <div class="form-group"><label>追加接続候補（3件）</label><input id="sna_candidates" class="input" placeholder="例：自治会/民生委員/訪看オンコール"></div>
        <div class="form-group"><label>実施担当</label><input id="sna_owner" class="input" placeholder="担当者"></div>
        <div class="form-group"><label>期限</label><input type="date" id="sna_due" class="input"></div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calc()">集計</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="snaResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new SNALiteCalculator(); const el=s.querySelector('.calculator-instance'); el.calc=()=>c.calc(); el.reset=()=>c.reset(); return s; }
}
class SNALiteCalculator {
  weights(){ return { size:1.0, div:1.2, avail:1.5, redun:1.5, spof:1.3, tie:1.2, prox:1.3, holes:1.0 }; }
  getScores(){
    const keys=['size','div','avail','redun','spof','tie','prox','holes'];
    const scores={}; keys.forEach(k=> scores[k]= parseInt(document.getElementById(`sna_${k}`)?.value)||0 );
    return scores;
  }
  calc(){
    const scores=this.getScores();
    const total = Object.values(scores).reduce((a,b)=>a+b,0);
    const level = total<=3? '低' : total<=7? '中' : total<=11? '高' : '極高（即介入）';
    const weighted = document.getElementById('sna_weighted')?.checked;
    let R=null, Rlabel='';
    if(weighted){ const w=this.weights(); R = Object.entries(scores).reduce((s,[k,v])=> s + v * w[k], 0);
      Rlabel = R<6? '低' : R<12? '中' : R<19? '高' : '極高（連携会議で合意）'; }
    const el=document.getElementById('snaResult'); if(!el) return;
    el.innerHTML = `
      <h3>SNA-Lite 集計</h3>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 16（判定: ${level}）</div>
      ${R!==null ? `<div class="result-item"><strong>重み付きR:</strong> <span class="highlight">${R.toFixed(1)}</span>（判定: ${Rlabel}）</div>`:''}
      ${this.interventions(scores,total)}
      ${this.footer()}
    `;
    el.style.display='block';
  }
  interventions(s,t){
    const tips=[];
    if(t>=8) tips.push('即日〜1週で不足の種類を埋める（近隣/自治会・配食・訪看・デイ・ボランティア等の新規接続）');
    if(s.redun===2 || s.spof===2) tips.push('代替性/結節点依存: バックアップ人材を最低1名ずつ追加');
    if(s.avail===2) tips.push('即応可能性: 緊急連絡網の即応者を3名体制へ（家族・近隣・専門職）');
    if(s.prox===2) tips.push('地理的近接: 30分圏の“駆けつけ資源”を確保（地域包括・民生委員・訪看オンコール）');
    if(s.holes===2) tips.push('空白領域: 連携会議で“島”をつなぐ連絡役（ケアマネ/看護/地域）を指名');
    return tips.length? `<div class="result-item"><strong>介入マップ:</strong><br>${tips.map(x=>'・'+x).join('<br>')}</div>`:'';
  }
  footer(){
    const date=document.getElementById('sna_date')?.value||'';
    const evalr=document.getElementById('sna_eval')?.value||'';
    const notes=document.getElementById('sna_notes')?.value||'';
    const cand=document.getElementById('sna_candidates')?.value||'';
    const owner=document.getElementById('sna_owner')?.value||'';
    const due=document.getElementById('sna_due')?.value||'';
    return `
      <hr>
      <div class="result-item"><strong>日付/評価者:</strong> ${date} / ${evalr}</div>
      ${notes? `<div class="result-item"><strong>主要不足/コメント:</strong><br>${notes.replace(/\n/g,'<br>')}</div>`:''}
      ${cand? `<div class="result-item"><strong>追加接続候補:</strong> ${cand}</div>`:''}
      ${(owner||due)? `<div class="result-item"><strong>実施担当/期限:</strong> ${owner||'-'} / ${due||'-'}</div>`:''}
      <div class="text-muted">運用: 初回→1か月→3か月毎/重大イベント時。定義カードを配布し、評価者2名で差±1以内を目標。レーダーチャートは別途導入可。</div>
    `;
  }
  reset(){ ['sna_date','sna_eval','sna_notes','sna_candidates','sna_owner','sna_due'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); ['size','div','avail','redun','spof','tie','prox','holes'].forEach(k=>{ const e=document.getElementById(`sna_${k}`); if(e) e.value='0'; }); const r=document.getElementById('snaResult'); if(r) r.style.display='none'; }
}

// -------- CPOT（Critical-Care Pain Observation Tool） --------
class CPOTTool extends BaseTool {
  constructor(){ super('cpot','CPOT（非言語的疼痛評価）','表情/体動/筋緊張/人工呼吸器への同調（または発声）の4項目（各0-2点）'); }
  getIcon(){ return 'fas fa-face-grimace'; }
  renderContent(){
    const sel=(id,opts)=>`<div class=\"form-group\"><label for=\"${id}\">${id}</label><select id=\"${id}\">${opts}</select></div>`;
    const o=(arr)=>arr.map((t,i)=>`<option value=\"${i}\">${i}: ${t}</option>`).join('');
    return `
      <div class="assessment-section">
        <div class="form-row">
          ${sel('表情', o(['リラックス','わずかに緊張/しかめ面','明らかな苦痛表情']))}
          ${sel('体動', o(['静穏/動きなし','わずかな身じろぎ','激しい身動き/抵抗']))}
        </div>
        <div class="form-row">
          ${sel('筋緊張', o(['リラックス','やや緊張','強い緊張/こわばり']))}
          ${sel('呼吸器/発声', o(['同調/発声なし','時々の同調不良/うめき','持続的不穏/叫び']))}
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">採点</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="cpotResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const calc=new CPOTCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>calc.calculate(); el.reset=()=>calc.reset(); return s; }
}
class CPOTCalculator {
  calculate(){
    const ids=['表情','体動','筋緊張','呼吸器/発声'];
    const total = ids.reduce((a,id)=> a + (parseInt(document.getElementById(id)?.value)||0), 0);
    const el=document.getElementById('cpotResult'); if(!el) return;
    const pos = total>=3;
    el.innerHTML = `
      <h3>CPOT結果</h3>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 8</div>
      <div class="alert ${pos?'alert-warning':'alert-success'}">${pos?'疼痛の可能性：鎮痛介入や環境調整を検討':'疼痛の可能性は低い'}</div>`;
    el.style.display='block';
  }
  reset(){ ['表情','体動','筋緊張','呼吸器/発声'].forEach(id=>{ const e=document.getElementById(id); if(e) e.selectedIndex=0; }); const r=document.getElementById('cpotResult'); if(r) r.style.display='none'; }
}

// -------- BPS（Behavioral Pain Scale） --------
class BPSTool extends BaseTool {
  constructor(){ super('bps','BPS（行動疼痛スケール）','挿管患者向け：表情/上肢/人工呼吸器への同調（各1-4点）で3-12点'); }
  getIcon(){ return 'fas fa-person'; }
  renderContent(){
    const sel=(id,opts)=>`<div class=\"form-group\"><label for=\"${id}\">${id}</label><select id=\"${id}\">${opts}</select></div>`;
    const o=(arr)=>arr.map((t,i)=>`<option value=\"${i+1}\">${i+1}: ${t}</option>`).join('');
    return `
      <div class="assessment-section">
        <div class="alert alert-info" style="margin-bottom:8px;">
          挿管下成人ICU患者向け（BPS）。各項目1-4点、合計3-12点で高いほど疼痛が強いと判断。
        </div>
        <div class="form-row">
          ${sel('表情', o(['リラックス','わずかなしかめ面','頻回のしかめ面','持続する苦悶顔']))}
          ${sel('上肢', o(['動きなし','時々の屈曲','頻回の屈曲','抵抗/防御']))}
          ${sel('人工呼吸器への同調', o(['完全に同調','時々の同期不良','頻回の同期不良','抜管しようとする/強い抵抗']))}
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">採点</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="bpsResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <strong>【出典】</strong> Payen JF, et al. Assessing pain in critically ill sedated patients by using a behavioral pain scale. Crit Care Med. 2001;29(12):2258-63. PMID: 11801819
      </div>`;
  }
  render(){ const s=super.render(); const calc=new BPSCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>calc.calculate(); el.reset=()=>calc.reset(); return s; }
}
class BPSCalculator {
  calculate(){
    const ids=['表情','上肢','人工呼吸器への同調'];
    const total = ids.reduce((a,id)=> a + (parseInt(document.getElementById(id)?.value)||1), 0);
    const el=document.getElementById('bpsResult'); if(!el) return;
    const alert = total>5? (total>=9? 'alert-danger':'alert-warning') : 'alert-success';
    const cat = total>5? (total>=9? '重度の疼痛が疑われます':'中等度以上の疼痛が疑われます') : '疼痛の可能性は低い';
    el.innerHTML = `
      <h3>BPS結果</h3>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 12</div>
      <div class="alert ${alert}">${cat}。鎮痛/鎮静の調整と再評価を検討。</div>`;
    el.style.display='block';
  }
  reset(){ ['表情','上肢','人工呼吸器への同調'].forEach(id=>{ const e=document.getElementById(id); if(e) e.selectedIndex=0; }); const r=document.getElementById('bpsResult'); if(r) r.style.display='none'; }
}
