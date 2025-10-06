// -------- 卒業判定（みのり） --------
class MinoriGraduationTool extends BaseTool {
  constructor(){ super('minori','卒業判定（みのり）','みのり訪問看護ステーションの卒業基準（5項目×0-4点、合計20点）で判定します。'); }
  getIcon(){ return 'fas fa-graduation-cap'; }
  renderContent(){
    const opt = (pairs) => pairs.map(([v,t])=>`<option value="${v}">${v}: ${t}</option>`).join('');
    return `
      <div class="alert alert-info">
        <strong>判定基準:</strong> 15点未満: 卒業不可 / 15–17点: 卒業予備群 / 18点以上: 卒業基準該当者
      </div>
      <div class="form-group">
        <label for="minoriSelfEfficacy">自己効力感（自分でできる自信）</label>
        <select id="minoriSelfEfficacy">
          ${opt([[0,'ほぼ自分では無理。服薬・症状・連絡を他者任せ'],[1,'一部はできるが不安が強い。毎回支援が必要'],[2,'指示があれば実行できる。自発は少ない'],[3,'多くは自分で実行。時々助言が必要'],[4,'服薬・症状対応・受診連絡を自信を持って自立実行']])}
        </select>
      </div>
      <div class="form-group">
        <label for="minoriCoping">対処能力（悪化時の行動計画）</label>
        <select id="minoriCoping">
          ${opt([[0,'悪化サインが分からず、誰に連絡するか不明'],[1,'サインは曖昧。連絡先を思い出せないことが多い'],[2,'サインは説明可だが行動が遅れる/抜ける'],[3,'Teach-Backで行動手順を説明できる（一次連絡先まで）'],[4,'サイン説明＋一次/二次連絡先・受診先を即答し、最近1回は実際に実行']])}
        </select>
      </div>
      <div class="form-group">
        <label for="minoriPhysical">身体機能（移動と日常）</label>
        <select id="minoriPhysical">
          ${opt([[0,'室内移動・基本ADLに全介助または転倒多発'],[1,'室内は介助/歩行不安定。トイレ移動に見守り必須'],[2,'室内は見守りで可。屋外は不可/危険'],[3,'室内自立・屋外は短距離または補助具で可。転倒0'],[4,'室内外とも自立（補助具可）。直近1か月転倒0']])}
        </select>
      </div>
      <div class="form-group">
        <label for="minoriMental">精神・認知の安定</label>
        <select id="minoriMental">
          ${opt([[0,'著しい不穏/うつ状態/見当識障害。意思決定困難'],[1,'不安・抑うつ強く、日常行動に支障あり'],[2,'軽度の不安/抑うつ。日常は概ね可能'],[3,'安定。必要な判断・記憶は保たれている（PHQ-2<3相当）'],[4,'安定を3か月維持。意思決定・記憶・注意の支障なし']])}
        </select>
      </div>
      <div class="form-group">
        <label for="minoriSocial">社会参加・支援線（見守り2線）</label>
        <select id="minoriSocial">
          ${opt([[0,'外出/参加0回。支援線なし'],[1,'2か月に1回程度の外出。支援線1者のみ不安定'],[2,'月1回の参加（支援多め）。支援線2者だが手段曖昧'],[3,'月1回自発参加。支援線2者・手段明確'],[4,'月2回以上/役割参加あり。支援線2者以上・手段/優先順明確']])}
        </select>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="minoriResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new MinoriGraduationCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}

class MinoriGraduationCalculator {
  calculate(){
    const vals = {
      self: parseInt(document.getElementById('minoriSelfEfficacy')?.value)||0,
      coping: parseInt(document.getElementById('minoriCoping')?.value)||0,
      physical: parseInt(document.getElementById('minoriPhysical')?.value)||0,
      mental: parseInt(document.getElementById('minoriMental')?.value)||0,
      social: parseInt(document.getElementById('minoriSocial')?.value)||0,
    };
    const total = Object.values(vals).reduce((a,b)=>a+b,0);
    let label='継続、卒業不可', alert='alert-danger';
    if (total>=18){ label='卒業基準該当者'; alert='alert-success'; }
    else if (total>=15){ label='卒業予備群'; alert='alert-warning'; }
    const el=document.getElementById('minoriResult');
    if (!el) return;
    el.innerHTML = `
      <h3>卒業判定（みのり）</h3>
      <div class="result-item"><strong>自己効力感:</strong> ${vals.self} 点</div>
      <div class="result-item"><strong>対処能力:</strong> ${vals.coping} 点</div>
      <div class="result-item"><strong>身体機能:</strong> ${vals.physical} 点</div>
      <div class="result-item"><strong>精神・認知:</strong> ${vals.mental} 点</div>
      <div class="result-item"><strong>社会参加・支援線:</strong> ${vals.social} 点</div>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 20 点</div>
      <div class="alert ${alert}"><strong>判定:</strong> ${label}</div>
    `;
    el.style.display='block';
  }
  reset(){
    ['minoriSelfEfficacy','minoriCoping','minoriPhysical','minoriMental','minoriSocial'].forEach(id=>{ const e=document.getElementById(id); if(e) e.selectedIndex=0; });
    const el=document.getElementById('minoriResult'); if(el) el.style.display='none';
  }
}
