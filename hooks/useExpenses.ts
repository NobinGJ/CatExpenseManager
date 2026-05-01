import { useState, useEffect, useCallback, useMemo } from "react";
import {
  subscribeToExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  Expense,
  ExpenseData,
} from "@/services/expenseService";
import { useAuth } from "./useAuth";

export function useExpenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToExpenses(user.uid, (data) => {
      setExpenses(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const add = useCallback(
    async (data: ExpenseData) => {
      if (!user) throw new Error("User not authenticated");
      return addExpense(user.uid, data);
    },
    [user]
  );

  const update = useCallback(
    async (id: string, data: Partial<ExpenseData>) => {
      return updateExpense(id, data);
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    return deleteExpense(id);
  }, []);

  const totals = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const dailyTotal = expenses
      .filter((e) => {
        const d = new Date(e.fecha);
        return d >= todayStart;
      })
      .reduce((sum, e) => sum + e.total, 0);

    const monthlyTotal = expenses
      .filter((e) => new Date(e.fecha) >= monthStart)
      .reduce((sum, e) => sum + e.total, 0);

    const generalTotal = expenses.reduce((sum, e) => sum + e.total, 0);

    return { dailyTotal, monthlyTotal, generalTotal };
  }, [expenses]);

  return {
    expenses,
    loading,
    add,
    update,
    remove,
    ...totals,
  };
}
