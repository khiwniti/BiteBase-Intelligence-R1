import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LangflowWorkflowCard from '../components/LangflowIntegration/LangflowWorkflowCard';
import WorkflowResultView from '../components/LangflowIntegration/WorkflowResultView';
import { endpoints } from '../utils/api';

interface FootTrafficData {
  date: string;
  hour: number;
  count: number;
  dayOfWeek: string;
}

interface TrafficSummary {
  totalVisitors: number;
  averageDaily: number;
  peakDay: string;
  peakHour: number;
  slowestDay: string;
  weekOverWeekChange: number;
}

// Generate mock foot traffic data for the last 14 days
const generateMockData = (): FootTrafficData[] => {
  const data: FootTrafficData[] = [];
  const now = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Generate data for each of the last 14 days
  for (let d = 13; d >= 0; d--) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().slice(0, 10);
    const dayOfWeek = daysOfWeek[date.getDay()];
    
    // Generate hourly data (10am to 10pm)
    for (let hour = 10; hour <= 22; hour++) {
      // Base traffic count - higher on weekends, peaks at lunch and dinner
      let baseCount = 15;
      
      // Weekend boost
      if (dayOfWeek === 'Friday' || dayOfWeek === 'Saturday') {
        baseCount += 10;
      } else if (dayOfWeek === 'Sunday') {
        baseCount += 5;
      }
      
      // Lunch rush (12-2pm)
      if (hour >= 12 && hour <= 14) {
        baseCount += 20;
      }
      
      // Dinner rush (6-8pm)
      if (hour >= 18 && hour <= 20) {
        baseCount += 25;
      }
      
      // Add some randomness
      const randomFactor = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
      const count = Math.round(baseCount * randomFactor);
      
      data.push({
        date: dateStr,
        hour,
        count,
        dayOfWeek
      });
    }
  }
  
  return data;
};

const calculateSummary = (data: FootTrafficData[]): TrafficSummary => {
  // Group by date
  const dailyTotals: {[key: string]: number} = {};
  const dailyAvgByDay: {[key: string]: number} = {};
  const hourlyTotals: {[key: number]: number} = {};
  
  data.forEach(entry => {
    if (!dailyTotals[entry.date]) {
      dailyTotals[entry.date] = 0;
    }
    dailyTotals[entry.date] += entry.count;
    
    if (!dailyAvgByDay[entry.dayOfWeek]) {
      dailyAvgByDay[entry.dayOfWeek] = 0;
      dailyAvgByDay[`${entry.dayOfWeek}_count`] = 0;
    }
    dailyAvgByDay[entry.dayOfWeek] += entry.count;
    dailyAvgByDay[`${entry.dayOfWeek}_count`]++;
    
    if (!hourlyTotals[entry.hour]) {
      hourlyTotals[entry.hour] = 0;
    }
    hourlyTotals[entry.hour] += entry.count;
  });
  
  // Calculate averages by day of week
  Object.keys(dailyAvgByDay).forEach(day => {
    if (!day.includes('_count')) {
      dailyAvgByDay[day] = dailyAvgByDay[day] / dailyAvgByDay[`${day}_count`];
    }
  });
  
  // Find peak and slowest days
  let peakDay = '';
  let peakDayValue = 0;
  let slowestDay = '';
  let slowestDayValue = Infinity;
  
  Object.keys(dailyAvgByDay).forEach(day => {
    if (!day.includes('_count')) {
      if (dailyAvgByDay[day] > peakDayValue) {
        peakDayValue = dailyAvgByDay[day];
        peakDay = day;
      }
      if (dailyAvgByDay[day] < slowestDayValue) {
        slowestDayValue = dailyAvgByDay[day];
        slowestDay = day;
      }
    }
  });
  
  // Find peak hour
  let peakHour = 0;
  let peakHourValue = 0;
  
  Object.keys(hourlyTotals).forEach(hour => {
    if (hourlyTotals[Number(hour)] > peakHourValue) {
      peakHourValue = hourlyTotals[Number(hour)];
      peakHour = Number(hour);
    }
  });
  
  // Calculate total and average
  const totalVisitors = Object.values(dailyTotals).reduce((sum, count) => sum + count, 0);
  const averageDaily = totalVisitors / Object.keys(dailyTotals).length;
  
  // Calculate week-over-week change
  const dates = Object.keys(dailyTotals).sort();
  const week1Dates = dates.slice(0, 7);
  const week2Dates = dates.slice(7);
  
  const week1Total = week1Dates.reduce((sum, date) => sum + dailyTotals[date], 0);
  const week2Total = week2Dates.reduce((sum, date) => sum + dailyTotals[date], 0);
  
  const weekOverWeekChange = ((week2Total - week1Total) / week1Total) * 100;
  
  return {
    totalVisitors,
    averageDaily,
    peakDay,
    peakHour,
    slowestDay,
    weekOverWeekChange
  };
};

const FootTrafficAnalysis: React.FC = () => {
  const [restaurantId, setRestaurantId] = useState<string>('1'); // Mock restaurant ID
  const [trafficData, setTrafficData] = useState<FootTrafficData[]>([]);
  const [trafficSummary, setTrafficSummary] = useState<TrafficSummary | null>(null);
  const [timeframe, setTimeframe] = useState<string>('last_14_days');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  const fetchTrafficData = async () => {
    try {
      // In a real application, this would be an API call
      // const response = await endpoints.analytics.getFootTraffic(restaurantId, timeframe);
      // setTrafficData(response.data.traffic_data);
      
      // Using mock data for now
      const mockData = generateMockData();
      setTrafficData(mockData);
      setTrafficSummary(calculateSummary(mockData));
    } catch (error) {
      console.error('Error fetching foot traffic data:', error);
    }
  };
  
  useEffect(() => {
    fetchTrafficData();
  }, [restaurantId, timeframe]);
  
  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result);
  };
  
  // Format time from hour (24-hour format)
  const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };
  
  // Group traffic data by day for chart
  const getDailyData = () => {
    const dailyData: {[key: string]: number} = {};
    trafficData.forEach(entry => {
      if (!dailyData[entry.date]) {
        dailyData[entry.date] = 0;
      }
      dailyData[entry.date] += entry.count;
    });
    
    // Return the last 7 days
    const sortedDates = Object.keys(dailyData).sort().slice(-7);
    return sortedDates.map(date => ({
      date,
      count: dailyData[date],
      dayOfWeek: new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
    }));
  };
  
  // Group traffic data by hour for chart
  const getHourlyData = () => {
    const hourlyData: {[key: number]: number} = {};
    for (let i = 10; i <= 22; i++) {
      hourlyData[i] = 0;
    }
    
    // Only use the last 7 days of data
    const recentData = trafficData.filter(entry => {
      const entryDate = new Date(entry.date);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return entryDate >= sevenDaysAgo;
    });
    
    recentData.forEach(entry => {
      hourlyData[entry.hour] += entry.count;
    });
    
    return Object.keys(hourlyData).map(hour => ({
      hour: Number(hour),
      count: hourlyData[Number(hour)] / 7, // Average per day
      timeLabel: formatHour(Number(hour))
    }));
  };
  
  const dailyData = getDailyData();
  const hourlyData = getHourlyData();
  
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Foot Traffic Analysis</h1>
            <select
              className="border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_14_days">Last 14 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_90_days">Last 90 Days</option>
            </select>
          </div>
          
          {trafficSummary && (
            <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary bg-opacity-10 rounded-md p-3">
                      <i className="fas fa-users text-primary"></i>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Visitors</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{trafficSummary.totalVisitors.toLocaleString()}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-accent bg-opacity-10 rounded-md p-3">
                      <i className="fas fa-calendar-day text-accent"></i>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Daily Average</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{Math.round(trafficSummary.averageDaily).toLocaleString()}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-secondary bg-opacity-10 rounded-md p-3">
                      <i className="fas fa-chart-line text-secondary"></i>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Week-over-Week Change</dt>
                        <dd className="flex items-baseline">
                          <div className={`text-2xl font-semibold ${trafficSummary.weekOverWeekChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trafficSummary.weekOverWeekChange >= 0 ? '+' : ''}{trafficSummary.weekOverWeekChange.toFixed(1)}%
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Daily Traffic (Last 7 Days)</h2>
              <div className="h-64">
                <div className="h-full flex items-end">
                  {dailyData.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-gray-500 mb-1">{day.dayOfWeek}</div>
                      <div 
                        className="w-full bg-primary hover:bg-darkgreen transition-colors rounded-t-md mx-1"
                        style={{ height: `${(day.count / Math.max(...dailyData.map(d => d.count))) * 100}%` }}
                      ></div>
                      <div className="text-xs font-medium mt-1">{day.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Hourly Traffic (Average)</h2>
              <div className="h-64">
                <div className="h-full flex items-end">
                  {hourlyData.map((hour, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-gray-500 mb-1">{hour.timeLabel}</div>
                      <div 
                        className="w-full bg-accent hover:bg-darkyellow transition-colors rounded-t-md mx-1"
                        style={{ height: `${(hour.count / Math.max(...hourlyData.map(h => h.count))) * 100}%` }}
                      ></div>
                      <div className="text-xs font-medium mt-1">{Math.round(hour.count)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <LangflowWorkflowCard
                title="Foot Traffic Insights"
                description="Get AI-powered insights from your foot traffic data"
                flowId="foot_traffic_analysis"
                icon="fa-walking"
                inputParams={{
                  restaurant_id: restaurantId,
                  timeframe: timeframe,
                  traffic_data: trafficData
                }}
                onComplete={handleAnalysisComplete}
              />
              
              {trafficSummary && (
                <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                  <h2 className="text-lg font-semibold mb-4">Traffic Highlights</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Peak Day</h3>
                      <p className="mt-1 text-lg font-semibold">{trafficSummary.peakDay}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Peak Hour</h3>
                      <p className="mt-1 text-lg font-semibold">{formatHour(trafficSummary.peakHour)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Slowest Day</h3>
                      <p className="mt-1 text-lg font-semibold">{trafficSummary.slowestDay}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-2">
              {analysisResult ? (
                <WorkflowResultView 
                  result={analysisResult}
                  type="custom"
                />
              ) : (
                <div className="bg-white shadow-md rounded-lg p-6 h-full flex items-center justify-center">
                  <div className="text-center">
                    <i className="fas fa-chart-bar text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">Run the analysis to see AI-powered insights on your foot traffic patterns</p>
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

export default FootTrafficAnalysis; 