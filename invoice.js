function htmlInvoice(invoice) {
  const { customer, performances, totalAmount, volumeCredits } = invoice;

  return `
    <h1>${customer}님의 청구 내역</h1>
    <table>
      <tr>
        <th>장르명</th>
        <th>좌석 수</th>
        <th>공연료</th>
      </tr>
      ${performances
        .map((perf) => {
          const { playName, audience, amount } = perf;
          return `
            <tr>
              <td>${playName}</td>
              <td>${audience}</td>
              <td>${amount}</td>
            </tr>
          `;
        })
        .join("")}
    </table>
    <p>총액: <em>${totalAmount}</em></p>
    <p>적립 포인트: <em>${volumeCredits}</em></p>
  `;
}

module.exports = {
  htmlInvoice,
};
