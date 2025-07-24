import LoginForm from "./login-form";

export default function Login() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">Login</h1>
      <LoginForm />
    </div>
  );
}
