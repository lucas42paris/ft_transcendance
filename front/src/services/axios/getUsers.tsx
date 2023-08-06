import { ax } from '../../services/axios/axios'
// import { useEffect, useState } from "react";
// import { UserInfos } from "../interfaces/userInfos.interface";

// export function GetUserInfos() {

//     // const [userInfos, setUserInfos] = useState<UserInfos | null>(null);
    
//     const token = localStorage.getItem("token");
    
//     useEffect(() => {
//         const getUsers = async () => {
//             try {
//                 const response = await ax.get("http://localhost:8080/users/me", {
//                     headers: {
//                                 Authorization: `Bearer ${token}`,
//                             },
//                 });
                
//                 // setUserInfos(response.data);
// 	            // console.log("userInfos?.name", userInfos?.name);
//                 return (response.data);
//             } catch (error) {
//                 console.error("Failed to fetch users.");
//             }
//         };
//         getUsers();
//     }, [token]);

// }