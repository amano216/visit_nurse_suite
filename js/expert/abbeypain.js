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
