// -------- SNA-Lite（3分版：ネットワーク簡易スコア） --------
class SNALiteTool extends BaseTool {
  constructor(){ super('snalite','SNA-Lite（ネットワーク3分評価）','マップに添える簡易スコア：8項目×0/1/2で合計、介入の優先度を明示。任意で重み付きRを算出。'); }
  getIcon(){ return 'fas fa-network-wired'; }
  renderContent(){
    const items=[
      {k:'size', label:'規模（Size）', help:'定期連絡または即応が期待できる人・資源の人数：0=6人以上/1=3–5人/2=0–2人'},
      {k:'div', label:'多様性（Diversity）', help:'家族・友人・近隣・福祉/医療・地域/ボラ等の種類数：0=4種類以上/1=2–3/2=0–1'},
      {k:'avail', label:'即応可能性（Availability）', help:'困った時に当日中に動ける人・資源：0=3以上/1=1–2/2=0'},
      {k:'redun', label:'代替性（Redundancy）', help:'主要タスクごとに代役がもう1人：0=3領域以上/1=1–2/2=0'},
      {k:'spof', label:'結節点依存（Single Point of Failure）', help:'同一人物に過度集中：0=分散/1=やや集中/2=1人に依存'},
      {k:'tie', label:'関係強度（Tie Strength）', help:'週1以上のやり取り：0=3以上/1=1–2/2=0'},
      {k:'prox', label:'地理的近接（Proximity）', help:'30分以内で駆けつけ可：0=3以上/1=1–2/2=0'},
      {k:'holes', label:'空白領域（Structural Holes）', help:'孤立ノード/未接続小島：0=目立たない/1=少し/2=顕著'}
    ];
    const opts='<option value="0">0 良好</option><option value="1">1 注意</option><option value="2">2 リスク</option>';
    const rows = items.map((it,i)=>`
      <tr>
        <td>${i+1}</td>
        <td>${it.label}<div class="subtext">${it.help}</div></td>
        <td><select id="sna_${it.k}">${opts}</select></td>
      </tr>
    `).join('');
    return `
      <div class="form-row">
        <div class="form-group"><label>評価日</label><input type="date" id="sna_date" class="input"></div>
        <div class="form-group"><label>評価者</label><input type="text" id="sna_eval" class="input" placeholder="氏名"></div>
      </div>
      <div class="table-responsive"><table class="table"><thead><tr><th>#</th><th>項目</th><th>0/1/2</th></tr></thead><tbody>${rows}</tbody></table></div>
      <div class="form-row">
        <div class="form-group"><label><input type="checkbox" id="sna_weighted"> 重み付きR（＋1分）を計算する</label></div>
      </div>
      <div class="form-group"><label>主要不足/コメント</label><textarea id="sna_notes" class="input" rows="2" placeholder="例：即応・近接が不足。30分圏内の駆けつけ資源を開拓"></textarea></div>
      <div class="form-row">
        <div class="form-group"><label>追加接続候補（3件）</label><input id="sna_candidates" class="input" placeholder="例：自治会/民生委員/訪看オンコール"></div>
        <div class="form-group"><label>実施担当</label><input id="sna_owner" class="input" placeholder="担当者"></div>
        <div class="form-group"><label>期限</label><input type="date" id="sna_due" class="input"></div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calc()">集計</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="snaResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new SNALiteCalculator(); const el=s.querySelector('.calculator-instance'); el.calc=()=>c.calc(); el.reset=()=>c.reset(); return s; }
}
class SNALiteCalculator {
  weights(){ return { size:1.0, div:1.2, avail:1.5, redun:1.5, spof:1.3, tie:1.2, prox:1.3, holes:1.0 }; }
  getScores(){
    const keys=['size','div','avail','redun','spof','tie','prox','holes'];
    const scores={}; keys.forEach(k=> scores[k]= parseInt(document.getElementById(`sna_${k}`)?.value)||0 );
    return scores;
  }
  calc(){
    const scores=this.getScores();
    const total = Object.values(scores).reduce((a,b)=>a+b,0);
    const level = total<=3? '低' : total<=7? '中' : total<=11? '高' : '極高（即介入）';
    const weighted = document.getElementById('sna_weighted')?.checked;
    let R=null, Rlabel='';
    if(weighted){ const w=this.weights(); R = Object.entries(scores).reduce((s,[k,v])=> s + v * w[k], 0);
      Rlabel = R<6? '低' : R<12? '中' : R<19? '高' : '極高（連携会議で合意）'; }
    const el=document.getElementById('snaResult'); if(!el) return;
    el.innerHTML = `
      <h3>SNA-Lite 集計</h3>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 16（判定: ${level}）</div>
      ${R!==null ? `<div class="result-item"><strong>重み付きR:</strong> <span class="highlight">${R.toFixed(1)}</span>（判定: ${Rlabel}）</div>`:''}
      ${this.interventions(scores,total)}
      ${this.footer()}
    `;
    el.style.display='block';
  }
  interventions(s,t){
    const tips=[];
    if(t>=8) tips.push('即日〜1週で不足の種類を埋める（近隣/自治会・配食・訪看・デイ・ボランティア等の新規接続）');
    if(s.redun===2 || s.spof===2) tips.push('代替性/結節点依存: バックアップ人材を最低1名ずつ追加');
    if(s.avail===2) tips.push('即応可能性: 緊急連絡網の即応者を3名体制へ（家族・近隣・専門職）');
    if(s.prox===2) tips.push('地理的近接: 30分圏の“駆けつけ資源”を確保（地域包括・民生委員・訪看オンコール）');
    if(s.holes===2) tips.push('空白領域: 連携会議で“島”をつなぐ連絡役（ケアマネ/看護/地域）を指名');
    return tips.length? `<div class="result-item"><strong>介入マップ:</strong><br>${tips.map(x=>'・'+x).join('<br>')}</div>`:'';
  }
  footer(){
    const date=document.getElementById('sna_date')?.value||'';
    const evalr=document.getElementById('sna_eval')?.value||'';
    const notes=document.getElementById('sna_notes')?.value||'';
    const cand=document.getElementById('sna_candidates')?.value||'';
    const owner=document.getElementById('sna_owner')?.value||'';
    const due=document.getElementById('sna_due')?.value||'';
    return `
      <hr>
      <div class="result-item"><strong>日付/評価者:</strong> ${date} / ${evalr}</div>
      ${notes? `<div class="result-item"><strong>主要不足/コメント:</strong><br>${notes.replace(/\n/g,'<br>')}</div>`:''}
      ${cand? `<div class="result-item"><strong>追加接続候補:</strong> ${cand}</div>`:''}
      ${(owner||due)? `<div class="result-item"><strong>実施担当/期限:</strong> ${owner||'-'} / ${due||'-'}</div>`:''}
      <div class="text-muted">運用: 初回→1か月→3か月毎/重大イベント時。定義カードを配布し、評価者2名で差±1以内を目標。レーダーチャートは別途導入可。</div>
    `;
  }
  reset(){ ['sna_date','sna_eval','sna_notes','sna_candidates','sna_owner','sna_due'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); ['size','div','avail','redun','spof','tie','prox','holes'].forEach(k=>{ const e=document.getElementById(`sna_${k}`); if(e) e.value='0'; }); const r=document.getElementById('snaResult'); if(r) r.style.display='none'; }
}
