// import React, { useState, useEffect } from 'react';
import { RouteProps, Navigate } from 'react-router-dom';
import { ax } from '../services/axios/axios';

export type ProtectedRouteProps = {
  authenticationPath: string;
  outlet: JSX.Element;
};

  const checkUserConnection = async () => {
    try {
	  const token = localStorage.getItem("token");

    const response = await ax.get("http://localhost:8080/users/me", {
      headers: {
      Authorization: `Bearer ${token}`,
      },
    });
        if (response.data.status === 401) {
          localStorage.setItem("isConnected", "no");
        } else {
          localStorage.setItem("isConnected", "yes");
        }  
      } catch (error) {
        localStorage.setItem("isConnected", "no");
      }
  };

export function ProtectedRoute({ authenticationPath, outlet }: ProtectedRouteProps & RouteProps) {
  checkUserConnection();
	const isConnected = localStorage.getItem("isConnected");
  // console.log("isConnected:", isConnected);
    if (isConnected === "yes") {
      // console.log("protectedRoute: connection ok");
      return outlet;
    } else {
      // console.log("protectedRoute: connection KO");
      return <Navigate to={{ pathname: authenticationPath }} />;
    }
}
