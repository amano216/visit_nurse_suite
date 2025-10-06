// -------- BPS（Behavioral Pain Scale） --------
class BPSTool extends BaseTool {
  constructor(){ super('bps','BPS（行動疼痛スケール）','挿管患者向け：表情/上肢/人工呼吸器への同調（各1-4点）で3-12点'); }
  getIcon(){ return 'fas fa-person'; }
  renderContent(){
    const sel=(id,opts)=>`<div class=\"form-group\"><label for=\"${id}\">${id}</label><select id=\"${id}\">${opts}</select></div>`;
    const o=(arr)=>arr.map((t,i)=>`<option value=\"${i+1}\">${i+1}: ${t}</option>`).join('');
    return `
      <div class="assessment-section">
        <div class="alert alert-info" style="margin-bottom:8px;">
          挿管下成人ICU患者向け（BPS）。各項目1-4点、合計3-12点で高いほど疼痛が強いと判断。
        </div>
        <div class="form-row">
          ${sel('表情', o(['リラックス','わずかなしかめ面','頻回のしかめ面','持続する苦悶顔']))}
          ${sel('上肢', o(['動きなし','時々の屈曲','頻回の屈曲','抵抗/防御']))}
          ${sel('人工呼吸器への同調', o(['完全に同調','時々の同期不良','頻回の同期不良','抜管しようとする/強い抵抗']))}
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">採点</button>
      <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
      <div id="bpsResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <strong>【出典】</strong> Payen JF, et al. Assessing pain in critically ill sedated patients by using a behavioral pain scale. Crit Care Med. 2001;29(12):2258-63. PMID: 11801819
      </div>`;
  }
  render(){ const s=super.render(); const calc=new BPSCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>calc.calculate(); el.reset=()=>calc.reset(); return s; }
}
class BPSCalculator {
  calculate(){
    const ids=['表情','上肢','人工呼吸器への同調'];
    const total = ids.reduce((a,id)=> a + (parseInt(document.getElementById(id)?.value)||1), 0);
    const el=document.getElementById('bpsResult'); if(!el) return;
    const alert = total>5? (total>=9? 'alert-danger':'alert-warning') : 'alert-success';
    const cat = total>5? (total>=9? '重度の疼痛が疑われます':'中等度以上の疼痛が疑われます') : '疼痛の可能性は低い';
    el.innerHTML = `
      <h3>BPS結果</h3>
      <div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 12</div>
      <div class="alert ${alert}">${cat}。鎮痛/鎮静の調整と再評価を検討。</div>`;
    el.style.display='block';
  }
  reset(){ ['表情','上肢','人工呼吸器への同調'].forEach(id=>{ const e=document.getElementById(id); if(e) e.selectedIndex=0; }); const r=document.getElementById('bpsResult'); if(r) r.style.display='none'; }
}
