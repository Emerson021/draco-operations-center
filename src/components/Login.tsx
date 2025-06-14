
import { useState } from 'react';
import { Shield, Eye, EyeOff, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [agentCredentials, setAgentCredentials] = useState({ badge: '', password: '' });
  const [delegadoCredentials, setDelegadoCredentials] = useState({ badge: '', password: '' });

  const handleAgentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Agent login:', agentCredentials);
    // Handle agent login logic
  };

  const handleDelegadoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Delegado login:', delegadoCredentials);
    // Handle delegado login logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-draco-black via-draco-gray-900 to-draco-gray-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="draco-badge w-16 h-16 text-2xl">
              <Shield className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-draco-gold-400 mb-2">
            DRACO LOGIN
          </h1>
          <p className="text-draco-gray-400">
            Sistema de Acesso Restrito
          </p>
        </div>

        {/* Login Form */}
        <Card className="draco-card">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-center text-draco-gold-400">
              Acesso ao Sistema
            </CardTitle>
            <CardDescription className="text-center text-draco-gray-400">
              Selecione seu nível de acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="agent" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-draco-gray-700">
                <TabsTrigger 
                  value="agent" 
                  className="data-[state=active]:bg-draco-gold-500 data-[state=active]:text-draco-black"
                >
                  Agente DRACO
                </TabsTrigger>
                <TabsTrigger 
                  value="delegado"
                  className="data-[state=active]:bg-draco-gold-500 data-[state=active]:text-draco-black"
                >
                  Delegado
                </TabsTrigger>
              </TabsList>

              {/* Agent Login */}
              <TabsContent value="agent" className="space-y-4 mt-6">
                <form onSubmit={handleAgentLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="agent-badge" className="text-draco-gray-300">
                      Número da Placa
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-draco-gray-400" />
                      <Input
                        id="agent-badge"
                        type="text"
                        placeholder="Ex: AG-001234"
                        value={agentCredentials.badge}
                        onChange={(e) => setAgentCredentials({...agentCredentials, badge: e.target.value})}
                        className="pl-10 bg-draco-gray-700 border-draco-gray-600 text-draco-gray-100 placeholder:text-draco-gray-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agent-password" className="text-draco-gray-300">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-draco-gray-400" />
                      <Input
                        id="agent-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={agentCredentials.password}
                        onChange={(e) => setAgentCredentials({...agentCredentials, password: e.target.value})}
                        className="pl-10 pr-10 bg-draco-gray-700 border-draco-gray-600 text-draco-gray-100 placeholder:text-draco-gray-500"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-draco-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-draco-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="draco-button w-full">
                    Acessar como Agente
                  </Button>
                </form>
              </TabsContent>

              {/* Delegado Login */}
              <TabsContent value="delegado" className="space-y-4 mt-6">
                <form onSubmit={handleDelegadoLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="delegado-badge" className="text-draco-gray-300">
                      Número da Placa
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-draco-gray-400" />
                      <Input
                        id="delegado-badge"
                        type="text"
                        placeholder="Ex: DL-001234"
                        value={delegadoCredentials.badge}
                        onChange={(e) => setDelegadoCredentials({...delegadoCredentials, badge: e.target.value})}
                        className="pl-10 bg-draco-gray-700 border-draco-gray-600 text-draco-gray-100 placeholder:text-draco-gray-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delegado-password" className="text-draco-gray-300">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-draco-gray-400" />
                      <Input
                        id="delegado-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={delegadoCredentials.password}
                        onChange={(e) => setDelegadoCredentials({...delegadoCredentials, password: e.target.value})}
                        className="pl-10 pr-10 bg-draco-gray-700 border-draco-gray-600 text-draco-gray-100 placeholder:text-draco-gray-500"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-draco-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-draco-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="draco-button w-full">
                    Acessar como Delegado
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-xs text-draco-gray-500">
                Sistema protegido por criptografia militar
              </p>
              <p className="text-xs text-draco-gray-500 mt-1">
                Acesso monitorado e registrado
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
