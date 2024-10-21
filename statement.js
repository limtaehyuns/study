function statement(invoice, plays) {
  let totalAmount = 0; // 총 공연료
  let volumeCredits = 0; // 포인트

  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  const { performances } = invoice;
  const preformanceResult = performances.map((perf) => {
    const play = plays[perf.playID];
    let thisAmount = calculateAmount(perf, play);
    volumeCredits += calculateVolumeCredits(perf, play);
    totalAmount += thisAmount;

    return {
      playName: play.name,
      amount: thisAmount,
      audience: perf.audience,
    };
  });

  return {
    customer: invoice.customer,
    performances: preformanceResult,
    totalAmount: format(totalAmount / 100),
    volumeCredits: format(volumeCredits),
  };
}

// 상수 정의
const TRAGEDY_BASE_PRICE = 40000; // 비극 기본 가
const COMEDY_BASE_PRICE = 30000; // 희극 기본 가
const HISTORY_BASE_PRICE = 10000; // 사극 기본 가
const TRAGEDY_EXTRA_PRICE_PER_AUDIENCE = 1000; // 비극 추가 가
const COMEDY_EXTRA_PRICE_PER_AUDIENCE = 500; // 희극 추가 가
const COMEDY_FLAT_SURCHARGE = 10000; // 희극 고정 요금
const COMEDY_EXTRA_CHARGE_PER_PERSON = 300; // 희극 인당 추가 요금
const HISTORY_EXTRA_CHARGE_PER_PERSON = 1500; // 사극 인당 추가 요금
const BONUS_CREDITS_THRESHOLD = 30; // 추가 포인트 임계값
const HISTORY_BONUS_CREDITS_THRESHOLD = 20; // 사극 추가 포인트 임계값
const HISTORY_BONUS_CREDITS = 10; // 사극 추가 포인트
const COMEDY_EXTRA_CREDITS_DIVISOR = 5; // 희극 추가 포인트 나누는 수

// 금액 계산 함수
function calculateAmount(perf, play) {
  const { type: playType } = play;
  const { audience } = perf;

  switch (playType) {
    case "tragedy": {
      let amount = TRAGEDY_BASE_PRICE;
      if (audience > BONUS_CREDITS_THRESHOLD) {
        amount +=
          TRAGEDY_EXTRA_PRICE_PER_AUDIENCE *
          (audience - BONUS_CREDITS_THRESHOLD);
      }
      return amount;
    }

    case "comedy": {
      let amount = COMEDY_BASE_PRICE;
      if (audience > 20) {
        amount +=
          COMEDY_FLAT_SURCHARGE +
          COMEDY_EXTRA_PRICE_PER_AUDIENCE * (audience - 20);
      }
      amount += COMEDY_EXTRA_CHARGE_PER_PERSON * audience;
      return amount;
    }

    case "history": {
      let amount = HISTORY_BASE_PRICE;
      amount += HISTORY_EXTRA_CHARGE_PER_PERSON * audience;
      return amount;
    }

    default:
      throw new Error(`알 수 없는 장르: ${playType}`);
  }
}

// 포인트 계산 함수
function calculateVolumeCredits(perf, play) {
  const { type: playType } = play;
  const { audience } = perf;

  let volumeCredits = Math.max(audience - BONUS_CREDITS_THRESHOLD, 0);

  if (playType === "comedy") {
    volumeCredits += Math.floor(audience / COMEDY_EXTRA_CREDITS_DIVISOR);
  }

  if (playType === "history" && audience > HISTORY_BONUS_CREDITS_THRESHOLD) {
    volumeCredits += HISTORY_BONUS_CREDITS;
  }

  return volumeCredits;
}

module.exports = { statement };
