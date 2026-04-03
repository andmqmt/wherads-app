'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { campaignService } from '@/services/campaign.service';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export default function NewCampaignPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await campaignService.create({
        name,
        description: description || undefined,
        budget: budget ? Number(budget) : undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
      });
      router.push('/campaigns');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar campanha');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Nova campanha
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Preencha os dados da campanha
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <Input
          id="name"
          label="Nome da campanha"
          placeholder="Ex: Campanha Black Friday"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="description"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Descrição
          </label>
          <textarea
            id="description"
            rows={3}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            placeholder="Descreva o objetivo da campanha"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Input
          id="budget"
          label="Orçamento (R$)"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="startDate"
            label="Data de início"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            id="endDate"
            label="Data de término"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="mt-4 flex gap-3">
          <Button type="submit" isLoading={isLoading}>
            Criar campanha
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
