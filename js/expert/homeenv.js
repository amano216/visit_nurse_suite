// -------- 在宅環境チェックリスト --------
class HomeEnvTool extends BaseTool {
  constructor(){ super('homeenv','在宅環境チェックリスト','転倒・バリアフリー・衛生・緊急対応などを3段階で評価（0良好/1改善/2危険）。'); }
  getIcon(){ return 'fas fa-house-chimney'; }
  renderContent(){
    const items=[
      {cat:'転倒',label:'玄関・通路の段差がある',tip:'段差解消スロープ・手すり設置を検討'},
      {cat:'転倒',label:'夜間照明が不十分',tip:'ナイトライトの設置'},
      {cat:'転倒',label:'浴室/トイレに手すりがない',tip:'L型手すりや立ち座り支援具'},
      {cat:'転倒',label:'床が滑りやすい/散乱物が多い',tip:'ノンスリップマット/動線の整理'},
      {cat:'転倒',label:'敷物・コードの固定なし',tip:'コードの結束/滑り止めシート'},
      {cat:'バリア',label:'出入口や通路の幅が車いすに不十分',tip:'家具配置の見直し'},
      {cat:'バリア',label:'ベッド/トイレ高さが不適合',tip:'高さ調整/置台'},
      {cat:'衛生',label:'換気不良・カビ/害虫の問題',tip:'換気・清掃/専門業者相談'},
      {cat:'安全',label:'火災/ガス/CO警報器未設置',tip:'警報器の設置・点検'},
      {cat:'安全',label:'緊急連絡先の掲示がない',tip:'目につく場所へ掲示/家族連絡網'},
      {cat:'備え',label:'救急セットや常備薬が整っていない',tip:'救急箱整備/リスト更新'},
      {cat:'防災',label:'家具の固定・転倒防止が不十分',tip:'耐震固定/落下対策'},
    ];
    const options = `<option value="0">0 良好</option><option value="1">1 改善</option><option value="2">2 危険</option>`;
    const rows = items.map((it,i)=>`<tr><td>${it.cat}</td><td>${it.label}</td><td><select id="home_${i}">${options}</select></td></tr>`).join('');
    return `
      <div class="table-responsive"><table class="table"><thead><tr><th>カテゴリ</th><th>項目</th><th>評価</th></tr></thead><tbody>${rows}</tbody></table></div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calc()">集計</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="homeEnvResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new HomeEnvCalculator(); const el=s.querySelector('.calculator-instance'); el.calc=()=>c.calc(); el.reset=()=>c.reset(); return s; }
}
class HomeEnvCalculator {
  calc(){
    const labels=[
      ['転倒','玄関・通路の段差がある','段差解消スロープ・手すり設置を検討'],
      ['転倒','夜間照明が不十分','ナイトライトの設置'],
      ['転倒','浴室/トイレに手すりがない','L型手すりや立ち座り支援具'],
      ['転倒','床が滑りやすい/散乱物が多い','ノンスリップマット/動線の整理'],
      ['転倒','敷物・コードの固定なし','コードの結束/滑り止めシート'],
      ['バリア','出入口や通路の幅が車いすに不十分','家具配置の見直し'],
      ['バリア','ベッド/トイレ高さが不適合','高さ調整/置台'],
      ['衛生','換気不良・カビ/害虫の問題','換気・清掃/専門業者相談'],
      ['安全','火災/ガス/CO警報器未設置','警報器の設置・点検'],
      ['安全','緊急連絡先の掲示がない','目につく場所へ掲示/家族連絡網'],
      ['備え','救急セットや常備薬が整っていない','救急箱整備/リスト更新'],
      ['防災','家具の固定・転倒防止が不十分','耐震固定/落下対策']
    ];
    const scores = labels.map((_,i)=> parseInt(document.getElementById(`home_${i}`)?.value)||0);
    const total = scores.reduce((a,b)=>a+b,0);
    const cats = {};
    labels.forEach((l,i)=>{ cats[l[0]]=(cats[l[0]]||0)+scores[i]; });
    const highIdx = scores.map((v,i)=> v===2? i : -1).filter(i=>i>=0);
    const el=document.getElementById('homeEnvResult'); if(!el) return;
    const riskClass = total>=10? 'alert-danger' : (total>=5? 'alert-warning' : 'alert-info');
    const catStr = Object.entries(cats).map(([k,v])=>`${k}:${v}`).join(' / ');
    const tips = highIdx.map(i=>`・${labels[i][1]} → 推奨: ${labels[i][2]}`).join('<br>');
    el.innerHTML = `
      <h3>在宅環境 集計</h3>
      <div class="result-item"><strong>総リスクスコア:</strong> <span class="highlight">${total}</span>（カテゴリ内訳: ${catStr}）</div>
      ${highIdx.length? `<div class="alert ${riskClass}"><strong>緊急/優先改善:</strong><br>${tips}</div>` : `<div class="alert ${riskClass}">大きな危険は見られません</div>`}
    `;
    el.style.display='block';
  }
  reset(){ for(let i=0;i<12;i++){ const e=document.getElementById(`home_${i}`); if(e) e.value='0'; } const r=document.getElementById('homeEnvResult'); if(r) r.style.display='none'; }
}
