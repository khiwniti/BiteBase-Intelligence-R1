import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { API_URL } from 'app';

interface LangflowEditorProps {
  flowId?: string;
  onFlowSaved?: (flowId: string) => void;
  className?: string;
}

export const LangflowEditor: React.FC<LangflowEditorProps> = ({
  flowId,
  onFlowSaved,
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [flowName, setFlowName] = useState('');
  const [flowDescription, setFlowDescription] = useState('');
  const [langflowUrl, setLangflowUrl] = useState('http://localhost:7860');
  const [isLangflowAvailable, setIsLangflowAvailable] = useState(false);

  // Check if Langflow is available
  useEffect(() => {
    const checkLangflowStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/routes/langflow/`);
        if (response.ok) {
          const data = await response.json();
          setIsLangflowAvailable(data.status === 'ok');
          setError(null);
        } else {
          setIsLangflowAvailable(false);
          setError('Langflow is not available. Please make sure it is running.');
        }
      } catch (err) {
        console.error('Error checking Langflow status:', err);
        setIsLangflowAvailable(false);
        setError('Failed to connect to Langflow. Please make sure it is running.');
      }
    };

    checkLangflowStatus();
  }, []);

  // If flowId is provided, fetch flow details
  useEffect(() => {
    if (flowId) {
      const fetchFlowDetails = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_URL}/routes/langflow/flows/${flowId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch flow details');
          }
          const data = await response.json();
          setFlowName(data.name || '');
          setFlowDescription(data.description || '');
          setError(null);
        } catch (err) {
          console.error('Error fetching flow details:', err);
          setError('Failed to load flow details. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchFlowDetails();
    }
  }, [flowId]);

  const handleOpenLangflow = () => {
    // Open Langflow in a new tab
    window.open(langflowUrl, '_blank');
  };

  const handleImportFlow = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prompt user to paste the flow JSON
      const flowJson = prompt('Please paste the Langflow JSON:');
      if (!flowJson) {
        setLoading(false);
        return;
      }

      // Parse the JSON
      let flowData;
      try {
        flowData = JSON.parse(flowJson);
      } catch (err) {
        throw new Error('Invalid JSON format');
      }

      // Add name and description if provided
      if (flowName) {
        flowData.name = flowName;
      }
      if (flowDescription) {
        flowData.description = flowDescription;
      }

      // Import the flow
      const response = await fetch(`${API_URL}/routes/langflow/flows/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flowData),
      });

      if (!response.ok) {
        throw new Error('Failed to import flow');
      }

      const data = await response.json();
      setSuccess(`Flow imported successfully with ID: ${data.id}`);
      
      if (onFlowSaved) {
        onFlowSaved(data.id);
      }
    } catch (err) {
      console.error('Error importing flow:', err);
      setError(`Failed to import flow: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFlow = async () => {
    if (!flowId) {
      setError('No flow ID provided for saving');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_URL}/routes/langflow/flows/${flowId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: flowName,
          description: flowDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update flow');
      }

      setSuccess('Flow updated successfully');
      
      if (onFlowSaved) {
        onFlowSaved(flowId);
      }
    } catch (err) {
      console.error('Error updating flow:', err);
      setError('Failed to update flow. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle>Langflow Integration</CardTitle>
        <CardDescription>
          Create and manage your AI workflows with Langflow
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="flow-name">Flow Name</Label>
            <Input
              id="flow-name"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              placeholder="Enter flow name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="flow-description">Flow Description</Label>
            <Input
              id="flow-description"
              value={flowDescription}
              onChange={(e) => setFlowDescription(e.target.value)}
              placeholder="Enter flow description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="langflow-url">Langflow URL</Label>
            <Input
              id="langflow-url"
              value={langflowUrl}
              onChange={(e) => setLangflowUrl(e.target.value)}
              placeholder="http://localhost:7860"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Button
              onClick={handleOpenLangflow}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              Open Langflow Editor
            </Button>
            
            <Button
              onClick={handleImportFlow}
              className="bg-green-600 hover:bg-green-700"
              disabled={loading || !isLangflowAvailable}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                'Import Flow from Langflow'
              )}
            </Button>
            
            {flowId && (
              <Button
                onClick={handleSaveFlow}
                className="bg-yellow-600 hover:bg-yellow-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Update Flow Details'
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LangflowEditor;
