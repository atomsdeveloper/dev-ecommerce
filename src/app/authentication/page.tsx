// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Components
import SingInForm from "./components/sing-in-form";
import SingUpForm from "./components/sing-up-form";

const Authentication = async () => {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5 p-5">
      <Tabs defaultValue="sing-in" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="sing-in">Entrar</TabsTrigger>
          <TabsTrigger value="sing-up">Criar conta</TabsTrigger>
        </TabsList>
        {/* SING IN */}
        <TabsContent value="sing-in">
          <SingInForm />
        </TabsContent>
        {/* SING UP */}
        <TabsContent value="sing-up">
          <SingUpForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Authentication;
