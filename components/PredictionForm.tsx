
import React, { useState } from 'react';
import { CustomerData } from '../types';

interface PredictionFormProps {
  onSubmit: (data: CustomerData) => void;
  isLoading: boolean;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<CustomerData>({
    tenure: 12,
    monthlyCharges: 599,
    totalCharges: 7188,
    contract: 'Month-to-month',
    internetService: 'Fiber optic',
    techSupport: 'No',
    paperlessBilling: 'Yes',
    paymentMethod: 'UPI'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'tenure' || name === 'monthlyCharges' || name === 'totalCharges') ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 p-8 rounded-xl shadow-xl h-full">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <i className="fas fa-user-plus mr-2 text-indigo-400"></i>
        New Customer Analysis
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Tenure (Months)</label>
          <input
            type="number"
            name="tenure"
            value={formData.tenure}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Monthly Charges (₹)</label>
          <input
            type="number"
            name="monthlyCharges"
            value={formData.monthlyCharges}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Contract Type</label>
          <select
            name="contract"
            value={formData.contract}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100"
          >
            <option value="Month-to-month">Month-to-month</option>
            <option value="One year">One year</option>
            <option value="Two year">Two year</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Internet Service</label>
          <select
            name="internetService"
            value={formData.internetService}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100"
          >
            <option value="DSL">DSL</option>
            <option value="Fiber optic">Fiber optic</option>
            <option value="No">No Internet</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Tech Support</label>
          <select
            name="techSupport"
            value={formData.techSupport}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100"
          >
            <option value="UPI">UPI / GPay</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Electronic check">Electronic Check</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <><i className="fas fa-circle-notch fa-spin mr-2"></i> Analyzing...</>
        ) : (
          <><i className="fas fa-brain mr-2"></i> Run Prediction</>
        )}
      </button>
    </form>
  );
};

export default PredictionForm;
