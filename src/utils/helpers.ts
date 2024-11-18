import * as moment from 'moment';
import * as bcrypt from 'bcrypt';

export function mergeErrors(errorsArray) {
  return errorsArray.reduce((acc, error) => {
    const key = Object.keys(error)[0];
    acc[key] = error[key];
    return acc;
  }, {});
}

export const generateNumericCode = () => {
  return Math.floor(10000 + Math.random() * 90000);
};

export const getTimeDifference = (time: Date) => {
  const now = moment(new Date());
  const inputTime = moment(time);

  const duration = moment.duration(now.diff(inputTime));

  const years = Math.abs(duration.years());
  const months = Math.abs(duration.months());
  const days = Math.abs(duration.days());
  const hours = Math.abs(duration.hours());
  const minutes = Math.abs(duration.minutes());
  const seconds = Math.abs(duration.seconds());
  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
  };
};

export const generatePasswordHash = async (
  password: string,
): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const generateOrderId = (prefix: string = "ORD"): string => {
  const timestamp = Math.floor(Date.now() / 1000).toString().slice(0, 7);
  const randomString = Math.floor(100 + Math.random() * 900).toString();
  return `${prefix}-${timestamp}-${randomString}`;
}