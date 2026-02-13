export const formatINR = (paise:number) => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(paise/100);
