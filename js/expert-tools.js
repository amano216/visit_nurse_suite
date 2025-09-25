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
        <div class="form-group"><label for="crclScr">血清クレアチニン(mg/dL)</label><input type="number" id="crclScr" step="0.01" min="0.1"></div>
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
    if (age<=0||wt<=0||scr<=0) return this.err('年齢・体重・Crを入力してください。');
    let crcl=((140-age)*wt)/(72*scr); if (sex==='female') crcl*=0.85;
    const el=document.getElementById('crclResult'); const cat=crcl<30?'高度低下':(crcl<60?'中等度低下':'軽度〜正常'); const alert=crcl<60?'alert-warning':'alert-success';
    el.innerHTML=`<h3>Cockcroft-Gault</h3><div class="result-item"><strong>CrCl:</strong> <span class="highlight">${crcl.toFixed(1)}</span> mL/min</div><div class="alert ${alert}">腎機能: ${cat}</div>`; el.style.display='block';
  }
  err(m){ const el=document.getElementById('crclResult'); el.innerHTML=`<div class="alert alert-danger">${m}</div>`; el.style.display='block'; }
  reset(){ ['crclAge','crclSex','crclWeight','crclScr'].forEach(id=>{const e=document.getElementById(id); if(!e) return; if(e.tagName==='SELECT') e.selectedIndex=0; else e.value='';}); const r=document.getElementById('crclResult'); if(r) r.style.display='none'; }
}

// -------- Delirium Quick (4項) --------
class Delirium4Tool extends BaseTool {
  constructor(){ super('delirium4','急性意識障害スクリーニング（4項）','覚醒、時間場所見当、注意、急性変化の4項を点数化します。'); }
  getIcon(){ return 'fas fa-bed'; }
  renderContent(){
    return `
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
    const opt = id => `<div class=\"form-group\"><label for=\"${id}\">${id}</label><select id=\"${id}\"><option value=\"0\">0: なし</option><option value=\"1\">1: 中等度</option><option value=\"2\">2: 高度</option></select></div>`;
    return `
      <div class="form-row">${opt('筋力低下')}${opt('歩行補助')}${opt('椅子立ち上がり')}</div>
      <div class="form-row">${opt('階段昇降困難')}${opt('転倒歴')}</div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <div id="sarcfResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new SARCFCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); return s; }
}
class SARCFCalculator { calculate(){ const ids=['筋力低下','歩行補助','椅子立ち上がり','階段昇降困難','転倒歴']; const total=ids.reduce((a,id)=> a + (parseInt(document.getElementById(id)?.value)||0),0); const el=document.getElementById('sarcfResult'); const pos= total>=4; el.innerHTML=`<h3>SARC-F</h3><div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 10</div><div class="alert ${pos?'alert-warning':'alert-success'}">${pos?'サルコペニアの可能性あり':'可能性は低い'}</div>`; el.style.display='block'; } }

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
      <div class="form-group"><label><input type="checkbox" id="mustAcute"> 急性疾患により>5日間の経口摂取不能</label></div>
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
    let bmiScore=0; if (bmi<18.5) bmiScore=2; else if (bmi<20) bmiScore=1;
    const loss=((pw-w)/pw)*100; let lossScore=0; if (loss>10) lossScore=2; else if (loss>=5) lossScore=1;
    const acuteScore=acute?2:0; const total=bmiScore+lossScore+acuteScore;
    let risk='低'; let alert='alert-success'; if (total>=2){ risk='高'; alert='alert-danger'; } else if (total===1){ risk='中'; alert='alert-warning'; }
    const el=document.getElementById('mustResult');
    el.innerHTML=`<h3>MUST</h3>
      <div class="result-item"><strong>BMI:</strong> ${bmi.toFixed(1)}（スコア ${bmiScore}）</div>
      <div class="result-item"><strong>体重減少:</strong> ${loss.toFixed(1)}%（スコア ${lossScore}）</div>
      <div class="result-item"><strong>急性疾患効果:</strong> スコア ${acuteScore}</div>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span></div>
      <div class="alert ${alert}"><strong>栄養リスク:</strong> ${risk}</div>`;
    el.style.display='block';
  }
  err(m){ const el=document.getElementById('mustResult'); el.innerHTML=`<div class="alert alert-danger">${m}</div>`; el.style.display='block'; }
  reset(){ ['mustHeight','mustWeight','mustPrevWeight'].forEach(id=>{const e=document.getElementById(id); if(e) e.value='';}); const c=document.getElementById('mustAcute'); if(c) c.checked=false; const r=document.getElementById('mustResult'); if(r) r.style.display='none'; }
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
    el.innerHTML=`<h3>A-DROP結果</h3>
      <div class="result-item"><strong>スコア:</strong> <span class="highlight">${score}</span> / 5（${risk}）</div>
      <div class="result-item"><strong>該当:</strong> A:${aPos?'1':'0'} D:${dPos?'1':'0'} R:${rPos?'1':'0'} O:${oPos?'1':'0'} P:${pPos?'1':'0'}</div>
      <div class="alert ${alert}">在宅での対応可否を検討。中等症以上は医師連絡・受診/入院評価を推奨。</div>`;
    el.style.display='block';
  }
  reset(){ ['adAge','adBun','adSpO2','adPaO2','adSBP'].forEach(id=>{const e=document.getElementById(id); if(e) e.value='';}); ['adDehydration','adConfusion'].forEach(id=>{const e=document.getElementById(id); if(e) e.checked=false;}); const s=document.getElementById('adSex'); if(s) s.selectedIndex=0; const r=document.getElementById('adropResult'); if(r) r.style.display='none'; }
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
        <div class="form-row">
          <div class="form-group"><label><input type="checkbox" id="cciAgeUse"> 年齢ポイントを加算する</label></div>
          <div class="form-group"><label for="cciAge">年齢</label><input type="number" id="cciAge" min="0" max="120" placeholder="例: 78"></div>
        </div>
        <small>年齢点の目安：50-59:+1, 60-69:+2, 70-79:+3, 80以上:+4（参考）</small>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">計算</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="cciResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new CharlsonCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class CharlsonCalculator {
  agePoint(age){ if (age>=80) return 4; if (age>=70) return 3; if (age>=60) return 2; if (age>=50) return 1; return 0; }
  calculate(){
    const ids=['cciMI','cciCHF','cciPVD','cciCVD','cciDementia','cciCOPD','cciCTD','cciUlcer','cciLiverMild','cciDM','cciDMC','cciHemiplegia','cciRenal','cciCancer','cciLeukemia','cciLymphoma','cciLiverSev','cciMets','cciAIDS'];
    const total = ids.reduce((a,id)=> a + ((document.getElementById(id)?.checked? parseInt(document.getElementById(id).value):0) ),0);
    const useAge = document.getElementById('cciAgeUse')?.checked||false; const age=parseInt(document.getElementById('cciAge')?.value)||0; const ap = useAge? this.agePoint(age):0; const sum = total + ap;
    const el=document.getElementById('cciResult');
    el.innerHTML=`<h3>Charlson CCI</h3>
      <div class="result-item"><strong>疾患合計:</strong> ${total}</div>
      <div class="result-item"><strong>年齢点:</strong> ${ap}</div>
      <div class="result-item"><strong>合計スコア:</strong> <span class="highlight">${sum}</span></div>
      <div class="alert ${sum>=6?'alert-danger':(sum>=3?'alert-warning':'alert-info')}">高スコアほど予後不良リスクが高い可能性（施設方針/主治医の判断を優先）。</div>`;
    el.style.display='block';
  }
  reset(){ ['cciAgeUse','cciMI','cciCHF','cciPVD','cciCVD','cciDementia','cciCOPD','cciCTD','cciUlcer','cciLiverMild','cciDM','cciDMC','cciHemiplegia','cciRenal','cciCancer','cciLeukemia','cciLymphoma','cciLiverSev','cciMets','cciAIDS'].forEach(id=>{ const e=document.getElementById(id); if(!e) return; if(e.type==='checkbox') e.checked=false; else e.value=''; }); const r=document.getElementById('cciResult'); if(r) r.style.display='none'; }
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
