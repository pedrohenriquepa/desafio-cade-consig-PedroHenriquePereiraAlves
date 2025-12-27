'use client';

import { useState } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { useContratos, useUpdateContratoStatus, useDeleteContrato } from '@/hooks/use-contratos';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import Link from 'next/link';
import type { Contrato } from '@/lib/types';
import { Dashboard } from '@/components/dashboard';

const formatCurrency = (value: string | number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value));
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const formatPlano = (plano: string) => {
  const map: Record<string, string> = {
    BASICO: 'Básico',
    PRO: 'Pro',
    ENTERPRISE: 'Enterprise',
  };
  return map[plano] || plano;
};

export default function ContratosPage() {
  const { logout } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null);
  const [curriculoOpen, setCurriculoOpen] = useState(false);

  // Mutations
  const updateStatusMutation = useUpdateContratoStatus();
  const deleteMutation = useDeleteContrato();

  // URL params com nuqs
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState('limit', parseAsInteger.withDefault(20));
  const [nomeCliente, setNomeCliente] = useQueryState('nome_cliente', parseAsString.withDefault(''));
  const [emailCliente, setEmailCliente] = useQueryState('email_cliente', parseAsString.withDefault(''));
  const [tipoPlano, setTipoPlano] = useQueryState('tipo_plano', parseAsString.withDefault(''));
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault(''));

  // Query de contratos
  const { data, isLoading, isError, error, refetch } = useContratos({
    page,
    limit,
    nome_cliente: nomeCliente || undefined,
    email_cliente: emailCliente || undefined,
    tipo_plano: tipoPlano || undefined,
    status: status || undefined,
  });

  const handleClearFilters = () => {
    setNomeCliente('');
    setEmailCliente('');
    setTipoPlano('');
    setStatus('');
    setPage(1);
  };

  const handleToggleStatus = async (contrato: Contrato) => {
    const newStatus = contrato.status === 'ATIVO' ? 'Inativo' : 'Ativo';
    try {
      await updateStatusMutation.mutateAsync({ id: contrato.id_contrato, status: newStatus });
      toast.success(`Status alterado para ${newStatus}`);
    } catch {
      toast.error('Erro ao alterar status');
    }
  };

  const handleDeleteClick = (contrato: Contrato) => {
    setSelectedContrato(contrato);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedContrato) return;
    try {
      await deleteMutation.mutateAsync(selectedContrato.id_contrato);
      toast.success('Contrato excluído com sucesso');
      setDeleteDialogOpen(false);
      setSelectedContrato(null);
    } catch {
      toast.error('Erro ao excluir contrato');
    }
  };

  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f57c00] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-3xl font-bold text-[#1a2035]">Contratos</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/upload">
              <Button className="bg-[#f57c00] hover:bg-[#e65100] text-white">
                📤 Upload CSV
              </Button>
            </Link>
            <Dialog open={curriculoOpen} onOpenChange={setCurriculoOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-[#1a2035] text-[#1a2035] hover:bg-[#1a2035] hover:text-white">
                  📄 Currículo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Currículo - Pedro Henrique Pereira Alves</DialogTitle>
                </DialogHeader>
                <div className="flex-1 h-full min-h-0">
                  <iframe
                    src="/Curriculo-PedroHenriquePereiraAlves.pdf"
                    className="w-full h-[calc(90vh-100px)] rounded-lg border"
                    title="Currículo"
                  />
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={logout} className="border-[#1a2035] text-[#1a2035] hover:bg-[#1a2035] hover:text-white">
              Sair
            </Button>
          </div>
        </div>

        {/* Dashboard */}
        <Dashboard />

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Cliente</Label>
                <Input
                  id="nome"
                  placeholder="Buscar por nome..."
                  value={nomeCliente}
                  onChange={(e) => {
                    setNomeCliente(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Buscar por email..."
                  value={emailCliente}
                  onChange={(e) => {
                    setEmailCliente(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plano">Tipo de Plano</Label>
                <Select
                  value={tipoPlano}
                  onValueChange={(value) => {
                    setTipoPlano(value === 'all' ? '' : value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger id="plano">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Basico">Básico</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => {
                    setStatus(value === 'all' ? '' : value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
              <Button variant="outline" onClick={() => refetch()}>
                Atualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">
                  Erro ao carregar contratos: {(error as Error)?.message || 'Erro desconhecido'}
                </p>
                <Button onClick={() => refetch()}>Tentar novamente</Button>
              </div>
            ) : !data?.items?.length ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum contrato encontrado.</p>
                <Link href="/upload" className="mt-4 inline-block">
                  <Button variant="outline">Fazer upload de contratos</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Valor Mensal</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data Início</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.items.map((contrato) => (
                        <TableRow key={contrato.id_contrato}>
                          <TableCell className="font-medium">
                            {contrato.nome_cliente}
                          </TableCell>
                          <TableCell>{contrato.email_cliente}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {formatPlano(contrato.tipo_plano)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(contrato.valor_mensal)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={contrato.status === 'ATIVO' ? 'default' : 'destructive'}
                            >
                              {contrato.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(contrato.data_inicio)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  ⋮
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleToggleStatus(contrato)}
                                  disabled={updateStatusMutation.isPending}
                                >
                                  {contrato.status === 'ATIVO' ? '🔴 Inativar' : '🟢 Ativar'}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteClick(contrato)}
                                  disabled={deleteMutation.isPending}
                                >
                                  🗑️ Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Paginação */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {((page - 1) * limit) + 1} - {Math.min(page * limit, data.total)} de {data.total} contratos
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={String(limit)}
                      onValueChange={(value) => {
                        setLimit(Number(value));
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Anterior
                    </Button>
                    <span className="text-sm">
                      Página {page} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o contrato de{' '}
              <strong>{selectedContrato?.nome_cliente}</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
