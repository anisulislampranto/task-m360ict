# Employee Onboarding Form

A multi-step employee onboarding form built with **Next.js**, **React Hook Form**, **Zod validation**, and **Tailwind CSS**.

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation & Setup
Clone and install dependencies:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build

# Start production server
npm start


Open your browser:
Navigate to http://localhost:3000 to view the application.


## 🧠 How Complex Logic Was Handled

### 1. Multi-Step Form Management
**Approach:** Used React Hook Form with FormProvider to maintain form state across multiple steps while keeping each step as an independent component.

**Implementation:**
- Created a parent form component managing current step state
- Used `useFormContext()` to share form methods across steps
- Implemented step validation before navigation
- Progress tracking with visual indicators

### 2. Conditional Field Validation
**Approach:** Zod schema validation with conditional rules and custom refinements.

**Examples:**
```typescript
// Salary validation based on job type
.superRefine((data, ctx) => {
  if (data.jobType === 'Full-time') {
    if (data.salary < 30000 || data.salary > 200000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['salary'],
        message: "Full-time salary must be between $30,000 and $200,000",
      });
    }
  }
})

// Weekend validation for HR/Finance
if (['HR', 'Finance'].includes(data.department)) {
  const startDate = new Date(data.startDate);
  if (startDate.getDay() === 5 || startDate.getDay() === 6) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['startDate'],
      message: "Start date cannot be on a weekend for HR and Finance departments",
    });
  }
}

### 3. Dynamic Field Dependencies
**Approach:** Real-time field watching and conditional rendering.

**Examples:**
- **Department → Manager Filtering:** Managers list updates based on selected department
- **Job Type → Salary Label:** Changes between "Hourly Rate" and "Annual Salary"
- **Age → Guardian Fields:** Shows additional fields if user is under 21
- **Remote Preference → Manager Approval:** Requires checkbox if remote work > 50%

### 4. Cross-Step Data Validation
**Approach:** Used `useWatch` to access values from other steps for validation.

**Example:** Emergency contact step checks personal info date of birth to determine if guardian fields are required.

### 5. File Upload Validation
**Approach:** Client-side validation with immediate feedback.

**Example:**
```typescript
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] || null;
  
  // Validate file type
  if (file && !['image/jpeg', 'image/png'].includes(file.type)) {
    setError('File must be JPG or PNG');
    return;
  }
  
  // Validate file size (2MB max)
  if (file && file.size > 2 * 1024 * 1024) {
    setError('File size must be less than 2MB');
    return;
  }
  
  setValue('personalInfo.profilePicture', file, { shouldValidate: true });
};

### 6. Searchable Combobox
**Approach:** Created a custom searchable dropdown using shadcn/ui Command component.

**Features:**
- Real-time filtering of options
- Keyboard navigation support
- Department-based filtering
- Accessible design patterns


### 7. Date Validation with Timezone Handling
**Approach:** Proper date formatting to avoid timezone issues.

**Example:**
```typescript
const formatDateToYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


## 🎯 Business Logic Implementation

### Department-Specific Rules
- **HR & Finance:** Cannot have weekend start dates
- **All Departments:** Manager list filters based on department
- **Skills:** Skills list changes based on department

### Job Type Rules
- **Full-time:** Salary validation ($30,000 - $200,000)
- **Contract:** Hourly rate validation ($50 - $150)
- **All Types:** Different UI labels and validation messages

### Age-Based Logic
- **Under 21:** Requires guardian contact information
- **18+:** Minimum age validation for all users
- **Date of Birth:** Real-time age calculation

### Remote Work Rules
- **>50% Remote:** Requires manager approval checkbox
- **Slider Input:** Visual percentage indicator
- **Conditional Validation:** Only validates approval when needed


## 🧩 Assumptions Made

### Data Structure Assumptions
- **Managers Data:** Pre-defined list with department associations
- **Skills Data:** Categorized by department with predefined lists
- **Relationships:** Fixed set of emergency contact relationships

### Technical Assumptions
- **File Upload:** Client-side validation only (no backend processing)
- **Date Handling:** Browser's local timezone for age calculations
- **Form State:** Local state management (no persistence to databases)
- **Validation:** Client-side validation sufficient (supplemented by Zod schemas)

### User Experience Assumptions
- **Progress Saving:** Users complete the form in one session
- **Department Selection:** Users know which department they're joining
- **Manager Selection:** Users know their manager's name or can search for it
- **Skill Assessment:** Users can accurately self-assess their skill levels

### Business Rule Assumptions
- **Weekend Definition:** Friday and Saturday are considered weekends
- **Age Calculation:** Based on birth date to current date comparison
- **Salary Ranges:** Based on industry standards for the specified regions
- **Remote Work Policy:** Manager approval required for >50% remote work

## 🛠️ Technical Decisions

### Why React Hook Form + Zod?
- **Type Safety:** Full TypeScript integration
- **Performance:** Minimal re-renders with uncontrolled components
- **Validation:** Comprehensive validation with custom error messages
- **Flexibility:** Easy integration with custom UI components

### Why shadcn/ui?
- **Accessibility:** Built with ARIA compliance
- **Customizability:** Easy to style and modify
- **Consistency:** Unified design system
- **Modern:** Uses latest React patterns and Radix UI

### State Management
- **Local State:** For UI state (current step, dropdowns open/closed)
- **React Hook Form:** For form state and validation
- **No Redux/Zustand:** Form complexity manageable with RHF alone


## 📦 Project Structure
src/
├── components/
│   ├── steps/                 # Form step components
│   │   ├── PersonalInfoStep.tsx
│   │   ├── JobDetailsStep.tsx
│   │   ├── SkillsStep.tsx
│   │   ├── EmergencyContactStep.tsx
│   │   └── ReviewStep.tsx
│   └── ui/                    # Reusable UI components
│       ├── combobox.tsx       # Searchable dropdown
│       └── (other shadcn components)
├── lib/
│   ├── validation.ts          # Zod validation schemas
│   ├── mockData.ts            # Sample data
│   └── utils.ts               # Utility functions
└── app/
    └── page.tsx               # Main application component


## 🚨 Potential Improvements

- **Backend Integration:** Connect to actual HR systems
- **File Upload:** Implement cloud storage for profile pictures
- **Persistence:** Save form progress to database
- **Internationalization:** Support multiple languages
- **Accessibility:** Enhanced screen reader support
- **Testing:** Add comprehensive unit and integration tests
- **Analytics:** Track form abandonment and completion rates


This implementation provides a robust, user-friendly onboarding experience with comprehensive validation and conditional logic while maintaining code quality and developer experience.
