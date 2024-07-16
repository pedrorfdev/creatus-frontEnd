import { LucidePowerCircle, PencilIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Http } from "../../api/axios.config";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export interface IUser {
  id: string;
  email: string;
  name: string;
  accessLevel: string;
  password: string;
}

export function Users() {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [user, setUser] = useState<IUser>({} as IUser);

  const [usersList, setUsersList] = useState<IUser[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedUsers, setPaginatedUsers] = useState<IUser[]>([]);

  useEffect(() => {
    setCurrentPage(1);
    getUsers();
  }, []);

  useEffect(() => {
    setPaginatedUsers(paginateUsers());
  }, [usersList, currentPage]);

  const createUser = () => {
    Http.post<IUser>("http://localhost:8080/user", user)
      .then(getUsers)
      .catch((error) => {
        if (error.response) {
          console.log("Erro de resposta:", error.response.data);
          console.log("Status do erro:", error.response.status);
        } else {
          console.log("Erro desconhecido:", error.message);
        }
      })
      .finally(() => {
        setModalIsOpen(false);
        resetUserForm();
        toast.success("Usuário criado com sucesso!");
      });
  };

  const updateUser = () => {
    Http.put<IUser>(`http://localhost:8080/user/${user.id}`, {
      name: user.name,
      email: user.email,
      password: user.password,
      accessLevel: user.accessLevel,
    })
      .then(getUsers)
      .catch((error) => {
        if (error.response) {
          console.log("Erro de resposta:", error.response.data);
          console.log("Status do erro:", error.response.status);
        } else {
          console.log("Erro desconhecido:", error.message);
        }
      })
      .finally(() => {
        setModalIsOpen(false);
        setIsEditMode(false);
        resetUserForm();

        toast.success("Usuário atualizado com sucesso!");
      });
  };

  const getUsers = () => {
    Http.get<IUser[]>("http://localhost:8080/users").then((response) => {
      setUsersList(response.data);
    });
  };

  const handleDelete = (id: string) => {
    //Não existe uma documentação para realizar a deleção de usuários
    Http.delete(`http://localhost:8080/user/${id}`)
      .then(getUsers)
      .catch((error) => {
        console.log("Erro ao deletar:", error.message);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      updateUser();
    } else {
      createUser();
    }
  };

  const openEditModal = (user: IUser) => {
    setUser(user);
    setIsEditMode(true);
    setModalIsOpen(true);
  };

  const viewDetails = (id: string) => {
    navigate(`/user-details/${id}`);
  };

  const resetUserForm = () => {
    setUser({} as IUser);
  };

  const pageSize = 5;
  const totalPages = Math.ceil(usersList.length / pageSize);

  function paginateUsers() {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = usersList.slice(startIndex, endIndex);
    return paginatedUsers;
  }

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  function nextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }
  function previousPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  const logout = () => {
    navigate("/");
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white my-5 rounded-2xl flex flex-col justify-center gap-5 pt-5 container">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl flex-1">Usuários</h1>
          <Dialog
            open={modalIsOpen}
            onOpenChange={(isOpen) => {
              setModalIsOpen(isOpen);
              if (!isOpen) {
                resetUserForm();
                setIsEditMode(false);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setIsEditMode(false);
                  setModalIsOpen(true);
                }}
                className="bg-green-900 text-white font-medium p-1 px-4 rounded-xl hover:bg-green-500"
              >
                Adicionar usuário
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {isEditMode ? "Editar Usuário" : "Novo Usuário"}
                </DialogTitle>
                <DialogDescription className="text-lg">
                  Insira os dados do usuário
                </DialogDescription>
              </DialogHeader>

              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div>
                  <span>{user.id}</span>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={user.email}
                    defaultValue={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="accessLevel">Nível de Acesso</Label>
                  <Select
                    value={user.accessLevel}
                    onValueChange={(value) =>
                      setUser({ ...user, accessLevel: value })
                    }
                    required
                  >
                    <SelectTrigger className="mt-5">
                      <SelectValue placeholder="Nível de acesso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    type="password"
                    name="password"
                    value={user.password}
                    defaultValue={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    required
                  />
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="destructive">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="bg-green-900 hover:bg-green-500"
                  >
                    {isEditMode ? "Atualizar" : "Cadastrar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Button
            onClick={() => logout()}
            variant={"ghost"}
            className="ml-5 bg-neutral-300"
          >
            <LucidePowerCircle />
          </Button>
        </div>

        <div>
          <div className="flex justify-between items-center bg-neutral-100 text-slate-600 text-lg font-medium p-5">
            <div className="flex justify-start flex-1">
              <h1>NOME</h1>
            </div>
            <div className="flex justify-center flex-1">
              <h1>EMAIL</h1>
            </div>
            <div className="flex justify-center flex-1">
              <h1>NÍVEL DE ACESSO</h1>
            </div>
            <div className="flex justify-center w-[4%]"></div>
          </div>

          {paginatedUsers.map((user) => (
            <div
              className="flex justify-between p-5 border-b border-gray-500"
              key={user.id}
            >
              <div
                className="flex flex-1 justify-start cursor-pointer"
                onClick={() => viewDetails(user.id)}
              >
                {" "}
                {user.name}{" "}
              </div>
              <div
                className="flex flex-1 justify-center cursor-pointer"
                onClick={() => viewDetails(user.id)}
              >
                {" "}
                {user.email}{" "}
              </div>
              <div
                className="flex flex-1 justify-center cursor-pointer"
                onClick={() => viewDetails(user.id)}
              >
                {user.accessLevel}
              </div>
              <div className="flex gap-4">
                <PencilIcon
                  className="size-5 text-green-900 cursor-pointer"
                  onClick={() => openEditModal(user)}
                />
                <Trash2
                  className="size-5 text-red-600 cursor-pointer"
                  onClick={() => handleDelete(user.id)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="py-5">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={() => previousPage()} />
                </PaginationItem>
              )}

              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index + 1}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(index + 1)}
                    className={`${
                      currentPage === index + 1 ? "bg-green-800 text-white" : ""
                    }`}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext href="#" onClick={() => nextPage()} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
