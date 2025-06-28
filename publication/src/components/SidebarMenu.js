// src/components/SidebarMenu.js
import React from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar,
} from "react-pro-sidebar";

import "./SidebarMenu.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { Link } from "react-router-dom";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import DashboardIcon from "@mui/icons-material/Dashboard";

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOnRounded";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PrintIcon from "@mui/icons-material/Print";
import BusinessIcon from "@mui/icons-material/Business";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SchoolIcon from "@mui/icons-material/School"; // Graduation cap icon
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import GroupIcon from "@mui/icons-material/Group";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SchoolTwoToneIcon from "@mui/icons-material/SchoolTwoTone";
import DiscountIcon from "@mui/icons-material/Discount";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import CancelIcon from "@mui/icons-material/Cancel";
import RestoreIcon from "@mui/icons-material/Restore";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ShopIcon from "@mui/icons-material/Shop";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AssessmentIcon from "@mui/icons-material/Assessment";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FilterListIcon from "@mui/icons-material/FilterList";
import BackupIcon from "@mui/icons-material/Backup";
import FunctionsIcon from "@mui/icons-material/Functions";
import LockIcon from "@mui/icons-material/Lock";
import { Footer } from "antd/es/layout/layout";

const SidebarMenu = ({ onExit }) => {
  const { collapseSidebar, toggleSidebar, toggled } = useProSidebar();

  const toggle = () => {
    toggleSidebar();
    collapseSidebar();
  };

  return (
    <Sidebar className="sidebar">
      <Menu className="sidebar-menu">
        <MenuItem
          className="links"
          //component={<Link to="/" className="link" />}
          icon={
            <MenuRoundedIcon
              onClick={() => {
                collapseSidebar();
              }}
              style={{ color: "#003C43" }}
            />
          }>
          <h4 style={{ color: "#003C43" }}>Publication </h4>
        </MenuItem>
        <MenuItem
          component={<Link to="dashboard" className="links" />}
          //className="links"
          icon={<DashboardIcon />}>
          Dashboard
        </MenuItem>
        {/* submenus for the Masters */}
        <SubMenu
          label="Masters"
          className="links"
          icon={<LabelImportantIcon />}>
          <MenuItem
            icon={<AccountCircleIcon />}
            className="links"
            component={<Link to="masters/accounts" className="links" />}>
            Accounts
          </MenuItem>
          <MenuItem
            icon={<GroupIcon />}
            className="links"
            component={<Link to="masters/accountgroup" className="links" />}>
            Account Group
          </MenuItem>
          <MenuItem
            icon={<LibraryBooksIcon />}
            className="links"
            component={<Link to="masters/book" className="links" />}>
            Book
          </MenuItem>
          <MenuItem
            icon={<SchoolIcon />}
            className="links"
            component={<Link to="masters/standard" className="links" />}>
            Standard
          </MenuItem>
          <MenuItem
            icon={<SchoolIcon />}
            className="links"
            component={<Link to="masters/college" className="links" />}>
            College
          </MenuItem>
          <MenuItem
            icon={<SchoolIcon />}
            className="links"
            component={<Link to="masters/university" className="links" />}>
            University
          </MenuItem>
          <MenuItem
            icon={<DiscountIcon />}
            className="links"
            component={<Link to="masters/discount" className="links" />}>
            Discount
          </MenuItem>
          <MenuItem
            icon={<AssignmentIndIcon />}
            className="links"
            component={<Link to="masters/assignconvassor" className="links" />}>
            Assign Canvassor
          </MenuItem>

          <MenuItem
            icon={<AssignmentIndIcon />}
            className="links"
            component={<Link to="masters/user" className="links" />}>
            User
          </MenuItem>
          <MenuItem
            icon={<LocationCityIcon />}
            className="links"
            component={<Link to="masters/state" className="links" />}>
            State/City/Area
          </MenuItem>
          <MenuItem
            icon={<AccountBalanceIcon />}
            className="links"
            component={<Link to="masters/tds" className="links" />}>
            T.D.S.
          </MenuItem>
          <MenuItem
            icon={<GroupIcon />}
            className="links"
            component={<Link to="masters/depositorgroup" className="links" />}>
            Depositor Group
          </MenuItem>
          <MenuItem
            icon={<EventIcon />}
            className="links"
            component={<Link to="masters/partycategory" className="links" />}>
            Party Category
          </MenuItem>
          <MenuItem
            icon={<PersonIcon />}
            className="links"
            component={<Link to="masters/professors" className="links" />}>
            Professors
          </MenuItem>
          <MenuItem
            icon={<PersonIcon />}
            className="links"
            component={<Link to="masters/authors" className="links" />}>
            Authors
          </MenuItem>
          <MenuItem
            icon={<ArrowDownwardIcon />}
            className="links"
            component={<Link to="masters/godown" className="links" />}>
            Godown
          </MenuItem>
          <MenuItem
            icon={<LibraryBooksIcon />}
            className="links"
            component={<Link to="masters/press" className="links" />}>
            Press
          </MenuItem>
          <MenuItem
            icon={<LibraryBooksIcon />}
            className="links"
            component={<Link to="masters/papersize" className="links" />}>
            Paper Size
          </MenuItem>
          <MenuItem
            icon={<GroupIcon />}
            className="links"
            component={<Link to="masters/subaccountgroup" className="links" />}>
            Sub Account Group
          </MenuItem>
          <MenuItem
            icon={<CancelIcon />}
            className="links"
            component={<Link to="masters/cancel" className="links" />}>
            Cancel
          </MenuItem>
        </SubMenu>
        {/* submenus for the Transaction */}
        <SubMenu label="Transaction" icon={<SwapHorizIcon />} className="links">
          <MenuItem
            icon={<ReceiptIcon />}
            className="links"
            component={<Link to="transaction/receipts" className="links" />}>
            Receipts
          </MenuItem>
          <MenuItem
            icon={<PaymentIcon />}
            className="links"
            component={<Link to="transaction/payment" className="links" />}>
            Payment
          </MenuItem>
          <MenuItem
            icon={<PaymentIcon />}
            className="links"
            component={<Link to="transaction/jv" className="links" />}>
            JV
          </MenuItem>
          <MenuItem
            icon={<AccountBalanceWalletIcon />}
            className="links"
            component={<Link to="transaction/debitnote" className="links" />}>
            Debit Note
          </MenuItem>
          <MenuItem
            icon={<AccountBalanceWalletIcon />}
            className="links"
            component={<Link to="transaction/creditnote" className="links" />}>
            Credit Note
          </MenuItem>
          <MenuItem
            icon={<AccountBalanceWalletIcon />}
            className="links"
            component={
              <Link to="transaction/bankreconciliation" className="links" />
            }>
            Bank Reconciliation
          </MenuItem>
          <MenuItem
            icon={<MonetizationOnIcon />}
            className="links"
            component={
              <Link to="transaction/saleschallan" className="links" />
            }>
            Sales Challan
          </MenuItem>
          <MenuItem
            icon={<MonetizationOnIcon />}
            className="links"
            component={
              <Link to="transaction/salesinvoice" className="links" />
            }>
            Sales Invoice
          </MenuItem>

          <MenuItem
            icon={<MonetizationOnIcon />}
            className="links"
            component={
              <Link to="transaction/salesreturn-creditnote" className="links" />
            }>
            Sales Return- Credit Note
          </MenuItem>
          <MenuItem
            icon={<ShopIcon />}
            className="links"
            component={
              <Link
                to="transaction/purchasereturn-debitnote"
                className="links"
              />
            }>
            Purchase Return- Debit Note
          </MenuItem>
          <MenuItem
            icon={<ShopIcon />}
            className="links"
            component={
              <Link to="transaction/bookpurchase" className="links" />
            }>
            Book Purchase
          </MenuItem>
          <MenuItem
            icon={<MonetizationOnIcon />}
            className="links"
            component={
              <Link to="transaction/inwardchallan" className="links" />
            }>
            Inward Challan
          </MenuItem>
          <MenuItem
            icon={<MonetizationOnIcon />}
            className="links"
            component={<Link to="transaction/tds" className="links" />}>
            T.D.S
          </MenuItem>
          <MenuItem
            icon={<AccountBalanceIcon />}
            className="links"
            component={
              <Link to="transaction/convassordetails" className="links" />
            }>
            Convassor Details
          </MenuItem>
          <MenuItem
            icon={<AccountBalanceIcon />}
            className="links"
            component={
              <Link to="transaction/paperforbookprinting" className="links" />
            }>
            Paper Outward for Book printing
          </MenuItem>
          <MenuItem
            icon={<AccountBalanceIcon />}
            className="links"
            component={<Link to="transaction/misprint" className="links" />}>
            Misprint
          </MenuItem>
          <MenuItem
            icon={<AccountBalanceIcon />}
            className="links"
            component={
              <Link to="transaction/salestoconvassor" className="links" />
            }>
            Sales to Convassors
          </MenuItem>
          <MenuItem
            icon={<AccountBalanceIcon />}
            className="links"
            component={<Link to="transaction/mergebook" className="links" />}>
            Merge Book
          </MenuItem>
          <MenuItem
            icon={<AccountBalanceIcon />}
            className="links"
            component={
              <Link
                to="transaction/bookprintingordertopress"
                className="links"
              />
            }>
            Book Printing order to Press
          </MenuItem>
          <MenuItem
            icon={<AccountBalanceIcon />}
            className="links"
            component={
              <Link to="transaction/convassordailyreport" className="links" />
            }>
            Convassor daily Report
          </MenuItem>
          <MenuItem
            icon={<AccountBalanceIcon />}
            className="links"
            component={<Link to="transaction/raddisales" className="links" />}>
            Raddi Sales
          </MenuItem>
          <MenuItem
            icon={<CancelIcon />}
            className="links"
            component={<Link to="transaction/cancel" className="links" />}>
            Cancel
          </MenuItem>
        </SubMenu>
        {/* submenus for the Printing */}
        <SubMenu label="Printing" icon={<PrintIcon />} className="links">
          <MenuItem
            icon={<AccountBalanceIcon />}
            className="links"
            component={<Link to="printing/ledger" className="links" />}>
            Ledger
          </MenuItem>
          <MenuItem
            icon={<DocumentScannerIcon />}
            className="links"
            component={<Link to="printing/alldocuments" className="links" />}>
            All Documents
          </MenuItem>
          <MenuItem
            icon={<LibraryBooksIcon />}
            className="links"
            component={
              <Link to="printing/booksofaccounts" className="links" />
            }>
            Books of Accounts
          </MenuItem>
          <MenuItem
            icon={<DocumentScannerIcon />}
            className="links"
            component={<Link to="printing/finalreports" className="links" />}>
            Final Reports
          </MenuItem>

          {/*Submenus fot the Stock */}
          <SubMenu
            label="Stock"
            //className="links"
            icon={<Inventory2Icon />}>
            <MenuItem
              icon={<Inventory2Icon />}
              className="links"
              component={
                <Link to="printing/stock/stockdaybook" className="links" />
              }>
              Stock Day Book
            </MenuItem>
            <MenuItem
              icon={<Inventory2Icon />}
              className="links"
              component={
                <Link to="printing/stock/stockbook" className="links" />
              }>
              Stock Book
            </MenuItem>
            <MenuItem
              icon={<Inventory2Icon />}
              className="links"
              component={
                <Link to="printing/stock/stockstatement" className="links" />
              }>
              Stock Statement
            </MenuItem>
            <MenuItem
              icon={<Inventory2Icon />}
              className="links"
              component={
                <Link to="printing/stock/stockstmtdetails" className="links" />
              }>
              Stock Statement Details
            </MenuItem>
            <MenuItem
              icon={<Inventory2Icon />}
              className="links"
              component={
                <Link to="printing/stock/netsale" className="links" />
              }>
              Net Sale
            </MenuItem>
            <MenuItem
              icon={<Inventory2Icon />}
              className="links"
              component={
                <Link to="printing/stock/netsalesummary" className="links" />
              }>
              Net Sale Summary
            </MenuItem>
            <MenuItem
              icon={<Inventory2Icon />}
              className="links"
              component={
                <Link to="printing/stock/bookpurchaserepo" className="links" />
              }>
              Book Purchase Report
            </MenuItem>
          </SubMenu>
          <MenuItem
            icon={<AssessmentIcon />}
            className="links"
            component={<Link to="printing/misreports" className="links" />}>
            MIS Reports
          </MenuItem>

          {/*Submenus fot the MISC reports */}
          <SubMenu
            label="MISC Reports"
            className="links"
            icon={<AssessmentIcon />}>
            <MenuItem
              icon={<AccountCircleIcon />}
              className="links"
              component={
                <Link
                  to="printing/miscreports/accountgroups"
                  className="links"
                />
              }>
              Account Groups
            </MenuItem>
            <MenuItem
              icon={<LibraryBooksIcon />}
              className="links"
              component={
                <Link to="printing/miscreports/booklisting" className="links" />
              }>
              Book Listing
            </MenuItem>
            <MenuItem
              icon={<AccountBalanceIcon />}
              className="links"
              component={
                <Link to="printing/miscreports/fbtlisting" className="links" />
              }>
              F.B.T Statement
            </MenuItem>
          </SubMenu>

          {/*Submenus fot the Listing */}
          <SubMenu
            label="Listing"
            className="links"
            icon={<FormatListNumberedIcon />}>
            <MenuItem
              icon={<FormatListNumberedIcon />}
              className="links"
              component={<Link to="printing/listing/area" className="links" />}>
              Area
            </MenuItem>{" "}
            <MenuItem
              icon={<FormatListNumberedIcon />}
              className="links"
              component={
                <Link
                  to="printing/listing/convassorspartylisting"
                  className="links"
                />
              }>
              Convassor's Party Listing
            </MenuItem>{" "}
            <MenuItem
              icon={<FormatListNumberedIcon />}
              className="links"
              component={
                <Link to="printing/listing/partylisting" className="links" />
              }>
              Party Listing
            </MenuItem>
            <MenuItem
              icon={<AccountBalanceIcon />}
              className="links"
              component={
                <Link
                  to="printing/listing/convassingcollegelist"
                  className="links"
                />
              }>
              Convassing College List
            </MenuItem>
          </SubMenu>

          <MenuItem
            icon={<AccountBalanceIcon />}
            className="links"
            component={<Link to="printing/displayledger" className="links" />}>
            Display Ledger
          </MenuItem>
          <MenuItem
            icon={<AssessmentIcon />}
            className="links"
            component={
              <Link to="printing/ageinganalysis-convassor" className="links" />
            }>
            Ageing Analysing- Convassor
          </MenuItem>
          <MenuItem
            icon={<AssessmentIcon />}
            className="links"
            component={
              <Link to="printing/ageinganalysis-amountwise" className="links" />
            }>
            Ageing Analysing- Amountwise
          </MenuItem>
          <MenuItem
            icon={<AssessmentIcon />}
            className="links"
            component={
              <Link to="printing/convassingrerports" className="links" />
            }>
            Convassing Reports
          </MenuItem>
          <MenuItem
            icon={<LibraryBooksIcon />}
            className="links"
            component={
              <Link to="printing/bookprintingorder" className="links" />
            }>
            Book printing Order
          </MenuItem>
          <MenuItem
            icon={<CancelIcon />}
            className="links"
            component={<Link to="printing/cancel" className="links" />}>
            Cancel
          </MenuItem>
        </SubMenu>
        {/* submenus for the Settings */}
        <SubMenu label="Settings" icon={<SettingsIcon />} className="links">
          <MenuItem
            icon={<BusinessIcon />}
            className="links"
            component={<Link to="settings/companymaster" className="links" />}>
            Company Master
          </MenuItem>
          <MenuItem
            icon={<SettingsIcon />}
            className="links"
            component={<Link to="settings/userrights" className="links" />}>
            User Rights
          </MenuItem>
          <MenuItem
            icon={<FilterListIcon />}
            className="links"
            component={<Link to="settings/splitdata" className="links" />}>
            Split Data
          </MenuItem>
          <MenuItem
            icon={<BackupIcon />}
            className="links"
            component={
              <Link to="settings/backup-currentcompany" className="links" />
            }>
            Backup-Current Company
          </MenuItem>
          <MenuItem
            icon={<FunctionsIcon />}
            className="links"
            component={
              <Link to="settings/interestcalculation" className="links" />
            }>
            Interest Calculation
          </MenuItem>
          <MenuItem
            icon={<LockIcon />}
            className="links"
            component={<Link to="settings/lockdata" className="links" />}>
            Lock Data
          </MenuItem>
          <MenuItem
            icon={<RestoreIcon />}
            className="links"
            component={<Link to="settings/restoredata" className="links" />}>
            Restore Data
          </MenuItem>

          <MenuItem
            icon={<CancelIcon />}
            className="links"
            component={<Link to="settings/cancel" className="links" />}>
            Cancel
          </MenuItem>
        </SubMenu>
        <MenuItem
          icon={<MonetizationOnIcon />}
          //className="links"
          component={<Link to="royalty" className="links" />}>
          Royalty
        </MenuItem>
        <MenuItem
          icon={<BusinessIcon />}
          //className="links"
          component={<Link to="company" className="links" />}>
          Company
        </MenuItem>
        <MenuItem
          onClick={onExit}
          className="links"
          icon={<ExitToAppIcon />}
          style={{ marginTop: "150px" }}>
          Exit
        </MenuItem>{" "}
      </Menu>
    </Sidebar>
  );
};

export default SidebarMenu;
