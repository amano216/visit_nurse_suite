// -------- Delirium Quick (4項) --------
class Delirium4Tool extends BaseTool {
  constructor(){ super('delirium4','急性意識障害スクリーニング（4項）','覚醒、時間場所見当、注意、急性変化の4項を点数化します。'); }
  getIcon(){ return 'fas fa-bed'; }
  renderContent(){
    return `
      <div class="assessment-section">
        <h4><i class="fas fa-brain"></i> AIUEOTIPS（意識障害の原因の語呂合わせ）</h4>
        <div class="form-group">
          <ul style="margin:6px 0 0 20px;">
            <li><strong>A</strong>（Alcohol/薬物）：アルコール、鎮静薬、中毒</li>
            <li><strong>I</strong>（Insulin/代謝）：低血糖・高血糖、電解質異常、甲状腺機能異常</li>
            <li><strong>U</strong>（Uremia/臓器）：腎不全、肝性脳症、CO2ナルコーシス</li>
            <li><strong>E</strong>（Electrolytes/環境）：低Na/高Na、低体温/高体温、脱水</li>
            <li><strong>O</strong>（Oxygen/脳血管）：低酸素、脳梗塞・脳出血、てんかん後</li>
            <li><strong>T</strong>（Trauma）：頭部外傷、硬膜下血腫</li>
            <li><strong>I</strong>（Infection）：髄膜炎/脳炎、敗血症</li>
            <li><strong>P</strong>（Psychiatric/中毒）：精神疾患、薬物性（抗うつ薬・抗精神病薬など）</li>
            <li><strong>S</strong>（Space-occupying/その他）：脳腫瘍、水頭症、急性閉塞性水頭症 など</li>
          </ul>
        </div>
        <div class="form-group" style="margin-top:6px;">
          <strong>関連する表・スコア</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>アルコール離脱の評価: CIWA-Ar</li>
            <li>アルコール依存スクリーニング: CAGE</li>
            <li>血中エタノール濃度予測 / 浸透圧ギャップ</li>
            <li>低Na血症の診断フローチャート</li>
          </ul>
        </div>
        <div class="alert alert-info">注意: この語呂合わせは緊急度の順ではありません。実臨床では①ABC（気道・呼吸・循環）の安定、②低血糖の除外、③頭蓋内疾患の評価を優先し、検査は同時並行で行います。</div>
        <div class="text-muted" style="font-size:0.9em;">注: 呼称としては海外のAEIOU TIPSが原型とされ、本邦ではAIUEOTIPSとして普及しています。</div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>覚醒状態</label><select id="dlAlert"><option value="0">正常(0)</option><option value="4">異常(4)</option></select></div>
        <div class="form-group"><label>見当識（AMT4相当）</label><select id="dlOrient"><option value="0">誤り0-1(0)</option><option value="2">誤り2+(2)</option></select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>注意（逆唱/日付/月逆唱等）</label><select id="dlAttention"><option value="0">良好(0)</option><option value="1">不良(1)</option></select></div>
        <div class="form-group"><label>急性変化/変動</label><select id="dlAcute"><option value="0">なし(0)</option><option value="4">あり(4)</option></select></div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <div id="dlResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new Delirium4Calculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); return s; }
}
class Delirium4Calculator { calculate(){ const sc=[parseInt(document.getElementById('dlAlert')?.value)||0,parseInt(document.getElementById('dlOrient')?.value)||0,parseInt(document.getElementById('dlAttention')?.value)||0,parseInt(document.getElementById('dlAcute')?.value)||0]; const total=sc.reduce((a,b)=>a+b,0); const el=document.getElementById('dlResult'); const pos= total>=4; el.innerHTML=`<h3>4項スクリーニング</h3><div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 11</div><div class="alert ${pos?'alert-warning':'alert-success'}">${pos?'陽性の可能性：急ぎ評価を':'陰性の可能性'}</div>`; el.style.display='block'; } }
