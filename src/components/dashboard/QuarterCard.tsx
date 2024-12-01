import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface QuarterStats {
  expectedHours: number;
  workedHours: number;
  balance: number;
}

interface QuarterCardProps {
  quarter: {
    id: string;
    title: string;
  };
  stats: QuarterStats;
  currentYear: number;
}

export const QuarterCard = ({ quarter, stats, currentYear }: QuarterCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-100">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-neutral-900">
            {quarter.title}
          </h3>
          <span className="bg-neutral-50 px-4 py-2 rounded-lg text-sm font-medium text-neutral-600">
            {currentYear}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-neutral-50 p-6 rounded-xl">
            <p className="text-sm text-neutral-500 mb-2">Horas previstas</p>
            <p className="text-2xl font-bold text-neutral-900">{stats.expectedHours.toFixed(1)}h</p>
          </div>
          
          <div className="bg-neutral-50 p-6 rounded-xl">
            <p className="text-sm text-neutral-500 mb-2">Horas trabalhadas</p>
            <p className="text-2xl font-bold text-neutral-900">{stats.workedHours.toFixed(1)}h</p>
          </div>

          <div className="bg-neutral-50 p-6 rounded-xl">
            <p className="text-sm text-neutral-500 mb-2">Saldo</p>
            <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {stats.balance >= 0 ? '+' : ''}{stats.balance.toFixed(1)}h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};