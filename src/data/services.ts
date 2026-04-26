export type Service = {
  id: string;
  title: string;
  description: string;
  duration: string;
  price?: string;
};

export const services: Service[] = [
  {
    id: "one-time",
    title: "Разовая консультация",
    description:
      "Точечный разбор текущего питания и режима с фокусом на ваши цели, привычки и самочувствие. Подходит, если хотите получить ясный план первых шагов.",
    duration: "60-75 минут",
    price: "6 500 ₽",
  },
  {
    id: "ongoing",
    title: "Сопровождение",
    description:
      "Системная работа на 4-6 недель: корректировка рациона, поддержка в процессе изменений и адаптация рекомендаций под реальный ритм жизни.",
    duration: "4-6 недель",
    price: "от 18 000 ₽ за курс • точная сумма на вводном звонке",
  },
];
