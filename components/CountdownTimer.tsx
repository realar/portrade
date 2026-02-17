'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

const TimeBlock = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center bg-primary-50 px-3 py-2 rounded-lg border border-primary-100 min-w-[50px]">
    <span className="text-xl font-black text-primary-900 leading-none">
      {value < 10 ? `0${value}` : value}
    </span>
    <span className="text-[10px] text-primary-600 font-bold uppercase mt-1">{label}</span>
  </div>
);

const Separator = () => (
  <span className="text-gray-300 font-bold mx-1">:</span>
);

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
         setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center mb-8">
      <TimeBlock value={timeLeft.days} label="дней" />
      <Separator />
      <TimeBlock value={timeLeft.hours} label="часов" />
      <Separator />
      <TimeBlock value={timeLeft.minutes} label="минут" />
      <Separator />
      <TimeBlock value={timeLeft.seconds} label="секунд" />
    </div>
  );
}
