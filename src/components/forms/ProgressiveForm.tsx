'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/fields/Input';
import { Textarea } from '@/components/forms/fields/Textarea';
import { CardSelect } from '@/components/forms/fields/CardSelect';
import { FormField } from '@/components/forms/fields/FormField';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { getOnboardingQuestions } from '@/lib/schemas/maintainable.schema';
import { getMaintainableDataSchema } from '@/lib/maintainable-registry';
import { MaintainableTypeType, MaintainableData } from '@/types/maintainable.types';

interface ProgressiveFormProps {
  type: MaintainableTypeType;
  subtype: string;
  onSubmit: (data: MaintainableData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormState {
  [key: string]: any;
}

export function ProgressiveForm({
  type,
  subtype,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProgressiveFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<FormState>({
    type,
    subtype,
    label: generateDefaultLabel(subtype), // Auto-generate default label
  });
  const [questions, setQuestions] = useState<
    Array<{
      field: string;
      schema: any;
      metadata: any;
    }>
  >([]);

  // Load questions on mount
  useEffect(() => {
    try {
      const schema = getMaintainableDataSchema(subtype);
      if (schema) {
        const onboardingQuestions = getOnboardingQuestions(schema);
        setQuestions(onboardingQuestions);
      } else {
        console.warn(`No schema found for subtype: ${subtype}`);
      }
    } catch (error) {
      console.error('Error loading onboarding questions:', error);
    }
  }, [type, subtype]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(formData as MaintainableData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderField = () => {
    if (!currentQuestion) return null;

    const { field, metadata } = currentQuestion;
    const value = getNestedValue(formData, field) || '';

    // Use CardSelect for options, regular inputs for text
    if (metadata.options && metadata.options.length > 0) {
      return (
        <CardSelect
          value={value}
          onChange={newValue => handleFieldChange(field, newValue)}
          options={metadata.options}
          placeholder={metadata.placeholder}
          error={false}
        />
      );
    }

    // Text input handling
    if (metadata.helpText && metadata.helpText.length > 100) {
      return (
        <Textarea
          value={value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleFieldChange(field, e.target.value)
          }
          placeholder={metadata.placeholder}
          error={false}
        />
      );
    }

    return (
      <Input
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleFieldChange(field, e.target.value)
        }
        placeholder={metadata.placeholder}
        error={false}
      />
    );
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion?.metadata.question}</CardTitle>
          {currentQuestion?.metadata.helpText && (
            <CardDescription>{currentQuestion.metadata.helpText}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <FormField label="" error="" required={currentQuestion?.metadata.required}>
            {renderField()}
          </FormField>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={isFirstQuestion ? onCancel : handlePrevious}
          disabled={isLoading}
        >
          {isFirstQuestion ? (
            <>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </>
          )}
        </Button>

        <div className="flex gap-2">
          {currentQuestion?.metadata.skipable && (
            <Button variant="ghost" onClick={handleSkip} disabled={isLoading}>
              Skip
            </Button>
          )}

          {isLastQuestion ? (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                'Creating...'
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Create Maintainable
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={isLoading}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to generate default label based on subtype
function generateDefaultLabel(subtype: string): string {
  const labelMap: Record<string, string> = {
    heat: 'Heat System',
    cooling: 'Cooling System',
    refrigerator: 'Refrigerator',
    dishwasher: 'Dishwasher',
    'washing-machine': 'Washing Machine',
    dryer: 'Dryer',
    oven: 'Oven',
    microwave: 'Microwave',
    roof: 'Roof',
    foundation: 'Foundation',
    electrical: 'Electrical System',
    plumbing: 'Plumbing System',
  };

  return (
    labelMap[subtype] || `${subtype.charAt(0).toUpperCase() + subtype.slice(1).replace(/-/g, ' ')}`
  );
}

// Helper function to get nested object values
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}
