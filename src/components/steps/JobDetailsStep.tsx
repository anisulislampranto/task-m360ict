import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { JobDetailsStepProps } from '@/lib/types';
import { Combobox } from '../ui/combobox';


export default function JobDetailsStep({ managers }: JobDetailsStepProps) {
    const { control, watch } = useFormContext();
    const department = watch('jobDetails.department');
    const jobType = watch('jobDetails.jobType');

    const filteredManagers = department
        ? managers.filter(manager => manager.department === department)
        : managers;

    const managerOptions = filteredManagers.map(manager => ({
        value: manager.id,
        label: `${manager.name} (${manager.department})`,
    }));

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Job Details</h2>

            <FormField
                control={control}
                name="jobDetails.department"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Engineering">Engineering</SelectItem>
                                <SelectItem value="Marketing">Marketing</SelectItem>
                                <SelectItem value="Sales">Sales</SelectItem>
                                <SelectItem value="HR">HR</SelectItem>
                                <SelectItem value="Finance">Finance</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="jobDetails.positionTitle"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Position Title</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. Software Engineer" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="jobDetails.startDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {field.value ? (
                                            format(new Date(field.value), "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value ? new Date(field.value) : undefined}
                                    onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                                    disabled={(date) => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        return date < today || date > new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="jobDetails.jobType"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Job Type</FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-1"
                            >
                                <FormItem className="flex items-center space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="Full-time" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Full-time</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="Part-time" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Part-time</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="Contract" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Contract</FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="jobDetails.salary"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            {jobType === 'Contract' ? 'Hourly Rate ($)' : 'Annual Salary ($)'}
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder={jobType === 'Contract' ? '50-150' : '30000-200000'}
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="jobDetails.manager"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Manager</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <Combobox
                                    options={managerOptions}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    placeholder="Select manager..."
                                    searchPlaceholder="Search managers..."
                                    emptyMessage="No managers found."
                                />
                            </FormControl>
                            {/* <SelectContent>
                                {filteredManagers.map((manager) => (
                                    <SelectItem key={manager.id} value={manager.id}>
                                        {manager.name} ({manager.department})
                                    </SelectItem>
                                ))}
                            </SelectContent> */}
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}