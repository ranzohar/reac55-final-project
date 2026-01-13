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
  return setData(setCB, "users");
}

function getOrdersData(setCB) {
  const colRef = collection(db, "orders");

  const unsubscribe = onSnapshot(colRef, async (snapshot) => {
    const results = await Promise.all(
      snapshot.docs.map(async (wrapperDoc) => {
        const orderRefWrapper = wrapperDoc.data();

        if (!orderRefWrapper.ref) {
          throw new Error(`Order wrapper ${wrapperDoc.id} missing 'ref'`);
        }

        const orderSnap = await getDoc(orderRefWrapper.ref);

        if (!orderSnap.exists()) {
          throw new Error(
            `Referenced order ${orderRefWrapper.ref.path} does not exist`
          );
        }

        const order = orderSnap.data();

        if (!Array.isArray(order.products) || order.products.length === 0) {
          throw new Error(
            `Order ${orderSnap.id} must contain at least one product`
          );
        }

        const userId = orderRefWrapper.ref.parent.parent.id;

        const products = await Promise.all(
          order.products.map(async (orderedProduct, index) => {
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
          id: wrapperDoc.id,
          userId,
          products,
          date: order.date || null,
          status: order.status || null,
        };
      })
    );

    setCB(results);
  });

  return unsubscribe;
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
  console.log(data.color);

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
  getOrdersData,
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
