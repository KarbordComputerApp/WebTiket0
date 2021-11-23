var ViewModel = function () {
    var self = this;

    self.CustAccountList = ko.observableArray([]); // لیست گزارش  

    var CustAccountUri = serverCustAccount + '/api/Web_Data/CustAccount/'; // آدرس فاکتور ها  
    var PayUri = serverCustAccount + '/api/Shaparak/PostSalePayment'; // آدرس پرداخت  
    var CustAccountSaveUri = serverCustAccount + "/api/Web_Data/CustAccountSave/"; // آدرس ذخیره لینک پرداخت  

    var serialNumber = 0;

    getDateServer();

    sort = localStorage.getItem("sortCustAccount");
    sortType = localStorage.getItem("sortTypeCustAccount");

    //Get CustAccoun 
    function getCustAccount() {
        var CustAccountObject = {
            LockNo: lockNumber,
        }
        ajaxFunction(CustAccountUri + aceCustAccount + '/' + salCustAccount + '/' + groupCustAccount + '/', 'Post', CustAccountObject).done(function (data) {
            for (var i = 0; i < data.length; i++) {
                data[i].Tasviye = data[i].TasviyeCode == 0 && data[i].ModeCode == "SFCT" ? "پرداخت نشده" : data[i].TasviyeCode == 1 ? "در حال پرداخت" : data[i].ModeCode != "SFCT" ? "برگشتی" : "پرداخت شده"
            }
            self.CustAccountList(data)
        });
    }

    getCustAccount();


    self.currentPageIndexCustAccount = ko.observable(0);

    $('#refreshCustAccount').click(function () {

        Swal.fire({
            title: 'تایید به روز رسانی',
            text: "لیست فاکتور ها به روز رسانی شود ؟",
            type: 'info',
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
            cancelButtonText: 'خیر',

            confirmButtonColor: '#d33',
            confirmButtonText: 'بله'
        }).then((result) => {
            if (result.value) {
                getCustAccount();
                self.sortTableCustAccount();
            }
        })
    })


    self.PageCountView = function () {
        select = $('#pageCountSelector').val();
        getCustAccount();
        self.sortTableCustAccount();
    }


    self.currentPageCustAccount = ko.observable();
    pageSizeCustAccount = localStorage.getItem('pageSizeCustAccount') == null ? 10 : localStorage.getItem('pageSizeCustAccount');
    self.pageSizeCustAccount = ko.observable(pageSizeCustAccount);

    self.sortType = "ascending";
    self.currentColumn = ko.observable("");

    self.filterDocNo = ko.observable("");
    self.filterDocDate = ko.observable("");
    self.filterSpec = ko.observable("");
    self.filterTotalValue = ko.observable("");
    self.filterTasviye = ko.observable("");
    self.filterSerialNumber = ko.observable("");

    self.filterCustAccountList = ko.computed(function () {
        self.currentPageIndexCustAccount(0);
        var filterDocNo = self.filterDocNo().toUpperCase();
        var filterDocDate = self.filterDocDate().toUpperCase();
        var filterSpec = self.filterSpec().toUpperCase();
        var filterTotalValue = self.filterTotalValue().toUpperCase();
        var filterTasviye = self.filterTasviye().toUpperCase();
        var filterSerialNumber = self.filterSerialNumber().toUpperCase();

        var a = self.CustAccountList()
        tempData = ko.utils.arrayFilter(self.CustAccountList(), function (item) {
            result =
                (item.DocNo == null ? '' : item.DocNo.toString().search(filterDocNo) >= 0) &&
                (item.DocDate == null ? '' : item.DocDate.toString().search(filterDocDate) >= 0) &&
                (item.Spec == null ? '' : item.Spec.toString().search(filterSpec) >= 0) &&
                ko.utils.stringStartsWith(item.TotalValue.toString().toLowerCase(), filterTotalValue) &&
                (item.Tasviye == null ? '' : item.Tasviye.toString().search(filterTasviye) >= 0) &&
                ko.utils.stringStartsWith(item.SerialNumber.toString().toLowerCase(), filterSerialNumber)
            return result;
        })
        $("#CountRecord").text(tempData.length);
        return tempData;
    });


    self.currentPageCustAccount = ko.computed(function () {
        var pageSizeCustAccount = parseInt(self.pageSizeCustAccount(), 10),
            startIndex = pageSizeCustAccount * self.currentPageIndexCustAccount(),
            endIndex = startIndex + pageSizeCustAccount;
        localStorage.setItem('pageSizeCustAccount', pageSizeCustAccount);
        return self.filterCustAccountList().slice(startIndex, endIndex);
    });


    self.nextPageCustAccount = function () {
        if (((self.currentPageIndexCustAccount() + 1) * self.pageSizeCustAccount()) < self.filterCustAccountList().length) {
            self.currentPageIndexCustAccount(self.currentPageIndexCustAccount() + 1);
        }
    };

    self.previousPageCustAccount = function () {
        if (self.currentPageIndexCustAccount() > 0) {
            self.currentPageIndexCustAccount(self.currentPageIndexCustAccount() - 1);
        }
    };

    self.firstPageCustAccount = function () {
        self.currentPageIndexCustAccount(0);
    };

    self.lastPageCustAccount = function () {
        tempCountCustAccount = parseInt(self.filterCustAccountList().length / self.pageSizeCustAccount(), 10);
        if ((self.filterCustAccountList().length % self.pageSizeCustAccount()) == 0)
            self.currentPageIndexCustAccount(tempCountCustAccount - 1);
        else
            self.currentPageIndexCustAccount(tempCountCustAccount);
    };


    self.iconTypeDocNo = ko.observable("");
    self.iconTypeDocDate = ko.observable("");
    self.iconTypeSpec = ko.observable("");
    self.iconTypeTotalValue = ko.observable("");
    self.iconTypeTasviye = ko.observable("");
    self.iconTypeSerialNumber = ko.observable("");

    self.sortTableCustAccount = function (viewModel, e) {

        if (e != null)
            var orderProp = $(e.target).attr("data-column")
        else {
            orderProp = localStorage.getItem("sortCustAccount");
            self.sortType = localStorage.getItem("sortTypeCustAccount");
        }

        if (orderProp == null)
            return null

        if (e != null) {
            self.currentColumn(orderProp);
            self.CustAccountList.sort(function (left, right) {
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

            localStorage.setItem("sortCustAccount", orderProp);
            localStorage.setItem("sortTypeCustAccount", self.sortType);
        }


        self.iconTypeDocNo('');
        self.iconTypeDocDate('');
        self.iconTypeSpec('');
        self.iconTypeTotalValue('');
        self.iconTypeTasviye('');
        self.iconTypeSerialNumber('');

        if (orderProp == 'DocNo') self.iconTypeDocNo((self.sortType == "ascending") ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down");
        if (orderProp == 'DocDate') self.iconTypeDocDate((self.sortType == "ascending") ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down");
        if (orderProp == 'Spec') self.iconTypeSpec((self.sortType == "ascending") ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down");
        if (orderProp == 'TotalValue') self.iconTypeTotalValue((self.sortType == "ascending") ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down");
        if (orderProp == 'Tasviye') self.iconTypeTasviye((self.sortType == "ascending") ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down");
        if (orderProp == 'SerialNumber') self.iconTypeSerialNumber((self.sortType == "ascending") ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down");
    };


    self.radif = function (index) {
        countShow = self.pageSizeCustAccount();
        page = self.currentPageIndexCustAccount();
        calc = (countShow * page) + 1;
        return index + calc;
    }

    self.ShowLinkPardakht = function (list) {
        loginAccount = "NRlhOcngQl7BwNOhU104";
        callBackUrl = "https://www.karbordcomputer.ir/";

        var SalePaymentRequestObject = {
            'CallBackUrl': callBackUrl,
            'LoginAccount': loginAccount,
            'Amount': list.TotalValue,
            'AdditionalData': '',
            'OrderId': list.SerialNumber,
            'Originator': '',
        }
        ajaxFunction(PayUri, 'Post', SalePaymentRequestObject).done(function (dataLink) {

            if (dataLink.Status == 0) {
                token = dataLink.Token;
                uriPay = dataLink.location;

                window.open(uriPay, '_blank');

                var CustAccountSaveObject = {
                    'Year': list.DocDate.substring(0, 4),
                    'SerialNumber': list.SerialNumber,
                    'OnlineParLink': uriPay,
                }
                ajaxFunction(CustAccountSaveUri + aceCustAccount + '/' + salCustAccount + '/' + groupCustAccount, 'Post', CustAccountSaveObject).done(function (dataSave) {
                    getCustAccount();
                    self.sortTableCustAccount();
                });
            }
            else {
                return showNotification(dataLink.Message,0)
            }
        });

    }

    //createViewer();

    self.ShowLinkPardakht = function (list) {

        setReport(self.FDocPList(), data, printVariable);
    };







        
   



    



    self.sortTableCustAccount();
};

ko.applyBindings(new ViewModel());

