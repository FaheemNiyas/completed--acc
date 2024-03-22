import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

function SellIndia() {
  const [formData, setFormData] = useState({
    sellDate: '',
    category: '',
    gramPrice: '',
    goldWeightInG: '',
    totallkr: '',
    totalinr: '',
    expense: '',
    totalExpense: '', // New field for total expense
    totalAmountAfterExpense: '' // New field for total amount after expense
  });

  // eslint-disable-next-line
  const [sellData, setSellData] = useState([]);
  // eslint-disable-next-line
  const [currencyRate, setCurrencyRate] = useState(null);
  const [latestInrToLkrRate, setLatestInrToLkrRate] = useState(0);
  const [showInrToLkr, setShowInrToLkr] = useState(false);
  const [sellRecords, setSellRecords] = useState([]);

  const fetchSellRecords = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/view-gold-sell-ind');
      setSellRecords(response.data);
    } catch (error) {
      console.error('Error fetching sell records:', error);
      toast.error('Error fetching sell records');
    }
  };

  useEffect(() => {
    fetchSellRecords(); // Fetch sell records when the component mounts
  }, []);

  const fetchCurrencyRate = useCallback(async () => {
    try {
      if (!formData.sellDate) {
        setShowInrToLkr(false);
        setCurrencyRate({ rate: 0 });
        return;
      }

      const response = await axios.get(
        `http://localhost:3001/api/currency-rates-purchasing?currency_name=INR%20to%20LKR&date=${formData.sellDate}`
      );

      const rateData = response.data.length > 0 ? response.data[0] : null;

      if (!rateData || rateData.rate === undefined || rateData.rate === null) {
        console.warn('No INR rates available for the selected date.');
        toast.warn('No INR rates available for the selected date.');
        setShowInrToLkr(false);
        setCurrencyRate({ rate: 0 });
        return;
      }

      setShowInrToLkr(true);
      setCurrencyRate(rateData);
    } catch (error) {
      console.error('Error fetching currency rate:', error);
      toast.error('Error fetching currency rate.');
      setShowInrToLkr(false);
    }
  }, [formData.sellDate, setCurrencyRate, setShowInrToLkr]);

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
        }
      } catch (error) {
        console.error('Error fetching latest INR to LKR rate:', error);
        toast.error('Error fetching latest INR to LKR rate.');
        setLatestInrToLkrRate(0);
      }
    };

    fetchLatestInrToLkrRate();
  }, []);

  useEffect(() => {
    fetchCurrencyRate();
  }, [formData.sellDate, fetchCurrencyRate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      totallkr: name === 'gramPrice' || name === 'goldWeightInG' ? calculateTotal() : prevFormData.totallkr,
      totalinr:
        name === 'gramPrice' || name === 'goldWeightInG' || name === 'sellDate'
          ? calculateTotalLKR()
          : prevFormData.totalinr,
      totalExpense: name === 'expense' ? calculateTotalExpense() : prevFormData.totalExpense, // Calculate total expense
      totalAmountAfterExpense: name === 'expense' ? calculateTotalAmountAfterExpense() : prevFormData.totalAmountAfterExpense // Calculate total amount after expense
    }));
  };

  const calculateTotalAmountAfterExpense = () => {
    const totalExpense = parseFloat(formData.totalExpense.replace(/,/g, ''));

    if (isNaN(totalExpense)) {
      return ''; // Return empty string if totalExpense is not a number
    }

    const totalAmountAfterExpense = latestInrToLkrRate * totalExpense;
    return totalAmountAfterExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Return with thousand separator
  };


  const calculateTotal = () => {
    const gramPrice = parseFloat(formData.gramPrice);
    const goldWeightInKG = parseFloat(formData.goldWeightInG);
    // eslint-disable-next-line
    const expense = parseFloat(formData.expense);

    if (isNaN(gramPrice) || isNaN(goldWeightInKG)) {
      return '';
    }

    const total = (gramPrice * goldWeightInKG).toFixed(2);
    return parseFloat(total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const calculateTotalExpense = () => {
    const gramPrice = parseFloat(formData.gramPrice);
    const goldWeightInKG = parseFloat(formData.goldWeightInG);
    const expense = parseFloat(formData.expense);

    if (isNaN(gramPrice) || isNaN(goldWeightInKG)) {
      return '';
    }

    const total = (gramPrice * goldWeightInKG - expense).toFixed(2);
    return parseFloat(total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const calculateTotalLKR = () => {
    const totalLKR = parseFloat(calculateTotal().replace(/,/g, ''));
    const latestInrToLkrRateValue = latestInrToLkrRate ? parseFloat(latestInrToLkrRate.toFixed(2)) : 0;

    if (isNaN(totalLKR) || isNaN(latestInrToLkrRateValue) || latestInrToLkrRateValue === 0) {
      return '';
    }

    const totalInr = totalLKR * latestInrToLkrRateValue;
    const formattedTotalInr = totalInr.toFixed(2);

    return parseFloat(formattedTotalInr).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate the values before submitting
    const totallkr = parseFloat(calculateTotalLKR().replace(/,/g, ''));
    const totalinr = parseFloat(calculateTotal().replace(/,/g, ''));
    const inrtolkr = parseFloat(latestInrToLkrRate.toFixed(2));
    const totalExpense = parseFloat(formData.totalExpense.replace(/,/g, ''));
    const totalAmountAfterExpense = parseFloat(formData.totalAmountAfterExpense.replace(/,/g, ''));

    try {
      const response = await axios.post('http://localhost:3001/api/gold-sell', {
        ...formData,
        totallkr: totallkr, // Send the calculated value
        totalinr: totalinr, // Send the calculated value
        inrtolkr: inrtolkr,
        totalExpense: totalExpense, // Send total expense
        totalAmountAfterExpense: totalAmountAfterExpense // Send total amount after expense
      });

      if (response.status === 200) {
        console.log('Gold sell successful');
        toast.success('Gold sell successful');

        // Clear form data
        setFormData({
          sellDate: '',
          category: '',
          gramPrice: '',
          goldWeightInG: '',
          totallkr: '',
          totalinr: '',
          expense: '',
          totalExpense: '',
          totalAmountAfterExpense: ''
        });

        // Fetch updated sell records
        fetchSellRecords();
      } else {
        console.error('Failed to process gold sell');
        toast.error('Failed to process gold sell');
      }
    } catch (error) {
      console.error('Error processing gold sell:', error);
      toast.error('Error processing gold sell');
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deleting sell record with id:', id);
  
      const response = await axios.delete(`http://localhost:3001/api/delete-gold-sell/${id}`);
  
      if (response.status === 200) {
        toast.warning('Sell record deleted successfully');
        // Remove the deleted record from sellRecords state
        setSellRecords(prevSellRecords => prevSellRecords.filter(record => record.id !== id));
      } else {
        console.error('Failed to delete sell record');
        toast.error('Failed to delete sell record');
      }
    } catch (error) {
      console.error('Error deleting sell record:', error);
      toast.error('Error deleting sell record');
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
            <b className="p-3">SELL IND</b>
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col">
                <input
                  type="date"
                  className="form-control"
                  id="sellDate"
                  name="sellDate"
                  value={formData.sellDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col mb-3">
                <select
                  className="form-control"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gold</option>
                  <option value="TT">TT</option>
                  <option value="999">999</option>
                  <option value="995">995</option>
                  <option value="coin">COIN</option>
                  <option value="1kgbar">1KG BAR</option>
                  <option value="FT">FT</option>
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col form-group input-group">
                <span className="input-group-text">G</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Gold Weight"
                  id="goldWeightInG"
                  name="goldWeightInG"
                  value={formData.goldWeightInG}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="col form-group input-group">
                <span className="input-group-text">₹</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Unit Price (g)"
                  id="gramPrice"
                  name="gramPrice"
                  value={formData.gramPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="col form-group input-group">
                <span className="input-group-text">₹</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Total"
                  id="totalinr"
                  name="totalinr"
                  value={calculateTotal()}
                  readOnly
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col form-group input-group">
                <span className="input-group-text">₹</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Total"
                  id="totalinr"
                  name="totalinr"
                  value={calculateTotal()}
                  readOnly
                />
              </div>
              {showInrToLkr && (
                <div className="col form-group input-group">
                  <span className="input-group-text">INR to LKR</span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="INR to LKR"
                    id="inrtolkr"
                    name="inrtolkr"
                    value={latestInrToLkrRate.toFixed(2)}
                    readOnly
                  />
                </div>
              )}
              <div className="col form-group input-group">
                <span className="input-group-text">LKR</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="LKR"
                  id="totallkr"
                  name="totallkr"
                  value={calculateTotalLKR()}
                  readOnly
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col form-group input-group">
                <span className="input-group-text">₹</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Total Expense"
                  id="expense"
                  name="expense"
                  value={formData.expense}
                  onChange={handleChange} />
              </div>
              <div className="col form-group input-group">
                <span className="input-group-text">₹</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Expense"
                  id="totalExpense"
                  name="totalExpense"
                  value={formData.totalExpense}
                  readOnly
                />
              </div>
              <div className="col form-group input-group">
                <span className="input-group-text">LKR</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Total Expense LKR"
                  id="totalAmountAfterExpense"
                  name="totalAmountAfterExpense"
                  value={calculateTotalAmountAfterExpense()} // Call the function to get the calculated value
                  readOnly
                />
              </div>

            </div>
            <div className="d-flex justify-content-center p-3">
              <button type="submit" className="btn btn-outline-dark">
                Sell IND
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Table to display sell data */}
      <div className="mt-4 card shadow p-3">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Gold Type</th>
              <th>Gold Weight (g)</th>
              <th>Unit Price (₹/g)</th>
              <th>Expense (₹)</th>
              <th>₹ to LKR Rate </th>
              <th>Total (₹)</th>
              <th>Total (LKR)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sellRecords.slice().reverse().map((record, index) => (
              <tr key={index}>
                <td>{formatDate(record.sellDate)}</td>
                <td>{record.category}</td>
                <td>{record.goldWeightInG.toLocaleString()}g</td>
                <td>₹ {record.gramPrice.toLocaleString()}</td>
                <td>₹ {record.expense_amount.toLocaleString()}</td>
                <td>LKR {record.inrtolkr}</td>
                <td>₹ {record.totalExpense_inr.toLocaleString()}</td>
                <td>LKR {record.totalAmountAfterExpense_LKR.toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDelete(record.id)} className="btn btn-danger btn-sm">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SellIndia;