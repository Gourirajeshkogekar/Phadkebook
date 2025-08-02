import React, { useState, useEffect } from "react";
import "./App.css";
import { Router, Routes, Route, HashRouter } from "react-router-dom";
import { ProSidebarProvider } from "react-pro-sidebar";
import SidebarMenu from "./components/SidebarMenu";
import Login from "./components/Login";
import { Navigate } from "react-router-dom";
import Home from "./Pages/Home";
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
import City from "./Masterpages/City";
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
import Bookprinting from "./Transactionpages/Bookprintingordertopress";
import Convassordailyreport from "./Transactionpages/Convassordailyreport";
import Raddisales from "./Transactionpages/Raddisales";
import Transcancel from "./Transactionpages/Cancel";
import Salesreturncreditnote from "./Transactionpages/Salesreturncreditnote";
import Purchasereturndebitnote from "./Transactionpages/Purchasereturndebitnote";
import Bookprintingordertopress from "./Transactionpages/Bookprintingordertopress";
import Ledger from "./Printingpages/Ledger";
import Alldocuments from "./Printingpages/Alldocuments";
import Booksofacc from "./Printingpages/Booksofaccounts";
import Finalrepo from "./Printingpages/Finalreports";
import stock from "./Printingpages/Stock";
import Misrepo from "./Printingpages/Misreports";
import Miscrepo from "./Printingpages/Miscreports";
import Listing from "./Printingpages/Listing";
import Displayledger from "./Printingpages/Displayledger";
import Ageinganalysisconvassor from "./Printingpages/Ageinganalysisconvassor";
import Ageinganalysisamountwise from "./Printingpages/Ageinganalysisamounwise";
import Convassingrepo from "./Printingpages/Convassingreports";
import Bookprintingorder from "./Printingpages/Bookprintingorder";
import Printingcancel from "./Printingpages/Cancel";
import Company from "./Settingpages/Company";
import Userrights from "./Settingpages/Userrights";
import Splitdata from "./Settingpages/Splitdata";
import Backupcurrentcomp from "./Settingpages/Backupcurrentcomp";
import Interestcalc from "./Settingpages/Interestcal";
import Lockdata from "./Settingpages/Lockdata";
import Restoredata from "./Settingpages/Restoredata";
import Settingcancel from "./Settingpages/Cancel";
import Stockdaybook from "./Printingpages/Stockdaybook";
import Stockbook from "./Printingpages/Stockbook";
import Stockstmt from "./Printingpages/Stockstmt";
import Stockstmtdetails from "./Printingpages/Stockstmtdetails";
import Netsale from "./Printingpages/Netsale";
import Netsalesummary from "./Printingpages/Netsalesummary";
import Bookpurchasereport from "./Printingpages/Bookpurchasereport";
import Stock from "./Printingpages/Stock";
import Accountgroup from "./Printingpages/Accountgroup";
import Bookilisting from "./Printingpages/Booklisting";
import FBTstmt from "./Printingpages/FBTstmt";
import Area from "./Printingpages/Area";
import Canvassorpartylisting from "./Printingpages/Convassorpartylisting";
import Partylisting from "./Printingpages/Partylisting";
import Canvassingcollgelist from "./Printingpages/Convassingcollegelist";
import Booklisting from "./Printingpages/Booklisting";
import Convassingcollegelist from "./Printingpages/Convassingcollegelist";
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
import Royaltystatementsummary from "./Royaltypages/RoyaltyStatementSummary";
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
          <Route path="/" element={<Sidebar />}>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Routes for Master and master submenus */}
            <Route path="/masters" element={<Masters />} />
            <Route path="/masters/accounts" element={<Accounts />} />
            <Route path="/masters/accountgroup" element={<AccountGroup />} />
            <Route path="/masters/book" element={<Book />} />
            <Route path="/masters/book/bookprint" element={<BookPrint />} />

            <Route path="/masters/bookgroup" element={<BookGroup />} />
            <Route path="/masters/bookmedium" element={<BookMedium />} />
            <Route path="/masters/standard" element={<Standard />} />
            <Route path="/masters/college" element={<College />} />
            <Route path="/masters/collegegroup" element={<Collegegroup />} />

            <Route path="/masters/university" element={<University />} />
            <Route path="/masters/discount" element={<Discount />} />
            <Route path="/masters/commission" element={<Commission />} />
            <Route
              path="/masters/assignconvassor"
              element={<AssignConvassor />}
            />
            <Route path="/masters/user" element={<User />} />
            <Route path="/masters/branch" element={<BranchMaster />} />
            <Route path="/masters/level" element={<LevelMaster />} />

            <Route path="/masters/country" element={<Country />} />

            <Route path="/masters/state" element={<State />} />
            <Route path="/masters/city" element={<City />} />

            <Route path="/masters/area" element={<AreaMaster />} />

            <Route path="/masters/tds" element={<Mastertds />} />
            <Route
              path="/masters/depositorgroup"
              element={<DepositorGroup />}
            />
            <Route path="/masters/profcategory" element={<ProfCategory />} />
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

            <Route path="/transactions" element={<Transactions />} />

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
            <Route path="/transaction/misprint" element={<Misprint />} />
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

            {/* Routes for Transaction and Printing submenus */}

            <Route path="/printing" element={<Printing />} />
            <Route path="/printing/ledger" element={<Ledger />} />
            <Route path="/printing/alldocuments" element={<Alldocuments />} />
            <Route path="/printing/booksofaccounts" element={<Booksofacc />} />
            <Route path="/printing/finalreports" element={<Finalrepo />} />

            {/* Routes for Transaction and stock submenus */}
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

            {/* Routes for the Printing */}

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
              path="/printing/convassingreports"
              element={<Convassingrepo />}
            />
            <Route
              path="/printing/bookprintingorder"
              element={<Bookprintingorder />}
            />
            <Route path="/printing/cancel" element={<Printingcancel />} />

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
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/companymaster" element={<Company />} />
            <Route path="/settings/userrights" element={<Userrights />} />
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

            <Route path="/royalty" element={<Royalty />} />
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

            <Route path="/reports" element={<Reports />} />

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

            <Route path="/exit" element={<Exit />} />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
