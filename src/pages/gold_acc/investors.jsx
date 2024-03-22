import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Investors() {
  const [formData, setFormData] = useState({
    date: '',
    investment: '',
    mobile_no: '',
    investor_name: '',
    country: ''
  });

  // eslint-disable-next-line
  const [countries, setCountries] = useState([
    'Sri Lanka',
    'India',
    'Canada',
    'Dubai',
  ]);

  const [investorsList, setInvestorsList] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/investors', formData);
      if (response.status === 200) {
        toast.success('Investor added successfully');
        setFormData({
          date: '',
          investment: '',
          mobile_no: '',
          investor_name: '',
          country: ''
        });
        fetchInvestorsList(); // Fetch and update the list after adding
      } else {
        toast.error('Failed to add investor');
      }
    } catch (error) {
      console.error('Error adding investor:', error);
      toast.error('Failed to add investor');
    }
  };

  const fetchInvestorsList = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/investors');
      setInvestorsList(response.data);
    } catch (error) {
      console.error('Error fetching investors:', error);
    }
  };

  useEffect(() => {
    fetchInvestorsList();
  }, []); // Fetch the investors list on component mount

  const handleDelete = async (investorId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/removeinvestors/${investorId}`);
      if (response.status === 200) {
        toast.success('Investor Removed Successfully', { position: toast.POSITION.TOP_RIGHT });
        fetchInvestorsList(); // Fetch and update the list after deleting
      } else {
        toast.error('Failed to Remove Investor', { position: toast.POSITION.TOP_RIGHT });
      }
    } catch (error) {
      toast.error('Failed to Remove Investor', { position: toast.POSITION.TOP_RIGHT });
    }
  };

  return (
    <div className="container mt-1">
      <div className="card">
        <div className="card-body shadow p-5">
          <h3 className="pb-3 text-center">
            <b className="p-2 ">INVESTORS</b>
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <input
                    type="date" required name="date" className="form-control" onChange={handleChange} value={formData.date} />
                </div>

                <div className="form-group input-group">
                  <span className="input-group-text">LKR</span>
                  <input type="hidden" name="credit_amount" />
                  <input
                    type="text" required name="investment" className="form-control" placeholder="Invested Amount" onChange={handleChange} value={formData.investment} />
                </div>

                <div className="form-group">
                  <input
                    type="text" required name="mobile_no" className="form-control" placeholder="Mobile No (+94 123 123 456)" onChange={handleChange} value={formData.mobile_no} />
                </div>
              </div>

              <div className="col">
                <div className="form-group">
                  <input
                    type="text" required name="investor_name" className="form-control" placeholder="Investor Name" onChange={handleChange} value={formData.investor_name} />
                </div>

                <div className="form-group">
                  <select id="country" name="country" className="form-control" required onChange={handleChange} value={formData.country}>
                    <option value="" disabled>Select Country</option>
                    {countries.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="align-content-center d-flex justify-content-center pt-3">
              <button type="submit" className="btn btn-outline-dark align-content-center">Add Investor</button>
            </div>
          </form>
        </div>
      </div>
      <table className="table mt-3 shadow">
        <thead className="table">
          <tr>
            <th scope="col">#</th>
            <th scope="col">CREATED DATE</th>
            <th scope="col">INVESTOR</th>
            <th scope="col">INVESTMENT AMOUNT</th>
            <th scope="col">COUNTRY</th>
            <th scope="col">MOBILE NO</th>
            <th scope="col">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {investorsList.map((investor, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{new Date(investor.date).toLocaleDateString('en-GB')}</td>
              <td>{investor.investor_name}</td>
              <td>LKR {investor.investment.toLocaleString()}</td>
              <td>{investor.country}</td>
              <td>{investor.mobile_no}</td>
              <td>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(investor.id)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
}

export default Investors;
