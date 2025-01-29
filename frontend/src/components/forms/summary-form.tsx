"use client";

import { useState } from "react";
import { toast } from "sonner";

import { createSummaryAction } from "@/data/actions/summary-actions";
import { generateSummaryService } from "@/data/services/summary-service";
import { extractYouTubeID, cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/custom/submit-button";

interface StrapiErrorsProps {
  message: string | null;
  name: string;
}

interface SummaryFormProps {
  quoteId?: string;
}

const INITIAL_STATE = {
  message: null,
  name: "",
};

export function SummaryForm({ quoteId }: SummaryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StrapiErrorsProps>(INITIAL_STATE);
  const [value, setValue] = useState<string>("");

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    toast.success("Submitting Form");
  
    const formData = new FormData(event.currentTarget);
    const emailText = formData.get("emailText") as string;
    const quoteId = formData.get("quoteId") as string;
  
    if (!emailText) {
      toast.error("Invalid email text");
      setLoading(false);
      setValue("");
      setError({
        ...INITIAL_STATE,
        message: "Invalid email text",
        name: "Invalid Email Text",
      });
      return;
    }
  
    toast.success("Email content submitted");

    const summaryResponseData = await generateSummaryService(quoteId, emailText);
    console.log(summaryResponseData, "Response from route handler");

    const summaryPayload = {
      data: {
        title: `Summary for quote: ${quoteId}`,
        quoteId,
        summary: summaryResponseData.data,
      },
    };
  
    const extractedData = JSON.parse(summaryResponseData.data);

    const quotePayload = {
      data: {
        quoteId,
        emailText,
        summary: extractedData.summary,
        supplier: extractedData.supplier,
        quote: extractedData.quote,
      },
    };

    const supplierPayload = {
      data: {
        contact: extractedData.supplier.contact,
        email: extractedData.supplier.email,
      },
    };

    try {
      await createSummaryAction(summaryPayload);
      // await createQuoteAction(quotePayload);
      // await createSupplierAction(supplierPayload);
      toast.success("Summary Created");
      // Reset form after successful creation
      setValue("");
      setError(INITIAL_STATE);
    } catch (error) {
      let errorMessage = "An unexpected error occurred while creating the summary";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error(errorMessage);
      setError({
        message: errorMessage,
        name: "Summary Error",
      });
      setLoading(false);
      return;
    }

    setLoading(false);
  }

  function clearError() {
    setError(INITIAL_STATE);
    if (error.message) setValue("");
  }

  const errorStyles = error.message
    ? "outline-1 outline outline-red-500 placeholder:text-red-700"
    : "";

  return (
    <div className="w-full max-w-[960px]">
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-4 items-center justify-center"
      >
        <Textarea
          name="emailText"
          placeholder={
            error.message ? error.message : "Paste the email text here"
          }
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onMouseDown={clearError}
          className={cn(
            "w-full focus:text-black focus-visible:ring-pink-500",
            errorStyles
          )}
          rows={10}
          required
        />
        <input type="hidden" name="quoteId" value={quoteId} />
        <SubmitButton
          text="Create Summary"
          loadingText="Creating Summary"
          loading={loading}
        />
      </form>
    </div>
  );
}
