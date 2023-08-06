import { createContext, useContext, useState, ReactNode } from "react";

/************************* Not used anymore ************************/

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void; // utile?
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
}


interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  // const navigate = useNavigate();

  // console.log("setting connected to FALSE (Auth context)");
  const [isConnected, setIsConnected] = useState(false);

  // console.log("token", token);
  // console.log("isConnected", isConnected);
  
  return (
    <AuthContext.Provider value={{ token, setToken, isConnected, setIsConnected }}>
      {children}
    </AuthContext.Provider>
  );
};

const AuthContext = createContext<AuthContextType | null>({
  token: null,
  setToken: () => {},
  isConnected: false,
  setIsConnected: () => {},
});

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
