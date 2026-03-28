import BrokerSidebar from "./BrokerSidebar";

export default function BrokerLayout({ children }) {
  return (
    <div className="flex">
      <BrokerSidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="flex-1">
          <div className="p-6 lg:p-8 max-w-7xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
