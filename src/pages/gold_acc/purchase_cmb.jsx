import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

function PurchaseCmb() {
  const [formData, setFormData] = useState({
    purchaseDate: '',
    category: '',
    gramPrice: '',
    goldWeightInG: '',
    totallkr: '',
    totalinr: '',
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [currencyRate, setCurrencyRate] = useState(null);
  const [purchaseData, setPurchaseData] = useState([]);
  const [latestInrToLkrRate, setLatestInrToLkrRate] = useState(0);
  const [showInrToLkr, setShowInrToLkr] = useState(false);

  const fetchPurchaseData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/view-gold-purchase');
      setPurchaseData(response.data);
    } catch (error) {
      console.error('Error fetching purchase data:', error);
    }
  };

  const fetchCurrencyRate = useCallback(async () => {
    try {
      if (!formData.purchaseDate) {
        setShowInrToLkr(false);
        setCurrencyRate({ rate: 0 });
        return;
      }

      const response = await axios.get(
        `http://localhost:3001/api/currency-rates-purchasing?currency_name=INR%20to%20LKR&date=${formData.purchaseDate}`
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
  }, [formData.purchaseDate, setCurrencyRate, setShowInrToLkr]);

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

    // Fetch latest INR to LKR rate every 15 minutes
    const interval = setInterval(fetchLatestInrToLkrRate, 15 * 60 * 1000);

    fetchLatestInrToLkrRate(); // Fetch initially

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);


  useEffect(() => {
    fetchCurrencyRate();
    fetchPurchaseData();
  }, [formData.purchaseDate, fetchCurrencyRate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      totallkr: name === 'gramPrice' || name === 'goldWeightInG' ? calculateTotal() : prevFormData.totallkr,
      totalinr:
        name === 'gramPrice' || name === 'goldWeightInG' || name === 'purchaseDate'
          ? calculateTotalInr()
          : prevFormData.totalinr,
    }));
  };

  const calculateTotal = () => {
    const gramPrice = parseFloat(formData.gramPrice);
    const goldWeightInKG = parseFloat(formData.goldWeightInG);

    if (isNaN(gramPrice) || isNaN(goldWeightInKG)) {
      return '';
    }

    const total = (gramPrice * goldWeightInKG).toFixed(2);
    return parseFloat(total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const calculateTotalInr = () => {
    const totalLKR = parseFloat(calculateTotal().replace(/,/g, ''));
    const latestInrToLkrRateValue = latestInrToLkrRate ? parseFloat(latestInrToLkrRate.toFixed(2)) : 0;

    if (isNaN(totalLKR) || isNaN(latestInrToLkrRateValue) || latestInrToLkrRateValue === 0) {
      return '';
    }

    const totalInr = totalLKR / latestInrToLkrRateValue;
    const formattedTotalInr = totalInr.toFixed(2);

    return parseFloat(formattedTotalInr).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totallkr = parseFloat(calculateTotal().replace(/,/g, ''));
    const totalinr = parseFloat(calculateTotalInr().replace(/,/g, ''));

    try {
      const response = await axios.post('http://localhost:3001/api/gold-purchase', {
        ...formData,
        totallkr: totallkr,
        totalinr: totalinr,
        inrtolkr: latestInrToLkrRate,
      });

      if (response.status === 200) {
        console.log('Gold purchase successful');
        setFormData({
          purchaseDate: '',
          category: '',
          gramPrice: '',
          goldWeightInG: '',
          totallkr: '',
          totalinr: '',
        });
        toast.success('Gold purchase successful');
        fetchPurchaseData();
      } else {
        console.error('Failed to process gold purchase');
        toast.error('Failed to process gold purchase');
      }
    } catch (error) {
      console.error('Error processing gold purchase:', error);
      toast.error('Error processing gold purchase');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/delete-gold-purchase/${id}`);

      if (response.status === 200) {
        toast.warning('Gold purchase deleted successfully');
        fetchPurchaseData();
      } else {
        console.error('Failed to delete gold purchase');
        toast.error('Failed to delete gold purchase');
      }
    } catch (error) {
      console.error('Error deleting gold purchase:', error);
      toast.error('Error deleting gold purchase');
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="card">
        <div className="card-body shadow p-5">
          <h2 className="pb-4 text-center">
            <b className="p-3">PURCHASE CMB</b>
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col">
                <input
                  type="date"
                  className="form-control"
                  id="purchaseDate"
                  name="purchaseDate"
                  value={formData.purchaseDate}
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
                <span className="input-group-text">LKR</span>
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
            </div>
            <div className="row mb-3">
              <div className="col form-group input-group">
                <span className="input-group-text">LKR</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Total"
                  id="totallkr"
                  name="totallkr"
                  value={calculateTotal()}
                  readOnly
                />
              </div>
              {showInrToLkr && latestInrToLkrRate !== null && (
                <div className="col form-group input-group">
                  <span className="input-group-text">₹ to LKR</span>
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
                <span className="input-group-text">₹</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Total"
                  id="totalinr"
                  name="totalinr"
                  value={calculateTotalInr()}
                  readOnly
                />
              </div>
            </div>
            <div className="d-flex justify-content-center p-3">
              <button type="submit" className="btn btn-outline-dark">
                Purchase
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Table to display purchase data */}
      <div className="mt-4 card shadow p-3">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Gold Weight (g)</th>
              <th>Gram Price (LKR/g)</th>
              <th>₹ to LKR</th>
              <th>Total (LKR)</th>
              <th>Total (₹)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {purchaseData.slice().reverse().map((purchase) => (
              <tr key={purchase.id}>
                <td>{formatDate(purchase.purchaseDate)}</td>
                <td>{purchase.category}</td>
                <td>{purchase.goldWeightInG.toLocaleString()}g</td>
                <td>LKR {purchase.gramPrice.toLocaleString()}</td>
                <td>{purchase.inrtolkr.toFixed(2)}</td>
                <td>LKR {purchase.totallkr.toLocaleString()}</td>
                <td>₹ {purchase.totalinr.toLocaleString()}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(purchase.id)}>
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

export default PurchaseCmb;
