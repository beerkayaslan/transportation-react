import { Suspense } from 'react';
import { useEffect } from "react";
import NProgress from "nprogress";

export const Progress = () => {
  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  });
  return (
    null
  );
};

const Loadable = (Component: any) => (props: any) => (
  <Suspense fallback={<Progress />}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;