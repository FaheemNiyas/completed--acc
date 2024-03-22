import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Reinvestment() {
    const [investors, setInvestors] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [selectedInvestor, setSelectedInvestor] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [investment, setInvestment] = useState('');
    const [formData, setFormData] = useState({
        date: '',
        investment: '',
        mobile_no: '',
        investor_name: '',
        country: '',
        reinvestment: ''
    });

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

    // const handleInvestorChange = (event) => {
    //     const selectedInvestorId = event.target.value;

    //     // Check if the selected option is "Select Investor"
    //     if (selectedInvestorId === "") {
    //         // Clear the selected investor and set default values
    //         setSelectedInvestor(null);
    //         setInvestment('');
    //         setFormData({
    //             date: '',
    //             investment: '',
    //             mobile_no: '',
    //             investor_name: '',
    //             country: '',
    //             reinvestment: ''
    //         });
    //     } else {
    //         // Find the selected investor from the array
    //         const selectedInvestorData = investors.find((investor) => investor.id === parseInt(selectedInvestorId, 10));

    //         setSelectedInvestor(selectedInvestorData);

    //         // Set other form fields based on the selected investor
    //         setFormData({
    //             date: '',
    //             investment: selectedInvestorData.investment,
    //             mobile_no: selectedInvestorData.mobile_no,
    //             investor_name: selectedInvestorData.investor_name,
    //             country: selectedInvestorData.country,
    //             reinvestment: ''
    //         });
    //     }
    // };

    const handleInvestorChange = async (event) => {
        const selectedInvestorId = event.target.value;

        // Check if the selected option is "Select Investor"
        if (selectedInvestorId === "") {
            // Clear the selected investor and set default values
            setSelectedInvestor(null);
            setInvestment('');
            setFormData({
                date: '',
                investment: '',
                mobile_no: '',
                investor_name: '',
                country: '',
                reinvestment: ''
            });
        } else {
            // Find the selected investor from the array
            const selectedInvestorData = investors.find((investor) => investor.id === parseInt(selectedInvestorId, 10));

            try {
                // Fetch the total invested amount based on investor's name
                const totalInvestmentResponse = await axios.get(`http://localhost:3001/api/investor-total/${selectedInvestorData.investor_name}`);
                const totalInvestmentAmount = totalInvestmentResponse.data.total_investment;

                setSelectedInvestor(selectedInvestorData);

                // Set other form fields based on the selected investor and total investment amount
                setFormData({
                    date: '',
                    investment: totalInvestmentAmount, // Use the total investment amount from the backend
                    mobile_no: selectedInvestorData.mobile_no,
                    investor_name: selectedInvestorData.investor_name,
                    country: selectedInvestorData.country,
                    reinvestment: ''
                });
            } catch (error) {
                console.error('Error fetching total investment amount:', error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'reinvestment' ? parseFloat(value) : value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/reinvestments', formData);
            if (response.status === 200) {
                toast.success('Reinvestment added successfully', { autoClose: 3000 });

                // Clear the form fields after successful submission
                setFormData({
                    date: '',
                    investment: '',
                    mobile_no: '',
                    investor_name: '',
                    country: '',
                    reinvestment: '',
                });
            } else {
                toast.error('Failed to add reinvestment', { autoClose: 3000 });
            }
        } catch (error) {
            toast.error('Error adding reinvestment', { autoClose: 3000 });
        }
    };
  
    return (
        <div className="container mt-1">
            <div className="card">
                <div className="card-body shadow p-5">
                    <h3 className="pb-3 text-center">
                        <b className="p-2">RE INVESTMENT</b>
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                <select
                                        id="investors"
                                        name="investor_name"
                                        className="form-control"
                                        required
                                        onChange={handleInvestorChange}
                                    >
                                        <option value="">Select Investor</option>
                                        {investors.map((investor) => (
                                            <option key={investor.id} value={investor.id}>
                                                {investor.investor_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group input-group">
                                    <span className="input-group-text">LKR</span>
                                    <input
                                        type="hidden"
                                    />
                                    <input
                                        type="text"
                                        required
                                        name="investment"
                                        className="form-control"
                                        placeholder="Invested Amount"
                                        value={formData.investment.toLocaleString()}
                                        onChange={handleChange}
                                        readOnly
                                    />

                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        required
                                        name="mobile_no"
                                        className="form-control"
                                        placeholder="Mobile No (+94 123 123 456)"
                                        value={formData.mobile_no}
                                        onChange={handleChange}
                                        readOnly
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

                                <div className="form-group">
                                    <input
                                        type="text"
                                        required
                                        name="country"
                                        className="form-control"
                                        placeholder="Country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        readOnly
                                    />
                                </div>

                                <div className="form-group input-group">
                                    <span className="input-group-text">LKR</span>
                                    <input
                                        type="hidden"
                                        name="reinvestment"
                                    />
                                    <input
                                        type="text"
                                        required
                                        name="reinvestment"
                                        className="form-control"
                                        placeholder="Reinvestment Amount"
                                        value={formData.reinvestment}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="align-content-center d-flex justify-content-center pt-3">
                            <button type="submit" className="btn btn-outline-dark align-content-center">
                                Add Reinvest
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}

export default Reinvestment;