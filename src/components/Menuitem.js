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

export const menuItems = [
  {
    title: "Home",
    icon: <MdHome />,

    path: "/home",
  },
  {
    title: "Dashboard",
    icon: <MdDashboard />,

    path: "/dashboard",
  },

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
        title: "Account Groups",
        path: "/masters/accountgroup",
        icon: <FaUsers />,
      },
      {
        title: "Books",
        path: "/masters/book",
        icon: <FaBook />,
      },
      {
        title: "Book Groups",
        path: "/masters/bookgroup",
        icon: <FaBook />,
      },
      {
        title: "Book Mediums",
        path: "/masters/bookmedium",
        icon: <FaBook />,
      },

      {
        title: "Standards",
        path: "/masters/standard",
        icon: <FaStar />,
      },
      {
        title: "Colleges",
        path: "/masters/college",
        icon: <FaUniversity />,
      },
      {
        title: "College Groups  ",
        path: "/masters/collegegroup",
        icon: <FaUniversity />,
      },
      {
        title: "Universities ",
        path: "/masters/university",
        icon: <FaUniversity />,
      },

      {
        title: "Commissions  ",
        path: "/masters/commission",
        icon: <FaPercentage />,
      },

      {
        title: "Discounts   ",
        path: "/masters/discount",
        icon: <FaPercentage />,
      },
      {
        title: "Assign Convassors  ",
        path: "/masters/assignconvassor",
        icon: <FaTasks />,
      },
      {
        title: "Users  ",
        path: "/masters/user",
        icon: <FaUser />,
      },
      {
        title: "Branches   ",
        path: "/masters/branch",
        icon: <FaUser />,
      },
      {
        title: "Levels  ",
        path: "/masters/level",
        icon: <FaUser />,
      },
      // {
      //   title: "Countries  ",
      //   path: "/masters/country",
      //   icon: <FaFlag />,
      // },
      // {
      //   title: "States   ",
      //   path: "/masters/state",
      //   icon: <FaFlag />,
      // },

      {
        title: "Cities",
        path: "/masters/city",
        icon: <FaFlag />,
      },

      {
        title: "Areas",
        path: "/masters/area",
        icon: <FaFlag />,
      },
      {
        title: "TDS's",
        path: "/masters/tds",
        icon: <FaMoneyCheckAlt />,
      },
      {
        title: "Depositer Groups",
        path: "/masters/depositorgroup",
        icon: <FaUserFriends />,
      },
      {
        title: "Prof Categories",
        path: "/masters/profcategory",
        icon: <FaFolderOpen />,
      },
      {
        title: "Professors",
        path: "/masters/professors",
        icon: <FaUserGraduate />,
      },
      // {
      //   title: "Professors",
      //   path: "/masters/professors/proflist",
      //   icon: <FaUserGraduate />,
      // },

      {
        title: "Employees",
        path: "/masters/employee",
        icon: <FaUser />,
      },
      {
        title: "Employee Groups",
        path: "/masters/employeegroup",
        icon: <FaUsers />,
      },
      {
        title: "Publications",
        path: "/masters/publication",
        icon: <FaBook />,
      },
      {
        title: "Authors",
        path: "/masters/authors",
        icon: <FaPenNib />,
      },
      {
        title: "Godowns",
        path: "/masters/godown",
        icon: <FaWarehouse />,
      },

      {
        title: "Title Presses",
        path: "/masters/titlepress",
        icon: <FaNewspaper />,
      },
      {
        title: "Presses  ",
        path: "/masters/press",
        icon: <FaNewspaper />,
      },
      {
        title: "Paper Sizes  ",
        path: "/masters/papersize",
        icon: <FaFilePdf />,
      },
      {
        title: "Sub Account Groups  ",
        path: "/masters/subaccountgroup",
        icon: <FaUserFriends />,
      },

      {
        title: "Dispatch Modes  ",
        path: "/masters/dispatchmode",
        icon: <FaUserFriends />,
      },

      {
        title: "Cost Centers  ",
        path: "/masters/costcenter",
        icon: <FaUserFriends />,
      },

      {
        title: "Plate Makers  ",
        path: "/masters/platemaker",
        icon: <FaUserFriends />,
      },
      // {
      //   title: "Cancel",
      //   path: "/masters/cancel",
      //   icon: <FaTimes  />,
      // },
    ],
  },

  {
    title: "Transactions",
    path: "/transaction",
    icon: <FaExchangeAlt />,

    submenus: [
      {
        title: "Receipts",
        path: "/transaction/receiptvoucher",
        icon: <FaReceipt />,
      },
      {
        title: "Payments",
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
      // {
      //   title: "TDS Entry",
      //   path: "/transaction/tds",
      //   icon: <FaMoneyCheckAlt />,
      // },
      {
        title: "Convassor Details",
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
        title: "MisPrint",
        path: "/transaction/misprint",
        icon: <FaPrint />,
      },
      {
        title: "Sales For Convassors",
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
      {
        title: "Convassor daily Report",
        path: "/transaction/convassordailyreport",
        icon: <FaFileAlt />,
      },

      {
        title: "Raddi Sales",
        path: "/transaction/raddisales",
        icon: <FaRecycle />,
      },
    ],
  },

  // {
  //   title: "Printing",
  //   path: "/printing",
  //   icon: <FaPrint />,

  //   submenus: [
  //     {
  //       title: "Ledger",
  //       path: "/printing/ledger",
  //       icon: <FaBook />,
  //     },
  //     {
  //       title: "All Documents",
  //       path: "/printing/alldocuments",
  //       icon: <FaFolder />,
  //     },
  //     {
  //       title: "Books of Accounts",
  //       path: "/printing/booksofaccounts",
  //       icon: <FaBook />,
  //     },
  //     {
  //       title: "Final Reports",
  //       path: "/printing/finalreports",
  //       icon: <FaFileAlt />,
  //     },
  //     {
  //       title: "Stock",
  //       path: "/printing/stock",
  //       icon: <FaBoxes />,

  //       submenus: [
  //         {
  //           title: "Stock Day Book",
  //           path: "/printing/stock/stockdaybook",
  //           icon: <FaCalendarDay />,
  //         },
  //         {
  //           title: "Stock Book",
  //           path: "/printing/stock/stockbook",
  //           icon: <FaBook />,
  //         },
  //         {
  //           title: "Stock Statement",
  //           path: "/printing/stock/stockstatement",
  //           icon: <FaFileAlt />,
  //         },
  //         {
  //           title: "Stock Statement Details",
  //           path: "/printing/stock/stockstmtdetails",
  //           icon: <FaInfoCircle />,
  //         },
  //         {
  //           title: "Net sale",
  //           path: "/printing/stock/netsale",
  //           icon: <FaDollarSign />,
  //         },
  //         {
  //           title: "Net sale Summary",
  //           path: "/printing/stock/netsalesummary",
  //           icon: <FaClipboardList />,
  //         },
  //         {
  //           title: "Book Purchase Repo",
  //           path: "/printing/stock/bookpurchaserepo",
  //           icon: <FaBook />,
  //         },
  //       ],
  //     },
  //     {
  //       title: "MIS Reports",
  //       path: "/printing/misreports",
  //       icon: <FaChartBar />,
  //     },
  //     {
  //       title: "MISC Reports",
  //       path: "/printing/miscreports",
  //       icon: <FaFileAlt />,

  //       submenus: [
  //         {
  //           title: "Account Groups",
  //           path: "/printing/miscreports/accountgroups",
  //           icon: <FaUsers />,
  //         },
  //         {
  //           title: "Book Listing",
  //           path: "/printing/miscreports/booklisting",
  //           icon: <FaBook />,
  //         },
  //         {
  //           title: "FBT Listing",
  //           path: "/printing/miscreports/fbtlisting",
  //           icon: <FaClipboardList />,
  //         },
  //       ],
  //     },

  //     {
  //       title: "Listing",
  //       path: "/printing/listing",
  //       icon: <FaListUl />,

  //       submenus: [
  //         {
  //           title: "Area",
  //           path: "/printing/listing/area",
  //           icon: <FaMapMarkerAlt />,
  //         },
  //         {
  //           title: "Convassors party Listing",
  //           path: "/printing/listing/convassorspartylisting",
  //           icon: <FaIndustry />,
  //         },
  //         {
  //           title: "Party listing",
  //           path: "/printing/listing/partylisting",
  //           icon: <FaUser />,
  //         },
  //         {
  //           title: "Convassing College List",
  //           path: "/printing/listing/convassingcollegelist",
  //           icon: <FaUniversity />,
  //         },
  //       ],
  //     },

  //     {
  //       title: "Display Ledger",
  //       path: "/printing/displayledger",
  //       icon: <FaBook />,
  //     },
  //     {
  //       title: "Ageing Analysis-convassor",
  //       path: "/printing/ageinganalysis-convassor",
  //       icon: <FaChartLine />,
  //     },
  //     {
  //       title: "Ageing Analysis-Amount wise",
  //       path: "/printing/ageinganalysis-amountwise",
  //       icon: <FaMoneyBillAlt />,
  //     },
  //     {
  //       title: "Convassing Reports",
  //       path: "/printing/convassingreports",
  //       icon: <FaChartBar />,
  //     },
  //     {
  //       title: "Book Printing Order",
  //       path: "/printing/bookprintingorder",
  //       icon: <FaBookReader />,
  //     },
  //     // {
  //     //   title: "Cancel",
  //     //   path: "/printing/cancel",
  //     //   icon: <FaTimes  />,
  //     // },
  //   ],
  // },
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
      // {
      //   title: "Split Data",
      //   path: "/settings/splitdata",
      //   icon: <FaCodeBranch />,
      // },
      // {
      //   title: "Backup-Current Company",
      //   path: "/settings/backup-currentcompany",
      //   icon: <FaDatabase />,
      // },
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
      {
        title: "Restore Data",
        path: "/settings/restoredata",
        icon: <FaHistory />,
      },
      // {
      //   title: "Cancel",
      //   path: "/settings/cancel",
      //   icon: <FaTimes  />,
      // },
    ],
  },
  {
    title: "Royalty",
    icon: <FaCrown />,
    path: "/royalty",
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

      // {
      //   title: "TDS master listing",
      //   path: "/reports/tdsmasterlistingreport",
      //   icon: <ListAltIcon />,
      // },
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
