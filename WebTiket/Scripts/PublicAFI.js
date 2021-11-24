var serverAccount = 'http://127.0.0.1:902/api/';
//var serverAccount = 'http://192.168.0.114:902/api/';
//var serverAccount = 'http://185.208.174.64:812/api/';

var AccountUri = serverAccount + 'Account/'; // آدرس حساب
var username = 'ace';

var serverTiket = localStorage.getItem('ApiAddressTiket');
var aceTiket = "Web2";
var salTiket = "0000";
var groupTiket = localStorage.getItem('groupTiket');
var lockNumber = localStorage.getItem('lockNumber');

var serverCustAccount = localStorage.getItem('ApiAddressCustAccount');
var aceCustAccount = "Web8";
var salCustAccount = "0000";
var groupCustAccount = localStorage.getItem('groupCustAccount');


var colorRadif = '#d9d9d9';

var ListColumns;
var DateNow;
var SalNow;


var RprtColsSaveUri = serverTiket + '/api/Web_Data/RprtColsSave/'; // آدرس ذخیره ستون ها 



function getAccountDataTiket(lock) {
    ajaxFunctionAccount(AccountUri + 'tiket' + '/' + 'tiket', 'GET').done(function (data) {
        if (data === 0) {
            return showNotification(' اطلاعات تیکت یافت نشد ', 0);
        }
        else {
            serverAddress = data.AddressApi;
            localStorage.setItem("groupTiket", data.ERJ_Group);
            localStorage.setItem("ApiAddressTiket", serverAddress);

            ajaxFunctionAccount(AccountUri + lock, 'GET').done(function (data) {
                if (data === 0) {
                    lockNumber = "";
                    localStorage.setItem("lockNumber", "");
                    $("#Tiket_Menu").hide();
                    return showNotification(' اطلاعات قفل یافت نشد ', 0);
                }
                else {
                    //lock = 10071; // بعد از تست حذف شود
                    lockNumber = lock;
                    $("#Tiket_Menu").show();
                    localStorage.setItem("lockNumber", lock);
                }
            });
        }
    });
}

function getAccountDataCustAccount(lock) {
    ajaxFunctionAccount(AccountUri + 'linkpardakht' + '/' + 'linkpardakht', 'GET').done(function (data) {
        if (data === 0) {
            return showNotification(' اطلاعات لینک پرداخت یافت نشد ', 0);
        }
        else {
            serverAddress = data.AddressApi;
            localStorage.setItem("groupCustAccount", data.AFI8_Group);
            //localStorage.setItem("groupCustAccount", "06");
            localStorage.setItem("ApiAddressCustAccount", serverAddress);
        }
    });
}

url = window.location.href;
lock = url.split('?')[1];





if (lock != null) {
    lock = Math.round(lock / 114820000008);
    getAccountDataTiket(lock);
    getAccountDataCustAccount(lock);
}


function ajaxFunctionAccount(uri, method, sync, data) {
    return $.ajax({
        type: method,
        url: uri,
        dataType: 'json',
        async: sync == null ? false : sync,
        beforeSend: function () {
            if (sync == true) {
                $('#loadingsite').attr('class', 'page-proccess-wrapper');
                $('#loadingsite').css('display', 'block');
            }
        },
        cache: false,
        timeout: 30000,
        complete: function () {
            if (sync == true) {
                $('#loadingsite').css('display', 'none');
                $('#loadingsite').attr('class', 'page-loader-wrapper');
            }
        },
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showNotification('اشکال در دریافت اطلاعات از سرور . لطفا عملیات را دوباره انجام دهید' + '</br>' + textStatus + ' : ' + errorThrown, 3);
    });
}

function ajaxFunction(uri, method, data, sync) {

    var userNameAccount = localStorage.getItem("userNameAccount");
    var passAccount = localStorage.getItem("passAccount");

    return $.ajax({
        type: method,
        async: sync == null ? false : sync,
        encoding: 'UTF-8',
        beforeSend: function () {
            if (sync == true) {
                $('#loadingsite').attr('class', 'page-proccess-wrapper');
                $('#loadingsite').css('display', 'block');
            }
        },
        url: uri,
        dataType: 'json',

        cache: false,
        timeout: 300000,
        headers: {
            'userName': 'Tiket',
            'password': 'Tiket',
            'userKarbord': username,
        },
        complete: function () {
            var n = uri.search("ChangeDatabase");
            if (sync == true && n == -1) {
                $('#loadingsite').css('display', 'none');
                $('#loadingsite').attr('class', 'page-loader-wrapper');
            }
        },
        //async: true,
        //crossDomain: true,
        //cache: false,
        contentType: 'application/json',
        //contentType: 'application/x-www-form-urlencoded',
        // xhrFields: { withCredentials: true },
        data: data ? JSON.stringify(data) : null
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showNotification('اشکال در دریافت اطلاعات از سرور . لطفا عملیات را دوباره انجام دهید' + '</br>' + textStatus + ' : ' + errorThrown, 3);
        // Swal.fire({ type: 'danger', title: 'اشکال در دریافت اطلاعات از سرور . لطفا عملیات را دوباره انجام دهید', text: errorThrown });
    });
}

function ajaxFunctionOther(uri, method, data) {

    return $.ajax({
        type: method,
        url: uri,
        dataType: 'json',
        async: false,
        cache: false,
        timeout: 30000,
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showNotification('اشکال در دریافت اطلاعات از سرور . لطفا عملیات را دوباره انجام دهید' + '</br>' + textStatus + ' : ' + errorThrown, 3);
    });
}


function ajaxFunctionUpload(uri, data, sync) {

    //var userNameAccount = localStorage.getItem("userNameAccount");
    // var passAccount = localStorage.getItem("passAccount");
    return $.ajax({
        url: uri,
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,

        async: sync == null ? false : sync,
        beforeSend: function () {
            if (sync == true) {
                $('#loadingsite').attr('class', 'page-proccess-wrapper');
                $('#loadingsite').css('display', 'block');
            }
        },

        headers: {
            'userName': 'Tiket',
            'password': 'Tiket',
            'userKarbord': username,
        },
        success: function (fileName) {
            // $("#fileProgress").hide();
            // $("#lblMessage").html("<b>" + fileName + "</b> has been uploaded.");
        },
        complete: function () {
            var n = uri.search("ChangeDatabase");
            if (sync == true && n == -1) {
                $('#loadingsite').css('display', 'none');
                $('#loadingsite').attr('class', 'page-loader-wrapper');
            }
        },
        xhr: function () {
            var fileXhr = $.ajaxSettings.xhr();
            if (fileXhr.upload) {
                $("progress").show();
                fileXhr.upload.addEventListener("progress", function (e) {
                    if (e.lengthComputable) {
                        $("#fileProgress").attr({
                            value: e.loaded,
                            max: e.total
                        });
                    }
                }, false);
            }
            return fileXhr;
        }
    });
}



function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}





















function showNotification(text, colorNumber, From, Align, time) {

    placementFrom = From == null ? sessionStorage.placementFrom : From;
    placementAlign = Align == null ? sessionStorage.placementAlign : Align;
    animateEnter = sessionStorage.animateEnter;
    animateExit = sessionStorage.animateExit;
    if (colorNumber == 0)
        colorName = 'alert-danger';
    else if (colorNumber == 1)
        colorName = 'alert-success';
    else if (colorNumber == 2)
        colorName = 'alert-warning';
    else if (colorNumber == 3)
        colorName = 'alert-info';


    if (colorName === null || colorName === '') { colorName = 'bg-black'; }
    if (text === null || text === '') { text = 'خطای برنامه نویسی : متن هشدار وارد نشده است'; }
    if (animateEnter === null || animateEnter === '') { animateEnter = 'animated fadeInDown'; }
    if (animateExit === null || animateExit === '') { animateExit = 'animated fadeOutUp'; }
    var allowDismiss = true;

    $.notify({
        message: text
    },
        {
            type: colorName,
            allow_dismiss: allowDismiss,
            newest_on_top: true,
            timer: time = null ? 1000 : time,
            placement: {
                from: placementFrom,
                align: placementAlign
            },
            animate: {
                enter: animateEnter,
                exit: animateExit
            },
            template: '<div data-notify="container" class="bootstrap-notify-container alert alert-dismissible {0} ' + (allowDismiss ? "p-r-35" : "") + '" role="alert">' +
                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                '<span data-notify="icon"></span> ' +
                '<span data-notify="title">{1}</span> ' +
                '<span data-notify="message">{2}</span>' +
                '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                '</div>' +
                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                '</div>'
        });
}





function FindTextField(field, data) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].Code == field && data[i].Visible == 1) {
            return data[i].Name;
        }
    }
    return 0;
}

function FindTypeField(field, data) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].Code == field && data[i].Visible == 1) {
            return data[i].Type;
        }
    }
    return 0;
}



function getDateServer(server) {
    var date;
    if (server != null) {
        var DateUri = server + '/api/Web_Data/Date/'; // آدرس  تاریخ سرور
        ajaxFunction(DateUri, 'GET').done(function (data) {
            listDate = data[0].split("/");
            DateNow = data[0];
            SalNow = listDate[0];
        });
    }
}

var counterColumn;

function CreateTableColumn(data) {
    var cols = '';
    $("#TableColumn").empty();

    for (var i = 1; i <= data.length; i++) {
        cols += ' <tr id="PanelColumns' + i + '"> ' +
            '    <td id="RowColumns' + i + '"></td> ' +
            '    <td id="TextColumns' + i + '"></td> ' +
            '    <td style="padding: 0px 10px;text-align: left;"> ' +
            '        <input id = "SettingColumns' + i + '" type = "checkbox" />' +
            '    </td > ' +
            '</tr> '
    }

    $('#TableColumn').append(
        cols
    );
}



function SetColumn(code, indexId, data, mode) {
    var index = -1;
    var name = '';
    var user = '';
    for (i = 0; i < data.length; i++) {
        item = data[i];
        user = item.UserCode;
        if (item.Code == code && item.Name != "") {
            index = i;
        }
    }
    if (index >= 0) {
        counterColumn++;
        name = data[index].Name;
        visible = data[index].Visible;
        findCode = code.search("Code");
        if (user == "*Default*" &&
            (
                (code.lastIndexOf("Code") > 0 && code != "AccCode" && code != "AccFullCode") ||
                code.lastIndexOf("Amount2") > 0 ||
                code.lastIndexOf("Amount3") > 0 ||
                code.lastIndexOf("UnitPrice2") > 0 ||
                code.lastIndexOf("UnitPrice3") > 0 ||

                code.lastIndexOf("UnitName2") > 0 ||
                code.lastIndexOf("UnitName3") > 0 ||

                code == "iAddMin1" ||
                code == "iAddMin2" ||
                code == "iAddMin3" ||

                code == "DimX" ||
                code == "DimY" ||
                code == "DimZ" ||

                code == "Amount" ||
                code == "Amount2" ||
                code == "Amount3" ||

                code == "UnitPrice2" ||
                code == "UnitPrice3" ||

                code == "CheckRadif" ||
                code == "CheckComm" ||
                code == "CheckVosoolDate" ||

                code == "ThvlRegion" ||
                code == "ThvlOstan" ||
                code == "ThvlShahrestan" ||
                code == "ThvlCity" ||
                code == "ThvlStreet" ||
                code == "ThvlAlley" ||
                code == "ThvlPlack" ||
                code == "ThvlZipCode" ||
                code == "ThvlTel" ||
                code == "ThvlMobile" ||
                code == "ThvlFax" ||
                code == "ThvlEMail" ||
                code == "ThvlAddress" ||
                code == "ThvlMelliCode" ||
                code == "ThvlEcoCode" ||

                code == "CustEcoCode" ||
                code == "CustMelliCode" ||
                code == "CustTel" ||
                code == "CustFax" ||
                code == "CustMobile" ||
                code == "CustEmail" ||
                code == "CustCity" ||
                code == "CustStreet" ||
                code == "CustAlley" ||
                code == "CustPlack" ||
                code == "CustZipCode" ||
                code == "CustAddress" ||
                code == "CustOstan" ||
                code == "CustShahrestan" ||
                code == "CustRegion" ||
                code == "ArzName" ||
                code == "ArzRate" ||
                code == "ArzValue" ||
                (code == "ToUserName" && mode == "ErjDocB_Last_D") ||
                (code == "FromUserName" && mode == "ErjDocB_Last_E") ||
                code == "Shobe" ||
                code == "Jari" ||
                code == "F01" ||
                code == "F02" ||
                code == "F03" ||
                code == "F04" ||
                code == "F05" ||
                code == "F06" ||
                code == "F07" ||
                code == "F08" ||
                code == "F09" ||
                code == "F10" ||
                code == "F11" ||
                code == "F12" ||
                code == "F13" ||
                code == "F14" ||
                code == "F15" ||
                code == "F16" ||
                code == "F17" ||
                code == "F18" ||
                code == "F19" ||
                code == "F20" ||

                code == "CustF01" ||
                code == "CustF02" ||
                code == "CustF03" ||
                code == "CustF04" ||
                code == "CustF05" ||
                code == "CustF06" ||
                code == "CustF07" ||
                code == "CustF08" ||
                code == "CustF09" ||
                code == "CustF10" ||
                code == "CustF11" ||
                code == "CustF12" ||
                code == "CustF13" ||
                code == "CustF14" ||
                code == "CustF15" ||
                code == "CustF16" ||
                code == "CustF17" ||
                code == "CustF18" ||
                code == "CustF19" ||
                code == "CustF20" ||

                code == "KalaF01" ||
                code == "KalaF02" ||
                code == "KalaF03" ||
                code == "KalaF04" ||
                code == "KalaF05" ||
                code == "KalaF06" ||
                code == "KalaF07" ||
                code == "KalaF08" ||
                code == "KalaF09" ||
                code == "KalaF10" ||
                code == "KalaF11" ||
                code == "KalaF12" ||
                code == "KalaF13" ||
                code == "KalaF14" ||
                code == "KalaF15" ||
                code == "KalaF16" ||
                code == "KalaF17" ||
                code == "KalaF18" ||
                code == "KalaF19" ||
                code == "KalaF20"
            )
        ) {
            visible = 0;
        }
        $('#RowColumns' + indexId).text(counterColumn);
        $('#TextColumns' + indexId).text(name);
        $('#SettingColumns' + indexId).prop('checked', visible == 1 ? true : false);
        $('#PanelColumns1').removeAttr('hidden', '');
    }
    else {
        $('#PanelColumns' + indexId).attr('hidden', '');
        $('#TextColumns' + indexId).text('تعریف نشده');
        $('#SettingColumns' + indexId).prop('checked', false);
        $('#RowColumns' + indexId).text(-1);
    }
}

function SaveColumn(ace, sal, group, rprtId, route, columns, data) {
    var obj = [];
    for (i = 1; i <= columns.length; i++) {
        item = data[i];
        $('#SettingColumns' + (i)).is(':checked') == true ? Visible = 1 : Visible = 0;
        tmp = {
            'UserCode': username,
            'RprtId': rprtId,
            'Code': columns[i - 1],
            'Visible': Visible,
        };
        obj.push(tmp);
    }

    $('#modal-SettingColumn').modal('hide');
    showNotification('در حال ذخیره تنظیمات ستون ها ...', 1);
    ajaxFunction(RprtColsSaveUri + ace + '/' + sal + '/' + group, 'POST', obj).done(function (response) {
    });
    window.location.href = route;
}




function FixSortName(name) {
    if (typeof name == "string" && name != "" && name.substring(0, 4) != '    ') {
        str = name.trim();
        str = str.replaceAll('آ', String.fromCharCode(1000));
        str = str.replaceAll('ا', String.fromCharCode(1001));
        str = str.replaceAll('ب', String.fromCharCode(1002));
        str = str.replaceAll('پ', String.fromCharCode(1003));
        str = str.replaceAll('ت', String.fromCharCode(1004));
        str = str.replaceAll('ث', String.fromCharCode(1005));
        str = str.replaceAll('ج', String.fromCharCode(1006));
        str = str.replaceAll('چ', String.fromCharCode(1007));
        str = str.replaceAll('ح', String.fromCharCode(1008));
        str = str.replaceAll('خ', String.fromCharCode(1009));
        str = str.replaceAll('د', String.fromCharCode(1010));
        str = str.replaceAll('ذ', String.fromCharCode(1011));
        str = str.replaceAll('ر', String.fromCharCode(1012));
        str = str.replaceAll('ز', String.fromCharCode(1013));
        str = str.replaceAll('ژ', String.fromCharCode(1014));
        str = str.replaceAll('س', String.fromCharCode(1015));
        str = str.replaceAll('ش', String.fromCharCode(1016));
        str = str.replaceAll('ص', String.fromCharCode(1017));
        str = str.replaceAll('ض', String.fromCharCode(1018));
        str = str.replaceAll('ط', String.fromCharCode(1019));
        str = str.replaceAll('ظ', String.fromCharCode(1020));
        str = str.replaceAll('ع', String.fromCharCode(1021));
        str = str.replaceAll('غ', String.fromCharCode(1022));
        str = str.replaceAll('ف', String.fromCharCode(1023));
        str = str.replaceAll('ق', String.fromCharCode(1024));
        str = str.replaceAll('ك', String.fromCharCode(1025));
        str = str.replaceAll('ک', String.fromCharCode(1026));
        str = str.replaceAll('گ', String.fromCharCode(1027));
        str = str.replaceAll('ل', String.fromCharCode(1028));
        str = str.replaceAll('م', String.fromCharCode(1029));
        str = str.replaceAll('ن', String.fromCharCode(1030));
        str = str.replaceAll('و', String.fromCharCode(1031));
        str = str.replaceAll('ه', String.fromCharCode(1032));
        str = str.replaceAll('ی', String.fromCharCode(1033));
        str = str.replaceAll('ي', String.fromCharCode(1033));
    }
    else {
        str = name;
    }

    return str
}

function fixedSize_JS(value, size) {
    if (typeof value != "string")
        value = value.toString();

    return value.padStart(size).substring(0, size);
}



function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}


function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

function saveByteArray(reportName, byte) {
    var blob = new Blob([byte], { type: 'octet/stream' });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
};




var viewer = null;
var designer = null;
var options = null;
var report = null;
var dataSet = null;

function createViewer() {
    Stimulsoft.Base.Localization.StiLocalization.addLocalizationFile("/Content/Report/Lang/fa.xml", true, "persion (fa)");
    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("/Content/fonts/BZiba.ttf", "Karbord_Ziba");
    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("/Content/fonts/BZAR.ttf", "Karbord_ZAR");
    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("/Content/fonts/BYEKAN.ttf", "Karbord_YEKAN");
    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("/Content/fonts/BTITRBD.ttf", "Karbord_TITRBD");
    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("/Content/fonts/BNAZANIN.ttf", "Karbord_NAZANIN");

    options = new Stimulsoft.Viewer.StiViewerOptions();
    viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);

    options.appearance.showSystemFonts = false;
    options.height = "100%";
    options.appearance.fullScreenMode = true;
    options.appearance.scrollbarsMode = true;
    options.toolbar.showSaveButton = true;

    if (lockNumber == 10011) {
        options.toolbar.showDesignButton = true;
        $('#DesignPrint').attr('style', 'display: unset');
    } else {
        options.toolbar.showDesignButton = false;
        $('#DesignPrint').attr('style', 'display: none');
    }


    options.toolbar.showFullScreenButton = false;
    options.toolbar.printDestination = Stimulsoft.Viewer.StiPrintDestination.Direct;
    options.appearance.htmlRenderMode = Stimulsoft.Report.Export.StiHtmlExportMode.Table;
    options.toolbar.zoom = 100;
    options.toolbar.showCloseButton = true;

    report = new Stimulsoft.Report.StiReport();
    viewer.onDesignReport = function (e) {
        createDesigner();
    };
    viewer.renderHtml("viewerContent");

    var userButton = viewer.jsObject.SmallButton("userButton", "خروج");

    userButton.action = function () {
        $("#modal-Report").modal('hide');
    }

    var toolbarTable = viewer.jsObject.controls.toolbar.firstChild.firstChild;
    var buttonsTable = toolbarTable.rows[0].firstChild.firstChild;
    var userButtonCell = buttonsTable.rows[0].insertCell(0);
    userButtonCell.className = "stiJsViewerClearAllStyles";
    userButtonCell.appendChild(userButton);
}

var DataReport;
function createDesigner() {
    viewer.visible = false;
    designer = null;
    var options = new Stimulsoft.Designer.StiDesignerOptions();
    options.appearance.fullScreenMode = true;
    options.appearance.htmlRenderMode = Stimulsoft.Report.Export.StiHtmlExportMode.Table;

    designer = new Stimulsoft.Designer.StiDesigner(options, "StiDesigner", false);
    designer.renderHtml("designerContent");

    designer.onExit = function (e) {
        this.visible = false;
        viewer.visible = false;
        $("#modal-Report").modal('hide');
    }

    /*designer.onSaveReport = function (e) {
        var jsonStr = e.report.saveToJsonString();
       // SavePrintForm(sessionStorage.ModePrint, e.fileName, jsonStr);
    }

    designer.onSaveAsReport = function (e) {
        var jsonStr = e.report.saveToJsonString();
        var name = e.fileName;
        resTestSavePrintForm = "";
        //SavePrintForm(sessionStorage.ModePrint, e.fileName, jsonStr);
    };*/

    //report._reportFile = printName == null ? 'فرم چاپ' : printName;
    designer.report = report;
    designer.visible = true;

}




function setReport(reportObject, addressMrt, variablesObject) {
    DataReport = reportObject;
    if (DataReport.length == 0 || DataReport == null || DataReport == "") {
        return showNotification('ابتدا گزارش گیری کنید', 0);
    }

    var dStart = new Date();
    var secondsStart = dStart.getTime();

    report = new Stimulsoft.Report.StiReport();
    report.loadFile(addressMrt);

    report.dictionary.databases.clear();
    dataSet = new Stimulsoft.System.Data.DataSet("Database");
    DataReport = '{"Data":' + JSON.stringify(DataReport) + '}';

    dataSet.readJson(DataReport);
    report.regData(dataSet.dataSetName, "", dataSet);

    variablesDataSet = new Stimulsoft.System.Data.DataSet("variables");
    variablesReport = '{"variables":[{' + variablesObject + '}]}';
    variablesDataSet.readJson(variablesReport);
    report.regData(variablesDataSet.dataSetName, "", variablesDataSet);


    

   // titlesDataSet = new Stimulsoft.System.Data.DataSet("Titles");
   // titlesReport = '{"Titles":[{' + titlesObject + '}]}';
   // titlesDataSet.readJson(titlesReport);
   // report.regData(titlesDataSet.dataSetName, "", titlesDataSet);


    report.dictionary.synchronize();

    viewer.report = report;
    //report.render();

    viewer.visible = true;
    $('#modal-Report').modal('show');

    viewer.onExit = function (e) {
        this.visible = false;
    }

}
