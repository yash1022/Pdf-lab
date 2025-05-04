import admin from "firebase-admin";
import serviceAccount from "./key.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
 export const auth = admin.auth();