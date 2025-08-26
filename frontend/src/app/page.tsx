/**
 * Main Page for the Frontend Intern Project
 */

import ThemeToggle from "@/components/theme-toggle";

function UsersTable() {
  return (
    <section className="max-w-screen-xl mx-auto my-12">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Users Table - Frontend Intern Position Project</h1>
          <h3 className="text-lg">Please build your UI here, everything and all things are upto you in this repository / on this page.</h3>
        </div>
        <ThemeToggle />
      </div>
    </section>
  );
}

export default UsersTable;