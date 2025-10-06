// -------- ソーシャルネットワーク・マッピング（簡易スコア） --------
class SocialNetworkTool extends BaseTool {
  constructor(){ super('socnet','ソーシャルネットワーク・マッピング','関係者を登録し支援力スコアを推定。緊急時対応や空白領域を可視化。'); }
  getIcon(){ return 'fas fa-project-diagram'; }
  renderContent(){
    return `
      <div class="form-row">
        <div class="form-group"><label>氏名/関係</label><input type="text" id="sn_name" class="input" placeholder="例: 長男 太郎（家族）"></div>
        <div class="form-group"><label>距離</label><select id="sn_prox"><option value="cohab">同居</option><option value="near">近所</option><option value="walk">徒歩圏</option><option value="car">車移動</option></select></div>
        <div class="form-group"><label>連絡頻度/週</label><input type="number" id="sn_freq" class="input" min="0" max="21" value="1"></div>
        <div class="form-group"><label>信頼度</label><input type="number" id="sn_trust" class="input" min="1" max="5" value="4"></div>
        <div class="form-group"><label>緊急連絡可</label><select id="sn_emer"><option value="yes">はい</option><option value="no">いいえ</option></select></div>
      </div>
      <button class="btn btn-secondary" type="button" onclick="this.parentElement.querySelector('.calculator-instance').addMember()"><i class="fas fa-user-plus"></i> 追加</button>
      <div id="sn_list" class="list"></div>
      <hr>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calc()">集計</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="snResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){ const s=super.render(); const c=new SocialNetworkCalculator(); const el=s.querySelector('.calculator-instance'); el.addMember=()=>c.addMember(); el.calc=()=>c.calc(); el.reset=()=>c.reset(); return s; }
}
class SocialNetworkCalculator {
  constructor(){ this.members=[]; }
  addMember(){
    const name=document.getElementById('sn_name')?.value?.trim(); if(!name) return;
    const prox=document.getElementById('sn_prox')?.value||'car';
    const freq=parseFloat(document.getElementById('sn_freq')?.value)||0;
    const trust=parseFloat(document.getElementById('sn_trust')?.value)||1;
    const emer=(document.getElementById('sn_emer')?.value||'no')==='yes';
    this.members.push({name,prox,freq,trust,emer});
    this.renderList();
  }
  renderList(){
    const list=document.getElementById('sn_list'); if(!list) return;
    list.innerHTML = this.members.length? this.members.map((m,i)=>`
      <div class="chip">
        <span>${m.name}｜${this.proxLabel(m.prox)}｜頻度${m.freq}/週｜信頼${m.trust}｜緊急${m.emer?'○':'×'}</span>
        <button class="btn btn-sm btn-danger" type="button" onclick="window.snDel${i}()">削除</button>
      </div>`).join('') : '<div class="text-muted">未登録</div>';
    // 削除ハンドラ
    this.members.forEach((_,i)=>{ window[`snDel${i}`]=()=>{ this.members.splice(i,1); this.renderList(); }; });
  }
  proxLabel(p){ return p==='cohab'?'同居':p==='near'?'近所':p==='walk'?'徒歩圏':'車移動'; }
  proxWeight(p){ return p==='cohab'?1.3:p==='near'?1.2:p==='walk'?1.1:1.0; }
  calc(){
    const n=this.members.length; const el=document.getElementById('snResult'); if(!el) return;
    if(n===0){ el.innerHTML='<div class="alert alert-info">関係者を1名以上追加してください。</div>'; el.style.display='block'; return; }
    let support=0; let emerCount=0; const byProx={cohab:0,near:0,walk:0,car:0};
    this.members.forEach(m=>{ const avail = m.emer?1.2:1.0; if(m.emer) emerCount++; byProx[m.prox]++; support += m.trust * (1 + Math.min(m.freq,14)/7) * this.proxWeight(m.prox) * avail; });
    const gaps=[]; if(byProx.cohab===0 && byProx.near===0) gaps.push('近距離の支援者がいない'); if(emerCount===0) gaps.push('緊急連絡可能者がいない');
    el.innerHTML = `
      <h3>ソーシャル支援 集計</h3>
      <div class="result-item"><strong>登録人数:</strong> ${n} 名</div>
      <div class="result-item"><strong>推定支援力スコア:</strong> <span class="highlight">${support.toFixed(1)}</span></div>
      <div class="result-item"><strong>緊急連絡可:</strong> ${emerCount} 名</div>
      ${gaps.length? `<div class="alert alert-warning"><strong>空白領域:</strong> ${gaps.join('、')}</div>` : '<div class="alert alert-success">支援ネットワークは概ね良好です</div>'}
    `;
    el.style.display='block';
  }
  reset(){ this.members=[]; this.renderList(); const r=document.getElementById('snResult'); if(r) r.style.display='none'; }
}
