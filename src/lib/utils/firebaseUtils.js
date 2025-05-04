import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';

/* ======================
   CORE SERVICE FUNCTIONS
====================== */
export const firestoreService = {
  /* ======================
     BASIC CRUD OPERATIONS
  ====================== */
  
  // Get single document by ID
  get: async (collectionName, docId, db) => {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      throw firestoreService._handleError('GET', collectionName, docId, error);
    }
  },

  // Query documents with conditions
  query: async (collectionName, conditions = [], db) => {
    try {
      const collectionRef = collection(db, collectionName);
      const queryConditions = conditions.map(cond => where(...cond));
      const q = query(collectionRef, ...queryConditions);
      const snapshot = await getDocs(q);

      return {
        docs: snapshot.docs.map(d => ({ id: d.id, ...d.data() })),
        empty: snapshot.empty,
        snapshot
      };
    } catch (error) {
      throw firestoreService._handleError('QUERY', collectionName, null, error);
    }
  },

  // Add new document (auto-ID)
  add: async (collectionName, data, db) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return { id: docRef.id, ...data };
    } catch (error) {
      throw firestoreService._handleError('ADD', collectionName, null, error);
    }
  },

  // Set document with custom ID
  set: async (collectionName, docId, data, db, merge = true) => {
    try {
      await setDoc(doc(db, collectionName, docId), data, { merge });
      return { id: docId, ...data };
    } catch (error) {
      throw firestoreService._handleError('SET', collectionName, docId, error);
    }
  },

  // Update existing document
  update: async (collectionName, docId, updates, db) => {
    try {
      await updateDoc(doc(db, collectionName, docId), updates);
      return { id: docId, ...updates };
    } catch (error) {
      throw firestoreService._handleError('UPDATE', collectionName, docId, error);
    }
  },

  // Delete document
  delete: async (collectionName, docId, db) => {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      return { id: docId, deleted: true };
    } catch (error) {
      throw firestoreService._handleError('DELETE', collectionName, docId, error);
    }
  },

  /* ======================
     BATCH OPERATIONS
  ====================== */
  batch: {
    create: (db) => writeBatch(db),

    add: (batch, collectionName, data, docId = null) => {
      const docRef = docId 
        ? doc(db, collectionName, docId)
        : doc(collection(db, collectionName));
      batch.set(docRef, data);
      return docRef.id;
    },

    update: (batch, collectionName, docId, updates) => {
      const docRef = doc(db, collectionName, docId);
      batch.update(docRef, updates);
    },

    delete: (batch, collectionName, docId) => {
      const docRef = doc(db, collectionName, docId);
      batch.delete(docRef);
    },

    commit: async (batch) => {
      try {
        await batch.commit();
        return { success: true };
      } catch (error) {
        throw FirestoreService._handleError('BATCH_COMMIT', null, null, error);
      }
    }
  },

  /* ======================
     ERROR HANDLER (PRIVATE)
  ====================== */
  _handleError: (operation, collectionName, docId, error) => {
    const docInfo = docId ? ` (doc: ${docId})` : '';
    const message = `Firestore ${operation} error in ${collectionName}${docInfo}: ${error.message}`;
    console.error(message);
    return new Error(message, { cause: error });
  }
};

