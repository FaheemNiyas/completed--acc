import React, { useState } from 'react';
import axios from 'axios';
import { IoIosPrint } from "react-icons/io";
import logo from "./img/logo.png";

function MonthlyReport() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const handleGenerateReport = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/monthly-report?month=${month}&year=${year}`);
      setData(response.data);
      setError(null);
    } catch (error) {
      setError('Error fetching monthly report');
      setData(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateTotalProfitLoss = () => {
    if (!data || !data.purchases || !data.sales) return 0;

    const totalPurchaseAmount = data.purchases.reduce((total, purchase) => total + purchase.totalinr, 0);
    const totalSaleAmount = data.sales.reduce((total, sale) => total + sale.totalExpense_inr, 0);

    return totalSaleAmount - totalPurchaseAmount;
  };

  const calculateTotalProfitLossLkr = () => {
    if (!data || !data.purchases || !data.sales) return 0;

    const totalPurchaseAmount = data.purchases.reduce((total, purchase) => total + purchase.totallkr, 0);
    const totalSaleAmount = data.sales.reduce((total, sale) => total + sale.totalAmountAfterExpense_LKR, 0);

    return totalSaleAmount - totalPurchaseAmount;
  };

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, index) => ({
    value: `${currentYear - index}`,
    label: `${currentYear - index}`
  }));

  const handlePrint = () => {
    const printableContent = document.getElementById('printable-table').innerHTML;
    const monthLabel = months.find(m => m.value === month)?.label;
    const yearLabel = years.find(y => y.value === year)?.label;

    // Convert logo to Base64
    const imageToBase64 = (url, callback) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        const newCanvas = document.createElement('canvas');
        const ctx = newCanvas.getContext('2d');
        newCanvas.width = this.width;
        newCanvas.height = this.height;
        ctx.drawImage(this, 0, 0);
        const dataURL = newCanvas.toDataURL('image/png');
        callback(dataURL);
      };
      img.src = url;
    };

    imageToBase64(logo, (base64Logo) => {
      const newWindow = window.open('', '_blank');
      newWindow.document.write(`
        <html>
          <head>
            <title>Print Table</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
            <style>
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #000; padding: 8px; }
              .center { text-align: center; }
              .logo { height: 200px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-12 center">
                  <!-- Embed Base64-encoded logo directly -->
                  <img src="${base64Logo}" alt="Logo" class="logo" />
                  <h1>GOLD MONTHLY REPORT</h1>
                  <h2>${monthLabel} ${yearLabel}</h2>
                </div>
                <div class="col-12" id="printable-content">
                  ${printableContent}
                </div>
              </div>
            </div>
            <script>
              window.onload = () => {
                setTimeout(() => {
                  window.print();
                }, 100);
              };
            </script>
          </body>
        </html>
      `);
      newWindow.document.close();
    });
  };


  return (
    <div className="container ">
      <div className='shadow border rounded p-2'>
        <div className="row mt-3">
          <div className="col-md-2">
            <select className="form-select" value={month} onChange={(e) => setMonth(e.target.value)}>
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y.value} value={y.value}>{y.label}</option>
              ))}
            </select>
          </div>
          <div className="col-md-1">
            <button className="btn btn-dark " onClick={handleGenerateReport}>Report</button>
          </div>
          <div className="col-md-2">
            <button className="btn btn-dark " onClick={handlePrint}><IoIosPrint /></button>
          </div>
        </div>
        {error && <p className="text-danger mt-3">{error}</p>}
        {data && (
          <div className="mt-4" id="printable-table">
            <table className="table ">
              <thead className='table-dark'>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Weight(g)</th>
                  <th>Gram Price</th>
                  <th>₹ to LKR</th>
                  <th>Total Price(LKR)</th>
                  <th>Total Price(₹)</th>
                  <th>Expense(₹)</th>
                  <th>Total after Expense(₹)</th>
                  <th>Total after Expense(LKR)</th>
                </tr>
              </thead>
              <tbody>
                {data.purchases.map((purchase, index) => (
                  <tr key={purchase.id} className="table-success">
                    <td>{formatDate(purchase.purchaseDate)}</td>
                    <td>Purchase</td>
                    <td>{purchase.goldWeightInG.toLocaleString()}g</td>
                    <td>LKR {purchase.gramPrice.toLocaleString()}</td>
                    <td>LKR {purchase.inrtolkr.toFixed(2)}</td>
                    <td>LKR {purchase.totallkr.toLocaleString()}</td>
                    <td>₹ {purchase.totalinr.toLocaleString()}</td>
                    <td>-</td>
                    <td>₹ {purchase.totalinr.toLocaleString()}</td>
                    <td>LKR {purchase.totallkr.toLocaleString()}</td>
                  </tr>
                ))}
                {data.sales.map((sell, index) => (
                  <tr key={sell.id} className="table-danger">
                    <td>{formatDate(sell.sellDate)}</td>
                    <td>Sell</td>
                    <td>{sell.goldWeightInG.toLocaleString()}g</td>
                    <td>₹ {sell.gramPrice.toLocaleString()}</td>
                    <td>LKR {sell.inrtolkr.toFixed(2)}</td>
                    <td>LKR {sell.totallkr.toLocaleString()}</td>
                    <td>₹ {sell.totalinr.toLocaleString()}</td>
                    <td>₹ {sell.expense_amount.toLocaleString()}</td>
                    <td>₹ {sell.totalExpense_inr.toLocaleString()}</td>
                    <td>LKR {sell.totalAmountAfterExpense_LKR.toLocaleString()}</td>
                  </tr>
                ))}
                {/* Total Profit/Loss row */}
                <tr className={calculateTotalProfitLoss() >= 0 ? "table-info" : "table-warning"}>
                  <td colSpan="7"></td>
                  <td><b>Total</b></td>
                  <td colSpan><b>₹ {calculateTotalProfitLoss().toLocaleString()}</b></td>
                  <td colSpan><b>LKR {calculateTotalProfitLossLkr().toLocaleString()}</b></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MonthlyReport;