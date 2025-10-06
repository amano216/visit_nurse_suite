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
