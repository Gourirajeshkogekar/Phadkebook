import { jsPDF } from "jspdf";
var font = "AAEAAA... (long string)";
jsPDF.API.events.push(['addFonts', function () {
  this.addFileToVFS('NotoSansDevanagari-Regular.ttf', font);
  this.addFont('NotoSansDevanagari-Regular.ttf', 'NotoSansDevanagari', 'normal');
}]);