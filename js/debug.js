// Runtime error banner (externalized to avoid CSP inline blocking)
(function(){
  function showBanner(msg){
    try {
      var el = document.getElementById('runtimeErrorBanner');
      if (!el) return;
      el.innerHTML = '<strong>エラー:</strong> ' + String(msg) + '<br><small>詳しくはブラウザのConsoleを確認してください。</small>';
      el.style.display = 'block';
    } catch(_) {}
  }
  window.addEventListener('error', function(e){
    try {
      var src = e.filename ? (' [' + e.filename.split('/').pop() + ':' + e.lineno + ']') : '';
      showBanner((e && e.message) ? (e.message + src) : '不明なエラー');
    } catch(_) {}
  });
  window.addEventListener('unhandledrejection', function(e){
    try { showBanner('Unhandled Promise rejection: ' + String(e && e.reason)); } catch(_) {}
  });
})();
