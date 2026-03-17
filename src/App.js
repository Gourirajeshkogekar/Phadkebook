import React, { useState, useEffect } from "react";
import "./App.css";
import { Router, Routes, Route, HashRouter } from "react-router-dom";
import { ProSidebarProvider } from "react-pro-sidebar";
import SidebarMenu from "./components/SidebarMenu";
import TopMenuBar from "./components/TopMenuBar";
import Login from "./components/Login";
import { Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import ContactSupport from "./Pages/Contactsupport";
import Dashboard from "./Pages/Dashboard";
import Masters from "./Pages/Masters";
import Transactions from "./Pages/Transactions";
import Printing from "./Pages/Printing";
import Settings from "./Pages/Settings";
import Royalty from "./Pages/Royalty";
import Navbar from "./components/Navbar";
import DepositorGroup from "./Masterpages/DepositorGroup";
import Accounts from "./Masterpages/Accounts";
import AccountGroup from "./Masterpages/AccountGroup";
import Book from "./Masterpages/Book";
import BookGroup from "./Masterpages/BookGroup";
import BookMedium from "./Masterpages/BookMedium";
import Standard from "./Masterpages/Standard";
import College from "./Masterpages/College";
import University from "./Masterpages/University";
import Discount from "./Masterpages/Discount";
import Commission from "./Masterpages/Commission";
import AssignConvassor from "./Masterpages/AssignConvassor";
import User from "./Masterpages/User";
import BranchMaster from "./Masterpages/BranchMaster";
import LevelMaster from "./Masterpages/LevelMaster";
import Country from "./Masterpages/Country";
import State from "./Masterpages/State";
import Location from "./Masterpages/Location";
import AreaMaster from "./Masterpages/Area";
import Mastertds from "./Masterpages/TDS";
import ProfCategory from "./Masterpages/ProfCategory";
import Professors from "./Masterpages/Professors";
import Publication from "./Masterpages/Publication";
import Authors from "./Masterpages/Authors";
import Godown from "./Masterpages/Godown";
import Press from "./Masterpages/Press";
import PaperSize from "./Masterpages/PaperSize";
import Subaccountgroup from "./Masterpages/SubAccountGroup";
import Mastercancel from "./Masterpages/Cancel";
import Payment from "./Transactionpages/Paymentvoucher";
import JV from "./Transactionpages/JV";
import Debitnote from "./Transactionpages/Debitnote";
import Creditnote from "./Transactionpages/Creditnote";
import Bankreconciliation from "./Transactionpages/Bankreconciliation";
import Saleschallan from "./Transactionpages/Saleschallan";
import Salesinvoice from "./Transactionpages/Salesinvoice";
import Salesreturn from "./Transactionpages/Salesreturncreditnote";
import Purchasereturn from "./Transactionpages/Purchasereturndebitnote";
import Bookpurchase from "./Transactionpages/Bookpurchase";
import Inwardchallan from "./Transactionpages/Inwardchallan";
import TransTDS from "./Transactionpages/TDSEntry";
import Convassordetails from "./Transactionpages/Convassordetails";
import Paperforprinting from "./Transactionpages/Paperoutforprinting";
import PaperReceivedfrombinder from "./Transactionpages/PaperReceivedfrombinder";
import Misprint from "./Transactionpages/Misprint";
import Salestoconvassor from "./Transactionpages/Salestoconvassors";
import Mergebook from "./Transactionpages/Mergebook";
import Convassordailyreport from "./Transactionpages/Convassordailyreport";
import Raddisales from "./Transactionpages/Raddisales";
import Transcancel from "./Transactionpages/Cancel";
import Salesreturncreditnote from "./Transactionpages/Salesreturncreditnote";
import Purchasereturndebitnote from "./Transactionpages/Purchasereturndebitnote";
import Bookprintingordertopress from "./Transactionpages/Bookprintingordertopress";
import Ledger from "./Printingpages/Ledger/Ledger";
import Alldocuments from "./Printingpages/Alldocuments/Alldocuments";
import Booksofacc from "./Printingpages/Booksofaccounts/Booksofaccounts";
import Finalrepo from "./Printingpages/Finalreports/Finalreports";
import stock from "./Printingpages/Stock/Stock";
import Misrepo from "./Printingpages/MISReports/Misreports";
import Miscrepo from "./Printingpages/MISCReports/Miscreports";
import Listing from "./Printingpages/Listing/Listing";
import Displayledger from "./Printingpages/DisplayLedger/Displayledger";
import Ageinganalysisconvassor from "./Printingpages/AgeingAnalysisCanvassor/Ageinganalysisconvassor";
import Ageinganalysisamountwise from "./Printingpages/AgeingAnalysisAmountwise/Ageinganalysisamounwise";
import CanvassingReportsLayout  from "./Printingpages/CanvassingReports/CanvassingReportsLayout";
import Bookprintingorder from "./Printingpages/BookPriningOrder/BookPrintingorder";
 import Company from "./Settingpages/Company";
import Userrights from "./Settingpages/Userrights";
import Splitdata from "./Settingpages/Splitdata";
import Backupcurrentcomp from "./Settingpages/Backupcurrentcomp";
import Interestcalc from "./Settingpages/Interestcal";
import Lockdata from "./Settingpages/Lockdata";
import Restoredata from "./Settingpages/Restoredata";
import Settingcancel from "./Settingpages/Cancel";
import Stockdaybook from "./Printingpages/Stock/StockDayBook/Stockdaybook";
import Stockbook from "./Printingpages/Stock/StockBook/Stockbook";
import Stockstmt from "./Printingpages/Stock/StockStatement/Stockstmt";
import Stockstmtdetails from "./Printingpages/Stock/StockStatementDetails/Stockstmtdetails";
import Netsale from "./Printingpages/Stock/Netsale/Netsale";
import Netsalesummary from "./Printingpages/Stock/NetsaleSummary/Netsalesummary";
import Bookpurchasereport from "./Printingpages/Stock/BookPurchaseReport/Bookpurchasereport";
import Stock from "./Printingpages/Stock/Stock";
import Accountgroup from "./Printingpages/MISCReports/AccountGroups/Accountgroup";
import Bookilisting from "./Printingpages/MISCReports/BookListing/Booklisting";
import FBTstmt from "./Printingpages/MISCReports/FBTStatement/FBTstmt";
import Area from "./Printingpages/Listing/Area/Area";
import Canvassorpartylisting from "./Printingpages/Listing/CanvassorspartyListing/Convassorpartylisting";
import Partylisting from "./Printingpages/Listing/PartyListing/Partylisting";
import Canvassingcollgelist from "./Printingpages/Listing/CanvassingCollegeList/Convassingcollegelist";
import Booklisting from "./Printingpages/MISCReports/BookListing/Booklisting";
import Convassingcollegelist from "./Printingpages/Listing/CanvassingCollegeList/Convassingcollegelist";
import Interestcal from "./Settingpages/Interestcal";
import Cancel from "./Settingpages/Cancel";
import Sidebar from "./components/Sidebar";
import Exit from "./Pages/Exit";
import TitlePress from "./Masterpages/TitlePress";
import Dispatchmode from "./Masterpages/Dispatchmode";
import CostCenter from "./Masterpages/CostCenterMaster";
import Receiptvoucher from "./Transactionpages/Receiptvoucher";
import Salesinvoiceprint from "./Transactionpages/Salesinvoiceprint";
import Saleschallanprint from "./Transactionpages/Saleschallanprint";
import Salesreturncreditnoteprint from "./Transactionpages/Salesreturncreditnoteprint";
import Canvassorbillprint from "./Transactionpages/SalestocanvassorBillprint";
import Receiptvoucherprint from "./Transactionpages/Receiptvoucherprint";
import Employee from "./Masterpages/Employee";
import Collegegroup from "./Masterpages/Collegegroup";
import Employeegroup from "./Masterpages/Employeegroup";
import ProfessorList from "./Masterpages/ProfessorList";
import RoyaltyLetterPrint from "./Royaltypages/Royaltyletterprint";
import RoyaltyStatementprint from "./Royaltypages/RoyaltyStatementPrint";
import Royaltystatementauthorwise from "./Royaltypages/RoyaltyStatementAuthorwise";
import Royaltycalculation from "./Royaltypages/RoyaltyCalculation";
import Royaltyvoucher from "./Royaltypages/RoyaltyVoucher";
import RoyaltyStatementSummary from "./Royaltypages/RoyaltyStatementSummary";
import CoverPage from "./components/CoverPage";
import BookPrint from "./Masterpages/Bookprint";
import Platemaker from "./Masterpages/Platemaker";
import FeedadvAuthors from "./Royaltypages/FeedadvAuthors";
import FeedopeningStock from "./Royaltypages/FeedopeningStock";
import PaymentvoucherPrint from "./Transactionpages/PaymentvoucherPrint";
import Reports from "./Pages/Reports";
import Stockreports from "./Pages/Stockreports";
import Paperreports from "./Pages/Paperreports";
import BookDetails from "./Reports/StockReports/BookDetails";
import Netsalereport from "./Reports/StockReports/Netsalereport";
import Netsalesummaryreport from "./Reports/StockReports/Netsalesummaryreport";
import Stockbookreport from "./Reports/StockReports/Stockbookreport";
import Stockstatementreport from "./Reports/StockReports/Stockstatementreport";
import Salesbookwisepartywise from "./Reports/StockReports/Salesbookwisepartywise";
import Stockdaybookreport from "./Reports/StockReports/Stockdaybookreport";
import Stockstmtdetailsreport from "./Reports/StockReports/Stockstmtdetailsreport";
import Paperoutwardpaperwise from "./Reports/PaperReports/Paperoutwardpaperwise";
import PaperoutwardPartywiseReport from "./Reports/PaperReports/PaperoutwardPartywiseReport";
import GodownwisepaperReport from "./Reports/PaperReports/GodownwisepaperReport";
import BookprintorderReport from "./Reports/PaperReports/BookprintorderReport";
import BookprintorderSummaryReport from "./Reports/PaperReports/BookprintorderSummaryReport";
import Paperpurchase from "./Transactionpages/Paperpurchase";
import PrivateRoute from "./components/PrivateRoute"; // adjust path if needed
import LedgerReports from "./Reports/LedgerReports";
import PurchaseregisterReports from "./Reports/PurchaseregisterReports";
import CashflowmonthwiseReports from "./Reports/CashflowmonthwiseReports";
import PurchasemonthwiseReports from "./Reports/PurchasemonthwiseReports";
import PurchaseregistersummaryReports from "./Reports/PurchaseregistersummaryReports";
import SalesreturnregisterReport from "./Reports/SalesreturnregisterReports";
import TDSRegisterReports from "./Reports/TDSRegisterReports";
import TDSMasterlistingReports from "./Reports/TDSMasterlistingReports";
import RoyaltyStatementsummaryReport from "./Reports/RoyaltyReports/RoyaltyStatementsummaryReport";
import RoyaltyStockAuthorReport from "./Reports/RoyaltyReports/RoyaltyStockAuthorReport";
import RoyaltyReports from "./Pages/RoyaltyReports";
import PartyCategory from "./Masterpages/PartyCategory";
import { menuItems } from "./components/Menuitem";
import CompanyList from "./components/CompanyList";
import Maingroup from "./Masterpages/MainGroup";
import Canvassor from "./Masterpages/Canvassor";
import Ledgerprint from "./Printingpages/Ledger/Ledgerprint";
import BankRecoReport from "./Transactionpages/BankrecoReport";
import PrintingSaleschallan from "./Printingpages/Alldocuments/Saleschallan/Saleschallan";
import PrintingSalesinv from "./Printingpages/Alldocuments/Salesinvoice/salesinv"
import Receipt from "./Printingpages/Alldocuments/Receipt/Receipt"
import Bankletter from "./Printingpages/Alldocuments/BankLetter/bankletter";
import Purchasebill from './Printingpages/Alldocuments/PurchaseBill/Purchasebill';
import Deliverychallan from "./Printingpages/Alldocuments/DeliveryChallanOtherthanPBH/Deliverychallanotherthanpbh";
import Invoiceotherthanpbh from "./Printingpages/Alldocuments/InvoiceOtherthanPBH/Invoiceotherthanpbh";
 import PrintingDebitnote from "./Printingpages/Alldocuments/DebitNote/Debitnote";
import PrintingSalesreturncreditnote from "./Printingpages/Alldocuments/SalesReturnCreditNote/Salesreturncrednote";
import Voucher from "./Printingpages/Alldocuments/Voucher/Voucher"
import Creditadvice from "./Printingpages/Alldocuments/CreditAdvice/Creditadvice";
import Cashbookbankbook from "./Printingpages/Booksofaccounts/CashBook/Cashbookbankbook";
import Journalreg from "./Printingpages/Booksofaccounts/JournalRegister/Journalreg"
import Daybook from "./Printingpages/Booksofaccounts/DayBook/Daybook";
import Debitnotereg from "./Printingpages/Booksofaccounts/DebitNoteRegister/Debitnoteregister";
import Creditnotereg from "./Printingpages/Booksofaccounts/CreditNoteRegister/Creditnotereg"
import Sales from "./Printingpages/Booksofaccounts/Sales/Sales";
import Challanreg from "./Printingpages/Booksofaccounts/Sales/ChallanRegister/Challanreg"
import Salesreg from "./Printingpages/Booksofaccounts/Sales/SalesRegister/Salesreg";
import Salessummarydatewise from "./Printingpages/Booksofaccounts/Sales/SalesSummaryDatewise/Salessummarydatewise";
import Purchase from "./Printingpages/Booksofaccounts/Purchase/Purchase"

import Purchasereg from "./Printingpages/Booksofaccounts/Purchase/Purchasereg/Purchasereg";
import PurchaseregMonthsummary from "./Printingpages/Booksofaccounts/Purchase/PurchaseregMonthsummary/PurchaseregMonthsummary";
import Purchaseregsummary from "./Printingpages/Booksofaccounts/Purchase/Purchaseregsummary/Purchaseregsummary"
import TDS from "./Printingpages/Booksofaccounts/TDS/Tds"
import TDSreg from "./Printingpages/Booksofaccounts/TDS/TDSreg/TDsreg";
import TDSCertificate from "./Printingpages/Booksofaccounts/TDS/TDSCertificate/TDSCertificate";
import Tdsmasterlisting from "./Printingpages/Booksofaccounts/TDS/TDSmasterlisting/Tdsmasterlisting";
import Yearlytdsreg from "./Printingpages/Booksofaccounts/TDS/Yearlytdsreg/Yearlytdsreg";
import TDsreg from "./Printingpages/Booksofaccounts/TDS/TDSreg/TDsreg";

import Cashflowdaywise from "./Printingpages/Booksofaccounts/CashFlowDaywise/Cashflowdaywise";
import Cashflowmonthwise from "./Printingpages/Booksofaccounts/CashFlowMonthwise/Cashflowmonthwise"
import Receiptregister from "./Printingpages/Booksofaccounts/ReceiptRegister/Receiptreg"
import Salesreturncreditnotereg from "./Printingpages/Booksofaccounts/SalesReturnCreditNoteRegister/Salesreturncrednotereg"
import Purchasereturndebitnotereg from "./Printingpages/Booksofaccounts/PurchaseReturnDebitNote/Purchasereturndebnote";
import SalesRegSummary from "./Printingpages/Booksofaccounts/SalesRegisterSummary/Salesregsummary"
import Inwardreg from "./Printingpages/Booksofaccounts/InwardRegister/Inwardreg";
import Transactionsummary from "./Printingpages/Booksofaccounts/TransactionSummary/TransactionSummary";
import Tdsandparty from "./Printingpages/Booksofaccounts/TDSandParty/TDSandParty"
import Finalreport from "./Printingpages/Finalreports/Finalreports";
import TrialBalsimple from "./Printingpages/Finalreports/TrialBalSimple/Trialbalsimple";
import TrialBalperiodical from "./Printingpages/Finalreports/TrialBalPeriodical/TrialBalperiodical";
import Pandlacc from "./Printingpages/Finalreports/P&LAcc/Pandlacc";
import Balancesheet from "./Printingpages/Finalreports/BalanceSheet/Balancesheet";
import Fixedassetschedule from "./Printingpages/Finalreports/FixedAssetSchedule/Fixedassetschedule";
import Pandlwithlastyear from "./Printingpages/Finalreports/P&LAccwithLastYear/Pandlwithlastyear";
import Schedule from "./Printingpages/Finalreports/Schedule/Schedule";
import Capitalaccounts from "./Printingpages/Finalreports/CapitalAccounts/Capitalaccount"
import Canvassinglisting from "./Printingpages/CanvassingReports/Reports/CanvassingListing/Canvassinglisting"
import Canvassinggroupwise from "./Printingpages/CanvassingReports/Reports/CanvassingGroupwise/Canvassinggroupwise";
import Canvassingbookwise from "./Printingpages/CanvassingReports/Reports/CanvassingBookwise/Canvassingbookwise";
import Canvassingbooksummary from "./Printingpages/CanvassingReports/Reports/CanvassingBookSummary/Canvassingbooksummary";
import Canvassingcollegewise from "./Printingpages/CanvassingReports/Reports/CanvassingCollegewise/Canvassingcollegewise";
import Canvassingareawise from "./Printingpages/CanvassingReports/Reports/CanvassingAreawise/CanvassorAreawise";
import Canvassingareawisesummary from "./Printingpages/CanvassingReports/Reports/CanvassingAreawiseSummary/Canvassingareawisesummary";
import Invcitywise from "./Printingpages/CanvassingReports/Reports/InvCitywise/Invcitywise";
import Invcitywisecross from "./Printingpages/CanvassingReports/Reports/InvCitywiseCross/InvcitywiseCross";
import Canvassingspectotal from "./Printingpages/CanvassingReports/Reports/CanvassingSpecimenTotal/Canvassingspecimenttotal";
import Canvassingsummcross from "./Printingpages/CanvassingReports/Reports/CanvassingSummaryCross/Canvassingsummarycross";
import Canvassingdistsummary from "./Printingpages/CanvassingReports/Reports/CanvassingDistwiseSummaryCross/Canvassingdistwisesummarycross";
import Canvassingcollegewisesummary from "./Printingpages/CanvassingReports/Reports/CanvassingCollegewiseSummary/Canvassingcollegewisesummary";
import Canvassingcollegewisesummcross from "./Printingpages/CanvassingReports/Reports/CanvassingCollegewiseSummarycross/Canvassingcollegewisesummarycross";
import Accmastlistingmobilenos from "./Printingpages/CanvassingReports/Reports/AccountmasterlistingMobileNos/Accountmasterlistingmobilenos";
import Canvexpenses from "./Printingpages/CanvassingReports/Reports/CanvassorExpenses/CanvasssorExpenses";
import Canvexpeheadwisesumm from "./Printingpages/CanvassingReports/Reports/CanvExpensesHeadwiseSummary/Canvexpensesheadwisesummary";
import Netsalecanvassing from "./Printingpages/CanvassingReports/Reports/NetSaleCanvassing/Netsalecanvassing";
 import PartywisePaperwisePaperOutward from "./Printingpages/BookPriningOrder/Reports/PartywisePaperwisePaperOutward";
import Debitnoteregister from "./Printingpages/Booksofaccounts/DebitNoteRegister/Debitnoteregister";
import SummarisedLedgerPrint from "./Printingpages/Ledger/SummarisedLedgerPrint";
import CompanyRights from "./Settingpages/CompanyRights";



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const UserId = sessionStorage.getItem("UserId");
    if (UserId) {
      setIsLoggedIn(true);
    }
  }, []);

  console.log(isLoggedIn, "loggingstate");

  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/coverpage" element={<CoverPage />} />
          <Route path="/companylist" element={<CompanyList />} />

          {/* <Route
            path="/"
            element={
              <PrivateRoute>
                <TopMenuBar menuItems={menuItems} />
              </PrivateRoute>
            }> */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Sidebar />
              </PrivateRoute>
            }>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <TopMenuBar menuItems={menuItems} />
                </PrivateRoute>
              }></Route>

            {/* Temporary change for testing */}
            <Route path="/home" element={<Home />} />
            <Route
              path="/support"
              element={
                <PrivateRoute>
                  <ContactSupport />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            {/* Routes for Master and master submenus */}
            <Route
              path="/masters"
              element={
                <PrivateRoute>
                  <Masters />
                </PrivateRoute>
              }
            />
            <Route
              path="/masters/accounts"
              element={
                <PrivateRoute>
                  <Accounts />
                </PrivateRoute>
              }
            />
            <Route
              path="/masters/accountgroup"
              element={
                <PrivateRoute>
                  <AccountGroup />
                </PrivateRoute>
              }
            />

            <Route
              path="/masters/partycategory"
              element={
                <PrivateRoute>
                  <PartyCategory />
                </PrivateRoute>
              }
            />
            <Route
              path="/masters/book"
              element={
                <PrivateRoute>
                  <Book />
                </PrivateRoute>
              }
            />
            <Route
              path="/masters/book/bookprint"
              element={
                <PrivateRoute>
                  <BookPrint />
                </PrivateRoute>
              }
            />

            <Route
              path="/masters/bookgroup"
              element={
                <PrivateRoute>
                  <BookGroup />
                </PrivateRoute>
              }
            />
            <Route path="/masters/bookmedium" element={<BookMedium />} />
            <Route path="/masters/standard" element={<Standard />} />
            <Route path="/masters/college" element={<College />} />
            <Route path="/masters/collegegroup" element={<Collegegroup />} />

            <Route path="/masters/university" element={<University />} />
            {/* <Route path="/masters/discount" element={<Discount />} /> */}
            <Route path="/masters/discount" element={<Commission />} />

            <Route path="/masters/canvassor" element={<Canvassor />} />

            <Route
              path="/masters/assignconvassor"
              element={<AssignConvassor />}
            />
            <Route path="/masters/user" element={<User />} />
            <Route path="/masters/branch" element={<BranchMaster />} />
            <Route path="/masters/level" element={<LevelMaster />} />

            <Route path="/masters/country" element={<Country />} />

            <Route path="/masters/state" element={<State />} />
            <Route path="/masters/location" element={<Location />} />

            <Route path="/masters/area" element={<AreaMaster />} />

            <Route path="/masters/tds" element={<Mastertds />} />
            <Route
              path="/masters/depositorgroup"
              element={<DepositorGroup />}
            />
            <Route path="/masters/profcategory" element={<ProfCategory />} />
            <Route path="/masters/maingroup" element={<Maingroup />} />

            <Route path="/masters/professors" element={<Professors />} />
            <Route
              path="/masters/professors/proflist"
              element={<ProfessorList />}
            />

            <Route path="/masters/employee" element={<Employee />} />
            <Route path="/masters/employeegroup" element={<Employeegroup />} />

            <Route path="/masters/publication" element={<Publication />} />

            <Route path="/masters/authors" element={<Authors />} />
            <Route path="/masters/godown" element={<Godown />} />
            <Route path="/masters/titlepress" element={<TitlePress />} />

            <Route path="/masters/press" element={<Press />} />
            <Route path="/masters/papersize" element={<PaperSize />} />
            <Route
              path="/masters/subaccountgroup"
              element={<Subaccountgroup />}
            />

            <Route path="/masters/dispatchmode" element={<Dispatchmode />} />

            <Route path="/masters/costcenter" element={<CostCenter />} />

            <Route path="/masters/platemaker" element={<Platemaker />} />

            {/* Routes for Transaction and Transaction submenus  */}

            <Route
              path="/transaction"
              element={
                <PrivateRoute>
                  <Transactions />
                </PrivateRoute>
              }
            />

            <Route
              path="/transaction/receiptvoucher"
              element={<Receiptvoucher />}
            />
            <Route
              path="/transaction/receiptvoucher/receiptvoucherprint/:id"
              element={<Receiptvoucherprint />}
            />

            <Route path="/transaction/paymentvoucher" element={<Payment />} />
            <Route
              path="transaction/paymentvoucher/paymentvoucherprint/:id"
              element={<PaymentvoucherPrint />}
            />
            <Route path="/transaction/jv" element={<JV />} />
            <Route path="/transaction/debitnote" element={<Debitnote />} />
            <Route path="/transaction/creditnote" element={<Creditnote />} />

            <Route
              path="/transaction/bankreconciliation"
              element={<Bankreconciliation />}
            />
               <Route
              path="/transaction/bankreconciliation/bankrecoreport"
              element={<BankRecoReport />}
            />
            <Route
              path="/transaction/saleschallan"
              element={<Saleschallan />}
            />

            <Route
              path="/transaction/saleschallan/saleschallanprint/:id"
              element={<Saleschallanprint />}
            />
            <Route
              path="/transaction/salesinvoice"
              element={<Salesinvoice />}
            />

            <Route
              path="/transaction/salesinvoice/salesinvoiceprint/:id"
              element={<Salesinvoiceprint />}
            />
            <Route
              path="/transaction/salesreturn-creditnote"
              element={<Salesreturncreditnote />}
            />

            <Route
              path="/transaction/salesreturn-creditnote/creditnoteprint/:id"
              element={<Salesreturncreditnoteprint />}
            />
            <Route
              path="/transaction/purchasereturn-debitnote"
              element={<Purchasereturndebitnote />}
            />

            <Route
              path="/transaction/bookpurchase"
              element={<Bookpurchase />}
            />

            <Route
              path="/transaction/paperpurchase"
              element={<Paperpurchase />}
            />

            <Route
              path="/transaction/invertchallan"
              element={<Inwardchallan />}
            />
            <Route path="/transaction/tds" element={<TransTDS />} />
            <Route
              path="/transaction/convassordetails"
              element={<Convassordetails />}
            />
            <Route
              path="/transaction/paperforbookprinting"
              element={<Paperforprinting />}
            />

            <Route
              path="/transaction/paperreceivedfrombinder"
              element={<PaperReceivedfrombinder />}
            />
            <Route path="/transaction/missprint" element={<Misprint />} />
            <Route
              path="/transaction/salestoconvassor"
              element={<Salestoconvassor />}
            />

            <Route
              path="/transaction/salestoconvassor/salestoconvassorprint/:id"
              element={<Canvassorbillprint />}
            />

            <Route path="/transaction/mergebook" element={<Mergebook />} />
            <Route
              path="/transaction/bookprintingordertopress"
              element={<Bookprintingordertopress />}
            />

            <Route
              path="/transaction/convassordailyreport"
              element={<Convassordailyreport />}
            />
            <Route path="/transaction/raddisales" element={<Raddisales />} />

            {/* Routes for   Printing   */}

            <Route
              path="/printing"
              element={
                <PrivateRoute>
                  <Printing />
                </PrivateRoute>
              }
            />
            <Route path="/printing/ledger" element={<Ledger />} />
            <Route path="/printing/ledger/ledgerprint" element={<Ledgerprint />} />
             <Route path="/printing/ledger/summarised" element={<SummarisedLedgerPrint />} />

            <Route path="/printing/alldocuments" element={<Alldocuments />} />
           <Route path="/printing/alldocuments/saleschallan" element={<PrintingSaleschallan/>}/>
          <Route path="/printing/alldocuments/salesinvoice" element={<PrintingSalesinv/>}/>
            <Route path="/printing/alldocuments/receipt" element={<Receipt/>}/>
            <Route path="/printing/alldocuments/bankletter" element={<Bankletter/>}/>
            <Route path="/printing/alldocuments/purchsebill" element={<Purchasebill/>}/>
            <Route path="/printing/alldocuments/deliverychallanotherthanPBH" element={<Deliverychallan/>}/>
            <Route path="/printing/alldocuments/invoiceotherthanPBH" element={<Invoiceotherthanpbh/>}/>
            <Route path="/printing/alldocuments/creditadvice" element={<Creditadvice/>}/>
            <Route path="/printing/alldocuments/debitnote" element={<PrintingDebitnote/>}/>
            <Route path="/printing/alldocuments/salesreturncreditnote" element={<PrintingSalesreturncreditnote/>}/>

        <Route path="/printing/alldocuments/voucher" element={<Voucher/>}/>

            <Route path="/printing/booksofaccounts" element={<Booksofacc />} />
          <Route path="/printing/booksofaccounts/cashbookbankbook" element={<Cashbookbankbook />} />

         <Route path="/printing/booksofaccounts/journalreg" element={<Journalreg />} />
       <Route path="/printing/booksofaccounts/daybook" element={<Daybook />} />
       <Route path="/printing/booksofaccounts/debitnotereg" element={<Debitnotereg />} />
       <Route path="/printing/booksofaccounts/creditnotereg" element={<Creditnotereg />} />
       <Route path="/printing/booksofaccounts/sales" element={<Sales />} />
       <Route path="/printing/booksofaccounts/challanreg" element={<Challanreg />} />
       <Route path="/printing/booksofaccounts/salesreg" element={<Salesreg />} />
       <Route path="/printing/booksofaccounts/salessummarydatewise" element={<Salessummarydatewise />} />
       <Route path="/printing/booksofaccounts/purchase" element={<Purchase />} />
       <Route path="/printing/booksofaccounts/purchase/purchasereg" element={<Purchasereg />} />
       <Route path="/printing/booksofaccounts/purchase/purchaseregsummary" element={<Purchaseregsummary />} />
       <Route path="/printing/booksofaccounts/purchase/purchaseregmonthlysummary" element={<PurchaseregMonthsummary />} />
       <Route path="/printing/booksofaccounts/tds" element={<TDS />} />
       <Route path="/printing/booksofaccounts/tdsreg" element={<TDsreg />} />
       <Route path="/printing/booksofaccounts/tdsmasterlisting" element={<Tdsmasterlisting />} />
       <Route path="/printing/booksofaccounts/yearlytdsreg" element={<Yearlytdsreg />} />
       <Route path="/printing/booksofaccounts/tdscertificate" element={<TDSCertificate />} />
       <Route path="/printing/booksofaccounts/cashflowdaywise" element={<Cashflowdaywise />} />
       <Route path="/printing/booksofaccounts/cashflowmonthwise" element={<Cashflowmonthwise />} />
       <Route path="/printing/booksofaccounts/receiptreg" element={<Receiptregister />} />
       <Route path="/printing/booksofaccounts/salesreturncreditnotereg" element={<Salesreturncreditnotereg />} />
       <Route path="/printing/booksofaccounts/purchasereturndebitnote" element={<Purchasereturndebitnotereg />} />
       <Route path="/printing/booksofaccounts/salesregsummary" element={<SalesRegSummary />} />
       <Route path="/printing/booksofaccounts/inwardreg" element={<Inwardreg />} />
       <Route path="/printing/booksofaccounts/transactionsummary" element={<Transactionsummary />} />
       <Route path="/printing/booksofaccounts/tdsandparty" element={<Tdsandparty />} />

            <Route path="/printing/finalreports/" element={<Finalrepo />} />
            <Route path="/printing/finalreports/trialbalsimple" element={<TrialBalsimple />} />
 
          
            <Route path="/printing/finalreports/trialbalperiodical" element={<TrialBalperiodical />} />
 
            <Route path="/printing/finalreports/pandlacc" element={<Pandlacc />} />
            
            <Route path="/printing/finalreports/balancesheet" element={<Balancesheet />} />
            <Route path="/printing/finalreports/fixedassetschedule" element={<Fixedassetschedule />} />
 
            
            <Route path="/printing/finalreports/pandlaccwithlastyearbal" element={<Pandlwithlastyear />} />
 
            <Route path="/printing/finalreports/schedule" element={<Schedule />} />
 
            <Route path="/printing/finalreports/capitalaccounts" element={<Capitalaccounts />} />
 
             <Route path="/printing/stock" element={<Stock />} />

            <Route
              path="/printing/stock/stockdaybook"
              element={<Stockdaybook />}
            />
            <Route path="/printing/stock/stockbook" element={<Stockbook />} />
            <Route
              path="/printing/stock/stockstatement"
              element={<Stockstmt />}
            />
            <Route
              path="/printing/stock/stockstmtdetails"
              element={<Stockstmtdetails />}
            />
            <Route path="/printing/stock/netsale" element={<Netsale />} />
            <Route
              path="/printing/stock/netsalesummary"
              element={<Netsalesummary />}
            />
            <Route
              path="/printing/stock/bookpurchaserepo"
              element={<Bookpurchasereport />}
            />

         

            <Route path="/printing/misreports" element={<Misrepo />} />
            <Route path="/printing/displayledger" element={<Displayledger />} />
            <Route
              path="/printing/ageinganalysis-convassor"
              element={<Ageinganalysisconvassor />}
            />
            <Route
              path="/printing/ageinganalysis-amountwise"
              element={<Ageinganalysisamountwise />}
            />
            <Route
              path="/printing/canvassingreports"
              element={<CanvassingReportsLayout  />}
            >

              <Route index element={<Canvassinglisting />} />

                    <Route
              path="/printing/canvassingreports/canvlisting"
              element={<Canvassinglisting />}
            />

                 

                 <Route
              path="/printing/canvassingreports/canvgroupwise"
              element={<Canvassinggroupwise />}
            />

                 <Route
              path="/printing/canvassingreports/canvbookwise"
              element={<Canvassingbookwise />}
            />
                   <Route
              path="/printing/canvassingreports/canvbooksummary"
              element={<Canvassingbooksummary />}
            />

               <Route
              path="/printing/canvassingreports/canvcollegewise"
              element={<Canvassingcollegewise />}
            />

            
               <Route
              path="/printing/canvassingreports/canvareawise"
              element={<Canvassingareawise />}
            />

             
               <Route
              path="/printing/canvassingreports/canvareawisesummary"
              element={<Canvassingareawisesummary />}
            />

            
               <Route
              path="/printing/canvassingreports/invcitywise"
              element={<Invcitywise />}
            />

             
               <Route
              path="/printing/canvassingreports/invcitywisecross"
              element={<Invcitywisecross />}
            />

             
               <Route
              path="/printing/canvassingreports/canvspecimentotal"
              element={<Canvassingspectotal />}
            />

                <Route
              path="/printing/canvassingreports/canvsummarycross"
              element={<Canvassingsummcross />}
            />

                 <Route
              path="/printing/canvassingreports/canvdistsummary"
              element={<Canvassingdistsummary />}
            />

            
                 <Route
              path="/printing/canvassingreports/canvcollegewisesummary"
              element={<Canvassingcollegewisesummary />}
            />
            
                 <Route
              path="/printing/canvassingreports/canvcollegewisesummarycross"
              element={<Canvassingcollegewisesummcross />}
            />

            
  <Route
              path="/printing/canvassingreports/accmasterlistingmobilenos"
              element={<Accmastlistingmobilenos />}
            />
            
  <Route
              path="/printing/canvassingreports/canvexpenses"
              element={<Canvexpenses />}
            />
  <Route
              path="/printing/canvassingreports/canvexpheadwisesummary"
              element={<Canvexpeheadwisesumm />}
            />

              <Route
              path="/printing/canvassingreports/netsalecanvassing"
              element={<Netsalecanvassing />}
            />
              
</Route>
            
            <Route
              path="/printing/bookprintingorder"
              element={<Bookprintingorder />}
            />
                <Route
              path="/printing/bookprintingorder/partypaperwiseoutwardsummary"
              element={<PartywisePaperwisePaperOutward />}
            />
 
            {/* Routes for the MiSC reports */}

            <Route path="/printing/miscreports" element={<Miscrepo />} />
            <Route
              path="/printing/miscreports/accountgroups"
              element={<Accountgroup />}
            />
            <Route
              path="/printing/miscreports/booklisting"
              element={<Booklisting />}
            />
            <Route
              path="/printing/miscreports/fbtlisting"
              element={<FBTstmt />}
            />

            {/* Routes for the LIsting */}

            <Route path="/printing/listing" element={<Listing />} />
            <Route path="/printing/listing/area" element={<Area />} />
            <Route
              path="/printing/listing/convassorspartylisting"
              element={<Canvassorpartylisting />}
            />
            <Route
              path="/printing/listing/partylisting"
              element={<Partylisting />}
            />
            <Route
              path="/printing/listing/convassingcollegelist"
              element={<Convassingcollegelist />}
            />

            {/* Routes for the Settings */}
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route path="/settings/companymaster" element={<Company />} />
            <Route path="/settings/userrights" element={<Userrights />} />
                        <Route path="/settings/companyrights" element={<CompanyRights />} />

            <Route path="/settings/splitdata" element={<Splitdata />} />
            <Route
              path="/settings/backup-currentcompany"
              element={<Backupcurrentcomp />}
            />
            <Route
              path="/settings/interestcalculation"
              element={<Interestcal />}
            />
            <Route path="/settings/lockdata" element={<Lockdata />} />
            <Route path="/settings/restoredata" element={<Restoredata />} />
            <Route path="/settings/cancel" element={<Cancel />} />

            {/* Routes for the Royalty */}

            <Route
              path="/royalty"
              element={
                <PrivateRoute>
                  <Royalty />
                </PrivateRoute>
              }
            />
            <Route path="/royalty/feedadvauthor" element={<FeedadvAuthors />} />
            <Route
              path="/royalty/feedopeningstock"
              element={<FeedopeningStock />}
            />

            <Route
              path="/royalty/royaltyletterprint"
              element={<RoyaltyLetterPrint />}
            />
            <Route
              path="/royalty/royaltyvoucher"
              element={<Royaltyvoucher />}
            />
            <Route
              path="/royalty/royaltystmtprint"
              element={<RoyaltyStatementprint />}
            />
            <Route
              path="/royalty/royaltystmtauthorwise"
              element={<Royaltystatementauthorwise />}
            />
            <Route
              path="/royalty/royaltystmtsummary"
              element={<RoyaltyStatementSummary />}
            />
            <Route
              path="/royalty/royaltycalc"
              element={<Royaltycalculation />}
            />

            {/* Routes for the Reports */}

            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              }
            />

            <Route path="/reports/ledgerreport" element={<LedgerReports />} />
            <Route
              path="/reports/purchaseregisterreport"
              element={<PurchaseregisterReports />}
            />
            <Route
              path="/reports/cashflowmonthwisereport"
              element={<CashflowmonthwiseReports />}
            />

            <Route
              path="/reports/purchasemonthwisereport"
              element={<PurchasemonthwiseReports />}
            />

            <Route
              path="/reports/purchaseregsummaryreport"
              element={<PurchaseregistersummaryReports />}
            />

            {/* <Route
              path="/reports/purchaseregisterreport"
              element={<PurchaseRegReports />}
            /> */}

            <Route
              path="/reports/salesreturnregisterreport"
              element={<SalesreturnregisterReport />}
            />

            <Route
              path="/reports/tdsregisterreport"
              element={<TDSRegisterReports />}
            />

            <Route
              path="/reports/tdsmasterlistingreport"
              element={<TDSMasterlistingReports />}
            />

            <Route path="/reports/stockreports" element={<Stockreports />} />
            <Route
              path="/reports/stockreports/bookdetails"
              element={<BookDetails />}
            />

            <Route
              path="/reports/stockreports/netsale"
              element={<Netsalereport />}
            />
            <Route
              path="/reports/stockreports/netsalesummaryreport"
              element={<Netsalesummaryreport />}
            />
            <Route
              path="/reports/stockreports/salesbookwisepartywise"
              element={<Salesbookwisepartywise />}
            />
            <Route
              path="/reports/stockreports/stockbookreport"
              element={<Stockbookreport />}
            />
            <Route
              path="/reports/stockreports/stockdaybookreport"
              element={<Stockdaybookreport />}
            />
            <Route
              path="/reports/stockreports/stockstatementreport"
              element={<Stockstatementreport />}
            />
            <Route
              path="/reports/stockreports/stockstmtdetailsreport"
              element={<Stockstmtdetailsreport />}
            />

            <Route path="/reports/paperreports" element={<Paperreports />} />
            <Route
              path="/reports/paperreports/paperoutwardpaperwise"
              element={<Paperoutwardpaperwise />}
            />

            <Route
              path="/reports/paperreports/paperoutwardpartywise"
              element={<PaperoutwardPartywiseReport />}
            />
            <Route
              path="/reports/paperreports/godownwisepaper"
              element={<GodownwisepaperReport />}
            />
            <Route
              path="/reports/paperreports/bookprintorder"
              element={<BookprintorderReport />}
            />
            <Route
              path="/reports/paperreports/bookprintordersummary"
              element={<BookprintorderSummaryReport />}
            />

            <Route
              path="/reports/royaltyreports"
              element={<RoyaltyReports />}
            />
            <Route
              path="/reports/royaltyreports/royaltystmtsummary"
              element={<RoyaltyStatementsummaryReport />}
            />

            <Route
              path="/reports/royaltyreports/royaltystockauth"
              element={<RoyaltyStockAuthorReport />}
            />

            <Route path="/exit" element={<Exit />} />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
