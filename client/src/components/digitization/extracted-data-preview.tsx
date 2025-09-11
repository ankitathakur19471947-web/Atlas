import { Button } from '@/components/ui/button';
import { Save, Edit } from 'lucide-react';

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

interface ExtractedDataPreviewProps {
  data: ExtractedData;
  onSave: () => void;
  onEdit: () => void;
  isSaving: boolean;
  'data-testid'?: string;
}

export default function ExtractedDataPreview({ data, onSave, onEdit, isSaving }: ExtractedDataPreviewProps) {
  return (
    <div className="space-y-4" data-testid="extracted-data-preview">
      {/* Document Information */}
      <div className="p-4 bg-muted/20 rounded-md">
        <h3 className="font-medium mb-3 text-primary">Document Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Document Type:</span>
            <p className="font-medium" data-testid="document-type">{data.documentType}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Issue Date:</span>
            <p className="font-medium" data-testid="issue-date">{data.issueDate}</p>
          </div>
          <div>
            <span className="text-muted-foreground">District:</span>
            <p className="font-medium" data-testid="district">{data.district}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Tehsil:</span>
            <p className="font-medium" data-testid="tehsil">{data.tehsil}</p>
          </div>
        </div>
      </div>

      {/* Beneficiary Details */}
      <div className="p-4 bg-muted/20 rounded-md">
        <h3 className="font-medium mb-3 text-secondary">Beneficiary Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Patta Holder:</span>
            <span className="font-medium" data-testid="patta-holder">{data.pattalHolderName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Father's Name:</span>
            <span className="font-medium" data-testid="father-name">{data.fatherName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Village:</span>
            <span className="font-medium" data-testid="village">{data.village}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tribe:</span>
            <span className="font-medium" data-testid="tribe">{data.tribe}</span>
          </div>
        </div>
      </div>

      {/* Land Details */}
      <div className="p-4 bg-muted/20 rounded-md">
        <h3 className="font-medium mb-3 text-accent">Land Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Area:</span>
            <span className="font-medium" data-testid="total-area">{data.totalArea} hectares</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Survey Number:</span>
            <span className="font-medium" data-testid="survey-number">{data.surveyNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Land Type:</span>
            <span className="font-medium" data-testid="land-type">{data.landType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span 
              className={`px-2 py-1 rounded text-xs font-medium ${
                data.status === 'granted' 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-accent/20 text-accent'
              }`}
              data-testid="status"
            >
              {data.status}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          onClick={onSave}
          disabled={isSaving}
          className="flex-1"
          data-testid="button-save"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save to Database'}
        </Button>
        <Button 
          variant="secondary" 
          onClick={onEdit}
          disabled={isSaving}
          className="flex-1"
          data-testid="button-edit"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit & Validate
        </Button>
      </div>
    </div>
  );
}
