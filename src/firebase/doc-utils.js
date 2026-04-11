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
  increment,
  orderBy,
} from "firebase/firestore";
import { safeAsync } from "@/utils";
import { LINK_TO_PIC, ALLOW_OTHERS } from "@/key-constants";
import { titleToColor } from "@/redux/dataReducer";

// Utility function to ensure createDate is added to all documents
const withCreateDate = (data) => ({
  ...data,
  createDate: serverTimestamp(),
});

// Utility function to create a query sorted by createDate
const createSortedQuery = (collectionName) =>
  query(collection(db, collectionName), orderBy("createDate", "asc"));


function setData(setCB, collectionName) {
  const q = createSortedQuery(collectionName);
  return onSnapshot(q, (qSnap) => {
    const data = qSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCB(data);
  });
}

/** --------------------- USERS --------------------- **/

function getUsersData(setCB) {
  const q = createSortedQuery("users");
  return onSnapshot(q, (qSnap) => {
    const data = qSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCB(data);
  });
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

async function addOrderToUser(uid, orderData) {
  if (!uid) throw new Error("UID is required");
  if (!orderData || typeof orderData !== "object")
    throw new Error("orderData is required");
  if (!Array.isArray(orderData.products) || orderData.products.length === 0)
    throw new Error("Order must have at least one product");

  for (const product of orderData.products) {
    if (
      !product.title ||
      typeof product.title !== "string" ||
      !product.quantity ||
      typeof product.quantity !== "number" ||
      product.quantity < 1
    ) {
      throw new Error(
        "Each product must have a valid title (string) and quantity (number >= 1)",
      );
    }
  }

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  const allowOthers = userSnap.data()?.[ALLOW_OTHERS] ?? false;

  await updateDoc(userRef, {
    orders: arrayUnion({ ...orderData, date: new Date() }),
  });

  if (allowOthers) {
    const colRef = collection(db, "public-orders");
    const snap = await getDocs(colRef);
    const updates = Object.fromEntries(
      orderData.products.map(({ title, quantity }) => [title, increment(quantity)])
    );
    if (!snap.empty) {
      await updateDoc(doc(db, "public-orders", snap.docs[0].id), updates);
    } else {
      const initialValues = Object.fromEntries(
        orderData.products.map(({ title, quantity }) => [title, quantity])
      );
      await addDoc(colRef, withCreateDate(initialValues));
    }
  }
}

/** --------------------- CATEGORIES --------------------- **/

function getCategories(setCB) {
  const q = createSortedQuery("categories");
  return onSnapshot(q, (qSnap) => {
    const data = qSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCB(data);
  });
}

async function addCategory(name) {
  if (!name) return;
  const docRef = await addDoc(
    collection(db, "categories"),
    withCreateDate({ name }),
  );

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
  const q = createSortedQuery("products");
  return onSnapshot(q, (qSnap) => {
    const data = qSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCB(data);
  });
}

async function loadProductsOnce() {
  const q = createSortedQuery("products");
  const productsSnapshot = await getDocs(q);
  return productsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

async function upsertProduct(fields) {
  const { title, price, description, categoryId } = fields;
  const linkToPic = fields[LINK_TO_PIC];

  if (!title || !price) throw new Error("title and price are required");

  const productRef = doc(db, "products", title);
  const snap = await getDoc(productRef);

  const data = {
    title,
    price,
    description: description || "",
    categoryId: categoryId || "",
  };
  data[LINK_TO_PIC] = linkToPic || "";

  if (!snap.exists()) {
    Object.assign(data, withCreateDate({}));
  }
  await setDoc(productRef, data, { merge: true });
}

/** --------------------- ORDERS --------------------- **/

function getOrders(uid, setCB) {
  if (!uid) throw new Error("UID is required");

  const userRef = doc(db, "users", uid);

  return onSnapshot(userRef, (docSnap) => {
    if (!docSnap.exists()) {
      setCB([]);
    } else {
      setCB(docSnap.data().orders ?? []);
    }
  });
}

function getAllOrders(setCB) {
  const q = createSortedQuery("users");
  return onSnapshot(q, (qSnap) => {
    const allOrders = qSnap.docs.flatMap((docSnap) => {
      const user = { id: docSnap.id, ...docSnap.data() };
      return (user.orders ?? []).map((order) => ({
        ...order,
        userId: user.id,
      }));
    });
    setCB(allOrders);
  });
}

/** --------------------- PRODUCT STATS --------------------- **/

function getProductStats(setCB) {
  let latestOrders = null;
  let latestProducts = null;

  const compute = () => {
    if (!latestOrders || !latestProducts) return;
    const productsMap = Object.fromEntries(
      latestProducts.map((p) => [p.title, p])
    );
    const totals = {};
    latestOrders.forEach((order) => {
      order.products?.forEach((orderedProduct) => {
        const product = productsMap[orderedProduct.title];
        if (product) {
          totals[product.title] = {
            qty: (totals[product.title]?.qty ?? 0) + orderedProduct.quantity,
            color: product.color ?? titleToColor(product.title),
          };
        }
      });
    });
    setCB(
      Object.entries(totals).map(([name, { qty, color }]) => ({
        name,
        value: qty,
        color,
      }))
    );
  };

  const unsubOrders = getAllOrders((orders) => {
    latestOrders = orders;
    compute();
  });

  const unsubProducts = onSnapshot(createSortedQuery("products"), (snap) => {
    latestProducts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    compute();
  });

  return () => {
    unsubOrders();
    unsubProducts();
  };
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
    const docRef = await addDoc(colRef, withCreateDate(totalsObj));
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
  withCreateDate,
  getUsersData,
  getUser,
  getOrders,
  getAllOrders,
  safeRemoveUser as removeUser,
  safeAddOrderToUser as addOrderToUser,
  getCategories,
  safeAddCategory as addCategory,
  safeUpdateCategory as updateCategory,
  safeRemoveCategory as removeCategory,
  getProductsData,
  loadProductsOnce,
  safeUpsertProduct as upsertProduct,
  getPublicOrders,
  safeSetPublicOrders as setPublicOrders,
  getProductStats,
};
