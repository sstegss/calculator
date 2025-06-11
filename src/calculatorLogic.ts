const OPERATORS = "+-*/%";
//функция для вычисления выражения
export const solveExpression = (expression: string[], value: string) => {
  let exp = [...expression]; //чтоб не менять реактивный массив
  if (value !== "") {
    //добавление последнего числа в массив
    exp.push(value);
  }
  //если наше выражение оканчивается на оператор, то убираем его
  if (exp.length > 0 && OPERATORS.includes(exp[exp.length - 1])) {
    exp = exp.slice(0, -1);
  }
  //начало вычисления
  let answer = Number(exp[0]);
  for (let i = 1; i < exp.length; i += 2) {
    const currntOperator = exp[i]; //оператор всегда будет будет на четных позициях числах
    const nextValue = Number(exp[i + 1]); //а числа всегда будут на нечетных позициях
    switch (currntOperator) {
      case "+":
        answer += nextValue;
        break;
      case "-":
        answer -= nextValue;
        break;
      case "*":
        answer *= nextValue;
        break;
      case "%":
        answer %= nextValue;
        break;
      case "/":
        if (nextValue === 0) {
          //ошбика деления на ноль
          return "Error";
        }
        answer /= nextValue;
        break;
      default:
        return "Error";
    }
  }
  return String(answer);
};

//форматирует число к виду 1 234,56
const formaterNumber = (numStr: string) => {
  if (numStr === "" || numStr === "-") return numStr; //нам не нужно форматировать при отсуствии цифр в числе
  const [intPart, fracPart] = numStr.split(".");
  const intNum = Number(intPart);

  if (isNaN(intNum)) return numStr;

  let formated = intNum.toLocaleString("ru-RU"); // привычное разбитие по тысячам и сотням

  if (numStr.endsWith(".")) {
    //если пользователь только ввёл точку и ещё не успел записать дробную часть
    formated += ",";
  }
  if (fracPart !== undefined && fracPart !== "") {
    //добавление дробной части
    formated += "," + fracPart;
  }
  return formated;
};

//форматирует уже всё выражение
export const formatExpression = (expression: string[], value: string) => {
  let result = "";
  for (let i = 0; i < expression.length; i++) {
    //благодаря тому, что мы изменяем последний знак оператора при попытке добавления ещё одного,
    //то у нас есть гарантия, что каждый четный элемент в выражении является числом
    if (i % 2 === 0) {
      result += formaterNumber(expression[i]) + " ";
    } else {
      result += expression[i] + " ";
    }
  }
  result += formaterNumber(value);
  return result.trim();
};
