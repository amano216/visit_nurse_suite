// -------- STOPP/START（参考チェック） --------
class STOPPSTARTTool extends BaseTool {
  constructor(){ super('stoppstart','STOPP/START（高齢者処方・参考）','自施設の最新版に基づく処方適正チェックの補助。公式基準の要約ではありません。'); }
  getIcon(){ return 'fas fa-prescription-bottle-medical'; }
  renderContent(){
    const item=(id,txt)=>`<div class="form-group"><label><input type="checkbox" id="${id}"> ${txt}</label></div>`;
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
