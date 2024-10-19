// import {
//   deleteObject,
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from "firebase/storage";
// import firebaseApp from "@/lib/firebase";

// export async function uploadImage(images: ImageType[]) {
//   try {
//     let uploadedImages: UploadedImageType[] = [];

//     for (const item of images) {
//       if (item.image) {
//         const fileName = new Date().getTime() + "-" + item.image.name;
//         const storage = getStorage(firebaseApp);
//         const storageRef = ref(storage, `products/${fileName}`);
//         const uploadTask = uploadBytesResumable(storageRef, item.image);

//         await new Promise<void>((resolve, reject) => {
//           uploadTask.on(
//             "state_changed",
//             (snapshot) => {
//               const progress =
//                 (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//               console.log("Upload is " + progress + "% done");

//               // switch (snapshot.state) {
//               //   case "paused":
//               //     console.log("Upload is paused");
//               //     break;
//               //   case "running":
//               //     console.log("Upload is running");
//               //     break;
//               // }
//             },
//             (error) => {
//               console.log("Error uploading image", error);
//               reject(error);
//             },
//             () => {
//               getDownloadURL(uploadTask.snapshot.ref)
//                 .then((downloadURL) => {
//                   uploadedImages.push({
//                     ...item,
//                     image: downloadURL,
//                   });
//                   resolve();
//                 })
//                 .catch((error) => {
//                   console.log("Error getting download URL", error);
//                   reject(error);
//                 });
//             },
//           );
//         });
//       }
//     }

//     return uploadedImages;
//   } catch (error) {
//     console.log("Error uploading images", error);
//     return [];
//   }
// }

// export async function deleteImage(images: any[]) {
//   const storage = getStorage(firebaseApp);

//   try {
//     for (const item of images) {
//       if (item.image) {
//         const imageRef = ref(storage, item.image);
//         await deleteObject(imageRef);
//       }
//     }
//   } catch (error) {
//     console.log("Error deleting images", error);
//   }
// }
