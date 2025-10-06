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
