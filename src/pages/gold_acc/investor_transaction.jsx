import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

function InvestorTransaction() {
  const [transactionType, setTransactionType] = useState('Purchase');
  const [investor, setInvestor] = useState('');
  const [investedAmount, setInvestedAmount] = useState('');
  const [investors, setInvestors] = useState([]);
  const [goldWeightInG, setGoldWeightInG] = useState('');
  const [gramPrice, setGramPrice] = useState('');
  const [goldWeightSellInG, setGoldWeightSellInG] = useState('');
  const [gramPriceSell, setGramPriceSell] = useState('');
  const [latestInrToLkrRate, setLatestInrToLkrRate] = useState(0);
  const [inrToLKR, setInrToLKR] = useState('');
  const [expnseINR, setExpnseINR] = useState('');
  // eslint-disable-next-line
  const [expenseLKR, setExpenseLKR] = useState('');
  const [purchaseDescription, setPurchaseDescription] = useState('');
  const [sellDescription, setSellDescription] = useState('');
  // eslint-disable-next-line
  const [totalInLKRSell, setTotalInLKRSell] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  // eslint-disable-next-line
  const [transactions, setTransactions] = useState([]);
  const [purchaseTransactions, setPurchaseTransactions] = useState([]);
  const [sellTransactions, setSellTransactions] = useState([]);
  const [withdrawalTransactions, setWithdrawalTransactions] = useState([]);

  useEffect(() => {
    // Fetch investors data from the server
    const fetchInvestors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/investors');
        setInvestors(response.data);
      } catch (error) {
        console.error('Error fetching investors:', error);
      }
    };

    fetchInvestors();
  }, []);

  useEffect(() => {
    // Fetch total investment amount for the selected investor
    const fetchInvestedAmount = async () => {
      if (investor === "") {
        // Clear the invested amount if no investor is selected
        setInvestedAmount('');
        return;
      }

      try {
        console.log('Fetching total investment...');
        const response = await axios.get(`http://localhost:3001/api/investor-total/${investor}`);
        const totalInvestedAmount = response.data.total_investment;
        setInvestedAmount(totalInvestedAmount);
      } catch (error) {
        console.error('Error fetching total invested amount:', error);
      }
    };

    // Call the fetchInvestedAmount function whenever the selected investor changes
    fetchInvestedAmount();
  }, [investor]);

  const handleTransactionTypeChange = (e) => {
    const newTransactionType = e.target.value;

    // Reset all state values based on the new transaction type
    setTransactionType(newTransactionType);
    setInvestor('');
    setInvestedAmount('');
    setGoldWeightInG('');
    setGramPrice('');
    setGoldWeightSellInG('');
    setGramPriceSell('');
    setExpnseINR('');
    setExpenseLKR('');
    setTotalInLKRSell('');
  };

  // const handleInvestorChange = async (event) => {
  //   const selectedInvestorId = event.target.value;

  //   if (selectedInvestorId === "") {
  //     // Clear the selected investor and set default values
  //     setInvestor('');
  //     setInvestedAmount('');
  //   } else {
  //     try {
  //       console.log('Fetching total investment...');
  //       const response = await axios.get(`http://localhost:3001/api/investor-total/${selectedInvestorId}`);
  //       const totalInvestmentAmount = response.data.total_investment;
  //       setInvestor(selectedInvestorId);
  //       setInvestedAmount(totalInvestmentAmount);
  //     } catch (error) {
  //       console.error('Error fetching invested total amount:', error);
  //     }
  //   }
  // };

  // const handleInvestorChange = async (event) => {
  //   const selectedInvestorId = event.target.value;

  //   if (selectedInvestorId === "") {
  //     // Clear the selected investor and set default values
  //     setInvestor('');
  //     setInvestedAmount('');
  //   } else {
  //     try {
  //       console.log('Fetching total investment...');
  //       const response = await axios.get(`http://localhost:3001/api/investor-total/${selectedInvestorId}`);
  //       const totalInvestmentAmount = response.data.total_investment;

  //       // Calculate the invested amount based on the transaction type
  //       let calculatedInvestedAmount;

  //       if (transactionType === 'Purchase') {
  //         calculatedInvestedAmount = totalInvestmentAmount - calculateTotalInLKR();
  //       } else if (transactionType === 'Sell') {
  //         calculatedInvestedAmount = totalInvestmentAmount + (calculateTotalInINR() - expnseINR);
  //       } else if (transactionType === 'Withdrawals') {
  //         calculatedInvestedAmount = totalInvestmentAmount - withdrawalAmount; // Use withdrawalAmount here
  //       }

  //       // Update the state with the calculated invested amount
  //       setInvestor(selectedInvestorId);
  //       setInvestedAmount(calculatedInvestedAmount);
  //     } catch (error) {
  //       console.error('Error fetching invested total amount:', error);
  //     }
  //   }
  // };

  const handleInvestorChange = (e) => {
    const selectedInvestorId = e.target.value;
    setInvestor(selectedInvestorId);
  };

  useEffect(() => {
    const fetchLatestInrToLkrRate = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/latest-inr-to-lkr');
        const latestRateData = response.data;

        if (!latestRateData || latestRateData.rate === undefined || latestRateData.rate === null) {
          console.warn('No latest INR to LKR rate available.');
          toast.warn('No latest INR to LKR rate available.');
          setLatestInrToLkrRate(0);
        } else {
          setLatestInrToLkrRate(latestRateData.rate);
          setInrToLKR(latestRateData.rate); // Update the INR to LKR field
        }
      } catch (error) {
        console.error('Error fetching latest INR to LKR rate:', error);
        toast.error('Error fetching latest INR to LKR rate.');
        setLatestInrToLkrRate(0);
      }
    };

    // Fetch latest INR to LKR rate every 15 minutes
    const interval = setInterval(fetchLatestInrToLkrRate, 15 * 60 * 1000);

    fetchLatestInrToLkrRate(); // Fetch initially

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);


  // eslint-disable-next-line
  const handleInvestedAmountChange = (e) => {
    setInvestedAmount(e.target.value);
  };
  const handleGoldWeightChange = (e) => {
    setGoldWeightInG(e.target.value);
  };

  const handleGramPriceChange = (e) => {
    setGramPrice(e.target.value);
  };

  const handleGoldWeightSellChange = (e) => {
    setGoldWeightSellInG(e.target.value);
  };

  const handleGramPriceSellChange = (e) => {
    setGramPriceSell(e.target.value);
  };

  const calculateTotalInLKR = () => {
    return goldWeightInG * gramPrice;
  };

  const calculateTotalInINR = () => {
    return goldWeightSellInG * gramPriceSell;
  };

  // eslint-disable-next-line
  const calculateInrToLkr = () => {
    return latestInrToLkrRate;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let data;

      if (transactionType === 'Purchase') {
        data = {
          transactionDate: new Date().toISOString(),
          investor,
          investedAmount,
          goldWeight: goldWeightInG,
          gramPrice,
          totalInLKR: calculateTotalInLKR(),
          totalInINR: calculateTotalInLKR() / inrToLKR,
          description: purchaseDescription, // Adding description field
          inr_to_lkr: inrToLKR // Adding inr_to_lkr field
        };
      } else if (transactionType === 'Sell') {
        data = {
          transactionDate: new Date().toISOString(),
          investor,
          investedAmount,
          goldWeight: goldWeightSellInG,
          gramPrice: gramPriceSell,
          totalInLKR: calculateTotalInINR() * inrToLKR,
          totalInINR: calculateTotalInINR(),
          expense: {
            inr: expnseINR,
            lkr: expnseINR * inrToLKR
          },
          totalAmountAfterExpense: {
            inr: calculateTotalInINR() - expnseINR,
            lkr: (calculateTotalInINR() - expnseINR) * inrToLKR
          },
          description: sellDescription, // Adding description field
          inr_to_lkr: inrToLKR // Adding inr_to_lkr field
        };
      } else if (transactionType === 'Withdrawals') {
        data = {
          transactionDate: new Date().toISOString(),
          investor,
          investedAmount,
          withdrawalAmount,
          description: 'Withdrawal', // Adding description field
        };
      }

      let endpoint;

      if (transactionType === 'Purchase') {
        endpoint = 'http://localhost:3001/api/purchase_transactions';
      } else if (transactionType === 'Sell') {
        endpoint = 'http://localhost:3001/api/sell_transactions';
      } else if (transactionType === 'Withdrawals') {
        endpoint = 'http://localhost:3001/api/withdrawal_transactions';
      }

      const response = await axios.post(endpoint, data);
      console.log('Transaction saved successfully:', response.data);

      // Clear form fields after successful submission
      setInvestor('');
      setInvestedAmount('');
      setGoldWeightInG('');
      setGramPrice('');
      setGoldWeightSellInG('');
      setGramPriceSell('');
      setExpnseINR('');
      setWithdrawalAmount('');

      // Display success message
      toast.success('Transaction saved successfully');
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error('Error saving transaction');
    }
  };

  useEffect(() => {
    const fetchPurchaseTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/view/purchase_transactions');
        setPurchaseTransactions(response.data);
      } catch (error) {
        console.error('Error fetching purchase transactions:', error);
        toast.error('Error fetching purchase transactions');
      }
    };

    fetchPurchaseTransactions();
  }, []);

  useEffect(() => {
    const fetchSellTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/view/sell_transactions');
        setSellTransactions(response.data);
      } catch (error) {
        console.error('Error fetching sell transactions:', error);
        toast.error('Error fetching sell transactions');
      }
    };

    fetchSellTransactions();
  }, []);

  useEffect(() => {
    const fetchWithdrawalTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/view/withdrawal_transactions');
        setWithdrawalTransactions(response.data);
      } catch (error) {
        console.error('Error fetching withdrawal transactions:', error);
        toast.error('Error fetching withdrawal transactions');
      }
    };

    fetchWithdrawalTransactions();
  }, []);

  const handleDelete = async (type, id) => {
    try {
      await axios.delete(`http://localhost:3001/api/${type}/${id}`);
      toast.success(`${type} transaction deleted successfully`);
      // Refresh transactions after deletion
      if (type === 'purchase_transactions') {
        const response = await axios.get('http://localhost:3001/api/view/purchase_transactions');
        setPurchaseTransactions(response.data);
      } else if (type === 'sell_transactions') {
        const response = await axios.get('http://localhost:3001/api/view/sell_transactions');
        setSellTransactions(response.data);
      } else if (type === 'withdrawal_transactions') {
        const response = await axios.get('http://localhost:3001/api/view/withdrawal_transactions');
        setWithdrawalTransactions(response.data);
      }
    } catch (error) {
      console.error(`Error deleting ${type} transaction:`, error);
      toast.error(`Error deleting ${type} transaction`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="card">
        <div className="card-body shadow p-5">
          <h2 className="pb-4 text-center">
            <b className="p-3">INVESTOR TRANSACTION</b>
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col">
                <select
                  className="form-select"
                  value={transactionType}
                  onChange={handleTransactionTypeChange}
                >
                  <option value="Purchase">Purchase</option>
                  <option value="Sell">Sell</option>
                  <option value="Withdrawals">Withdrawals</option>
                </select>
              </div>
              <div className="col">
                <input
                  type="date"
                  className="form-control"
                  id="transactionDate"
                  name="transactionDate"
                  required
                />
              </div>
            </div>
            <div className="row mb-1">
              <div className="col">
                <select
                  className="form-select"
                  value={investor}
                  onChange={handleInvestorChange}
                >
                  <option value="">Select Investor</option>
                  {investors.map((investor) => (
                    <option key={investor.id} value={investor.investor_name}>
                      {investor.investor_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col form-group input-group">
                <span className="input-group-text">LKR</span>
                <input type="text" className="form-control" placeholder="Invested Amount" value={investedAmount.toLocaleString()} readOnly required />
              </div>
            </div>

            {/* Purchase form fields */}
            {transactionType === 'Purchase' && (
              <div>
                <div className="row mb-3">
                  <div className="col">
                    <input
                      type="text" className="form-control" placeholder="Description" id="purchaseDescription" name="purchaseDescription" value={purchaseDescription} onChange={(e) => setPurchaseDescription(e.target.value)} required
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col form-group input-group">
                    <span className="input-group-text">G</span>
                    <input
                      type="number" placeholder="Weight (g) " className="form-control" id="goldWeightInG" name="goldWeightInG" onChange={handleGoldWeightChange} required
                    />
                  </div>
                  <div className="col form-group input-group">
                    <span className="input-group-text">LKR</span>
                    <input
                      type="text" placeholder="Gram Price" className="form-control" id="gramPrice" name="gramPrice" onChange={handleGramPriceChange} required
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col form-group input-group">
                    <span className="input-group-text">LKR</span>
                    <input
                      placeholder="Total" type="text" className="form-control" id="totalInLKR" name="totalInLKR" value={calculateTotalInLKR().toLocaleString()} readOnly
                    />
                  </div>
                  <div className="col form-group input-group">
                    <span className="input-group-text">₹ to LKR</span>
                    <input
                      placeholder="INR to LKR" type="text" className="form-control" id="inrToLKR" name="inrToLKR" value={inrToLKR} readOnly
                    />
                  </div>
                  <div className="col form-group input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      placeholder="Total INR" type="text" className="form-control" id="totalInINR" name="totalInINR" value={(calculateTotalInLKR() / inrToLKR).toLocaleString()} readOnly
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sell form fields */}
            {transactionType === 'Sell' && (
              <div>
                {/* Description field */}
                <div className="row mb-3">
                  <div className="col">
                    <input
                      type="text" className="form-control" placeholder="Description" id="sellDescription" name="sellDescription" value={sellDescription} onChange={(e) => setSellDescription(e.target.value)} required
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col form-group input-group">
                    <span className="input-group-text">G</span>
                    <input
                      type="number" placeholder="Weight (g) " className="form-control" id="goldWeightSellInG" name="goldWeightSellInG" onChange={handleGoldWeightSellChange} required
                    />
                  </div>
                  <div className="col form-group input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number" placeholder="Gram Price" className="form-control" id="gramPriceSell" name="gramPriceSell" onChange={handleGramPriceSellChange} required
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col form-group input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      placeholder="Total" type="text" className="form-control" id="totalInINR" name="totalInINR" value={calculateTotalInINR().toLocaleString()} readOnly
                    />
                  </div>
                  <div className="col form-group input-group">
                    <span className="input-group-text">₹ to LKR</span>
                    <input
                      placeholder="INR to LKR" type="text" className="form-control" id="inrToLKRSell" name="inrToLKRSell" value={inrToLKR} readOnly
                    />
                  </div>
                  <div className="col form-group input-group">
                    <span className="input-group-text">LKR</span>
                    <input
                      placeholder="Total LKR" type="text" className="form-control" id="totalInLKRSell" name="totalInLKRSell" value={(calculateTotalInINR() * inrToLKR).toLocaleString()} readOnly
                    />
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col form-group input-group">
                    <span className="input-group-text">Expense ₹</span>
                    <input
                      placeholder="Expense INR" type="text" className="form-control" id="expenseINR" name="expenseINR" value={expnseINR} required onChange={(e) => setExpnseINR(e.target.value)}
                    />
                  </div>
                  <div className="col form-group input-group">
                    <span className="input-group-text">Expense LKR</span>
                    <input
                      placeholder="Expense LKR" type="text" className="form-control" id="expenseLKR" name="expenseLKR" value={(expnseINR * inrToLKR).toLocaleString()} required readOnly
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col form-group input-group">
                    <span className="input-group-text">Total After Expense ₹</span>
                    <input
                      placeholder="Total After Expense" type="text" className="form-control" id="totalafterexpenseINR" name="totalafterexpenseINR" required value={(calculateTotalInINR() - expnseINR).toLocaleString()} readOnly
                    />
                  </div>
                  <div className="col form-group input-group">
                    <span className="input-group-text">Total After Expense LKR</span>
                    <input
                      placeholder="Total After Expense"
                      type="text"
                      className="form-control"
                      id="totalafterexpenseLKR"
                      value={((calculateTotalInINR() - expnseINR) * inrToLKR).toLocaleString()} name="totalafterexpenseLKR" required readOnly
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Withdrawals form fields */}
            {transactionType === 'Withdrawals' && (
              <div className="row mb-3">
                <div className="col-md-6">
                  {/* Withdrawal amount field */}
                  <input
                    type="number" className="form-control" placeholder="Withdrawal Amount" id="withdrawalAmount" name="withdrawalAmount" required value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Common form fields */}
            {/* Add your common form fields here */}

            <div className="d-flex justify-content-center p-3">
              <button type="submit" className="btn btn-outline-dark">
                {transactionType}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Table to display purchase data */}
      {/* Purchase Transactions Table */}
      {transactionType === 'Purchase' && (
        <div className="mt-4 card shadow p-3">
          <h3 className="text-center m-4">PURCHASE TRANSACTIONS</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Investor</th>
                <th>Gold Weight (g)</th>
                <th>Gram Price (LKR/g)</th>
                <th>₹ to LKR</th>
                <th>Total (LKR)</th>
                <th>Total (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactionType === 'Purchase' && purchaseTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.transaction_date)}</td>
                  <td>{transaction.investor}</td>
                  <td>{transaction.gold_weight_in_g}g</td>
                  <td>LKR {transaction.gram_price.toLocaleString()}</td>
                  <td>LKR {transaction.inr_to_lkr}</td>
                  <td>LKR {transaction.total_in_lkr.toLocaleString()}</td>
                  <td>₹ {transaction.total_in_inr.toLocaleString()}</td>
                  <td>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete('purchase_transactions', transaction.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sell Transactions Table */}
      {transactionType === 'Sell' && (
        <div className="mt-4 card shadow p-3">
          <h3 className="text-center m-4">SELL TRANSACTIONS</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Investor</th>
                <th>Weight (g)</th>
                <th>Gram Price (₹/g)</th>
                <th>Expense (₹)</th>
                <th>₹ to LKR</th>
                <th>Total After Expense (₹)</th>
                <th>Total After Expense (LKR)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactionType === 'Sell' && sellTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.transaction_date)}</td>
                  <td>{transaction.investor}</td>
                  <td>{transaction.gold_weight_sell_in_g}g</td>
                  <td>₹ {transaction.gram_price_sell.toLocaleString()}</td>
                  <td>₹ {transaction.expense_inr.toLocaleString()}</td>
                  <td>LKR {transaction.inr_to_lkr}</td>
                  <td>₹ {transaction.total_after_expense_inr.toLocaleString()}</td>
                  <td>LKR {transaction.total_after_expense_lkr.toLocaleString()}</td>
                  <td>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete('sell_transactions', transaction.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Withdrawal Transactions Table */}
      {transactionType === 'Withdrawals' && (
        <div className="mt-4 card shadow p-3">
          <h3 className="text-center m-4">WITHDRWAL TRANSACTIONS</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Investor</th>
                <th>Withdrawal Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactionType === 'Withdrawals' && withdrawalTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.transaction_date)}</td>
                  <td>{transaction.investor}</td>
                  <td>LKR {transaction.withdrawal_amount.toLocaleString()}</td>
                  <td>
                    <button
                      type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete('withdrawal_transactions', transaction.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default InvestorTransaction;