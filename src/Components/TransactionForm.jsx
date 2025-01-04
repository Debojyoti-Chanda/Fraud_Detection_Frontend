import React, { useState } from "react";
import axios from "axios";

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    Sender_account: "",
    Receiver_account: "",
    Amount: "",
    Sender_bank_location: "",
    Receiver_bank_location: "",
    Payment_type: "",
    Laundering_type: "",
  });

  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponseData(null);

    try {
      const response = await axios.post("http://127.0.0.1:3000/predict", {
        Sender_account: [parseInt(formData.Sender_account)],
        Receiver_account: [parseInt(formData.Receiver_account)],
        Amount: [parseFloat(formData.Amount)],
        Sender_bank_location: [formData.Sender_bank_location],
        Receiver_bank_location: [formData.Receiver_bank_location],
        Payment_type: [formData.Payment_type],
        Laundering_type: [formData.Laundering_type],
      });
      print(response.data)
      setResponseData(response.data);

    } catch (err) {
      setError("Failed to fetch predictions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Transaction Prediction</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Sender Account", name: "Sender_account", type: "text" },
            { label: "Receiver Account", name: "Receiver_account", type: "text" },
            { label: "Amount", name: "Amount", type: "number" },
            { label: "Sender Bank Location", name: "Sender_bank_location", type: "text" },
            { label: "Receiver Bank Location", name: "Receiver_bank_location", type: "text" },
            { label: "Payment Type", name: "Payment_type", type: "text" },
            { label: "Laundering Type", name: "Laundering_type", type: "text" },
          ].map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-gray-700 font-medium"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {responseData && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Prediction Results</h2>
          <pre className="text-sm bg-gray-100 p-4 rounded-lg overflow-auto">
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TransactionForm;
