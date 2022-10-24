export const filterString = (val: string): string => {
  val = String(val).replace('%','');
  val = String(val).replace('^','');
  val = String(val).replace('[','');
  val = String(val).replace(']','');
  val = String(val).replace('|','');
  val = String(val).replace('\\','');
  return val;
};
