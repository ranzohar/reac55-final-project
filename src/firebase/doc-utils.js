import { db } from "./firebase";
import {
  collection,
  query,
  onSnapshot,
  getDoc,
  setDoc,
  updateDoc,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";

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

function setData(setCB, collectionName, parseData) {
  const q = query(collection(db, collectionName));
  return onSnapshot(q, async (qSnap) => {
    let data;
    if (!parseData) {
      data = qSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } else {
      data = await Promise.all(
        qSnap.docs.map(async (doc) => {
          const parsedData = await parseData(doc.data());
          return { id: doc.id, ...parsedData };
        })
      );
    }
    setCB(data);
  });
}

function getUsersData(setCB) {
  return setData(setCB, "users");
}

function getCategoriesData(setCB) {
  return setData(setCB, "categories");
}

function getProductsData(setCB) {
  return setData(setCB, "products");
}

async function updateCategory(categoryId, name) {
  if (!categoryId || !name) {
    throw new Error("categoryId and data are required");
  }

  const categoryRef = doc(db, "categories", categoryId);

  try {
    await updateDoc(categoryRef, { name });
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

async function removeCategory(categoryId) {
  if (!categoryId) {
    throw new Error("categoryId is required");
  }

  const categoryRef = doc(db, "categories", categoryId);

  try {
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error("Error removing category:", error);
    throw error;
  }
}

async function addCategory(name) {
  if (!name) {
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "categories"), {
      name,
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
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

  await setDoc(productRef, data);
}

async function getFirebaseUniqueId() {
  return doc(collection(db, "products")).id;
}

function getUser(uid, setCB) {
  if (!uid) throw new Error("UID is required");

  const userRef = doc(db, "users", uid);

  const unsubscribe = onSnapshot(userRef, (docSnap) => {
    if (!docSnap.exists()) {
      throw new Error("User does not exist");
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

  try {
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Error removing user:", error);
    throw error;
  }
}

async function addOrderToUser(uid, orderData) {
  if (!uid) throw new Error("UID is required");
  if (!orderData) throw new Error("orderData is required");
  if (!Array.isArray(orderData.products) || orderData.products.length === 0) {
    throw new Error("Order must have at least one product");
  }
  for (const product of orderData.products) {
    if (
      !product.id ||
      typeof product.id !== "string" ||
      !product.quantity ||
      typeof product.quantity !== "number" ||
      product.quantity < 1
    ) {
      throw new Error(
        "Each product must have a valid ref (string) and quantity (number >= 1)"
      );
    }
  }

  const userRef = doc(db, "users", uid);

  try {
    const orderWithTimestamp = {
      ...orderData,
      date: new Date(),
    };

    await updateDoc(userRef, {
      orders: arrayUnion(orderWithTimestamp),
    });
  } catch (error) {
    console.error("Error adding order to user:", error);
    throw error;
  }
}

export {
  getUsersData,
  getCategoriesData,
  getProductsData,
  updateCategory,
  removeCategory,
  addCategory,
  upsertProduct,
  getUser,
  removeUser,
  getFirebaseUniqueId,
  addOrderToUser,
};
