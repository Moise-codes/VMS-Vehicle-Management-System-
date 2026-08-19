"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  CarFront,
  Link2,
  Plus,
  Search,
  Trash2,
  X,
  Users,
} from "lucide-react";

import api from "../../../lib/api";

interface Client {
  id: number;
  names: string;
  national_id: string;
}

interface Vehicle {
  id: number;
  model_name: string;
  chassis_number: string;
  manufacturer: string;
  manufacture_year: number;
}

interface Assignment {
  id: number;
  plate_number: string;
  client_id: number;
  vehicle_id: number;
  client_names: string;
  vehicle_model: string;
  chassis_number: string;
  created_at: string;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    clientId: "",
    vehicleId: "",
    plateNumber: "",
  });

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/assignments", {
        params: {
          page,
          limit: 10,
          search: search || undefined,
        },
      });

      setAssignments(response.data.assignments || []);
      setTotal(response.data.total || 0);
      setTotalPages(response.data.totalPages || 1);
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Unable to load assignments."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadFormData = async () => {
    try {
      const [clientsResponse, vehiclesResponse] = await Promise.all([
        api.get("/clients", {
          params: {
            page: 1,
            limit: 1000,
          },
        }),
        api.get("/vehicles", {
          params: {
            page: 1,
            limit: 1000,
          },
        }),
      ]);

      setClients(clientsResponse.data.clients || []);
      setVehicles(vehiclesResponse.data.vehicles || []);
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Unable to load clients and vehicles."
      );
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [page, search]);

  const openModal = async () => {
    setError("");

    setForm({
      clientId: "",
      vehicleId: "",
      plateNumber: "",
    });

    await loadFormData();

    setShowModal(true);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await api.post("/assignments", {
        clientId: Number(form.clientId),
        vehicleId: Number(form.vehicleId),
        plateNumber: form.plateNumber,
      });

      setShowModal(false);

      setForm({
        clientId: "",
        vehicleId: "",
        plateNumber: "",
      });

      await loadAssignments();
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Unable to create assignment."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this vehicle assignment?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/assignments/${id}`);

      if (assignments.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadAssignments();
      }
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Unable to remove assignment."
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-slate-500">
            <Link2 size={18} />

            <span className="text-sm font-medium">
              Vehicle Linkage
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Assignments
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Link registered vehicles to clients and assign unique plate
            numbers.
          </p>
        </div>

        <button
          onClick={openModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          New Assignment
        </button>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Link2 size={19} />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Total Assignments
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {total}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
            <Users size={19} />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Clients
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {clients.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
            <CarFront size={19} />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Available Vehicles
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {vehicles.length}
          </p>
        </div>
      </section>

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
              placeholder="Search by plate, client or vehicle..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Plate Number
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Client
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Vehicle
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Chassis
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
                    Loading assignments...
                  </td>
                </tr>
              ) : assignments.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-16 text-center"
                  >
                    <Link2
                      size={30}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-medium text-slate-700">
                      No assignments found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Link a vehicle to a client to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                assignments.map((assignment) => (
                  <tr
                    key={assignment.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-slate-900 px-3 py-1.5 font-mono text-xs font-semibold text-white">
                        {assignment.plate_number}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {assignment.client_names}
                      </p>

                      <p className="text-xs text-slate-400">
                        Client #{assignment.client_id}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {assignment.vehicle_model}
                      </p>

                      <p className="text-xs text-slate-400">
                        Vehicle #{assignment.vehicle_id}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-mono text-sm text-slate-600">
                      {assignment.chassis_number}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            handleDelete(assignment.id)
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          title="Remove assignment"
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
              {assignments.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-900">
              {total}
            </span>{" "}
            assignments
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
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  New Vehicle Assignment
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Link a vehicle to a registered client.
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
              className="space-y-5 p-6"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Client
                </label>

                <select
                  required
                  value={form.clientId}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      clientId: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                >
                  <option value="">Select a client</option>

                  {clients.map((client) => (
                    <option
                      key={client.id}
                      value={client.id}
                    >
                      {client.names} — {client.national_id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Vehicle
                </label>

                <select
                  required
                  value={form.vehicleId}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      vehicleId: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                >
                  <option value="">Select a vehicle</option>

                  {vehicles.map((vehicle) => (
                    <option
                      key={vehicle.id}
                      value={vehicle.id}
                    >
                      {vehicle.model_name} —{" "}
                      {vehicle.chassis_number}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Unique Plate Number
                </label>

                <input
                  required
                  value={form.plateNumber}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      plateNumber: event.target.value.toUpperCase(),
                    })
                  }
                  placeholder="RAB 123 A"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm uppercase outline-none focus:border-slate-400"
                />

                <p className="mt-2 text-xs text-slate-400">
                  The plate number must be unique.
                </p>
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
                    ? "Creating..."
                    : "Create Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}