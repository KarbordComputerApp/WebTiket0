using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net.NetworkInformation;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using WebTiket.Controllers.Unit;


namespace WebTiket.Controllers.Unit
{
    public class UnitPublic
    {
        public static string titleVer = "ورژن تست : ";
        public static string titleVerNumber = "10"; 

        //public static string titleVer = "ورژن : ";
        //public static string titleVerNumber = "1020";

        //public static string MAC;
        //public static string IP4;




        //Server.MapPath("ini/SqlServerConfig.Ini");
        public static string Appddress; //ادرس نرم افزار
        public static IniFile MyIniServer;
        public static string apiAddress;
        public static char[] afiAccess;
        //public static string ace;
        //public static string group;
        //public static string sal;

        public static List<SelectListItem> free = new List<SelectListItem>();
        public static List<SelectListItem> aceList = new List<SelectListItem>(); //لیست نرم افزار ها
        public static List<SelectListItem> accList = new List<SelectListItem>();//لیست گروه های حسابداری
        public static List<SelectListItem> invList = new List<SelectListItem>();//لیست گروه های انبار
        public static List<SelectListItem> fctList = new List<SelectListItem>();//لیست گروه های فروش
        public static List<SelectListItem> afiList = new List<SelectListItem>();//لیست گروه های مالی و بازرگانی

        public static List<SelectListItem> accSalList = new List<SelectListItem>();//لیست سال حسابداری
        public static List<SelectListItem> invSalList = new List<SelectListItem>();//لیست سال انبار
        public static List<SelectListItem> fctSalList = new List<SelectListItem>();//لیست سال فروش
        public static List<SelectListItem> afiSalList = new List<SelectListItem>();//لیست سال مالی و بازرگانی
    }
}