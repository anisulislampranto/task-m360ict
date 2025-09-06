'use client'
import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import JobDetailsStep from './JobDetailsStep';
import SkillsStep from './SkillsStep';
import EmergencyContactStep from './EmergencyContactStep';

import { formSchema } from '@/lib/validation';
import { mockManagers, skillsByDepartment } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import PersonalInfoStep from './PersonalInfoStep';
import ReviewStep from './ReviewStep';

type FormData = z.infer<typeof formSchema>;

export default function OnboardingForm() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formMethods = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            personalInfo: {
                profilePicture: null,
            },
            jobDetails: {
                jobType: 'Full-time',
            },
            skills: {
                primarySkills: [],
                experience: {},
                remoteWorkPreference: 0,
            },
            emergencyContact: {
                relationship: '',
            },
        },
    });

    const { handleSubmit, trigger, formState: { isDirty }, watch, setError } = formMethods;

    const validateEmergencyContactStep = async () => {
        const isValidBasic = await trigger('emergencyContact');
        if (!isValidBasic) return false;

        const dateOfBirth = watch('personalInfo.dateOfBirth');
        if (!dateOfBirth) return true;

        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age >= 21) return true;

        const guardianName = watch('emergencyContact.guardianName');
        const guardianPhone = watch('emergencyContact.guardianPhone');
        const phoneRegex = /^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/;

        const isGuardianNameValid = guardianName && guardianName.trim() !== '';
        const isGuardianPhoneValid = guardianPhone && phoneRegex.test(guardianPhone);

        if (!isGuardianNameValid || !isGuardianPhoneValid) {
            if (!isGuardianNameValid) {
                setError('emergencyContact.guardianName', {
                    type: 'manual',
                    message: 'Guardian name is required for users under 21'
                });
            }

            if (!isGuardianPhoneValid) {
                setError('emergencyContact.guardianPhone', {
                    type: 'manual',
                    message: guardianPhone ?
                        'Guardian phone must be in format +1-123-456-7890' :
                        'Guardian phone is required for users under 21'
                });
            }

            return false;
        }

        return true;
    };


    const nextStep = async () => {
        let isValid = false;

        switch (step) {
            case 1:
                isValid = await trigger('personalInfo');
                break;
            case 2:
                isValid = await trigger('jobDetails');
                break;
            case 3:
                isValid = await trigger('skills');
                break;
            case 4:
                isValid = await validateEmergencyContactStep();
                break;
            default:
                isValid = true;
        }

        if (isValid && step < 5) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        console.log('Form submitted:', data);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        alert('Onboarding form submitted successfully!');
    };

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Employee Onboarding</h1>
                    <p className="mt-2 text-sm text-gray-600">Complete your onboarding in 5 simple steps</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="flex items-center mb-4">
                        {[1, 2, 3, 4, 5].map((stepNum) => (
                            <div key={stepNum} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${stepNum === step
                                        ? 'bg-blue-600 text-white'
                                        : stepNum < step
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-100 text-gray-400'
                                        }`}
                                >
                                    {stepNum}
                                </div>
                                {stepNum < 5 && (
                                    <div
                                        className={`h-1 w-20 mx-2 ${stepNum < step ? 'bg-green-500' : 'bg-gray-200'
                                            }`}
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-center text-sm text-gray-500 mt-2">
                        Step {step} of 5:
                        {step === 1 && ' Personal Information'}
                        {step === 2 && ' Job Details'}
                        {step === 3 && ' Skills & Preferences'}
                        {step === 4 && ' Emergency Contact'}
                        {step === 5 && ' Review & Submit'}
                    </div>
                </div>

                <FormProvider {...formMethods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {step === 1 && <PersonalInfoStep />}
                        {step === 2 && <JobDetailsStep managers={mockManagers} />}
                        {step === 3 && <SkillsStep skillsByDepartment={skillsByDepartment} />}
                        {step === 4 && <EmergencyContactStep />}
                        {step === 5 && <ReviewStep />}

                        <div className="flex justify-between mt-8">
                            <Button
                                type="button"
                                onClick={prevStep}
                                disabled={step === 1}
                                variant="outline"
                            >
                                Previous
                            </Button>

                            {step < 5 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </Button>
                            )}
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}