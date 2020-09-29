// ==UserScript==
// @name        F95 - Filter
// @namespace   Violentmonkey Scripts
// @match       https://f95zone.to/latest*
// @grant       none
// @version     1.0
// @author      -
// @description 4/15/2020, 8:50:13 PM
// ==/UserScript==

var style = `
<style>
  .resource-tile[data-tags*="gay"], 
  .resource-tile[data-tags*="guro"],  
  .resource-tile[data-tags*="scat"] {
      opacity: .1;
      -webkit-filter: blur(5px);
      filter: blur(5px);

  }

  .resource-tile[data-tags*="gay"]:hover, 
  .resource-tile[data-tags*="guro"]:hover,  
  .resource-tile[data-tags*="scat"]:hover {
      opacity: .2;
      -webkit-filter: blur(0);
      filter: blur(0);
  }


  .resource-tile[data-tags*="no sexual content"] {
    display: none !important;
  }
</style>
`;

document.head.innerHTML += style;