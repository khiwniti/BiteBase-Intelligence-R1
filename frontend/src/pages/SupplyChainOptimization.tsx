import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LangflowWorkflowCard from '../components/LangflowIntegration/LangflowWorkflowCard';
import WorkflowResultView from '../components/LangflowIntegration/WorkflowResultView';
import { endpoints } from '../utils/api';

interface InventoryItem {
  id: string;
  name: string;
  current_stock: number;
  unit: string;
  min_stock_level: number;
  max_stock_level: number;
  shelf_life: number;
  storage_conditions: string;
}

interface Supplier {
  id: string;
  name: string;
  lead_time: number;
  reliability_score: number;
  cost_per_unit: number;
  minimum_order_quantity: number;
  delivery_days: string[];
}

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    name: 'Ground Beef',
    current_stock: 150,
    unit: 'kg',
    min_stock_level: 50,
    max_stock_level: 200,
    shelf_life: 3,
    storage_conditions: 'Refrigerated'
  },
  {
    id: '2',
    name: 'Lettuce',
    current_stock: 30,
    unit: 'kg',
    min_stock_level: 10,
    max_stock_level: 50,
    shelf_life: 5,
    storage_conditions: 'Refrigerated'
  },
  {
    id: '3',
    name: 'Tomatoes',
    current_stock: 25,
    unit: 'kg',
    min_stock_level: 8,
    max_stock_level: 40,
    shelf_life: 4,
    storage_conditions: 'Room Temperature'
  }
];

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'supp1',
    name: 'Fresh Foods Co.',
    lead_time: 2,
    reliability_score: 0.95,
    cost_per_unit: 12.50,
    minimum_order_quantity: 20,
    delivery_days: ['Monday', 'Wednesday', 'Friday']
  },
  {
    id: 'supp2',
    name: 'Quality Meats Ltd.',
    lead_time: 1,
    reliability_score: 0.98,
    cost_per_unit: 15.75,
    minimum_order_quantity: 15,
    delivery_days: ['Tuesday', 'Thursday']
  }
];

const SupplyChainOptimization: React.FC = () => {
  const [restaurantId, setRestaurantId] = useState<string>('1'); // Mock restaurant ID
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [timeframe, setTimeframe] = useState<string>('last_30_days');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [constraints, setConstraints] = useState({
    max_order_budget: 5000,
    prioritize_local_suppliers: true,
    storage_capacity_limited: false,
    minimize_different_suppliers: true
  });

  const fetchInventoryData = async () => {
    try {
      // In a real application, these would be API calls
      // const response = await endpoints.restaurants.getInventory(restaurantId);
      // setInventory(response.data.inventory);
      
      // const suppliersResponse = await endpoints.restaurants.getSuppliers(restaurantId);
      // setSuppliers(suppliersResponse.data.suppliers);
      
      // Using mock data for now
      setInventory(MOCK_INVENTORY);
      setSuppliers(MOCK_SUPPLIERS);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, [restaurantId]);

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result);
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Supply Chain Optimization</h1>
            <select
              className="border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_90_days">Last 90 Days</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Current Inventory</h2>
                <div className="space-y-4">
                  {inventory.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            {item.current_stock} {item.unit} in stock
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            Min: {item.min_stock_level} {item.unit}
                          </div>
                          <div className="text-sm text-gray-500">
                            Max: {item.max_stock_level} {item.unit}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ 
                              width: `${(item.current_stock / item.max_stock_level) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Optimization Constraints</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Maximum Order Budget
                    </label>
                    <input
                      type="number"
                      value={constraints.max_order_budget}
                      onChange={(e) => setConstraints({
                        ...constraints,
                        max_order_budget: Number(e.target.value)
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={constraints.prioritize_local_suppliers}
                      onChange={(e) => setConstraints({
                        ...constraints,
                        prioritize_local_suppliers: e.target.checked
                      })}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Prioritize Local Suppliers
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={constraints.storage_capacity_limited}
                      onChange={(e) => setConstraints({
                        ...constraints,
                        storage_capacity_limited: e.target.checked
                      })}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Storage Capacity Limited
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={constraints.minimize_different_suppliers}
                      onChange={(e) => setConstraints({
                        ...constraints,
                        minimize_different_suppliers: e.target.checked
                      })}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Minimize Different Suppliers
                    </label>
                  </div>
                </div>
              </div>
              
              <LangflowWorkflowCard
                title="Supply Chain Optimization"
                description="Analyze inventory and optimize supplier relationships"
                flowId="supply_chain_optimization"
                icon="fa-boxes"
                inputParams={{
                  restaurant_id: restaurantId,
                  start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  end_date: new Date().toISOString().split('T')[0],
                  safety_days: 7,
                  min_supplier_reliability: 0.9,
                  volume_discount_threshold: 1000,
                  volume_discount_rate: 0.05,
                  constraints: constraints
                }}
                onComplete={handleAnalysisComplete}
              />
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
                    <i className="fas fa-boxes text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">Run the analysis to see supply chain optimization recommendations</p>
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

export default SupplyChainOptimization; 