'use client';

import { useEstatisticas } from '@/hooks/use-contratos';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export function Dashboard() {
  const { data: stats, isLoading } = useEstatisticas();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 mb-6">
      {/* Primeira linha - Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Clientes */}
        <Card className="bg-gradient-to-br from-[#1a2035] to-[#2d3a5c] text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total de Clientes</p>
                <p className="text-3xl font-bold">{stats.totalClientes}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contratos Ativos */}
        <Card className="bg-gradient-to-br from-[#28a745] to-[#20c997] text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Contratos Ativos</p>
                <p className="text-3xl font-bold">{stats.contratosAtivos}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contratos Inativos */}
        <Card className="bg-gradient-to-br from-[#dc3545] to-[#c82333] text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Contratos Inativos</p>
                <p className="text-3xl font-bold">{stats.contratosInativos}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receita Mensal */}
        <Card className="bg-gradient-to-br from-[#f57c00] to-[#ff9800] text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Receita Mensal</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.valorMensalAtivos)}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segunda linha - Planos e Valores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Plano Básico */}
        <Card className="border-l-4 border-l-[#6c757d] shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#6c757d]/10 rounded-lg flex items-center justify-center">
                <span className="text-lg">📋</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Plano Básico</p>
                <p className="text-xl font-bold text-[#1a2035]">{stats.porPlano.basico}</p>
                <p className="text-xs text-[#28a745]">{formatCurrency(stats.valorPorPlano.basico)}/mês</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plano Pro */}
        <Card className="border-l-4 border-l-[#17a2b8] shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#17a2b8]/10 rounded-lg flex items-center justify-center">
                <span className="text-lg">⭐</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Plano Pro</p>
                <p className="text-xl font-bold text-[#1a2035]">{stats.porPlano.pro}</p>
                <p className="text-xs text-[#28a745]">{formatCurrency(stats.valorPorPlano.pro)}/mês</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plano Enterprise */}
        <Card className="border-l-4 border-l-[#6f42c1] shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#6f42c1]/10 rounded-lg flex items-center justify-center">
                <span className="text-lg">🚀</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Plano Enterprise</p>
                <p className="text-xl font-bold text-[#1a2035]">{stats.porPlano.enterprise}</p>
                <p className="text-xs text-[#28a745]">{formatCurrency(stats.valorPorPlano.enterprise)}/mês</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receita Total */}
        <Card className="border-l-4 border-l-[#28a745] shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#28a745]/10 rounded-lg flex items-center justify-center">
                <span className="text-lg">💰</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Receita (Ativos)</p>
                <p className="text-lg font-bold text-[#28a745]">{formatCurrency(stats.valorMensalAtivos)}</p>
                <p className="text-xs text-muted-foreground">por mês</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Perda Mensal */}
        <Card className="border-l-4 border-l-[#dc3545] shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#dc3545]/10 rounded-lg flex items-center justify-center">
                <span className="text-lg">📉</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Perda (Inativos)</p>
                <p className="text-lg font-bold text-[#dc3545]">{formatCurrency(stats.valorMensalInativos)}</p>
                <p className="text-xs text-muted-foreground">por mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
