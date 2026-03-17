import {
  FaChartLine,
  FaUserTie,
  FaUser,
  FaBell,
  FaTachometerAlt,
  FaGraduationCap,
  FaExchangeAlt,
  FaPrint,
  FaCog,
  FaCrown,
  FaBuilding,
  FaBook,
  FaFolder,
  FaBoxes,
  FaCalendarDay,
  FaFileAlt,
  FaInfoCircle,
  FaDollarSign,
  FaClipboardList,
  FaChartBar,
  FaUsers,
  FaListUl,
  FaMapMarkerAlt,
  FaUniversity,
  FaIndustry,
  FaMoneyBillAlt,
  FaBookReader,
  FaFilePdf,
  FaWarehouse,
  FaNewspaper,
  FaTimes,
  FaStar,
  FaUserGraduate,
  FaPenNib,
  FaPercentage,
  FaUserFriends,
  FaFolderOpen,
  FaTasks,
  FaFlag,
  FaMoneyCheckAlt,
  FaReceipt,
  FaCreditCard,
  FaLock,
  FaHistory,
  FaSignOutAlt,
  FaHandshake,
  FaDatabase,
  FaCalculator,
  FaUserShield,
  FaCodeBranch,
  FaCompressAlt,
  FaRecycle,
  FaFileInvoice,
  FaArrowRight,
  FaMerge,
  FaBalanceScale,
  FaFileSignature,
  FaShoppingCart,
  FaBoxOpen,
} from "react-icons/fa";
import { MdAttachMoney, MdDashboard, MdHome } from "react-icons/md";
import PersonIcon from "@mui/icons-material/Person";
import PrintIcon from "@mui/icons-material/Print";
import AssessmentIcon from "@mui/icons-material/Assessment";
import InventoryIcon from "@mui/icons-material/Inventory";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SummarizeIcon from "@mui/icons-material/Summarize";
import BarChartIcon from "@mui/icons-material/BarChart";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DescriptionIcon from "@mui/icons-material/Description";

import ReceiptIcon from "@mui/icons-material/Receipt"; // Purchase register
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"; // Month-wise
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn"; // Cash flow
import UndoIcon from "@mui/icons-material/Undo"; // Sales return
import GavelIcon from "@mui/icons-material/Gavel"; // TDS register
import ListAltIcon from "@mui/icons-material/ListAlt"; // Listing/Master
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"; // Ledger
import {
   
  FaTruck,
  
  FaFileInvoiceDollar,FaPhoneAlt, FaCoins,
  FaClipboardCheck,FaThLarge,FaMapMarkedAlt,
  FaFileContract,FaListAlt, FaCity, FaMap,
  FaArrowDown,FaMoneyBillWave,FaPercent,FaCertificate,
  FaArrowUp,FaCashRegister,FaWallet,FaLayerGroup,
  FaUndoAlt,FaShoppingBag, FaCalendarAlt
} from "react-icons/fa";



export const menuItems = [
  {
    title: "Home",
    icon: <MdHome />,

    path: "/home",
  },
  // {
  //   title: "Dashboard",
  //   icon: <MdDashboard />,

  //   path: "/dashboard",
  // },

  {
    title: "Masters",
    path: "/masters",
    icon: <FaGraduationCap />,

    submenus: [
      {
        title: "Accounts",
        path: "/masters/accounts",
        icon: <FaUsers />,
      },
      {
        title: "Account Group",
        path: "/masters/accountgroup",
        icon: <FaUsers />,
      },

      {
        title: "Main Group",
        path: "/masters/maingroup",
        icon: <FaUsers />,
      },

      {
        title: "Sub Account Group ",
        path: "/masters/subaccountgroup",
        icon: <FaUserFriends />,
      },

      {
        title: "Book",
        path: "/masters/book",
        icon: <FaBook />,
      },

      {
        title: "Book Group",
        path: "/masters/bookgroup",
        icon: <FaBook />,
      },

      {
        title: "Standard",
        path: "/masters/standard",
        icon: <FaStar />,
      },
      {
        title: "College",
        path: "/masters/college",
        icon: <FaUniversity />,
      },

      {
        title: "University ",
        path: "/masters/university",
        icon: <FaUniversity />,
      },

      {
        title: "Discount",
        path: "/masters/discount",
        icon: <FaPercentage />,
      },

      {
        title: "State..City..Area ",
        path: "/masters/location",
        icon: <FaFlag />,
      },

      {
        title: "Canvassor Master",
        path: "/masters/canvassor",
        icon: <FaUserTie />,
      },

      {
        title: "Assign Canvassor ",
        path: "/masters/assignconvassor",
        icon: <FaTasks />,
      },
      {
        title: "User ",
        path: "/masters/user",
        icon: <FaUser />,
      },

      {
        title: "T.D.S.",
        path: "/masters/tds",
        icon: <FaMoneyCheckAlt />,
      },

      {
        title: "Party Category",
        path: "/masters/partycategory",
        icon: <FaUsers />,
      },
      {
        title: "Professors",
        path: "/masters/professors",
        icon: <FaUserGraduate />,
      },

      {
        title: "Authors",
        path: "/masters/authors",
        icon: <FaPenNib />,
      },

      {
        title: "Godown ",
        path: "/masters/godown",
        icon: <FaWarehouse />,
      },

      {
        title: "Press ",
        path: "/masters/press",
        icon: <FaNewspaper />,
      },
      {
        title: "Paper Size",
        path: "/masters/papersize",
        icon: <FaFilePdf />,
      },

      {
        title: "Dispatch Mode Master",
        path: "/masters/dispatchmode",
        icon: <FaUserFriends />,
      },

      
      // {
      //   title: "Book Medium",
      //   path: "/masters/bookmedium",
      //   icon: <FaBook />,
      // },

      // {
      //   title: "College Group",
      //   path: "/masters/collegegroup",
      //   icon: <FaUniversity />,
      // },

      // {
      //   title: "Branches   ",
      //   path: "/masters/branch",
      //   icon: <FaUser />,
      // },
      // {
      //   title: "Level Master",
      //   path: "/masters/level",
      //   icon: <FaUser />,
      // },

      {
        title: "Employee Master",
        path: "/masters/employee",
        icon: <FaUser />,
      },
      {
        title: "Employee Groups",
        path: "/masters/employeegroup",
        icon: <FaUsers />,
      },
      {
        title: "Publication Master",
        path: "/masters/publication",
        icon: <FaBook />,
      },

      // {
      //   title: "Title Press Master",
      //   path: "/masters/titlepress",
      //   icon: <FaNewspaper />,
      // },

      // {
      //   title: "Plate Makers  ",
      //   path: "/masters/platemaker",
      //   icon: <FaUserFriends />,
      // },
    ],
  },

  {
    title: "Transactions",
    path: "/transaction",
    icon: <FaExchangeAlt />,

    submenus: [
      {
        title: "Receipt Voucher",
        path: "/transaction/receiptvoucher",
        icon: <FaReceipt />,
      },
      {
        title: "Payment Voucher",
        path: "/transaction/paymentvoucher",
        icon: <FaCreditCard />,
      },
      {
        title: "JV",
        path: "/transaction/jv",
        icon: <FaHandshake />,
      },
      {
        title: "Debit Note",
        path: "/transaction/debitnote",
        icon: <FaFileInvoice />,
      },
      {
        title: "Credit Note",
        path: "/transaction/creditnote",
        icon: <FaClipboardList />,
      },
      {
        title: "Bank Reconcilation",
        path: "/transaction/bankreconciliation",
        icon: <FaBalanceScale />,
      },
      {
        title: "Sales Challan",
        path: "/transaction/saleschallan",
        icon: <FaFileSignature />,
      },
      {
        title: "Sales Invoice",
        path: "/transaction/salesinvoice",
        icon: <FaFileSignature />,
      },
      {
        title: "Sales Return-Credit Note",
        path: "/transaction/salesreturn-creditnote",
        icon: <FaExchangeAlt />,
      },
      {
        title: "Purchase Return-Debit Note",
        path: "/transaction/purchasereturn-debitnote",
        icon: <FaExchangeAlt />,
      },

      {
        title: "Book Purchase",
        path: "/transaction/bookpurchase",
        icon: <FaShoppingCart />,
      },

      {
        title: "Paper Purchase",
        path: "/transaction/paperpurchase",
        icon: <FaFileInvoice />,
      },
      {
        title: "Inward Challan",
        path: "/transaction/invertchallan",
        icon: <FaBoxOpen />,
      },

      {
        title: "Canvassor Details",
        path: "/transaction/convassordetails",
        icon: <FaInfoCircle />,
      },
      {
        title: "Paper Outward for Book Printing",
        path: "/transaction/paperforbookprinting",
        icon: <FaPrint />,
      },
      {
        title: "Paper Received from Binder",
        path: "/transaction/paperreceivedfrombinder",
        icon: <FaPrint />,
      },
      {
        title: "MissPrint",
        path: "/transaction/missprint",
        icon: <FaPrint />,
      },
      {
        title: "Sales For Canvassor",
        path: "/transaction/salestoconvassor",
        icon: <FaArrowRight />,
      },
      // {
      //   title: "Merge Book",
      //   path: "/transaction/mergebook",
      //   icon: <FaCompressAlt />,
      // },
      {
        title: "Book Printing order to Press",
        path: "/transaction/bookprintingordertopress",
        icon: <FaPrint />,
      },
      // {
      //   title: "Convassor daily Report",
      //   path: "/transaction/convassordailyreport",
      //   icon: <FaFileAlt />,
      // },

      {
        title: "Raddi Sales",
        path: "/transaction/raddisales",
        icon: <FaRecycle />,
      },
    ],
  },

  {
    title: "Printing",
    path: "/printing",
    icon: <FaPrint />,

    submenus: [
      {
        title: "Ledger",
        path: "/printing/ledger",
        icon: <FaBook />,
      },
      {
        title: "All Documents",
        path: "/printing/alldocuments",
        icon: <FaFolder />,
          submenus: [
          {
            title: "Sales Challan",
            path: "/printing/alldocuments/saleschallan",
            icon: <FaTruck />,
          },
          {
            title: "Sales Invoice",
            path: "/printing/alldocuments/salesinvoice",
            icon: <FaFileInvoice />,
          },
          {
            title: "Receipt",
            path: "/printing/alldocuments/receipt",
            icon: <FaReceipt />,
          },
          {
            title: "Bank Letter",
            path: "/printing/alldocuments/bankletter",
            icon: <FaUniversity />,
          },
          {
            title: "Purchse Bill",
            path: "/printing/alldocuments/purchsebill",
            icon: <FaFileInvoiceDollar />,
          },
          {
            title: "Delivery Challan other than PBH",
            path: "/printing/alldocuments/deliverychallanotherthanPBH",
            icon: <FaClipboardCheck />,
          },
          {
            title: "Invoice other than PBH",
            path: "/printing/alldocuments/invoiceotherthanPBH",
            icon: <FaFileContract />,
          },

           {
            title: "Credit Advice",
            path: "/printing/alldocuments/creditadvice",
            icon: <FaArrowDown />,
          },
          {
            title: "Debit Note",
            path: "/printing/alldocuments/debitnote",
            icon: <FaArrowUp />,
          },
          {
            title: "Sales Return Credit Note",
            path: "/printing/alldocuments/salesreturncreditnote",
            icon: <FaUndoAlt />,
          },
          // {
          //   title: "Voucher",
          //   path: "/printing/alldocuments/voucher",
          //   icon: <FaFileAlt />,
          // },
        ],
      },
      {
        title: "Books of Accounts",
        path: "/printing/booksofaccounts",
        icon: <FaBook />,

        submenus:  [
         {
            title: "Cash Book / Bank Book",
            path: "/printing/booksofaccounts/cashbookbankbook",
            icon: <FaMoneyBillWave  />,
          },
           {
            title: "Journal Register",
            path: "/printing/booksofaccounts/journalreg",
            icon: <FaBook  />,
          },
               {
            title: "Day Book",
            path: "/printing/booksofaccounts/daybook",
            icon: <FaCalendarDay  />,
          },
               {
            title: "Debit Note Register",
            path: "/printing/booksofaccounts/debitnotereg",
            icon: <FaReceipt  />,
          },
               {
            title: "Credit Note Register",
            path: "/printing/booksofaccounts/creditnotereg",
            icon: <FaUndoAlt  />,
          },
               {
            title: "Sales",
            path: "/printing/booksofaccounts/sales",
            icon: <FaShoppingCart  />,
            submenus: [
                {
            title: "Challan Register",
            path: "/printing/booksofaccounts/challanreg",
            icon: <FaTruck />,
          },
            {
            title: "Sales Register",
            path: "/printing/booksofaccounts/salesreg",
            icon: <FaFileInvoice   />,
          },
            {
            title: "Sales Summary Datewise",
            path: "/printing/booksofaccounts/salessummarydatewise",
            icon: <FaChartLine />,
          },

            ]
          },
               {
            title: "Purchase",
            path: "/printing/booksofaccounts/purchase",
            icon: <FaShoppingBag  />,

             submenus: [
                {
            title: "Purchase Register",
            path: "/printing/booksofaccounts/purchase/purchasereg",
            icon: <FaFileInvoiceDollar />,
          },
            {
            title: "Purchse Register Summary",
            path: "/printing/booksofaccounts/purchase/purchaseregsummary",
            icon: <FaChartBar />,
          },
            {
            title: "Purchse Register Monthly Summary",
            path: "/printing/booksofaccounts/purchase/purchaseregmonthlysummary",
            icon: <FaCalendarAlt />,
          },

            ]
          },
               {
            title: "TDS",
            path: "/printing/booksofaccounts/tds",
            icon: <FaPercent  />,

             submenus: [
                {
            title: "TDS Register",
            path: "/printing/booksofaccounts/tdsreg",
            icon: <FaReceipt  />,
          },
            {
            title: "TDS Master Listing",
            path: "/printing/booksofaccounts/tdsmasterlisting",
            icon: <FaUsers  />,
          },
            {
            title: "Yearly TDS Register",
            path: "/printing/booksofaccounts/yearlytdsreg",
            icon: <FaCalendarDay  />,
          },
            {
            title: "TDS Certificate",
            path: "/printing/booksofaccounts/tdscertificate",
            icon: <FaCertificate  />,
          },

            ]
          },

               {
            title: "Cash Flow Daywise",
            path: "/printing/booksofaccounts/cashflowdaywise",
            icon: <FaCashRegister  />,
          },
               {
            title: "Cash Flow Monthwise",
            path: "/printing/booksofaccounts/cashflowmonthwise",
            icon: <FaChartBar  />,
          },
               {
            title: "Receipt Register",
            path: "/printing/booksofaccounts/receiptreg",
            icon: <FaReceipt  />,
          },
               {
            title: "Sales Return Credit Note Register",
            path: "/printing/booksofaccounts/salesreturncreditnotereg",
            icon: <FaUndoAlt  />,
          },
               {
            title: "Purchase Return Debit Note",
            path: "/printing/booksofaccounts/purchasereturndebitnote",
            icon: <FaExchangeAlt  />,
          },
               {
            title: "Sales Register Summary",
            path: "/printing/booksofaccounts/salesregsummary",
            icon: <FaChartLine  />,
          },
               {
            title: "Inward Register",
            path: "/printing/booksofaccounts/inwardreg",
            icon: <FaTruck  />,
          },
               {
            title: "Transaction Summary",
            path: "/printing/booksofaccounts/transactionsummary",
            icon: <FaBalanceScale  />,
          },
               {
            title: "TDS & Party",
            path: "/printing/booksofaccounts/tdsandparty",
            icon: <FaUsers  />,
          },
      ],
      },
     
      {
        title: "Final Reports",
        path: "/printing/finalreports",
        icon: <FaFileAlt />,
        submenus:[
           {
            title: "Trial Bal-Simple",
            path: "/printing/finalreports/trialbalsimple",
            icon: <FaBalanceScale  />,
          },
             {
            title: "Trial Bal-Periodical",
            path: "/printing/finalreports/trialbalperiodical",
            icon: <FaCalendarAlt />,
          },
           {
            title: "P & L A/C",
            path: "/printing/finalreports/pandlacc",
            icon: <FaChartLine  />,
          },
           {
            title: "Balance Sheet",
            path: "/printing/finalreports/balancesheet",
            icon: <FaBuilding  />,
          }, {
            title: "Fixed Asset Schedule",
            path: "/printing/finalreports/fixedassetschedule",
            icon: <FaLayerGroup  />,
          }, {
            title: "P & L Acc with Last Year Balance",
            path: "/printing/finalreports/pandlaccwithlastyearbal",
            icon: <FaChartBar  />,
          }, {
            title: "Schedule",
            path: "/printing/finalreports/schedule",
            icon: <FaFileAlt  />,
          }, {
            title: "Capital Accounts",
            path: "/printing/finalreports/capitalaccounts",
            icon: <FaWallet  />,
          },
        ]
      },
      {
        title: "Stock",
        path: "/printing/stock",
        icon: <FaBoxes />,

        submenus: [
          {
            title: "Stock Day Book",
            path: "/printing/stock/stockdaybook",
            icon: <FaCalendarDay />,
          },
          {
            title: "Stock Book",
            path: "/printing/stock/stockbook",
            icon: <FaBook />,
          },
          {
            title: "Stock Statement",
            path: "/printing/stock/stockstatement",
            icon: <FaFileAlt />,
          },
          {
            title: "Stock Statement Details",
            path: "/printing/stock/stockstmtdetails",
            icon: <FaInfoCircle />,
          },
          {
            title: "Net sale",
            path: "/printing/stock/netsale",
            icon: <FaDollarSign />,
          },
          {
            title: "Net sale Summary",
            path: "/printing/stock/netsalesummary",
            icon: <FaClipboardList />,
          },
          {
            title: "Book Purchase Repo",
            path: "/printing/stock/bookpurchaserepo",
            icon: <FaBook />,
          },
        ],
      },
      {
        title: "MIS Reports",
        path: "/printing/misreports",
        icon: <FaChartBar />,
      },
      {
        title: "MISC Reports",
        path: "/printing/miscreports",
        icon: <FaFileAlt />,

        submenus: [
          {
            title: "Account Groups",
            path: "/printing/miscreports/accountgroups",
            icon: <FaUsers />,
          },
          {
            title: "Book Listing",
            path: "/printing/miscreports/booklisting",
            icon: <FaBook />,
          },
          {
            title: "FBT Listing",
            path: "/printing/miscreports/fbtlisting",
            icon: <FaClipboardList />,
          },
        ],
      },

      {
        title: "Listing",
        path: "/printing/listing",
        icon: <FaListUl />,

        submenus: [
          {
            title: "Area",
            path: "/printing/listing/area",
            icon: <FaMapMarkerAlt />,
          },
          {
            title: "Canvassors party Listing",
            path: "/printing/listing/convassorspartylisting",
            icon: <FaIndustry />,
          },
          {
            title: "Party listing",
            path: "/printing/listing/partylisting",
            icon: <FaUser />,
          },
          {
            title: "Convassing College List",
            path: "/printing/listing/convassingcollegelist",
            icon: <FaUniversity />,
          },
        ],
      },

      {
        title: "Display Ledger",
        path: "/printing/displayledger",
        icon: <FaBook />,
      },
      // {
      //   title: "Ageing Analysis-convassor",
      //   path: "/printing/ageinganalysis-convassor",
      //   icon: <FaChartLine />,
      // },
      {
        title: "Ageing Analysis-Amount wise",
        path: "/printing/ageinganalysis-amountwise",
        icon: <FaMoneyBillAlt />,
      },


      {
        title: "Canvassing Reports",
        path: "/printing/canvassingreports",
        icon: <FaChartBar />,

        submenus:[
            {
        title: "Canvassing Listing",
        path: "/printing/canvassingreports/canvlisting",
        icon: <FaListAlt  />,
      },

       {
        title: "Canvassing Groupwise",
        path: "/printing/canvassingreports/canvgroupwise",
        icon: <FaLayerGroup  />,
      },

         {
        title: "Canvassing Bookwise",
        path: "/printing/canvassingreports/canvbookwise",
        icon: <FaBook  />,
      },
         {
        title: "Canvassing Book Summary",
        path: "/printing/canvassingreports/canvbooksummary",
        icon: <FaThLarge  />,
      },

         {
        title: "Canvassing Collegewise",
        path: "/printing/canvassingreports/canvcollegewise",
        icon: <FaUniversity  />,
      },

         {
        title: "Canvassing Areawise",
        path: "/printing/canvassingreports/canvareawise",
        icon: <FaMapMarkedAlt  />,
      },
         {
        title: "Canvassing Areawise Summary",
        path: "/printing/canvassingreports/canvareawisesummary",
        icon: <FaMap  />,
      },
         {
        title: "Inv. Citywise",
        path: "/printing/canvassingreports/invcitywise",
        icon: <FaCity  />,
      },
         {
        title: "Inv. Citywise Cross",
        path: "/printing/canvassingreports/invcitywisecross",
        icon: <FaBoxes  />,
      },
         {
        title: "Canvassing Specimen Total",
        path: "/printing/canvassingreports/canvspecimentotal",
        icon: <FaBalanceScale  />,
      },

         {
        title: "Canvassing Summary Cross",
        path: "/printing/canvassingreports/canvsummarycross",
        icon: <FaBoxes  />,
      },
         {
        title: "Canvassing Districtwise Summary",
        path: "/printing/canvassingreports/canvdistsummary",
        icon: <FaMap  />,
      },

         {
        title: "Canvassing Collegewise Summary",
        path: "/printing/canvassingreports/canvcollegewisesummary",
        icon: <FaBuilding  />,
      },
            {
        title: "Canvassing Collegewise Summary Cross",
        path: "/printing/canvassingreports/canvcollegewisesummarycross",
        icon: <FaBoxes  />,
      },

         {
        title: "Account Master listing Mobile Nos",
        path: "/printing/canvassingreports/accmasterlistingmobilenos",
        icon: <FaPhoneAlt  />,
      },


         {
        title: "Canvassor Expenses",
        path: "/printing/canvassingreports/canvexpenses",
        icon: <FaMoneyBillWave  />,
      },
         {
        title: "Canvassor Expenses headwise Summary",
        path: "/printing/canvassingreports/canvexpheadwisesummary",
        icon: <FaCoins  />,
      },
         {
        title: "Netsale Canvassing",
        path: "/printing/canvassingreports/netsalecanvassing",
        icon: <FaChartLine  />,
      },

        ]
      },
      {
        title: "Book Printing Order",
        path: "/printing/bookprintingorder",
        icon: <FaBookReader />,
      },
     
    ],
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <FaCog />,

    submenus: [
      {
        title: "Company Master",
        path: "/settings/companymaster",
        icon: <FaBuilding />,
      },
      {
        title: "User Rights",
        path: "/settings/userrights",
        icon: <FaUserShield />,
      },
       {
        title: "Company Rights",
        path: "/settings/companyrights",
        icon: <FaUserShield />,
      },

      {
        title: "Interest Calculation",
        path: "/settings/interestcalculation",
        icon: <FaCalculator />,
      },
      {
        title: "Lock Data",
        path: "/settings/lockdata",
        icon: <FaLock />,
      },
    ],
  },
  {
    title: "Royalty",
    icon: <FaCrown />,
    path: "/royalty",
    allowedCompanies: ["PP", "PBH"], // only these companies
  },

  {
    title: "Reports",
    icon: <AssessmentIcon />,
    path: "/reports",

    submenus: [
      {
        title: "Ledger",
        path: "/reports/ledgerreport",
        icon: <AccountBalanceIcon />,
        type: "single",
      },
      {
        title: "Purchase Register",
        path: "/reports/purchaseregisterreport",
        icon: <ReceiptIcon />,
        type: "single",
      },

      {
        title: "Cash flow Monthwise",
        path: "/reports/cashflowmonthwisereport",
        icon: <MonetizationOnIcon />,
        type: "single",
      },

      {
        title: "Purchase Monthwise",
        path: "/reports/purchasemonthwisereport",
        icon: <CalendarMonthIcon />,
        type: "single",
      },

      {
        title: "Purchase Register Summary",
        path: "/reports/purchaseregsummaryreport",
        icon: <AssessmentIcon />,
        type: "single",
      },

      {
        title: "Sales Return Register",
        path: "/reports/salesreturnregisterreport",
        icon: <UndoIcon />,
        type: "single",
      },

      {
        title: "TDS Register",
        path: "/reports/tdsregisterreport",
        icon: <GavelIcon />,
        type: "single",
      },

      {
        title: "Stock Reports",
        path: "/reports/stockreports",
        icon: <InventoryIcon />,
        type: "group",

        submenus: [
          {
            title: "Book Details",
            path: "/reports/stockreports/bookdetails",
            icon: <MenuBookIcon />,
          },
          {
            title: "Net Sale",
            path: "/reports/stockreports/netsale",
            icon: <MdAttachMoney />,
          },
          {
            title: "Net Sale Summary",
            path: "/reports/stockreports/netsalesummaryreport",
            icon: <SummarizeIcon />,
          },
          {
            title: "Sales Bookwise Partywise",
            path: "/reports/stockreports/salesbookwisepartywise",
            icon: <BarChartIcon />,
          },
          {
            title: "Stock Book",
            path: "/reports/stockreports/stockbookreport",
            icon: <MenuBookIcon />,
          },
          {
            title: "Stock Day Book",
            path: "/reports/stockreports/stockdaybookreport",
            icon: <EventNoteIcon />,
          },
          {
            title: "Stock Statement",
            path: "/reports/stockreports/stockstatementreport",
            icon: <ReceiptLongIcon />,
          },
          {
            title: "Stock Statement Details",
            path: "/reports/stockreports/stockstmtdetailsreport",
            icon: <DescriptionIcon />,
          },
        ],
      },
      {
        title: "Paper Reports",
        path: "/reports/paperreports",
        icon: <InventoryIcon />,
        type: "group",

        submenus: [
          {
            title: "Paper Outward Paperwise Report",
            path: "/reports/paperreports/paperoutwardpaperwise",
            icon: <MenuBookIcon />,
          },
          {
            title: "Paper Outward Partywise Report",
            path: "/reports/paperreports/paperoutwardpartywise",
            icon: <MenuBookIcon />,
          },
          {
            title: "Godown Wise Paper Report",
            path: "/reports/paperreports/godownwisepaper",
            icon: <MenuBookIcon />,
          },
          {
            title: "Book print order Report",
            path: "/reports/paperreports/bookprintorder",
            icon: <MenuBookIcon />,
          },
          {
            title: "Book print Order Summary Report",
            path: "/reports/paperreports/bookprintordersummary",
            icon: <MenuBookIcon />,
          },
        ],
      },

      {
        title: "Royalty Reports",
        path: "/reports/royaltyreports",
        icon: <InventoryIcon />,
        type: "group",

        submenus: [
          {
            title: "Royalty Statement Summary",
            path: "/reports/royaltyreports/royaltystmtsummary",
            icon: <MenuBookIcon />,
          },
          {
            title: "Royalty Stock Author",
            path: "/reports/royaltyreports/royaltystockauth",
            icon: <MdAttachMoney />,
          },
        ],
      },
    ],
  },
];
