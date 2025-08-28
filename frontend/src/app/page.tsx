"use client";

/**
 * Main Page for the Frontend Intern Project
 */

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import usePagesAPIQuery from "@/hooks/use-user-pages";
import ThemeToggle from "@/components/theme-toggle";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/columns";
import { ChevronLeft, ChevronRight, X, ShieldUser } from 'lucide-react';

export default function UsersTable() {
  
  const [search, setSearch] = useState("");
  const [superFilter, setSuperFilter] = useState("na");
  const [verifyFilter, setVerifyFilter] = useState("na");
  const [page, setPage] = useState(1);

  const { data } = usePagesAPIQuery({
    page,
    limit: 10,
    filters: {
      search,
      are_superusers: superFilter,
      are_verified: verifyFilter,
    },
  });

  return (
    <div className="py-6 px-30 space-y-6">
      <div className="flex justify-between">

        <div className="flex items-center gap-4">
          <div className="bg-blue-500 dark:bg-blue-800 rounded-full  text-white p-2 shadow-md dark:shadow-blue-950 shadow-blue-500">
            <ShieldUser size={30} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage your team members and their permissions.</p>
          </div>
        </div>

        <ThemeToggle />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by Name or Email"
          className="max-w-3xl"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />

        <Select value={superFilter} onValueChange={(val) => { setSuperFilter(val); setPage(1); }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="na">All</SelectItem>
            <SelectItem value="superuser">Super User</SelectItem>
            <SelectItem value="normaluser">Normal User</SelectItem>
          </SelectContent>
        </Select>

        <Select value={verifyFilter} onValueChange={(val) => { setVerifyFilter(val); setPage(1); }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="na">All</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="notverified">Not Verified</SelectItem>
          </SelectContent>
        </Select>

        {(search || superFilter !== "na" || verifyFilter !== "na") && (
          <button
            className="text-white bg-red-500 hover:cursor-pointer hover:bg-red-400 p-1 rounded-md"
            onClick={() => {
              setSearch("")
              setSuperFilter("na")
              setVerifyFilter("na")
              setPage(1);

            }}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>


      {/* Table */}
      <div className="rounded-xl border shadow">
        <DataTable columns={columns} data={data?.data ?? []} />
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 p-4">
        <button
          className={`border p-1 rounded-sm   ${page === 1 ? "opacity-50 hover" : "hover:bg-muted/50"
            }`}
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          <ChevronLeft size={16} />
        </button>

        <span className="text-sm">
          Page {page}
        </span>

        <button
          className={`border p-1 rounded-sm  ${!data?.has_next ? "opacity-50" : " hover:bg-muted/50"
            }`}
          disabled={!data?.has_next}
          onClick={() => setPage((prev) => prev + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}
