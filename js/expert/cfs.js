// -------- Clinical Frailty Scale (CFS 1-9) --------
class CFSTool extends BaseTool {
  constructor(){ super('cfs','Clinical Frailty Scale (CFS)','1（健常）〜9（末期）でフレイルの程度を判定します。'); }
  getIcon(){ return 'fas fa-user-injured'; }
  renderContent(){
    const options = [
      '1: 非常に健常', '2: 健常', '3: 管理された疾患', '4: 脆弱（脆弱前）',
      '5: 軽度フレイル', '6: 中等度フレイル', '7: 高度フレイル', '8: 非常に高度フレイル', '9: 末期（余命<6ヶ月）'
    ];
    return `
      <div class="form-group">
        <label for="cfsScore">CFSスコア</label>
        <select id="cfsScore">${options.map((t,i)=>`<option value="${i+1}">${t}</option>`).join('')}</select>
      </div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <div><strong>【解説】</strong> CFS（Clinical Frailty Scale）は2005年に提案された、全体的な健康状態に基づく「虚弱」の程度を簡便に把握するスケールです。日本語版では“Frailty”を“虚弱”と表現しています（国内普及の表現）。</div>
        <div style="margin-top:6px;"><strong>【エビデンス】</strong> CFSはFrailty Indexと高い相関（r≈0.80）を示し、スコア上昇に伴い死亡・施設入所リスクが上昇することが示されています。また、2013年の国際コンセンサスでは、フレイルティのスクリーニングとしてCFSの活用が推奨されています。</div>
        <div style="margin-top:6px;"><strong>【使用上の注意】</strong> 診断名ではなく重症度の把握を目的とした補助ツールです。病状変化に応じて定期的に再評価してください。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>Rockwood K, et al. A global clinical measure of fitness and frailty in elderly people. CMAJ. 2005;173(5):489–495. PMID: 16129869.</li>
            <li>Morley JE, et al. Frailty consensus: A call to action. J Am Med Dir Assoc. 2013;14(6):392–397. PMID: 23764209.</li>
            <li>一般社団法人 日本老年医学会. 臨床虚弱尺度（Clinical Frailty Scale）日本語版.</li>
          </ul>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <div id="cfsResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new CFSCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); return s; }
}
class CFSCalculator { calculate(){ const v=parseInt(document.getElementById('cfsScore')?.value)||1; const el=document.getElementById('cfsResult'); const alert = v>=7?'alert-danger':(v>=5?'alert-warning':'alert-success'); const plan = v>=7?'集中的な介護支援と転倒・嚥下・栄養の包括対応':(v>=5?'介護サービス/リハ/栄養介入を強化':'活動性維持と疾患管理の継続'); el.innerHTML=`<h3>CFS結果</h3><div class="result-item"><strong>スコア:</strong> <span class="highlight">${v}</span> / 9</div><div class="alert ${alert}">${plan}</div>`; el.style.display='block'; } }
