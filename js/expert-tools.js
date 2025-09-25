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
class ABCDStomaTool extends BaseTool {
  constructor(){ super('abcdstoma','ABCD-Stoma評価','装具適合・体表・皮膚状態・位置/動きの4観点からケア提案（参考）。'); }
  getIcon(){ return 'fas fa-toilet'; }
  renderContent(){
    const chk=(id,t)=>`<div class=\"form-group\"><label><input type=\"checkbox\" id=\"${id}\"> ${t}</label></div>`;
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-shield-alt"></i> A: Appliance（装具適合）</h4>
        ${chk('aLeak','漏れ/周囲の滲出あり')} ${chk('aCut','開口サイズが合っていない')} ${chk('aWear','装具の装着期間が短い（<3日）')}
        <h4><i class="fas fa-user"></i> B: Body（体表/突出）</h4>
        ${chk('bFlat','平坦/陥没ストーマ')} ${chk('bCrease','しわ/溝/瘢痕が近接')} ${chk('bFold','腹部の屈曲で浮きやすい')}
        <h4><i class="fas fa-heart"></i> C: Condition（皮膚状態）</h4>
        ${chk('cIrr','発赤/びらん/掻痒')} ${chk('cFungal','カンジダ様衛星病変')} ${chk('cTrauma','機械的損傷')}
        <h4><i class="fas fa-arrows-alt"></i> D: Dynamics（位置/動き）</h4>
        ${chk('dNear','皺/臍/創部に近接')} ${chk('dSport','活動量が多く剥がれやすい')} ${chk('dSweat','発汗が多い')}
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').suggest()">提案を表示</button>
      <div id="abcdResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const inst=new ABCDStomaHelper(); const el=s.querySelector('.calculator-instance'); el.suggest=()=>inst.suggest(); return s; }
}
class ABCDStomaHelper {
  suggest(){
    const on=id=> document.getElementById(id)?.checked;
    const rec=[];
    if(on('aLeak')||on('aCut')) rec.push('開口サイズの再測定とテンプレート更新、皮膚保護剤の見直し');
    if(on('aWear')) rec.push('耐久性の高い装具/アクセサリで装着期間を延長（目標3-5日）');
    if(on('bFlat')) rec.push('コンベックスやベルト、埋め込みリング/ペーストで平坦部を補正');
    if(on('bCrease')||on('bFold')) rec.push('しわ方向に沿ったカット、パテ充填/フォームリングで隙間を封止');
    if(on('cIrr')) rec.push('刺激の回避と保護（スキンバリア、皮膚洗浄と乾燥の徹底）');
    if(on('cFungal')) rec.push('抗真菌パウダーの検討（医師指示のもと）');
    if(on('cTrauma')) rec.push('剥離時の保護剤/リムーバー使用とテクニック見直し');
    if(on('dNear')) rec.push('プレカットの形状調整/フレキシブル装具');
    if(on('dSport')||on('dSweat')) rec.push('固定力強化：ベルト/テープ/周囲保護フィルム、発汗時の貼付タイミング調整');
    const msg = rec.length? rec.map(s=>`<li>${s}</li>`).join('') : '<li>大きな問題は見当たりません。現行ケアの継続を。</li>';
    const el=document.getElementById('abcdResult');
    el.innerHTML=`<h3>ABCD-Stoma 提案</h3><ul>${msg}</ul><small>本結果は参考情報です。個別の臨床判断と自施設手順を優先してください。</small>`;
    el.style.display='block';
  }
}

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
    el.innerHTML = `
      <h3>OME/BT換算結果</h3>
      <div class="result-item"><strong>ベース薬剤/用量:</strong> ${drugText} ${dose} ${drug==='fentanyl_td'?'mcg/h':'mg/日'}</div>
      <div class="result-item"><strong>OME（経口モルヒネ換算）:</strong> <span class="highlight">${ome.toFixed(1)}</span> mg/日</div>
      <div class="result-item"><strong>BT目安 (${pct}%/回):</strong> ${btOme.toFixed(1)} mg OME/回</div>
      <div class="result-item"><strong>換算（${rescueText}）:</strong> <span class="highlight">約 ${btRescue}</span> mg/回</div>
      <div class="alert alert-info">注意：併用薬/腎機能/高齢者/せん妄などで減量が必要な場合があります。臨床状況に応じて調整してください。</div>
    `;
    el.style.display='block';
  }
  reset(){ ['omeDose'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); const s1=document.getElementById('omeDrug'); if(s1) s1.selectedIndex=0; const s2=document.getElementById('omeRescue'); if(s2) s2.selectedIndex=0; const p=document.getElementById('omeBtPct'); if(p) p.value=10; const r=document.getElementById('omeResult'); if(r) r.style.display='none'; }
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
        <div class="form-row">
          ${sel('表情', o(['リラックス','わずかなしかめ面','頻回のしかめ面','持続する苦悶顔']))}
          ${sel('上肢', o(['動きなし','時々の屈曲','頻回の屈曲','抵抗/防御']))}
          ${sel('人工呼吸器への同調', o(['完全に同調','時々の同期不良','頻回の同期不良','抜管しようとする/強い抵抗']))}
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">採点</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="bpsResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
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
