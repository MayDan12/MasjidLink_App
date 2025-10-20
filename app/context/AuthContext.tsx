// import { auth, db } from "@/firebase/firebaseConfig";
// import { checkUserRole } from "@/services/checkrole";
// import {
//   User,
//   createUserWithEmailAndPassword,
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   signOut,
// } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import {
//   ReactNode,
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// type UserRole = "imam" | "user" | null;

// interface FormData {
//   fullName: string;
//   email: string;
//   password: string;
//   masjidName?: string;
//   masjidWebsite?: string;
//   role?: UserRole;
// }

// interface AuthContextType {
//   user: User | null;
//   role: UserRole;
//   loading: boolean; // App-wide loading (user + role)
//   authLoading: boolean; // For signIn / signUp buttons
//   error: string | null;
//   signIn: (email: string, password: string) => Promise<void>;
//   signUp: (formData: FormData) => Promise<void>;
//   logOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [role, setRole] = useState<UserRole>(null);
//   const [loading, setLoading] = useState(true); // App-level loading
//   const [authLoading, setAuthLoading] = useState(false); // Auth process loading
//   const [error, setError] = useState<string | null>(null);

//   // ✅ Step 1: Listen for Firebase Auth changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);

//       if (currentUser) {
//         try {
//           const userRole = await checkUserRole(currentUser.uid);
//           setRole(userRole as UserRole);
//         } catch (err) {
//           console.error("❌ Failed to fetch user role:", err);
//         }
//       } else {
//         setRole(null);
//       }

//       setLoading(false); // ✅ always stop loading once we’ve checked auth
//     });

//     return unsubscribe;
//   }, []);

//   // useEffect(() => {
//   //   console.log("👤 Auth state changed:", user ? user.email : "no user");
//   // }, [user]);
//   // ✅ Sign In
//   const signIn = async (email: string, password: string) => {
//     setError(null);
//     setAuthLoading(true);
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//     } catch (err: any) {
//       console.error("❌ Sign-in error:", err);
//       setError(err.message);
//       throw err;
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   // ✅ Sign Up
//   const signUp = async (formData: FormData) => {
//     setError(null);
//     setAuthLoading(true);
//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         formData.email,
//         formData.password
//       );

//       const newUser = userCredential.user;

//       await setDoc(doc(db, "users", newUser.uid), {
//         fullName: formData.fullName,
//         email: formData.email,
//         masjidName: formData.masjidName || null,
//         masjidWebsite: formData.masjidWebsite || null,
//         role: formData.role || "user",
//         createdAt: new Date().toISOString(),
//       });

//       setRole(formData.role || "user");
//       setUser(newUser);
//     } catch (err: any) {
//       console.error("❌ Sign-up error:", err);
//       setError(err.message);
//       throw err;
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   // ✅ Log Out
//   const logOut = async () => {
//     setError(null);
//     try {
//       await signOut(auth);
//       setUser(null);
//       setRole(null);
//     } catch (err: any) {
//       console.error("❌ Logout error:", err);
//       setError(err.message);
//       throw err;
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         role,
//         loading,
//         authLoading,
//         error,
//         signIn,
//         signUp,
//         logOut,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };

// export default AuthProvider;

import { auth, db } from "@/firebase/firebaseConfig"; // Adjust path if needed
import { checkUserRole } from "@/services/checkrole";
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (formData: FormData) => Promise<void>;
  logOut: () => Promise<void>;
  role: UserRole;
  roleLoading: boolean;
}

interface FormData {
  fullName: string;
  email: string;
  password: string;
  masjidName?: string;
  masjidWebsite?: string;
  role?: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type UserRole = "imam" | "user" | null;
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    setRoleLoading(true);

    let isMounted = true;
    const fetchRole = async () => {
      try {
        const userRole = await checkUserRole(user.uid);
        if (isMounted) {
          setRole(userRole as UserRole);
        }
      } catch (err) {
        console.error("❌ Failed to fetch user role:", err);
        if (isMounted) {
          setRole(null); // Clear role on error
        }
      } finally {
        if (isMounted) {
          setRoleLoading(false);
        }
      }
    };

    fetchRole();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const signIn = async (email: string, password: string) => {
    setError(null);
    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  // const signUp = async (email: string, password: string) => {
  //   setError(null);
  //   try {
  //     await createUserWithEmailAndPassword(auth, email, password);
  //   } catch (err: any) {
  //     setError(err.message);
  //     throw err;
  //   }
  // };

  const signUp = async (formData: FormData) => {
    setError(null);

    try {
      // 1. Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // 2. Save extra details in Firestore `users` collection
      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        masjidName: formData.masjidName || null,
        masjidWebsite: formData.masjidWebsite || null,
        createdAt: new Date().toISOString(),
        role: formData.role,
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logOut = async () => {
    setError(null);
    try {
      await signOut(auth);
      setRole(null); // Reset role on logout
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        logOut,
        role,
        roleLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;

// import { auth, db } from "@/firebase/firebaseConfig";
// import { checkUserRole } from "@/services/checkrole";
// import {
//   User,
//   createUserWithEmailAndPassword,
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   signOut,
// } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import {
//   ReactNode,
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   authLoading: boolean;
//   error: string | null;
//   signIn: (email: string, password: string) => Promise<void>;
//   signUp: (formData: FormData) => Promise<void>;
//   logOut: () => Promise<void>;
//   role: UserRole;
// }

// interface FormData {
//   fullName: string;
//   email: string;
//   password: string;
//   masjidName?: string;
//   masjidWebsite?: string;
//   role?: UserRole;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// type UserRole = "imam" | "user" | null;

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [authLoading, setAuthLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [role, setRole] = useState<UserRole>(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       if (!currentUser) {
//         setLoading(false);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (!user?.uid) {
//       setLoading(false);
//       return;
//     }

//     const fetchRole = async () => {
//       try {
//         setLoading(true);
//         const userRole = await checkUserRole(user.uid);
//         setRole(userRole as UserRole);
//       } catch (err) {
//         console.error("❌ Failed to fetch user role:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRole();
//   }, [user]);

//   const signIn = async (email: string, password: string) => {
//     setError(null);
//     setAuthLoading(true);
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//     } catch (err: any) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   const signUp = async (formData: FormData) => {
//     setError(null);
//     setAuthLoading(true);

//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         formData.email,
//         formData.password
//       );

//       const user = userCredential.user;

//       await setDoc(doc(db, "users", user.uid), {
//         fullName: formData.fullName,
//         email: formData.email,
//         masjidName: formData.masjidName || null,
//         masjidWebsite: formData.masjidWebsite || null,
//         createdAt: new Date().toISOString(),
//         role: formData.role,
//       });
//     } catch (err: any) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   const logOut = async () => {
//     setError(null);
//     try {
//       await signOut(auth);
//       setRole(null);
//     } catch (err: any) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         authLoading,
//         error,
//         signIn,
//         signUp,
//         logOut,
//         role,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export default AuthProvider;
