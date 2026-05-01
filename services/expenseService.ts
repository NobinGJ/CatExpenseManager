import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface ExpenseData {
  titulo: string;
  monto: number;
  impuesto: number;
  total: number;
  fecha: Date;
  categoria: string;
}

export interface Expense extends ExpenseData {
  id: string;
  userId: string;
}

const COLLECTION = "expenses";

export const addExpense = async (userId: string, data: ExpenseData) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    userId,
    titulo: data.titulo,
    monto: data.monto,
    impuesto: data.impuesto,
    total: data.monto + data.impuesto,
    fecha: Timestamp.fromDate(data.fecha),
    categoria: data.categoria,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateExpense = async (
  id: string,
  data: Partial<ExpenseData>
) => {
  const docRef = doc(db, COLLECTION, id);
  const updateData: Record<string, unknown> = { ...data };
  if (data.fecha) {
    updateData.fecha = Timestamp.fromDate(data.fecha);
  }
  if (data.monto !== undefined && data.impuesto !== undefined) {
    updateData.total = data.monto + data.impuesto;
  }
  await updateDoc(docRef, updateData);
};

export const deleteExpense = async (id: string) => {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
};

export const subscribeToExpenses = (
  userId: string,
  callback: (expenses: Expense[]) => void
) => {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    orderBy("fecha", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const expenses: Expense[] = snapshot.docs.map((d) => {
      const raw = d.data();
      return {
        id: d.id,
        userId: raw.userId,
        titulo: raw.titulo,
        monto: raw.monto,
        impuesto: raw.impuesto,
        total: raw.total,
        fecha: raw.fecha?.toDate?.() ?? new Date(),
        categoria: raw.categoria,
      };
    });
    callback(expenses);
  });
};
