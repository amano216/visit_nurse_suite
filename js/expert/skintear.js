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
