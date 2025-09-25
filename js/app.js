/**
 * 訪問看護臨床ツールアプリケーション
 * SOLID原則に基づいて設計されたモジュラーアーキテクチャ
 */

// Single Responsibility Principle - 各クラスは単一の責任を持つ
class NavigationManager {
    constructor() {
        this.menuToggle = document.getElementById('menuToggle');
        this.navMenu = document.getElementById('navMenu');
        this.currentTool = 'welcome';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTool('welcome');
    }

    bindEvents() {
        // メニュートグル
        this.menuToggle?.addEventListener('click', () => this.toggleMenu());
        
        // ナビゲーションリンク
        document.querySelectorAll('[data-tool]').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const tool = e.currentTarget.getAttribute('data-tool');
                this.loadTool(tool);
                if (window.innerWidth <= 768) {
                    this.closeMenu();
                }
            });
        });

        // レスポンシブ対応
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.navMenu?.classList.remove('active');
            }
        });
    }

    toggleMenu() {
        this.navMenu?.classList.toggle('active');
    }

    closeMenu() {
        this.navMenu?.classList.remove('active');
    }

    loadTool(toolName) {
        this.currentTool = toolName;
        
        // 既存のツールセクションを非表示
        document.querySelectorAll('.tool-section').forEach(section => {
            section.classList.remove('active');
        });

        // ウェルカムセクションの表示/非表示
        const welcomeSection = document.getElementById('welcome');
        if (toolName === 'welcome') {
            welcomeSection?.classList.add('active');
            return;
        } else {
            welcomeSection?.classList.remove('active');
        }

        // ツールコンテナをクリア
        const container = document.getElementById('toolContainer');
        if (container) {
            container.innerHTML = '';
            
            // ツールインスタンスを作成
            const tool = ToolFactory.createTool(toolName);
            if (tool) {
                const toolElement = tool.render();
                toolElement.classList.add('tool-section', 'active', 'fade-in');
                container.appendChild(toolElement);
            }
        }
    }
}

// Open/Closed Principle - 拡張に開いて修正に閉じている
class BaseTool {
    constructor(name, title, description) {
        this.name = name;
        this.title = title;
        this.description = description;
    }

    render() {
        const section = document.createElement('section');
        section.innerHTML = `
            <h2><i class="${this.getIcon()}"></i> ${this.title}</h2>
            <p class="tool-description">${this.description}</p>
            ${this.renderContent()}
        `;
        // 入力の自動保存/復元
        this.restoreForm(section);
        this.bindAutosave(section);
        // 共通: 結果コピー/印刷ハンドラ（各ツールの結果DOMが存在すれば動作）
        setTimeout(() => {
            const result = section.querySelector('.result-container');
            if (result && !result.dataset.actionsBound) {
                const actions = document.createElement('div');
                actions.className = 'result-actions';
                actions.innerHTML = `
                    <button class="btn btn-sm" type="button">コピー</button>
                    <button class="btn btn-sm btn-secondary" type="button">印刷</button>
                `;
                result.insertAdjacentElement('afterend', actions);
                const [copyBtn, printBtn] = actions.querySelectorAll('button');
                copyBtn.addEventListener('click', () => {
                    const text = result.innerText.trim();
                    if (navigator.clipboard && text) {
                        navigator.clipboard.writeText(text);
                    }
                });
                printBtn.addEventListener('click', () => window.print());
                result.dataset.actionsBound = '1';
            }
        }, 0);
        return section;
    }

    storageKey() {
        return `vns:tool:${this.name}:form`;
    }

    restoreForm(section) {
        try {
            const saved = localStorage.getItem(this.storageKey());
            if (!saved) return;
            const obj = JSON.parse(saved);
            section.querySelectorAll('input, select, textarea').forEach(el => {
                if (!(el instanceof HTMLElement)) return;
                const id = el.id || el.name;
                if (!id || !(id in obj)) return;
                if (el.type === 'checkbox' || el.type === 'radio') {
                    el.checked = !!obj[id];
                } else {
                    el.value = obj[id];
                }
            });
        } catch {}
    }

    bindAutosave(section) {
        const handler = () => {
            const data = {};
            section.querySelectorAll('input, select, textarea').forEach(el => {
                if (!(el instanceof HTMLElement)) return;
                const id = el.id || el.name;
                if (!id) return;
                if (el.type === 'checkbox' || el.type === 'radio') {
                    data[id] = el.checked;
                } else {
                    data[id] = el.value;
                }
            });
            try { localStorage.setItem(this.storageKey(), JSON.stringify(data)); } catch {}
        };
        section.addEventListener('change', handler, true);
        section.addEventListener('input', handler, true);
    }

    renderContent() {
        return '<p>ツールの内容がここに表示されます。</p>';
    }

    getIcon() {
        return 'fas fa-tools';
    }
}

// Liskov Substitution Principle - 基底クラスを派生クラスで置き換え可能
class CADDCalculatorTool extends BaseTool {
    constructor() {
        super('cadd', 'CADD交換時期計算', 'リザーバー容量、流量、レスキュー量から交換時期を計算します。');
    }

    getIcon() {
        return 'fas fa-syringe';
    }

    renderContent() {
        return `
            <div class="form-row">
                <div class="form-group">
                    <label for="reservoirCapacity">リザーバー容量 (ml)</label>
                    <input type="number" id="reservoirCapacity" min="0" step="0.1" placeholder="例: 100">
                </div>
                <div class="form-group">
                    <label for="hourlyRate">1時間あたりの流量 (ml/h)</label>
                    <input type="number" id="hourlyRate" min="0" step="0.1" placeholder="例: 2.5">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="rescueFrequency">1日のレスキュー回数</label>
                    <input type="number" id="rescueFrequency" min="0" step="1" placeholder="例: 3">
                </div>
                <div class="form-group">
                    <label for="rescueVolume">1回のレスキュー量 (ml)</label>
                    <input type="number" id="rescueVolume" min="0" step="0.1" placeholder="例: 1.0">
                </div>
            </div>
            <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">計算実行</button>
            <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
            <div id="caddResult" class="result-container" style="display: none;"></div>
            <div class="calculator-instance" style="display: none;"></div>
        `;
    }

    render() {
        const section = super.render();
        const calculator = new CADDCalculator();
        const calculatorElement = section.querySelector('.calculator-instance');
        calculatorElement.calculator = calculator;
        calculatorElement.calculate = () => calculator.calculate();
        calculatorElement.reset = () => calculator.reset();
        return section;
    }
}

class NarcoticCalculatorTool extends BaseTool {
    constructor() {
        super('narcotic', '麻薬投与量計算', '各種麻薬の投与量と流量を計算します。');
    }

    getIcon() {
        return 'fas fa-pills';
    }

    renderContent() {
        return `
            <div class="form-row">
                <div class="form-group">
                    <label for="narcoticType">麻薬の種類</label>
                    <select id="narcoticType">
                        <option value="morphine">モルヒネ</option>
                        <option value="oxycodone">オキシコドン</option>
                        <option value="fentanyl">フェンタニル</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="narcoticAmount">麻薬の量 (mg)</label>
                    <input type="number" id="narcoticAmount" min="0" step="0.1" placeholder="例: 50">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="salineVolume">生理食塩水の量 (ml)</label>
                    <input type="number" id="salineVolume" min="0" step="0.1" placeholder="例: 50">
                </div>
                <div class="form-group">
                    <label for="targetHourlyDose">目標1時間投与量 (mg/h)</label>
                    <input type="number" id="targetHourlyDose" min="0" step="0.01" placeholder="例: 2.5">
                </div>
            </div>
            <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">計算実行</button>
            <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
            <div id="narcoticResult" class="result-container" style="display: none;"></div>
            <div class="calculator-instance" style="display: none;"></div>
        `;
    }

    render() {
        const section = super.render();
        const calculator = new NarcoticCalculator();
        const calculatorElement = section.querySelector('.calculator-instance');
        calculatorElement.calculator = calculator;
        calculatorElement.calculate = () => calculator.calculate();
        calculatorElement.reset = () => calculator.reset();
        return section;
    }
}

class HarrisBenedictTool extends BaseTool {
    constructor() {
        super('harris', 'Harris-Benedict式', '基礎代謝量を計算します。');
    }

    getIcon() {
        return 'fas fa-calculator';
    }

    renderContent() {
        return `
            <div class="form-row">
                <div class="form-group">
                    <label for="gender">性別</label>
                    <select id="gender">
                        <option value="male">男性</option>
                        <option value="female">女性</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="age">年齢</label>
                    <input type="number" id="age" min="0" max="120" placeholder="例: 65">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="weight">体重 (kg)</label>
                    <input type="number" id="weight" min="0" step="0.1" placeholder="例: 60.5">
                </div>
                <div class="form-group">
                    <label for="height">身長 (cm)</label>
                    <input type="number" id="height" min="0" step="0.1" placeholder="例: 165">
                </div>
            </div>
            <div class="form-group">
                <label for="activityLevel">活動レベル</label>
                <select id="activityLevel">
                    <option value="1.2">安静時（寝たきり）</option>
                    <option value="1.375">軽い活動（座位中心）</option>
                    <option value="1.55">中程度の活動</option>
                    <option value="1.725">重い活動</option>
                    <option value="1.9">非常に重い活動</option>
                </select>
            </div>
            <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">計算実行</button>
            <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
            <div id="harrisResult" class="result-container" style="display: none;"></div>
            <div class="calculator-instance" style="display: none;"></div>
        `;
    }

    render() {
        const section = super.render();
        const calculator = new HarrisBenedictCalculator();
        const calculatorElement = section.querySelector('.calculator-instance');
        calculatorElement.calculator = calculator;
        calculatorElement.calculate = () => calculator.calculate();
        calculatorElement.reset = () => calculator.reset();
        return section;
    }
}

class QSOFATool extends BaseTool {
    constructor() {
        super('qsofa', 'qSOFA（敗血症スコア）', '敗血症の重症度を評価します。');
    }

    getIcon() {
        return 'fas fa-heartbeat';
    }

    renderContent() {
        return `
            <div class="alert alert-info">
                <strong>qSOFA評価項目：</strong> 3項目中2項目以上該当で陽性（敗血症の可能性が高い）
            </div>
            <div class="form-group">
                <input type="checkbox" id="alteredMentality">
                <label for="alteredMentality">意識レベルの変化（GCS < 15）</label>
            </div>
            <div class="form-group">
                <input type="checkbox" id="systolicBP">
                <label for="systolicBP">収縮期血圧 ≤ 100mmHg</label>
            </div>
            <div class="form-group">
                <input type="checkbox" id="respiratoryRate">
                <label for="respiratoryRate">呼吸数 ≥ 22回/分</label>
            </div>
            <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').calculate()">評価実行</button>
            <button class="btn btn-secondary" onclick="this.parentElement.querySelector('.calculator-instance').reset()">リセット</button>
            <div id="qsofaResult" class="result-container" style="display: none;"></div>
            <div class="calculator-instance" style="display: none;"></div>
        `;
    }

    render() {
        const section = super.render();
        const calculator = new QSOFACalculator();
        const calculatorElement = section.querySelector('.calculator-instance');
        calculatorElement.calculator = calculator;
        calculatorElement.calculate = () => calculator.calculate();
        calculatorElement.reset = () => calculator.reset();
        return section;
    }
}

// Interface Segregation Principle - 使用しないインターフェースへの依存を強制しない
class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('globalSearch');
        this.tools = this.initializeToolData();
        this.init();
    }

    init() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
    }

    initializeToolData() {
        return [
            { name: 'cadd', title: 'CADD交換時期計算', keywords: ['cadd', 'ポンプ', '交換', '時期', 'リザーバー', '輸液', 'シリンジ', 'PCA', '持続皮下注'], icon: 'fas fa-syringe' },
            { name: 'narcotic', title: '麻薬投与量計算', keywords: ['麻薬', 'オピオイド', 'モルヒネ', 'オキシコドン', 'フェンタニル', '投与量', '鎮痛', '注射', '配合', '濃度'], icon: 'fas fa-pills' },
            { name: 'harris', title: 'Harris-Benedict式', keywords: ['harris', 'ハリス', '基礎代謝', 'bmr', '栄養', 'カロリー', 'TDEE'], icon: 'fas fa-calculator' },
            { name: 'mna', title: 'MNA評価', keywords: ['mna', '栄養', '評価', 'アセスメント', '高齢者'], icon: 'fas fa-apple-alt' },
            { name: 'qsofa', title: 'qSOFA', keywords: ['qsofa', '敗血症', 'sepsis', '重症度', '感染', 'ショック'], icon: 'fas fa-heartbeat' },
            { name: 'news', title: 'NEWS', keywords: ['news', '早期警告', 'スコア', '重症度', 'バイタル'], icon: 'fas fa-exclamation-triangle' },
            { name: 'ppi', title: 'PPI（がん予後指数）', keywords: ['ppi', 'がん', '予後', '指数', 'palliative', '緩和'], icon: 'fas fa-chart-line' },
            { name: 'bmi', title: 'BMI計算', keywords: ['bmi', '体格', '肥満', '体重', '身長'], icon: 'fas fa-weight' },
            { name: 'gcs', title: 'Glasgow Coma Scale', keywords: ['gcs', '意識', '昏睡', 'グラスゴー', '神経', 'EVM'], icon: 'fas fa-brain' },
            { name: 'mmse', title: 'MMSE', keywords: ['mmse', '認知', '記憶', '認知症', '知能'], icon: 'fas fa-head-side-virus' },
            { name: 'sirs', title: 'SIRS評価', keywords: ['sirs', '全身性炎症', '感染', '発熱', '頻脈'], icon: 'fas fa-thermometer-full' },
            { name: 'wound', title: '創傷評価（DESIGN-R）', keywords: ['創傷', '褥瘡', 'design', 'DESIGN-R', 'wound', '皮膚'], icon: 'fas fa-band-aid' },
            { name: 'pain', title: '疼痛評価（NRS）', keywords: ['疼痛', '痛み', 'nrs', 'pain', '鎮痛', 'VAS', '突出痛', 'breakthrough'], icon: 'fas fa-exclamation-circle' },
            { name: 'barthel', title: 'Barthel Index（ADL）', keywords: ['barthel', 'adl', '日常生活', '自立度', '介護'], icon: 'fas fa-walking' },
            { name: 'ostomy', title: 'ストマケア（DET）', keywords: ['ストマ', 'ストーマ', 'オストミー', 'DET', '皮膚障害', '装具', '尿路', 'カットサイズ'], icon: 'fas fa-toilet' },
            { name: 'hf', title: '心不全評価（NYHA/Framingham/プロファイル）', keywords: ['心不全', 'NYHA', 'Framingham', 'うっ血', '起坐呼吸', 'PND', '体重増加', 'Warm', 'Cold', 'Wet', 'Dry'], icon: 'fas fa-heart' },
            { name: 'resp', title: '呼吸評価（mMRC/CAT/SF）', keywords: ['呼吸', 'mMRC', 'CAT', 'SpO2', 'FiO2', '酸素', '酸素濃度', '在宅酸素', 'HOT', 'S/F', 'SF比', 'ROX', 'ROX index', '呼吸数', 'RR'], icon: 'fas fa-lungs' },
            { name: 'alsfrs', title: 'ALS-FRS-R', keywords: ['ALS', 'FRS', '球麻痺', '巧緻運動', '呼吸'], icon: 'fas fa-dna' },
            { name: 'braden', title: 'Braden褥瘡リスク', keywords: ['ブレーデン', '褥瘡', '圧迫', 'スキン', '皮膚', 'リスク'], icon: 'fas fa-procedures' },
            { name: 'morse', title: 'Morse転倒リスク', keywords: ['モース', '転倒', 'リスク', '歩行', '補助具', '点滴'], icon: 'fas fa-person-falling' },
            { name: 'esas', title: 'ESAS-r 症状評価', keywords: ['ESAS', '症状', '苦痛', 'palliative', '緩和'], icon: 'fas fa-notes-medical' },
            { name: 'pps', title: 'PPS', keywords: ['Palliative', 'Performance', '在宅', '緩和', '機能'], icon: 'fas fa-percentage' },
            { name: 'crcl', title: 'Cockcroft-Gault（CrCl）', keywords: ['腎機能', 'クレアチニン', 'CrCl', '腎不全', '投薬調整'], icon: 'fas fa-vial' },
            { name: 'delirium4', title: '急性意識障害（4項）', keywords: ['せん妄', '意識', '見当識', '注意', '急性変化'], icon: 'fas fa-bed' },
            { name: 'sarcf', title: 'SARC-F（サルコペニア）', keywords: ['サルコペニア', '筋力', '転倒', '歩行', '階段'], icon: 'fas fa-dumbbell' },
            { name: 'must', title: 'MUST 栄養リスク', keywords: ['栄養', 'MUST', '体重減少', 'BMI', '急性疾患'], icon: 'fas fa-seedling' },
            { name: 'cfs', title: 'CFS（Clinical Frailty Scale）', keywords: ['フレイル', 'CFS', '虚弱', '介護', 'ADL'], icon: 'fas fa-user-injured' },
            { name: 'phq9', title: 'PHQ-9（抑うつ）', keywords: ['抑うつ', 'うつ', 'メンタル', 'スクリーニング'], icon: 'fas fa-face-meh' },
            { name: 'adrop', title: 'A-DROP（肺炎重症度）', keywords: ['肺炎', 'A-DROP', 'JRS', 'SpO2', 'BUN', '血圧', '見当識'], icon: 'fas fa-lungs' },
            { name: 'rasspal', title: 'RASS-PAL（鎮静評価）', keywords: ['鎮静', 'RASS', '緩和', 'せん妄', '鎮静目標'], icon: 'fas fa-bed' },
            { name: 'cam', title: 'CAM（せん妄）', keywords: ['せん妄', 'delirium', 'CAM', '注意', '意識', '急性変化'], icon: 'fas fa-brain' },
            { name: 'minicog', title: 'Mini-Cog（認知）', keywords: ['認知', 'Mini-Cog', '時計描画', '記銘', 'スクリーニング'], icon: 'fas fa-brain' },
            { name: 'cci', title: 'Charlson Comorbidity Index', keywords: ['Charlson', 'CCI', '併存疾患', '予後', '重み付け'], icon: 'fas fa-list-check' },
            { name: 'stoppstart', title: 'STOPP/START（参考）', keywords: ['STOPP', 'START', '高齢者', '処方', '適正', 'ポリファーマシー'], icon: 'fas fa-prescription-bottle-medical' },
            { name: 'beers', title: 'Beers Criteria（参考）', keywords: ['Beers', '高齢者', '不適切処方', 'ガイドライン'], icon: 'fas fa-book-medical' },
            { name: 'stopbang', title: 'STOP-Bang（OSA）', keywords: ['無呼吸', '睡眠', 'いびき', 'STOP-Bang', 'OSA'], icon: 'fas fa-moon' },
            { name: 'acp', title: 'DNAR/ACP支援', keywords: ['DNAR', 'ACP', '意思決定', 'Advance Care Planning', 'ポリシー'], icon: 'fas fa-file-signature' },
            { name: 'moca', title: 'MoCA認知評価', keywords: ['moca', 'mci', '認知', '軽度認知障害', 'montreal', 'モカ'], icon: 'fas fa-brain' },
            // 追加: Zarit-8 / OHAT-J / SAS
            { name: 'zarit8', title: 'Zarit-8（介護負担）', keywords: ['介護者','負担','zarit','家族','レスパイト'], icon: 'fas fa-users' },
            { name: 'ohatj', title: 'OHAT-J（口腔評価）', keywords: ['口腔','歯科','ohat','オーラル','義歯','口腔ケア'], icon: 'fas fa-tooth' },
            { name: 'sas', title: 'SAS（身体活動能力早見）', keywords: ['運動','活動','mets','手術前','体力','耐久'], icon: 'fas fa-person-running' },
            // 追加: 酸素ボンベ時間 / ABCD-Stoma / SkinTear / PAINAD / AbbeyPain
            { name: 'o2time', title: '酸素ボンベ残時間', keywords: ['酸素','O2','ボンベ','残量','圧力','流量','時間','在宅酸素','HOT','残圧','残時間'], icon: 'fas fa-clock' },
            { name: 'abcdstoma', title: 'ABCD-Stoma評価', keywords: ['ABCD','stoma','ストマ','ストーマ','皮膚','合併症','リーク','ケア'], icon: 'fas fa-toilet' },
            { name: 'skintear', title: 'Skin Tear（ISTAP）', keywords: ['スキンテア','皮膚裂傷','ISTAP','創傷','皮膚'], icon: 'fas fa-band-aid' },
            { name: 'painad', title: 'PAINAD（認知症疼痛）', keywords: ['PAINAD','痛み','疼痛','認知症','行動','評価'], icon: 'fas fa-face-frown' },
            { name: 'abbeypain', title: 'Abbey Pain Scale', keywords: ['Abbey','痛み','疼痛','認知症','行動','評価'], icon: 'fas fa-clipboard-list' },
            // 疼痛拡張: OME/BT, CPOT, BPS
            { name: 'ome', title: 'オピオイド等価換算（OME/BT）', keywords: ['OME','等価換算','経口モルヒネ','モルヒネ換算','ブレイクスルー','BT','rescue','breakthrough','オピオイド','鎮痛','換算'], icon: 'fas fa-scale-balanced' },
            { name: 'cpot', title: 'CPOT（非言語的疼痛）', keywords: ['CPOT','疼痛','表情','筋緊張','体動','人工呼吸器','非言語','評価'], icon: 'fas fa-face-grimace' },
            { name: 'bps', title: 'BPS（Behavioral Pain Scale）', keywords: ['BPS','疼痛','表情','上肢','人工呼吸器','行動','非言語'], icon: 'fas fa-person' }
        ];
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.clearSearchResults();
            return;
        }

        const results = this.searchTools(query.toLowerCase());
        this.displaySearchResults(results);
    }

    searchTools(query) {
        return this.tools.filter(tool => 
            tool.title.toLowerCase().includes(query) ||
            tool.keywords.some(keyword => keyword.toLowerCase().includes(query))
        );
    }

    displaySearchResults(results) {
        // 既存の検索結果をクリア
        this.clearSearchResults();
        
        if (results.length === 0) {
            this.showNoResults();
            return;
        }

        // 検索結果を表示
        const container = document.getElementById('toolContainer');
        const welcomeSection = document.getElementById('welcome');
        
        // ウェルカムセクションを非表示
        if (welcomeSection) {
            welcomeSection.classList.remove('active');
        }

        // 既存のツールセクションを非表示
        document.querySelectorAll('.tool-section').forEach(section => {
            section.classList.remove('active');
        });

        // 検索結果セクションを作成
        const searchResultsSection = document.createElement('section');
        searchResultsSection.className = 'tool-section active fade-in';
        searchResultsSection.id = 'searchResults';
        
        let resultsHTML = `
            <h2><i class="fas fa-search"></i> 検索結果 (${results.length}件)</h2>
            <div class="search-results-grid">
        `;
        
        results.forEach(tool => {
            resultsHTML += `
                <div class="search-result-item" data-tool="${tool.name}">
                    <div class="search-result-header">
                        <i class="${tool.icon}"></i>
                        <h3>${tool.title}</h3>
                    </div>
                    <p class="search-result-keywords">
                        キーワード: ${tool.keywords.join(', ')}
                    </p>
                    <button class="btn btn-sm" onclick="window.searchManager.selectTool('${tool.name}')">
                        ツールを開く
                    </button>
                </div>
            `;
        });
        
        resultsHTML += '</div>';
        searchResultsSection.innerHTML = resultsHTML;
        
        if (container) {
            container.innerHTML = '';
            container.appendChild(searchResultsSection);
        }
    }

    showNoResults() {
        const container = document.getElementById('toolContainer');
        const welcomeSection = document.getElementById('welcome');
        
        if (welcomeSection) {
            welcomeSection.classList.remove('active');
        }

        document.querySelectorAll('.tool-section').forEach(section => {
            section.classList.remove('active');
        });

        const noResultsSection = document.createElement('section');
        noResultsSection.className = 'tool-section active fade-in';
        noResultsSection.id = 'noResults';
        noResultsSection.innerHTML = `
            <h2><i class="fas fa-search"></i> 検索結果</h2>
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                該当するツールが見つかりませんでした。別のキーワードで検索してみてください。
            </div>
            <div class="search-suggestions">
                <h4>検索のヒント:</h4>
                <ul>
                    <li>「CADD」「ポンプ」- CADD交換時期計算</li>
                    <li>「麻薬」「モルヒネ」- 麻薬投与量計算</li>
                    <li>「栄養」「MNA」- 栄養評価ツール</li>
                    <li>「敗血症」「qSOFA」- 重症度評価</li>
                    <li>「意識」「GCS」- 意識レベル評価</li>
                </ul>
            </div>
        `;
        
        if (container) {
            container.innerHTML = '';
            container.appendChild(noResultsSection);
        }
    }

    clearSearchResults() {
        const searchResults = document.getElementById('searchResults');
        const noResults = document.getElementById('noResults');
        
        if (searchResults) {
            searchResults.remove();
        }
        if (noResults) {
            noResults.remove();
        }
        
        // ウェルカムセクションを表示
        const welcomeSection = document.getElementById('welcome');
        if (welcomeSection && this.searchInput && !this.searchInput.value.trim()) {
            welcomeSection.classList.add('active');
        }
    }

    selectTool(toolName) {
        // 検索入力をクリア
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        
        // NavigationManagerのloadToolメソッドを呼び出し
        if (window.navigationManager) {
            window.navigationManager.loadTool(toolName);
        }
    }
}

// Dependency Inversion Principle - 高レベルモジュールは低レベルモジュールに依存しない
class ToolFactory {
    static createTool(toolName) {
        const toolMap = {
            'cadd': () => new CADDCalculatorTool(),
            'narcotic': () => new NarcoticCalculatorTool(),
            'harris': () => new HarrisBenedictTool(),
            'mna': () => new MNATool(),
            'qsofa': () => new QSOFATool(),
            'news': () => new NEWSTool(),
            'ppi': () => new PPITool(),
            'bmi': () => new BMITool(),
            'gcs': () => new GCSTool(),
            'mmse': () => new MMSETool(),
            'sirs': () => new SIRSTool(),
            'wound': () => new WoundAssessmentTool(),
            'pain': () => new PainAssessmentTool(),
            'barthel': () => new ADLAssessmentTool(),
            'ostomy': () => new OstomyTool(),
            'hf': () => new HeartFailureTool(),
            'resp': () => new RespiratoryTool(),
            'alsfrs': () => new ALSFRSTool(),
            'braden': () => new BradenTool(),
            'morse': () => new MorseFallTool(),
            'esas': () => new ESASTool(),
            'pps': () => new PPSTool(),
            'crcl': () => new CrClTool(),
            'delirium4': () => new Delirium4Tool(),
            'sarcf': () => new SARCFTool(),
            'must': () => new MUSTTool(),
            'cfs': () => new CFSTool(),
            'phq9': () => new PHQ9Tool(),
            'adrop': () => new ADROPTTool(),
            'rasspal': () => new RASSPALTool(),
            'cam': () => new CAMTool(),
            'minicog': () => new MiniCogTool(),
            'cci': () => new CharlsonTool(),
            'stoppstart': () => new STOPPSTARTTool(),
            'beers': () => new BeersTool(),
            'stopbang': () => new STOPBangTool(),
            'acp': () => new ACPTool(),
            'moca': () => new MoCATool(),
            // 追加: Zarit-8 / OHAT-J / SAS
            'zarit8': () => new Zarit8Tool(),
            'ohatj': () => new OHATJTool(),
            'sas': () => new SASTool(),
            // 追加: 酸素ボンベ時間 / ABCD-Stoma / SkinTear / PAINAD / AbbeyPain
            'o2time': () => new O2TimeTool(),
            'abcdstoma': () => new ABCDStomaTool(),
            'skintear': () => new SkinTearTool(),
            'painad': () => new PAINADTool(),
            'abbeypain': () => new AbbeyPainTool(),
            // 疼痛拡張
            'ome': () => new OpioidEquivalenceTool(),
            'cpot': () => new CPOTTool(),
            'bps': () => new BPSTool(),
        };

        const toolCreator = toolMap[toolName];
        return toolCreator ? toolCreator() : null;
    }
}

// 計算機クラス群
class CADDCalculator {
    calculate() {
        const capacity = parseFloat(document.getElementById('reservoirCapacity')?.value) || 0;
        const hourlyRate = parseFloat(document.getElementById('hourlyRate')?.value) || 0;
        const rescueFreq = parseInt(document.getElementById('rescueFrequency')?.value) || 0;
        const rescueVol = parseFloat(document.getElementById('rescueVolume')?.value) || 0;

        if (capacity <= 0 || hourlyRate <= 0) {
            this.showError('リザーバー容量と1時間あたりの流量を正しく入力してください。');
            return;
        }

        const dailyRescueVolume = rescueFreq * rescueVol;
        const dailyTotalVolume = (hourlyRate * 24) + dailyRescueVolume;
        const daysUntilChange = capacity / dailyTotalVolume;
        const hoursUntilChange = daysUntilChange * 24;

        this.displayResult({
            capacity,
            hourlyRate,
            dailyRescueVolume,
            dailyTotalVolume,
            daysUntilChange,
            hoursUntilChange
        });
    }

    displayResult(data) {
        const resultDiv = document.getElementById('caddResult');
        if (!resultDiv) return;

        resultDiv.innerHTML = `
            <h3>計算結果</h3>
            <div class="result-item">
                <strong>リザーバー容量:</strong> ${data.capacity} ml
            </div>
            <div class="result-item">
                <strong>1時間あたりの流量:</strong> ${data.hourlyRate} ml/h
            </div>
            <div class="result-item">
                <strong>1日のレスキュー総量:</strong> ${data.dailyRescueVolume} ml
            </div>
            <div class="result-item">
                <strong>1日の総使用量:</strong> ${data.dailyTotalVolume.toFixed(1)} ml
            </div>
            <div class="result-item">
                <strong>交換までの時間:</strong> <span class="highlight">${data.hoursUntilChange.toFixed(1)} 時間</span>
            </div>
            <div class="result-item">
                <strong>交換までの日数:</strong> <span class="highlight">${data.daysUntilChange.toFixed(1)} 日</span>
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    showError(message) {
        const resultDiv = document.getElementById('caddResult');
        if (resultDiv) {
            resultDiv.innerHTML = `<div class="alert alert-danger">${message}</div>`;
            resultDiv.style.display = 'block';
        }
    }

    reset() {
        ['reservoirCapacity', 'hourlyRate', 'rescueFrequency', 'rescueVolume'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
        });
        const resultDiv = document.getElementById('caddResult');
        if (resultDiv) resultDiv.style.display = 'none';
    }
}

class NarcoticCalculator {
    calculate() {
        const type = document.getElementById('narcoticType')?.value;
        const amount = parseFloat(document.getElementById('narcoticAmount')?.value) || 0;
        const saline = parseFloat(document.getElementById('salineVolume')?.value) || 0;
        const targetDose = parseFloat(document.getElementById('targetHourlyDose')?.value) || 0;

        if (amount <= 0 || saline <= 0 || targetDose <= 0) {
            this.showError('すべての値を正しく入力してください。');
            return;
        }

        const totalVolume = saline;
        const concentration = amount / totalVolume; // mg/ml
        const requiredFlowRate = targetDose / concentration; // ml/h

        this.displayResult({
            type,
            amount,
            saline,
            totalVolume,
            concentration,
            targetDose,
            requiredFlowRate
        });
    }

    displayResult(data) {
        const typeNames = {
            'morphine': 'モルヒネ',
            'oxycodone': 'オキシコドン',
            'fentanyl': 'フェンタニル'
        };

        const resultDiv = document.getElementById('narcoticResult');
        if (!resultDiv) return;

        resultDiv.innerHTML = `
            <h3>計算結果</h3>
            <div class="result-item">
                <strong>麻薬の種類:</strong> ${typeNames[data.type]}
            </div>
            <div class="result-item">
                <strong>麻薬の量:</strong> ${data.amount} mg
            </div>
            <div class="result-item">
                <strong>生理食塩水の量:</strong> ${data.saline} ml
            </div>
            <div class="result-item">
                <strong>薬液濃度:</strong> ${data.concentration.toFixed(3)} mg/ml
            </div>
            <div class="result-item">
                <strong>目標投与量:</strong> ${data.targetDose} mg/h
            </div>
            <div class="result-item">
                <strong>必要流量:</strong> <span class="highlight">${data.requiredFlowRate.toFixed(2)} ml/h</span>
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    showError(message) {
        const resultDiv = document.getElementById('narcoticResult');
        if (resultDiv) {
            resultDiv.innerHTML = `<div class="alert alert-danger">${message}</div>`;
            resultDiv.style.display = 'block';
        }
    }

    reset() {
        ['narcoticType', 'narcoticAmount', 'salineVolume', 'targetHourlyDose'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = element.tagName === 'SELECT' ? element.options[0].value : '';
        });
        const resultDiv = document.getElementById('narcoticResult');
        if (resultDiv) resultDiv.style.display = 'none';
    }
}

class HarrisBenedictCalculator {
    calculate() {
        const gender = document.getElementById('gender')?.value;
        const age = parseInt(document.getElementById('age')?.value) || 0;
        const weight = parseFloat(document.getElementById('weight')?.value) || 0;
        const height = parseFloat(document.getElementById('height')?.value) || 0;
        const activityLevel = parseFloat(document.getElementById('activityLevel')?.value) || 1.2;

        if (age <= 0 || weight <= 0 || height <= 0) {
            this.showError('年齢、体重、身長を正しく入力してください。');
            return;
        }

        let bmr;
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }

        const tdee = bmr * activityLevel;
        const bmi = weight / Math.pow(height / 100, 2);

        this.displayResult({
            gender,
            age,
            weight,
            height,
            activityLevel,
            bmr,
            tdee,
            bmi
        });
    }

    displayResult(data) {
        const genderNames = { 'male': '男性', 'female': '女性' };
        const activityNames = {
            '1.2': '安静時（寝たきり）',
            '1.375': '軽い活動（座位中心）',
            '1.55': '中程度の活動',
            '1.725': '重い活動',
            '1.9': '非常に重い活動'
        };

        const resultDiv = document.getElementById('harrisResult');
        if (!resultDiv) return;

        resultDiv.innerHTML = `
            <h3>計算結果</h3>
            <div class="result-item">
                <strong>性別:</strong> ${genderNames[data.gender]}
            </div>
            <div class="result-item">
                <strong>年齢:</strong> ${data.age} 歳
            </div>
            <div class="result-item">
                <strong>体重:</strong> ${data.weight} kg
            </div>
            <div class="result-item">
                <strong>身長:</strong> ${data.height} cm
            </div>
            <div class="result-item">
                <strong>BMI:</strong> ${data.bmi.toFixed(1)}
            </div>
            <div class="result-item">
                <strong>活動レベル:</strong> ${activityNames[data.activityLevel.toString()]}
            </div>
            <div class="result-item">
                <strong>基礎代謝量（BMR）:</strong> <span class="highlight">${data.bmr.toFixed(0)} kcal/日</span>
            </div>
            <div class="result-item">
                <strong>総消費カロリー（TDEE）:</strong> <span class="highlight">${data.tdee.toFixed(0)} kcal/日</span>
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    showError(message) {
        const resultDiv = document.getElementById('harrisResult');
        if (resultDiv) {
            resultDiv.innerHTML = `<div class="alert alert-danger">${message}</div>`;
            resultDiv.style.display = 'block';
        }
    }

    reset() {
        ['gender', 'age', 'weight', 'height', 'activityLevel'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = element.tagName === 'SELECT' ? element.options[0].value : '';
        });
        const resultDiv = document.getElementById('harrisResult');
        if (resultDiv) resultDiv.style.display = 'none';
    }
}

class QSOFACalculator {
    calculate() {
        const alteredMentality = document.getElementById('alteredMentality')?.checked || false;
        const systolicBP = document.getElementById('systolicBP')?.checked || false;
        const respiratoryRate = document.getElementById('respiratoryRate')?.checked || false;

        const score = [alteredMentality, systolicBP, respiratoryRate].filter(Boolean).length;
        const isPositive = score >= 2;

        this.displayResult({
            alteredMentality,
            systolicBP,
            respiratoryRate,
            score,
            isPositive
        });
    }

    displayResult(data) {
        const resultDiv = document.getElementById('qsofaResult');
        if (!resultDiv) return;

        const alertClass = data.isPositive ? 'alert-danger' : 'alert-success';
        const resultText = data.isPositive ? '陽性（敗血症の可能性が高い）' : '陰性';

        resultDiv.innerHTML = `
            <h3>qSOFA評価結果</h3>
            <div class="result-item">
                <strong>意識レベルの変化:</strong> ${data.alteredMentality ? '該当' : '非該当'}
            </div>
            <div class="result-item">
                <strong>収縮期血圧 ≤ 100mmHg:</strong> ${data.systolicBP ? '該当' : '非該当'}
            </div>
            <div class="result-item">
                <strong>呼吸数 ≥ 22回/分:</strong> ${data.respiratoryRate ? '該当' : '非該当'}
            </div>
            <div class="result-item">
                <strong>合計スコア:</strong> <span class="highlight">${data.score}/3</span>
            </div>
            <div class="alert ${alertClass}">
                <strong>結果:</strong> ${resultText}
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    reset() {
        ['alteredMentality', 'systolicBP', 'respiratoryRate'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.checked = false;
        });
        const resultDiv = document.getElementById('qsofaResult');
        if (resultDiv) resultDiv.style.display = 'none';
    }
}

// アプリケーション初期化
class App {
    constructor() {
        this.navigationManager = new NavigationManager();
        this.searchManager = new SearchManager();
        
        // グローバルアクセス用
        window.navigationManager = this.navigationManager;
        window.searchManager = this.searchManager;
    }
}

// DOMContentLoaded時にアプリケーションを初期化
document.addEventListener('DOMContentLoaded', () => {
    new App();
});