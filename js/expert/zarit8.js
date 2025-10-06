// -------- Zarit 8（介護負担） --------
class Zarit8Tool extends BaseTool {
  constructor(){ super('zarit8','Zarit-8（介護負担）','介護者の負担感を8項目（各0-4点）で評価します。'); }
  getIcon(){ return 'fas fa-users'; }
  renderContent(){
    const items = [
      '時間が自分の思うように使えない',
      '介護によるストレスを感じる',
      '体力的に疲れる',
      '経済的な負担を感じる',
      '家族・友人との関係に影響がある',
      '介護によって健康が損なわれている',
      '介護を続けられるか不安がある',
      '介護のために自由が制限されている'
    ];
    const opts = '<option value="0">0: まったくない</option><option value="1">1: たまに</option><option value="2">2: ときどき</option><option value="3">3: よくある</option><option value="4">4: ほとんどいつも</option>';
    return `
      <div class="assessment-section">
        <div class="als-grid">
          ${items.map((t,i)=>`<div class=\"form-group\"><label for=\"z8_${i}\">${i+1}. ${t}</label><select id=\"z8_${i}\">${opts}</select></div>`).join('')}
        </div>
        <small>参考目安: 合計が高いほど負担感が強い（0-32点）。</small>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">採点</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="zarit8Result" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new Zarit8Calculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class Zarit8Calculator {
  calculate(){
    const total = Array.from({length:8}).reduce((a,_,i)=> a + (parseInt(document.getElementById(`z8_${i}`)?.value)||0), 0);
    let cat='低負担'; let alert='alert-success';
    if (total>=21) { cat='高負担'; alert='alert-danger'; }
    else if (total>=13) { cat='中等度の負担'; alert='alert-warning'; }
    else if (total>=8) { cat='軽度の負担'; alert='alert-info'; }
    const el=document.getElementById('zarit8Result');
    el.innerHTML=`<h3>Zarit-8結果</h3><div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 32（${cat}）</div><div class="alert ${alert}">必要に応じて家族支援/レスパイト/社会資源の活用を検討。</div>`;
    el.style.display='block';
  }
  reset(){ Array.from({length:8}).forEach((_,i)=>{ const e=document.getElementById(`z8_${i}`); if(e) e.selectedIndex=0; }); const r=document.getElementById('zarit8Result'); if(r) r.style.display='none'; }
}
