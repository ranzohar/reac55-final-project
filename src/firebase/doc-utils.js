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
  const q = query(collection(db, "users"));

  return onSnapshot(q, async (usersSnap) => {
    const users = await Promise.all(
      usersSnap.docs.map(async (doc) => {
        const data = doc.data();

        // Parse orders and their products
        const orders = await Promise.all(
          (data.orders || []).map(async (order) => {
            const products = await Promise.all(
              (order.products || []).map(async (orderedProduct) => {
                const productRef =
                  typeof orderedProduct.ref === "string"
                    ? doc(db, ...orderedProduct.ref.split("/").filter(Boolean))
                    : orderedProduct.ref;

                const productSnap = await getDoc(productRef);
                if (!productSnap.exists()) {
                  return { quantity: orderedProduct.quantity, product: null };
                }

                const productData = await parseProductData(productSnap.data());

                return {
                  quantity: orderedProduct.quantity,
                  product: { id: productSnap.id, ...productData },
                };
              })
            );

            return {
              ...order,
              products,
              date: order.date,
            };
          })
        );

        return {
          id: doc.id,
          username: data.username,
          fname: data.fname,
          lname: data.lname,
          joined: data.joined,
          orders,
        };
      })
    );

    setCB(users);
  });
}

function getCategoriesData(setCB) {
  return setData(setCB, "categories");
}

const parseProductData = async (product) => {
  let categoryName = "";
  if (product.category) {
    const categoryDoc = await getDoc(product.category);
    if (categoryDoc.exists()) {
      categoryName = categoryDoc.data().name;
    }
  }

  return {
    title: product.title,
    price: product.price,
    link: product.link_to_pic,
    description: product.description,
    category: categoryName,
    createDate: product.createDate,
    color: product.color,
  };
};

function getProductsData(setCB) {
  return setData(setCB, "products", parseProductData);
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

  let categoryRef = null;

  if (categoryId) {
    const categoryDocRef = doc(db, "categories", categoryId);
    const categorySnap = await getDoc(categoryDocRef);
    if (!categorySnap.exists()) throw new Error("Category does not exist");
    categoryRef = categoryDocRef;
  }

  const data = {
    title,
    price,
    link_to_pic: link_to_pic || "",
    description: description || "",
    category: categoryRef,
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
      setCB({});
    } else {
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
  getCategoriesData,
  getProductsData,
  updateCategory,
  removeCategory,
  addCategory,
  upsertProduct,
  getUser,
  removeUser,
  getFirebaseUniqueId,
};
