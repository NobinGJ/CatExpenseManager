import { useMemo } from "react";
import { Expense } from "@/services/expenseService";
import { CATEGORIES, getCategoryById } from "@/constants/categories";

export interface CategoryStat {
  id: string;
  name: string;
  emoji: string;
  color: string;
  total: number;
  count: number;
  percentage: number;
}

export function useExpenseStats(expenses: Expense[]) {
  const categoryStats = useMemo((): CategoryStat[] => {
    const totalAll = expenses.reduce((sum, e) => sum + e.total, 0);
    const map = new Map<string, { total: number; count: number }>();

    expenses.forEach((e) => {
      const prev = map.get(e.categoria) || { total: 0, count: 0 };
      map.set(e.categoria, {
        total: prev.total + e.total,
        count: prev.count + 1,
      });
    });

    const stats: CategoryStat[] = [];
    map.forEach((val, key) => {
      const cat = getCategoryById(key);
      stats.push({
        id: key,
        name: cat.name,
        emoji: cat.emoji,
        color: cat.color,
        total: val.total,
        count: val.count,
        percentage: totalAll > 0 ? (val.total / totalAll) * 100 : 0,
      });
    });

    return stats.sort((a, b) => b.total - a.total);
  }, [expenses]);

  const monthlyBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((e) => {
      const d = new Date(e.fecha);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map.set(key, (map.get(key) || 0) + e.total);
    });

    const months = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
    ];

    return Array.from(map.entries())
      .map(([key, total]) => {
        const [year, month] = key.split("-");
        return {
          key,
          label: `${months[parseInt(month, 10) - 1]} ${year}`,
          total,
        };
      })
      .sort((a, b) => b.key.localeCompare(a.key));
  }, [expenses]);

  return { categoryStats, monthlyBreakdown };
}
