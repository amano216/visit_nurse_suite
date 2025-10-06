// -------- PHQ-9（抑うつ） --------
class PHQ9Tool extends BaseTool {
  constructor(){ super('phq9','PHQ-9（抑うつスクリーニング）','過去2週間の9項目（0-3点）で抑うつの程度を評価します。'); }
  getIcon(){ return 'fas fa-face-meh'; }
  renderContent(){
    const items = [
      '物事に対して興味や喜びが持てない',
      '気分が落ち込む、憂うつ、絶望的な気持ちになる',
      '寝つきが悪い/眠りが浅い/眠りすぎる',
      '疲れたり、気力がわかなかったりする',
      '食欲がない/食べ過ぎる',
      '自分はダメな人間だと思う/自分や家族を失望させた',
      '集中することが難しい',
      '動きや話し方が遅くなった/または落ち着かず動き回る',
      '死んだ方がましだと思う/自傷行為を考えた'
    ];
    const opts = '<option value="0">0: まったくない</option><option value="1">1: いく日か</option><option value="2">2: 半分以上</option><option value="3">3: ほとんど毎日</option>';
    return `
      <div class="assessment-section">
        <div class="als-grid">
          ${items.map((t,i)=>`<div class=\"form-group\"><label for=\"phq${i}\">${i+1}. ${t}</label><select id=\"phq${i}\">${opts}</select></div>`).join('')}
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">採点</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="phqResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new PHQ9Calculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}
class PHQ9Calculator {
  calculate(){ const total = Array.from({length:9}).reduce((a,_,i)=> a + (parseInt(document.getElementById(`phq${i}`)?.value)||0), 0); const el=document.getElementById('phqResult'); let cat='最小'; let alert='alert-success'; if(total>=20){cat='重度'; alert='alert-danger';} else if(total>=15){cat='中等度〜重度'; alert='alert-warning';} else if(total>=10){cat='中等度'; alert='alert-warning';} else if(total>=5){cat='軽度'; alert='alert-info';} el.innerHTML=`<h3>PHQ-9結果</h3><div class=\"result-item\"><strong>合計:</strong> <span class=\"highlight\">${total}</span> / 27（${cat}）</div><div class=\"alert ${alert}\">必要に応じて医師/専門職に相談し、危険兆候（自傷念慮）に注意してください。</div>`; el.style.display='block'; }
  reset(){ Array.from({length:9}).forEach((_,i)=>{ const e=document.getElementById(`phq${i}`); if(e) e.selectedIndex=0; }); const r=document.getElementById('phqResult'); if(r) r.style.display='none'; }
}
