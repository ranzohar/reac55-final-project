import { db } from "./firebase";
import {
  collection,
  query,
  onSnapshot,
  getDoc,
  updateDoc,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";

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

function getOrdersData(setCB) {
  const parseOrdersData = async (order) => {
    return {
      date: order.date,
      userId: order.user.id,
      products: await Promise.all(
        order.products.map(async (product) => {
          const productDoc = await getDoc(product.ref);
          let name = null;
          if (productDoc.exists()) {
            name = productDoc.data().title;
          }
          return {
            quantity: product.quantity,
            name,
          };
        })
      ),
    };
  };

  return setData(setCB, "orders", parseOrdersData);
}

function getCategoriesData(setCB) {
  return setData(setCB, "categories");
}

function getProductsData(setCB) {
  const parseProductsData = async (product) => {
    const categoryDoc = await getDoc(product.category);
    let categoryName = "";
    if (categoryDoc.exists()) {
      categoryName = categoryDoc.data().name;
    }

    return {
      title: product.title,
      price: product.price,
      link: product.link_to_pic,
      category: categoryName,
    };
  };
  return setData(setCB, "products", parseProductsData);
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

function getUser(uid, setCB) {
  if (!uid) throw new Error("UID is required");

  const userRef = doc(db, "users", uid);

  const unsubscribe = onSnapshot(userRef, (docSnap) => {
    if (!docSnap.exists()) {
      setCB({});
    } else {
      console.log(docSnap.data());

      setCB({ id: docSnap.id, ...docSnap.data() });
    }
  });

  return unsubscribe; // call unsubscribe() to stop listening
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

export {
  getUsersData,
  getOrdersData,
  getCategoriesData,
  getProductsData,
  updateCategory,
  removeCategory,
  addCategory,
  getUser,
  removeUser,
};
