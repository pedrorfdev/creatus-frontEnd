import { useNavigate } from "react-router-dom";
import forma_login from "../../assets/forma-login.svg";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export function Login() {
  const navigate = useNavigate();

  function login() {
    navigate("/users");
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-green-800 from-0% to-green-300 to-100%">
      <div className="h-full">
        <img src={forma_login} alt="" className="h-full" />
      </div>

      <div className=" flex flex-1 items-center justify-center bg-white">
        <div className="flex flex-col gap-5 w-3/6">
          <h1 className="text-neutral-950 text-4xl font-semibold text-center">
            Bem vindo
          </h1>

          <form className="flex flex-col gap-5" onSubmit={login}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                className="p-2 border-2 border-slate-400 rounded-md"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password">Senha</label>
              <Input
                type="password"
                name="password"
                placeholder="Senha"
                className="p-2 border-2 border-slate-400 rounded-md"
                required
              />
            </div>
            <Button
              //onClick={login}
              className="bg-green-800 rounded-md p-2 text-white hover:bg-green-700 transition-all"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
