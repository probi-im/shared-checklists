import { Checklist } from "@/models/checklist";
import firebase from "firebase/app";
import * as fb from "../firebase";

function docToChecklist(
  doc:
    | firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
    | firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
): Checklist {
  return {
    ...(doc.data() as Checklist),
    people: doc.data()?.allowedUsers.length,
    id: doc.id,
    createdOn: new Date(doc.get("createdOn").seconds * 1000)
  };
}

export async function getPublicChecklists() {
  const snapshot = await fb.checklistsCollection.where("status", "==", "public").get();

  if (snapshot.empty) return [];

  return snapshot.docs.map(doc => docToChecklist(doc));
}

export async function getPrivateChecklistsFromUserId(userId: string) {
  const snapshot = await fb.checklistsCollection
    .where("allowedUsers", "array-contains", userId)
    .get();

  if (snapshot.empty) return [];

  return snapshot.docs.map(doc => docToChecklist(doc));
}

export async function getChecklistFromId(checklistId: string): Promise<Checklist | null> {
  const doc = await fb.checklistsCollection.doc(checklistId).get();

  if (!doc.exists) return null;

  return docToChecklist(doc);
}

export async function deleteChecklist(checklistId: string) {
  await fb.checklistsCollection.doc(checklistId).delete();
}

export async function leaveChecklist(checklistId: string, userId: string) {
  await fb.checklistsCollection
    .doc(checklistId)
    .update({ allowedUsers: firebase.firestore.FieldValue.arrayRemove(userId) });
}

export async function joinChecklist(checklistId: string, userId: string) {
  await fb.checklistsCollection
    .doc(checklistId)
    .update({ allowedUsers: firebase.firestore.FieldValue.arrayUnion(userId) });
}

export async function toggleItemState(checklist: Checklist, itemId: string) {
  const itemIndex = checklist.items.findIndex(i => i.id === itemId);
  if (itemIndex === -1) return;
  checklist.items[itemIndex].done = !checklist.items[itemIndex].done;
  await fb.checklistsCollection.doc(checklist.id).update({
    items: checklist.items
  });
}

export async function deleteItem(checklist: Checklist, itemId: string) {
  const item = checklist.items.find(i => i.id === itemId);
  if (!item) return;
  console.log("deleteItem: item found:", item);
  await fb.checklistsCollection
    .doc(checklist.id)
    .update({ items: firebase.firestore.FieldValue.arrayRemove(item) });
}
