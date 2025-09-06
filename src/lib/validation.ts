import { z } from "zod";

export const phoneRegex = /^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/;

export const personalInfoSchema = z.object({
    fullName: z.string()
        .min(1, "Full name is required")
        .refine((name) => name.trim().split(/\s+/).length >= 2, {
            message: "Full name must contain at least 2 words",
        }),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().regex(phoneRegex, "Phone number must be in format +1-123-456-7890"),
    dateOfBirth: z.string().min(1, "Date of birth is required")
        .refine((dob) => {
            const birthDate = new Date(dob);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            return age > 18 || (age === 18 && monthDiff >= 0);
        }, "Must be at least 18 years old"),
    profilePicture: z.instanceof(File).nullable().optional()
        .refine((file) => !file || (file.size <= 2 * 1024 * 1024), "File size must be less than 2MB")
        .refine((file) => !file || ['image/jpeg', 'image/png'].includes(file.type), "Only JPG and PNG files are allowed"),
});

export const jobDetailsSchema = z.object({
    department: z.enum(['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'], {
        message: "Invalid department",
    }),
    positionTitle: z.string().min(3, "Position title must be at least 3 characters"),
    startDate: z.string().min(1, "Start date is required")
        .refine((date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)), {
            message: "Start date cannot be in the past",
        })
        .refine((date) => {
            const selectedDate = new Date(date);
            const today = new Date();
            const diffTime = Math.abs(selectedDate.getTime() - today.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 90;
        }, "Start date cannot be more than 90 days in the future"),
    jobType: z.enum(['Full-time', 'Part-time', 'Contract']),
    salary: z.number().min(1, "Salary is required"),
    manager: z.string().min(1, "Manager is required"),
}).superRefine((data, ctx) => {
    if (['HR', 'Finance'].includes(data.department)) {
        const startDate = new Date(data.startDate);
        const dayOfWeek = startDate.getDay();
        if (dayOfWeek === 5 || dayOfWeek === 6) { // Friday or Saturday
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['startDate'],
                message: "Start date cannot be on a weekend for HR and Finance departments",
            });
        }
    }

    // Salary validation based on job type
    if (data.jobType === 'Full-time') {
        if (data.salary < 30000 || data.salary > 200000) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['salary'],
                message: "Full-time salary must be between $30,000 and $200,000",
            });
        }
    } else if (data.jobType === 'Contract') {
        if (data.salary < 50 || data.salary > 150) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['salary'],
                message: "Contract hourly rate must be between $50 and $150",
            });
        }
    }
});

export const skillsSchema = z.object({
    primarySkills: z.array(z.string()).min(3, "Select at least 3 primary skills"),
    experience: z.record(z.string(), z.number().min(0).max(50)),
    preferredHours: z.object({
        start: z.string().min(1, "Start time is required"),
        end: z.string().min(1, "End time is required"),
    }).superRefine((data, ctx) => {
        const [startH, startM] = data.start.split(':').map(Number);
        const [endH, endM] = data.end.split(':').map(Number);

        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        if (endMinutes <= startMinutes) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['end'],
                message: "End time must be after start time",
            });
        }
    }),

    remoteWorkPreference: z.number().min(0).max(100),
    managerApproval: z.boolean().optional(),
    extraNotes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
}).superRefine((data, ctx) => {
    if (data.remoteWorkPreference > 50 && !data.managerApproval) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['managerApproval'],
            message: "Manager approval is required for remote work preference above 50%",
        });
    }
});

export const emergencyContactSchema = z.object({
    contactName: z.string().min(1, "Contact name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    phoneNumber: z.string().regex(phoneRegex, "Phone number must be in format +1-123-456-7890"),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),
});

export const reviewSchema = z.object({
    confirmation: z.boolean().refine(val => val === true, {
        message: "You must confirm that all information is correct",
    }),
});

export const formSchema = z.object({
    personalInfo: personalInfoSchema,
    jobDetails: jobDetailsSchema,
    skills: skillsSchema,
    emergencyContact: emergencyContactSchema,
    review: reviewSchema.optional(),
});