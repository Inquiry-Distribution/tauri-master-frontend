// navigate.ts
let navigateFn: any;

export const setNavigate = (nav: any) => {
  navigateFn = nav;
};

export const navigateTo = (path: string) => {
  if (navigateFn) navigateFn(path);
};
