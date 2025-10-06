// -------- DNAR/ACP支援チェックリスト --------
class ACPTool extends BaseTool {
  constructor(){ super('acp','DNAR/ACP支援チェック','意思決定支援・方針確認のチェックリスト（自施設ポリシーに準拠）。'); }
  getIcon(){ return 'fas fa-file-signature'; }
  renderContent(){
    const chk=(id,txt)=>`<div class="form-group"><label><input type="checkbox" id="${id}"> ${txt}</label></div>`;
    return `
      <div class="alert alert-info"><i class="fas fa-info-circle"></i> 医療判断ではありません。施設の手順書/主治医の指示に従ってください。</div>
      <div class="assessment-section">
        <h4><i class="fas fa-users"></i> 事前準備</h4>
        ${chk('acpDm','意思決定代行者/キーパーソンの確認')}
        ${chk('acpCom','コミュニケーション能力/理解度の評価')}
        ${chk('acpInfo','現状/予後/選択肢の情報提供')}
        <h4><i class="fas fa-heart"></i> 目標と希望</h4>
        ${chk('acpGoal','治療目標（延命/緩和/快適優先）')}
        ${chk('acpCode','コードステータス（DNAR含む）確認')}
        ${chk('acpHosp','入院/在宅の希望と条件')}
        <h4><i class="fas fa-notes-medical"></i> 具体的選好</h4>
        ${chk('acpVent','人工呼吸/非侵襲換気の希望')}
        ${chk('acpFeeding','経管/静脈栄養・補液の方針')}
        ${chk('acpTrans','輸血/抗菌薬/検査の範囲')}
        <h4><i class="fas fa-file-signature"></i> 文書と共有</h4>
        ${chk('acpDoc','同意書/POLST/指示書の有無と保管')}
        ${chk('acpShare','家族/多職種/救急隊への共有')}
        <div class="form-group"><label for="acpNotes">メモ</label><textarea id="acpNotes" rows="4" placeholder="特記事項や合意内容..." style="width:100%"></textarea></div>
      </div>
      <button class="btn" onclick="this.parentElement.querySelector('.calculator-instance').exportSummary()">サマリーをコピー</button>
      <div class="calculator-instance" style="display:none"></div>`;
  }
  render(){ const s=super.render(); const inst=new ACPHelper(); const el=s.querySelector('.calculator-instance'); el.exportSummary=()=>inst.exportSummary(); return s; }
}
class ACPHelper {
  exportSummary(){
    const ids=['acpDm','acpCom','acpInfo','acpGoal','acpCode','acpHosp','acpVent','acpFeeding','acpTrans','acpDoc','acpShare'];
    const done = ids.filter(id=> document.getElementById(id)?.checked).map(id=> document.querySelector(`label[for="${id}"]`)?.innerText || document.getElementById(id).parentElement.innerText );
    const notes = document.getElementById('acpNotes')?.value || '';
    const text = `DNAR/ACP チェックリスト\n完了:\n- ${done.join('\n- ')}\nメモ:\n${notes}`;
    navigator.clipboard?.writeText(text);
    alert('サマリーをコピーしました');
  }
}
