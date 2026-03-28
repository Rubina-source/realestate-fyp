import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        {/* Main Content */}
        <div className="flex-1">
          <div className="p-6 lg:p-8 max-w-7xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
