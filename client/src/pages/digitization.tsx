import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/digitization/file-upload";
import ExtractedDataPreview from "@/components/digitization/extracted-data-preview";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FileText, Clock, CheckCircle } from "lucide-react";

interface ExtractedData {
  documentType: string;
  issueDate: string;
  district: string;
  tehsil: string;
  pattalHolderName: string;
  fatherName: string;
  village: string;
  tribe: string;
  totalArea: string;
  surveyNumber: string;
  landType: string;
  status: string;
}

interface DigitizeResponse {
  success: boolean;
  extractedData: ExtractedData;
  message: string;
}

export default function Digitization() {
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const { toast } = useToast();

  const digitizeMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('document', file);
      const response = await apiRequest('POST', '/api/digitize-document', formData);
      return response.json() as Promise<DigitizeResponse>;
    },
    onSuccess: (data) => {
      if (data.success) {
        setExtractedData(data.extractedData);
        toast({
          title: "Document Processed",
          description: data.message,
        });
      }
    },
    onError: () => {
      toast({
        title: "Processing Failed",
        description: "Failed to process the document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: ExtractedData) => {
      const fraClaimData = {
        pattalHolderName: data.pattalHolderName,
        fatherName: data.fatherName,
        village: data.village,
        district: data.district,
        tehsil: data.tehsil,
        tribe: data.tribe,
        totalArea: data.totalArea,
        surveyNumber: data.surveyNumber,
        landType: data.landType,
        status: data.status,
        issueDate: new Date(data.issueDate).toISOString(),
        documentType: data.documentType,
        latitude: "0",
        longitude: "0",
      };
      
      const response = await apiRequest('POST', '/api/fra-claims', fraClaimData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fra-claims'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Data Saved",
        description: "FRA claim data has been saved successfully.",
      });
      setExtractedData(null);
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Failed to save the extracted data. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mock recent uploads for demonstration
  const recentUploads = [
    {
      id: "1",
      filename: "FRA_Gondia_Ramesh.pdf",
      processedAt: "2 hours ago",
      status: "processed",
    },
    {
      id: "2", 
      filename: "Patta_Wardha_Priya.jpg",
      processedAt: "1 day ago",
      status: "processed",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-4">FRA Document Digitization</h1>
        <p className="text-muted-foreground text-lg">Upload and digitize Forest Rights Act documents using AI-powered OCR technology</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card data-testid="card-upload-section">
          <CardHeader>
            <CardTitle>Upload FRA Document</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload
              onFileSelect={(file) => digitizeMutation.mutate(file)}
              isProcessing={digitizeMutation.isPending}
              data-testid="file-upload"
            />

            {/* Recent Uploads */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Recent Uploads</h3>
              <div className="space-y-3">
                {recentUploads.map((upload) => (
                  <div key={upload.id} className="flex items-center p-3 bg-muted/30 rounded-md" data-testid={`recent-upload-${upload.id}`}>
                    <FileText className="text-destructive mr-3 h-4 w-4" />
                    <div className="flex-1">
                      <p className="font-medium">{upload.filename}</p>
                      <p className="text-sm text-muted-foreground">Processed {upload.processedAt}</p>
                    </div>
                    <Button variant="ghost" size="sm" data-testid={`view-upload-${upload.id}`}>
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Extracted Data Preview */}
        <Card data-testid="card-extracted-data">
          <CardHeader>
            <CardTitle>Extracted Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {digitizeMutation.isPending && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
                  <p className="text-muted-foreground">Processing document...</p>
                </div>
              </div>
            )}

            {extractedData ? (
              <ExtractedDataPreview 
                data={extractedData}
                onSave={() => saveMutation.mutate(extractedData)}
                onEdit={() => {
                  // TODO: Implement edit functionality
                  toast({
                    title: "Edit Mode",
                    description: "Edit functionality would be implemented here.",
                  });
                }}
                isSaving={saveMutation.isPending}
                data-testid="extracted-data-preview"
              />
            ) : !digitizeMutation.isPending && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Upload a document to see extracted data preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
