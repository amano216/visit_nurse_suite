// MNA-SF（短縮版）栄養評価ツール
class MNATool extends BaseTool {
    constructor() {
        super('mna', 'MNA-SF（栄養短縮版）', '高齢者の栄養状態を6項目・14点で簡便に評価します。');
    }

    getIcon() {
        return 'fas fa-apple-alt';
    }

    renderContent() {
        return `
            <div class="alert alert-info">
                <strong>MNA-SF（Mini Nutritional Assessment - Short Form）:</strong> 高齢者の栄養状態を6項目・14点でスクリーニングします。
                <br>F項目は「BMI」または「下腿周囲長」のどちらかで評価します。
            </div>

            <h4>項目（A–F）</h4>
            <div class="form-row">
                <div class="form-group">
                    <label for="foodIntakeDecline">A. 食事摂取量の低下</label>
                    <select id="foodIntakeDecline">
                        <option value="0">著明に低下</option>
                        <option value="1">やや低下</option>
                        <option value="2">変化なし</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="weightLoss">B. 過去3ヶ月の体重減少</label>
                    <select id="weightLoss">
                        <option value="0">3kg以上の減少</option>
                        <option value="1">不明</option>
                        <option value="2">1-3kgの減少</option>
                        <option value="3">体重減少なし</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="mobility">C. 移動能力</label>
                    <select id="mobility">
                        <option value="0">寝たきり/車椅子</option>
                        <option value="1">起居は可だが外出せず</option>
                        <option value="2">外出可能</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="psychStress">D. 過去3ヶ月の心理的ストレス・急性疾患</label>
                    <select id="psychStress">
                        <option value="0">はい</option>
                        <option value="2">いいえ</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="neuroPsych">E. 神経・精神的問題</label>
                    <select id="neuroPsych">
                        <option value="0">重度の認知症・うつ</option>
                        <option value="1">軽度の認知症</option>
                        <option value="2">問題なし</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="bmiValue">F. BMI (kg/m²)</label>
                    <input type="number" id="bmiValue" step="0.1" placeholder="例: 22.4">
                    <small>未測定の場合は下腿周囲長を入力</small>
                </div>
                <div class="form-group">
                    <label for="calfCircumferenceValue">F. 下腿周囲長 (cm)</label>
                    <input type="number" id="calfCircumferenceValue" step="0.1" placeholder="例: 31.5">
                    <small>31cm以上で3点、31cm未満で0点</small>
                </div>
            </div>

            <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
            <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
            <div id="mnaResult" class="result-container" style="display: none;"></div>
            <div class="calculator-instance" style="display: none;"></div>
        `;
    }

    render() {
        const section = super.render();
        const calculator = new MNACalculator();
        const calculatorElement = section.querySelector('.calculator-instance');
        calculatorElement.calculator = calculator;
        calculatorElement.calculate = () => calculator.calculate();
        calculatorElement.reset = () => calculator.reset();
        return section;
    }
}

// 各ツールの計算クラス実装（MNA）
class MNACalculator {
    calculate() {
        // A–E: select の合計
        const aeFields = ['foodIntakeDecline', 'weightLoss', 'mobility', 'psychStress', 'neuroPsych'];
        let totalScore = 0;
        const detailScores = {};

        aeFields.forEach(field => {
            const el = document.getElementById(field);
            const v = parseFloat(el?.value) || 0;
            detailScores[field] = v;
            totalScore += v;
        });

        // F: BMI または 下腿周囲長
        const bmi = parseFloat(document.getElementById('bmiValue')?.value) || null;
        const cc = parseFloat(document.getElementById('calfCircumferenceValue')?.value) || null;
        let fScore = 0;
        let fBasis = '';
        if (bmi && bmi > 0) {
            // BMIスコアリング: >=23:3, 21-22.9:2, 19-20.9:1, <19:0
            if (bmi >= 23) fScore = 3;
            else if (bmi >= 21) fScore = 2;
            else if (bmi >= 19) fScore = 1;
            else fScore = 0;
            fBasis = `BMI ${bmi.toFixed(1)}`;
        } else if (cc && cc > 0) {
            // 下腿周囲長: >=31cm:3, <31cm:0
            fScore = cc >= 31 ? 3 : 0;
            fBasis = `下腿周囲長 ${cc.toFixed(1)}cm`;
        } else {
            fScore = 0;
            fBasis = 'BMI/下腿周囲長 未入力';
        }

        detailScores.F = fScore;
        totalScore += fScore;

        this.displayResult(totalScore, detailScores, { bmi, cc, fBasis });
    }

    displayResult(score, details, extra) {
        const resultDiv = document.getElementById('mnaResult');
        if (!resultDiv) return;

        let category, recommendation, alertClass;
        if (score >= 12) {
            category = '栄養状態良好';
            recommendation = '定期的な観察を継続してください。';
            alertClass = 'alert-success';
        } else if (score >= 8) {
            category = '栄養失調のリスクあり';
            recommendation = '栄養介入の検討とモニタリングを行ってください。';
            alertClass = 'alert-warning';
        } else {
            category = '栄養失調';
            recommendation = '積極的な栄養介入が必要です。医師・栄養士へ相談してください。';
            alertClass = 'alert-danger';
        }

        resultDiv.innerHTML = `
            <h3>MNA-SF 評価結果</h3>
            <div class="result-item"><strong>総スコア:</strong> <span class="highlight">${score}/14点</span></div>
            <div class="result-item"><strong>A 食事摂取低下:</strong> ${details.foodIntakeDecline ?? 0}点</div>
            <div class="result-item"><strong>B 体重減少:</strong> ${details.weightLoss ?? 0}点</div>
            <div class="result-item"><strong>C 移動能力:</strong> ${details.mobility ?? 0}点</div>
            <div class="result-item"><strong>D ストレス/急性疾患:</strong> ${details.psychStress ?? 0}点</div>
            <div class="result-item"><strong>E 神経・精神:</strong> ${details.neuroPsych ?? 0}点</div>
            <div class="result-item"><strong>F 指標:</strong> ${extra.fBasis} → ${details.F}点</div>
            <div class="alert ${alertClass}"><strong>評価:</strong> ${category}<br><strong>推奨:</strong> ${recommendation}</div>
        `;
        resultDiv.style.display = 'block';
    }

    reset() {
        const selectFields = ['foodIntakeDecline', 'weightLoss', 'mobility', 'psychStress', 'neuroPsych'];
        selectFields.forEach(id => { const el = document.getElementById(id); if (el) el.selectedIndex = 0; });
        const bmiEl = document.getElementById('bmiValue'); if (bmiEl) bmiEl.value = '';
        const ccEl = document.getElementById('calfCircumferenceValue'); if (ccEl) ccEl.value = '';
        const resultDiv = document.getElementById('mnaResult'); if (resultDiv) resultDiv.style.display = 'none';
    }
}
