/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * This script is intended to be used within a Google Apps Script project.
 * 1. Create a new Google Spreadsheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Replace the content of Code.gs with this code.
 * 4. Create an Index.html file and paste the compiled output of this React app.
 */

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Store Request Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getSheetData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0];
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);

  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      // Clean header names to be used as keys
      const key = header.toString().toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
      obj[key] = row[index];
    });
    return obj;
  });
}
