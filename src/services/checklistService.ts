import { Checklist } from "@/models/checklist";
import * as fb from "../firebase";

function docToChecklist(
  doc:
    | firebase.default.firestore.QueryDocumentSnapshot<firebase.default.firestore.DocumentData>
    | firebase.default.firestore.DocumentSnapshot<firebase.default.firestore.DocumentData>
): Checklist {
  return {
    ...(doc.data() as Checklist),
    people: doc.data()?.allowedUsers.length,
    id: doc.id,
    createdOn: new Date(doc.get("createdOn").seconds * 1000)
  };
}

export async function getPublicChecklists() {
  const snapshot = await fb.checklistsCollection
    .where("status", "==", "public")
    .orderBy("createdOn", "desc")
    .get();

  if (snapshot.empty) return [];

  return snapshot.docs.map(doc => docToChecklist(doc));
}

export async function getChecklistFromId(checklistId: string): Promise<Checklist | null> {
  const doc = await fb.checklistsCollection.doc(checklistId).get();

  if (!doc.exists) return null;

  return docToChecklist(doc);
}
