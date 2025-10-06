// BMI計算ツール
class BMITool extends BaseTool {
    constructor() { super('bmi', 'BMI計算', '体格指数を計算し、肥満度を評価します。'); }
    getIcon() { return 'fas fa-weight'; }
    renderContent() {
        return `
            <div class="form-row">
                <div class="form-group">
                    <label for="weightBMI">体重 (kg)</label>
                    <input type="number" id="weightBMI" min="0" step="0.1" placeholder="例: 65.5">
                </div>
                <div class="form-group">
                    <label for="heightBMI">身長 (cm)</label>
                    <input type="number" id="heightBMI" min="0" step="0.1" placeholder="例: 170">
                </div>
            </div>
            <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">計算実行</button>
            <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
            <div id="bmiResult" class="result-container" style="display: none;"></div>
            <div class="calculator-instance" style="display: none;"></div>
        `;
    }
    render() {
        const section = super.render();
        const calc = new BMICalculator();
        const el = section.querySelector('.calculator-instance');
        el.calculator = calc; el.calculate = () => calc.calculate(); el.reset = () => calc.reset();
        return section;
    }
}

class BMICalculator {
    calculate() {
        const weight = parseFloat(document.getElementById('weightBMI')?.value) || 0;
        const height = parseFloat(document.getElementById('heightBMI')?.value) || 0;
        if (weight <= 0 || height <= 0) { this.showError('体重と身長を正しく入力してください。'); return; }
        const heightM = height / 100; const bmi = weight / (heightM * heightM);
        this.displayResult(bmi, weight, height);
    }
    displayResult(bmi, weight, height) {
        const resultDiv = document.getElementById('bmiResult'); if (!resultDiv) return;
        let category, recommendation, alertClass;
        if (bmi < 18.5) { category = '低体重（やせ）'; recommendation = '適切な栄養摂取を心がけましょう。'; alertClass='alert-warning'; }
        else if (bmi < 25) { category = '普通体重'; recommendation = '現在の体重を維持しましょう。'; alertClass='alert-success'; }
        else if (bmi < 30) { category = '肥満（1度）'; recommendation = '食事制限と運動で体重管理を。'; alertClass='alert-warning'; }
        else if (bmi < 35) { category = '肥満（2度）'; recommendation = '医師の指導の下、体重管理が必要です。'; alertClass='alert-danger'; }
        else { category = '肥満（3度）'; recommendation = '積極的な医学的管理が必要です。'; alertClass='alert-danger'; }
        resultDiv.innerHTML = `
            <h3>BMI計算結果</h3>
            <div class="result-item"><strong>体重:</strong> ${weight} kg</div>
            <div class="result-item"><strong>身長:</strong> ${height} cm</div>
            <div class="result-item"><strong>BMI:</strong> <span class="highlight">${bmi.toFixed(1)}</span></div>
            <div class="alert ${alertClass}"><strong>判定:</strong> ${category}<br><strong>推奨:</strong> ${recommendation}</div>
        `;
        resultDiv.style.display = 'block';
    }
    showError(message){ const r=document.getElementById('bmiResult'); if(r){ r.innerHTML=`<div class="alert alert-danger">${message}</div>`; r.style.display='block'; } }
    reset(){ ['weightBMI','heightBMI'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; }); const r=document.getElementById('bmiResult'); if(r) r.style.display='none'; }
}
