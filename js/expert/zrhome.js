// -------- ZR-HOME（Quick/Detail 二層） --------
class ZRHomeTool extends BaseTool {
  constructor(){ super('zrhome','在宅環境評価 ZR-HOME（Q/D）','2–3分のスクリーニング（Q）と10–15分の詳細版（D）で、在宅環境リスクと介入優先度を可視化します。'); }
  getIcon(){ return 'fas fa-house-circle-check'; }
  renderContent(){
    return `
      <div class="form-row">
        <div class="form-group"><label>評価日</label><input type="date" id="zr_date" class="input"></div>
        <div class="form-group"><label>評価者</label><input type="text" id="zr_evaluator" class="input" placeholder="氏名"></div>
        <div class="form-group"><label>対象</label><input type="text" id="zr_subject" class="input" placeholder="例: Aさん（85）"></div>
      </div>
      <div class="tabs">
        <button class="btn btn-secondary" type="button" onclick="this.closest('section').querySelector('.calculator-instance').showTab('q')">Q：2–3分</button>
        <button class="btn btn-secondary" type="button" onclick="this.closest('section').querySelector('.calculator-instance').showTab('d')">D：詳細</button>
      </div>
      <div id="zr_q" class="assessment-section"></div>
      <div id="zr_d" class="assessment-section" style="display:none"></div>
      <div class="form-group"><label>改善計画（担当／期限／実施方法）</label><textarea id="zr_plan" class="input" rows="3" placeholder="例: 手すり設置／来週／L字手すり＋ノンスリップ"></textarea></div>
      <div class="form-group"><label>共有先</label><input id="zr_share" class="input" placeholder="家族・ケアマネ・OT・改修業者"></div>
      <div class="form-row"><div class="form-group"><label>再評価日</label><input type="date" id="zr_reval" class="input"></div></div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calc()">集計</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="zrhomeResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
    `;
  }
  render(){
    const s=super.render();
    const c=new ZRHomeCalculator();
    const inst=s.querySelector('.calculator-instance');
    inst.showTab=(t)=>c.showTab(t);
    inst.calc=()=>c.calc();
    inst.reset=()=>c.reset();
    c.mountQ(); c.mountD();
    return s;
  }
}

class ZRHomeCalculator {
  constructor(){
    // Quick: 10項目 0–2
    this.qItems = [
      {key:'path', label:'主要動線（玄関↔トイレ↔寝室）に段差・障害物がある'},
      {key:'floor', label:'床の滑り（浴室/洗面/台所）'},
      {key:'light', label:'照明・夜間導線（足元灯・スイッチ位置）'},
      {key:'stairs', label:'階段・手すり（連続手すり・踏面）'},
      {key:'bath', label:'浴室安全（マット/手すり/浴槽出入り）'},
      {key:'toilet', label:'トイレ安全（立ち座り補助）'},
      {key:'cable', label:'コード・配線（医療機器/酸素/延長コードの転倒・火災リスク）'},
      {key:'fire', label:'火の管理（ガス/電磁調理器/警報器）'},
      {key:'emer', label:'緊急時対応（緊急連絡掲示、呼び出し手段、鍵預かり）'},
      {key:'person', label:'本人の状態（認知/ふらつき/視力で環境がハイリスク化）'}
    ];
    // Detail: 12領域 0–3 × 重み
    this.dDomains = [
      {key:'d_path', label:'動線・段差', w:1.5, star:true},
      {key:'d_floor', label:'床・滑り', w:1.5, star:true},
      {key:'d_bathwc', label:'浴室・トイレ', w:1.5, star:true},
      {key:'d_stairs', label:'階段・手すり', w:1.5, star:true},
      {key:'d_light', label:'照明・視認性', w:1.2},
      {key:'d_cable', label:'コード・配線/医療機器', w:1.3},
      {key:'d_fire', label:'火災・警報', w:1.3},
      {key:'d_clutter', label:'収納・散乱物', w:1.0},
      {key:'d_entry', label:'玄関・外構', w:1.0},
      {key:'d_kitchen', label:'キッチン安全', w:1.0},
      {key:'d_emersys', label:'緊急時体制', w:1.2},
      {key:'d_person', label:'本人要因×環境', w:1.4}
    ];
  }
  mountQ(){
    const root=document.getElementById('zr_q'); if(!root) return;
    const opt = '<option value="0">0 問題なし</option><option value="1">1 軽微</option><option value="2">2 要対応</option>';
    root.innerHTML = `<h4>ZR-HOME-Q（10項目／0–2点）</h4><div class="table-responsive"><table class="table"><thead><tr><th>#</th><th>項目</th><th>評価</th></tr></thead><tbody>${this.qItems.map((it,i)=>`<tr><td>${i+1}</td><td>${it.label}</td><td><select id="q_${it.key}">${opt}</select></td></tr>`).join('')}</tbody></table></div>`;
  }
  mountD(){
    const root=document.getElementById('zr_d'); if(!root) return;
    const opt = '<option value="0">0 安全</option><option value="1">1 軽度</option><option value="2">2 中等度</option><option value="3">3 重度</option>';
    root.innerHTML = `<h4>ZR-HOME-D（12領域／0–3点×重み）</h4><div class="table-responsive"><table class="table"><thead><tr><th>領域</th><th>評点</th><th>重み</th></tr></thead><tbody>${this.dDomains.map(d=>`<tr><td>${d.label}${d.star?' <span class=\'badge\'>★</span>':''}</td><td><select id="d_${d.key}">${opt}</select></td><td>${d.w}</td></tr>`).join('')}</tbody></table></div>`;
  }
  showTab(t){
    const q=document.getElementById('zr_q'); const d=document.getElementById('zr_d');
    if(q&&d){ q.style.display = (t==='q')?'block':'none'; d.style.display = (t==='d')?'block':'none'; }
  }
  calc(){
    const mode = document.getElementById('zr_q')?.style.display!=='none' ? 'q' : 'd';
    if(mode==='q') return this.calcQ();
    return this.calcD();
  }
  calcQ(){
    const scores = this.qItems.map(it => parseInt(document.getElementById(`q_${it.key}`)?.value)||0);
    const total = scores.reduce((a,b)=>a+b,0);
    const level = total<=4? '低' : total<=9? '中' : total<=14? '高' : '極高（即対応）';
    // 赤札条件
    const redKeys = ['stairs','bath','light','cable','fire'];
    const reds = this.qItems.map((it,idx)=> ({it,idx,score:scores[idx]})).filter(x=> redKeys.includes(x.it.key) && x.score===2);
    const el=document.getElementById('zrhomeResult'); if(!el) return;
    el.innerHTML = `
      <h3>ZR-HOME-Q 集計</h3>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 20（判定: ${level}）</div>
      ${reds.length? `<div class="alert alert-danger"><strong>赤札（GO/NO-GO）:</strong> ${reds.map(r=>`${r.it.label}`).join('、')} → 即対応</div>`:''}
      ${this.suggestFromQ(scores)}
      ${this.footerBlock()}
    `;
    el.style.display='block';
  }
  calcD(){
    const vals = this.dDomains.map(d=> ({d,score: parseInt(document.getElementById(`d_${d.key}`)?.value)||0}));
    const R = vals.reduce((s,x)=> s + x.score * x.d.w, 0);
    const level = R<10? '低' : R<20? '中' : R<35? '高（2週間以内に対応）' : '極高（即日計画）';
    const contrib = vals.filter(x=> x.score>=2);
    const el=document.getElementById('zrhomeResult'); if(!el) return;
    el.innerHTML = `
      <h3>ZR-HOME-D 集計</h3>
      <div class="result-item"><strong>総合リスク R:</strong> <span class="highlight">${R.toFixed(1)}</span>（判定: ${level}）</div>
      ${contrib.length? `<div class="alert ${R>=35?'alert-danger':R>=20?'alert-warning':'alert-info'}"><strong>優先介入領域:</strong> ${contrib.map(c=>`${c.d.label}（${c.score}×${c.d.w}）`).join('、')}</div>`:''}
      ${this.suggestFromD(vals)}
      ${this.footerBlock()}
    `;
    el.style.display='block';
  }
  suggestFromQ(scores){
    const m=(idx)=> scores[idx]>=2;
    const map=[
      m(1)? '床・滑り: 速乾マット/ノンスリップ/水はけ改善（即日〜1週）' : '',
      m(3)? '階段・手すり: 連続手すり/踏面修繕/段差テープ（1–2週）' : '',
      m(2)? '照明: 足元灯/人感ライト/スイッチ増設（即日〜1週）' : '',
      m(6)? 'コード・医療機器: 配線整理/延長コード縮減/転倒ルート除外（即日）' : '',
      m(9)? '本人要因×環境: PT/OT評価/用具適合/訓練（計画化）' : ''
    ].filter(Boolean);
    return map.length? `<div class="result-item"><strong>推奨介入:</strong><br>${map.map(x=>'・'+x).join('<br>')}</div>` : '';
  }
  suggestFromD(vals){
    const get=(key)=> vals.find(v=>v.d.key===key)?.score||0;
    const list=[];
    if(get('d_floor')>=2) list.push('床・滑り: 速乾マット/ノンスリップ/排水改善（即日〜1週）');
    if(get('d_stairs')>=2) list.push('階段・手すり: 連続手すり/踏面修繕/段差識別テープ（1–2週）');
    if(get('d_light')>=2) list.push('照明: 足元灯/人感ライト/スイッチ位置改善（即日〜1週）');
    if(get('d_cable')>=2) list.push('コード/医療機器: 配線整理/延長コード縮減/ルート最適化（即日）');
    if(get('d_person')>=2) list.push('本人要因×環境: PT/OT評価、訓練、用具適合（計画化）');
    const refStars = vals.filter(v=> (v.d.star || v.d.w>=1.3) && v.score>=2);
    const refer = refStars.length? '<div class="alert alert-info"><strong>専門連携:</strong> ★領域で2–3点あり → 福祉住環境コーディネーター/OTへリファー</div>' : '';
    return `${list.length? `<div class="result-item"><strong>推奨介入:</strong><br>${list.map(x=>'・'+x).join('<br>')}</div>`:''}${refer}`;
  }
  footerBlock(){
    const date=document.getElementById('zr_date')?.value||'';
    const evalr=document.getElementById('zr_evaluator')?.value||'';
    const subj=document.getElementById('zr_subject')?.value||'';
    const plan=document.getElementById('zr_plan')?.value||'';
    const share=document.getElementById('zr_share')?.value||'';
    const reval=document.getElementById('zr_reval')?.value||'';
    return `
      <hr>
      <div class="result-item"><strong>評価日/評価者/対象:</strong> ${date} / ${evalr} / ${subj}</div>
      ${plan? `<div class="result-item"><strong>改善計画:</strong><br>${plan.replace(/\n/g,'<br>')}</div>`:''}
      ${share? `<div class="result-item"><strong>共有先:</strong> ${share}</div>`:''}
      ${reval? `<div class="result-item"><strong>再評価日:</strong> ${reval}</div>`:''}
      <div class="text-muted">用語運用: 0=問題なし/安全、1=軽微/軽度、2=要対応/中等度、3=重度。二者評価で差分1点以内を目標。</div>
    `;
  }
  reset(){ ['zr_date','zr_evaluator','zr_subject','zr_plan','zr_share','zr_reval'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); const r=document.getElementById('zrhomeResult'); if(r) r.style.display='none'; this.mountQ(); this.mountD(); this.showTab('q'); }
}
