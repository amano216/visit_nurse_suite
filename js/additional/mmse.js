// MMSE（認知機能評価）ツール
class MMSETool extends BaseTool {
    constructor(){ super('mmse','MMSE','認知機能を評価します。'); }
    getIcon(){ return 'fas fa-head-side-virus'; }
    renderContent(){
        return `
            <div class="alert alert-info">
                <strong>MMSE（Mini-Mental State Examination）:</strong> 認知機能を評価する簡易検査です。満点30点。
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="orientation">見当識（時間・場所）</label>
                    <input type="number" id="orientation" min="0" max="10" placeholder="0-10点">
                    <small>時間5点、場所5点</small>
                </div>
                <div class="form-group">
                    <label for="registration">記銘力</label>
                    <input type="number" id="registration" min="0" max="3" placeholder="0-3点">
                    <small>3つの単語の記憶</small>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="attention">注意・計算</label>
                    <input type="number" id="attention" min="0" max="5" placeholder="0-5点">
                    <small>100から7を順次引く、またはSPELLを逆唱</small>
                </div>
                <div class="form-group">
                    <label for="recall">遅延再生</label>
                    <input type="number" id="recall" min="0" max="3" placeholder="0-3点">
                    <small>最初の3つの単語の想起</small>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="language">言語機能</label>
                    <input type="number" id="language" min="0" max="8" placeholder="0-8点">
                    <small>呼称、復唱、3段階命令、読字、書字</small>
                </div>
                <div class="form-group">
                    <label for="construction">構成機能</label>
                    <input type="number" id="construction" min="0" max="1" placeholder="0-1点">
                    <small>五角形の模写</small>
                </div>
            </div>
            <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
            <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
            <div id="mmseResult" class="result-container" style="display: none;"></div>
            <div class="calculator-instance" style="display: none;"></div>`;
    }
    render(){ const s=super.render(); const c=new MMSECalculator(); const el=s.querySelector('.calculator-instance'); el.calculator=c; el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}

class MMSECalculator {
    calculate(){
        const orientation = parseInt(document.getElementById('orientation')?.value) || 0;
        const registration = parseInt(document.getElementById('registration')?.value) || 0;
        const attention = parseInt(document.getElementById('attention')?.value) || 0;
        const recall = parseInt(document.getElementById('recall')?.value) || 0;
        const language = parseInt(document.getElementById('language')?.value) || 0;
        const construction = parseInt(document.getElementById('construction')?.value) || 0;
        if (orientation > 10 || registration > 3 || attention > 5 || recall > 3 || language > 8 || construction > 1) {
            this.showError('各項目の最大値を超えています。正しい値を入力してください。');
            return;
        }
        const totalScore = orientation + registration + attention + recall + language + construction;
        this.displayResult(totalScore, { orientation, registration, attention, recall, language, construction });
    }
    displayResult(totalScore, scores){
        const resultDiv = document.getElementById('mmseResult'); if(!resultDiv) return;
        let interpretation, recommendation, alertClass;
        if (totalScore >= 24) { interpretation='正常範囲'; recommendation='認知機能は正常範囲です。定期的な評価を継続してください。'; alertClass='alert-success'; }
        else if (totalScore >= 20) { interpretation='軽度認知障害の疑い'; recommendation='軽度の認知機能低下が疑われます。医師への相談をお勧めします。'; alertClass='alert-warning'; }
        else if (totalScore >= 10) { interpretation='中等度認知症の疑い'; recommendation='中等度の認知症が疑われます。専門医での詳しい検査が必要です。'; alertClass='alert-danger'; }
        else { interpretation='重度認知症の疑い'; recommendation='重度の認知症が疑われます。専門的な医学的管理が必要です。'; alertClass='alert-danger'; }
        resultDiv.innerHTML = `
            <h3>MMSE評価結果</h3>
            <div class="result-item"><strong>見当識:</strong> ${scores.orientation}/10点</div>
            <div class="result-item"><strong>記銘力:</strong> ${scores.registration}/3点</div>
            <div class="result-item"><strong>注意・計算:</strong> ${scores.attention}/5点</div>
            <div class="result-item"><strong>遅延再生:</strong> ${scores.recall}/3点</div>
            <div class="result-item"><strong>言語機能:</strong> ${scores.language}/8点</div>
            <div class="result-item"><strong>構成機能:</strong> ${scores.construction}/1点</div>
            <div class="result-item"><strong>MMSE総スコア:</strong> <span class="highlight">${totalScore}/30点</span></div>
            <div class="alert ${alertClass}"><strong>解釈:</strong> ${interpretation}<br><strong>推奨:</strong> ${recommendation}</div>`;
        resultDiv.style.display='block';
    }
    showError(message){ const r=document.getElementById('mmseResult'); if(r){ r.innerHTML=`<div class="alert alert-danger">${message}</div>`; r.style.display='block'; } }
    reset(){ ['orientation','registration','attention','recall','language','construction'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); const r=document.getElementById('mmseResult'); if(r) r.style.display='none'; }
}
