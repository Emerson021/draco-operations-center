
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Mail, Lock, AlertCircle, User } from 'lucide-react';

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuth();

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nome_completo: '',
    numero_placa: '',
    cargo: 'agente' as 'agente' | 'delegado'
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    console.log('Login attempt with:', loginData.email);
    
    try {
      const result = await signIn(loginData.email, loginData.password);
      if (result.error) {
        setError('Erro no login. Verifique suas credenciais.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (signupData.password !== signupData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (signupData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setIsLoading(true);
    
    console.log('Signup attempt with:', signupData.email);
    
    try {
      const result = await signUp(signupData.email, signupData.password, {
        nome_completo: signupData.nome_completo,
        numero_placa: signupData.numero_placa,
        cargo: signupData.cargo
      });
      
      if (result.error) {
        setError('Erro no cadastro. Tente novamente.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
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

        <Card className="draco-card">
          <CardHeader>
            <CardTitle className="text-draco-gold-400">Acesso ao Sistema</CardTitle>
            <CardDescription>Entre com suas credenciais ou crie uma nova conta</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-draco-gray-700">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-draco-gold-500 data-[state=active]:text-draco-black"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-draco-gold-500 data-[state=active]:text-draco-black"
                >
                  Cadastrar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
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
                      placeholder="seu@email.com"
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
                      placeholder="Digite sua senha"
                    />
                  </div>
                  <Button type="submit" className="draco-button w-full" disabled={isLoading}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-nome" className="text-draco-gray-300">
                      <User className="w-4 h-4 inline mr-2" />
                      Nome Completo
                    </Label>
                    <Input
                      id="signup-nome"
                      type="text"
                      value={signupData.nome_completo}
                      onChange={(e) => setSignupData({...signupData, nome_completo: e.target.value})}
                      required
                      className="bg-draco-gray-700 border-draco-gray-600 text-white"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-placa" className="text-draco-gray-300">
                      Número da Placa
                    </Label>
                    <Input
                      id="signup-placa"
                      type="text"
                      value={signupData.numero_placa}
                      onChange={(e) => setSignupData({...signupData, numero_placa: e.target.value})}
                      required
                      className="bg-draco-gray-700 border-draco-gray-600 text-white"
                      placeholder="Ex: AG-001234"
                    />
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
                      placeholder="seu@email.com"
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
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="text-draco-gray-300">
                      Confirmar Senha
                    </Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                      required
                      className="bg-draco-gray-700 border-draco-gray-600 text-white"
                      placeholder="Confirme sua senha"
                    />
                  </div>
                  <Button type="submit" className="draco-button w-full" disabled={isLoading}>
                    {isLoading ? 'Cadastrando...' : 'Criar Conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
              <p className="text-xs text-blue-400">
                <strong>Sistema DRACO:</strong> Crie uma conta para acessar o sistema de investigação criminal.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
