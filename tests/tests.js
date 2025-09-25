function log(name, cond, detail){
  const li=document.createElement('li');
  li.className = cond? 'pass':'fail';
  li.textContent = `${cond? 'PASS':'FAIL'} - ${name}${detail? ' ('+detail+')':''}`;
  document.getElementById('log').appendChild(li);
}

window.addEventListener('DOMContentLoaded', ()=>{
  // OME/BT: 代表値
  try {
    const omeCalc = new OpioidEquivalenceCalculator();
    // Fentanyl 25 mcg/h → OME 60 mg/day
    const ome1 = omeCalc.calcOME('fentanyl_td', 25);
    log('OME fentanyl 25 mcg/h ≈ 60 mg/day', Math.abs(ome1-60)<0.01, `got ${ome1}`);
    // BT 10%: 6 mg OME → Morphine PO ≈ 6 mg
    const rescue1 = omeCalc.toRescue('morphine_po', ome1*0.1);
    log('BT10% morphine about 6 mg', Math.abs(rescue1-6)<0.01, `got ${rescue1}`);
    // Oxycodone 30 mg/day → OME 45 mg/day
    const ome2 = omeCalc.calcOME('oxycodone_po', 30);
    log('OME oxycodone 30 mg/day ≈ 45 mg/day', Math.abs(ome2-45)<0.01, `got ${ome2}`);
  } catch(e){ log('OME calculator load', false, e.message); }

  // CPOT: 境界 2→陰性, 3→陽性
  try {
    const cpot = new CPOTCalculator();
    // DOM option valuesを模擬
    const setVal = (id,val)=>{ const el=document.getElementById(id); if(el){ el.value=val; }};
    // 下限（0,0,1,1）=2
    ['表情','体動','筋緊張','呼吸器/発声'].forEach(id=>{ if(!document.getElementById(id)){
      const s=document.createElement('select'); s.id=id; for(let i=0;i<3;i++){ const o=document.createElement('option'); o.value=i; s.appendChild(o);} document.body.appendChild(s);
    }});
    setVal('表情',0); setVal('体動',0); setVal('筋緊張',1); setVal('呼吸器/発声',1);
    cpot.calculate();
    const txt1 = document.getElementById('cpotResult').innerText;
    log('CPOT total 2 is negative', /合計:\s*2/.test(txt1) && /疼痛の可能性は低い/.test(txt1));
    // 境界（1,1,1,0）=3
    setVal('表情',1); setVal('体動',1); setVal('筋緊張',1); setVal('呼吸器/発声',0);
    cpot.calculate();
    const txt2 = document.getElementById('cpotResult').innerText;
    log('CPOT total 3 is positive', /合計:\s*3/.test(txt2) && /疼痛の可能性：/.test(txt2));
  } catch(e){ log('CPOT calculator load', false, e.message); }

  // BPS: 閾値
  try {
    const bps = new BPSCalculator();
    const ensureSel=(id)=>{ if(!document.getElementById(id)){ const s=document.createElement('select'); s.id=id; for(let i=1;i<=4;i++){ const o=document.createElement('option'); o.value=i; s.appendChild(o);} document.body.appendChild(s);} };
    ensureSel('表情'); ensureSel('上肢'); ensureSel('人工呼吸器への同調');
    // 最小 1+1+1 = 3 → 低い
    document.getElementById('表情').value=1; document.getElementById('上肢').value=1; document.getElementById('人工呼吸器への同調').value=1;
    bps.calculate();
    let t1=document.getElementById('bpsResult').innerText; log('BPS min 3 low', /合計:\s*3/.test(t1) && /可能性は低い/.test(t1));
    // 中間 2+2+2 = 6 → 注意
    document.getElementById('表情').value=2; document.getElementById('上肢').value=2; document.getElementById('人工呼吸器への同調').value=2;
    bps.calculate();
    let t2=document.getElementById('bpsResult').innerText; log('BPS 6 warning', /合計:\s*6/.test(t2) && /中等度以上/.test(t2));
    // 高位 4+3+3 = 10 → 重度
    document.getElementById('表情').value=4; document.getElementById('上肢').value=3; document.getElementById('人工呼吸器への同調').value=3;
    bps.calculate();
    let t3=document.getElementById('bpsResult').innerText; log('BPS 10 severe', /合計:\s*10/.test(t3) && /重度/.test(t3));
  } catch(e){ log('BPS calculator load', false, e.message); }
});
