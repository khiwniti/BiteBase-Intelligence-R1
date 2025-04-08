import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LangflowWorkflowCard from '../components/LangflowIntegration/LangflowWorkflowCard';
import WorkflowResultView from '../components/LangflowIntegration/WorkflowResultView';
import { endpoints } from '../utils/api';

interface Competitor {
  id: string;
  name: string;
  location: string;
  cuisine_type: string;
  metrics?: {
    avgRating: number;
    reviewCount: number;
    priceRange: string;
    popularity: number;
  };
}

const MOCK_COMPETITORS: Competitor[] = [
  {
    id: 'comp1',
    name: 'Burger Haven',
    location: '123 Main St, Anytown',
    cuisine_type: 'American',
    metrics: {
      avgRating: 4.2,
      reviewCount: 342,
      priceRange: '$$',
      popularity: 85
    }
  },
  {
    id: 'comp2',
    name: 'Pizza Palace',
    location: '456 Oak Ave, Anytown',
    cuisine_type: 'Italian',
    metrics: {
      avgRating: 4.5,
      reviewCount: 512,
      priceRange: '$$',
      popularity: 92
    }
  },
  {
    id: 'comp3',
    name: 'Sushi Supreme',
    location: '789 Pine Blvd, Anytown',
    cuisine_type: 'Japanese',
    metrics: {
      avgRating: 4.7,
      reviewCount: 287,
      priceRange: '$$$',
      popularity: 78
    }
  },
  {
    id: 'comp4',
    name: 'Taco Town',
    location: '101 Elm St, Anytown',
    cuisine_type: 'Mexican',
    metrics: {
      avgRating: 4.0,
      reviewCount: 198,
      priceRange: '$',
      popularity: 65
    }
  }
];

const CompetitorAnalysis = () => {
  const [restaurantId, setRestaurantId] = useState<string>('1'); // Mock restaurant ID
  const [competitors, setCompetitors] = useState<Competitor[]>(MOCK_COMPETITORS);
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState<string>('last_30_days');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const fetchCompetitors = async () => {
    try {
      // In a real application, this would be an API call
      // const response = await endpoints.restaurants.getCompetitors(restaurantId);
      // setCompetitors(response.data.competitors);
      
      // Using mock data for now
      setCompetitors(MOCK_COMPETITORS);
    } catch (error) {
      console.error('Error fetching competitors:', error);
    }
  };

  useEffect(() => {
    fetchCompetitors();
  }, [restaurantId]);

  const handleCompetitorSelect = (id: string) => {
    setSelectedCompetitors(prev => 
      prev.includes(id) 
        ? prev.filter(compId => compId !== id) 
        : [...prev, id]
    );
  };

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result);
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Competitor Analysis</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Select Competitors</h2>
                
                <div className="mb-4">
                  <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
                    Analysis Timeframe
                  </label>
                  <select
                    id="timeframe"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                  >
                    <option value="last_7_days">Last 7 Days</option>
                    <option value="last_30_days">Last 30 Days</option>
                    <option value="last_90_days">Last 90 Days</option>
                    <option value="last_year">Last Year</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  {competitors.map((competitor) => (
                    <div 
                      key={competitor.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors 
                        ${selectedCompetitors.includes(competitor.id) 
                          ? 'border-primary bg-primary bg-opacity-5' 
                          : 'border-gray-200 hover:border-gray-300'}`}
                      onClick={() => handleCompetitorSelect(competitor.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{competitor.name}</h3>
                          <p className="text-sm text-gray-500">{competitor.cuisine_type}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-yellow-400">
                            {competitor.metrics?.avgRating} <i className="fas fa-star text-xs"></i>
                          </div>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center 
                            ${selectedCompetitors.includes(competitor.id) ? 'bg-primary text-white' : 'border border-gray-300'}`}
                          >
                            {selectedCompetitors.includes(competitor.id) && (
                              <i className="fas fa-check text-xs"></i>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedCompetitors.length > 0 && (
                <LangflowWorkflowCard
                  title="Competitor Analysis"
                  description="Analyze your competitors and get strategic insights"
                  flowId="competitor_analysis"
                  icon="fa-users"
                  inputParams={{
                    restaurant_id: restaurantId,
                    competitor_ids: selectedCompetitors,
                    timeframe: timeframe
                  }}
                  onComplete={handleAnalysisComplete}
                />
              )}
            </div>
            
            <div className="lg:col-span-2">
              {analysisResult ? (
                <WorkflowResultView 
                  result={analysisResult}
                  type="competitor"
                />
              ) : (
                <div className="bg-white shadow-md rounded-lg p-6 h-full flex items-center justify-center">
                  <div className="text-center">
                    <i className="fas fa-users text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">Select competitors and run the analysis to see insights</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompetitorAnalysis;
