export default function BalanceOverviewCard() {
  return (
    <div
      className="rounded-2xl text-white shadow-lg relative overflow-hidden p-5 h-64 "
      style={{
        background:
          "linear-gradient(160deg, #1f2937 0%, #111827 60%, #10b981 130%)",
        // width: "100%",
        // minHeight: "170px",
        // maxWidth: "320px",
      }}
    >
      <div className="flex justify-between items-start mb-5">
        <div>
          <p className="text-sm text-gray-200">Balance overview</p>
          <h2 className="text-2xl font-bold mt-2 tracking-tight">$21,847.00</h2>
          <p className="text-sm mt-3 text-gray-100">
            Extra savings <strong>$2,992.00</strong>
          </p>
          <p className="text-xs text-gray-400">Combination of bank accounts</p>
        </div>

       
      </div>

      {/* Logos row */}
      <div className="absolute bottom-4 left-4 flex gap-3">
        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-black text-xs font-bold">
          🏦
        </div>
        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-black text-xs font-bold">
          💳
        </div>
        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-black text-xs font-bold">
          📈
        </div>
      </div>
    </div>
  );
}
