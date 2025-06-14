
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Shield, User, Mail, Lock, Badge } from 'lucide-react';

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    numero_placa: '',
    nome_completo: '',
    cargo: 'agente' as 'agente' | 'delegado'
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await signIn(loginData.email, loginData.password);
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      alert('Senhas não coincidem');
      return;
    }

    setIsLoading(true);
    
    await signUp(signupData.email, signupData.password, {
      numero_placa: signupData.numero_placa,
      nome_completo: signupData.nome_completo,
      cargo: signupData.cargo
    });
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-draco-black p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-draco-gold-400 mr-2" />
            <h1 className="text-3xl font-bold text-draco-gold-400">DRACO</h1>
          </div>
          <p className="text-draco-gray-300">Sistema de Investigação Criminal</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Cadastro</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="draco-card">
              <CardHeader>
                <CardTitle className="text-draco-gold-400">Fazer Login</CardTitle>
                <CardDescription>Entre com suas credenciais</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-draco-gray-300">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      required
                      className="bg-draco-gray-700 border-draco-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-draco-gray-300">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Senha
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      required
                      className="bg-draco-gray-700 border-draco-gray-600 text-white"
                    />
                  </div>
                  <Button type="submit" className="draco-button w-full" disabled={isLoading}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="draco-card">
              <CardHeader>
                <CardTitle className="text-draco-gold-400">Criar Conta</CardTitle>
                <CardDescription>Registre-se no sistema DRACO</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-draco-gray-300">
                      <User className="w-4 h-4 inline mr-2" />
                      Nome Completo
                    </Label>
                    <Input
                      id="nome"
                      value={signupData.nome_completo}
                      onChange={(e) => setSignupData({...signupData, nome_completo: e.target.value})}
                      required
                      className="bg-draco-gray-700 border-draco-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="placa" className="text-draco-gray-300">
                      <Badge className="w-4 h-4 inline mr-2" />
                      Número da Placa
                    </Label>
                    <Input
                      id="placa"
                      value={signupData.numero_placa}
                      onChange={(e) => setSignupData({...signupData, numero_placa: e.target.value})}
                      required
                      className="bg-draco-gray-700 border-draco-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-draco-gray-300">Cargo</Label>
                    <Select 
                      value={signupData.cargo} 
                      onValueChange={(value: 'agente' | 'delegado') => 
                        setSignupData({...signupData, cargo: value})
                      }
                    >
                      <SelectTrigger className="bg-draco-gray-700 border-draco-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agente">Agente</SelectItem>
                        <SelectItem value="delegado">Delegado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-draco-gray-300">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      required
                      className="bg-draco-gray-700 border-draco-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-draco-gray-300">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Senha
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      required
                      className="bg-draco-gray-700 border-draco-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-draco-gray-300">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Confirmar Senha
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                      required
                      className="bg-draco-gray-700 border-draco-gray-600 text-white"
                    />
                  </div>
                  <Button type="submit" className="draco-button w-full" disabled={isLoading}>
                    {isLoading ? 'Criando conta...' : 'Criar Conta'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
