async function runRaceConditionTest() {
  const url = "http://localhost:3000/api/appointments";
  const data = {
    userId: "test_user",
    startTime: "2026-12-01T10:00:00Z",
    endTime: "2026-12-01T11:00:00Z",
  };

  const headers = { "Content-Type": "application/json" };

  console.log("🚀 إرسال طلبين في نفس اللحظة تماماً...");

  // Promise.all تجعل الطلبين ينطلقان معاً في نفس الجزء من الثانية
  const [response1, response2] = await Promise.all([
    fetch(url, { method: "POST", headers, body: JSON.stringify(data) }),
    fetch(url, { method: "POST", headers, body: JSON.stringify(data) }),
  ]);

  const result1 = await response1.json();
  const result2 = await response2.json();

  console.log("\nنطاق الاستجابة الأول (Status):", response1.status);
  console.log("النتيجة:", result1);

  console.log("\nنطاق الاستجابة الثاني (Status):", response2.status);
  console.log("النتيجة:", result2);
}

runRaceConditionTest();
