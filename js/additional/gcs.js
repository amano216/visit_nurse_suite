// GCS（Glasgow Coma Scale）ツール
class GCSTool extends BaseTool {
    constructor() { super('gcs', 'Glasgow Coma Scale', '意識レベルを評価します。'); }
    getIcon(){ return 'fas fa-brain'; }
    renderContent(){
        return `
            <div class="alert alert-info">
                <strong>GCS（Glasgow Coma Scale）:</strong> 意識レベルを客観的に評価するスケールです。
            </div>
            <div class="form-group">
                <label for="eyeOpening">開眼反応（E）</label>
                <select id="eyeOpening">
                    <option value="1">開眼しない</option>
                    <option value="2">痛み刺激で開眼</option>
                    <option value="3">音声で開眼</option>
                    <option value="4">自発的に開眼</option>
                </select>
            </div>
            <div class="form-group">
                <label for="verbalResponse">言語反応（V）</label>
                <select id="verbalResponse">
                    <option value="1">発語なし</option>
                    <option value="2">理解不能な発語</option>
                    <option value="3">不適切な発語</option>
                    <option value="4">混乱した発語</option>
                    <option value="5">見当識あり</option>
                </select>
            </div>
            <div class="form-group">
                <label for="motorResponse">運動反応（M）</label>
                <select id="motorResponse">
                    <option value="1">反応なし</option>
                    <option value="2">伸展反応（除脳）</option>
                    <option value="3">異常屈曲反応（除皮質）</option>
                    <option value="4">逃避反応（痛み刺激で回避）</option>
                    <option value="5">局在化反応</option>
                    <option value="6">命令に従う</option>
                </select>
            </div>
            <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
            <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
            <div id="gcsResult" class="result-container" style="display: none;"></div>
            <div class="calculator-instance" style="display: none;"></div>`;
    }
    render(){ const s=super.render(); const c=new GCSCalculator(); const el=s.querySelector('.calculator-instance'); el.calculator=c; el.calculate=()=>c.calculate(); el.reset=()=>c.reset(); return s; }
}

class GCSCalculator {
    calculate(){
        const eyeOpening = parseInt(document.getElementById('eyeOpening')?.value) || 1;
        const verbalResponse = parseInt(document.getElementById('verbalResponse')?.value) || 1;
        const motorResponse = parseInt(document.getElementById('motorResponse')?.value) || 1;
        const totalScore = eyeOpening + verbalResponse + motorResponse;
        this.displayResult(totalScore, eyeOpening, verbalResponse, motorResponse);
    }
    displayResult(totalScore, eye, verbal, motor){
        const resultDiv = document.getElementById('gcsResult'); if(!resultDiv) return;
        let severity, recommendation, alertClass;
        if (totalScore >= 14){ severity='軽度意識障害'; recommendation='継続的な観察を行ってください。'; alertClass='alert-success'; }
        else if (totalScore >= 9){ severity='中等度意識障害'; recommendation='頻回な観察と医師への報告が必要です。'; alertClass='alert-warning'; }
        else { severity='重度意識障害'; recommendation='緊急医学的管理が必要です。'; alertClass='alert-danger'; }
        const eyeTexts=['','開眼しない','痛み刺激で開眼','音声で開眼','自発的に開眼'];
        const verbalTexts=['','発語なし','理解不能な発語','不適切な発語','混乱した発語','見当識あり'];
        const motorTexts=['','反応なし','伸展反応（除脳）','異常屈曲反応（除皮質）','逃避反応','局在化反応','命令に従う'];
        resultDiv.innerHTML = `
            <h3>GCS評価結果</h3>
            <div class="result-item"><strong>開眼反応（E）:</strong> ${eye}点 - ${eyeTexts[eye]}</div>
            <div class="result-item"><strong>言語反応（V）:</strong> ${verbal}点 - ${verbalTexts[verbal]}</div>
            <div class="result-item"><strong>運動反応（M）:</strong> ${motor}点 - ${motorTexts[motor]}</div>
            <div class="result-item"><strong>GCS総スコア:</strong> <span class="highlight">${totalScore}/15点</span> (E${eye}V${verbal}M${motor})</div>
            <div class="alert ${alertClass}"><strong>評価:</strong> ${severity}<br><strong>推奨:</strong> ${recommendation}</div>`;
        resultDiv.style.display='block';
    }
    reset(){ ['eyeOpening','verbalResponse','motorResponse'].forEach(id=>{ const e=document.getElementById(id); if(e) e.selectedIndex=0; }); const r=document.getElementById('gcsResult'); if(r) r.style.display='none'; }
}
