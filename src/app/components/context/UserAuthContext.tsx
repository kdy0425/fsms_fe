import { createContext } from "react";

export interface UserAuthInfo {
  iss: string;
  userNm: string;
  auths: string[];
  roles: string[];
  lgnId: string;
  locgovCd: string;
  iat: number;
  exp: number;  
}

interface UserAuthContextType {
  authInfo: UserAuthInfo | {};
  setUserAuthInfo: (auth:any) => void;
  resetAuthInfo: () => void;
}

const UserAuthContext = createContext<UserAuthContextType>(
  {
    authInfo: {},
    setUserAuthInfo: (auth:any) => {},
    resetAuthInfo: () => {}
  }
)

export default UserAuthContext;