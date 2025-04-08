import React, { useState } from 'react';
import axios from 'axios';

interface WorkflowParams {
  [key: string]: string | number | string[] | object;
}

interface WorkflowCardProps {
  title: string;
  description: string;
  flowId: string;
  icon: string;
  inputParams: WorkflowParams;
  onComplete?: (result: any) => void;
  className?: string;
}

const LangflowWorkflowCard: React.FC<WorkflowCardProps> = ({
  title,
  description,
  flowId,
  icon,
  inputParams,
  onComplete,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const runWorkflow = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/ai/flows/${flowId}/run`;
      const response = await axios.post(apiUrl, inputParams, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      setResult(response.data.data);
      if (onComplete) {
        onComplete(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to run workflow');
      console.error('Workflow error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg ${className}`}>
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-4">
          <i className={`fas ${icon} text-primary text-xl`}></i>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {result && !error && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
          <p className="text-sm">Analysis complete!</p>
        </div>
      )}
      
      <button
        onClick={runWorkflow}
        disabled={isLoading}
        className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-darkgreen transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Running Analysis...
          </span>
        ) : (
          <span>Run Analysis</span>
        )}
      </button>
    </div>
  );
};

export default LangflowWorkflowCard; 