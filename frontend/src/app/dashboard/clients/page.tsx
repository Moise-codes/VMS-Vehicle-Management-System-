"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Edit,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

import api from "../../../lib/api";

interface Client {
  id: number;
  names: string;
  national_id: string;
  telephone: string;
  address: string;
  created_at: string;
}

interface ClientForm {
  names: string;
  nationalId: string;
  telephone: string;
  address: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [form, setForm] = useState<ClientForm>({
    names: "",
    nationalId: "",
    telephone: "",
    address: "",
  });

  const loadClients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/clients", {
        params: {
          page,
          limit: 10,
          search: search || undefined,
        },
      });

      const data = response.data;

      setClients(data.clients || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Unable to load clients."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, [page, search]);

  const resetForm = () => {
    setForm({
      names: "",
      nationalId: "",
      telephone: "",
      address: "",
    });

    setEditingClient(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);

    setForm({
      names: client.names,
      nationalId: client.national_id,
      telephone: client.telephone,
      address: client.address,
    });

    setShowModal(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (editingClient) {
        await api.put(`/clients/${editingClient.id}`, form);
      } else {
        await api.post("/clients", form);
      }

      setShowModal(false);
      resetForm();
      await loadClients();
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Unable to save client."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/clients/${id}`);

      if (clients.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadClients();
      }
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Unable to delete client."
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-slate-500">
            <Users size={18} />

            <span className="text-sm font-medium">
              Client Management
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Clients
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage clients belonging to your administrator workspace.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Client
        </button>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search clients..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Client
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  National ID
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Telephone
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Address
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-16 text-center text-sm text-slate-500"
                  >
                    Loading clients...
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-16 text-center"
                  >
                    <Users
                      size={30}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-medium text-slate-700">
                      No clients found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Add your first client to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr
                    key={client.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                          {client.names.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {client.names}
                          </p>

                          <p className="text-xs text-slate-400">
                            Client #{client.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {client.national_id}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {client.telephone}
                    </td>

                    <td className="max-w-[220px] truncate px-5 py-4 text-sm text-slate-600">
                      {client.address}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(client)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                          title="Edit client"
                        >
                          <Edit size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(client.id)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete client"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-900">
              {clients.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-900">
              {total}
            </span>{" "}
            clients
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="px-3 text-sm text-slate-600">
              {page} / {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingClient ? "Edit Client" : "Add Client"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Enter the client's information below.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full names
                </label>

                <input
                  required
                  value={form.names}
                  onChange={(e) =>
                    setForm({ ...form, names: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  placeholder="Client full names"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    National ID
                  </label>

                  <input
                    required
                    value={form.nationalId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        nationalId: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                    placeholder="National ID"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Telephone
                  </label>

                  <input
                    required
                    value={form.telephone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        telephone: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                    placeholder="+250..."
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Address
                </label>

                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: e.target.value,
                    })
                  }
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  placeholder="Client address"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingClient
                      ? "Update Client"
                      : "Add Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}