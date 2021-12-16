const fs = require('fs').promises;
const path = require("path");
const XLSX = require("xlsx");
const readline = require("readline");

const readFile = async (filePath) => {
  console.log(`\nreading files: ${filePath}`);
  const fileType = filePath.split(".").pop()

  switch (fileType) {
    case 'json':
      console.log("reading json file...\n")
      return JSON.parse(await fs.readFile(filePath, 'utf-8'));

    default:
      return await fs.readFile(filePath, 'utf-8');
  }
}

const showProgressOnConsole = (now, total) => {
  /**
   * erace cursor
   */
  process.stdout.write('\x1B[?25l');


  /**
   * calc now percentage
   * (if now === total - 1 then 100%)
   */
  const nowPercentage = (now === total - 1) ? 100 : Math.floor((now / total) * 100);

  /**
   * creating bar
   */
  let bar = '';
  const barDetail = 2;
  const barMaxLength = 100 / barDetail;
  const nowBarLength = Math.floor(nowPercentage / barDetail);

  for (let i = 0; i < barMaxLength; i++) {
    bar += i <= nowBarLength ? "#" : "_";
  }

  /**
   * move cursor and rewrite progress
   */
  if (now !== 1) readline.moveCursor(process.stdout, 0, -3);

  process.stdout.write(`
    now calculating ...
    progress: ${bar} ${nowPercentage}%
  `);

  /**
   * show cursor
   */
  if (now === total - 1) process.stdout.write('\x1B[?25h');
}

const writeFile = async (data) => {
  //XLSXファイル書き出し設定
  const now = new Date();
  const fileNameDateString = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}-${now.getHours()}${now.getMinutes()}-${now.getSeconds()}${now.getMilliseconds()}`;
  const writeFileType = "xlsx";
  const writeFilePath = path.resolve(__dirname, "../../result");
  const writeFileName = path.resolve(writeFilePath, "result-" + fileNameDateString + `.${writeFileType}`);

  //書き込み対象のディレクトリが存在するか確認
  try {

    await fs.lstat(writeFilePath);

  } catch (e) {

    if (e.errno === -4058) fs.mkdir(writeFilePath);
    else throw new Error(e);

  }

  try {

    //XLSXのworkbookオブジェクト準備
    const wb = XLSX.utils.book_new();
    const sheetName = "result";

    wb.Props = {
      Title: "people-flow-simulation result",
      Subject: "",
      Author: "",
      CreatedDate: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
    };

    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(data);

    //XLSXファイル書き出し
    XLSX.writeFile(wb, writeFileName);
    return true;

  } catch (e) {

    console.log("failed to write XLSX result file due to below error.");
    console.error(e);
    return false;

  }
}

module.exports = { readFile, writeFile, showProgressOnConsole }