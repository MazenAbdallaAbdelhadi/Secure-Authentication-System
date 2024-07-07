import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentToken } from "@/redux/auth/authSlice";
import { useRefresh } from "./query/auth";
import { privateAxios } from "./axios";

const usePrivateAxios = () => {
  const refresh = useRefresh();
  const auth = useAppSelector(selectCurrentToken);

  useEffect(() => {
    // before sending the request set access token in headers
    const requestInterceptor = privateAxios.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // if response status code is 401 then send refresh token to get new access token
    const responseInterceptor = privateAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { response, config } = error;
        const originalRequest = config;



        // if status is 401 and the request is first time then send refresh token
        if (response?.status === 401 && !response?._sent) {
          // set _sent flag to true to prevent repeating the request infinitely
          response._sent = true;

          // await refresh request
          await refresh();

          // retry the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${auth}`;
          return privateAxios(originalRequest);
        }

        return Promise.reject(error);
      }
    );

    // eject the interceptors
    return () => {
      privateAxios.interceptors.request.eject(requestInterceptor);
      privateAxios.interceptors.response.eject(responseInterceptor);
    };
  }, [auth, refresh]);

  return privateAxios;
};

export default usePrivateAxios;
