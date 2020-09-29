// ==UserScript==
// @name            HV - Unshrinable Figurines
// @namespace       Hentai Verse
// @description     Trys to prevent you from shrining figurines
// @icon            http://e-hentai.org/favicon.ico
// @include         *hentaiverse.org/?s=Bazaar&ss=is*
// @include         *hentaiverse.org/?s=Bazaar&ss=ss*
// @include         *hentaiverse.org/?s=Bazaar&ss=mm*
// @author-maincode oohmrparis
// @author-script   LostLogia4
// @version         1.2
// ==/UserScript==

var figurine = document.querySelectorAll('#item_pane tr td:first-Child');
for(i = 0; i < figurine.length; i++) {
  if(/Figurine/.test(figurine[i].children[0].getAttribute('onclick'))) {
    figurine[i].parentElement.style.display = 'none';
  }
}