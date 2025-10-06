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
