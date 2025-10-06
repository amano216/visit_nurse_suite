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
