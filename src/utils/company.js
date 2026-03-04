// utils/company.js
export const getSelectedCompany = () =>
  JSON.parse(localStorage.getItem("SelectedCompany"));
