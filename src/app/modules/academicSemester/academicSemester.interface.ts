export type TSemesterName = 'Autumn' | 'Summer' | 'Fall';
export type TSemesterCode = '01' | '02' | '03';
export type TMonth =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export type TAcademicSemester = {
  name: TSemesterName;
  year: string;
  code: TSemesterCode;
  startMonth: TMonth;
  endMonth: TMonth;
};

export type TSemesterNameCodeMapper = {
  [key: string]: string;
};
