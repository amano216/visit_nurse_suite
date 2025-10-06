// -------- Beers Criteria（参考チェック） --------
class BeersTool extends BaseTool {
  constructor(){ super('beers','Beers Criteria（参考）','高齢者の潜在的不適切処方の参考。公式基準の転載ではありません。'); }
  getIcon(){ return 'fas fa-book-medical'; }
  renderContent(){
    const item=(id,txt)=>`<div class="form-group"><label><input type="checkbox" id="${id}"> ${txt}</label></div>`;
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
