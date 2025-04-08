import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LangflowWorkflowCard from '../components/LangflowIntegration/LangflowWorkflowCard';
import WorkflowResultView from '../components/LangflowIntegration/WorkflowResultView';
import { endpoints } from '../utils/api';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  ingredients?: string[];
  cost?: number;
  popularity?: number; // Scale of 1-10
}

interface SalesData {
  daily_average: number;
  items: {
    [key: string]: {
      quantity: number;
      revenue: number;
      cost: number;
      profit_margin: number;
    }
  }
}

const MOCK_MENU_ITEMS: MenuItem[] = [
  { 
    id: '1', 
    name: 'Classic Burger', 
    price: 12.99, 
    category: 'Burgers',
    description: 'Beef patty with lettuce, tomato, onion, and special sauce',
    ingredients: ['beef', 'lettuce', 'tomato', 'onion', 'special sauce', 'bun'],
    cost: 4.50,
    popularity: 9
  },
  { 
    id: '2', 
    name: 'Cheese Pizza', 
    price: 14.99, 
    category: 'Pizza',
    description: 'Classic cheese pizza with tomato sauce',
    ingredients: ['dough', 'tomato sauce', 'mozzarella cheese'],
    cost: 3.75,
    popularity: 8
  },
  { 
    id: '3', 
    name: 'Caesar Salad', 
    price: 8.99, 
    category: 'Salads',
    description: 'Romaine lettuce with parmesan, croutons, and Caesar dressing',
    ingredients: ['romaine lettuce', 'parmesan cheese', 'croutons', 'caesar dressing'],
    cost: 2.25,
    popularity: 5
  },
  { 
    id: '4', 
    name: 'Chicken Wings', 
    price: 10.99, 
    category: 'Appetizers',
    description: 'Crispy chicken wings with choice of sauce',
    ingredients: ['chicken wings', 'flour', 'spices', 'sauce'],
    cost: 4.00,
    popularity: 7
  },
  { 
    id: '5', 
    name: 'Chocolate Cake', 
    price: 6.99, 
    category: 'Desserts',
    description: 'Rich chocolate cake with frosting',
    ingredients: ['flour', 'sugar', 'cocoa powder', 'eggs', 'butter', 'frosting'],
    cost: 1.75,
    popularity: 6
  }
];

const MOCK_SALES_DATA: SalesData = {
  daily_average: 1500,
  items: {
    '1': { quantity: 75, revenue: 974.25, cost: 337.50, profit_margin: 0.65 },
    '2': { quantity: 50, revenue: 749.50, cost: 187.50, profit_margin: 0.75 },
    '3': { quantity: 25, revenue: 224.75, cost: 56.25, profit_margin: 0.75 },
    '4': { quantity: 40, revenue: 439.60, cost: 160.00, profit_margin: 0.64 },
    '5': { quantity: 30, revenue: 209.70, cost: 52.50, profit_margin: 0.75 }
  }
};

const MenuOptimization: React.FC = () => {
  const [restaurantId, setRestaurantId] = useState<string>('1'); // Mock restaurant ID
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS);
  const [salesData, setSalesData] = useState<SalesData>(MOCK_SALES_DATA);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchMenuData = async () => {
    setIsLoading(true);
    try {
      // In a real application, these would be API calls to fetch real data
      // const response = await endpoints.restaurants.getMenuItems(restaurantId);
      // setMenuItems(response.data.menu_items);
      
      // const salesResponse = await endpoints.restaurants.getMenuSales(restaurantId);
      // setSalesData(salesResponse.data.sales_data);
      
      // Using mock data for now
      setMenuItems(MOCK_MENU_ITEMS);
      setSalesData(MOCK_SALES_DATA);
    } catch (error) {
      console.error('Error fetching menu data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, [restaurantId]);

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result);
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Menu Optimization</h1>
            <button 
              onClick={fetchMenuData}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-darkgreen transition-colors"
            >
              Refresh Data
            </button>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Current Menu Performance</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Sales</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit Margin</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Popularity</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {menuItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {salesData.items[item.id]?.quantity || 0} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {((salesData.items[item.id]?.profit_margin || 0) * 100).toFixed(0)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(item.popularity || 0) * 10}%` }}></div>
                          </div>
                          <span className="ml-2">{item.popularity}/10</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <LangflowWorkflowCard
                title="Menu Optimization"
                description="Analyze your menu data and get AI-powered optimization recommendations"
                flowId="menu_optimization"
                icon="fa-clipboard-list"
                inputParams={{
                  restaurant_id: restaurantId,
                  menu_items: menuItems,
                  sales_data: salesData
                }}
                onComplete={handleAnalysisComplete}
              />
            </div>
            <div className="lg:col-span-2">
              {analysisResult ? (
                <WorkflowResultView 
                  result={analysisResult}
                  type="menu"
                />
              ) : (
                <div className="bg-white shadow-md rounded-lg p-6 h-full flex items-center justify-center">
                  <div className="text-center">
                    <i className="fas fa-chart-line text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">Run the menu optimization analysis to see recommendations</p>
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

export default MenuOptimization; 