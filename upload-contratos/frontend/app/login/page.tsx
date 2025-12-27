'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useState } from 'react';
import { AxiosError } from 'axios';

const loginSchema = z.object({
  usuario: z.string().min(1, 'Usuário é obrigatório'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || 'Erro ao realizar login';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a2035] to-[#2d3a5c] px-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-16 h-16 bg-[#f57c00] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <CardTitle className="text-2xl font-bold text-[#1a2035]">
            Cadeconsig
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usuario" className="text-[#1a2035]">Usuário</Label>
              <Input
                id="usuario"
                type="text"
                placeholder="Digite seu usuário"
                className="border-[#dee2e6] focus:border-[#f57c00] focus:ring-[#f57c00]"
                {...register('usuario')}
                disabled={isLoading}
              />
              {errors.usuario && (
                <p className="text-sm text-red-500">{errors.usuario.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha" className="text-[#1a2035]">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                className="border-[#dee2e6] focus:border-[#f57c00] focus:ring-[#f57c00]"
                {...register('senha')}
                disabled={isLoading}
              />
              {errors.senha && (
                <p className="text-sm text-red-500">{errors.senha.message}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#f57c00] hover:bg-[#e65100] text-white font-semibold py-5" 
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Usuário padrão: <strong>admin</strong> | Senha: <strong>admin123</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
