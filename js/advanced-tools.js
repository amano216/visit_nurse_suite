/**
 * 高度な臨床評価ツール
 * 感染症、創傷、疼痛、ADL評価などの追加ツール
 */

// SIRS（全身性炎症反応症候群）評価ツール
class SIRSTool extends BaseTool {
    constructor() {
        super('sirs', 'SIRS評価', '全身性炎症反応症候群を評価します。');
    }

    getIcon() {
        return 'fas fa-thermometer-full';
    }

    renderContent() {
        return `
            <div class="alert alert-info">
                <strong>SIRS（全身性炎症反応症候群）:</strong> 以下の4項目中2項目以上該当でSIRS陽性
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="bodyTemp">体温 (℃)</label>
                    <input type="number" id="bodyTemp" step="0.1" placeholder="例: 37.5">
                    <small>正常範囲: 36.0-37.5℃</small>
                </div>
                <div class="form-group">
                    <label for="heartRateSirs">心拍数 (回/分)</label>
                    <input type="number" id="heartRateSirs" placeholder="例: 95">
                    <small>正常範囲: 60-100回/分</small>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="respiratoryRateSirs">呼吸数 (回/分)</label>
                    <input type="number" id="respiratoryRateSirs" placeholder="例: 22">
                    <small>正常範囲: 12-20回/分</small>
                </div>
                <div class="form-group">
                    <label for="wbcCount">白血球数 (/μL)</label>
                    <input type="number" id="wbcCount" placeholder="例: 12000">
                    <small>正常範囲: 4000-11000/μL</small>
                </div>
            </div>

            <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
            <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
            <div id="sirsResult" class="result-container" style="display: none;"></div>
            <div class="calculator-instance" style="display: none;"></div>
        `;
    }

    render() {
        const section = super.render();
        const calculator = new SIRSCalculator();
        const calculatorElement = section.querySelector('.calculator-instance');
        calculatorElement.calculator = calculator;
        calculatorElement.calculate = () => calculator.calculate();
        calculatorElement.reset = () => calculator.reset();
        return section;
    }
}

// 創傷評価ツール（DESIGN-R）
class WoundAssessmentTool extends BaseTool {
    constructor() {
        super('wound', '創傷評価（DESIGN-R）', '褥瘡・創傷の重症度を評価します。');
    }

    getIcon() {
        return 'fas fa-band-aid';
    }

    renderContent() {
        return `
            <div class="alert alert-info">
                <strong>DESIGN-R:</strong> 褥瘡の重症度分類システム（日本褥瘡学会）
            </div>

            <div class="form-group">
                <label for="woundDepth">Depth（深さ）</label>
                <select id="woundDepth">
                    <option value="0">皮膚損傷なし</option>
                    <option value="1">持続する発赤</option>
                    <option value="2">真皮までの部分的皮膚欠損</option>
                    <option value="3">皮下組織までの皮膚欠損</option>
                    <option value="4">皮下組織を越える深い創傷</option>
                    <option value="5">関節腔・体腔に至る創傷</option>
                </select>
            </div>

            <div class="form-group">
                <label for="woundExudate">Exudate（滲出液）</label>
                <select id="woundExudate">
                    <option value="0">なし</option>
                    <option value="1">少量</option>
                    <option value="2">中等量</option>
                    <option value="3">多量</option>
                </select>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="woundSize">Size（大きさ）長径 (cm)</label>
                    <input type="number" id="woundSize" min="0" step="0.1" placeholder="例: 5.0">
                </div>
                <div class="form-group">
                    <label for="woundInflammation">Inflammation（炎症/感染）</label>
                    <select id="woundInflammation">
                        <option value="0">なし</option>
                        <option value="1">炎症徴候あり</option>
                        <option value="2">膿</option>
                        <option value="3">蜂窩織炎・骨髄炎等</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="woundGranulation">Granulation（肉芽組織）</label>
                    <select id="woundGranulation">
                        <option value="0">良好</option>
                        <option value="1">やや不良</option>
                        <option value="2">不良</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="woundNecrosis">Necrosis（壊死組織）</label>
                    <select id="woundNecrosis">
                        <option value="0">なし</option>
                        <option value="1">白色・黄色</option>
                        <option value="2">黒色</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="woundPocket">Pocket（ポケット）</label>
                <select id="woundPocket">
                    <option value="0">なし</option>
                    <option value="1">あり</option>
                </select>
            </div>

            <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
            <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
            <div id="woundResult" class="result-container" style="display: none;"></div>
            <div class="calculator-instance" style="display: none;"></div>
        `;
    }

    render() {
        const section = super.render();
        const calculator = new WoundCalculator();
        const calculatorElement = section.querySelector('.calculator-instance');
        calculatorElement.calculator = calculator;
        calculatorElement.calculate = () => calculator.calculate();
        calculatorElement.reset = () => calculator.reset();
        return section;
    }
}

// 疼痛評価ツール（NRS/VAS）
class PainAssessmentTool extends BaseTool {
    constructor() {
        super('pain', '疼痛評価（NRS）', '数値評価スケールで疼痛を評価します。');
    }

    getIcon() {
        return 'fas fa-exclamation-circle';
    }

    renderContent() {
        return `
            <div class="alert alert-info">
                <strong>NRS（Numerical Rating Scale）:</strong> 0-10の数値で疼痛強度を評価
            </div>

            <div class="form-group">
                <label for="painScore">疼痛スコア (0-10)</label>
                <input type="range" id="painScore" min="0" max="10" value="0" class="pain-slider">
                <div class="pain-scale">
                    <span class="pain-value" id="painValue">0</span>
                    <div class="pain-labels">
                        <span>0: 痛みなし</span>
                        <span>5: 中等度の痛み</span>
                        <span>10: 想像できる最悪の痛み</span>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label for="painType">疼痛の性質</label>
                <select id="painType">
                    <option value="nociceptive">侵害受容性疼痛（切る・刺すような痛み）</option>
                    <option value="neuropathic">神経障害性疼痛（しびれ・電気が走るような痛み）</option>
                    <option value="mixed">混合性疼痛</option>
                    <option value="psychogenic">心因性疼痛</option>
                </select>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="painLocation">疼痛部位</label>
                    <input type="text" id="painLocation" placeholder="例: 腰部、右膝">
                </div>
                <div class="form-group">
                    <label for="painDuration">持続時間</label>
                    <select id="painDuration">
                        <option value="acute">急性（3ヶ月未満）</option>
                        <option value="chronic">慢性（3ヶ月以上）</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="painFrequency">頻度</label>
                <select id="painFrequency">
                    <option value="constant">持続性</option>
                    <option value="intermittent">間欠性</option>
                    <option value="breakthrough">突出痛</option>
                </select>
            </div>

            <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
            <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
            <div id="painResult" class="result-container" style="display: none;"></div>
            <div class="calculator-instance" style="display: none;"></div>
        `;
    }

    render() {
        const section = super.render();
        const calculator = new PainCalculator();
        const calculatorElement = section.querySelector('.calculator-instance');
        calculatorElement.calculator = calculator;
        calculatorElement.calculate = () => calculator.calculate();
        calculatorElement.reset = () => calculator.reset();
        
        // スライダーのイベントリスナーを追加
        section.addEventListener('input', (e) => {
            if (e.target.id === 'painScore') {
                const valueElement = section.querySelector('#painValue');
                if (valueElement) {
                    valueElement.textContent = e.target.value;
                    valueElement.className = `pain-value pain-level-${Math.floor(e.target.value / 3)}`;
                }
            }
        });
        
        return section;
    }
}

// Barthel Index（ADL評価）ツール
class ADLAssessmentTool extends BaseTool {
    constructor() {
        super('barthel', 'Barthel Index（ADL評価）', '日常生活動作の自立度を評価します。');
    }

    getIcon() {
        return 'fas fa-walking';
    }

    renderContent() {
        return `
            <div class="alert alert-info">
                <strong>Barthel Index:</strong> 日常生活動作（ADL）の自立度を評価する標準的なスケール（100点満点）
            </div>

            <div class="adl-items">
                <div class="form-group">
                    <label for="feeding">食事</label>
                    <select id="feeding">
                        <option value="0">全介助</option>
                        <option value="5">部分介助</option>
                        <option value="10">自立</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="bathing">入浴</label>
                    <select id="bathing">
                        <option value="0">要介助</option>
                        <option value="5">自立</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="grooming">整容</label>
                    <select id="grooming">
                        <option value="0">要介助</option>
                        <option value="5">自立</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="dressing">更衣</label>
                    <select id="dressing">
                        <option value="0">要介助</option>
                        <option value="5">部分介助</option>
                        <option value="10">自立</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="bowels">便コントロール</label>
                    <select id="bowels">
                        <option value="0">失禁状態</option>
                        <option value="5">時々失禁</option>
                        <option value="10">正常</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="bladder">尿コントロール</label>
                    <select id="bladder">
                        <option value="0">失禁状態</option>
                        <option value="5">時々失禁</option>
                        <option value="10">正常</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="toilet">トイレ動作</label>
                    <select id="toilet">
                        <option value="0">要介助</option>
                        <option value="5">部分介助</option>
                        <option value="10">自立</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="transfers">移乗</label>
                    <select id="transfers">
                        <option value="0">不可能</option>
                        <option value="5">かなりの介助</option>
                        <option value="10">軽度の介助</option>
                        <option value="15">自立</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="mobility">移動</label>
                    <select id="mobility">
                        <option value="0">不可能</option>
                        <option value="5">車椅子</option>
                        <option value="10">杖歩行</option>
                        <option value="15">自立歩行</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="stairs">階段昇降</label>
                    <select id="stairs">
                        <option value="0">不可能</option>
                        <option value="5">要介助</option>
                        <option value="10">自立</option>
                    </select>
                </div>
            </div>

            <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
            <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
            <div id="barthelResult" class="result-container" style="display: none;"></div>
            <div class="calculator-instance" style="display: none;"></div>
        `;
    }

    render() {
        const section = super.render();
        const calculator = new BarthelCalculator();
        const calculatorElement = section.querySelector('.calculator-instance');
        calculatorElement.calculator = calculator;
        calculatorElement.calculate = () => calculator.calculate();
        calculatorElement.reset = () => calculator.reset();
        return section;
    }
}

// 各計算クラスの実装
class SIRSCalculator {
    calculate() {
        const bodyTemp = parseFloat(document.getElementById('bodyTemp')?.value) || 0;
        const heartRate = parseInt(document.getElementById('heartRateSirs')?.value) || 0;
        const respiratoryRate = parseInt(document.getElementById('respiratoryRateSirs')?.value) || 0;
        const wbcCount = parseInt(document.getElementById('wbcCount')?.value) || 0;

        if (bodyTemp === 0 || heartRate === 0 || respiratoryRate === 0 || wbcCount === 0) {
            this.showError('すべての項目を入力してください。');
            return;
        }

        let score = 0;
        const criteria = {};

        // 体温基準
        if (bodyTemp < 36.0 || bodyTemp > 38.0) {
            score++;
            criteria.temperature = true;
        } else {
            criteria.temperature = false;
        }

        // 心拍数基準
        if (heartRate > 90) {
            score++;
            criteria.heartRate = true;
        } else {
            criteria.heartRate = false;
        }

        // 呼吸数基準
        if (respiratoryRate > 20) {
            score++;
            criteria.respiratoryRate = true;
        } else {
            criteria.respiratoryRate = false;
        }

        // 白血球数基準
        if (wbcCount < 4000 || wbcCount > 12000) {
            score++;
            criteria.wbcCount = true;
        } else {
            criteria.wbcCount = false;
        }

        this.displayResult(score, criteria, {
            bodyTemp, heartRate, respiratoryRate, wbcCount
        });
    }

    displayResult(score, criteria, values) {
        const resultDiv = document.getElementById('sirsResult');
        if (!resultDiv) return;

        const isPositive = score >= 2;
        const alertClass = isPositive ? 'alert-danger' : 'alert-success';
        const resultText = isPositive ? 'SIRS陽性' : 'SIRS陰性';

        resultDiv.innerHTML = `
            <h3>SIRS評価結果</h3>
            <div class="result-item">
                <strong>体温:</strong> ${values.bodyTemp}℃ 
                ${criteria.temperature ? '<span class="highlight">基準該当</span>' : '正常範囲'}
            </div>
            <div class="result-item">
                <strong>心拍数:</strong> ${values.heartRate}回/分 
                ${criteria.heartRate ? '<span class="highlight">基準該当</span>' : '正常範囲'}
            </div>
            <div class="result-item">
                <strong>呼吸数:</strong> ${values.respiratoryRate}回/分 
                ${criteria.respiratoryRate ? '<span class="highlight">基準該当</span>' : '正常範囲'}
            </div>
            <div class="result-item">
                <strong>白血球数:</strong> ${values.wbcCount}/μL 
                ${criteria.wbcCount ? '<span class="highlight">基準該当</span>' : '正常範囲'}
            </div>
            <div class="result-item">
                <strong>該当項目数:</strong> <span class="highlight">${score}/4項目</span>
            </div>
            <div class="alert ${alertClass}">
                <strong>結果:</strong> ${resultText}<br>
                ${isPositive ? '感染症や炎症の存在が疑われます。医師への報告を検討してください。' : '現時点でSIRSの基準は満たしていません。'}
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    showError(message) {
        const resultDiv = document.getElementById('sirsResult');
        if (resultDiv) {
            resultDiv.innerHTML = `<div class="alert alert-danger">${message}</div>`;
            resultDiv.style.display = 'block';
        }
    }

    reset() {
        ['bodyTemp', 'heartRateSirs', 'respiratoryRateSirs', 'wbcCount'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
        });
        const resultDiv = document.getElementById('sirsResult');
        if (resultDiv) resultDiv.style.display = 'none';
    }
}

class WoundCalculator {
    calculate() {
        // 深さ（Depth）は合計点に加えない
        const depth = document.getElementById('woundDepth')?.value || '0';
        // Exudate（滲出液）: なし=0, 少量=1, 中等量=3, 多量=6
        const exudateMap = { '0': 0, '1': 1, '2': 3, '3': 6 };
        const exudate = exudateMap[document.getElementById('woundExudate')?.value || '0'];
        // Size（大きさ）: 0=0, <4=3, 4~<16=6, 16~<36=8, 36~<64=9, 64~<100=12, ≧100=15
        const size = parseFloat(document.getElementById('woundSize')?.value) || 0;
        let sizeScore = 0;
        if (size === 0) sizeScore = 0;
        else if (size < 4) sizeScore = 3;
        else if (size < 16) sizeScore = 6;
        else if (size < 36) sizeScore = 8;
        else if (size < 64) sizeScore = 9;
        else if (size < 100) sizeScore = 12;
        else sizeScore = 15;
        // Inflammation/Infection（炎症/感染）
        // 0:なし=0, 1:炎症徴候あり=1, 2:臨界的定着疑い/膿=3, 3:全身性影響=9
        const inflammationMap = { '0': 0, '1': 1, '2': 3, '3': 9 };
        const inflammation = inflammationMap[document.getElementById('woundInflammation')?.value || '0'];
        // Granulation（肉芽組織）: 0:良好=0, 1:やや不良=3, 2:不良=6
        const granulationMap = { '0': 0, '1': 3, '2': 6 };
        const granulation = granulationMap[document.getElementById('woundGranulation')?.value || '0'];
        // Necrosis（壊死組織）: 0:なし=0, 1:白色・黄色=3, 2:黒色=6
        const necrosisMap = { '0': 0, '1': 3, '2': 6 };
        const necrosis = necrosisMap[document.getElementById('woundNecrosis')?.value || '0'];
        // Pocket（ポケット）: 0:なし=0, 1:<4=6, 2:4~<16=9, 3:16~<36=12, 4:≧36=24
        // UI上は「なし=0, あり=1」だが、詳細選択が必要な場合は拡張可
        const pocketMap = { '0': 0, '1': 6 };
        const pocket = pocketMap[document.getElementById('woundPocket')?.value || '0'];

        const totalScore = exudate + sizeScore + inflammation + granulation + necrosis + pocket;

        this.displayResult(totalScore, {
            depth, exudate, size, sizeScore, inflammation, granulation, necrosis, pocket
        });
    }

    displayResult(totalScore, values) {
        const resultDiv = document.getElementById('woundResult');
        if (!resultDiv) return;

        let severity, recommendation, alertClass;
        if (totalScore <= 3) {
            severity = '軽度';
            recommendation = '基本的な創傷ケアを継続してください。';
            alertClass = 'alert-success';
        } else if (totalScore <= 7) {
            severity = '中等度';
            recommendation = '専門的な創傷ケアが必要です。医師や皮膚・排泄ケア認定看護師への相談を検討してください。';
            alertClass = 'alert-warning';
        } else {
            severity = '重度';
            recommendation = '集中的な創傷管理が必要です。専門医への紹介を強く推奨します。';
            alertClass = 'alert-danger';
        }

        const depthTexts = ['皮膚損傷なし', '持続する発赤', '真皮まで', '皮下組織まで', '深い創傷', '関節腔・体腔まで'];
        const exudateTexts = ['なし', '少量', '中等量', '多量'];
        const inflammationTexts = ['なし', '炎症徴候', '膿', '蜂窩織炎等'];
        const granulationTexts = ['良好', 'やや不良', '不良'];
        const necrosisTexts = ['なし', '白色・黄色', '黒色'];
        const pocketTexts = ['なし', 'あり'];

        resultDiv.innerHTML = `
            <h3>創傷評価結果（DESIGN-R）</h3>
            <div class="result-item">
                <strong>深さ:</strong> ${depthTexts[values.depth]} (${values.depth}点)
            </div>
            <div class="result-item">
                <strong>滲出液:</strong> ${exudateTexts[values.exudate]} (${values.exudate}点)
            </div>
            <div class="result-item">
                <strong>大きさ:</strong> ${values.size}cm (${values.sizeScore}点)
            </div>
            <div class="result-item">
                <strong>炎症/感染:</strong> ${inflammationTexts[values.inflammation]} (${values.inflammation}点)
            </div>
            <div class="result-item">
                <strong>肉芽組織:</strong> ${granulationTexts[values.granulation]} (${values.granulation}点)
            </div>
            <div class="result-item">
                <strong>壊死組織:</strong> ${necrosisTexts[values.necrosis]} (${values.necrosis}点)
            </div>
            <div class="result-item">
                <strong>ポケット:</strong> ${pocketTexts[values.pocket]} (${values.pocket}点)
            </div>
            <div class="result-item">
                <strong>総スコア:</strong> <span class="highlight">${totalScore}点</span>
            </div>
            <div class="alert ${alertClass}">
                <strong>重症度:</strong> ${severity}<br>
                <strong>推奨:</strong> ${recommendation}
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    reset() {
        ['woundDepth', 'woundExudate', 'woundInflammation', 'woundGranulation', 'woundNecrosis', 'woundPocket'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.selectedIndex = 0;
        });
        const sizeElement = document.getElementById('woundSize');
        if (sizeElement) sizeElement.value = '';
        const resultDiv = document.getElementById('woundResult');
        if (resultDiv) resultDiv.style.display = 'none';
    }
}

class PainCalculator {
    calculate() {
        const painScore = parseInt(document.getElementById('painScore')?.value) || 0;
        const painType = document.getElementById('painType')?.value || '';
        const painLocation = document.getElementById('painLocation')?.value || '';
        const painDuration = document.getElementById('painDuration')?.value || '';
        const painFrequency = document.getElementById('painFrequency')?.value || '';

        this.displayResult({
            painScore, painType, painLocation, painDuration, painFrequency
        });
    }

    displayResult(values) {
        const resultDiv = document.getElementById('painResult');
        if (!resultDiv) return;

        let intensity, management, alertClass;
        if (values.painScore <= 3) {
            intensity = '軽度';
            management = '非薬物療法（冷罨法、温罨法、マッサージ等）、必要に応じて軽度の鎮痛薬';
            alertClass = 'alert-success';
        } else if (values.painScore <= 6) {
            intensity = '中等度';
            management = '鎮痛薬の定期投与、非薬物療法の併用を検討';
            alertClass = 'alert-warning';
        } else {
            intensity = '重度';
            management = '強力な鎮痛薬、医師への報告と治療方針の見直しが必要';
            alertClass = 'alert-danger';
        }

        const typeTexts = {
            'nociceptive': '侵害受容性疼痛',
            'neuropathic': '神経障害性疼痛',
            'mixed': '混合性疼痛',
            'psychogenic': '心因性疼痛'
        };

        const durationTexts = {
            'acute': '急性疼痛',
            'chronic': '慢性疼痛'
        };

        const frequencyTexts = {
            'constant': '持続性',
            'intermittent': '間欠性',
            'breakthrough': '突出痛'
        };

        resultDiv.innerHTML = `
            <h3>疼痛評価結果</h3>
            <div class="result-item">
                <strong>疼痛スコア:</strong> <span class="highlight">${values.painScore}/10</span>
            </div>
            <div class="result-item">
                <strong>疼痛強度:</strong> ${intensity}
            </div>
            <div class="result-item">
                <strong>疼痛の性質:</strong> ${typeTexts[values.painType] || values.painType}
            </div>
            <div class="result-item">
                <strong>疼痛部位:</strong> ${values.painLocation || '未記入'}
            </div>
            <div class="result-item">
                <strong>持続時間:</strong> ${durationTexts[values.painDuration] || values.painDuration}
            </div>
            <div class="result-item">
                <strong>頻度:</strong> ${frequencyTexts[values.painFrequency] || values.painFrequency}
            </div>
            <div class="alert ${alertClass}">
                <strong>推奨管理:</strong> ${management}
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    reset() {
        const painScore = document.getElementById('painScore');
        if (painScore) {
            painScore.value = 0;
            const painValue = document.getElementById('painValue');
            if (painValue) {
                painValue.textContent = '0';
                painValue.className = 'pain-value pain-level-0';
            }
        }
        ['painType', 'painDuration', 'painFrequency'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.selectedIndex = 0;
        });
        const painLocation = document.getElementById('painLocation');
        if (painLocation) painLocation.value = '';
        const resultDiv = document.getElementById('painResult');
        if (resultDiv) resultDiv.style.display = 'none';
    }
}

class BarthelCalculator {
    calculate() {
        const items = ['feeding', 'bathing', 'grooming', 'dressing', 'bowels', 'bladder', 
                      'toilet', 'transfers', 'mobility', 'stairs'];
        
        let totalScore = 0;
        const scores = {};
        
        items.forEach(item => {
            const element = document.getElementById(item);
            if (element) {
                const value = parseInt(element.value) || 0;
                scores[item] = value;
                totalScore += value;
            }
        });

        this.displayResult(totalScore, scores);
    }

    displayResult(totalScore, scores) {
        const resultDiv = document.getElementById('barthelResult');
        if (!resultDiv) return;

        let independence, recommendation, alertClass;
        if (totalScore >= 85) {
            independence = '自立';
            recommendation = '現在の機能を維持するための継続的な支援';
            alertClass = 'alert-success';
        } else if (totalScore >= 60) {
            independence = '軽度要介助';
            recommendation = '部分的な介助とリハビリテーションの継続';
            alertClass = 'alert-info';
        } else if (totalScore >= 40) {
            independence = '中等度要介助';
            recommendation = '日常的な介助とADL改善に向けた積極的な介入';
            alertClass = 'alert-warning';
        } else {
            independence = '重度要介助';
            recommendation = '包括的な介護サービスと専門的なケアが必要';
            alertClass = 'alert-danger';
        }

        const itemNames = {
            feeding: '食事',
            bathing: '入浴',
            grooming: '整容',
            dressing: '更衣',
            bowels: '便コントロール',
            bladder: '尿コントロール',
            toilet: 'トイレ動作',
            transfers: '移乗',
            mobility: '移動',
            stairs: '階段昇降'
        };

        let itemsHTML = '';
        Object.keys(scores).forEach(key => {
            itemsHTML += `
                <div class="result-item">
                    <strong>${itemNames[key]}:</strong> ${scores[key]}点
                </div>
            `;
        });

        resultDiv.innerHTML = `
            <h3>Barthel Index評価結果</h3>
            ${itemsHTML}
            <div class="result-item">
                <strong>総スコア:</strong> <span class="highlight">${totalScore}/100点</span>
            </div>
            <div class="alert ${alertClass}">
                <strong>自立度:</strong> ${independence}<br>
                <strong>推奨:</strong> ${recommendation}
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    reset() {
        const items = ['feeding', 'bathing', 'grooming', 'dressing', 'bowels', 'bladder', 
                      'toilet', 'transfers', 'mobility', 'stairs'];
        
        items.forEach(item => {
            const element = document.getElementById(item);
            if (element) element.selectedIndex = 0;
        });
        
        const resultDiv = document.getElementById('barthelResult');
        if (resultDiv) resultDiv.style.display = 'none';
    }
}