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
