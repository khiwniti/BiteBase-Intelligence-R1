import React from 'react';

interface RecommendationProps {
  recommendations: string[];
}

interface MetricInsightProps {
  metric: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  insight: string;
}

interface WorkflowResultViewProps {
  result: {
    analysis?: string;
    recommendations?: string[];
    metrics?: {
      [key: string]: {
        value: number;
        trend: 'up' | 'down' | 'stable';
        insight: string;
      };
    };
    comparison?: {
      [key: string]: any;
    };
    strengths?: string[];
    weaknesses?: string[];
    opportunities?: string[];
    optimized_menu?: any[];
    projected_impact?: {
      [key: string]: any;
    };
    [key: string]: any;
  };
  type: 'restaurant' | 'competitor' | 'menu' | 'custom';
  className?: string;
}

const RecommendationsList: React.FC<RecommendationProps> = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) return null;
  
  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold mb-2">Recommendations</h4>
      <ul className="space-y-2">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start">
            <div className="mr-2 mt-1 text-primary">
              <i className="fas fa-lightbulb"></i>
            </div>
            <span className="text-gray-700">{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const MetricInsight: React.FC<MetricInsightProps> = ({ metric, value, trend, insight }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <i className="fas fa-arrow-up text-green-600"></i>;
      case 'down':
        return <i className="fas fa-arrow-down text-red-600"></i>;
      case 'stable':
        return <i className="fas fa-minus text-gray-600"></i>;
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-500 capitalize">{metric.replace(/_/g, ' ')}</span>
        <span className="flex items-center">
          {getTrendIcon()}
        </span>
      </div>
      <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <p className="mt-2 text-sm text-gray-600">{insight}</p>
    </div>
  );
};

const WorkflowResultView: React.FC<WorkflowResultViewProps> = ({ result, type, className = '' }) => {
  if (!result) {
    return (
      <div className={`bg-gray-100 p-6 rounded-lg ${className}`}>
        <p className="text-gray-500">No analysis results available</p>
      </div>
    );
  }
  
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <h3 className="text-xl font-bold mb-4">Analysis Results</h3>
      
      {result.analysis && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">Key Insights</h4>
          <p className="text-gray-700 whitespace-pre-line">{result.analysis}</p>
        </div>
      )}
      
      {result.recommendations && <RecommendationsList recommendations={result.recommendations} />}
      
      {result.metrics && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-3">Key Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(result.metrics).map(([key, data]) => (
              <MetricInsight 
                key={key} 
                metric={key} 
                value={data.value} 
                trend={data.trend} 
                insight={data.insight} 
              />
            ))}
          </div>
        </div>
      )}
      
      {type === 'competitor' && result.strengths && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">SWOT Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-700 mb-2">Strengths</h5>
              <ul className="list-disc pl-5 space-y-1">
                {result.strengths.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h5 className="font-medium text-red-700 mb-2">Weaknesses</h5>
              <ul className="list-disc pl-5 space-y-1">
                {result.weaknesses?.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg md:col-span-2">
              <h5 className="font-medium text-blue-700 mb-2">Opportunities</h5>
              <ul className="list-disc pl-5 space-y-1">
                {result.opportunities?.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {type === 'menu' && result.optimized_menu && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-3">Optimized Menu</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.optimized_menu.map((item: any, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.change > 0 ? (
                        <span className="text-green-600">+{item.change.toFixed(2)}%</span>
                      ) : item.change < 0 ? (
                        <span className="text-red-600">{item.change.toFixed(2)}%</span>
                      ) : (
                        <span className="text-gray-600">No change</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowResultView; 