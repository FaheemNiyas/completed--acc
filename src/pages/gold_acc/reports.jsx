import React from 'react';
import { Link } from 'react-router-dom';
import { FaHistory } from "react-icons/fa";

function Reports() {
    return (
        <div className="container mt-5">
            <h1 className="text-center mb-5 pt-3"> <FaHistory className="mr-2 mb-2" /><b>REPORTS</b></h1>
            <div className="row">
                <div className="col-md-6">
                    <div className="card shadow p-4">
                        <div className="card-body text-center">
                            <h5 className="card-title">MONTHLY REPORT</h5>
                            <p className="card-text">Generate monthly gold Purchase/Sell report.</p>
                            <Link to="/dashboard/gold_report" className="btn btn-outline-dark">Generate</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card shadow p-4">
                        <div className="card-body text-center">
                            <h5 className="card-title">INVESTOR REPORT</h5>
                            <p className="card-text">Generate reports for investor Profit /Loss /Withdrawals.</p>
                            <Link to="/dashboard/investor_report" className="btn btn-outline-dark" >Generate</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reports;
