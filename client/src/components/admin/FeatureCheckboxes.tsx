import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface FeatureCheckboxesProps {
  selected: string[];
  selectedFeatures?: string[]; // For backward compatibility
  onChange: (selected: string[]) => void;
  contentType?: string;
}

const FeatureCheckboxes = ({
  selected,
  selectedFeatures, // For backward compatibility
  onChange,
  contentType
}: FeatureCheckboxesProps) => {
  // Use selectedFeatures if provided for backward compatibility
  const actualSelected = selected || selectedFeatures || [];

  const baseFeatures = [
    'Home Hero',
    'Home New Release',
    'Home Popular',
    'Type Hero',
    'Type New Release',
    'Type Popular'
  ];

  const features = contentType === 'Show' 
    ? [...baseFeatures, 'Entertainment']
    : baseFeatures;

  const handleChange = (feature: string, checked: boolean) => {
    if (checked) {
      onChange([...(actualSelected || []), feature]);
    } else {
      onChange((actualSelected || []).filter(item => item !== feature));
    }
  };

  return (
    <div className="space-y-2">
      <Label>Feature In</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-center space-x-2">
            <Checkbox
              id={feature}
              checked={actualSelected?.includes(feature) || false}
              onCheckedChange={(checked) => handleChange(feature, checked as boolean)}
            />
            <Label htmlFor={feature} className="text-sm font-normal">
              {feature}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureCheckboxes;