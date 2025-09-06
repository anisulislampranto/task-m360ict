import { z } from 'zod';
import { formSchema } from './validation';

export type FormData = z.infer<typeof formSchema>;

export type PersonalInfoData = z.infer<typeof formSchema>['personalInfo'];
export type JobDetailsData = z.infer<typeof formSchema>['jobDetails'];
export type SkillsData = z.infer<typeof formSchema>['skills'];
export type EmergencyContactData = z.infer<typeof formSchema>['emergencyContact'];
export type ReviewData = z.infer<typeof formSchema>['review'];

export interface JobDetailsStepProps {
    managers: Manager[];
}

export interface SkillsStepProps {
    skillsByDepartment: SkillsByDepartment;
}

export interface Manager {
    id: string;
    name: string;
    department: string;
}

export interface SkillsByDepartment {
    [key: string]: string[];
}

export type StepComponentProps = {
    onNext?: () => void;
    onPrev?: () => void;
    isLastStep?: boolean;
};

export type Relationship = string[];