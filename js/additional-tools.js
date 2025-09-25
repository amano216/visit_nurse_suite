/**
 * 追加の臨床ツール実装
 * MNA、NEWS、PPI、BMI、GCS、MMSEツールの詳細実装
 */

// MNA栄養評価ツール
class MNATool extends BaseTool {
    constructor() {
        super('mna', 'MNA栄養評価', '高齢者の栄養状態を評価します。');
    }

    getIcon() {
        return 'fas fa-apple-alt';
    }

    renderContent() {
        return `
            <div class="alert alert-info">
                <strong>MNA（Mini Nutritional Assessment）:</strong> 高齢者の栄養状態を評価する標準化されたツールです。
            </div>
            
            <h4>A. 人体測定</h4>
            <div class="form-row">
                <div class="form-group">
                    <label for="bmiMNA">BMI (kg/m²)</label>
                    <select id="bmiMNA">
                        <option value="0">BMI < 19</option>
                        <option value="1">19 ≤ BMI < 21</option>
                        <option value="2">21 ≤ BMI < 23</option>
                        <option value="3">BMI ≥ 23</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="weightLoss">過去3ヶ月の体重減少</label>
                    <select id="weightLoss">
                        <option value="0">3kg以上の減少</option>
                        <option value="1">不明</option>
                        <option value="2">1-3kgの減少</option>
                        <option value="3">体重減少なし</option>
                    </select>
                </div>
            </div>

            <h4>B. 全般的評価</h4>
            <div class="form-row">
                <div class="form-group">
                    <label for="mobility">移動能力</label>
                    <select id="mobility">
                        <option value="0">寝たきりまたは車椅子</option>
                        <option value="1">家の中は歩行可能</option>
                        <option value="2">外出可能</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="psychStress">過去3ヶ月の心理的ストレス・急性疾患</label>
                    <select id="psychStress">
                        <option value="0">はい</option>
                        <option value="2">いいえ</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="neuroPsych">神経・精神的問題</label>
                    <select id="neuroPsych">
                        <option value="0">重度の認知症・うつ</option>
                        <option value="1">軽度の認知症</option>
                        <option value="2">精神的問題なし</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="bedSores">褥瘡・皮膚潰瘍</label>
                    <select id="bedSores">
                        <option value="0">はい</option>
                        <option value="1">いいえ</option>
                    </select>
                </div>
            </div>

            <h4>C. 食事評価</h4>
            <div class="form-row">
                <div class="form-group">
                    <label for="meals">食事回数</label>
                    <select id="meals">
                        <option value="0">1日1回</option>
                        <option value="1">1日2回</option>
                        <option value="2">1日3回</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="protein">タンパク質摂取</label>
                    <select id="protein">
                        <option value="0.0">0-1食品群/日</option>
                        <option value="0.5">2食品群/日</option>
                        <option value="1.0">3食品群/日以上</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="fruitVeg">果物・野菜摂取</label>
                    <select id="fruitVeg">
                        <option value="0">1日2回未満</option>
                        <option value="1">1日2回以上</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="fluidIntake">水分摂取量</label>
                    <select id="fluidIntake">
                        <option value="0.0">1日3杯未満</option>
                        <option value="0.5">1日3-5杯</option>
                        <option value="1.0">1日5杯以上</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="feedingMode">食事摂取方法</label>
                    <select id="feedingMode">
                        <option value="0">重篤な摂食困難</option>
                        <option value="1">自立しているが困難</option>
                        <option value="2">摂食に問題なし</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="selfNutrition">栄養状態の自己評価</label>
                    <select id="selfNutrition">
                        <option value="0">栄養失調</option>
                        <option value="1">わからない</option>
                        <option value="2">栄養問題なし</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="healthComparison">同年代との健康比較</label>
                    <select id="healthComparison">
                        <option value="0.0">悪い</option>
                        <option value="0.5">わからない</option>
                        <option value="1.0">良い</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="midArmCircumference">上腕周囲長 (cm)</label>
                    <select id="midArmCircumference">
                        <option value="0.0">21cm未満</option>
                        <option value="0.5">21-22cm</option>
                        <option value="1.0">22cm以上</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="calfCircumference">下腿周囲長 (cm)</label>
                <select id="calfCircumference">
                    <option value="0">31cm未満</option>
                    <option value="1">31cm以上</option>
                </select>
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

// NEWS（早期警告スコア）ツール
class NEWSTool extends BaseTool {
    constructor() {
        super('news', 'NEWS（早期警告スコア）', '患者の重症度を早期に発見するスコアリングシステムです。');
    }

    getIcon() {
        return 'fas fa-exclamation-triangle';
    }

    renderContent() {
        return `
            <div class="alert alert-info">
                <strong>NEWS（National Early Warning Score）:</strong> 患者の生理学的パラメータから重症度を評価します。
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
                    <label for="airOrOxygen">空気 or 酸素</label>
                    <select id="airOrOxygen">
                        <option value="0">空気</option>
                        <option value="2">酸素</option>
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
                    <label for="consciousnessLevel">意識レベル</label>
                    <select id="consciousnessLevel">
                        <option value="0">Alert（清明）</option>
                        <option value="3">Voice/Pain/Unresponsive（反応低下）</option>
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

// PPI（がん予後指数）ツール
class PPITool extends BaseTool {
    constructor() {
        super('ppi', 'PPI（がん予後指数）', 'がん患者の予後を評価します。');
    }

    getIcon() {
        return 'fas fa-chart-line';
    }

    renderContent() {
        return `
            <div class="alert alert-info">
                <strong>PPI（Palliative Prognostic Index）:</strong> がん患者の予後を予測するツールです。
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="palliativePerformance">PPS（パフォーマンス%）</label>
                    <select id="palliativePerformance">
                        <option value="0">60-100%</option>
                        <option value="2.5">30-50%</option>
                        <option value="4">10-20%</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="oralIntake">経口摂取</label>
                    <select id="oralIntake">
                        <option value="0">正常</option>
                        <option value="1">やや低下</option>
                        <option value="2.5">著しく低下</option>
                    </select>
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

// BMI計算ツール
class BMITool extends BaseTool {
    constructor() {
        super('bmi', 'BMI計算', '体格指数を計算し、肥満度を評価します。');
    }

    getIcon() {
        return 'fas fa-weight';
    }

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
        const calculator = new BMICalculator();
        const calculatorElement = section.querySelector('.calculator-instance');
        calculatorElement.calculator = calculator;
        calculatorElement.calculate = () => calculator.calculate();
        calculatorElement.reset = () => calculator.reset();
        return section;
    }
}

// GCS（Glasgow Coma Scale）ツール
class GCSTool extends BaseTool {
    constructor() {
        super('gcs', 'Glasgow Coma Scale', '意識レベルを評価します。');
    }

    getIcon() {
        return 'fas fa-brain';
    }

    renderContent() {
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
            <div class="calculator-instance" style="display: none;"></div>
        `;
    }

    render() {
        const section = super.render();
        const calculator = new GCSCalculator();
        const calculatorElement = section.querySelector('.calculator-instance');
        calculatorElement.calculator = calculator;
        calculatorElement.calculate = () => calculator.calculate();
        calculatorElement.reset = () => calculator.reset();
        return section;
    }
}

// MMSE（認知機能評価）ツール
class MMSETool extends BaseTool {
    constructor() {
        super('mmse', 'MMSE', '認知機能を評価します。');
    }

    getIcon() {
        return 'fas fa-head-side-virus';
    }

    renderContent() {
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
            <div class="calculator-instance" style="display: none;"></div>
        `;
    }

    render() {
        const section = super.render();
        const calculator = new MMSECalculator();
        const calculatorElement = section.querySelector('.calculator-instance');
        calculatorElement.calculator = calculator;
        calculatorElement.calculate = () => calculator.calculate();
        calculatorElement.reset = () => calculator.reset();
        return section;
    }
}

// 各ツールの計算クラス実装
class MNACalculator {
    calculate() {
        const fields = ['bmiMNA', 'weightLoss', 'mobility', 'psychStress', 'neuroPsych', 'bedSores',
                       'meals', 'protein', 'fruitVeg', 'fluidIntake', 'feedingMode', 'selfNutrition',
                       'healthComparison', 'midArmCircumference', 'calfCircumference'];
        
        let totalScore = 0;
        const values = {};
        
        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                const value = parseFloat(element.value) || 0;
                values[field] = value;
                totalScore += value;
            }
        });

        this.displayResult(totalScore, values);
    }

    displayResult(score, values) {
        const resultDiv = document.getElementById('mnaResult');
        if (!resultDiv) return;

        let category, recommendation, alertClass;
        if (score >= 24) {
            category = '栄養状態良好';
            recommendation = '定期的な栄養評価を継続してください。';
            alertClass = 'alert-success';
        } else if (score >= 17) {
            category = '栄養失調のリスクあり';
            recommendation = '栄養状態の改善と定期的なモニタリングが必要です。';
            alertClass = 'alert-warning';
        } else {
            category = '栄養失調';
            recommendation = '積極的な栄養介入が必要です。医師・栄養士との相談をお勧めします。';
            alertClass = 'alert-danger';
        }

        resultDiv.innerHTML = `
            <h3>MNA評価結果</h3>
            <div class="result-item">
                <strong>総スコア:</strong> <span class="highlight">${score.toFixed(1)}/30点</span>
            </div>
            <div class="alert ${alertClass}">
                <strong>評価:</strong> ${category}<br>
                <strong>推奨:</strong> ${recommendation}
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    reset() {
        const fields = ['bmiMNA', 'weightLoss', 'mobility', 'psychStress', 'neuroPsych', 'bedSores',
                       'meals', 'protein', 'fruitVeg', 'fluidIntake', 'feedingMode', 'selfNutrition',
                       'healthComparison', 'midArmCircumference', 'calfCircumference'];
        
        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element) element.selectedIndex = 0;
        });
        
        const resultDiv = document.getElementById('mnaResult');
        if (resultDiv) resultDiv.style.display = 'none';
    }
}

class NEWSCalculator {
    calculate() {
        const respirationRate = parseInt(document.getElementById('respirationRate')?.value) || 0;
        const oxygenSaturation = parseInt(document.getElementById('oxygenSaturation')?.value) || 0;
        const airOrOxygen = parseInt(document.getElementById('airOrOxygen')?.value) || 0;
        const systolicBP = parseInt(document.getElementById('systolicBPNews')?.value) || 0;
        const heartRate = parseInt(document.getElementById('heartRate')?.value) || 0;
        const consciousnessLevel = parseInt(document.getElementById('consciousnessLevel')?.value) || 0;
        const temperature = parseFloat(document.getElementById('temperature')?.value) || 0;

        if (respirationRate === 0 || oxygenSaturation === 0 || systolicBP === 0 || heartRate === 0 || temperature === 0) {
            this.showError('すべての項目を入力してください。');
            return;
        }

        let score = 0;
        const details = {};

        // 呼吸数スコア
        if (respirationRate <= 8) score += 3;
        else if (respirationRate <= 11) score += 1;
        else if (respirationRate <= 20) score += 0;
        else if (respirationRate <= 24) score += 2;
        else score += 3;
        details.respiration = this.getRespirationScore(respirationRate);

        // 酸素飽和度スコア
        if (oxygenSaturation <= 91) score += 3;
        else if (oxygenSaturation <= 93) score += 2;
        else if (oxygenSaturation <= 95) score += 1;
        else score += 0;
        details.oxygen = this.getOxygenScore(oxygenSaturation);

        // 空気/酸素
        score += airOrOxygen;
        details.airOxygen = airOrOxygen;

        // 収縮期血圧スコア
        if (systolicBP <= 90) score += 3;
        else if (systolicBP <= 100) score += 2;
        else if (systolicBP <= 110) score += 1;
        else if (systolicBP <= 219) score += 0;
        else score += 3;
        details.bloodPressure = this.getBPScore(systolicBP);

        // 心拍数スコア
        if (heartRate <= 40) score += 3;
        else if (heartRate <= 50) score += 1;
        else if (heartRate <= 90) score += 0;
        else if (heartRate <= 110) score += 1;
        else if (heartRate <= 130) score += 2;
        else score += 3;
        details.heartRate = this.getHRScore(heartRate);

        // 意識レベル
        score += consciousnessLevel;
        details.consciousness = consciousnessLevel;

        // 体温スコア
        if (temperature <= 35.0) score += 3;
        else if (temperature <= 36.0) score += 1;
        else if (temperature <= 38.0) score += 0;
        else if (temperature <= 39.0) score += 1;
        else score += 2;
        details.temperature = this.getTempScore(temperature);

        this.displayResult(score, details, {
            respirationRate, oxygenSaturation, airOrOxygen, systolicBP, heartRate, consciousnessLevel, temperature
        });
    }

    getRespirationScore(rate) {
        if (rate <= 8) return 3;
        else if (rate <= 11) return 1;
        else if (rate <= 20) return 0;
        else if (rate <= 24) return 2;
        else return 3;
    }

    getOxygenScore(sat) {
        if (sat <= 91) return 3;
        else if (sat <= 93) return 2;
        else if (sat <= 95) return 1;
        else return 0;
    }

    getBPScore(bp) {
        if (bp <= 90) return 3;
        else if (bp <= 100) return 2;
        else if (bp <= 110) return 1;
        else if (bp <= 219) return 0;
        else return 3;
    }

    getHRScore(hr) {
        if (hr <= 40) return 3;
        else if (hr <= 50) return 1;
        else if (hr <= 90) return 0;
        else if (hr <= 110) return 1;
        else if (hr <= 130) return 2;
        else return 3;
    }

    getTempScore(temp) {
        if (temp <= 35.0) return 3;
        else if (temp <= 36.0) return 1;
        else if (temp <= 38.0) return 0;
        else if (temp <= 39.0) return 1;
        else return 2;
    }

    displayResult(score, details, values) {
        const resultDiv = document.getElementById('newsResult');
        if (!resultDiv) return;

        let riskLevel, recommendation, alertClass;
        if (score === 0) {
            riskLevel = '低リスク';
            recommendation = '継続的な基本ケア';
            alertClass = 'alert-success';
        } else if (score <= 4) {
            riskLevel = '低〜中リスク';
            recommendation = '4-6時間毎の観察';
            alertClass = 'alert-warning';
        } else if (score <= 6) {
            riskLevel = '中リスク';
            recommendation = '1時間毎の観察、医師への報告';
            alertClass = 'alert-warning';
        } else {
            riskLevel = '高リスク';
            recommendation = '継続的な観察、緊急医師診察';
            alertClass = 'alert-danger';
        }

        resultDiv.innerHTML = `
            <h3>NEWS評価結果</h3>
            <div class="result-item">
                <strong>総スコア:</strong> <span class="highlight">${score}点</span>
            </div>
            <div class="result-item">
                <strong>呼吸数:</strong> ${values.respirationRate}回/分 (${details.respiration}点)
            </div>
            <div class="result-item">
                <strong>酸素飽和度:</strong> ${values.oxygenSaturation}% (${details.oxygen}点)
            </div>
            <div class="result-item">
                <strong>収縮期血圧:</strong> ${values.systolicBP}mmHg (${details.bloodPressure}点)
            </div>
            <div class="result-item">
                <strong>心拍数:</strong> ${values.heartRate}回/分 (${details.heartRate}点)
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
        ['airOrOxygen', 'consciousnessLevel'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.selectedIndex = 0;
        });
        const resultDiv = document.getElementById('newsResult');
        if (resultDiv) resultDiv.style.display = 'none';
    }
}

class PPICalculator {
    calculate() {
        const palliativePerformance = parseFloat(document.getElementById('palliativePerformance')?.value) || 0;
        const oralIntake = parseFloat(document.getElementById('oralIntake')?.value) || 0;
        const edema = parseFloat(document.getElementById('edema')?.value) || 0;
        const restDyspnea = parseFloat(document.getElementById('restDyspnea')?.value) || 0;
        const delirium = parseFloat(document.getElementById('delirium')?.value) || 0;

        const totalScore = palliativePerformance + oralIntake + edema + restDyspnea + delirium;

        this.displayResult(totalScore, {
            palliativePerformance, oralIntake, edema, restDyspnea, delirium
        });
    }

    displayResult(score, values) {
        const resultDiv = document.getElementById('ppiResult');
        if (!resultDiv) return;

        let prognosis, survivalWeeks, alertClass;
        if (score <= 4) {
            prognosis = '予後良好群';
            survivalWeeks = '6週間以上';
            alertClass = 'alert-success';
        } else if (score <= 6) {
            prognosis = '中間群';
            survivalWeeks = '3-6週間';
            alertClass = 'alert-warning';
        } else {
            prognosis = '予後不良群';
            survivalWeeks = '3週間未満';
            alertClass = 'alert-danger';
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
                <strong>経口摂取:</strong> ${values.oralIntake}点
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

class BMICalculator {
    calculate() {
        const weight = parseFloat(document.getElementById('weightBMI')?.value) || 0;
        const height = parseFloat(document.getElementById('heightBMI')?.value) || 0;

        if (weight <= 0 || height <= 0) {
            this.showError('体重と身長を正しく入力してください。');
            return;
        }

        const heightM = height / 100;
        const bmi = weight / (heightM * heightM);

        this.displayResult(bmi, weight, height);
    }

    displayResult(bmi, weight, height) {
        const resultDiv = document.getElementById('bmiResult');
        if (!resultDiv) return;

        let category, recommendation, alertClass;
        if (bmi < 18.5) {
            category = '低体重（やせ）';
            recommendation = '適切な栄養摂取を心がけましょう。';
            alertClass = 'alert-warning';
        } else if (bmi < 25) {
            category = '普通体重';
            recommendation = '現在の体重を維持しましょう。';
            alertClass = 'alert-success';
        } else if (bmi < 30) {
            category = '肥満（1度）';
            recommendation = '食事制限と運動で体重管理を。';
            alertClass = 'alert-warning';
        } else if (bmi < 35) {
            category = '肥満（2度）';
            recommendation = '医師の指導の下、体重管理が必要です。';
            alertClass = 'alert-danger';
        } else {
            category = '肥満（3度）';
            recommendation = '積極的な医学的管理が必要です。';
            alertClass = 'alert-danger';
        }

        resultDiv.innerHTML = `
            <h3>BMI計算結果</h3>
            <div class="result-item">
                <strong>体重:</strong> ${weight} kg
            </div>
            <div class="result-item">
                <strong>身長:</strong> ${height} cm
            </div>
            <div class="result-item">
                <strong>BMI:</strong> <span class="highlight">${bmi.toFixed(1)}</span>
            </div>
            <div class="alert ${alertClass}">
                <strong>判定:</strong> ${category}<br>
                <strong>推奨:</strong> ${recommendation}
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    showError(message) {
        const resultDiv = document.getElementById('bmiResult');
        if (resultDiv) {
            resultDiv.innerHTML = `<div class="alert alert-danger">${message}</div>`;
            resultDiv.style.display = 'block';
        }
    }

    reset() {
        ['weightBMI', 'heightBMI'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
        });
        const resultDiv = document.getElementById('bmiResult');
        if (resultDiv) resultDiv.style.display = 'none';
    }
}

class GCSCalculator {
    calculate() {
        const eyeOpening = parseInt(document.getElementById('eyeOpening')?.value) || 1;
        const verbalResponse = parseInt(document.getElementById('verbalResponse')?.value) || 1;
        const motorResponse = parseInt(document.getElementById('motorResponse')?.value) || 1;

        const totalScore = eyeOpening + verbalResponse + motorResponse;

        this.displayResult(totalScore, eyeOpening, verbalResponse, motorResponse);
    }

    displayResult(totalScore, eye, verbal, motor) {
        const resultDiv = document.getElementById('gcsResult');
        if (!resultDiv) return;

        let severity, recommendation, alertClass;
        if (totalScore >= 14) {
            severity = '軽度意識障害';
            recommendation = '継続的な観察を行ってください。';
            alertClass = 'alert-success';
        } else if (totalScore >= 9) {
            severity = '中等度意識障害';
            recommendation = '頻回な観察と医師への報告が必要です。';
            alertClass = 'alert-warning';
        } else {
            severity = '重度意識障害';
            recommendation = '緊急医学的管理が必要です。';
            alertClass = 'alert-danger';
        }

        const eyeTexts = ['', '開眼しない', '痛み刺激で開眼', '音声で開眼', '自発的に開眼'];
        const verbalTexts = ['', '発語なし', '理解不能な発語', '不適切な発語', '混乱した発語', '見当識あり'];
    const motorTexts = ['', '反応なし', '伸展反応（除脳）', '異常屈曲反応（除皮質）', '逃避反応', '局在化反応', '命令に従う'];

        resultDiv.innerHTML = `
            <h3>GCS評価結果</h3>
            <div class="result-item">
                <strong>開眼反応（E）:</strong> ${eye}点 - ${eyeTexts[eye]}
            </div>
            <div class="result-item">
                <strong>言語反応（V）:</strong> ${verbal}点 - ${verbalTexts[verbal]}
            </div>
            <div class="result-item">
                <strong>運動反応（M）:</strong> ${motor}点 - ${motorTexts[motor]}
            </div>
            <div class="result-item">
                <strong>GCS総スコア:</strong> <span class="highlight">${totalScore}/15点</span> (E${eye}V${verbal}M${motor})
            </div>
            <div class="alert ${alertClass}">
                <strong>評価:</strong> ${severity}<br>
                <strong>推奨:</strong> ${recommendation}
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    reset() {
        ['eyeOpening', 'verbalResponse', 'motorResponse'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.selectedIndex = 0;
        });
        const resultDiv = document.getElementById('gcsResult');
        if (resultDiv) resultDiv.style.display = 'none';
    }
}

class MMSECalculator {
    calculate() {
        const orientation = parseInt(document.getElementById('orientation')?.value) || 0;
        const registration = parseInt(document.getElementById('registration')?.value) || 0;
        const attention = parseInt(document.getElementById('attention')?.value) || 0;
        const recall = parseInt(document.getElementById('recall')?.value) || 0;
        const language = parseInt(document.getElementById('language')?.value) || 0;
        const construction = parseInt(document.getElementById('construction')?.value) || 0;

        // 入力値の妥当性チェック
        if (orientation > 10 || registration > 3 || attention > 5 || recall > 3 || language > 8 || construction > 1) {
            this.showError('各項目の最大値を超えています。正しい値を入力してください。');
            return;
        }

        const totalScore = orientation + registration + attention + recall + language + construction;

        this.displayResult(totalScore, {
            orientation, registration, attention, recall, language, construction
        });
    }

    displayResult(totalScore, scores) {
        const resultDiv = document.getElementById('mmseResult');
        if (!resultDiv) return;

        let interpretation, recommendation, alertClass;
        if (totalScore >= 24) {
            interpretation = '正常範囲';
            recommendation = '認知機能は正常範囲です。定期的な評価を継続してください。';
            alertClass = 'alert-success';
        } else if (totalScore >= 20) {
            interpretation = '軽度認知障害の疑い';
            recommendation = '軽度の認知機能低下が疑われます。医師への相談をお勧めします。';
            alertClass = 'alert-warning';
        } else if (totalScore >= 10) {
            interpretation = '中等度認知症の疑い';
            recommendation = '中等度の認知症が疑われます。専門医での詳しい検査が必要です。';
            alertClass = 'alert-danger';
        } else {
            interpretation = '重度認知症の疑い';
            recommendation = '重度の認知症が疑われます。専門的な医学的管理が必要です。';
            alertClass = 'alert-danger';
        }

        resultDiv.innerHTML = `
            <h3>MMSE評価結果</h3>
            <div class="result-item">
                <strong>見当識:</strong> ${scores.orientation}/10点
            </div>
            <div class="result-item">
                <strong>記銘力:</strong> ${scores.registration}/3点
            </div>
            <div class="result-item">
                <strong>注意・計算:</strong> ${scores.attention}/5点
            </div>
            <div class="result-item">
                <strong>遅延再生:</strong> ${scores.recall}/3点
            </div>
            <div class="result-item">
                <strong>言語機能:</strong> ${scores.language}/8点
            </div>
            <div class="result-item">
                <strong>構成機能:</strong> ${scores.construction}/1点
            </div>
            <div class="result-item">
                <strong>MMSE総スコア:</strong> <span class="highlight">${totalScore}/30点</span>
            </div>
            <div class="alert ${alertClass}">
                <strong>解釈:</strong> ${interpretation}<br>
                <strong>推奨:</strong> ${recommendation}
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    showError(message) {
        const resultDiv = document.getElementById('mmseResult');
        if (resultDiv) {
            resultDiv.innerHTML = `<div class="alert alert-danger">${message}</div>`;
            resultDiv.style.display = 'block';
        }
    }

    reset() {
        ['orientation', 'registration', 'attention', 'recall', 'language', 'construction'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
        });
        const resultDiv = document.getElementById('mmseResult');
        if (resultDiv) resultDiv.style.display = 'none';
    }
}