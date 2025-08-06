// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Components authentication
import SignInForm from "./components/sign-in-form";
import SignUpForm from "./components/sign-up-form";

// Components Common
import Header from "../../components/common/header";

const Authentication = async () => {
  return (
    <>
      <Header />
      <div className="flex w-full flex-col gap-5 p-5">
        <Tabs defaultValue="sign-in" className="w-full">
          <TabsList>
            <TabsTrigger value="sign-in">Entrar</TabsTrigger>
            <TabsTrigger value="sign-up">Criar conta</TabsTrigger>
          </TabsList>
          {/* SIGN IN */}
          <TabsContent value="sign-in" className="w-full">
            <SignInForm />
          </TabsContent>
          {/* SIGN UP */}
          <TabsContent value="sign-up" className="w-full">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Authentication;
