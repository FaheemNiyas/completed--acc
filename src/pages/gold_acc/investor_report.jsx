import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosPrint } from "react-icons/io";
import logo from "./img/logo.png";

function InvestorReport() {
  const [investorName, setInvestorName] = useState('');
  const [investorData, setInvestorData] = useState(null);
  const [error, setError] = useState(null);
  const [investors, setInvestors] = useState([]);
  const [investedAmount, setInvestedAmount] = useState(null);
  const [totalSellAmount, setTotalSellAmount] = useState(0);
  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
  const [totalWithdrawalAmount, setTotalWithdrawalAmount] = useState(0);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    fetchInvestors();
  }, []);

  useEffect(() => {
    if (investorName) {
      fetchInvestorReport();
      fetchInvestedAmount();
    }
  }, [investorName, fromDate, toDate]);

  const fetchInvestors = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/investors');
      setInvestors(response.data);
    } catch (error) {
      console.error('Error fetching investors:', error);
    }
  };

  const fetchInvestorReport = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/investor-report?name=${investorName}`);
      const sortedData = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      const filteredData = sortedData.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (!fromDate || transactionDate >= new Date(fromDate)) && (!toDate || transactionDate <= new Date(toDate));
      });
      setInvestorData(filteredData);
      calculateTotalAmounts(filteredData);
      setError(null);
    } catch (error) {
      setError('Error fetching investor report');
      setInvestorData(null);
    }
  };

  const fetchInvestedAmount = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/investor-total/${investorName}`);
      setInvestedAmount(response.data.total_investment);
    } catch (error) {
      console.error('Error fetching invested amount:', error);
      setInvestedAmount(null);
    }
  };

  const calculateTotalAmounts = (data) => {
    let totalSell = 0;
    let totalPurchase = 0;
    let totalWithdrawal = 0;

    data.forEach(transaction => {
      switch (transaction.type) {
        case 'Sell':
          totalSell += transaction.amount;
          break;
        case 'Purchase':
          totalPurchase += transaction.amount;
          break;
        case 'Withdrawal':
          totalWithdrawal += transaction.amount;
          break;
        default:
          break;
      }
    });

    setTotalSellAmount(totalSell);
    setTotalPurchaseAmount(totalPurchase);
    setTotalWithdrawalAmount(totalWithdrawal);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleInvestorChange = (newValue) => {
    setInvestorName(newValue);
    setFromDate('');
    setToDate('');
  };

  const handlePrint = () => {
    const printableContent = document.getElementById('printable-table').innerHTML;

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
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      newWindow.document.close();
    });
  };

  return (
    <div className="container">
      <div className='shadow border rounded p-2'>
        <div className="row mt-3">
          <div className="col-md-4">
            <select
              className="form-control"
              value={investorName}
              onChange={(e) => handleInvestorChange(e.target.value)}
            >
              <option value="">Select investor</option>
              {investors.map((investor) => (
                <option key={investor.id} value={investor.investor_name}>{investor.investor_name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="date"
              id="fromDate"
              className="form-control"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              id="toDate"
              className="form-control"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-dark" onClick={handlePrint}><IoIosPrint /></button>
          </div>
        </div>
        {error && <p className="text-danger mt-3">{error}</p>}
        {investorData && (
          <div className="mt-4" id="printable-table">
            <h2 className='text-center pt-4'><b>INVESTOR TRANSACTION</b></h2>
            <h3 className='text-center'>{investorName} </h3>
            <p className='text-center'>{fromDate && toDate && `${formatDate(fromDate)} - ${formatDate(toDate)}`}</p>
            <table className="table ">
              <thead className='table-dark'>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Weight(g) Purch/Sell</th>
                  <th>Purch/Sell Rate</th>
                  <th>Expense</th>
                  <th>Amount in LKR</th>
                  <th>Invested Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="table-primary">
                  <td></td>
                  <td >Investment</td>
                  <td>Total Investment</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>{investedAmount ? `LKR ${investedAmount.toLocaleString()}` : '-'}</td>
                </tr>
                {investorData.map((transaction, index) => (
                  <tr key={index} className={
                    transaction.type === 'Purchase' ? 'table-success' :
                      transaction.type === 'Sell' ? 'table-danger' :
                        transaction.type === 'Withdrawal' ? 'table-warning' :
                          ''
                  }>
                    <td>{formatDate(transaction.date)}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.type === 'Withdrawal' ? '-' : `${transaction.weight}g`}</td>
                    <td>{transaction.type === 'Sell' ? `LKR ${transaction.gram_price}` : transaction.type === 'Withdrawal' ? '-' : `LKR ${transaction.gram_price}`}</td>
                    <td>{transaction.type === 'Withdrawal' || transaction.type === 'Purchase' ? '-' : `LKR ${transaction.expense}`}</td>
                    <td>LKR {transaction.amount.toLocaleString()}</td>
                    <td></td>
                  </tr>
                ))}
                <tr className="table-info">
                  <td colSpan="6" style={{ textAlign: 'right' }}><b>SUB TOTAL:</b></td>
                  <td>LKR {(totalSellAmount - (totalPurchaseAmount + totalWithdrawalAmount)).toLocaleString()}</td>
                  <td>LKR {investedAmount !== null ? investedAmount.toLocaleString() : '-'}</td>
                </tr>
                <tr className="table-info">
                  <td colSpan="6" style={{ textAlign: 'right' }}><b>BALANCE:</b></td>
                  <td></td>
                  <td>LKR {Math.abs(investedAmount + (totalSellAmount - totalPurchaseAmount - totalWithdrawalAmount)).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvestorReport;
