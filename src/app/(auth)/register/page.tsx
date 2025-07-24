import RegisterForm from "./register-form";

export default function Register() {
  return (
    <div className="flex flex-col justify-center items-center">
      <span className="text-2xl font-bold text-center mb-6">Register</span>
      <RegisterForm />
    </div>
  );
}
