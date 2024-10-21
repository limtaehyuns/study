function statement(invoice, plays) {
  let totalAmount = 0; // 총 공연료
  let volumeCredits = 0; // 포인트
  let result = `청구 내역 (고객명: ${invoice.customer})\n`; // 청구 내역

  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = calculateAmount(perf, play);
    volumeCredits += calculateVolumeCredits(perf, play);

    result += `  ${play.name}: ${format(thisAmount / 100)} (${
      perf.audience
    }석)\n`;
    totalAmount += thisAmount;
  }

  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
}

function calculateAmount(perf, play) {
  const { type: playType } = play;

  if (playType === "tragedy") {
    let amount = 40000;
    if (perf.audience > 30) {
      amount += 1000 * (perf.audience - 30);
    }

    return amount;
  }

  if (playType === "comedy") {
    let amount = 30000;
    if (perf.audience > 20) {
      amount += 10000 + 500 * (perf.audience - 20);
    }

    amount += 300 * perf.audience;

    return amount;
  }

  if (playType === "history") {
    let amount = 10000; // 기본 가격
    amount += 1500 * perf.audience; // 1인당 1500원

    return amount;
  }

  throw new Error(`알 수 없는 장르: ${playType}`);
}

function calculateVolumeCredits(perf, play) {
  const { type: playType } = play;
  const { audience } = perf;

  let volumeCredits = Math.max(audience - 30, 0);

  if (playType === "comedy") {
    volumeCredits += Math.floor(audience / 5);
  }

  if (playType === "history" && audience > 20) {
    volumeCredits += 10;
  }

  return volumeCredits;
}

module.exports = { statement };
