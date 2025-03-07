// types.ts
export interface Course {
    id: string;
    course_name: string;
    instructor_name: string;
    start_date: string;
    min_employees: number;
    max_employees: number;
    registeredEmployees: string[];
    status?: "CONFIRMED" | "CANCELLED";
  }

  export interface Registration {
    id: string;
    employee_name: string;
    email: string;
    courseId: string;
  }
