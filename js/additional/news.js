// NEWS（早期警告スコア）ツール
class NEWSTool extends BaseTool {
    constructor() {
        super('news', 'NEWS（早期警告スコア）', '患者の重症度を早期に発見するスコアリングシステムです。');
    }

    getIcon() { return 'fas fa-exclamation-triangle'; }

    renderContent() {
        return `
            <div class="alert alert-info">
                <strong>NEWS 2（National Early Warning Score）:</strong> 患者の生理学的パラメータから重症度を評価します。
            </div>
            <div class="form-group">
                <input type="checkbox" id="scale2Enabled"><label for="scale2Enabled">スケール2を使用（COPD等、目標SpO2: 88-92%）</label>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="respirationRate">呼吸数 (回/分)</label>
                    <input type="number" id="respirationRate" min="0" placeholder="例: 18">
                </div>
                <div class="form-group">
                    <label for="oxygenSaturation">酸素飽和度 (%)</label>
                    <input type="number" id="oxygenSaturation" min="0" max="100" placeholder="例: 96">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="airOrOxygen">室内気 or 酸素投与</label>
                    <select id="airOrOxygen">
                        <option value="0">室内気</option>
                        <option value="2">酸素投与あり</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="systolicBPNews">収縮期血圧 (mmHg)</label>
                    <input type="number" id="systolicBPNews" min="0" placeholder="例: 120">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="heartRate">心拍数 (回/分)</label>
                    <input type="number" id="heartRate" min="0" placeholder="例: 75">
                </div>
                <div class="form-group">
                    <label for="consciousnessLevel">意識レベル (ACVPU)</label>
                    <select id="consciousnessLevel">
                        <option value="0">A: Alert（清明）</option>
                        <option value="3">C, V, P, U: 新たな錯乱、声・痛みへの反応、無反応</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="temperature">体温 (℃)</label>
                <input type="number" id="temperature" step="0.1" placeholder="例: 36.5">
            </div>

            <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
            <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
            <div id="newsResult" class="result-container" style="display: none;"></div>
            <div class="calculator-instance" style="display: none;"></div>
        `;
    }

    render() {
        const section = super.render();
        const calculator = new NEWSCalculator();
        const calculatorElement = section.querySelector('.calculator-instance');
        calculatorElement.calculator = calculator;
        calculatorElement.calculate = () => calculator.calculate();
        calculatorElement.reset = () => calculator.reset();
        return section;
    }
}

class NEWSCalculator {
    calculate() {
        const respirationRate = parseInt(document.getElementById('respirationRate')?.value) || 0;
        const oxygenSaturation = parseInt(document.getElementById('oxygenSaturation')?.value) || 0;
        const onOxygen = (document.getElementById('airOrOxygen')?.value || '0') === '2';
        const systolicBP = parseInt(document.getElementById('systolicBPNews')?.value) || 0;
        const heartRate = parseInt(document.getElementById('heartRate')?.value) || 0;
        const consciousnessLevel = parseInt(document.getElementById('consciousnessLevel')?.value) || 0;
        const temperature = parseFloat(document.getElementById('temperature')?.value) || 0;
        const scale2Enabled = document.getElementById('scale2Enabled')?.checked || false;

        if (respirationRate === 0 || oxygenSaturation === 0 || systolicBP === 0 || heartRate === 0 || temperature === 0) {
            this.showError('すべての項目を入力してください。');
            return;
        }

        const details = {};
        details.respiration = this.getRespirationScore(respirationRate);
        details.oxygen = this.getOxygenScore(oxygenSaturation, scale2Enabled, onOxygen);
        details.bloodPressure = this.getBPScore(systolicBP);
        details.heartRate = this.getHRScore(heartRate);
        details.consciousness = consciousnessLevel;
        details.temperature = this.getTempScore(temperature);
        details.airOxygen = onOxygen ? 2 : 0;

        let score = details.respiration + details.oxygen + details.bloodPressure + details.heartRate + details.consciousness + details.temperature;

        // NEWS2では、スケールに関わらず酸素投与で2点加算される
        if (onOxygen) {
            score += details.airOxygen; // = 2点
        }

        this.displayResult(score, details, {
            respirationRate, oxygenSaturation, onOxygen, systolicBP, heartRate, consciousnessLevel, temperature, scale2Enabled
        });
    }

    getRespirationScore(rate) {
        if (rate <= 8) return 3;
        if (rate >= 9 && rate <= 11) return 1;
        if (rate >= 12 && rate <= 20) return 0;
        if (rate >= 21 && rate <= 24) return 2;
        if (rate >= 25) return 3;
        return 0;
    }

    getOxygenScore(sat, scale2, onO2) {
        // NEWS2: SpO2の配点はスケールに応じて決まり、酸素投与の有無に依存しない（+2点は別項目）
        if (scale2) {
            if (sat <= 83) return 3;
            if (sat <= 85) return 2; // 84-85
            if (sat <= 87) return 1; // 86-87
            if (sat <= 92) return 0; // 88-92
            if (sat <= 94) return 1; // 93-94
            if (sat <= 96) return 2; // 95-96
            return 3; // >=97
        } else { // Scale 1
            if (sat <= 91) return 3;
            if (sat <= 93) return 2; // 92-93
            if (sat <= 95) return 1; // 94-95
            return 0; // >=96
        }
    }

    getBPScore(bp) {
        if (bp <= 90) return 3;
        if (bp >= 91 && bp <= 100) return 2;
        if (bp >= 101 && bp <= 110) return 1;
        if (bp >= 111 && bp <= 219) return 0;
        if (bp >= 220) return 3;
        return 0;
    }

    getHRScore(hr) {
        if (hr <= 40) return 3;
        if (hr >= 41 && hr <= 50) return 1;
        if (hr >= 51 && hr <= 90) return 0;
        if (hr >= 91 && hr <= 110) return 1;
        if (hr >= 111 && hr <= 130) return 2;
        if (hr >= 131) return 3;
        return 0;
    }

    getTempScore(temp) {
        if (temp <= 35.0) return 3;
        if (temp >= 35.1 && temp <= 36.0) return 1;
        if (temp >= 36.1 && temp <= 38.0) return 0;
        if (temp >= 38.1 && temp <= 39.0) return 1;
        if (temp >= 39.1) return 2;
        return 0;
    }

    displayResult(score, details, values) {
        const resultDiv = document.getElementById('newsResult');
        if (!resultDiv) return;

        let riskLevel, recommendation, alertClass;
        const anySingleThree = [
            details.respiration,
            details.oxygen,
            details.bloodPressure,
            details.heartRate,
            details.consciousness,
            details.temperature
        ].some(v => v === 3);

        if (score >= 7) {
            riskLevel = '高リスク';
            recommendation = '緊急対応が必要。即時医師診察を要請。';
            alertClass = 'alert-danger';
        } else if (score >= 5 || anySingleThree) {
            // 単一項目で3点の場合も中リスクとして対応を強化
            riskLevel = '中リスク';
            recommendation = '緊急評価が必要。医師への報告と1時間毎の観察。';
            alertClass = 'alert-warning';
        } else if (score >= 1) {
            riskLevel = '低リスク';
            recommendation = '4-6時間毎の観察。';
            alertClass = 'alert-info';
        } else {
            riskLevel = 'リスクなし';
            recommendation = '12時間毎の定期観察。';
            alertClass = 'alert-success';
        }

        const oxygenText = values.onOxygen ? `酸素投与あり (${details.airOxygen}点)` : '室内気 (0点)';

        resultDiv.innerHTML = `
            <h3>NEWS 2 評価結果</h3>
            <div class="result-item">
                <strong>総スコア:</strong> <span class="highlight">${score}点</span>
            </div>
            <div class="result-item">
                <strong>呼吸数:</strong> ${values.respirationRate}回/分 (${details.respiration}点)
            </div>
            <div class="result-item">
                <strong>酸素飽和度:</strong> ${values.oxygenSaturation}% (${details.oxygen}点) - ${values.scale2Enabled ? 'スケール2' : 'スケール1'}
            </div>
             <div class="result-item">
                <strong>酸素投与:</strong> ${oxygenText}
            </div>
            <div class="result-item">
                <strong>収縮期血圧:</strong> ${values.systolicBP}mmHg (${details.bloodPressure}点)
            </div>
            <div class="result-item">
                <strong>心拍数:</strong> ${values.heartRate}回/分 (${details.heartRate}点)
            </div>
             <div class="result-item">
                <strong>意識レベル:</strong> ${values.consciousnessLevel === 0 ? '清明' : '清明でない'} (${details.consciousness}点)
            </div>
            <div class="result-item">
                <strong>体温:</strong> ${values.temperature}℃ (${details.temperature}点)
            </div>
            <div class="alert ${alertClass}">
                <strong>リスクレベル:</strong> ${riskLevel}<br>
                <strong>推奨対応:</strong> ${recommendation}
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    showError(message) {
        const resultDiv = document.getElementById('newsResult');
        if (resultDiv) {
            resultDiv.innerHTML = `<div class="alert alert-danger">${message}</div>`;
            resultDiv.style.display = 'block';
        }
    }

    reset() {
        ['respirationRate', 'oxygenSaturation', 'systolicBPNews', 'heartRate', 'temperature'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
        });
        ['airOrOxygen', 'consciousnessLevel', 'scale2Enabled'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (element.type === 'checkbox') element.checked = false;
                else element.selectedIndex = 0;
            }
        });
        const resultDiv = document.getElementById('newsResult');
        if (resultDiv) resultDiv.style.display = 'none';
    }
}
