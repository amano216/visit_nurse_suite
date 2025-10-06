// -------- SARC-F --------
class SARCFTool extends BaseTool {
  constructor(){ super('sarcf','SARC-F（サルコペニア）','5項目0-2点でサルコペニアの可能性を評価します。'); }
  getIcon(){ return 'fas fa-dumbbell'; }
  renderContent(){
    return `
      <div class="form-row">
        <div class="form-group">
          <label for="筋力低下">約4.5kgの持ち上げ/運搬はどのくらいむずかしいですか？</label>
          <select id="筋力低下">
            <option value="0">まったくむずかしくない（0）</option>
            <option value="1">いくらかむずかしい（1）</option>
            <option value="2">とてもむずかしい／できない（2）</option>
          </select>
        </div>
        <div class="form-group">
          <label for="歩行補助">部屋の中を歩くことはどのくらいむずかしいですか？</label>
          <select id="歩行補助">
            <option value="0">まったくむずかしくない（0）</option>
            <option value="1">いくらかむずかしい（1）</option>
            <option value="2">とてもむずかしい／杖などが必要／できない（2）</option>
          </select>
        </div>
        <div class="form-group">
          <label for="椅子立ち上がり">ベッドや椅子から立ち上がることはどのくらいむずかしいですか？</label>
          <select id="椅子立ち上がり">
            <option value="0">まったくむずかしくない（0）</option>
            <option value="1">いくらかむずかしい（1）</option>
            <option value="2">とてもむずかしい／介助が必要（2）</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="階段昇降困難">10段くらいの階段をのぼることはどのくらいむずかしいですか？</label>
          <select id="階段昇降困難">
            <option value="0">まったくむずかしくない（0）</option>
            <option value="1">いくらかむずかしい（1）</option>
            <option value="2">とてもむずかしい／できない（2）</option>
          </select>
        </div>
        <div class="form-group">
          <label for="転倒歴">過去2年間に何回程度転びましたか？</label>
          <select id="転倒歴">
            <option value="0">まったくない（0）</option>
            <option value="1">1–3回（1）</option>
            <option value="2">4回以上（2）</option>
          </select>
        </div>
      </div>
      <div class="citation" style="font-size:0.9em; color:#555; margin-top:12px;">
        <div><strong>【解説】</strong> SARC-Fは5項目を各0–2点で評価し、合計0–10点。<u>4点以上でスクリーニング陽性</u>とされ、IADL障害、歩行速度低下、入院、死亡などと関連することが報告されています。</div>
        <div style="margin-top:6px;"><strong>【出典】</strong>
          <ul style="margin:6px 0 0 20px;">
            <li>Malmstrom TK, Morley JE. SARC-F: a symptom score to predict persons with sarcopenia at risk for poor functional outcomes. J Cachexia Sarcopenia Muscle. 2016;7(1):28–36. PMID: 27066316.</li>
            <li>Tanaka S, Kamiya K, et al. Utility of SARC-F for Assessing Physical Function in Elderly Patients With Cardiovascular Disease. J Am Med Dir Assoc. 2017;18(2):176–181. PMID: 28043805.</li>
          </ul>
        </div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
      <div id="sarcfResult" class="result-container" style="display:none"></div>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const c=new SARCFCalculator(); const el=s.querySelector('.calculator-instance'); el.calculate=()=>c.calculate(); return s; }
}
class SARCFCalculator { calculate(){ const ids=['筋力低下','歩行補助','椅子立ち上がり','階段昇降困難','転倒歴']; const total=ids.reduce((a,id)=> a + (parseInt(document.getElementById(id)?.value)||0),0); const el=document.getElementById('sarcfResult'); const pos= total>=4; el.innerHTML=`<h3>SARC-F</h3><div class="result-item"><strong>合計:</strong> <span class="highlight">${total}</span> / 10</div><div class="alert ${pos?'alert-warning':'alert-success'}">${pos?'陽性（4点以上）：サルコペニアの可能性あり。詳細評価を検討':'陰性の可能性：ただし臨床所見と併せて判断'}</div>`; el.style.display='block'; } }
