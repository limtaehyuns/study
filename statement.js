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
  let thisAmount = 0;

  switch (play.type) {
    case "tragedy": // 비극
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;
    case "comedy": // 희극
      thisAmount = 30000;
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
      break;
    default:
      throw new Error(`알 수 없는 장르: ${play.type}`);
  }

  return thisAmount;
}

function calculateVolumeCredits(perf, play) {
  let volumeCredits = Math.max(perf.audience - 30, 0);

  // 희극 관객 5명마다 추가 포인트를 제공한다.
  if (play.type === "comedy") {
    volumeCredits += Math.floor(perf.audience / 5);
  }

  return volumeCredits;
}

module.exports = { statement };
