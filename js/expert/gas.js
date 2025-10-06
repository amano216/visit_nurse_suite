// -------- GAS（Goal Attainment Scaling） --------
class GASTool extends BaseTool {
  constructor(){ super('gas','GAS（Goal Attainment Scaling）','個別目標の達成度を-2～+2で評価し、合算（Tスコア）で客観化。'); }
  getIcon(){ return 'fas fa-bullseye'; }
  renderContent(){
    return `
      <div class="form-group">
        <button class="btn btn-secondary" type="button" onclick="this.parentElement.parentElement.querySelector('.calculator-instance').addRow()"><i class="fas fa-plus"></i> 目標を追加</button>
      </div>
      <div class="table-responsive">
        <table class="table" id="gasTable">
          <thead><tr><th>目標</th><th>重み</th><th>達成度</th><th>操作</th></tr></thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="alert alert-info">達成度の定義: +2 期待をはるかに超える / +1 期待を上回る / 0 期待通り / -1 期待を下回る / -2 はるかに下回る</div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calc()">集計</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="gasResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new GASCalculator(); const el=s.querySelector('.calculator-instance'); el.addRow=()=>c.addRow(); el.calc=()=>c.calc(); el.reset=()=>c.reset(); // 初期行
    c.addRow('例: 1日1回は椅子から自力で立ち上がる',1,0);
    return s; }
}
class GASCalculator {
  rowTemplate(goal='',w=1,score=0){
    const options=[-2,-1,0,1,2].map(v=>`<option value="${v}" ${v===score?'selected':''}>${v}</option>`).join('');
    return `<tr>
      <td><input type="text" class="input" placeholder="目標を記入" value="${goal}"></td>
      <td><input type="number" class="input" min="0" step="0.1" value="${w}"></td>
      <td><select class="input">${options}</select></td>
      <td><button class="btn btn-sm btn-danger" type="button">削除</button></td>
    </tr>`;
  }
  addRow(goal='',w=1,score=0){
    const tbody=document.querySelector('#gasTable tbody'); if(!tbody) return;
    const temp=document.createElement('tbody'); temp.innerHTML=this.rowTemplate(goal,w,score); const tr=temp.firstElementChild;
    tr.querySelector('button').addEventListener('click',()=>tr.remove());
    tbody.appendChild(tr);
  }
  calc(){
    const tbody=document.querySelector('#gasTable tbody'); if(!tbody) return;
    const rows=[...tbody.querySelectorAll('tr')];
    if(rows.length===0){ this.addRow(); return; }
    let sumWX=0, sumW2=0; const details=[];
    rows.forEach(tr=>{
      const goal=tr.cells[0].querySelector('input')?.value?.trim()||'(未記入)';
      const w=parseFloat(tr.cells[1].querySelector('input')?.value)||0;
      const x=parseInt(tr.cells[2].querySelector('select')?.value)||0;
      sumWX += w * x; sumW2 += w * w; details.push({goal,w,x});
    });
    const tscore = sumW2>0 ? 50 + (10 * sumWX) / Math.sqrt(sumW2) : 50;
    const el=document.getElementById('gasResult'); if(!el) return;
    const high = details.filter(d=>d.x<=-1 || d.w>=2);
    el.innerHTML = `
      <h3>GAS 集計</h3>
      <div class="result-item"><strong>Σ(w×x):</strong> ${sumWX.toFixed(2)}</div>
      <div class="result-item"><strong>Tスコア:</strong> <span class="highlight">${tscore.toFixed(1)}</span>（50で期待どおり、>50で期待超過）</div>
      ${high.length? `<div class="alert alert-warning"><strong>重点フォロー:</strong> ${high.map(h=>`${h.goal}（w${h.w}, x${h.x}）`).join('、')}</div>`: ''}
    `;
    el.style.display='block';
  }
  reset(){ const tbody=document.querySelector('#gasTable tbody'); if(tbody){ tbody.innerHTML=''; } const r=document.getElementById('gasResult'); if(r) r.style.display='none'; }
}
