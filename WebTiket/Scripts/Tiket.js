var ViewModel = function () {
    var self = this;

    self.ErjDocXKList = ko.observableArray([]); // لیست گزارش  

    var ErjDocXKUri = server + '/api/Web_Data/Web_ErjDocXK/'; // آدرس مشخصات ستون ها 
    var RprtColsUri = server + '/api/Web_Data/RprtCols/'; // آدرس مشخصات ستون ها 
    var DocAttachUri = server + '/api/Web_Data/DocAttach/'; // آدرس لیست پیوست 
    var DownloadAttachUri = server + '/api/Web_Data/DownloadAttach/'; // آدرس  دانلود پیوست 
    var ErjSaveTicketUri = server + '/api/Web_Data/ErjSaveTicket_HI/'; // آدرس  دانلود پیوست 

    var ErjDocAttach_SaveUri = server + '/api/FileUpload/UploadFile/'; // ذخیره پیوست
    var ErjDocAttach_DelUri = server + '/api/Web_Data/ErjDocAttach_Del/'; // حذف پیوست

    var serialNumberAttach = 0;
    var serialNumber = 0;
    self.SettingColumnList = ko.observableArray([]); // لیست ستون ها
    self.DocAttachList = ko.observableArray([]); // ليست پیوست

    var counterAttach = 0
    var fileList = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];

    getDateServer();

    var rprtId = 'ErjDocXK';
    var columns = [
        'DocNo',
        'DocDate',
        'Status',
        'Text',
        'EghdamName',
        'TanzimName',
        'SerialNumber'
    ];


    //Get RprtCols List
    function getRprtColsList(FlagSetting, username) {
        ajaxFunction(RprtColsUri + ace + '/' + sal + '/' + group + '/' + rprtId + '/' + username, 'GET').done(function (data) {
            self.SettingColumnList(data);
            ListColumns = data;
            if (FlagSetting) {
                CreateTableReport(data)
            }
            else {
                CreateTableColumn(columns);
                for (var i = 1; i <= columns.length; i++) {
                    SetColumn(columns[i - 1], i, data);
                }
            }
        });

    }

    //Get RprtColsDefult List
    function getRprtColsDefultList() {
        ajaxFunction(RprtColsDefultUri + ace + '/' + sal + '/' + group + '/' + rprtId, 'GET').done(function (data) {
            self.SettingColumnList(data);
            counterColumn = 0;
            for (var i = 1; i <= columns.length; i++) {
                SetColumn(columns[i - 1], i, data);
            }
        });
    }


    $('#SaveColumns').click(function () {
        SaveColumn(ace, sal, group, rprtId, "/Home/", columns, self.SettingColumnList());
        sessionStorage.setItem('listFilter', null);
    });

    $('#modal-SettingColumn').on('show.bs.modal', function () {
        counterColumn = 0;
        getRprtColsList(false, username);
    });

    $('#AllSettingColumns').change(function () {
        var allCheck = $('#AllSettingColumns').is(':checked');
        for (var i = 1; i <= columns.length; i++) {
            $('#SettingColumns' + i).prop('checked', allCheck);
        }
    });

    $('#DefultColumn').click(function () {
        $('#AllSettingColumns').prop('checked', false);
        getRprtColsDefultList();
        SaveColumn(ace, sal, group, rprtId, "/ERJ/index", columns, self.SettingColumnList());
        sessionStorage.setItem('listFilter', null);

    });



    getRprtColsList(true, username);




    //Get ErjDocXK 
    function getErjDocXK() {
        var ErjDocXKObject = {
            LockNo: lockNumber,
            ModeCode: '204',
        }
        ajaxFunction(ErjDocXKUri + ace + '/' + sal + '/' + group + '/', 'Post', ErjDocXKObject).done(function (data) {
            self.ErjDocXKList(data)
        });
    }
    getErjDocXK();


    //Get DocAttach List
    function getDocAttachList(serial) {
        var DocAttachObject = {
            ModeCode: 102,
            SerialNumber: serial
        }
        ajaxFunction(DocAttachUri + ace + '/' + sal + '/' + group, 'POST', DocAttachObject).done(function (data) {
            self.DocAttachList(data);
        });
    }




    self.currentPageIndexErjDocXK = ko.observable(0);

    $('#refreshErjDocXK').click(function () {

        Swal.fire({
            title: 'تایید به روز رسانی',
            text: "لیست تیکت ها به روز رسانی شود ؟",
            type: 'info',
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
            cancelButtonText: 'خیر',

            confirmButtonColor: '#d33',
            confirmButtonText: 'بله'
        }).then((result) => {
            if (result.value) {
                getErjDocXK();
                self.sortTableErjDocXK();
            }
        })
    })


    self.PageCountView = function () {
        select = $('#pageCountSelector').val();
        getErjDocXK();
        self.sortTableErjDocXK();
    }


    var flagupdate = 0;

    self.currentPageErjDocXK = ko.observable();
    pageSizeErjDocXK = localStorage.getItem('pageSizeErjDocXK') == null ? 10 : localStorage.getItem('pageSizeErjDocXK');
    self.pageSizeErjDocXK = ko.observable(pageSizeErjDocXK);

    self.sortType = "ascending";

    self.currentColumn = ko.observable("");
    self.iconType = ko.observable("");


    self.filterDocNo = ko.observable("");
    self.filterDocDate = ko.observable("");
    self.filterStatus = ko.observable("");
    self.filterText = ko.observable("");
    self.filterEghdamName = ko.observable("");
    self.filterTanzimName = ko.observable("");
    self.filterSerialNumber = ko.observable("");


    self.filterErjDocXKList = ko.computed(function () {
        self.currentPageIndexErjDocXK(0);
        var filterDocNo = self.filterDocNo().toUpperCase();
        var filterDocDate = self.filterDocDate().toUpperCase();
        var filterStatus = self.filterStatus().toUpperCase();
        var filterText = self.filterText().toUpperCase();
        var filterEghdamName = self.filterEghdamName().toUpperCase();
        var filterTanzimName = self.filterTanzimName().toUpperCase();
        var filterSerialNumber = self.filterSerialNumber().toUpperCase();

        tempData = ko.utils.arrayFilter(self.ErjDocXKList(), function (item) {
            result =
                (item.DocNo == null ? '' : item.DocNo.toString().search(filterDocNo) >= 0) &&
                (item.DocDate == null ? '' : item.DocDate.toString().search(filterDocDate) >= 0) &&
                (item.Status == null ? '' : item.Status.toString().search(filterStatus) >= 0) &&
                (item.Text == null ? '' : item.Text.toString().search(filterText) >= 0) &&
                (item.EghdamName == null ? '' : item.EghdamName.toString().search(filterEghdamName) >= 0) &&
                (item.TanzimName == null ? '' : item.TanzimName.toString().search(filterTanzimName) >= 0) &&
                ko.utils.stringStartsWith(item.SerialNumber.toString().toLowerCase(), filterSerialNumber)
            return result;
        })
        $("#CountRecord").text(tempData.length);
        return tempData;
    });


    self.currentPageErjDocXK = ko.computed(function () {
        var pageSizeErjDocXK = parseInt(self.pageSizeErjDocXK(), 10),
            startIndex = pageSizeErjDocXK * self.currentPageIndexErjDocXK(),
            endIndex = startIndex + pageSizeErjDocXK;
        localStorage.setItem('pageSizeErjDocXK', pageSizeErjDocXK);
        var a = self.filterErjDocXKList().slice(startIndex, endIndex);
        return self.filterErjDocXKList().slice(startIndex, endIndex);
    });


    self.nextPageErjDocXK = function () {
        if (((self.currentPageIndexErjDocXK() + 1) * self.pageSizeErjDocXK()) < self.filterErjDocXKList().length) {
            self.currentPageIndexErjDocXK(self.currentPageIndexErjDocXK() + 1);
        }
    };

    self.previousPageErjDocXK = function () {
        if (self.currentPageIndexErjDocXK() > 0) {
            self.currentPageIndexErjDocXK(self.currentPageIndexErjDocXK() - 1);
        }
    };

    self.firstPageErjDocXK = function () {
        self.currentPageIndexErjDocXK(0);
    };

    self.lastPageErjDocXK = function () {
        tempCountErjDocXK = parseInt(self.filterErjDocXKList().length / self.pageSizeErjDocXK(), 10);
        if ((self.filterErjDocXKList().length % self.pageSizeErjDocXK()) == 0)
            self.currentPageIndexErjDocXK(tempCountErjDocXK - 1);
        else
            self.currentPageIndexErjDocXK(tempCountErjDocXK);
    };



    self.iconTypeDocNo = ko.observable("");
    self.iconTypeDocDate = ko.observable("");
    self.iconTypeStatus = ko.observable("");
    self.iconTypeText = ko.observable("");
    self.iconTypeEghdamName = ko.observable("");
    self.iconTypeTanzimName = ko.observable("");
    self.iconTypeSerialNumber = ko.observable("");

    self.sortTableErjDocXK = function (viewModel, e) {

        if (e != null)
            var orderProp = $(e.target).attr("data-column")
        else {
            orderProp = localStorage.getItem("sort" + rprtId);
            self.sortType = localStorage.getItem("sortType" + rprtId);
        }

        if (orderProp == null)
            return null

        if (e != null) {
            self.currentColumn(orderProp);
            self.ErjDocXKList.sort(function (left, right) {
                leftVal = FixSortName(left[orderProp]);
                rightVal = FixSortName(right[orderProp]);
                if (self.sortType == "ascending") {
                    return leftVal < rightVal ? 1 : -1;
                }
                else {
                    return leftVal > rightVal ? 1 : -1;
                }
            });

            self.sortType = (self.sortType == "ascending") ? "descending" : "ascending";

            localStorage.setItem("sort" + rprtId, orderProp);
            localStorage.setItem("sortType" + rprtId, self.sortType);
        }


        self.iconTypeDocNo('');
        self.iconTypeDocDate('');
        self.iconTypeStatus('');
        self.iconTypeText('');
        self.iconTypeEghdamName('');
        self.iconTypeTanzimName('');
        self.iconTypeSerialNumber('');

        if (orderProp == 'DocNo') self.iconTypeDocNo((self.sortType == "ascending") ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down");
        if (orderProp == 'DocDate') self.iconTypeDocDate((self.sortType == "ascending") ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down");

        if (orderProp == 'Status') self.iconTypeStatus((self.sortType == "ascending") ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down");
        if (orderProp == 'Text') self.iconTypeText((self.sortType == "ascending") ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down");
        if (orderProp == 'EghdamName') self.iconTypeEghdamName((self.sortType == "ascending") ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down");
        if (orderProp == 'TanzimName') self.iconTypeTanzimName((self.sortType == "ascending") ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down");
        if (orderProp == 'SerialNumber') self.iconTypeSerialNumber((self.sortType == "ascending") ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down");
    };



    $('#AddNewErjDocXK').click(function () {
        $("#Result").val('');
        $("#motaghazi").val('');
        $('#bodyDocAttach').empty();
        counterAttach = 0;
        fileList = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
    })



    $("#searchErjDocXK").on("keydown", function search(e) {
        if (allSearchErjDocXK == false) {
            if (e.shiftKey) {
                e.preventDefault();
            }
            else {
                var key = e.charCode || e.keyCode || 0;
                return (
                    key == 8 ||
                    key == 9 ||
                    key == 13 ||
                    key == 46 ||
                    key == 110 ||
                    key == 190 ||
                    (key >= 35 && key <= 40) ||
                    (key >= 48 && key <= 57) ||
                    (key >= 96 && key <= 105)
                );
            }
        }
    });


    //Add   ذخیره تیکت
    async function SaveErjDocXK() {

        natijeh = $("#Result").val();
        motaghazi = $("#motaghazi").val();

        if (natijeh == '' && counterAttach > 0)
            natijeh = 'به پیوست مراجعه شود';

        if (natijeh == '' && counterAttach == 0)
            return showNotification('تیکت خالی است', 0);
        else {
            var ErjSaveTicket_HI = {
                SerialNumber: 0,
                DocDate: DateNow,
                UserCode: username,
                Status: "",
                Spec: "",
                LockNo: lockNumber,
                Text: natijeh,
                F01: '',
                F02: '',
                F03: '',
                F04: '',
                F05: '',
                F06: '',
                F07: '',
                F08: '',
                F09: '',
                F10: '',
                F11: '',
                F12: '',
                F13: '',
                F14: '',
                F15: '',
                F16: '',
                F17: '',
                F18: '',
                F19: '',
                F20: '',
                Motaghazi: motaghazi,
            }
            ajaxFunction(ErjSaveTicketUri + ace + '/' + sal + '/' + group + '/', 'POST', ErjSaveTicket_HI).done(function (data) {
                serialNumber = data;

                /* var zip = new JSZip();


                 zip.file('temp' + fileType, fileAttach);
                 zip.generateAsync({ type: "Blob", compression: "DEFLATE" }).then(function (content) {

                     var file = new File([content], fileFullName[i], { type: "zip" });
                     var formData = new FormData();
                     formData.append("SerialNumber", serialNumber);
                     formData.append("ProgName", "ERJ1");
                     formData.append("ModeCode", 102);
                     formData.append("BandNo", 0);
                     formData.append("Code", "");
                     formData.append("Comm", "مدرک پیوست - " + DateNow + " - " + fileName);
                     formData.append("FName", fileFullName);
                     formData.append("Atch", file);

                     ajaxFunctionUpload(ErjDocAttach_SaveUri + ace + '/' + sal + '/' + group, formData, false).done(function (response) {
                         getErjDocXK();
                     })
                 });*/

            });

            for (var i = 1; i <= counterAttach; i++) {

                fileAttach = fileList[i];
                fileFullName = fileAttach.name;
                fileData = fileFullName.split(".");
                fileName = fileData[0];
                fileType = '.' + fileData[1];

                let result = await ziped(fileType, fileAttach, fileFullName);

            };

            showNotification('تیکت ارسال شد', 1);
            getErjDocXK();
            $('#modal-ErjDocXK').modal('hide');

        }
    }


    async function ziped(fileType, fileAttach, fileFullName) {
        var zip = new JSZip();


        zip.file('temp' + fileType, fileAttach);
        let result = await zip.generateAsync({ type: "Blob", compression: "DEFLATE" }).then(function (content) {

            var file = new File([content], fileFullName, { type: "zip" });
            var formData = new FormData();
            formData.append("SerialNumber", serialNumber);
            formData.append("ProgName", "ERJ1");
            formData.append("ModeCode", 102);
            formData.append("BandNo", 0);
            formData.append("Code", "");
            formData.append("Comm", "مدرک پیوست - " + DateNow + " - " + fileName);
            formData.append("FName", fileFullName);
            formData.append("Atch", file);

            ajaxFunctionUpload(ErjDocAttach_SaveUri + ace + '/' + sal + '/' + group, formData, false).done(function (response) {

            })
        });

    }


    $('#saveErjDocXK').click(function () {
        SaveErjDocXK();
    })



    self.ViewDocAttach = function (Band) {
        serialNumber = Band.SerialNumber;
        getDocAttachList(Band.SerialNumber);
    }



    pageSizeDocAttach = localStorage.getItem('pageSizeDocAttach') == null ? 10 : localStorage.getItem('pageSizeDocAttach');
    self.pageSizeDocAttach = ko.observable(pageSizeDocAttach);
    self.currentPageIndexKhdt = ko.observable(0);

    self.currentPageIndexDocAttach = ko.observable(0);
    self.filterDocAttach0 = ko.observable("");

    self.filterDocAttachList = ko.computed(function () {

        self.currentPageIndexDocAttach(0);
        var filter0 = self.filterDocAttach0();

        if (!filter0) {
            return self.DocAttachList();
        } else {
            tempData = ko.utils.arrayFilter(self.DocAttachList(), function (item) {
                result =
                    (item.Comm == null ? '' : item.Comm.toString().search(filter0) >= 0)
                return result;
            })
            return tempData;
        }
    });



    self.currentPageDocAttach = ko.computed(function () {
        var pageSizeDocAttach = parseInt(self.pageSizeDocAttach(), 10),
            startIndex = pageSizeDocAttach * self.currentPageIndexDocAttach(),
            endIndex = startIndex + pageSizeDocAttach;
        localStorage.setItem('pageSizeDocAttach', pageSizeDocAttach);
        return self.filterDocAttachList().slice(startIndex, endIndex);
    });

    self.nextPageDocAttach = function () {
        if (((self.currentPageIndexDocAttach() + 1) * self.pageSizeDocAttach()) < self.filterDocAttachList().length) {
            self.currentPageIndexDocAttach(self.currentPageIndexDocAttach() + 1);
        }
    };

    self.previousPageDocAttach = function () {
        if (self.currentPageIndexDocAttach() > 0) {
            self.currentPageIndexDocAttach(self.currentPageIndexDocAttach() - 1);
        }
    };

    self.firstPageDocAttach = function () {
        self.currentPageIndexDocAttach(0);
    };


    self.lastPageDocAttach = function () {
        countDocAttach = parseInt(self.filterDocAttachList().length / self.pageSizeDocAttach(), 10);
        if ((self.filterDocAttachList().length % self.pageSizeDocAttach()) == 0)
            self.currentPageIndexDocAttach(countDocAttach - 1);
        else
            self.currentPageIndexDocAttach(countDocAttach);
    };


    self.iconTypeComm = ko.observable("");

    self.sortTableDocAttach = function (viewModel, e) {
        var orderProp = $(e.target).attr("data-column")
        if (orderProp == null)
            return null
        self.currentColumn(orderProp);
        self.DocAttachList.sort(function (left, right) {
            leftVal = FixSortName(left[orderProp]);
            rightVal = FixSortName(right[orderProp]);
            if (self.sortType == "ascending") {
                return leftVal < rightVal ? 1 : -1;
            }
            else {
                return leftVal > rightVal ? 1 : -1;
            }
        });
        self.sortType = (self.sortType == "ascending") ? "descending" : "ascending";

        self.iconTypeCode('');
        self.iconTypeName('');
        if (orderProp == 'Comm') self.iconTypeNameComm((self.sortType == "ascending") ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down");
    };




    $('#refreshDocAttach').click(function () {
        Swal.fire({
            title: 'تایید به روز رسانی',
            text: "پیوست ها به روز رسانی شود ؟",
            type: 'info',
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
            cancelButtonText: 'خیر',
            allowOutsideClick: false,
            confirmButtonColor: '#d33',
            confirmButtonText: 'بله'
        }).then((result) => {
            if (result.value) {
                getDocAttachList(serialNumber);
            }
        })
    })






    $('#attachFile').click(function () {
        //if (serialNumber == 0) {
        //     SaveErjDocXK();
        //}

        $('#modal-DocAttachSend').modal('show');
        // getDocAttachList(serialNumber);

    });


    $('#AddAttachs').click(function () {
        //e.preventDefault();
        $("#AddFiles:hidden").trigger('click');

        /*file = 'c:\a\1.png'
        $('#bodyDocAttach').append(
            '<tr>' +
            '<td>' + file + '</td>' +
            '</tr>'
        );
        counterAttach = counterAttach + 1;*/
    });



    this.AddFile = function (data, e) {
        var dataFile;
        var file = e.target.files[0];
        var name = file.name;
        var size = file.size;
        Swal.fire({
            title: 'تایید آپلود ؟',
            text: "آیا " + name + " به پیوست افزوده شود",
            type: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
            cancelButtonText: 'خیر',
            allowOutsideClick: false,
            confirmButtonColor: '#d33',
            confirmButtonText: 'بله'
        }).then((result) => {
            if (result.value) {

                counterAttach = counterAttach + 1;
                a = document.getElementById("AddFiles").files[0];
                fileList[counterAttach] = a;
                fileFullName = fileList[counterAttach].name;
                fileData = fileFullName.split(".");
                fileName = fileData[0];

                $('#bodyDocAttach').append(
                    '<tr>' +
                    '<td>' + "مدرک پیوست - " + DateNow + " - " + fileName + '</td>' +
                    '</tr>'
                );


                /*fileFullName = file.files[0].name;
                fileData = fileFullName.split(".");
                fileName = fileData[0];
                fileType = '.' + fileData[1];
     
                var zip = new JSZip();
     
     
                zip.file('temp' + fileType, file.files[0]);
                zip.generateAsync({ type: "Blob", compression: "DEFLATE" }).then(function (content) {
     
                    var file = new File([content], fileFullName, { type: "zip" });
     
                    //file = $("#upload")[0].files[0];
     
     
                    attachDate = DateNow;
     
                    var formData = new FormData();
     
                    formData.append("SerialNumber", serialNumber);
                    formData.append("ProgName", "ERJ1");
                    formData.append("ModeCode", 1);
                    formData.append("BandNo", 0);
                    formData.append("Code", "");
                    formData.append("Comm", "مدرک پیوست - " + attachDate + " - " + sessionStorage.userNameFa + " - " + fileName);
                    formData.append("FName", fileFullName);
                    formData.append("Atch", file);
     
                    ajaxFunctionUpload(ErjDocAttach_SaveUri + aceErj + '/' + salErj + '/' + group, formData, true).done(function (response) {
                        getDocAttachList(serialNumber);
                    })
                });*/
            }
        })
    }


    $('#DelAllAttach').click(function () {
        $('#bodyDocAttach').empty();
        counterAttach = 0;
        fileList = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
    });




    self.selectDocAttach = function (item) {

        var fileName = item.FName.split(".");
        var DownloadAttachObject = {
            SerialNumber: item.SerialNumber,
            BandNo: item.BandNo
        }

        ajaxFunction(DownloadAttachUri + ace + '/' + sal + '/' + group, 'POST', DownloadAttachObject, true).done(function (data) {
            var sampleArr = base64ToArrayBuffer(data);
            saveByteArray(fileName[0] + ".zip", sampleArr);
        });
    }

    self.DeleteDocAttach = function (Band) {
        Swal.fire({
            title: 'تایید حذف',
            text: "آیا پیوست انتخابی حذف شود ؟",
            type: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
            cancelButtonText: 'خیر',

            confirmButtonColor: '#d33',
            confirmButtonText: 'بله'
        }).then((result) => {
            if (result.value) {

                Web_DocAttach_Save = {
                    SerialNumber: Band.SerialNumber,
                    ProgName: 'ERJ1',
                    ModeCode: 102,
                    BandNo: Band.BandNo,
                };

                ajaxFunction(ErjDocAttach_DelUri + ace + '/' + sal + '/' + group, 'POST', Web_DocAttach_Save).done(function (response) {
                    getDocAttachList(serialNumber);
                    showNotification('پیوست حذف شد', 1);
                });
            }
        })
    };

    $("#AddNewDocAttach").on('click', function (e) {
        e.preventDefault();
        $("#upload:hidden").trigger('click');
    });

    this.fileUpload = function (data, e) {
        var dataFile;
        var file = e.target.files[0];
        var name = file.name;
        var size = file.size;
        Swal.fire({
            title: 'تایید آپلود ؟',
            text: "آیا " + name + " به پیوست افزوده شود",
            type: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
            cancelButtonText: 'خیر',
            allowOutsideClick: false,
            confirmButtonColor: '#d33',
            confirmButtonText: 'بله'
        }).then((result) => {
            if (result.value) {
                var file = document.getElementById("upload");

                fileFullName = file.files[0].name;
                fileData = fileFullName.split(".");
                fileName = fileData[0];
                fileType = '.' + fileData[1];

                var zip = new JSZip();


                zip.file('temp' + fileType, file.files[0]);
                zip.generateAsync({ type: "Blob", compression: "DEFLATE" }).then(function (content) {

                    var file = new File([content], fileFullName, { type: "zip" });

                    //file = $("#upload")[0].files[0];


                    var formData = new FormData();

                    formData.append("SerialNumber", serialNumber);
                    formData.append("ProgName", "ERJ1");
                    formData.append("ModeCode", 102);
                    formData.append("BandNo", 0);
                    formData.append("Code", "");
                    formData.append("Comm", "مدرک پیوست - " + DateNow + " - " + fileName);
                    formData.append("FName", fileFullName);
                    formData.append("Atch", file);

                    ajaxFunctionUpload(ErjDocAttach_SaveUri + ace + '/' + sal + '/' + group, formData, true).done(function (response) {
                        getDocAttachList(serialNumber);
                    })
                });
            }
        })



    };

    //del DocAttach  حذف پیوست
    function ErjDocAttach_Del(bandNoImput) {
        Web_DocAttach_Del = {
            SerialNumber: serialNumber,
            ProgName: '',
            ModeCode: '',
            BandNo: bandNoImput
        };
        ajaxFunction(ErjDocAttach_DelUri + ace + '/' + sal + '/' + group, 'POST', Web_DocAttach_Del).done(function (response) {
        });
    };


    function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
    }


































    $('#modal-Erja').on('shown.bs.modal', function () {

    });




    self.radif = function (index) {
        countShow = self.pageSizeErjDocXK();
        page = self.currentPageIndexErjDocXK();
        calc = (countShow * page) + 1;
        return index + calc;
    }


    function CreateTableReport(data) {
        $("#TableList").empty();
        $('#TableList').append(
            ' <table class="table table-hover">' +
            '   <thead style="cursor: pointer;">' +
            '       <tr data-bind="click: sortTableErjDocXK">' +
            '<th>ردیف</th>' +
            CreateTableTh('DocNo', data) +
            CreateTableTh('DocDate', data) +
            CreateTableTh('Status', data) +
            CreateTableTh('Text', data) +
            CreateTableTh('EghdamName', data) +
            CreateTableTh('TanzimName', data) +
            CreateTableTh('SerialNumber', data) +
            '<th>عملیات</th>' +
            '      </tr>' +
            '   </thead >' +
            '<tbody data-bind="foreach: currentPageErjDocXK" data-dismiss="modal" style="cursor: default;">' +
            '    <tr>' +
            '<td data-bind="text: $root.radif($index())" style="background-color: ' + colorRadif + ';"></td>' +
            CreateTableTd('DocNo', 0, 0, 0, data) +
            CreateTableTd('DocDate', 0, 0, 0, data) +
            CreateTableTd('Status', 0, 0, 0, data) +
            CreateTableTd('Text', 0, 0, 0, data) +
            CreateTableTd('EghdamName', 0, 0, 0, data) +
            CreateTableTd('TanzimName', 0, 0, 0, data) +
            CreateTableTd('SerialNumber', 0, 0, 0, data) +
            '<td>' +
            '      <a data-bind="click: $root.ViewDocAttach, visible: DocAttachExists == 1" class= "dropdown-toggle" data-toggle="modal" data-target="#modal-DocAttach" data-backdrop="static" data-keyboard="false" style="font-size: 11px;text-align: right;">' +
            '          <img src="/Content/img/list/attach_file.png" width="18" height="18"/> ' +
            '      </a>' +
            '</td >' +
            '        </tr>' +
            '</tbody>' +
            ' <tfoot>' +
            '  <tr style="background-color: #efb68399;">' +
            '<td style="background-color: #efb683;"></td>' +
            CreateTableTdSearch('DocNo', data) +
            CreateTableTdSearch('DocDate', data) +
            CreateTableTdSearch('Status', data) +
            CreateTableTdSearch('Text', data) +
            CreateTableTdSearch('EghdamName', data) +
            CreateTableTdSearch('TanzimName', data) +
            CreateTableTdSearch('SerialNumber', data) +
            '<td style="background-color: #efb683;"></td>' +
            '      </tr>' +
            '  </tfoot>' +
            '</table >'
        );
    }

    function CreateTableTh(field, data) {

        text = '<th ';

        TextField = FindTextField(field, data);
        sortField = field == 'DocNo' ? 'DocNo' : field
        if (TextField == 0)
            text += 'Hidden ';

        text += 'data-column="' + sortField + '">' +
            '<span data-column="' + sortField + '">' + TextField + '</span>' +
            '<span data-bind="attr: { class: currentColumn() == \'' + sortField + '\' ? \'isVisible\' : \'isHidden\' }">' +
            '    <i data-bind="attr: { class: iconType' + field + ' }"  data-column="' + sortField + '" ></i> </span> ' +
            '</th>';
        return text;
    }

    function CreateTableTd(field, Deghat, no, color, data) {
        text = '<td ';

        TextField = FindTextField(field, data);
        if (TextField == 0)
            text += 'Hidden ';

        color = "\'" + color + "\'";

        shamsiDateTemp = "\'" + DateNow + "\'";

        switch (no) {
            case 0:
                text += 'data-bind="text: ' + field + ' , style: {\'background-color\': ' + color + ' != \'0\' ? ' + color + ' : null  }"></td>';
                break;
            case 1:
                text += 'style="direction: ltr;" data-bind="text: ' + field + ' == 0 ? \'0\' : NumberToNumberString(' + field + '), style: { color: ' + field + ' < 0 ? \'red\' : \'black\' }"></td>'
                break;
            case 2:
                text += 'style="direction: ltr;" data-bind="text: ' + field + ' != null ? NumberToNumberString(parseFloat(' + field + ')) : \'0\', style: { color: ' + field + ' < 0 ? \'red\' : \'#3f4853\' }"" style="text-align: right;"></td>'
                break;
            case 3:
                text += 'style="direction: ltr;" data-bind="text: ' + field + ' != null ? NumberToNumberString(parseFloat(' + field + ')) : \'0\'" style="text-align: right;"></td>'
                break;
            case 4:
                text += 'data-bind="text: ' + field + ' , click: $root.View' + field + ' " class="ellipsis"></td>';
                break;
            case 5:
                text += 'data-bind="click: $root.View' + field + ', style: {\'background-color\': ' + color + ' != \'0\' ? ' + color + ' : null  } " style="font-size: 10px;color: #a7a3a3cc;font-style: italic" >برای نمایش کلیک کنید</td>';
                break;

            case 6:
                text += 'data-bind="text: ' + field + ',style: { color: ' + field + ' < ' + shamsiDateTemp + '   ? \'red\' : \'\'}"></td>';
                break;

        }
        return text;
    }

    function CreateTableTdSum(field, no, data) {
        text = '<td style="background-color: #e37d228f !important;"';

        TextField = FindTextField(field, data);
        if (TextField == 0)
            text += 'Hidden ';

        switch (no) {
            case 0:
                text += 'id="textTotal"></td>';
                break;
            case 1:
                text += '></td>'
                break;
            case 2:
                text += 'id="total' + field + '" style="direction: ltr;"></td>'
                break;
        }
        return text;
    }


    function CreateTableTdSearch(field, data) {
        text = '<td ';

        TextField = FindTextField(field, data);
        type = FindTypeField(field, data);
        if (TextField == 0)
            text += 'Hidden ';

        text += 'style="padding: 0px 3px;"><input data-bind="value: filter' + field + ', valueUpdate: \'afterkeydown\', event:{ keydown : $root.SearchKeyDown }" type="text" class="type_' + type;
        text += ' form-control" style="height: 2.4rem;direction: ltr;text-align: right;" /> </td>';
        return text;
    }


    self.SearchKeyDown = function (viewModel, e) {
        return KeyPressSearch(e);
    }
    self.sortTableErjDocXK();
};

ko.applyBindings(new ViewModel());

