// https://stackoverflow.com/questions/33501696/how-to-return-value-from-addeventlistener

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var xl2json = new ExcelToJSON();
    xl2json.parseExcel(files[0]);
}


class ExcelToJSON {
    constructor() {
        this.parseExcel = function (file) {
            var reader = new FileReader();

            //onload is called when "readAsBinaryString" is run
            reader.onload = function (e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, {
                    type: 'binary'
                });
                workbook.SheetNames.forEach(function (sheetName) {
                    // Here is your object
                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    var j = JSON.stringify(XL_row_object);

                    //把資料回傳到Match.js裡面的函數，並在那裏處理數據
                    getXLSData(j);
                });

            };
            reader.onerror = function (ex) {
                console.log(ex);
            };
            reader.readAsBinaryString(file);

        };
    }
}

