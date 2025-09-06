import { useFormContext, useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { relationships } from '@/lib/mockData';

export default function EmergencyContactStep() {
    const { control } = useFormContext();
    const dateOfBirth = useWatch({ control, name: 'personalInfo.dateOfBirth' });

    const isUnder21 = () => {
        if (!dateOfBirth) return false;

        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age < 21;
    };


    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Emergency Contact</h2>

            <FormField
                control={control}
                name="emergencyContact.contactName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor='contactName'>Contact Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="emergencyContact.relationship"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor='relationship'>Relationship</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select relationship" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {relationships.map((relationship) => (
                                    <SelectItem key={relationship} value={relationship}>
                                        {relationship}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="emergencyContact.phoneNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor='phoneNumber'>Phone Number</FormLabel>
                        <FormControl>
                            <Input placeholder="+1-123-456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {isUnder21() && (
                <>
                    <h3 className="font-medium mt-6">Guardian Contact (Required for under 21)</h3>

                    <FormField
                        control={control}
                        name="emergencyContact.guardianName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='guardianName'>Guardian Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Full name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="emergencyContact.guardianPhone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='guardianPhone'>Guardian Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="+1-123-456-7890" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </>
            )}
        </div>
    );
}