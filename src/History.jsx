import { useState } from 'react';
import { FiDelete } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem('calculatorHistory') || '[]')
  );

  const clearHistory = () => {
    localStorage.setItem('calculatorHistory', '[]');
    setHistory([]);
  };

  const deleteEntry = (id) => {
    const newHistory = history.filter(entry => entry.id !== id);
    localStorage.setItem('calculatorHistory', JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-all duration-200"
          >
            Back to Calculator
          </button>
          <h1 className="text-2xl font-bold text-white">Calculation History</h1>
          <button
            onClick={clearHistory}
            className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-all duration-200"
          >
            Clear All
          </button>
        </div>

        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No calculation history
            </div>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                className="bg-gray-800 rounded-xl p-4 flex justify-between items-center group"
              >
                <div className="flex-1">
                  <div className="text-white text-lg">
                    {entry.calculation} = {entry.result}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {entry.timestamp}
                  </div>
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="text-gray-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  aria-label="Delete entry"
                >
                  <FiDelete className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default History;