export const filterString = (val: string): string => {
  if (val === undefined) {
    val = '';
  }
  val = String(val).replace('`','');
  val = String(val).replace('%','');
  val = String(val).replace('^','');
  val = String(val).replace('[','');
  val = String(val).replace(']','');
  val = String(val).replace('|','');
  val = String(val).replace('\\','');
  return val;
};
