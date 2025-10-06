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
