import LoginComponnent from "@/components/auth/LoginComponnent";

/**
 * The top-level Page component for vendor registration.
 * Supports SRP: Handles routing and renders the main client component.
 * @returns {JSX.Element}
 */
export default function VendorRegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* The interactive form is encapsulated within the Client Component */}
        <LoginComponnent/>
      </div>
    </div>
  );
}