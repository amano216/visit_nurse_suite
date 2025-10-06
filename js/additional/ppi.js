// PPI（がん予後指数）ツール
class PPITool extends BaseTool {
    constructor() {
        super('ppi', 'PPI（がん予後指数）', 'がん患者の予後を評価します。');
    }

    getIcon() { return 'fas fa-chart-line'; }

    renderContent() {
        return `
            <div class="alert alert-info">
                <strong>PPI（Palliative Prognostic Index）:</strong> がん患者の予後を予測するツールです。
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="palliativePerformance">PPS（パフォーマンス%）</label>
                    <select id="palliativePerformance">
                        <option value="0">60%以上</option>
                        <option value="2.5">30〜50%</option>
                        <option value="4">10〜20%</option>
                    </select>
                    <small>※ PPSは表の左列（起居）から優先して、患者に最も当てはまるレベルを選択します。</small>
                </div>
                <div class="form-group">
                    <label for="oralIntake">経口摂取</label>
                    <select id="oralIntake">
                        <option value="0">正常</option>
                        <option value="1">中程度減少（減少しているが数口よりは多い）</option>
                        <option value="2.5">著明に減少（数口以下）</option>
                    </select>
                    <div class="form-inline">
                        <input type="checkbox" id="oralIntakeTPNZero">
                        <label for="oralIntakeTPNZero">消化管閉塞のため高カロリー輸液施行中（この場合は0点）</label>
                    </div>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="edema">浮腫</label>
                    <select id="edema">
                        <option value="0">なし</option>
                        <option value="1">あり</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="restDyspnea">安静時呼吸困難</label>
                    <select id="restDyspnea">
                        <option value="0">なし</option>
                        <option value="3.5">あり</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="delirium">せん妄</label>
                <small>※ 原因が薬物単独のものは含めません</small>
                <select id="delirium">
                    <option value="0">なし</option>
                    <option value="4">あり</option>
                </select>
            </div>

            <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
            <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
            <div id="ppiResult" class="result-container" style="display: none;"></div>
            <div class="calculator-instance" style="display: none;"></div>
        `;
    }

    render() {
        const section = super.render();
        const calculator = new PPICalculator();
        const calculatorElement = section.querySelector('.calculator-instance');
        calculatorElement.calculator = calculator;
        calculatorElement.calculate = () => calculator.calculate();
        calculatorElement.reset = () => calculator.reset();
        return section;
    }
}

class PPICalculator {
    calculate() {
        const palliativePerformance = parseFloat(document.getElementById('palliativePerformance')?.value) || 0;
        const oralIntakeRaw = parseFloat(document.getElementById('oralIntake')?.value) || 0;
        const oralTPN = document.getElementById('oralIntakeTPNZero')?.checked || false;
        const oralIntake = oralTPN ? 0 : oralIntakeRaw; // 消化管閉塞でTPN施行中は0点
        const edema = parseFloat(document.getElementById('edema')?.value) || 0;
        const restDyspnea = parseFloat(document.getElementById('restDyspnea')?.value) || 0;
        const delirium = parseFloat(document.getElementById('delirium')?.value) || 0;

        const totalScore = palliativePerformance + oralIntake + edema + restDyspnea + delirium;

        this.displayResult(totalScore, {
            palliativePerformance, oralIntake, edema, restDyspnea, delirium, oralTPN
        });
    }

    displayResult(score, values) {
        const resultDiv = document.getElementById('ppiResult');
        if (!resultDiv) return;

        let prognosis, survivalWeeks, alertClass;
        if (score >= 6.5) {
            prognosis = '予後不良群';
            survivalWeeks = '21日以下（週単位）の可能性が高い';
            alertClass = 'alert-danger';
        } else if (score <= 3.5) {
            prognosis = '予後良好群';
            survivalWeeks = '42日以上（月単位）の可能性が高い';
            alertClass = 'alert-success';
        } else {
            prognosis = '中間群';
            survivalWeeks = '3-6週間';
            alertClass = 'alert-warning';
        }

        resultDiv.innerHTML = `
            <h3>PPI評価結果</h3>
            <div class="result-item">
                <strong>総スコア:</strong> <span class="highlight">${score}点</span>
            </div>
            <div class="result-item">
                <strong>PPS:</strong> ${values.palliativePerformance}点
            </div>
            <div class="result-item">
                <strong>経口摂取:</strong> ${values.oralIntake}点${values.oralTPN ? '（TPN例外適用）' : ''}
            </div>
            <div class="result-item">
                <strong>浮腫:</strong> ${values.edema}点
            </div>
            <div class="result-item">
                <strong>安静時呼吸困難:</strong> ${values.restDyspnea}点
            </div>
            <div class="result-item">
                <strong>せん妄:</strong> ${values.delirium}点
            </div>
            <div class="alert ${alertClass}">
                <strong>予後予測:</strong> ${prognosis}<br>
                <strong>推定生存期間:</strong> ${survivalWeeks}
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    reset() {
        ['palliativePerformance', 'oralIntake', 'edema', 'restDyspnea', 'delirium'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.selectedIndex = 0;
        });
        const resultDiv = document.getElementById('ppiResult');
        if (resultDiv) resultDiv.style.display = 'none';
    }
}
