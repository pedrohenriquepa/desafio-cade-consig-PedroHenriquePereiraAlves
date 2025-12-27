'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadCsv, usePreviewCsv } from '@/hooks/use-contratos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import Link from 'next/link';
import type { UploadPreviewResponse } from '@/lib/types';

interface ApiErrorResponse {
  message: string;
  errors?: string[];
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState<UploadPreviewResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'novos' | 'existentes' | 'atualizacoes'>('novos');
  const router = useRouter();
  const uploadMutation = useUploadCsv();
  const previewMutation = usePreviewCsv();

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error('Por favor, selecione um arquivo CSV');
        return;
      }
      setFile(selectedFile);
      setPreviewData(null);
    }
  }, []);

  const handlePreview = async () => {
    if (!file) {
      toast.error('Por favor, selecione um arquivo CSV');
      return;
    }

    try {
      const result = await previewMutation.mutateAsync(file);
      setPreviewData(result);
      setShowPreviewModal(true);
      setActiveTab('novos');
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const data = axiosError.response?.data;
      
      if (data?.errors && data.errors.length > 0) {
        toast.error(
          <div className="space-y-1">
            <p className="font-semibold">{data.message}</p>
            <ul className="list-disc pl-4 text-sm">
              {data.errors.slice(0, 5).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
              {data.errors.length > 5 && (
                <li>... e mais {data.errors.length - 5} erros</li>
              )}
            </ul>
          </div>
        );
      } else {
        toast.error(data?.message || 'Erro ao analisar arquivo');
      }
    }
  };

  const handleConfirmUpload = async () => {
    if (!file) return;

    try {
      const result = await uploadMutation.mutateAsync(file);
      setShowPreviewModal(false);
      
      const messages: string[] = [];
      if (result.inserted > 0) messages.push(`${result.inserted} novos registros inseridos`);
      if (result.updated > 0) messages.push(`${result.updated} registros atualizados`);
      if (result.ignored > 0) messages.push(`${result.ignored} registros ignorados (já existentes)`);
      
      toast.success(
        <div className="space-y-1">
          <p className="font-semibold">Upload realizado com sucesso!</p>
          <ul className="list-disc pl-4 text-sm">
            {messages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      );
      
      setFile(null);
      router.push('/contratos');
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const data = axiosError.response?.data;
      toast.error(data?.message || 'Erro ao realizar upload');
    }
  };

  const getActiveList = () => {
    if (!previewData) return [];
    switch (activeTab) {
      case 'novos':
        return previewData.detalhes.novos;
      case 'existentes':
        return previewData.detalhes.existentes;
      case 'atualizacoes':
        return previewData.detalhes.atualizacoes;
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/contratos">
            <Button variant="outline" className="border-[#1a2035] text-[#1a2035] hover:bg-[#1a2035] hover:text-white">
              ← Voltar para Contratos
            </Button>
          </Link>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#1a2035] to-[#2d3a5c] text-white rounded-t-xl">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📤</span> Upload de Contratos
            </CardTitle>
            <CardDescription>
              Faça o upload de um arquivo CSV com até 100 contratos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="csv-file">Arquivo CSV</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={uploadMutation.isPending || previewMutation.isPending}
              />
              {file && (
                <p className="text-sm text-muted-foreground">
                  Arquivo selecionado: {file.name}
                </p>
              )}
            </div>

            <div className="bg-[#1a2035]/5 rounded-lg p-4 border border-[#1a2035]/10">
              <h3 className="font-medium mb-2 text-[#1a2035]">📋 Formato esperado do CSV:</h3>
              <p className="text-sm text-muted-foreground">
                O arquivo deve conter as colunas: <code className="bg-[#f57c00]/10 text-[#f57c00] px-1 rounded">nome</code>, <code className="bg-[#f57c00]/10 text-[#f57c00] px-1 rounded">email</code>, <code className="bg-[#f57c00]/10 text-[#f57c00] px-1 rounded">plano</code>, <code className="bg-[#f57c00]/10 text-[#f57c00] px-1 rounded">valor</code>, <code className="bg-[#f57c00]/10 text-[#f57c00] px-1 rounded">status</code>, <code className="bg-[#f57c00]/10 text-[#f57c00] px-1 rounded">data_inicio</code>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                • Planos aceitos: Basico, Pro, Enterprise
              </p>
              <p className="text-sm text-muted-foreground">
                • Status aceitos: Ativo, Inativo
              </p>
              <p className="text-sm text-muted-foreground">
                • Data no formato ISO 8601 (ex: 2024-01-15)
              </p>
            </div>

            <div className="bg-[#17a2b8]/10 rounded-lg p-4 border border-[#17a2b8]/20">
              <h3 className="font-medium mb-2 text-[#17a2b8]">🔄 Tratamento de duplicados:</h3>
              <ul className="text-sm text-[#1a2035]/70 space-y-1">
                <li>• Clientes com email já cadastrado serão ignorados</li>
                <li>• Clientes inativos que estejam ativos na planilha serão reativados</li>
                <li>• Você verá um resumo antes de confirmar o upload</li>
              </ul>
            </div>

            <Button 
              onClick={handlePreview} 
              className="w-full bg-[#f57c00] hover:bg-[#e65100] text-white font-semibold py-5"
              disabled={!file || uploadMutation.isPending || previewMutation.isPending}
            >
              {previewMutation.isPending ? 'Analisando...' : '🚀 Analisar e Fazer Upload'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Preview */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Resumo do Upload</DialogTitle>
            <DialogDescription>
              Revise os dados antes de confirmar o upload
            </DialogDescription>
          </DialogHeader>

          {previewData && (
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Cards de resumo */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Card 
                  className={`cursor-pointer transition-all ${activeTab === 'novos' ? 'ring-2 ring-green-500' : ''}`}
                  onClick={() => setActiveTab('novos')}
                >
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{previewData.novos}</p>
                    <p className="text-sm text-muted-foreground">Novos registros</p>
                  </CardContent>
                </Card>
                <Card 
                  className={`cursor-pointer transition-all ${activeTab === 'existentes' ? 'ring-2 ring-yellow-500' : ''}`}
                  onClick={() => setActiveTab('existentes')}
                >
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-600">{previewData.existentes}</p>
                    <p className="text-sm text-muted-foreground">Já existentes</p>
                  </CardContent>
                </Card>
                <Card 
                  className={`cursor-pointer transition-all ${activeTab === 'atualizacoes' ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setActiveTab('atualizacoes')}
                >
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{previewData.atualizacoes}</p>
                    <p className="text-sm text-muted-foreground">Serão atualizados</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tabela de detalhes */}
              <div className="flex-1 overflow-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getActiveList().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                          Nenhum registro nesta categoria
                        </TableCell>
                      </TableRow>
                    ) : (
                      getActiveList().map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.nome}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>
                            {activeTab === 'novos' && (
                              <Badge className="bg-green-100 text-green-800">Será adicionado</Badge>
                            )}
                            {activeTab === 'existentes' && (
                              <Badge variant="secondary">Será ignorado</Badge>
                            )}
                            {activeTab === 'atualizacoes' && (
                              <Badge className="bg-blue-100 text-blue-800">Será reativado</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Resumo */}
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  <strong>Total na planilha:</strong> {previewData.total} registros
                </p>
                <p className="text-sm text-green-600">
                  <strong>Serão inseridos:</strong> {previewData.novos} novos registros
                </p>
                <p className="text-sm text-blue-600">
                  <strong>Serão atualizados:</strong> {previewData.atualizacoes} registros (reativação)
                </p>
                <p className="text-sm text-yellow-600">
                  <strong>Serão ignorados:</strong> {previewData.existentes} registros (já existentes)
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmUpload}
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? 'Processando...' : 'Confirmar Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
