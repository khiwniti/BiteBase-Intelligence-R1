import React, { useState, useEffect } from 'react';
import { LangflowWidget, LangflowEditor } from '../components/LangflowIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { API_URL } from 'app';

const AIPage: React.FC = () => {
  const [flows, setFlows] = useState<any[]>([]);
  const [selectedFlowId, setSelectedFlowId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available flows
  useEffect(() => {
    const fetchFlows = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/routes/langflow/flows`);
        if (!response.ok) {
          throw new Error('Failed to fetch flows');
        }
        const data = await response.json();
        setFlows(data.flows || []);
        
        // Select the first flow if available
        if (data.flows && data.flows.length > 0) {
          setSelectedFlowId(data.flows[0].id);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching flows:', err);
        setError('Failed to load AI flows. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlows();
  }, []);

  const handleFlowSaved = (flowId: string) => {
    // Refresh the flows list
    fetch(`${API_URL}/routes/langflow/flows`)
      .then(response => response.json())
      .then(data => {
        setFlows(data.flows || []);
        setSelectedFlowId(flowId);
      })
      .catch(err => {
        console.error('Error refreshing flows:', err);
      });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">AI Workflows</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flows List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Available Flows</CardTitle>
            <CardDescription>Select a flow to use or edit</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading flows...</p>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : flows.length === 0 ? (
              <p>No flows available. Create a new one!</p>
            ) : (
              <ul className="space-y-2">
                {flows.map(flow => (
                  <li key={flow.id}>
                    <Button
                      variant={selectedFlowId === flow.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedFlowId(flow.id)}
                    >
                      {flow.name || flow.id}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            
            <div className="mt-4">
              <Button 
                onClick={() => setSelectedFlowId(undefined)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Create New Flow
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Flow Editor/Widget */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="use" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="use">Use Flow</TabsTrigger>
              <TabsTrigger value="edit">Edit Flow</TabsTrigger>
            </TabsList>
            
            <TabsContent value="use" className="mt-4">
              <LangflowWidget 
                flowId={selectedFlowId}
                title={flows.find(f => f.id === selectedFlowId)?.name || 'AI Assistant'}
                description={flows.find(f => f.id === selectedFlowId)?.description || 'Ask me anything about your business intelligence needs'}
              />
            </TabsContent>
            
            <TabsContent value="edit" className="mt-4">
              <LangflowEditor 
                flowId={selectedFlowId}
                onFlowSaved={handleFlowSaved}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Workflow Templates */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Workflow Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Market Research Template */}
          <Card>
            <CardHeader>
              <CardTitle>Market Research</CardTitle>
              <CardDescription>Analyze market trends and opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Use AI to gather and analyze market data, identify trends, and generate insights.</p>
              <Button className="w-full">Use Template</Button>
            </CardContent>
          </Card>
          
          {/* Competitor Analysis Template */}
          <Card>
            <CardHeader>
              <CardTitle>Competitor Analysis</CardTitle>
              <CardDescription>Understand your competition</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Analyze competitor strengths, weaknesses, and strategies to gain competitive advantage.</p>
              <Button className="w-full">Use Template</Button>
            </CardContent>
          </Card>
          
          {/* Customer Insights Template */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
              <CardDescription>Understand your customers better</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Analyze customer data to identify preferences, behaviors, and opportunities.</p>
              <Button className="w-full">Use Template</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIPage;
