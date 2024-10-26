import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";

export async function uploadImage(userId: string, image: File) {
  try {
    const storageRef = ref(storage, `avatars/${userId}-${image.name}`);
    const snapshot = await uploadBytesResumable(storageRef, image);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    throw error;
  }
}

export async function deleteImage(imageUrl: string) {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    throw error;
  }
}
