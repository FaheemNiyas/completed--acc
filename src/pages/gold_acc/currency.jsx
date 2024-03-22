import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Currency() {
    const currencies = [
        { id: 1, currency_name: 'INR to LKR' },
    ];

    // eslint-disable-next-line
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [formData, setFormData] = useState({
        date: '',
        rate: '',
        currency_name: '',
    });
    const [currencyRates, setCurrencyRates] = useState([]);

    useEffect(() => {
        // Fetch currency rates on component mount
        fetchCurrencyRates();
    }, []);

    const fetchCurrencyRates = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/currency-rates');
            setCurrencyRates(response.data);
        } catch (error) {
            console.error('Error fetching currency rates:', error);
        }
    };

    const handleCurrencyChange = (event) => {
        const selectedCurrencyId = event.target.value;
        const selectedCurrencyData = currencies.find(
            (currency) => currency.id === parseInt(selectedCurrencyId, 10)
        );
    
        if (selectedCurrencyData) {
            console.log('Selected Currency Name:', selectedCurrencyData.currency_name);
    
            setSelectedCurrency(selectedCurrencyData);
    
            // Set other form fields based on the selected currency
            setFormData({
                date: '',
                rate: '',
                currency_name: selectedCurrencyData.currency_name,
            });
        }
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        console.log(`Field: ${name}, Value: ${value}`);
    
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

   const handleSubmit = async (event) => {
    event.preventDefault();

    console.log('Form Data before submit:', formData); // Debugging

    try {
        const response = await axios.post('http://localhost:3001/api/currency', {
            ...formData,
            time: selectedTime,
        });

        if (response.status === 200) {
            console.log('Currency rate updated successfully');
            toast.success('Currency rate updated successfully', { autoClose: 3000 });

            // Reset form data to clear the fields
            setFormData({
                date: '',
                rate: '',
                currency_name: '',
            });

            // Fetch and update currency rates after adding a new rate
            fetchCurrencyRates();
        } else {
            console.error('Failed to update currency rate. Unexpected response:', response);
            toast.error('Failed to update currency rate. Unexpected response', { autoClose: 3000 });
        }
    } catch (error) {
        console.error('Error updating currency rate:', error);

        // Check if the error is a response from the server
        if (error.response) {
            console.error('Server responded with non-2xx status:', error.response.status, error.response.data);
            toast.error(`Server responded with non-2xx status: ${error.response.status}`, { autoClose: 3000 });
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from the server:', error.request);
            toast.error('No response received from the server', { autoClose: 3000 });
        } else {
            // Something happened in setting up the request that triggered an error
            console.error('Error setting up the request:', error.message);
            toast.error(`Error setting up the request: ${error.message}`, { autoClose: 3000 });
        }
    }
};


    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3001/api/currency/${id}`);
            if (response.status === 200) {
                console.log('Currency rate deleted successfully');
                toast.warning('Currency rate deleted successfully', { autoClose: 3000 });

                // Fetch and update currency rates after deleting a rate
                fetchCurrencyRates();
            } else {
                console.error('Failed to delete currency rate');
                toast.error('Failed to delete currency rate', { autoClose: 3000 });
            }
        } catch (error) {
            console.error('Error deleting currency rate:', error);
            toast.error('Error deleting currency rate', { autoClose: 3000 });
        }
    };

    return (
        <div className="container mt-1">
            <div className="">
                <div className="card card-body shadow p-5">
                    <h3 className="pb-3 text-center">
                        <b className="p-2">CURRENCY RATE </b>
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <select
                                        id="currencies"
                                        name="currency_name"
                                        className="form-control"
                                        required
                                        onChange={handleCurrencyChange}
                                    >
                                        <option value="">Select Currency</option>
                                        {currencies.map((currency) => (
                                            <option key={currency.id} value={currency.id}>
                                                {currency.currency_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <input
                                        type="time"
                                        required
                                        name="time"
                                        className="form-control"
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col">
                                <div className="form-group">
                                    <input
                                        type="date"
                                        required
                                        name="date"
                                        className="form-control"
                                        value={formData.date}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group input-group">
                                    <span className="input-group-text">Rate</span>
                                    <input
                                        type="text"
                                        required
                                        name="rate"
                                        className="form-control"
                                        placeholder="Currency Rate"
                                        value={formData.rate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="align-content-center d-flex justify-content-center pt-3">
                            <button type="submit" className="btn btn-outline-dark align-content-center">
                                Update Currency Rate
                            </button>
                        </div>
                    </form>
                </div>
                <div>
                    <div className="card card-body shadow p-5 mt-4">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Date</th>
                                    <th scope="col">Currency Pair</th>
                                    <th scope="col">Rate</th>
                                    <th scope="col">Time</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currencyRates.map((currencyRate, index) => (
                                    <tr key={index}>
                                        <td>{new Date(currencyRate.date).toLocaleDateString()}</td>
                                        <td>{currencyRate.currency_name}</td>
                                        <td>
                                            {currencyRate.currency_name === 'INR to LKR'
                                                ? `LKR  ${currencyRate.rate}`
                                                : `INR  ${currencyRate.rate}`}
                                        </td>
                                        <td>
                                            {new Date(`2000-01-01T${currencyRate.time}`).toLocaleTimeString('en-US', {
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true,
                                            })}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(currencyRate.id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Currency;
