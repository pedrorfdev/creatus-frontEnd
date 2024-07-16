import { LucidePowerCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Http } from "../../api/axios.config";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { IUser } from "../users";

export function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState<IUser>();
  const navigate = useNavigate();

  useEffect(() => {
    Http.get(`/user/${id}`).then((response) => setUser(response.data));
  }, []);

  const logout = () => {
    navigate("/");
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white m-5 py-10 rounded-2xl flex flex-col justify-between container">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl flex-1 uppercase">
            {user?.name}
          </h1>
          <Button
            onClick={() => navigate("/users")}
            className="bg-green-900 text-white font-medium p-1 px-4 rounded-xl hover:bg-green-500"
          >
            Voltar para a tabela
          </Button>
          <Button
            onClick={() => logout()}
            variant={"ghost"}
            className="ml-5 bg-neutral-300"
          >
            <LucidePowerCircle />
          </Button>
        </div>

        <div>
          <div>
            <h2 className="text-xl font-medium py-10">Informações</h2>
          </div>

          <div>
            <form className="flex items-center flex-wrap gap-10">
              <div className="w-2/5 flex flex-col gap-4">
                <Label htmlFor="name">Nome</Label>
                <Input type="text" name="name" value={user?.name} readOnly />
              </div>

              <div className="w-2/5 flex flex-col gap-4">
                <Label htmlFor="email">Email</Label>
                <Input type="email" name="email" value={user?.email} readOnly />
              </div>

              <div className="w-2/5 flex flex-col gap-4">
                <Label htmlFor="accessLevel">Nível de Acesso</Label>
                <Input
                  type="text"
                  value={user?.accessLevel}
                  name="accessLevel"
                  readOnly
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
