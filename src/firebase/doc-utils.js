import { db } from "./firebase";
import {
  collection,
  query,
  onSnapshot,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { safeAsync } from "@/utils/safe";

const COLORS = [
  "#1F77B4",
  "#2CA02C",
  "#D62728",
  "#E377C2",
  "#FF7F0E",
  "#9467BD",
  "#17BECF",
  "#BCBD22",
  "#8C564B",
  "#AEC7E8",
  "#98DF8A",
  "#FF9896",
  "#C5B0D5",
  "#F7B6D2",
  "#C49C94",
  "#9EDAE5",
  "#DBDB8D",
  "#7F7F7F",
  "#393B79",
  "#637939",
];

function setData(setCB, collectionName) {
  const q = query(collection(db, collectionName));
  return onSnapshot(q, (qSnap) => {
    const data = qSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCB(data);
  });
}

/** --------------------- USERS --------------------- **/

function getUsersData(setCB) {
  return setData(setCB, "users");
}

function getUser(uid, setCB) {
  if (!uid) throw new Error("UID is required");

  const userRef = doc(db, "users", uid);

  const unsubscribe = onSnapshot(userRef, (docSnap) => {
    if (!docSnap.exists()) {
      console.warn("User does not exist:", userRef.path);
      setCB(null);
    } else {
      setCB({ id: docSnap.id, ...docSnap.data() });
    }
  });

  return unsubscribe;
}

async function removeUser(uid) {
  if (!uid) {
    throw new Error("uid is required");
  }

  const userRef = doc(db, "users", uid);
  await deleteDoc(userRef);
}

async function addOrderToUser(
  uid,
  orderData,
  allowOthers,
  currentPublicOrders = {},
) {
  if (!uid) throw new Error("UID is required");
  if (!orderData || typeof orderData !== "object")
    throw new Error("orderData is required");
  if (!Array.isArray(orderData.products) || orderData.products.length === 0)
    throw new Error("Order must have at least one product");

  for (const product of orderData.products) {
    if (
      !product.id ||
      typeof product.id !== "string" ||
      !product.quantity ||
      typeof product.quantity !== "number" ||
      product.quantity < 1
    ) {
      throw new Error(
        "Each product must have a valid ref (string) and quantity (number >= 1)",
      );
    }
  }

  const userRef = doc(db, "users", uid);

  const orderWithTimestamp = {
    ...orderData,
    date: new Date(),
  };

  await updateDoc(userRef, {
    orders: arrayUnion(orderWithTimestamp),
  });

  if (allowOthers) {
    const updatedPublicOrders = { ...currentPublicOrders };
    for (const product of orderData.products) {
      const { id, quantity } = product;
      console.log(`Updating: ${id}`, quantity);

      updatedPublicOrders[id] = (updatedPublicOrders[id] || 0) + quantity;
    }
    await setPublicOrders(updatedPublicOrders);
  }
}

/** --------------------- CATEGORIES --------------------- **/

function getCategoriesData(setCB) {
  return setData(setCB, "categories");
}

async function addCategory(name) {
  if (!name) return;
  const docRef = await addDoc(collection(db, "categories"), {
    name,
  });

  return docRef.id;
}

async function updateCategory(categoryId, name) {
  if (!categoryId || !name) {
    throw new Error("categoryId and data are required");
  }

  const categoryRef = doc(db, "categories", categoryId);
  await updateDoc(categoryRef, { name });
}

async function removeCategory(categoryId) {
  if (!categoryId) {
    throw new Error("categoryId is required");
  }

  const categoryRef = doc(db, "categories", categoryId);
  await deleteDoc(categoryRef);
}

/** --------------------- PRODUCTS --------------------- **/

function getProductsData(setCB) {
  return setData(setCB, "products");
}

async function upsertProduct(id, fields, index) {
  const { title, price, link_to_pic, description, categoryId } = fields;

  if (!id) throw new Error("productId is required");
  if (!title || !price) throw new Error("title and price are required");

  const productRef = doc(db, "products", id);
  const snap = await getDoc(productRef);

  const data = {
    title,
    price,
    link_to_pic: link_to_pic || "",
    description: description || "",
    categoryId: categoryId,
  };

  if (!snap.exists()) {
    data.createDate = serverTimestamp();
    data.color = COLORS[index % COLORS.length];
  }
  await setDoc(productRef, data, { merge: true });
}

async function getFirebaseUniqueId() {
  return doc(collection(db, "products")).id;
}

/** --------------------- PUBLIC ORDERS --------------------- **/

function getPublicOrders(setCB) {
  return setData(setCB, "public-orders");
}

async function setPublicOrders(totalsObj) {
  if (!totalsObj || typeof totalsObj !== "object") {
    throw new Error("totalsObj must be a non-null object");
  }

  const colRef = collection(db, "public-orders");
  const snap = await getDocs(colRef);

  if (!snap.empty) {
    const docRef = doc(db, "public-orders", snap.docs[0].id);
    await setDoc(docRef, totalsObj, { merge: true });
    return docRef.id;
  } else {
    const docRef = await addDoc(colRef, totalsObj);
    return docRef.id;
  }
}

// Wrapped safe versions (consistent logging) — exported under original names below
const safeRemoveUser = safeAsync(removeUser, "removeUser");
const safeAddOrderToUser = safeAsync(addOrderToUser, "addOrderToUser");
const safeAddCategory = safeAsync(addCategory, "addCategory");
const safeUpdateCategory = safeAsync(updateCategory, "updateCategory");
const safeRemoveCategory = safeAsync(removeCategory, "removeCategory");
const safeUpsertProduct = safeAsync(upsertProduct, "upsertProduct");
const safeSetPublicOrders = safeAsync(setPublicOrders, "setPublicOrders");

/** --------------------- EXPORTS --------------------- **/

export {
  getUsersData,
  getUser,
  getUsersData,
  getUser,
  safeRemoveUser as removeUser,
  safeAddOrderToUser as addOrderToUser,
  getCategoriesData,
  safeAddCategory as addCategory,
  safeUpdateCategory as updateCategory,
  safeRemoveCategory as removeCategory,
  getProductsData,
  safeUpsertProduct as upsertProduct,
  getFirebaseUniqueId,
  getPublicOrders,
  safeSetPublicOrders as setPublicOrders,
};
