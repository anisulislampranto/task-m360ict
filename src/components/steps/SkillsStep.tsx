import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { SkillsByDepartment } from '@/lib/types';
import { useEffect, useMemo } from 'react';

interface SkillsStepProps {
    skillsByDepartment: SkillsByDepartment;
}

export default function SkillsStep({ skillsByDepartment }: SkillsStepProps) {
    const { control, setValue, watch } = useFormContext();
    const department = watch('jobDetails.department');
    const remotePreference = watch('skills.remoteWorkPreference');
    const rawSelectedSkills = watch('skills.primarySkills');

    const selectedSkills = useMemo(() => {
        return rawSelectedSkills || [];
    }, [rawSelectedSkills]);

    const skills = useMemo(() => {
        return department ? skillsByDepartment[department] : [];
    }, [department, skillsByDepartment]);


    const handleSkillChange = (skill: string, checked: boolean) => {
        if (checked) {
            setValue('skills.primarySkills', [...selectedSkills, skill]);
        } else {
            setValue('skills.primarySkills', selectedSkills.filter((s: string) => s !== skill));
        }
    };

    useEffect(() => {
        if (department && selectedSkills.length > 0) {
            const validSkills = selectedSkills.filter((skill: string) => skills.includes(skill));
            if (validSkills.length !== selectedSkills.length) {
                setValue('skills.primarySkills', validSkills);

                const currentExperience = watch('skills.experience') || {};
                const validExperience = Object.fromEntries(
                    Object.entries(currentExperience).filter(([skill]) => validSkills.includes(skill))
                );
                setValue('skills.experience', validExperience);
            }
        }
    }, [department, skills, selectedSkills, setValue, watch]);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Skills & Preferences</h2>

            <FormField
                control={control}
                name="skills.primarySkills"
                render={({ }) => (
                    <FormItem>
                        <FormLabel>Primary Skills (Select at least 3)</FormLabel>
                        <div className="grid grid-cols-2 gap-4">
                            {skills.map((skill) => (
                                <div key={skill} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={skill}
                                        checked={selectedSkills.includes(skill)}
                                        onCheckedChange={(checked) =>
                                            handleSkillChange(skill, checked as boolean)
                                        }
                                    />
                                    <label
                                        htmlFor={skill}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {skill}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {selectedSkills.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-medium">Years of Experience</h3>
                    {selectedSkills.map((skill: string) => (
                        <FormField
                            key={skill}
                            control={control}
                            name={`skills.experience.${skill}`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor={`skills.experience.${skill}`}>{skill}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="50"
                                            placeholder="Years"
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name="skills.preferredHours.start"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Preferred Start Time</FormLabel>
                            <FormControl>
                                <Input type="time" {...field} value={field.value} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="skills.preferredHours.end"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Preferred End Time</FormLabel>
                            <FormControl>
                                <Input type="time" {...field} value={field.value} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={control}
                name="skills.remoteWorkPreference"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Remote Work Preference: {field.value}%</FormLabel>
                        <FormControl>
                            <Slider
                                min={0}
                                max={100}
                                step={1}
                                defaultValue={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {remotePreference > 50 && (
                <FormField
                    control={control}
                    name="skills.managerApproval"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Manager Approved Remote Work</FormLabel>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
            )}

            <FormField
                control={control}
                name="skills.extraNotes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Extra Notes (Optional)</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Any additional information..."
                                className="resize-none"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}