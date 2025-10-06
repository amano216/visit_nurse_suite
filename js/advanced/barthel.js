// Barthel Index（ADL評価）ツール
class ADLAssessmentTool extends BaseTool {
  constructor(){ super('barthel','Barthel Index（ADL評価）','日常生活動作の自立度を評価します。'); }
  getIcon(){ return 'fas fa-walking'; }
  renderContent(){
    return `
      <div class="alert alert-info"><strong>Barthel Index:</strong> ADLの自立度評価（100点満点）</div>
      <div class="adl-items">
        <div class="form-group"><label for="feeding">食事</label><select id="feeding"><option value="0">全介助</option><option value="5">部分介助</option><option value="10">自立</option></select></div>
        <div class="form-group"><label for="bathing">入浴</label><select id="bathing"><option value="0">要介助</option><option value="5">自立</option></select></div>
        <div class="form-group"><label for="grooming">整容</label><select id="grooming"><option value="0">要介助</option><option value="5">自立</option></select></div>
        <div class="form-group"><label for="dressing">更衣</label><select id="dressing"><option value="0">要介助</option><option value="5">部分介助</option><option value="10">自立</option></select></div>
        <div class="form-group"><label for="bowels">便コントロール</label><select id="bowels"><option value="0">失禁状態</option><option value="5">時々失禁</option><option value="10">正常</option></select></div>
        <div class="form-group"><label for="bladder">尿コントロール</label><select id="bladder"><option value="0">失禁状態</option><option value="5">時々失禁</option><option value="10">正常</option></select></div>
        <div class="form-group"><label for="toilet">トイレ動作</label><select id="toilet"><option value="0">要介助</option><option value="5">部分介助</option><option value="10">自立</option></select></div>
        <div class="form-group"><label for="transfers">移乗</label><select id="transfers"><option value="0">不可能</option><option value="5">かなりの介助</option><option value="10">軽度の介助</option><option value="15">自立</option></select></div>
        <div class="form-group"><label for="mobility">移動</label><select id="mobility"><option value="0">不可能</option><option value="5">車椅子</option><option value="10">杖歩行</option><option value="15">自立歩行</option></select></div>
        <div class="form-group"><label for="stairs">階段昇降</label><select id="stairs"><option value="0">不可能</option><option value="5">要介助</option><option value="10">自立</option></select></div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="barthelResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <strong>【出典】</strong> Md State Med J. 1965;14:61-5 ほか
      </div>`;
  }
  render(){ const s=super.render(); const calc=new BarthelCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>calc.calculate(); el.reset=()=>calc.reset(); return s; }
}
class BarthelCalculator {
  calculate(){
    const items=['feeding','bathing','grooming','dressing','bowels','bladder','toilet','transfers','mobility','stairs'];
    let total=0; const scores={}; items.forEach(id=>{ const el=document.getElementById(id); if(el){ const v=parseInt(el.value)||0; scores[id]=v; total+=v; } });
    this.displayResult(total,scores);
  }
  displayResult(totalScore,scores){ const r=document.getElementById('barthelResult'); if(!r) return; let label,reco,klass; if(totalScore>=85){ label='自立（85~100点）'; reco='現在の機能維持の支援'; klass='alert-success'; } else if(totalScore>=60){ label='部分自立（60~84点）'; reco='部分介助＋リハ継続'; klass='alert-info'; } else if(totalScore>=40){ label='大部分介助（40~59点）'; reco='日常介助＋ADL改善介入'; klass='alert-warning'; } else { label='全介助（0~39点）'; reco='包括的介護サービス'; klass='alert-danger'; }
    const itemNames={ feeding:'食事', bathing:'入浴', grooming:'整容', dressing:'更衣', bowels:'便コントロール', bladder:'尿コントロール', toilet:'トイレ動作', transfers:'移乗', mobility:'移動', stairs:'階段昇降' };
    let itemsHTML=''; Object.keys(scores).forEach(k=>{ itemsHTML+=`<div class="result-item"><strong>${itemNames[k]}:</strong> ${scores[k]}点</div>`; });
    r.innerHTML=`<h3>Barthel Index評価結果</h3>${itemsHTML}<div class="result-item"><strong>総スコア:</strong> <span class="highlight">${totalScore}/100点</span></div><div class="alert ${klass}"><strong>自立度:</strong> ${label}<br><strong>推奨:</strong> ${reco}</div>`; r.style.display='block'; }
  reset(){ ['feeding','bathing','grooming','dressing','bowels','bladder','toilet','transfers','mobility','stairs'].forEach(id=>{ const e=document.getElementById(id); if(e) e.selectedIndex=0; }); const r=document.getElementById('barthelResult'); if(r) r.style.display='none'; }
}
