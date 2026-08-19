"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  CarFront,
  Edit,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import api from "../../../lib/api";

interface Vehicle {
  id: number;
  chassis_number: string;
  manufacturer: string;
  manufacture_year: number;
  price: number;
  model_name: string;
  created_at: string;
}

interface VehicleForm {
  chassisNumber: string;
  manufacturer: string;
  manufactureYear: string;
  price: string;
  modelName: string;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] =
    useState<Vehicle | null>(null);

  const [form, setForm] = useState<VehicleForm>({
    chassisNumber: "",
    manufacturer: "",
    manufactureYear: "",
    price: "",
    modelName: "",
  });

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/vehicles", {
        params: {
          page,
          limit: 10,
          search: search || undefined,
        },
      });

      setVehicles(response.data.vehicles || []);
      setTotal(response.data.total || 0);
      setTotalPages(response.data.totalPages || 1);
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Unable to load vehicles."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, [page, search]);

  const resetForm = () => {
    setForm({
      chassisNumber: "",
      manufacturer: "",
      manufactureYear: "",
      price: "",
      modelName: "",
    });

    setEditingVehicle(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);

    setForm({
      chassisNumber: vehicle.chassis_number,
      manufacturer: vehicle.manufacturer,
      manufactureYear: String(vehicle.manufacture_year),
      price: String(vehicle.price),
      modelName: vehicle.model_name,
    });

    setShowModal(true);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        chassisNumber: form.chassisNumber,
        manufacturer: form.manufacturer,
        manufactureYear: Number(form.manufactureYear),
        price: Number(form.price),
        modelName: form.modelName,
      };

      if (editingVehicle) {
        await api.put(
          `/vehicles/${editingVehicle.id}`,
          payload
        );
      } else {
        await api.post("/vehicles", payload);
      }

      setShowModal(false);
      resetForm();
      await loadVehicles();
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Unable to save vehicle."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/vehicles/${id}`);

      if (vehicles.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadVehicles();
      }
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Unable to delete vehicle."
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-slate-500">
            <CarFront size={18} />

            <span className="text-sm font-medium">
              Vehicle Management
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Vehicles
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Register and manage vehicles in your workspace.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Vehicle
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
              placeholder="Search vehicles..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Vehicle
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Chassis Number
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Manufacturer
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Year
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Price
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
                    colSpan={6}
                    className="px-5 py-16 text-center text-sm text-slate-500"
                  >
                    Loading vehicles...
                  </td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center"
                  >
                    <CarFront
                      size={30}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-medium text-slate-700">
                      No vehicles found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Register your first vehicle to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                          <CarFront size={18} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {vehicle.model_name}
                          </p>

                          <p className="text-xs text-slate-400">
                            Vehicle #{vehicle.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-mono text-sm text-slate-600">
                      {vehicle.chassis_number}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {vehicle.manufacturer}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {vehicle.manufacture_year}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-900">
                      {Number(vehicle.price).toLocaleString()} RWF
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            openEditModal(vehicle)
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Edit size={17} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(vehicle.id)
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
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
              {vehicles.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-900">
              {total}
            </span>{" "}
            vehicles
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() =>
                setPage((current) => current - 1)
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="px-3 text-sm text-slate-600">
              {page} / {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) => current + 1)
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingVehicle
                    ? "Edit Vehicle"
                    : "Register Vehicle"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Enter the vehicle information below.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 p-6 sm:grid-cols-2"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Chassis Number
                </label>

                <input
                  required
                  value={form.chassisNumber}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      chassisNumber: e.target.value,
                    })
                  }
                  placeholder="Chassis number"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Manufacturer
                </label>

                <input
                  required
                  value={form.manufacturer}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      manufacturer: e.target.value,
                    })
                  }
                  placeholder="Toyota"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Manufacture Year
                </label>

                <input
                  required
                  type="number"
                  min="1900"
                  max="2100"
                  value={form.manufactureYear}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      manufactureYear: e.target.value,
                    })
                  }
                  placeholder="2025"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Price (RWF)
                </label>

                <input
                  required
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                  placeholder="25000000"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Model Name
                </label>

                <input
                  required
                  value={form.modelName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      modelName: e.target.value,
                    })
                  }
                  placeholder="Land Cruiser"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
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
                    : editingVehicle
                      ? "Update Vehicle"
                      : "Register Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}