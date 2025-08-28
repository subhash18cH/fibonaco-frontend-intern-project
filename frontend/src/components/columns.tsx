"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ShieldCheck, User, X, OctagonAlert, ShieldOff, Trash2, CircleDashed, CircleCheckBig } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type User = {
  id: number
  name: string
  email: string
  is_superuser: boolean
  is_verified: boolean
}

const colors = [
  "bg-blue-600",
  "bg-green-600",
  "bg-purple-600",
  "bg-pink-600",
  "bg-yellow-600",
  "bg-orange-600",
  "bg-indigo-600",
]

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "NAME",
    cell: ({ row }) => {
      const fullName: string = row.getValue("name")
      const parts = fullName.trim().split(" ")

      let initials = ""
      if (parts.length === 1) {
        initials = parts[0][0]
      } else {
        initials = parts[0][0] + parts[parts.length - 1][0]
      }

      // hash the name to pick a color
      const hash = fullName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const color = colors[hash % colors.length]

      return (
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-9 h-9 rounded-full ${color} text-white font-semibold shadow-md`}
          >
            {initials.toUpperCase()}
          </div>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {fullName}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "EMAIL",
  },
  {
    accessorKey: "is_superuser",
    header: "ROLE",
    cell: ({ row }) =>
      row.getValue("is_superuser") ? (
        <div className="flex items-center gap-2 text-blue-400">
          <ShieldCheck size={20} /> <span>Super User</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-purple-400">
          <User size={20} /> <span>Normal User</span>
        </div>
      ),
  },
  {
    accessorKey: "is_verified",
    header: "STATUS",
    cell: ({ row }) =>
      row.getValue("is_verified") ? (
        <div className="flex items-center gap-2 text-green-400">
          <CircleCheckBig size={20} /> <span>Verified</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-red-400">
          <CircleDashed size={20} /> <span>Not Verified</span>
        </div>
      ),
  },
  {
    id: "actions",
    header: () => <div className="text-right"></div>,
    cell: ({ row }) => {

      const user = row.original;
      const queryClient = useQueryClient()

      const [isDropdownOpen, setIsDropdownOpen] = useState(false)
      const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false)
      const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false)
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
      const [deleteConfirmText, setDeleteConfirmText] = useState("")

      //Mutations for upadtes
      // For verifying the user
      const verifyMutation = useMutation({
        mutationFn: async (id: number) => {
          const res = await fetch("http://127.0.0.1:8000/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          })
          if (!res.ok) {
            const err = await res.json()
            throw new Error(err.error || "Verification failed")
          }
          setIsDropdownOpen(false)
          toast.success(`User ${user.name} verified successfully!`);
          return res.json()
        },
        onSuccess: () => queryClient.invalidateQueries(),
      })

      // For toggling admin control

      const adminMutation = useMutation({
        mutationFn: async ({ id, is_superuser }: { id: number; is_superuser: boolean }) => {
          const res = await fetch("http://127.0.0.1:8000/api/admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, is_superuser }),
          })
          if (!res.ok) {
            const err = await res.json()
            throw new Error(err.error || "Admin update failed")
          }
          setIsDropdownOpen(false)
          toast.success(`User ${user.name} role has changed successfully!`);
          return res.json()
        },
        onSuccess: () => queryClient.invalidateQueries(),
      })

      // For deleting the user
      const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
          const res = await fetch("http://127.0.0.1:8000/api/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          })
          if (!res.ok) {
            const err = await res.json()
            throw new Error(err.error || "Delete failed")
          }
          setIsDropdownOpen(false)
          toast.success(`User ${user.name} deleted successfully!`);
          return res.json()
        },
        onSuccess: () => queryClient.invalidateQueries(),
      })

      return (
        <div className="text-right">

          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>

            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">

              <DropdownMenuItem
                disabled={user.is_verified}
                onSelect={(e) => {
                  e.preventDefault();
                  setIsVerifyDialogOpen(true);
                }}
              >
                <ShieldCheck />
                <span>Verify User</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setIsAdminDialogOpen(true);
                }}
              >
                {user.is_superuser ? <ShieldOff /> : <ShieldCheck />}
                <span>{`${user.is_superuser ? "Remove Admin" : "Make Admin"}`}</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-400 focus:bg-red-900"
                onSelect={(e) => {
                  e.preventDefault();
                  setDeleteConfirmText("");
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="text-red-500" />
                <span className="text-red-500">Delete User</span>
              </DropdownMenuItem>
            </DropdownMenuContent>

          </DropdownMenu>

          {/* Verify Dialog */}
          <AlertDialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>

            <AlertDialogContent>

              <AlertDialogHeader>

                <AlertDialogTitle className="flex items-center gap-2">
                  <ShieldCheck />
                  Verify {user.name}
                </AlertDialogTitle>

                <button
                  onClick={() => setIsVerifyDialogOpen(false)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted/50 "
                >
                  <X size={18} />
                </button>

                <AlertDialogDescription>
                  This will mark {user.name} as a verified user and grant them full access to their account.
                </AlertDialogDescription>

              </AlertDialogHeader>

              <AlertDialogFooter>

                <AlertDialogCancel onClick={() => setIsVerifyDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  className={`${verifyMutation.isPending
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`} onClick={() => verifyMutation.mutate(user.id)}>
                  {verifyMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : "Verify"}
                </AlertDialogAction>

              </AlertDialogFooter>

            </AlertDialogContent>

          </AlertDialog>

          {/* Admin Rights Dialog */}
          <AlertDialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>

            <AlertDialogContent>

              <AlertDialogHeader>

                <AlertDialogTitle className="flex items-center gap-2">
                  {user.is_superuser ? <ShieldOff /> : <ShieldCheck />}
                  {user.is_superuser ? "Remove Admin Access" : "Grant Admin Rights"}
                </AlertDialogTitle>

                <button
                  onClick={() => setIsAdminDialogOpen(false)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted/50 "
                >
                  <X size={18} />
                </button>

                <AlertDialogDescription>
                  {user.is_superuser
                    ? `${user.name} will loose access to administrative features and settings. Youcan always reassign admin rights later.`
                    : `Are you sure you want to grant admin privileges to "${user.name}"? This user will gain access to all administrative functions including user management.`
                  }
                </AlertDialogDescription>

              </AlertDialogHeader>

              <AlertDialogFooter>

                <AlertDialogCancel onClick={() => setIsAdminDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  className={`${user.is_superuser
                    ? "bg-red-500 hover:bg-red-400 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  onClick={() => adminMutation.mutate({ id: user.id, is_superuser: !user.is_superuser })}
                >
                  {adminMutation.isPending ? user.is_superuser
                    ? "Removing..."
                    : "Granting..."
                    : user.is_superuser
                      ? "Remove Admin"
                      : "Make Admin "}
                </AlertDialogAction>

              </AlertDialogFooter>

            </AlertDialogContent>

          </AlertDialog>

          {/* Delete Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>

            <AlertDialogContent className="max-w-md">

              <AlertDialogHeader>

                <AlertDialogTitle className="text-red-500 flex items-center gap-2">
                  <OctagonAlert className="h-5 w-5" />
                  Delete the User?
                </AlertDialogTitle>

                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted/50 "
                >
                  <X size={18} />
                </button>

                <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                  This action is <span className="font-bold">permanent</span> and will remove <span className="font-semibold">{user.name}</span>'s account and all associated data.
                </AlertDialogDescription>

              </AlertDialogHeader>

              <div className="my-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  To confirm the deletion, please type in 'DELETE':
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="w-full  px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-red-900 dark:text-red-900 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <AlertDialogFooter>

                <AlertDialogCancel
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setDeleteConfirmText("");
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                >
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  className={`${deleteMutation.isPending
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  disabled={deleteConfirmText !== "DELETE"}
                  onClick={() => deleteMutation.mutate(user.id)}
                >
                  {deleteMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </div>
                  ) : "Delete"}
                </AlertDialogAction>

              </AlertDialogFooter>

            </AlertDialogContent>

          </AlertDialog>

        </div>
      )
    },
  },
]