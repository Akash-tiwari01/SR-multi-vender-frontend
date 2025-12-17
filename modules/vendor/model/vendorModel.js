import z from "zod";

export const vendorSchema = z.object({
    name: z.string().min(3, "Full Name is required and must be at least 3 characters."),
    
    phone: z.string()
      .min(10, "Phone number must be at least 10 digits.")
      .max(15, "Phone number is too long."),
      
    
    email: z.string().email("Invalid email format. Please check your address."),
    
    emailVerified: z.literal(true, {
        errorMap: () => ({ message: "Email verification required" }),
      }),
      phoneVerified: z.literal(true, {
        errorMap: () => ({ message: "Phone verification required" }),
      }),
    
      password: z.string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[a-z]/, "Password must contain a lowercase letter.")
      .regex(/[A-Z]/, "Password must contain an uppercase letter.")
      .regex(/[0-9]/, "Password must contain a number."),
  
    vendor: z.object({
      vendor_type: z.enum(['Individual', 'Company'], {
        required_error: "Vendor Type is required.",
        invalid_type_error: "Invalid vendor type selected."
      }),
    }),
  
    termsAccepted: z.boolean({
      required_error: "You must accept the terms and conditions."
    }).refine(val => val === true, { 
      message: "You must accept the terms and conditions to register."
    }),

  });
  