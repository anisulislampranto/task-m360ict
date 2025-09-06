import { useFormContext, useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { mockManagers } from '@/lib/mockData';

export default function ReviewStep() {
    const { control } = useFormContext();

    const personalInfo = useWatch({ control, name: 'personalInfo' });
    const jobDetails = useWatch({ control, name: 'jobDetails' });
    const skills = useWatch({ control, name: 'skills' });
    const emergencyContact = useWatch({ control, name: 'emergencyContact' });

    const getManagerName = (id: string) => {
        const manager = mockManagers.find(m => m.id === id);
        return manager ? `${manager.name} (${manager.department})` : id;
    };

    const formatSalary = (jobType: string, salary: number) => {
        if (jobType === 'Contract') {
            return `$${salary}/hour`;
        }
        return `$${salary.toLocaleString()}/year`;
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Review & Submit</h2>

            <div className="space-y-4">
                <h3 className="font-medium border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{personalInfo?.fullName || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{personalInfo?.email || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                        <p className="font-medium">{personalInfo?.phoneNumber || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Date of Birth</p>
                        <p className="font-medium">
                            {personalInfo?.dateOfBirth ? format(new Date(personalInfo.dateOfBirth), 'PPP') : 'Not provided'}
                        </p>
                    </div>
                    {personalInfo?.profilePicture && (
                        <div className="md:col-span-2">
                            <p className="text-sm text-muted-foreground">Profile Picture</p>
                            <p className="font-medium">{personalInfo.profilePicture.name}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-medium border-b pb-2">Job Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p className="font-medium">{jobDetails?.department || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Position Title</p>
                        <p className="font-medium">{jobDetails?.positionTitle || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="font-medium">
                            {jobDetails?.startDate ? format(new Date(jobDetails.startDate), 'PPP') : 'Not provided'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Job Type</p>
                        <p className="font-medium">{jobDetails?.jobType || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {jobDetails?.jobType === 'Contract' ? 'Hourly Rate' : 'Annual Salary'}
                        </p>
                        <p className="font-medium">
                            {jobDetails?.salary ? formatSalary(jobDetails.jobType, jobDetails.salary) : 'Not provided'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Manager</p>
                        <p className="font-medium">
                            {jobDetails?.manager ? getManagerName(jobDetails.manager) : 'Not provided'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-medium border-b pb-2">Skills & Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skills?.primarySkills && skills.primarySkills.length > 0 && (
                        <div className="md:col-span-2">
                            <p className="text-sm text-muted-foreground">Primary Skills</p>
                            <div className="mt-2 space-y-2">
                                {skills.primarySkills.map((skill: string) => (
                                    <div key={skill} className="flex justify-between items-center">
                                        <span className="font-medium">{skill}</span>
                                        {skills.experience?.[skill] && (
                                            <span className="text-sm text-muted-foreground">
                                                {skills.experience[skill]} year{skills.experience[skill] !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="text-sm text-muted-foreground">Preferred Hours</p>
                        <p className="font-medium">
                            {skills?.preferredHours?.start && skills.preferredHours.end
                                ? `${skills.preferredHours.start} - ${skills.preferredHours.end}`
                                : 'Not provided'
                            }
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Remote Work Preference</p>
                        <p className="font-medium">
                            {skills?.remoteWorkPreference !== undefined
                                ? `${skills.remoteWorkPreference}%`
                                : 'Not provided'
                            }
                        </p>
                    </div>

                    {skills?.remoteWorkPreference > 50 && (
                        <div>
                            <p className="text-sm text-muted-foreground">Manager Approval</p>
                            <p className="font-medium">{skills?.managerApproval ? 'Approved' : 'Not Approved'}</p>
                        </div>
                    )}

                    {skills?.extraNotes && (
                        <div className="md:col-span-2">
                            <p className="text-sm text-muted-foreground">Extra Notes</p>
                            <p className="font-medium mt-1 p-3 bg-gray-50 rounded-md">
                                {skills.extraNotes}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-medium border-b pb-2">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Contact Name</p>
                        <p className="font-medium">{emergencyContact?.contactName || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Relationship</p>
                        <p className="font-medium">{emergencyContact?.relationship || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                        <p className="font-medium">{emergencyContact?.phoneNumber || 'Not provided'}</p>
                    </div>

                    {emergencyContact?.guardianName && (
                        <div className="md:col-span-2 border-t pt-4 mt-4">
                            <h4 className="font-medium text-sm mb-2">Guardian Information (Under 21)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Guardian Name</p>
                                    <p className="font-medium">{emergencyContact.guardianName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Guardian Phone</p>
                                    <p className="font-medium">{emergencyContact.guardianPhone}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <FormField
                control={control}
                name="review.confirmation"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-8 p-4 border rounded-md bg-blue-50">
                        <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-1"
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel className="font-semibold text-blue-900">
                                I confirm all information is correct
                            </FormLabel>
                            <p className="text-sm text-blue-700">
                                Please review all the information above before submitting. Once submitted, changes may require administrative approval.
                            </p>
                        </div>
                    </FormItem>
                )}
            />
        </div>
    );
}