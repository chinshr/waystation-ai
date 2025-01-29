export async function generateSummaryService(quoteId: string, emailText: string) {
  const url = "/api/summarize";
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ quoteId: quoteId, emailText: emailText }),
    });
    console.log("#########################");
    console.log(response);
    console.log("#########################");
    return await response.json();
  } catch (error) {
    console.error("Failed to generate summary:", error);
    if (error instanceof Error) return { error: { message: error.message } };
    return { data: null, error: { message: "Unknown error" } };
  }
}