import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { API_URL } from 'app';

interface LangflowWidgetProps {
  flowId?: string;
  title?: string;
  description?: string;
  inputPlaceholder?: string;
  className?: string;
  onResult?: (result: any) => void;
}

export const LangflowWidget: React.FC<LangflowWidgetProps> = ({
  flowId,
  title = 'AI Assistant',
  description = 'Ask me anything about your business intelligence needs',
  inputPlaceholder = 'Type your question here...',
  className = '',
  onResult
}) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableFlows, setAvailableFlows] = useState<any[]>([]);
  const [selectedFlowId, setSelectedFlowId] = useState<string | undefined>(flowId);

  // Fetch available flows on component mount
  useEffect(() => {
    const fetchFlows = async () => {
      try {
        const response = await fetch(`${API_URL}/routes/langflow/flows`);
        if (!response.ok) {
          throw new Error('Failed to fetch flows');
        }
        const data = await response.json();
        setAvailableFlows(data.flows || []);
        
        // If no flowId was provided but flows are available, select the first one
        if (!flowId && data.flows && data.flows.length > 0) {
          setSelectedFlowId(data.flows[0].id);
        }
      } catch (err) {
        console.error('Error fetching flows:', err);
        setError('Failed to load AI flows. Please try again later.');
      }
    };

    fetchFlows();
  }, [flowId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    if (!selectedFlowId) {
      setError('No AI flow selected. Please select a flow first.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/routes/langflow/flows/${selectedFlowId}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setResponse(data.output || data.result || JSON.stringify(data));
      
      if (onResult) {
        onResult(data);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to get a response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {response && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 whitespace-pre-wrap">
            {response}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!flowId && availableFlows.length > 0 && (
              <div>
                <label htmlFor="flow-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Select AI Flow
                </label>
                <select
                  id="flow-select"
                  value={selectedFlowId}
                  onChange={(e) => setSelectedFlowId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a flow</option>
                  {availableFlows.map((flow) => (
                    <option key={flow.id} value={flow.id}>
                      {flow.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={inputPlaceholder}
              className="min-h-[100px]"
            />
            
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LangflowWidget;
