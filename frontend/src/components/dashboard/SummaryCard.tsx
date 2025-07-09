import { Wallet, CreditCard, PiggyBank } from "lucide-react";

const icons = {
  wallet: Wallet,
  "credit-card": CreditCard,
  "piggy-bank": PiggyBank,
};

interface SummaryCardProps {
  label: string;
  value: string | number;
  icon: keyof typeof icons;
  active?: boolean;
}

export default function SummaryCard({
  label,
  value,
  icon,
  active = false,
}: SummaryCardProps) {
  const Icon = icons[icon];

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg shadow  ${
        active
          ? "bg-gray-800 text-white "
          : "bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-100 border-gray-200 "
      }`}
    >
      <div
        className={`rounded-full p-3 border ${
          active
            ? "bg-white text-gray-900 border-gray-300"
            : "bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3
          className={`text-sm font-medium ${
            active ? "text-gray-300" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {label}
        </h3>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}
